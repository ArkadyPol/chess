import Game from './features/game/Game'
import './App.css'
import LostFigures from 'features/game/LostFigures/LostFigures'
import { useAppSelector } from 'app/hooks'

function App() {
  const lostBlackFigures = useAppSelector(state => state.game.lostBlackFigures)
  const lostWhiteFigures = useAppSelector(state => state.game.lostWhiteFigures)
  return (
    <div className="app">
      <Game />
      <div>
        <LostFigures title={'Black figures'} figures={lostBlackFigures} />
        <LostFigures title={'White figures'} figures={lostWhiteFigures} />
      </div>
    </div>
  )
}

export default App
