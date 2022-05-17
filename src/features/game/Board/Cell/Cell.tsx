import { FC } from 'react'
import { toCamelCase } from '../../../../utils/toCamelCase'
import { ChessPiece } from '../../gameSlice'
import styles from './Cell.module.css'

type PropsType = {
  content: ChessPiece | null
  color: 'white' | 'black'
}

const Cell: FC<PropsType> = ({ content, color }) => {
  const chessPiece = content ? toCamelCase(content.type, content.color) : ''
  const svgDir = require.context('../../../../assets/')

  return (
    <div className={`${styles.cell} ${styles[color]}`}>
      {content && (
        <img
          src={svgDir(`./${chessPiece}.svg`)}
          alt="Chess piece"
          onDrag={e => console.log(e)}
        />
      )}
    </div>
  )
}

export default Cell
