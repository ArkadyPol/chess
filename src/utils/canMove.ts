import { CellType } from '../features/game/gameSlice'
import { translateCoords } from './createBoard'

const findCell = (board: CellType[], coords: CoordsType) => {
  return board[coords.y * 8 + coords.x]
}

const checkVertical = (
  target: CoordsType,
  selected: CoordsType,
  board: CellType[]
) => {
  if (selected.x !== target.x) return false

  const min = Math.min(selected.y, target.y)
  const max = Math.max(selected.y, target.y)

  for (let y = min + 1; y < max; y++) {
    if (findCell(board, { x: selected.x, y }).figure) {
      return false
    }
  }
  return true
}

const checkHorizontal = (
  target: CoordsType,
  selected: CoordsType,
  board: CellType[]
) => {
  if (selected.y !== target.y) return false

  const min = Math.min(selected.x, target.x)
  const max = Math.max(selected.x, target.x)

  for (let x = min + 1; x < max; x++) {
    if (findCell(board, { x, y: selected.y }).figure) {
      return false
    }
  }
  return true
}

const checkDiagonal = (
  target: CoordsType,
  selected: CoordsType,
  board: CellType[]
) => {
  const absX = Math.abs(target.x - selected.x)
  const absY = Math.abs(target.y - selected.y)
  if (absX !== absY) return false

  const dy = selected.y < target.y ? 1 : -1
  const dx = selected.x < target.x ? 1 : -1

  for (let i = 1; i < absY; i++) {
    if (
      findCell(board, { x: selected.x + dx * i, y: selected.y + dy * i }).figure
    ) {
      return false
    }
  }

  return true
}

export const canMove = (
  target: CellType,
  selected: CellType,
  board: CellType[]
): boolean => {
  if (!selected.figure) {
    return false
  }
  if (target.figure?.color === selected.figure.color) {
    return false
  }

  const selectedCoords = translateCoords(selected)
  const targetCoords = translateCoords(target)

  switch (selected.figure.type) {
    case 'queen':
      if (checkVertical(targetCoords, selectedCoords, board)) {
        return true
      }
      if (checkHorizontal(targetCoords, selectedCoords, board)) {
        return true
      }
      if (checkDiagonal(targetCoords, selectedCoords, board)) {
        return true
      }
      return false
    case 'rook':
      if (checkVertical(targetCoords, selectedCoords, board)) {
        return true
      }
      if (checkHorizontal(targetCoords, selectedCoords, board)) {
        return true
      }
      return false
    case 'bishop':
      if (checkDiagonal(targetCoords, selectedCoords, board)) {
        return true
      }
      return false
    case 'knight':
      const absX = Math.abs(targetCoords.x - selectedCoords.x)
      const absY = Math.abs(targetCoords.y - selectedCoords.y)
      return (absX === 2 && absY === 1) || (absX === 1 && absY === 2)
    case 'pawn':
      let dy = selected.figure.color === 'white' ? -1 : 1
      const firstPosition = selected.figure.color === 'white' ? 6 : 1
      const isFirstStep = selectedCoords.y === firstPosition
      const isEmpty = !findCell(board, targetCoords).figure
      const isFirstCellAhead = selectedCoords.y + dy === targetCoords.y
      const isSecondCellAhead =
        isFirstStep && selectedCoords.y + dy * 2 === targetCoords.y

      if (
        (isFirstCellAhead || isSecondCellAhead) &&
        selectedCoords.x === targetCoords.x &&
        isEmpty
      ) {
        return true
      }

      if (
        isFirstCellAhead &&
        (selectedCoords.x + 1 === targetCoords.x ||
          selectedCoords.x - 1 === targetCoords.x) &&
        !isEmpty
      ) {
        return true
      }
      return false
    case 'king': {
      const absX = Math.abs(targetCoords.x - selectedCoords.x)
      const absY = Math.abs(targetCoords.y - selectedCoords.y)
      return absX <= 1 && absY <= 1
    }
  }
}

type CoordsType = {
  x: number
  y: number
}
