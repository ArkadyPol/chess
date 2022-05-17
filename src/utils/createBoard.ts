import {
  BoardType,
  CellType,
  PieceType,
  XCoordType,
} from '../features/game/gameSlice'

const xCoords: XCoordType[] = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
const pieces: PieceType[] = [
  'rook',
  'knight',
  'bishop',
  'queen',
  'king',
  'bishop',
  'knight',
  'rook',
]

export const createBoard = (): BoardType => {
  const board = {} as BoardType
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const x = xCoords[j]
      const y = 8 - i
      const newCell: CellType = {
        figure: null,
        available: false,
        x,
        y,
      }
      board[`${x}${y}`] = newCell
    }
  }

  for (let i = 0; i < 8; i++) {
    board[`${xCoords[i]}7`].figure = { color: 'black', type: 'pawn' }
    board[`${xCoords[i]}2`].figure = { color: 'white', type: 'pawn' }
  }

  for (let i = 0; i < 8; i++) {
    board[`${xCoords[i]}8`].figure = { color: 'black', type: pieces[i] }
    board[`${xCoords[i]}1`].figure = { color: 'white', type: pieces[i] }
  }

  return board
}
