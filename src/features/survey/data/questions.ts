export type SurveyQuestion = {
  id: string
  prompt: string
  choices: Array<{
    id: string
    label: string
    weight: number
  }>
}

export const surveyQuestions: SurveyQuestion[] = [
  {
    id: 'starter',
    prompt: 'A rival challenges you. What is your first move?',
    choices: [
      { id: 'charge', label: 'Charge in with confidence.', weight: 3 },
      { id: 'observe', label: 'Study the field first.', weight: 2 },
      { id: 'support', label: 'Back up your team.', weight: 1 },
    ],
  },
]
