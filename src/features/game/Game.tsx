import { useAppSelector } from 'app/hooks'
import Board from './Board/Board'
import EngGame from './EngGame/EngGame'
import { selectWinner } from './gameSlice'
import LostFigures from './LostFigures/LostFigures'
import History from './History/History'
import Settings from './Settings/Settings'
import Timer from './Timer/Timer'

const Game = () => {
  const winner = useAppSelector(selectWinner)
  const lostBlackFigures = useAppSelector(state => state.game.lostBlackFigures)
  const lostWhiteFigures = useAppSelector(state => state.game.lostWhiteFigures)
  return (
    <>
      <div>
        <Settings />
        <Timer />
      </div>
      <Board />
      <div>
        <LostFigures title={'Black figures'} figures={lostBlackFigures} />
        <LostFigures title={'White figures'} figures={lostWhiteFigures} />
      </div>
      <History />

      {winner && <EngGame />}
    </>
  )
}

export default Game
