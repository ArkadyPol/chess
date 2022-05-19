import { useAppSelector } from 'app/hooks'
import Board from './Board/Board'
import EngGame from './EngGame/EngGame'
import { selectWinner } from './gameSlice'
import Timer from './Timer/Timer'

const Game = () => {
  const winner = useAppSelector(selectWinner)
  return (
    <>
      <Timer />
      <Board />
      {winner && <EngGame />}
    </>
  )
}

export default Game
