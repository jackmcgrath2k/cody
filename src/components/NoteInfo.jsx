import React, { useState } from 'react'
import Transcript from './Transcript';
import Translation from './Translation';

export default function NoteInfo() {
const [tab, setTab] = useState('transcription');

  return (
    <div>
    <main>
        <h1 className='font-bold'>Your transcript</h1>
        <div>
            <button onClick={() => setTab('transcription')} className={'text-center border border-black rounded-lg p-3 ' + (tab === 'transcription' ? 'bg-black text-white' : 'bg-blue-500 text-black')}>Transcription</button>
            <button onClick={() => setTab('translation')} className={'text-center border border-black rounded-lg p-3 ' + (tab === 'translation' ? 'bg-black text-white' : 'bg-blue-500 text-black')}>Translation</button>
        </div>
        {tab === 'transcription' ? (
            <Transcript />
        ): (
            <Translation />
        )}
    </main>
</div>
  )
}
