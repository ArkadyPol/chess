import { useAppDispatch, useAppSelector } from 'app/hooks'
import { useEffect } from 'react'
import {
  decrementTimer,
  defineCurrentPlayer,
  highlightMoves,
  randomMove,
  restart,
  selectWinner,
} from '../gameSlice'
import styles from './Timer.module.css'

const Timer = () => {
  const blackTime = useAppSelector(state => state.game.blackTime)
  const whiteTime = useAppSelector(state => state.game.whiteTime)
  const winner = useAppSelector(selectWinner)
  const isCurrentPlayerBot = useAppSelector(defineCurrentPlayer)
  const dispatch = useAppDispatch()

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null
    if (!winner) {
      timer = setInterval(() => {
        dispatch(decrementTimer())
        if (isCurrentPlayerBot) {
          dispatch(randomMove())
        }
      }, 1000)
    }
    return () => {
      if (timer) {
        clearInterval(timer)
      }
    }
  }, [dispatch, winner, isCurrentPlayerBot])

  return (
    <div className={styles.timer}>
      <div className={styles.buttonsArea}>
        <button className={styles.btn} onClick={() => dispatch(restart())}>
          Restart game
        </button>
        <button
          className={styles.btn}
          disabled={!!winner || isCurrentPlayerBot}
          onClick={() => dispatch(highlightMoves())}
        >
          Highlight all possible moves
        </button>
        <button
          className={styles.btn}
          disabled={!!winner || isCurrentPlayerBot}
          onClick={() => dispatch(randomMove())}
        >
          Random move
        </button>
      </div>
      <h2>Black - {blackTime} sec</h2>
      <h2>White - {whiteTime} sec</h2>
    </div>
  )
}

export default Timer
