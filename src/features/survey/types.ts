export type SurveyAnswers = Record<string, string>

type BaseSurveyQuestion = {
  id: string
  type: 'text' | 'date'
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

export type SurveyQuestion = TextSurveyQuestion | DateSurveyQuestion
