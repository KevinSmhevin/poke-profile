import { useEffect, useMemo, useState } from 'react'
import { parseSharedResultsFromUrl } from '../../../result/services/resultsShare'
import { surveyQuestions } from '../../data/questions'
import { useSurveyAnswers } from '../../hooks/useSurveyAnswers'
import { SurveyQuestions } from './SurveyQuestions'
import { SurveyResults } from './SurveyResults'
import { SurveyStart } from './SurveyStart'

type SurveyFlowProps = {
  onHasStartedJourneyChange?: (hasStartedJourney: boolean) => void
}

export function SurveyFlow({ onHasStartedJourneyChange }: SurveyFlowProps) {
  const sharedResultsAnswers = useMemo(() => {
    if (typeof window === 'undefined') {
      return null
    }

    return parseSharedResultsFromUrl(window.location.search)
  }, [])
  const { answers, setAnswer, resetAnswers } = useSurveyAnswers(sharedResultsAnswers ?? {})
  const [hasStartedJourney, setHasStartedJourney] = useState(Boolean(sharedResultsAnswers))
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [isSurveySubmitted, setIsSurveySubmitted] = useState(Boolean(sharedResultsAnswers))
  useEffect(() => {
    onHasStartedJourneyChange?.(hasStartedJourney)
  }, [hasStartedJourney, onHasStartedJourneyChange])

  const hasActiveQuestion = hasStartedJourney && currentQuestionIndex < surveyQuestions.length
  const activeQuestion = hasActiveQuestion ? surveyQuestions[currentQuestionIndex] : null
  const activeQuestionValue = activeQuestion ? (answers[activeQuestion.id] ?? '') : ''

  const handleCurrentQuestionValueChange = (value: string) => {
    if (!activeQuestion) {
      return
    }

    setAnswer(activeQuestion.id, value)
  }

  const handleCurrentQuestionSubmit = () => {
    const isLastQuestion = currentQuestionIndex >= surveyQuestions.length - 1

    if (isLastQuestion) {
      setIsSurveySubmitted(true)
      return
    }

    setCurrentQuestionIndex((index) => index + 1)
  }

  const handleRetakeQuiz = () => {
    resetAnswers()
    setHasStartedJourney(false)
    setCurrentQuestionIndex(0)
    setIsSurveySubmitted(false)
    if (typeof window !== 'undefined' && window.location.search) {
      const path = `${window.location.pathname}${window.location.hash}`
      window.history.replaceState({}, '', path)
    }
  }

  return (
    <>
      {!hasStartedJourney ? <SurveyStart onStartJourney={() => setHasStartedJourney(true)} /> : null}

      {activeQuestion && !isSurveySubmitted ? (
        <SurveyQuestions
          question={activeQuestion}
          value={activeQuestionValue}
          answers={answers}
          onValueChange={handleCurrentQuestionValueChange}
          onSubmit={handleCurrentQuestionSubmit}
        />
      ) : null}

      {isSurveySubmitted ? (
        <SurveyResults
          answers={answers}
          startInCompleteMode={Boolean(sharedResultsAnswers)}
          onRetakeQuiz={handleRetakeQuiz}
        />
      ) : null}
    </>
  )
}
