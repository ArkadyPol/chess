import { useAppSelector } from '../../../app/hooks'
import { selectBoardAsArray } from '../gameSlice'
import styles from './Board.module.css'
import Cell from './Cell/Cell'

const Board = () => {
  const board = useAppSelector(selectBoardAsArray)
  return (
    <div className={styles.board}>
      {board.map((cell, i) => (
        <Cell
          key={cell.x + cell.y}
          cell={cell}
          color={(Math.floor(i / 8) + (i % 8)) % 2 ? 'black' : 'white'}
        />
      ))}
    </div>
  )
}

export default Board
