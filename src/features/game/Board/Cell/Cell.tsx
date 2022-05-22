import { FC, DragEvent } from 'react'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import {
  CellType,
  ColorType,
  defineCurrentPlayer,
  endMove,
  getSelected,
  selectHistoryMode,
  startMove,
  turnOffHighlight,
} from '../../gameSlice'
import styles from './Cell.module.css'
import ChessIcon from 'components/ChessIcon/ChessIcon'

type PropsType = {
  cell: CellType
  color: ColorType
}

const Cell: FC<PropsType> = ({ cell, color }) => {
  const selected = useAppSelector(getSelected)
  const isCurrentPlayerBot = useAppSelector(defineCurrentPlayer)
  const historyMode = useAppSelector(selectHistoryMode)
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
        <ChessIcon
          figure={cell.figure}
          onDragStart={onDragStartHandler}
          onDragEnd={onDragEndHandler}
          draggable={!isCurrentPlayerBot && !historyMode}
        />
      )}
    </div>
  )
}

export default Cell
