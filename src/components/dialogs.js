export const ShortcutDialog = ({ status }) => {
  return (
    <dialog open hidden={!status}>
      <table style={{ textAlign: "center", borderSpacing: '30px 0' }}>
        <thead>
          <tr>
            <th>Shortcut</th>
            <th>Operation</th>
            <th>Scope</th>
          </tr>
        </thead>
        <tbody>
        <tr>
            <td>&crarr;</td>
            <td>Start/Pause video</td>
            <td>Page</td>
          </tr>
          <tr>
            <td>\</td>
            <td>Write video time to cell</td>
            <td>Start/End</td>
          </tr>
          <tr>
            <td>Ctrl+F</td>
            <td>Video -5s</td>
            <td>Page</td>
          </tr>
          <tr>
            <td>Ctrl+J</td>
            <td>Video +5s</td>
            <td>Page</td>
          </tr>
          <tr>
            <td>&rarr;</td>
            <td>Time in cell +0.2s</td>
            <td>Start/End</td>
          </tr>
          <tr>
            <td>&larr;</td>
            <td>Time in cell -0.2s</td>
            <td>Start/End</td>
          </tr>
        </tbody>
      </table>
    </dialog>
  )
}

export const NoteDialog = ({ status }) => {
  return (
    <dialog open hidden={!status}>
      <table style={{ textAlign: "center", borderSpacing: '30px 0' }}>
        <thead>
          <tr>
            <th>Key</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
        <tr>
          <td>YouTube URL</td>
          <td>https://www.youtube.com/watch?v=</td>
        </tr>
        <tr>
          <td>Test ID</td>
          <td>7JLSZ-FagVc&t</td>
        </tr>
        </tbody>
      </table>
    </dialog>
  )
}