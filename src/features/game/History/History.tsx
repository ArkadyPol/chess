import { useAppSelector } from 'app/hooks'
import { selectHistory } from '../gameSlice'
import Record from './Record/Record'
import styles from './History.module.css'

const History = () => {
  const history = useAppSelector(selectHistory)

  return (
    <div className={styles.history}>
      {history.map((record, i) => (
        <Record key={i} record={record} step={i + 1} />
      ))}
    </div>
  )
}

export default History
