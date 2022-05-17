import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppThunk, RootState } from '../../app/store'
import { createBoard } from '../../utils/createBoard'

const initialState = {
  board: createBoard(),
  selected: null as null | CellType,
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
  findFigureIndex,
  (board, selected, index) => {
    const availableMoves = [] as string[]
    const i = Math.floor(index / 8)
    const j = index % 8

    if (
      selected?.figure?.type === 'queen' ||
      selected?.figure?.type === 'rook'
    ) {
      for (let y = i + 1; y < 8; y++) {
        let cell = board[y * 8 + j]
        availableMoves.push(cell.x + cell.y)
        if (cell.figure) {
          break
        }
      }
      for (let y = i - 1; y >= 0; y--) {
        let cell = board[y * 8 + j]
        availableMoves.push(cell.x + cell.y)
        if (cell.figure) {
          break
        }
      }
      for (let x = j + 1; x < 8; x++) {
        let cell = board[i * 8 + x]
        availableMoves.push(cell.x + cell.y)
        if (cell.figure) {
          break
        }
      }
      for (let x = j - 1; x >= 0; x--) {
        let cell = board[i * 8 + x]
        availableMoves.push(cell.x + cell.y)
        if (cell.figure) {
          break
        }
      }
    }

    if (
      selected?.figure?.type === 'queen' ||
      selected?.figure?.type === 'bishop'
    ) {
      for (let k = 1; i + k < 8 && j + k < 8; k++) {
        let cell = board[(i + k) * 8 + j + k]
        availableMoves.push(cell.x + cell.y)
        if (cell.figure) {
          break
        }
      }
      for (let k = 1; i - k >= 0 && j - k >= 0; k++) {
        let cell = board[(i - k) * 8 + j - k]
        availableMoves.push(cell.x + cell.y)
        if (cell.figure) {
          break
        }
      }
      for (let k = 1; i + k < 8 && j - k >= 0; k++) {
        let cell = board[(i + k) * 8 + j - k]
        availableMoves.push(cell.x + cell.y)
        if (cell.figure) {
          break
        }
      }
      for (let k = 1; i - k >= 0 && j + k < 8; k++) {
        let cell = board[(i - k) * 8 + j + k]
        availableMoves.push(cell.x + cell.y)
        if (cell.figure) {
          break
        }
      }
    }

    if (
      selected?.figure?.type === 'king' ||
      selected?.figure?.type === 'knight' ||
      selected?.figure?.type === 'pawn'
    ) {
      board.forEach(cell => {
        if (cell.figure?.color !== selected?.figure?.color) {
          availableMoves.push(cell.x + cell.y)
        }
      })
    }

    return availableMoves
  }
)

export const selectFilteredMoves = createSelector(
  selectBoard,
  selectMoves,
  getSelected,
  (board, moves, selected) => {
    return moves.filter(
      coords => board[coords].figure?.color !== selected?.figure?.color
    )
  }
)

export const { highlightCells, turnOffHighlight, move, setSelected } =
  gameSlice.actions

export const startMove =
  (selected: CellType): AppThunk =>
  (dispatch, getState) => {
    const turn = selectTurn(getState())
    if (selected.figure?.color !== turn) {
      return
    }
    dispatch(setSelected(selected))
    const availableMoves = selectFilteredMoves(getState())
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
