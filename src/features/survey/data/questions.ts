import type { SurveyQuestion } from '../types'
import { starterOptionsByRegionId } from './starterOptionsByRegion'

export const NAME_MAX_LENGTH = 20
const CURRENT_YEAR = new Date().getFullYear()
const POKEMON_TYPES = [
  'normal',
  'fire',
  'water',
  'electric',
  'grass',
  'ice',
  'fighting',
  'poison',
  'ground',
  'flying',
  'psychic',
  'bug',
  'rock',
  'ghost',
  'dragon',
  'dark',
  'steel',
  'fairy',
] as const
const REGION_NAMES = [
  'kanto',
  'johto',
  'hoenn',
  'sinnoh',
  'unova',
  'kalos',
  'alola',
  'galar',
  'hisui',
  'paldea',
] as const

const pokemonTypeOptions = POKEMON_TYPES.map((type) => ({
  id: type,
  label: `${type.charAt(0).toUpperCase()}${type.slice(1)}`,
  imageSrc: `/images/pokemon-types/name-icons/${type}.png`,
}))

const regionOptions = REGION_NAMES.map((name, index) => ({
  id: String(index + 1),
  name,
  label: `${index + 1}. ${name.charAt(0).toUpperCase()}${name.slice(1)}`,
}))

export const surveyQuestions: SurveyQuestion[] = [
  {
    type: 'text',
    id: 'firstName',
    prompt: 'Before we begin your adventure, what is your first name?',
    label: 'Trainer first name',
    placeholder: 'First name',
    maxLength: NAME_MAX_LENGTH,
    autoComplete: 'given-name',
  },
  {
    type: 'text',
    id: 'lastName',
    prompt: 'Great. Now, what is your last name?',
    label: 'Trainer last name',
    placeholder: 'Last name',
    maxLength: NAME_MAX_LENGTH,
    autoComplete: 'family-name',
  },
  {
    type: 'date',
    id: 'dateOfBirth',
    prompt: 'Now choose your date of birth.',
    label: 'Date of birth',
    fromYear: CURRENT_YEAR - 120,
    toYear: CURRENT_YEAR,
  },
  {
    type: 'pokemonType',
    id: 'favoritePokemonType',
    prompt: 'What is your favorite Pokemon type?',
    label: 'Favorite Pokemon type',
    options: pokemonTypeOptions,
  },
  {
    type: 'region',
    id: 'trainerRegion',
    prompt: 'Which region do you hail from?',
    label: 'Trainer region',
    options: regionOptions,
  },
  {
    type: 'starter',
    id: 'starterPokemon',
    prompt: 'Choose your starter Pokemon.',
    label: 'Starter Pokemon',
    optionsByRegionId: starterOptionsByRegionId,
  },
]
