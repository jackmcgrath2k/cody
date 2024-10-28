from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from faster_whisper import WhisperModel
import threading # could be useful for asynchronous rec and transcribing
import logging
import numpy as np # use for raw audio data
import pyaudio
import time
import os

# set up fastapi and allow front end requests
app = FastAPI()

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React apps origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# logging setup
logging.basicConfig(level=logging.INFO)

# small or medium seem to work best 
model_size = "small.en"  # or "small"
model = WhisperModel(model_size, device="cpu", compute_type="int8")


p = pyaudio.PyAudio()
stream = None 
is_recording = False
recording_thread = None

# transcription recorded
accumulated_transcription = ""

# transcribes
def transcribe_chunk(model, audio_data):
    audio_array = np.frombuffer(audio_data, dtype=np.int16)
    logging.info(f"Captured audio data size: {len(audio_array)}")
    audio_array = audio_array.astype(np.float32) / np.max(np.abs(audio_array))
    segments, info = model.transcribe(audio_array, beam_size=5)
    logging.info(f"Detected language: '{info.language}' with probability: {info.language_probability}")
    transcription = " ".join(segment.text for segment in segments)
    return transcription.strip() # get rd of any whitespaces

#records
def record_chunk(stream, chunk_length=3): #chunk every 3 seconds
    frames = []
    for _ in range(0, int(16000 / 1024 * chunk_length)):
        data = stream.read(1024)
        frames.append(data)
    return b''.join(frames)

def main():
    global is_recording, stream, p, accumulated_transcription
    stream = p.open(format=pyaudio.paInt16, channels=1, rate=16000, input=True, frames_per_buffer=1024)

    try:
        while is_recording:
            audio_data = record_chunk(stream)
            transcription = transcribe_chunk(model, audio_data)
            logging.info(f"Transcription: {transcription}")

            if transcription:
                print(transcription)
            accumulated_transcription += transcription + " "
            time.sleep(0.1)  # adds delay of 0.1s to reduce cpu usage

    except Exception as e:
        logging.error(f"Error in recording: {e}")

    finally:
        stream.stop_stream()
        stream.close()

# start rec
@app.post("/start")
def start_recording():
    global is_recording, recording_thread, accumulated_transcription
    if is_recording:
        return JSONResponse(content={"message": "Recording already in progress"}, status_code=400)

    is_recording = True
    accumulated_transcription = ""  # Reset transcription for new session
    recording_thread = threading.Thread(target=main)
    recording_thread.start()
    return JSONResponse(content={"message": "Recording started"}, status_code=200)

# stop rec
@app.post("/stop")
def stop_recording():
    global is_recording, recording_thread, accumulated_transcription
    if not is_recording:
        return JSONResponse(content={"message": "Recording is not active"}, status_code=400)

    # Stop the recording
    is_recording = False
    recording_thread.join()  # Wait for the thread to finish

    # Save and return the transcription
    save_transcription(accumulated_transcription)
    response = accumulated_transcription  # Store transcription in response before resetting
    accumulated_transcription = ""  # Reset after saving
    return JSONResponse(content={"message": "Recording stopped", "transcription": response}, status_code=200)

# file where transcriptions will be saved
TRANSCRIPTION_FILE = "transcriptions.txt"

# save transcription to a text file
def save_transcription(transcription: str):
    try:
        with open(TRANSCRIPTION_FILE, "a") as file:
            file.write(transcription + "\n")
        logging.info("Transcription saved successfully.")
    except Exception as e:
        logging.error(f"Failed to save transcription: {e}")

# Endpoint to receive transcriptions
@app.post("/transcribe")
async def transcribe(transcription: str):
    try:
        save_transcription(transcription)
        return {"message": "Transcription saved successfully!"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save transcription: {e}")

# Endpoint to retrieve all transcriptions
@app.get("/transcriptions")
async def get_transcriptions():
    if not os.path.exists(TRANSCRIPTION_FILE):
        return {"transcriptions": []}  # Return an empty list if the file does not exist

    with open(TRANSCRIPTION_FILE, "r") as file:
        transcriptions = file.readlines()
    
    # Strip newline characters and return
    return {"transcriptions": [t.strip() for t in transcriptions]}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
