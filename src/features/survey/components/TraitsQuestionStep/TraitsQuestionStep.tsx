import { useState } from 'react'
import { QuestionScreen } from '../QuestionScreen/QuestionScreen'
import type { TraitsSurveyQuestion } from '../../types'

type TraitsQuestionStepProps = {
  question: TraitsSurveyQuestion
  value: string
  onValueChange: (value: string) => void
  onSubmit: () => void
}

export function TraitsQuestionStep({
  question,
  value,
  onValueChange,
  onSubmit,
}: TraitsQuestionStepProps) {
  const [showValidationError, setShowValidationError] = useState(false)

  const handleSubmit = () => {
    const isValidSelection = question.options.some((option) => option.id === value)

    if (!isValidSelection) {
      setShowValidationError(true)
      return
    }

    setShowValidationError(false)
    onSubmit()
  }

  return (
    <QuestionScreen
      prompt={question.prompt}
      submitLabel="Continue"
      errorMessage={showValidationError ? 'Please choose one trait pair.' : undefined}
      onSubmit={handleSubmit}
    >
      <p className="pixel-label">{question.label}</p>
      <div className="trait-option-grid" role="radiogroup" aria-label={question.label}>
        {question.options.map((option) => {
          const isSelected = value === option.id

          return (
            <button
              key={option.id}
              type="button"
              className={`trait-option-button${isSelected ? ' is-selected' : ''}`}
              onClick={() => {
                onValueChange(option.id)
                if (showValidationError) {
                  setShowValidationError(false)
                }
              }}
              role="radio"
              aria-checked={isSelected}
            >
              {option.label}
            </button>
          )
        })}
      </div>
    </QuestionScreen>
  )
}
