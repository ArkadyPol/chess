import { useAppDispatch, useAppSelector } from 'app/hooks'
import {
  defineCurrentPlayer,
  highlightMoves,
  randomMove,
  restart,
  selectCurrentStep,
  selectHistory,
  selectWinner,
  showLastMove,
} from 'features/game/gameSlice'
import styles from './ButtonsMenu.module.css'

const ButtonsMenu = () => {
  const winner = useAppSelector(selectWinner)
  const isCurrentPlayerBot = useAppSelector(defineCurrentPlayer)
  const history = useAppSelector(selectHistory)
  const currentStep = useAppSelector(selectCurrentStep)
  const dispatch = useAppDispatch()
  const disabledShowLastMove =
    history.length === 0 || currentStep !== history.length

  return (
    <div className={styles.buttonsMenu}>
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
      <button
        className={styles.btn}
        disabled={!!winner || isCurrentPlayerBot || disabledShowLastMove}
        onClick={() => dispatch(showLastMove())}
      >
        Show last move
      </button>
    </div>
  )
}

export default ButtonsMenu
