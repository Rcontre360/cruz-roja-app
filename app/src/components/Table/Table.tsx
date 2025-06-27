import React, {useState} from 'react'
import Button from '../Button'
import Buttons from '../Buttons'

type ColumnType =
  | {key: string; label: string; type: 'text'}
  | {key: string; label: string; type: 'number'; decimals?: number}
  | {key: string; label: string; type: 'icon'; icon: string; onClick: (row: any) => void}
  | {key: string; label: string; type: 'custom'; render: (row: any) => React.ReactNode}

type Props<T> = {
  perPage: number
  columns: ColumnType[]
  elements: T[]
}

const Table = <T extends Record<string, any>>({perPage, columns, elements}: Props<T>) => {
  const [currentPage, setCurrentPage] = useState(0)
  const paginated = elements.slice(perPage * currentPage, perPage * (currentPage + 1))
  const numPages = Math.ceil(elements.length / perPage)

  return (
    <>
      <table>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginated.map((el, idx) => (
            <tr key={idx}>
              {columns.map((col) => {
                if (col.type === 'text') {
                  return <td key={col.key}>{el[col.key]}</td>
                }
                if (col.type === 'number') {
                  const value = el[col.key]
                  return (
                    <td key={col.key}>
                      {typeof value === 'number' && col.decimals != null
                        ? value.toFixed(col.decimals)
                        : value}
                    </td>
                  )
                }
                if (col.type === 'icon') {
                  return (
                    <td key={col.key}>
                      <Button icon={col.icon} onClick={() => col.onClick(el)} small />
                    </td>
                  )
                }
                if (col.type === 'custom') {
                  return (
                    <td key={col.key}>
                      {col.render(el)}
                    </td>
                  )
                }
                return null
              })}
            </tr>
          ))}

        </tbody>
      </table>

      <div className="p-3 lg:px-6 border-t border-gray-100 dark:border-slate-800">
        <div className="flex flex-col md:flex-row items-center justify-between py-3 md:py-0">
          <Buttons>
            {Array.from({length: numPages}, (_, i) => (
              <Button
                key={i}
                label={(i + 1).toString()}
                active={i === currentPage}
                color={i === currentPage ? 'lightDark' : 'whiteDark'}
                small
                onClick={() => setCurrentPage(i)}
              />
            ))}
          </Buttons>
          <small className="mt-6 md:mt-0">
            Page {currentPage + 1} of {numPages}
          </small>
        </div>
      </div>
    </>
  )
}

export default Table
