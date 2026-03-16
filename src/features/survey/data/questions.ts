import type { SurveyQuestion } from '../types'

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

const pokemonTypeOptions = POKEMON_TYPES.map((type) => ({
  id: type,
  label: `${type.charAt(0).toUpperCase()}${type.slice(1)}`,
  imageSrc: `/images/pokemon-types/name-icons/${type}.png`,
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
]
