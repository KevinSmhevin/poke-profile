import type { SurveyAnswers } from '../../survey/types'
import { LEGENDARY_POKEMON_NUMBERS } from '../data/legendaryPokemonNumbers'

const POKEMON_RESULT_COUNT = 1025
const HASH_ALGORITHM_VERSION = 'v1'

function normalizeInputValue(value: string | undefined): string {
  return (value ?? '')
    .trim()
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
}

export function getDeterministicInputSignature(answers: SurveyAnswers): string {
  const firstName = normalizeInputValue(answers.firstName)
  const lastName = normalizeInputValue(answers.lastName)
  const dateOfBirth = normalizeInputValue(answers.dateOfBirth)
  const region = normalizeInputValue(answers.trainerRegion)
  const favoriteType = normalizeInputValue(answers.favoritePokemonType)

  return [
    `algorithm:${HASH_ALGORITHM_VERSION}`,
    `firstName:${firstName}`,
    `lastName:${lastName}`,
    `dateOfBirth:${dateOfBirth}`,
    `region:${region}`,
    `favoriteType:${favoriteType}`,
  ].join('|')
}

function hasValidDateInput(dateOfBirth: string | undefined): boolean {
  if (!dateOfBirth) {
    return false
  }

  return /^\d{4}-\d{2}-\d{2}$/.test(dateOfBirth)
}

export function hasRequiredIdentityAnswers(answers: SurveyAnswers): boolean {
  const firstName = normalizeInputValue(answers.firstName)
  const lastName = normalizeInputValue(answers.lastName)
  const dateOfBirth = normalizeInputValue(answers.dateOfBirth)

  return Boolean(firstName) && Boolean(lastName) && hasValidDateInput(dateOfBirth)
}

export function hasRequiredLegendaryAnswers(answers: SurveyAnswers): boolean {
  const pseudoLegendaryPartner = normalizeInputValue(answers.pseudoLegendaryPartner)
  return hasRequiredIdentityAnswers(answers) && Boolean(pseudoLegendaryPartner)
}

async function hashInputToUint32(input: string): Promise<number> {
  const encoder = new TextEncoder()
  const inputBytes = encoder.encode(input)
  const hashBuffer = await crypto.subtle.digest('SHA-256', inputBytes)
  const dataView = new DataView(hashBuffer)

  return dataView.getUint32(0, false)
}

export async function getDeterministicPokemonNumber(
  answers: SurveyAnswers,
): Promise<number> {
  const deterministicInput = getDeterministicInputSignature(answers)
  const hashValue = await hashInputToUint32(deterministicInput)

  return (hashValue % POKEMON_RESULT_COUNT) + 1
}

export function getLegendaryInputSignature(answers: SurveyAnswers): string {
  const firstName = normalizeInputValue(answers.firstName)
  const lastName = normalizeInputValue(answers.lastName)
  const dateOfBirth = normalizeInputValue(answers.dateOfBirth)
  const pseudoLegendaryPartner = normalizeInputValue(answers.pseudoLegendaryPartner)

  return [
    `algorithm:${HASH_ALGORITHM_VERSION}`,
    'resultPool:legendary',
    `firstName:${firstName}`,
    `lastName:${lastName}`,
    `dateOfBirth:${dateOfBirth}`,
    `pseudoLegendaryPartner:${pseudoLegendaryPartner}`,
  ].join('|')
}

export async function getDeterministicLegendaryPokemonNumber(
  answers: SurveyAnswers,
): Promise<number> {
  const legendaryInput = getLegendaryInputSignature(answers)
  const hashValue = await hashInputToUint32(legendaryInput)
  const index = hashValue % LEGENDARY_POKEMON_NUMBERS.length

  return LEGENDARY_POKEMON_NUMBERS[index]
}

export function formatPokemonDisplayName(name: string): string {
  if (!name) {
    return ''
  }

  return name
    .split('-')
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(' ')
}
