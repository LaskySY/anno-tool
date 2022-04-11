import YtVideo from './components/YtVideo'
import AnnoTable from './components/AnnoTable'
import React from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import './App.css'

function App() {
  const tableRef = React.useRef()
  const videoRef = React.useRef()
  const [data, setData] = React.useState(
    [...Array(60).keys()].map(i => ({ index: i + 1, start: '', end: '', text: '' }))
  )

  useHotkeys('ctrl+l',
    e => { e.preventDefault(); handleWriteSecond() },
    { enableOnTags: ['INPUT'] }
  );

  const handleWriteSecond = () => {
    let second = videoRef.current.seconds.toFixed(3)
    navigator.clipboard.writeText(second)
    let cell = tableRef.current.cellFocus
    if (cell[1] === 'start' || cell[1] === 'end')
      updateMyData(cell[0], cell[1], second)
  }
  const updateMyData = (rowIndex, columnId, value) => {
    setData(old => old.map((row, index) => {
      if (index === rowIndex)
        return { ...old[rowIndex], [columnId]: value }
      return row
    }))
  }
  const handleExport = () => {
    let content = data.reduce((acc, cur) => {
      if (cur.start === '' && cur.end === '' && cur.text === '')
        return acc
      return acc + cur.start + '\t' + cur.end + '\t' + cur.text + '\r\n'
    }, 'data:text/plain;charset=utf-8,');
    let encodedUri = encodeURI(content);
    let link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "anno-text.txt");
    document.body.appendChild(link);
    link.click();
  }
  const handleImport = () => {
    const file = document.getElementById('importBtn').files[0]
    let reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function () {
      let mask = [...Array(60).keys()].map(i => ({ index: i + 1, start: '', end: '', text: '' }))
      let data = reader.result.split("\r\n").filter(e => e !== '')
      data.forEach((e, i) => {
        let d = e.split('\t')
        mask[i] = { ...mask[i], start: d[0], end: d[1], text: d[2] }
      })
      setData(mask)
    };

  }

  return (
    <div className="App row">
      <div id='toolBtn-group'>
        <button className='toolBtn' onClick={handleExport}>Export</button>
        <input id="importBtn" className='toolBtn' type="file"
          accept=".txt" onChange={handleImport}
        />
      </div>

      <h1>Ctrl+K start/pause video, Ctrl+L fill current video second to Start/End cell</h1>

      <div className="column">
        <YtVideo
          ref={videoRef}
        />
      </div>
      <div className="column">
        <AnnoTable
          ref={tableRef}
          data={data}
          updateMyData={updateMyData}
          videoSeekTo={s => videoRef.current.seekTobySeconds(s)}
        />
      </div>
    </div>
  );
}

export default App;
