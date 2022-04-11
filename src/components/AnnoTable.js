import React from 'react'
import styled from 'styled-components'
import { useTable, usePagination } from 'react-table'

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

// Create an editable cell renderer
const EditableCell = ({
  value: initialValue,
  row: { index },
  column: { id },
  updateMyData,
}) => {
  const [value, setValue] = React.useState(initialValue)
  React.useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  return (
    id === 'index'
    ? <div style={{textAlign: 'center'}}
        onClick={()=>console.log('jump to')}
      >
        {value}
      </div>
    : <input value={value} 
        onChange={e=>setValue(e.target.value)} 
        onBlur={()=>updateMyData(index, id, value)} 
      />
  )
}

const defaultColumn = {
  Cell: EditableCell,
}

const columns = [
  { Header: '', accessor: 'index', collapse: true },
  { Header: 'Start', accessor: 'start', collapse: true },
  { Header: 'End', accessor: 'end', collapse: true },
  { Header: 'Annotation', accessor: 'text' },
]

const pageSizeOptions = [10, 15, 20, 25, 30]

function AnnoTable({ data, updateMyData }, ref) {
  const [cellFocus, setCellFocus] = React.useState()
  React.useImperativeHandle(ref, () => ({
    cellFocus: cellFocus,
  }));
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
      defaultColumn,
      autoResetPage: false,
      updateMyData,
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
            {page.map((row, i) => {
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
                          onFocus: () => setCellFocus([cell.row.index, cell.column.id]),
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
          <button onClick={() => previousPage()} disabled={!canPreviousPage}>{'<'}</button>{' '}
          <button onClick={() => nextPage()} disabled={!canNextPage}>{'>'}</button>{' '}
          <span>Page{' '}<strong>{pageIndex + 1} of {pageOptions.length}</strong>{' '}</span>
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
        </div>
      </div>
    </Styles>
  )
}

export default React.forwardRef(AnnoTable);
