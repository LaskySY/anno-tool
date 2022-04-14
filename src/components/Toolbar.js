import React from 'react'
import { download, upload, loadData } from '../utils'
import { ShortcutDialog } from './dialogs'

function Toolbar({ data, initData }) {
  const [showShortcutDialog, setShowShortcutDialog] = React.useState(false)
  return <div id='toolBtn-group'>
    <button onClick={() => download(data)}>Export</button>
    <button onClick={() => upload()}>Import</button>
    <input id="dataLoader" type="file" accept=".txt" onChange={() => loadData(d => initData(d))} />
    <button onClick={() => setShowShortcutDialog(!showShortcutDialog)}>Shortcut</button>
    <ShortcutDialog status={showShortcutDialog} />
  </div>
}

export default Toolbar