import { createSlice } from '@reduxjs/toolkit'
import { RootState } from '../../app/store'
import { createBoard } from '../../utils/createBoard'

const initialState = {
  board: createBoard(),
  turn: 'white' as 'white' | 'black',
}

export const gameSlice = createSlice({
  name: 'counter',
  initialState: initialState,
  reducers: {
    reset: () => initialState,
  },
})

export const selectBoard = (state: RootState) => state.game.board

export default gameSlice.reducer

export type PieceType = 'pawn' | 'knight' | 'bishop' | 'rook' | 'queen' | 'king'
export type ChessPiece = {
  color: 'white' | 'black'
  type: PieceType
}
export type Board = (ChessPiece | null)[][]
