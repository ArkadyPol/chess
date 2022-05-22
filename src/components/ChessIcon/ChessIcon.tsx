import { ChessPiece } from 'features/game/gameSlice'
import { FC } from 'react'
import { toCamelCase } from 'utils/toCamelCase'

type PropsType = {
  figure: ChessPiece
  size?: number
  onDragStart?: () => void
  onDragEnd?: () => void
  draggable?: boolean
}

const ChessIcon: FC<PropsType> = ({
  figure,
  size,
  onDragStart,
  onDragEnd,
  draggable,
}) => {
  const svgDir = require.context('assets/')
  return (
    <img
      width={size}
      height={size}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      draggable={draggable}
      src={svgDir(`./${toCamelCase(figure.type, figure.color)}.svg`)}
      alt="Chess piece"
    />
  )
}

export default ChessIcon
