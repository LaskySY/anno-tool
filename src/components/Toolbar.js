import React from 'react'
import { download, upload, loadData } from '../utils'
import { ShortcutDialog } from './dialogs'

function Toolbar({ tableRef }) {
  const [showShortcutDialog, setShowShortcutDialog] = React.useState(false)
  const data = tableRef.current.data

  return <div id='toolBtn-group'>
    <button onClick={() => download(data)}>Export</button>
    <button onClick={() => upload()}>Import</button>
    <input id="dataLoader" type="file" accept=".txt" onChange={() => loadData(d => tableRef.initData(d))} />
    <button onClick={() => setShowShortcutDialog(!showShortcutDialog)}>Shortcut</button>
    <ShortcutDialog status={showShortcutDialog} />
  </div>
}

export default Toolbar