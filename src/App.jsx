import { useState } from 'react';
import Header from './components/Header';
import Homepage from './Homepage';



function App() {
  const [audioStream, setAudioStream] = useState();

function handleResetAudio() {
  setAudioStream(null)
}

  return (
    
      <div>
        <Header />
        <Homepage setAudioStream={setAudioStream}/>
        </div>
  )
}

export default App
