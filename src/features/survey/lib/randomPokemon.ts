const MAX_POKEDEX_NUMBER = 1025

export function generateUniqueRandomPokemonNumbers(count: number): number[] {
  if (count > MAX_POKEDEX_NUMBER) {
    throw new Error('Requested random Pokemon count exceeds available range.')
  }

  const numbers = new Set<number>()

  while (numbers.size < count) {
    const value = new Uint32Array(1)
    crypto.getRandomValues(value)
    const pokemonNumber = (value[0] % MAX_POKEDEX_NUMBER) + 1
    numbers.add(pokemonNumber)
  }

  return [...numbers]
}

export function waitForDuration(durationMs: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, durationMs)
  })
}
