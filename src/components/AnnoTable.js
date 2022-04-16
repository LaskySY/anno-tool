import React from 'react'
import styled from 'styled-components'
import { useTable, usePagination } from 'react-table'
import { IndexCell, MainCell } from './cells'
import { useHotkeys } from 'react-hotkeys-hook'

const Styles = styled.div`

  table {
    width: 100%;
    border-spacing: 0;
    display: block;

    .tableWrap {
      display: block;
      max-width: 100%;
      overflow-x: scroll;
      overflow-y: hidden;
      border-bottom: 1px solid black;
    }

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th , td {
      width: 1%;
      margin: 0;
      padding: 0.3rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;

      :last-child {
        border-right: 0;
      }

      &.collapse {
        width: 0.0000000001%;
        min-width:80px;
      }

      input {
        width:100%;
        font-size: 1rem;
        padding: 0;
        margin: 0;
        border: 0;
      }

      textarea:focus, input:focus{
        outline: none;
      }
    }
  }

  .pagination {
    padding: 0.3rem;
  }
`

const columns = [
  { collapse: true, Cell: IndexCell, accessor: 'index', Header: '' },
  { collapse: true, Cell: MainCell, accessor: 'start', Header: 'Start' },
  { collapse: true, Cell: MainCell, accessor: 'end', Header: 'End' },
  { collapse: false, Cell: MainCell, accessor: 'text', Header: 'Annotation' },
]

const pageSizeOptions = [10, 15, 20, 25, 30]


function AnnoTable({ data, setData, setStopTime, videoSeekTo }, ref) {
  const fineTune = 0.2
  const [cellFocus, setCellFocus] = React.useState()

  React.useImperativeHandle(ref, () => ({
    handleWriteSecond: handleWriteSecond
  }));

  useHotkeys('left', e => handleFineTune(e, "left"), { enableOnTags: ['INPUT'] })
  useHotkeys('right', e => handleFineTune(e, "right"), { enableOnTags: ['INPUT'] })

  const handleFineTune = (e, mode) => {
    let cellValue = parseFloat(cellFocus[2].value)
    if (cellFocus && cellValue && (cellFocus[1] === 'start' || cellFocus[1] === 'end')) {
      e.preventDefault()
      let nextSec = cellValue
      nextSec += mode === 'right' ? fineTune : 0
      nextSec += mode === 'left' ? -fineTune : 0
      let afterSeek = videoSeekTo(nextSec, false)
      updateCell(cellFocus[0], cellFocus[1], afterSeek)
    }
  }
  const handleWriteSecond = sec => {
    if (cellFocus && (cellFocus[1] === 'start' || cellFocus[1] === 'end'))
      updateCell(cellFocus[0], cellFocus[1], sec)
  }
  const handleAddRow = () => {
    let index = cellFocus[0]
    cellFocus[2].blur()
    let emptyRow = { start: '', end: '', text: '' }
    setData(old => { old.splice(index + 1, 0, emptyRow); return old })
  }
  const handleDelRow = () => {
    let index = cellFocus[0]
    cellFocus[2].blur()
    setData(old => { old.splice(index, 1); return old })
  }
  const updateCell = (rowIndex, columnId, value) => {
    setData(old => old.map((row, index) => {
      return index === rowIndex ? { ...old[rowIndex], [columnId]: value } : row
    }))
  }

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      autoResetPage: false,
      setStopTime,
      updateCell,
      videoSeekTo,
      initialState: { pageIndex: 0, pageSize: 15 }
    },
    usePagination
  )

  return (
    <Styles>
      <div className='tableWrap'>
        <table {...getTableProps()}>
          <thead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th
                    {...column.getHeaderProps({
                      className: column.collapse ? 'collapse' : '',
                    })}
                  >
                    {column.render('Header')}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map(row => {
              prepareRow(row)
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map(cell => {
                    return (
                      <td
                        {...cell.getCellProps({
                          className: cell.column.collapse
                            ? cell.column.id + '-cell collapse'
                            : cell.column.id + '-cell',
                          onFocus: (d) => setCellFocus([cell.row.index, cell.column.id, d.target]),
                          onBlur: () => setCellFocus(),
                        })}
                      >
                        {cell.render('Cell')}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>

        <div className="pagination">
          <button
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
          >{'<'}</button>
          <button
            onClick={() => nextPage()}
            disabled={!canNextPage}
          >{'>'}</button>
          <span><strong>Page: {pageIndex + 1} of {pageOptions.length}</strong></span>
          <select
            value={pageSize}
            onChange={e => { setPageSize(Number(e.target.value)) }}
          >
            {pageSizeOptions.map(pageSize => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
          <button
            style={{ float: 'right' }}
            onMouseDown={handleAddRow}
            disabled={!cellFocus}
          >{'+'}</button>
          <button
            style={{ float: 'right' }}
            onMouseDown={handleDelRow}
            disabled={!cellFocus}
          >{'-'}</button>
        </div>
      </div>
    </Styles>
  )
}

export default React.forwardRef(AnnoTable);
