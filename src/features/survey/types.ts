export type SurveyAnswers = Record<string, string>

type BaseSurveyQuestion = {
  id: string
  type: 'text' | 'date' | 'pokemonType' | 'region' | 'starter'
  prompt: string
}

export type TextSurveyQuestion = BaseSurveyQuestion & {
  type: 'text'
  label: string
  placeholder: string
  maxLength: number
  autoComplete?: string
}

export type DateSurveyQuestion = BaseSurveyQuestion & {
  type: 'date'
  label: string
  fromYear: number
  toYear: number
}

export type PokemonTypeOption = {
  id: string
  label: string
  imageSrc: string
}

export type PokemonTypeSurveyQuestion = BaseSurveyQuestion & {
  type: 'pokemonType'
  label: string
  options: PokemonTypeOption[]
}

export type RegionOption = {
  id: string
  name: string
  label: string
}

export type RegionSurveyQuestion = BaseSurveyQuestion & {
  type: 'region'
  label: string
  options: RegionOption[]
}

export type StarterOption = {
  id: string
  name: string
  pokemonNumber: number
  gifSrc: string
}

export type StarterSurveyQuestion = BaseSurveyQuestion & {
  type: 'starter'
  label: string
  optionsByRegionId: Record<string, StarterOption[]>
}

export type SurveyQuestion =
  | TextSurveyQuestion
  | DateSurveyQuestion
  | PokemonTypeSurveyQuestion
  | RegionSurveyQuestion
  | StarterSurveyQuestion
