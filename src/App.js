import React from 'react';
import YtVideo from './components/YtVideo'
import AnnoTable from './components/AnnoTable'
import Toolbar from './components/Toolbar';
import { useHotkeys } from 'react-hotkeys-hook';
import './App.css'


function App() {
  const tableRef = React.useRef(1)
  const videoRef = React.useRef(1)
  const [data, setData] = React.useState(Array(60).fill({ start: '', end: '', text: '' }))

  useHotkeys('\\',
    e => { e.preventDefault(); handleWriteSecond() },
    { enableOnTags: ['INPUT'] }
  );

  const handleWriteSecond = () => {
    let second = videoRef.current.videoStatus.playedSeconds.toFixed(3)
    // navigator.clipboard.writeText(second)
    tableRef.current.handleWriteSecond(second)
  }
  
  return (
    <>
      <Toolbar
        data={data}
        initData={setData}
      />
      <div className="App row">
        <div className="column">
          <YtVideo
            ref={videoRef}
          />
        </div>
        <div className="column">
          <AnnoTable
            ref={tableRef}
            data={data}
            setData={setData}
            videoSeekTo={(a, p) => videoRef.current.videoSeekTo(a, p)}
          />
      </div>
    </div>
    </>
    
  );
}

export default App;
