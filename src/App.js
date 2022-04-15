import React from 'react';
import YtVideo from './components/YtVideo'
import AnnoTable from './components/AnnoTable'
import Toolbar from './components/Toolbar';
import { useHotkeys } from 'react-hotkeys-hook';
import { useWindowSize } from "./utils";
import './App.css'


function App() {
  const tableRef = React.useRef(1)
  const videoRef = React.useRef(1)
  const [width] = useWindowSize();
  const [data, setData] = React.useState(Array(120).fill({ start: '', end: '', text: '' }))

  useHotkeys('\\',
    e => { e.preventDefault(); handleWriteSecond() },
    { enableOnTags: ['INPUT'] }
  );

  const handleWriteSecond = () => {
    let second = videoRef.current.videoStatus.playedSeconds.toFixed(3)
    // navigator.clipboard.writeText(second)
    tableRef.current.handleWriteSecond(second)
  }
  const coloumnWidth = (width - 60) * 0.5
  return (
    <>
      <Toolbar
        data={data}
        initData={setData}
      />
      <div className="App row">
        <div className="column column-l" style={{ width: coloumnWidth }}>
          <YtVideo
            ref={videoRef}
            width={coloumnWidth}
          />
        </div>
        <div className="column column-r" style={{ width: coloumnWidth }}>
          <AnnoTable
            ref={tableRef}
            data={data}
            setData={setData}
            setStopTime={t => videoRef.current.setStopTime(t)}
            videoSeekTo={(a, p) => videoRef.current.videoSeekTo(a, p)}
          />
        </div>
      </div>
    </>

  );
}

export default App;
