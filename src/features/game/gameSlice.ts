import {
  createSelector,
  createSlice,
  nanoid,
  PayloadAction,
} from '@reduxjs/toolkit'
import { AppThunk, RootState } from 'app/store'
import { canMove } from 'utils/canMove'
import { createBoard } from 'utils/createBoard'
import { getOppositeColor } from 'utils/getOppositeColor'
import { filterChecks } from 'utils/filterChecks'
import { sleep } from 'utils/sleep'

const initialState = {
  board: createBoard(),
  highlightId: null as null | string,
  selected: null as null | CellType,
  turn: 'white' as ColorType,
  lostBlackFigures: [] as ChessPiece[],
  lostWhiteFigures: [] as ChessPiece[],
  blackTime: 300,
  whiteTime: 300,
  winner: null as ColorType | null,
}

export const gameSlice = createSlice({
  name: 'counter',
  initialState: initialState,
  reducers: {
    restart: () => initialState,
    highlightCells: (state, action: PayloadAction<string[]>) => {
      action.payload.forEach(coords => {
        state.board[coords].available = true
      })
    },
    setSelected: (state, action: PayloadAction<CellType | null>) => {
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
          state.whiteTime += 5
          break
        case 'black':
          state.blackTime += 5
          break
      }
      state.turn = getOppositeColor(state.turn)
      state.selected = null
    },
    decrementTimer(state) {
      switch (state.turn) {
        case 'white':
          state.whiteTime--
          if (state.whiteTime === 0) {
            state.winner = 'black'
          }
          break
        case 'black':
          state.blackTime--
          if (state.blackTime === 0) {
            state.winner = 'white'
          }
          break
      }
    },
    setWinner(state, action: PayloadAction<ColorType>) {
      state.winner = action.payload
    },
    setHighlightId(state, action: PayloadAction<string | null>) {
      state.highlightId = action.payload
    },
  },
})

export const selectBoard = (state: RootState) => state.game.board
export const selectTurn = (state: RootState) => state.game.turn
export const getSelected = (state: RootState) => state.game.selected
export const selectWinner = (state: RootState) => state.game.winner
export const selectHighlightId = (state: RootState) => state.game.highlightId
export const selectBoardAsArray = createSelector(selectBoard, board =>
  Object.values(board)
)
export const findOppositeKing = createSelector(
  selectBoardAsArray,
  (_state: RootState, color: ColorType) => color,
  (board, color) => {
    let oppositeColor = getOppositeColor(color)
    const cell = board.filter(
      cell =>
        cell.figure?.color === oppositeColor && cell.figure.type === 'king'
    )[0]
    return cell.x + cell.y
  }
)
export const selectMoves = createSelector(
  (state: RootState) => state,
  selectBoardAsArray,
  (_state: RootState, selected: CellType) => selected,
  (_state: RootState, _selected: CellType, detailed: boolean) => detailed,
  (state, board, selected, detailed) => {
    const moves = board.filter(target => canMove(target, selected, board))

    if (detailed) {
      return moves
        .filter(target => filterChecks(selected, target, state))
        .map(cell => cell.x + cell.y)
    }

    return moves.map(cell => cell.x + cell.y)
  }
)

export const selectFiguresByColor = createSelector(
  selectBoardAsArray,
  (_state: RootState, color: ColorType) => color,
  (board, color) => {
    return board.filter(cell => cell.figure?.color === color)
  }
)

type Move = `${string}-${string}`

export const selectAllMovesByColor = createSelector(
  (state: RootState) => state,
  selectFiguresByColor,
  (_state: RootState, _color: ColorType, detailed: boolean) => detailed,
  (state, board, detailed) => {
    const allMoves = [] as Move[]
    board.forEach(cell => {
      const moves = selectMoves(state, cell, detailed)
      moves.forEach(m => {
        allMoves.push(`${cell.x + cell.y}-${m}`)
      })
    })
    return allMoves
  }
)

export const selectCheckMovesByColor = createSelector(
  selectAllMovesByColor,
  findOppositeKing,
  (movies, king) => {
    return movies.filter(m => m.split('-')[1] === king)
  }
)

export const {
  highlightCells,
  turnOffHighlight,
  move,
  setSelected,
  restart,
  decrementTimer,
  setWinner,
  setHighlightId,
} = gameSlice.actions

export const startMove =
  (selected: CellType): AppThunk =>
  (dispatch, getState) => {
    dispatch(setHighlightId(null))
    const turn = selectTurn(getState())
    if (selected.figure?.color !== turn) {
      return
    }
    const winner = selectWinner(getState())
    if (winner) {
      return
    }
    dispatch(setSelected(selected))
    const availableMoves = selectMoves(getState(), selected, true)
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
      const oppositeColor = getOppositeColor(selectedCell.figure!.color)
      const allMoves = selectAllMovesByColor(getState(), oppositeColor, true)
      if (allMoves.length === 0) {
        dispatch(setWinner(selectedCell.figure!.color))
      }
      dispatch(turnOffHighlight())
    }
  }

export const highlightMoves = (): AppThunk => async (dispatch, getState) => {
  const color = selectTurn(getState())
  const figures = selectFiguresByColor(getState(), color)
  const id = nanoid()
  dispatch(setHighlightId(id))

  for (let i = 0; i < figures.length; i++) {
    const currentId = selectHighlightId(getState())
    if (id !== currentId) break
    dispatch(setSelected(figures[i]))
    const availableMoves = selectMoves(getState(), figures[i], true)
    if (availableMoves.length) {
      console.log(availableMoves)
      dispatch(highlightCells(availableMoves))
      await sleep(250)
      dispatch(turnOffHighlight())
    }
    dispatch(setSelected(null))
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
  color: ColorType
  type: PieceType
}
export type BoardType = {
  [coords: string]: CellType
}
export type ColorType = 'white' | 'black'
