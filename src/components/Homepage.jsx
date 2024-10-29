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
      <button onClick={startRecording} disabled={isRecording} style={{ padding: "10px 20px", margin: "10px" }}>
        Start Recording
      </button>
      <button onClick={stopRecording} disabled={!isRecording} style={{ padding: "10px 20px", margin: "10px" }}>
        Stop Recording
      </button>

        <h1 className='font-light'>All Transcriptions:</h1>
        <div className="flex justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-10 gap-y-6 p-4 relative">
          {transcriptions.length > 0 ? (
            transcriptions.map((t) => (
              <div key={t.id} className="flex flex-col justify-center">
                {/* card design */}
                  <div className="block max-w-xs bg-white border border-black min-h-[150px] min-w-[150px] md:min-h-[200px] md:min-w-[200px] lg:min-h-[250px] lg:min-w-[250px] relative">
                  <div className="w-full bg-black text-white font-bold pb-1 text-end  flex items-center justify-between">
                  <p className='text-white font-black text-start p-1 text-xs'>
                      Cody
                    </p>
                    <div className="flex items-center space-x-2 pr-1">
                  <FolderSharedSharpIcon fontSize="xs"/> {/* share transcript with friend  - different color for friends scripts? */}
                  <EditSharpIcon fontSize="xs"/>  {/* edit transcript */}
                  <ClearSharpIcon fontSize="xs"/> {/* delete transcript - add a warning popup */}
                  </div>
                    </div>
                    <div className='text-left p-1'>
                  <p className="m-2 text-black tracking-tight font-normal">{t.text}</p>
                 
                    <p className='text-gray-400 font-light text-end px-1 text-xs absolute bottom-1 right-1'>{t.timestamp}</p></div>
                  </div>
              </div>
            
            ))
          ) : (
            
            <h1 className='text-3xl tracking-tight font-bold'>No transcriptions are available.</h1>

          )}
        </div>
        </div>
    </div>
  );
}
