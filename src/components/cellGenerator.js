import React from "react";

export const IndexCell = ({row, videoSeekTo}) => {
  return (
    <button style={{ textAlign: 'center', width: '100%'}}
      onClick={() => videoSeekTo(parseFloat(row.values.start))}
      disabled={isNaN(parseFloat(row.values.start))}
    >{row.index}</button>
  )
}

export const MainCell = ({
  value: initialValue,
  row,
  column: { id },
  updateData,
}) => {
  const [value, setValue] = React.useState(initialValue)
  React.useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  return (
    <input value={value}
      onChange={e => setValue(e.target.value)}
      onBlur={() => updateData(row.index, id, value)}
    />
  )
}