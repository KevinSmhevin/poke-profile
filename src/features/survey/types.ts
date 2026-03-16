export type SurveyAnswers = Record<string, string>

export type TextSurveyQuestion = {
  id: string
  prompt: string
  label: string
  placeholder: string
  maxLength: number
  autoComplete?: string
}
