import { xCoords } from 'utils/createBoard'
import { useAppSelector } from '../../../app/hooks'
import { selectBoardAsArray, selectTurn } from '../gameSlice'
import styles from './Board.module.css'
import Cell from './Cell/Cell'

const Board = () => {
  const board = useAppSelector(selectBoardAsArray)
  const turn = useAppSelector(selectTurn)
  return (
    <>
      <div>
        <h3>Current player is {turn}</h3>
        <div className={styles.board}>
          {board.map((cell, i) => (
            <Cell
              key={cell.x + cell.y}
              cell={cell}
              color={(Math.floor(i / 8) + (i % 8)) % 2 ? 'black' : 'white'}
            />
          ))}
        </div>
        <div className={styles.coordX}>
          {xCoords.map(x => (
            <span key={x}>{x.toUpperCase()}</span>
          ))}
        </div>
      </div>
      <div className={styles.coordY}>
        {[8, 7, 6, 5, 4, 3, 2, 1].map(y => (
          <span key={y}>{y}</span>
        ))}
      </div>
    </>
  )
}

export default Board
