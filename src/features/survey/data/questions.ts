import type { TextSurveyQuestion } from '../types'

export const NAME_MAX_LENGTH = 20

export const surveyTextQuestions: TextSurveyQuestion[] = [
  {
    id: 'firstName',
    prompt: 'Before we begin your adventure, what is your first name?',
    label: 'Trainer first name',
    placeholder: 'First name',
    maxLength: NAME_MAX_LENGTH,
    autoComplete: 'given-name',
  },
  {
    id: 'lastName',
    prompt: 'Great. Now, what is your last name?',
    label: 'Trainer last name',
    placeholder: 'Last name',
    maxLength: NAME_MAX_LENGTH,
    autoComplete: 'family-name',
  },
]
