import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppThunk, RootState } from 'app/store'
import { canMove } from 'utils/canMove'
import { createBoard } from 'utils/createBoard'

const initialState = {
  board: createBoard(),
  selected: null as null | CellType,
  turn: 'white' as 'white' | 'black',
  lostBlackFigures: [] as ChessPiece[],
  lostWhiteFigures: [] as ChessPiece[],
  blackTime: 300,
  whiteTime: 300,
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
    setSelected: (state, action: PayloadAction<CellType>) => {
      state.selected = action.payload
    },
    turnOffHighlight: state => {
      for (let key in state.board) {
        state.board[key].available = false
      }
      state.selected = null
    },
    move: (
      state,
      action: PayloadAction<{ selected: string; target: string }>
    ) => {
      const { selected, target } = action.payload
      const { figure } = state.board[selected]
      state.board[selected].figure = null
      const targetFigure = state.board[target].figure
      if (targetFigure) {
        switch (targetFigure.color) {
          case 'white':
            state.lostWhiteFigures.push(targetFigure)
            break
          case 'black':
            state.lostBlackFigures.push(targetFigure)
            break
        }
      }
      state.board[target].figure = figure
      switch (state.turn) {
        case 'white':
          state.turn = 'black'
          break
        case 'black':
          state.turn = 'white'
          break
      }
      state.selected = null
    },
    decrementTimer(state) {
      switch (state.turn) {
        case 'white':
          state.whiteTime--
          break
        case 'black':
          state.blackTime--
          break
      }
    },
  },
})

export const selectBoard = (state: RootState) => state.game.board
export const selectTurn = (state: RootState) => state.game.turn
export const getSelected = (state: RootState) => state.game.selected
export const selectBoardAsArray = createSelector(selectBoard, board =>
  Object.values(board)
)
export const findFigureIndex = createSelector(
  selectBoardAsArray,
  getSelected,
  (board, selected) => {
    return board.findIndex(
      cell => selected?.x === cell.x && selected?.y === cell.y
    )
  }
)
export const selectMoves = createSelector(
  selectBoardAsArray,
  getSelected,
  (board, selected) => {
    return board
      .filter(target => canMove(target, selected, board))
      .map(cell => cell.x + cell.y)
  }
)

export const {
  highlightCells,
  turnOffHighlight,
  move,
  setSelected,
  reset,
  decrementTimer,
} = gameSlice.actions

export const startMove =
  (selected: CellType): AppThunk =>
  (dispatch, getState) => {
    const turn = selectTurn(getState())
    if (selected.figure?.color !== turn) {
      return
    }
    dispatch(setSelected(selected))
    const availableMoves = selectMoves(getState())
    dispatch(highlightCells(availableMoves))
  }

export const endMove =
  (targetCell: CellType): AppThunk =>
  (dispatch, getState) => {
    const selectedCell = getSelected(getState())
    if (selectedCell) {
      const selected = selectedCell.x + selectedCell.y
      const target = targetCell.x + targetCell.y
      if (targetCell.available) {
        dispatch(move({ selected, target }))
      }
      dispatch(turnOffHighlight())
    }
  }

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
