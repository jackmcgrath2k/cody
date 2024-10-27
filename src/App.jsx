import { useState, useRef, useEffect } from 'react';
import Header from './components/Header';
import Homepage from './components/Homepage';
import DisplayPage from './components/DisplayPage';
import NoteInfo from './components/NoteInfo';
import Transcription from './components/Transcription';


function App() {
  const [file, setFile] = useState(null);
  const [audioStream, setAudioStream] = useState(null);
  const [output, setOutput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [finished, setFinished] = useState(false);
  const [downloading, setDownloading] = useState(false);

const isAudioAvailable = file || audioStream

function handleResetAudio() {
  setAudioStream(null)
}





  return (
      //If theres an output, render NoteInfo, if not check if loading exists, render Transcription, if not chekc if audio available, if yes DisplayPage, display Homepage if none before are true
      <div>
        <Header />
        {output ? (<NoteInfo />) 
        : 
        loading ? (<Transcription/>) 
        : 
        isAudioAvailable ? (<DisplayPage handleFormSubmission={handleFormSubmission} handleResetAudio={handleResetAudio} file={file} audioStream={audioStream} />)
        : 
         (<Homepage setFile={setFile} setAudioStream={setAudioStream}/>)}
        
        </div>
  )
}

export default App
