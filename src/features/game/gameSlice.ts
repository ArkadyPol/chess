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
import { getRandomElement } from 'utils/randomInt'

const initialState = {
  board: createBoard(),
  history: [] as RecordMove[],
  currentStep: 0,
  players: {
    white: 'player' as PlayerType,
    black: 'player' as PlayerType,
  },
  highlightId: null as null | string,
  selected: null as null | CellType,
  currentPlayer: 'white' as ColorType,
  timers: { black: 300, white: 300 },
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
      const record: RecordMove = {
        source: { ...figure! },
        move: `${selected}-${target}`,
        captured: null,
      }
      state.board[selected].figure = null
      const targetFigure = state.board[target].figure
      if (targetFigure) {
        record.captured = { ...targetFigure }
      }
      if (figure?.type === 'pawn') {
        switch (figure.color) {
          case 'black':
            if (state.board[target].y === 1) {
              figure.type = 'queen'
            }
            break
          case 'white':
            if (state.board[target].y === 8) {
              figure.type = 'queen'
            }
            break
        }
      }
      state.board[target].figure = figure
      state.timers[state.currentPlayer] += 5
      state.history.length = state.currentStep
      state.history.push(record)
      state.currentPlayer = getOppositeColor(state.currentPlayer)
      state.currentStep++
      state.selected = null
    },
    reverseMove(state, action: PayloadAction<RecordMove>) {
      const [source, target] = action.payload.move.split('-')
      state.board[source].figure = action.payload.source
      state.board[target].figure = action.payload.captured
      state.currentPlayer = action.payload.source.color
      state.currentStep--
    },
    moveForward(state, action: PayloadAction<RecordMove>) {
      const [source, target] = action.payload.move.split('-')
      let figure = action.payload.source
      if (figure.type === 'pawn') {
        switch (figure.color) {
          case 'black':
            if (state.board[target].y === 1) {
              figure = { ...figure, type: 'queen' }
            }
            break
          case 'white':
            if (state.board[target].y === 8) {
              figure = { ...figure, type: 'queen' }
            }
            break
        }
      }
      state.board[target].figure = figure
      state.board[source].figure = null
      state.currentPlayer = getOppositeColor(action.payload.source.color)
      state.currentStep++
    },
    decrementTimer(state) {
      state.timers[state.currentPlayer]--
      if (state.timers.black === 0) {
        state.winner = 'white'
      }
      if (state.timers.white === 0) {
        state.winner = 'black'
      }
    },
    setWinner(state, action: PayloadAction<ColorType>) {
      state.winner = action.payload
    },
    setHighlightId(state, action: PayloadAction<string | null>) {
      state.highlightId = action.payload
    },
    setPlayer(
      state,
      action: PayloadAction<{ color: ColorType; value: PlayerType }>
    ) {
      state.players[action.payload.color] = action.payload.value
    },
  },
})

export const selectBoard = (state: RootState) => state.game.board
export const selectCurrentPlayer = (state: RootState) =>
  state.game.currentPlayer
export const getSelected = (state: RootState) => state.game.selected
export const selectWinner = (state: RootState) => state.game.winner
export const selectHighlightId = (state: RootState) => state.game.highlightId
export const selectBlackPlayer = (state: RootState) => state.game.players.black
export const selectWhitePlayer = (state: RootState) => state.game.players.white
export const selectHistory = (state: RootState) => state.game.history
export const selectCurrentStep = (state: RootState) => state.game.currentStep
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
export const defineCurrentPlayer = createSelector(
  selectBlackPlayer,
  selectWhitePlayer,
  selectCurrentPlayer,
  (blackPlayer, whitePlayer, color) => {
    if (color === 'white' && whitePlayer === 'bot') {
      return true
    }
    if (color === 'black' && blackPlayer === 'bot') {
      return true
    }
    return false
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
  (moves, king) => {
    return moves.filter(m => m.split('-')[1] === king)
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
  setPlayer,
  reverseMove,
  moveForward,
} = gameSlice.actions

export const startMove =
  (selected: CellType): AppThunk =>
  (dispatch, getState) => {
    dispatch(setHighlightId(null))
    const color = selectCurrentPlayer(getState())
    if (selected.figure?.color !== color) {
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
  const color = selectCurrentPlayer(getState())
  const figures = selectFiguresByColor(getState(), color)
  const id = nanoid()
  dispatch(setHighlightId(id))

  for (let i = 0; i < figures.length; i++) {
    const currentId = selectHighlightId(getState())
    if (id !== currentId) break
    dispatch(setSelected(figures[i]))
    const availableMoves = selectMoves(getState(), figures[i], true)
    if (availableMoves.length) {
      dispatch(highlightCells(availableMoves))
      await sleep(250)
      dispatch(turnOffHighlight())
    }
    dispatch(setSelected(null))
  }
}

export const randomMove = (): AppThunk => (dispatch, getState) => {
  const color = selectCurrentPlayer(getState())
  const allMoves = selectAllMovesByColor(getState(), color, true)
  const move = getRandomElement(allMoves)
  let board = selectBoard(getState())
  const [source, target] = move.split('-')
  dispatch(startMove(board[source]))
  board = selectBoard(getState())
  dispatch(endMove(board[target]))
}

export const historyTravel =
  (step: number): AppThunk =>
  (dispatch, getState) => {
    const history = selectHistory(getState())
    const currentStep = selectCurrentStep(getState())
    if (currentStep > step) {
      for (let i = currentStep - 1; i >= step; i--) {
        dispatch(reverseMove(history[i]))
      }
    } else if (currentStep < step) {
      for (let i = currentStep; i < step; i++) {
        dispatch(moveForward(history[i]))
      }
    }
  }

export default gameSlice.reducer

type Move = `${string}-${string}`
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
export type PlayerType = 'player' | 'bot'
export type RecordMove = {
  source: ChessPiece
  move: Move
  captured: ChessPiece | null
}
