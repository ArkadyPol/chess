import { RootState } from 'app/store'
import { getOppositeColor } from './getOppositeColor'
import {
  CellType,
  selectBoard,
  selectCheckMovesByColor,
} from '../features/game/gameSlice'

export const filterChecks = (
  selected: CellType,
  targetCell: CellType,
  state: RootState
) => {
  const oppositeColor: 'white' | 'black' = getOppositeColor(
    selected.figure!.color
  )
  const source = selected.x + selected.y
  const target = targetCell.x + targetCell.y
  const board = selectBoard(state)
  const copyState = {
    ...state,
    game: {
      ...state.game,
      board: {
        ...board,
        [source]: { ...board[source], figure: null },
        [target]: { ...board[target], figure: selected.figure },
      },
    },
  }
  const checkMoves = selectCheckMovesByColor(copyState, oppositeColor, false)
  return checkMoves.length === 0
}
