import React, { useState, useEffect } from 'react';
import ClearSharpIcon from '@mui/icons-material/ClearSharp';
import EditSharpIcon from '@mui/icons-material/EditSharp';
import FolderSharedSharpIcon from '@mui/icons-material/FolderSharedSharp';

export default function Homepage() {
  const [isRecording, setIsRecording] = useState(false); // Tracks recording state
  const [transcription, setTranscription] = useState(""); // Stores latest transcription
  const [transcriptions, setTranscriptions] = useState([]); // Stores all transcriptions

  // Start recording
  const startRecording = async () => {
    try {
      const response = await fetch("http://localhost:8000/start", { method: "POST" });
      const data = await response.json();
      if (response.ok) {
        setIsRecording(true);
        console.log(data.message); // "Recording started"
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Failed to start recording:", error);
    }
  };

  // Stop recording
  const stopRecording = async () => {
    try {
      const response = await fetch("http://localhost:8000/stop", { method: "POST" });
      const data = await response.json();
      if (response.ok) {
        setIsRecording(false);
        setTranscription(data.transcription); // update transcription with the latest one
        console.log(data.message); // "Recording stopped"
        // fetch all transcriptions after stopping recording
        fetchTranscriptions();
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Failed to stop recording:", error);
    }
  };

  // Fetch all transcriptions
  const fetchTranscriptions = async () => {
    try {
      const response = await fetch('http://localhost:8000/transcriptions');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log(data); // log fetched data
      setTranscriptions(data.transcriptions || []); 
    } catch (error) {
      console.error('Error fetching transcriptions:', error);
    }
  };

  useEffect(() => {
    fetchTranscriptions(); // fetch transcripts
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Real-Time Transcription</h1>
      <button onClick={startRecording} disabled={isRecording} style={{ padding: "10px 20px", margin: "10px" }}>
        Start Recording
      </button>
      <button onClick={stopRecording} disabled={!isRecording} style={{ padding: "10px 20px", margin: "10px" }}>
        Stop Recording
      </button>

      <div style={{ marginTop: "30px", textAlign: "left", maxWidth: "600px", margin: "0 auto" }}>
        <h2>Latest Transcription:</h2>
        <p>{transcription ? transcription : "No transcription available yet."}</p>
      </div>

      <div style={{ marginTop: "30px", textAlign: "left", maxWidth: "600px", margin: "0 auto" }}>
        <h2>All Transcriptions:</h2>
        <ul>
          {transcriptions.length > 0 ? (
            transcriptions.map((t) => (
              <li key={t.id}>
                <p>{t.text}</p>
                <p className='text-gray-400 font-light'>{t.timestamp}</p>
              </li>
            ))
          ) : (
            
<div className="block max-w-xs bg-white border border-black">
<div className="w-full bg-black text-white font-bold pb-1 text-end  flex items-center justify-between">
<p className='text-white font-black text-start p-1 text-xs'>
    Cody
  </p>
  <div className="flex items-center space-x-2 pr-1">
<FolderSharedSharpIcon fontSize="xs"/>
<EditSharpIcon fontSize="xs"/>
<ClearSharpIcon fontSize="xs"/>
</div>
  </div>
<p className="m-2 text-black tracking-tight">This is really, really cool and I'm really excited to design a UI for this.</p>
<div><p className='text-gray-400 font-light text-end px-1 text-xs'>2024-10-28 21:11</p></div>
</div>

          )}
        </ul>
      </div>
    </div>
  );
}
