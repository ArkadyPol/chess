import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import gameReducer, { decrementTimer } from '../features/game/gameSlice'

export const store = configureStore({
  reducer: {
    game: gameReducer,
  },
  devTools: { actionsBlacklist: [decrementTimer.type] },
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
