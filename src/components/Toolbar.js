import React from 'react'
import { download, upload, loadData } from '../utils'
import { ShortcutDialog, NoteDialog } from './dialogs'

function Toolbar({ data, videoUrl, setVideoUrl, initData }) {
  const [showShortcutDialog, setShowShortcutDialog] = React.useState(false)
  const [showNoteDialog, setShowNoteDialog] = React.useState(false)
  // get YouTube video id
  const videoId = videoUrl.match('(?<=v=)[0-9A-Za-z_-]+')
  const handleVideoURL = () => {
    setVideoUrl(document.getElementsByName('videoURL')[0].value)
  }
  const handleLoadData = () => {
    loadData(
      d => initData(d), 
      d => setVideoUrl(d)
    )
  }
  return <div id='toolBtn-group'>
    <input name="videoURL" style={{ width: 350, marginRight: 4 }} />
    <button onClick={handleVideoURL} style={{ width: 60 }}>Confirm</button>
    {'|'}
    <button onClick={() => download(data, videoId ? videoId : '')}>Export</button>
    <button onClick={() => upload(setVideoUrl)}>Import</button>
    {/* This is a hidden node */}
    <input id="dataLoader" type="file" accept=".txt" onChange={handleLoadData} />
    <button onClick={() => setShowShortcutDialog(!showShortcutDialog)}>Shortcut</button>
    <button onClick={() => setShowNoteDialog(!showNoteDialog)}>Note</button>
    <ShortcutDialog status={showShortcutDialog} />
    <NoteDialog status={showNoteDialog} />
  </div>
}

export default Toolbar