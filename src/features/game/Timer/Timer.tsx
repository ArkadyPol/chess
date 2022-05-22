import { useAppDispatch, useAppSelector } from 'app/hooks'
import { useEffect } from 'react'
import {
  decrementTimer,
  defineCurrentPlayer,
  randomMove,
  selectWinner,
} from '../gameSlice'
import ButtonsMenu from './ButtonsMenu/ButtonsMenu'
import styles from './Timer.module.css'

const Timer = () => {
  const blackTime = useAppSelector(state => state.game.timers.black)
  const whiteTime = useAppSelector(state => state.game.timers.white)
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
      <ButtonsMenu />
      <h2>Black - {blackTime} sec</h2>
      <h2>White - {whiteTime} sec</h2>
    </div>
  )
}

export default Timer
