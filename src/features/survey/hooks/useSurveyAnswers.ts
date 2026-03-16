import { useCallback, useState } from 'react'
import type { SurveyAnswers } from '../types'

export function useSurveyAnswers(initialAnswers: SurveyAnswers = {}) {
  const [answers, setAnswers] = useState<SurveyAnswers>(initialAnswers)

  const setAnswer = useCallback((questionId: string, answer: string) => {
    setAnswers((currentAnswers) => ({
      ...currentAnswers,
      [questionId]: answer,
    }))
  }, [])

  return {
    answers,
    setAnswer,
  }
}
