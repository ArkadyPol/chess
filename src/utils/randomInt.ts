export const randomInt = (...args: [number, number] | [number]) => {
  let min = 0
  let max: number
  if (args.length === 2) {
    ;[min, max] = args
  } else {
    max = args[0]
  }

  const rand = min + Math.random() * (max + 1 - min)
  return Math.floor(rand)
}

export const getRandomElement = <T>(arr: T[]) => {
  const rand = randomInt(arr.length - 1)
  return arr[rand]
}
