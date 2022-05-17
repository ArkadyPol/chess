import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
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
    highlightCells: (state, action: PayloadAction<string[]>) => {
      action.payload.forEach(coords => {
        state.board[coords].available = true
      })
    },
    turnOffHighlight: state => {
      for (let key in state.board) {
        state.board[key].available = false
      }
    },
    move: (
      state,
      action: PayloadAction<{ selected: string; target: string }>
    ) => {
      const { selected, target } = action.payload
      const { figure } = state.board[selected]
      state.board[selected].figure = null
      state.board[target].figure = figure
      switch (state.turn) {
        case 'white':
          state.turn = 'black'
          break
        case 'black':
          state.turn = 'white'
          break
      }
    },
  },
})

export const selectBoard = (state: RootState) => state.game.board
export const selectBoardAsArray = createSelector(selectBoard, board =>
  Object.values(board)
)

export default gameSlice.reducer

export type PieceType = 'pawn' | 'knight' | 'bishop' | 'rook' | 'queen' | 'king'
export type XCoordType = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h'
export type CellType = {
  x: XCoordType
  y: number
  figure: ChessPiece | null
  available: boolean
}
export type ChessPiece = {
  color: 'white' | 'black'
  type: PieceType
}
export type BoardType = {
  [coords: string]: CellType
}
