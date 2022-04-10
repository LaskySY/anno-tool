import YtVideo from './components/YtVideo'
import AnnoTable from './components/AnnoTable'
import React from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import './App.css'

function App() {
  var cellFocus = []
  const videoRef = React.useRef()
  const [data, setData] = React.useState(
    [...Array(60).keys()].map(i => ({ index: i + 1, start: '', end: '', text: '' }))
  )

  useHotkeys(
    'alt+w',
    () => handleWriteSecond(),
    { filterPreventDefault: true, enableOnTags: ['INPUT'] }
  );

  const handleWriteSecond = () => {
    let second = videoRef.current.seconds.toFixed(3)
    navigator.clipboard.writeText(second)
    if (cellFocus[1] == 'start' || cellFocus[1] == 'end')
      updateMyData(cellFocus[0], cellFocus[1], second)
  }
  const handleFocusCell = (rowIndex, columnId, value) => {
    cellFocus = [rowIndex, columnId, value]
  }
  const updateMyData = (rowIndex, columnId, value) => {
    setData(old => old.map((row, index) => {
      if (index === rowIndex) {
        return { ...old[rowIndex], [columnId]: value }
      }
      return row
    }))
  }

  return (
    <div className="App row">
      <h1>{'Ctrl+Space start/pause video, Alt+W fill current video second to Start/End cell'}</h1>
      <div className="column">
        <YtVideo
          ref={videoRef}
        />
      </div>
      <div className="column">
        <AnnoTable
          data={data}
          updateMyData={updateMyData}
          getCellFocusing={handleFocusCell}
        />
      </div>
    </div>
  );
}

export default App;
