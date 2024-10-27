import React from 'react'

export default function DisplayPage(props) {
    const {handleResetAudio, file, audioStream, handleFormSubmission } = props



  return (
    <div>
        <main>
            <h1 className='font-bold'>Your file</h1>
            <h3>Name:</h3>
            <p>{file? file.name : 'Custom audio'}</p>
        </main>
        <div>
            <button onClick={handleResetAudio} className='text-center border border-black rounded-lg p-3'>Reset</button>
            <button onClick={handleFormSubmission} className='text-center border border-black rounded-lg p-3'>Transcribe</button>
        </div>
    </div>
  )
}
