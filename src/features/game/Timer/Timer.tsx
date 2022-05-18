import { useAppDispatch, useAppSelector } from 'app/hooks'
import { useEffect } from 'react'
import { decrementTimer, reset } from '../gameSlice'
import styles from './Timer.module.css'

const Timer = () => {
  const blackTime = useAppSelector(state => state.game.blackTime)
  const whiteTime = useAppSelector(state => state.game.whiteTime)
  const dispatch = useAppDispatch()

  useEffect(() => {
    const timer = setInterval(() => dispatch(decrementTimer()), 1000)
    return () => {
      clearInterval(timer)
    }
  }, [dispatch])

  return (
    <div className={styles.timer}>
      <div className={styles.restart}>
        <button
          className={styles.restartBtn}
          onClick={() => {
            dispatch(reset())
          }}
        >
          Restart game
        </button>
      </div>
      <h2>Black - {blackTime} sec</h2>
      <h2>White - {whiteTime} sec</h2>
    </div>
  )
}

export default Timer
