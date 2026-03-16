import { useState } from 'react'
import { getDeterministicPokemonResult } from '../../../result/lib/deterministicScoring'
import { surveyQuestions } from '../../data/questions'
import { useSurveyAnswers } from '../../hooks/useSurveyAnswers'
import { DateQuestionStep } from '../DateQuestionStep/DateQuestionStep'
import { TextQuestionStep } from '../TextQuestionStep/TextQuestionStep'
import { TypewriterPrompt } from '../TypewriterPrompt/TypewriterPrompt'

export function SurveyFlow() {
  const { answers, setAnswer } = useSurveyAnswers()
  const [hasStartedJourney, setHasStartedJourney] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [isSurveySubmitted, setIsSurveySubmitted] = useState(false)

  const hasActiveQuestion = hasStartedJourney && currentQuestionIndex < surveyQuestions.length
  const activeQuestion = hasActiveQuestion ? surveyQuestions[currentQuestionIndex] : null
  const activeQuestionValue = activeQuestion ? (answers[activeQuestion.id] ?? '') : ''

  const trainerFullName =
    surveyQuestions
      .filter((question) => question.id === 'firstName' || question.id === 'lastName')
      .map((question) => answers[question.id])
      .filter(Boolean)
      .join(' ') || 'Not set yet'
  const dobAnswer = answers.dateOfBirth ?? 'Not set yet'
  const previewResult = getDeterministicPokemonResult(answers)

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

  return (
    <>
      {!hasStartedJourney ? (
        <div className="game-panel">
          <TypewriterPrompt text="A new Pokemon journey is about to begin..." />
          <button
            type="button"
            className="pixel-button"
            onClick={() => setHasStartedJourney(true)}
          >
            Begin Journey
          </button>
        </div>
      ) : null}

      {activeQuestion ? (
        activeQuestion.type === 'text' ? (
          <TextQuestionStep
            question={activeQuestion}
            value={activeQuestionValue}
            onValueChange={handleCurrentQuestionValueChange}
            onSubmit={handleCurrentQuestionSubmit}
          />
        ) : (
          <DateQuestionStep
            question={activeQuestion}
            value={activeQuestionValue}
            onValueChange={handleCurrentQuestionValueChange}
            onSubmit={handleCurrentQuestionSubmit}
          />
        )
      ) : null}

      {hasStartedJourney ? (
        <div className="game-panel">
          <p>
            Current trainer name: <strong>{trainerFullName}</strong>
          </p>
          <p>
            Date of birth: <strong>{dobAnswer}</strong>
          </p>
          {isSurveySubmitted ? (
            <p className="saved-note">Profile saved. Ready for personality questions.</p>
          ) : null}
          <p>
            Deterministic preview result: <strong>{previewResult}</strong>
          </p>
        </div>
      ) : null}
    </>
  )
}
