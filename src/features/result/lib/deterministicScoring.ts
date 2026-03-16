import type { SurveyAnswers } from '../../survey/types'

const pokemonByBucket = ['pikachu', 'bulbasaur', 'charmander', 'squirtle'] as const

function hashInput(input: string): number {
  let hash = 0
  for (let index = 0; index < input.length; index += 1) {
    hash = (hash * 31 + input.charCodeAt(index)) >>> 0
  }

  return hash
}

export function getDeterministicPokemonResult(answers: SurveyAnswers): string {
  const serialized = Object.keys(answers)
    .sort()
    .map((key) => `${key}:${answers[key]}`)
    .join('|')

  if (!serialized) {
    return pokemonByBucket[0]
  }

  const bucket = hashInput(serialized) % pokemonByBucket.length
  return pokemonByBucket[bucket]
}
