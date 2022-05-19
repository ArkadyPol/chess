import { useAppDispatch, useAppSelector } from 'app/hooks'
import { useEffect, useState } from 'react'
import { ColorType, restart, selectWinner } from '../gameSlice'
import styles from './EngGame.module.css'

const EngGame = () => {
  const winner = useAppSelector(selectWinner) as ColorType
  const [time, setTime] = useState(30)
  const dispatch = useAppDispatch()

  useEffect(() => {
    const timer = setInterval(() => setTime(prev => prev - 1), 1000)

    return () => {
      clearInterval(timer)
    }
  }, [])

  useEffect(() => {
    if (time === 0) {
      dispatch(restart())
    }
  }, [dispatch, time])

  return (
    <div className={styles.endGame}>
      <span>{winner[0].toUpperCase() + winner.slice(1)} player won</span>
      <span>Game restarts in {time} seconds</span>
    </div>
  )
}

export default EngGame
