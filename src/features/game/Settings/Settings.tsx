import { useAppDispatch, useAppSelector } from 'app/hooks'
import { ChangeEvent } from 'react'
import {
  PlayerType,
  selectBlackPlayer,
  selectHistoryMode,
  selectWhitePlayer,
  setPlayer,
} from '../gameSlice'
import styles from './Settings.module.css'

const Settings = () => {
  const blackPlayer = useAppSelector(selectBlackPlayer)
  const whitePlayer = useAppSelector(selectWhitePlayer)
  const historyMode = useAppSelector(selectHistoryMode)
  const dispatch = useAppDispatch()

  const onChangeBlackPlayer = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(
      setPlayer({ value: e.currentTarget.value as PlayerType, color: 'black' })
    )
  }

  const onChangeWhitePlayer = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(
      setPlayer({ value: e.currentTarget.value as PlayerType, color: 'white' })
    )
  }

  return (
    <div className={styles.settings}>
      <fieldset className={styles.settingsField}>
        <span>Black:</span>
        <label>
          <input
            type="radio"
            name="black-player"
            value="player"
            checked={blackPlayer === 'player'}
            onChange={onChangeBlackPlayer}
          />{' '}
          player
        </label>
        <label>
          <input
            type="radio"
            name="black-player"
            value="bot"
            checked={blackPlayer === 'bot'}
            onChange={onChangeBlackPlayer}
            disabled={historyMode}
          />{' '}
          bot
        </label>
      </fieldset>
      <fieldset className={styles.settingsField}>
        <span>White:</span>
        <label>
          <input
            type="radio"
            name="white-player"
            value="player"
            checked={whitePlayer === 'player'}
            onChange={onChangeWhitePlayer}
          />{' '}
          player
        </label>
        <label>
          <input
            type="radio"
            name="white-player"
            value="bot"
            checked={whitePlayer === 'bot'}
            onChange={onChangeWhitePlayer}
            disabled={historyMode}
          />{' '}
          bot
        </label>
      </fieldset>
    </div>
  )
}

export default Settings
