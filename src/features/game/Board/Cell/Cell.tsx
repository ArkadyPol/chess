import { FC, useState } from 'react'
import { toCamelCase } from '../../../../utils/toCamelCase'
import { CellType } from '../../gameSlice'
import styles from './Cell.module.css'

type PropsType = {
  cell: CellType
  color: 'white' | 'black'
}

const Cell: FC<PropsType> = ({ cell, color }) => {
  const [selected, setSelected] = useState(false)

  const classNames = [styles.cell, styles[color]]

  if (selected) {
    classNames.push(styles.selected)
  }

  if (cell.available) {
    classNames.push(cell.figure ? styles.threatened : styles.available)
  }

  const chessPiece = cell.figure
    ? toCamelCase(cell.figure.type, cell.figure.color)
    : ''
  const svgDir = require.context('../../../../assets/')

  return (
    <div
      className={classNames.join(' ')}
      onDrop={e => {
        e.preventDefault()
        console.log(cell)
      }}
      onDragOver={e => e.preventDefault()}
    >
      {cell.figure && (
        <img
          src={svgDir(`./${chessPiece}.svg`)}
          alt="Chess piece"
          onDragStart={() => {
            console.log(cell)
            setSelected(true)
          }}
          onDragEnd={() => {
            setSelected(false)
          }}
        />
      )}
    </div>
  )
}

export default Cell
