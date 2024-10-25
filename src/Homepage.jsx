import React, {useState, useEffect, useRef} from 'react'
import MicIcon from '@mui/icons-material/Mic';


export default function Homepage(props) {
  const { setAudioStream } = props

  const [recordingStatus, setRecordingStatus] = useState('inactive')
  const [audioChunks, setAudioChunks] = useState([])
  const [duration, setDuration] = useState(0)

  const mediaRecorder = useRef(null)

  const mimeType = 'audio/webm'

  //Start recording
  async function startRecording() {
    let tempStream

    console.log('Start recording')

    //user micorphone access, no video
    try {
      const streamData = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false
      })
      tempStream=streamData
    } 
    
    catch (err) {
      console.log(err.message)
      return
    }

    setRecordingStatus('recording')
    //make new media recorder instance using the stream
    const media = new MediaRecorder(tempStream, {type: mimeType})
    mediaRecorder.current = media

    mediaRecorder.current.start()
    let localAudioChunks = []
    mediaRecorder.current.ondataavailable = (event) => {
      if(typeof event.data === 'undefined') {return}
      if(event.data.size === 0) {return}
      localAudioChunks.push(event.data)
    }
    setAudioChunks(localAudioChunks)
  }

  //Stop recording
  async function stopRecording() {
    setRecordingStatus('inactive')
    console.log('stop recording')

    mediaRecorder.current.stop()
    mediaRecorder.current.onstop = () => {
      const audioBlob = new Blob(audioChunks, {type: mimeType})
      setAudioStream(audioBlob)
      setAudioChunks([])
      setDuration(0)
    }

  }

  //recording timer | === checks for value and type, == only checks one, dont make that mistake again
  useEffect(() => {
if (recordingStatus === 'inactive') {return}

const interval = setInterval(() => {
  setDuration(curr => curr + 1)
}, 1000)

return () => clearInterval(interval)
  })

  return (
<div>

    <div className='text-center'>
        <MicIcon className={'cursor-pointer' + (recordingStatus === 'recording'? 'tet-red-500' : '')} fontSize="medium"/>
        
        
        <div>
        <button onClick={recordingStatus === 'recording' ? stopRecording : startRecording} className='text-center border border-black rounded-lg p-3'>
    <span>{recordingStatus === 'inactive' ? 'Record' : 'Stop Recording'}</span>
    {duration !== 0 && (
        <span>{duration}s</span>
    )}
</button>

        </div>


    </div>
</div>
  )
}
