export type SurveyAnswers = Record<string, string>

export type TextSurveyQuestion = {
  id: string
  prompt: string
  placeholder: string
  maxLength: number
}
