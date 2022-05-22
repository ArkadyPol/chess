import { useAppSelector } from 'app/hooks'
import Board from './Board/Board'
import EngGame from './EngGame/EngGame'
import { selectWinner } from './gameSlice'
import History from './History/History'
import Settings from './Settings/Settings'
import Timer from './Timer/Timer'

const Game = () => {
  const winner = useAppSelector(selectWinner)
  return (
    <>
      <div>
        <Settings />
        <Timer />
      </div>
      <Board />
      <History />
      {winner && <EngGame />}
    </>
  )
}

export default Game
