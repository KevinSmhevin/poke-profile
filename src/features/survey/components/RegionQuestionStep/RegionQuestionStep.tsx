import { useMemo, useState } from 'react'
import { QuestionScreen } from '../QuestionScreen/QuestionScreen'
import type { RegionSurveyQuestion } from '../../types'

type RegionQuestionStepProps = {
  question: RegionSurveyQuestion
  value: string
  onValueChange: (value: string) => void
  onSubmit: () => void
}

export function RegionQuestionStep({
  question,
  value,
  onValueChange,
  onSubmit,
}: RegionQuestionStepProps) {
  const [showValidationError, setShowValidationError] = useState(false)
  const validOptionIds = useMemo(
    () => new Set(question.options.map((option) => option.id)),
    [question.options],
  )

  const handleSubmit = () => {
    if (!value || !validOptionIds.has(value)) {
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
      errorMessage={showValidationError ? 'Please select your region.' : undefined}
      onSubmit={handleSubmit}
    >
      <p className="pixel-label">{question.label}</p>
      <div className="region-option-grid" role="radiogroup" aria-label={question.label}>
        {question.options.map((option) => {
          const isSelected = value === option.id

          return (
            <button
              key={option.id}
              type="button"
              className={`region-option-button${isSelected ? ' is-selected' : ''}`}
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
