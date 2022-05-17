import { Board, PieceType } from '../features/game/gameSlice'

export const createBoard = (): Board => {
  const board: Board = new Array(8).fill(null).map(_ => new Array(8).fill(null))
  for (let i = 0; i < 8; i++) {
    board[1][i] = { color: 'black', type: 'pawn' }
    board[6][i] = { color: 'white', type: 'pawn' }
  }
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
  for (let i = 0; i < 8; i++) {
    board[0][i] = { color: 'black', type: pieces[i] }
    board[7][i] = { color: 'white', type: pieces[i] }
  }

  return board
}
