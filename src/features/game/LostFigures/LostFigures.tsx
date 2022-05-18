import { FC } from 'react'
import { toCamelCase } from 'utils/toCamelCase'
import { ChessPiece } from '../gameSlice'
import styles from './LostFigures.module.css'

type PropsType = {
  title: string
  figures: ChessPiece[]
}

const LostFigures: FC<PropsType> = ({ title, figures }) => {
  const svgDir = require.context('assets/')

  return (
    <div className={styles.lost}>
      <h3>{title}</h3>
      {figures.map((figure, i) => (
        <div key={i} className={styles.lostContent}>
          <span>{figure.type}</span>
          <img
            width={20}
            height={20}
            src={svgDir(`./${toCamelCase(figure.type, figure.color)}.svg`)}
            alt="Chess piece"
          />
        </div>
      ))}
    </div>
  )
}

export default LostFigures
