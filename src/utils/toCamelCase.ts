import { PieceType } from '../features/game/gameSlice'

export const toCamelCase = (piece: PieceType, color: 'white' | 'black') =>
  color.slice(0, 1).toUpperCase() +
  color.slice(1) +
  piece.slice(0, 1).toUpperCase() +
  piece.slice(1)
