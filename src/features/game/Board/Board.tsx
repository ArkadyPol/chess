import { useAppSelector } from '../../../app/hooks'
import { selectBoard } from '../gameSlice'
import styles from './Board.module.css'
import Cell from './Cell/Cell'

const Board = () => {
  const board = useAppSelector(selectBoard)
  return (
    <div className={styles.board}>
      {board.map((row, i) =>
        row.map((el, j) => (
          <Cell
            key={i * 8 + j}
            content={el}
            color={(i + j) % 2 ? 'black' : 'white'}
          />
        ))
      )}
    </div>
  )
}

export default Board
