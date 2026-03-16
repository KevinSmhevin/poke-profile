import { useState } from 'react'
import { QuestionScreen } from '../QuestionScreen/QuestionScreen'
import type { StarterSurveyQuestion } from '../../types'

type StarterQuestionStepProps = {
  question: StarterSurveyQuestion
  selectedRegionId: string
  value: string
  onValueChange: (value: string) => void
  onSubmit: () => void
}

export function StarterQuestionStep({
  question,
  selectedRegionId,
  value,
  onValueChange,
  onSubmit,
}: StarterQuestionStepProps) {
  const [showValidationError, setShowValidationError] = useState(false)
  const starterOptions = question.optionsByRegionId[selectedRegionId] ?? []
  const validOptionIds = new Set(starterOptions.map((option) => option.id))

  const handleSubmit = () => {
    if (!value || !validOptionIds.has(value)) {
      setShowValidationError(true)
      return
    }

    setShowValidationError(false)
    onSubmit()
  }

  const noRegionSelected = !selectedRegionId
  const noStarterOptions = starterOptions.length === 0
  const validationMessage = noRegionSelected
    ? 'Please select your region first.'
    : noStarterOptions
      ? 'Starter options are unavailable for this region.'
      : showValidationError
        ? 'Please choose one starter Pokemon.'
        : undefined

  return (
    <QuestionScreen
      prompt={question.prompt}
      submitLabel="Continue"
      errorMessage={validationMessage}
      onSubmit={handleSubmit}
    >
      <p className="pixel-label">{question.label}</p>
      <div className="starter-option-grid" role="radiogroup" aria-label={question.label}>
        {starterOptions.map((option) => {
          const isSelected = value === option.id

          return (
            <button
              key={option.id}
              type="button"
              className={`starter-option-button${isSelected ? ' is-selected' : ''}`}
              onClick={() => {
                onValueChange(option.id)
                if (showValidationError) {
                  setShowValidationError(false)
                }
              }}
              role="radio"
              aria-checked={isSelected}
              aria-label={option.name}
            >
              <img
                src={option.gifSrc}
                alt=""
                aria-hidden="true"
                className="starter-option-gif"
                loading="lazy"
              />
              <span className="starter-option-name">{option.name}</span>
            </button>
          )
        })}
      </div>
    </QuestionScreen>
  )
}
