export type SurveyAnswers = Record<string, string>

type BaseSurveyQuestion = {
  id: string
  type:
    | 'text'
    | 'date'
    | 'pokemonType'
    | 'region'
    | 'starter'
    | 'traits'
    | 'pseudoLegendary'
    | 'wildEncounter'
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

export type TraitOption = {
  id: string
  label: string
  eeveelutionName: string
  eeveelutionNumber: number
  eeveelutionType: string
  gifSrc: string
}

export type TraitsSurveyQuestion = BaseSurveyQuestion & {
  type: 'traits'
  label: string
  options: TraitOption[]
}

export type PseudoLegendaryOption = {
  id: string
  label: string
  pseudoLegendaryName: string
  pseudoLegendaryNumber: number
  gifSrc: string
}

export type PseudoLegendarySurveyQuestion = BaseSurveyQuestion & {
  type: 'pseudoLegendary'
  label: string
  options: PseudoLegendaryOption[]
}

export type WildEncounterSurveyQuestion = BaseSurveyQuestion & {
  type: 'wildEncounter'
  label: string
  optionCount: number
  minLoadingMs: number
  initialApproachPrompt: string
  rerollApproachPrompt: string
}

export type SurveyQuestion =
  | TextSurveyQuestion
  | DateSurveyQuestion
  | PokemonTypeSurveyQuestion
  | RegionSurveyQuestion
  | StarterSurveyQuestion
  | TraitsSurveyQuestion
  | PseudoLegendarySurveyQuestion
  | WildEncounterSurveyQuestion
