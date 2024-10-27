from fastapi import FastAPI
from fastapi.responses import JSONResponse
from faster_whisper import WhisperModel
import threading
import logging
import numpy as np
import pyaudio
import time
import os

app = FastAPI()

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React app's origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Set up logging
logging.basicConfig(level=logging.INFO)


# Initialize model once
model_size = "small.en"  # or "small"
model = WhisperModel(model_size, device="cpu", compute_type="int8")

# Initialize PyAudio and control flags
p = pyaudio.PyAudio()
stream = None
is_recording = False
recording_thread = None

def transcribe_chunk(model, audio_data):
    audio_array = np.frombuffer(audio_data, dtype=np.int16)
    logging.info(f"Captured audio data size: {len(audio_array)}")
    audio_array = audio_array.astype(np.float32) / np.max(np.abs(audio_array))
    segments, info = model.transcribe(audio_array, beam_size=5)
    logging.info(f"Detected language: '{info.language}' with probability: {info.language_probability}")
    transcription = " ".join(segment.text for segment in segments)
    return transcription.strip()

def record_chunk(stream, chunk_length=10):
    frames = []
    for _ in range(0, int(16000 / 1024 * chunk_length)):
        data = stream.read(1024)
        frames.append(data)
    return b''.join(frames)

def main():
    global is_recording, stream, p
    stream = p.open(format=pyaudio.paInt16, channels=1, rate=16000, input=True, frames_per_buffer=1024)
    accumulated_transcription = ""

    try:
        while is_recording:
            audio_data = record_chunk(stream)
            transcription = transcribe_chunk(model, audio_data)
            logging.info(f"Transcription: {transcription}")

            if transcription:
                print(transcription)
            accumulated_transcription += transcription + " "
            time.sleep(0.1)  # To avoid 100% CPU usage in loop

    except Exception as e:
        logging.error(f"Error in recording: {e}")

    finally:
        stream.stop_stream()
        stream.close()
        return accumulated_transcription

@app.post("/start")
def start_recording():
    global is_recording, recording_thread
    if is_recording:
        return JSONResponse(content={"message": "Recording already in progress"}, status_code=400)

    is_recording = True
    recording_thread = threading.Thread(target=main)
    recording_thread.start()
    return JSONResponse(content={"message": "Recording started"}, status_code=200)

@app.post("/stop")
def stop_recording():
    global is_recording, recording_thread
    if not is_recording:
        return JSONResponse(content={"message": "Recording is not active"}, status_code=400)

    # Save the transcription before stopping
    transcription = main()  # Capture transcription from the main recording function
    save_transcription(transcription)  # Save the transcription to the file
    is_recording = False
    recording_thread.join()  # Wait for the thread to finish
    return JSONResponse(content={"message": "Recording stopped", "transcription": transcription}, status_code=200)

# Define the file where transcriptions will be saved
TRANSCRIPTION_FILE = "transcriptions.txt"

# Function to save transcription to a text file
def save_transcription(transcription: str):
    with open(TRANSCRIPTION_FILE, "a") as file:
        file.write(transcription + "\n")

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
    uvicorn.run(app, host="0.0.0.0", port=5000)
