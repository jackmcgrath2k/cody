import { useState, useRef, useEffect } from 'react';
import Header from './components/Header';
import Homepage from './components/Homepage';


function App() {

  return (
      //If theres an output, render NoteInfo, if not check if loading exists, render Transcription, if not chekc if audio available, if yes DisplayPage, display Homepage if none before are true
      <div>
        <Header />

         <Homepage />
        
        </div>
  )
}

export default App
