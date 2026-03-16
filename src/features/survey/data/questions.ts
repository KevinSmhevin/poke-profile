import type { TextSurveyQuestion } from '../types'

export const FIRST_NAME_MAX_LENGTH = 20

export const firstNameQuestion: TextSurveyQuestion = {
  id: 'firstName',
  prompt: 'Before we begin your adventure, what is your first name?',
  placeholder: 'Trainer name',
  maxLength: FIRST_NAME_MAX_LENGTH,
}
