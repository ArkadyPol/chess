import { ColorType } from 'features/game/gameSlice'

export const getOppositeColor = (color: ColorType) => {
  switch (color) {
    case 'black':
      return 'white'

    case 'white':
      return 'black'
  }
}
