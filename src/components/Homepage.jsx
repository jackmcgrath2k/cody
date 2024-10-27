import React, { useState, useEffect } from 'react';

export default function Homepage(props) {
  const { setAudioStream, setFile } = props;
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
        setTranscription(data.transcription); // Update transcription with the latest one
        console.log(data.message); // "Recording stopped"
        // Fetch all transcriptions after stopping recording
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
      console.log(data); // Debug: Log the fetched data
      setTranscriptions(data.transcriptions || []); // Ensure this matches your API's response structure
    } catch (error) {
      console.error('Error fetching transcriptions:', error);
    }
  };

  useEffect(() => {
    fetchTranscriptions(); // Fetch existing transcriptions on component mount
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
            transcriptions.map((t, index) => (
              <li key={index}>{t}</li>
            ))
          ) : (
            <li>No transcriptions available.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
