import { useAppDispatch, useAppSelector } from 'app/hooks'
import ChessIcon from 'components/ChessIcon/ChessIcon'
import {
  historyTravel,
  RecordMove,
  selectCurrentStep,
  selectHistoryMode,
} from 'features/game/gameSlice'
import { FC } from 'react'
import styles from './Record.module.css'

type PropsType = {
  record: RecordMove
  step: number
}

const Record: FC<PropsType> = ({ record, step }) => {
  const currentStep = useAppSelector(selectCurrentStep)
  const historyMode = useAppSelector(selectHistoryMode)
  const dispatch = useAppDispatch()
  const classNames = [styles.record]
  if (currentStep === step) {
    classNames.push(styles.active)
  }

  const handleClick = () => {
    if (historyMode) return
    dispatch(historyTravel(step))
  }

  return (
    <div className={classNames.join(' ')} onClick={handleClick}>
      <ChessIcon figure={record.source} size={20} />
      <span>{record.move} </span>
      {record.captured && (
        <>
          <span>x</span>
          <ChessIcon figure={record.captured} size={20} />
        </>
      )}
    </div>
  )
}

export default Record
