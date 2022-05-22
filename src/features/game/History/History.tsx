import { useAppSelector } from 'app/hooks'
import ChessIcon from 'components/ChessIcon/ChessIcon'
import { selectHistory } from '../gameSlice'
import styles from './History.module.css'

const History = () => {
  const history = useAppSelector(selectHistory)

  return (
    <div className={styles.history}>
      {history.map((record, i) => (
        <div key={i} className={styles.record}>
          <ChessIcon figure={record.source} size={20} />
          <span>{record.move} </span>
          {record.captured && (
            <>
              <span>x</span>
              <ChessIcon figure={record.captured} size={20} />
            </>
          )}
        </div>
      ))}
    </div>
  )
}

export default History
