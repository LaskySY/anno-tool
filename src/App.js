import YtVideo from './components/YtVideo'
import AnnoTable from './components/AnnoTable'
import React from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import './App.css'

function App() {
  const tableRef = React.useRef()
  const videoRef = React.useRef()
  
  useHotkeys('ctrl+l',
    e => { e.preventDefault(); handleWriteSecond() },
    { enableOnTags: ['INPUT'] }
  );

  const handleWriteSecond = () => {
    let second = videoRef.current.seconds.toFixed(3)
    navigator.clipboard.writeText(second)
    tableRef.current.writeShortcutSecond(second)
  }

  return (
    <div className="App row">
      <h1>Ctrl+K start/pause video, Ctrl+L fill current video second to Start/End cell</h1>
      <div className="column">
        <YtVideo
          ref={videoRef}
        />
      </div>
      <div className="column">
        <AnnoTable
          ref={tableRef}
          videoSeekTo={s => videoRef.current.seekTobySeconds(s)}
        />
      </div>
    </div>
  );
}

export default App;
