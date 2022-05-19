import { FC, DragEvent } from 'react'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { toCamelCase } from 'utils/toCamelCase'
import {
  CellType,
  ColorType,
  endMove,
  getSelected,
  startMove,
  turnOffHighlight,
} from '../../gameSlice'
import styles from './Cell.module.css'

type PropsType = {
  cell: CellType
  color: ColorType
}

const Cell: FC<PropsType> = ({ cell, color }) => {
  const selected = useAppSelector(getSelected)
  const dispatch = useAppDispatch()

  const classNames = [styles.cell, styles[color]]

  if (selected) {
    if (selected.x === cell.x && selected.y === cell.y) {
      classNames.push(styles.selected)
    }
  }

  if (cell.available) {
    classNames.push(cell.figure ? styles.threatened : styles.available)
  }

  const chessPiece = cell.figure
    ? toCamelCase(cell.figure.type, cell.figure.color)
    : ''
  const svgDir = require.context('assets/')

  const onDragStartHandler = () => {
    dispatch(startMove(cell))
  }

  const onDragEndHandler = () => {
    dispatch(turnOffHighlight())
  }

  const onDropHandler = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    dispatch(endMove(cell))
  }

  return (
    <div
      className={classNames.join(' ')}
      onDrop={onDropHandler}
      onDragOver={e => e.preventDefault()}
    >
      {cell.figure && (
        <img
          src={svgDir(`./${chessPiece}.svg`)}
          alt="Chess piece"
          onDragStart={onDragStartHandler}
          onDragEnd={onDragEndHandler}
        />
      )}
    </div>
  )
}

export default Cell
