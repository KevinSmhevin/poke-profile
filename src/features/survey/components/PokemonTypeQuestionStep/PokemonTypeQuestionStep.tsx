import { useMemo, useState } from 'react'
import { QuestionScreen } from '../QuestionScreen/QuestionScreen'
import type { PokemonTypeSurveyQuestion } from '../../types'

type PokemonTypeQuestionStepProps = {
  question: PokemonTypeSurveyQuestion
  value: string
  onValueChange: (value: string) => void
  onSubmit: () => void
}

export function PokemonTypeQuestionStep({
  question,
  value,
  onValueChange,
  onSubmit,
}: PokemonTypeQuestionStepProps) {
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
      errorMessage={showValidationError ? 'Please choose one Pokemon type.' : undefined}
      onSubmit={handleSubmit}
    >
      <p className="pixel-label">{question.label}</p>
      <div className="type-option-grid" role="radiogroup" aria-label={question.label}>
        {question.options.map((option) => {
          const isSelected = value === option.id

          return (
            <button
              key={option.id}
              type="button"
              className={`type-option-button${isSelected ? ' is-selected' : ''}`}
              onClick={() => {
                onValueChange(option.id)
                if (showValidationError) {
                  setShowValidationError(false)
                }
              }}
              role="radio"
              aria-checked={isSelected}
              aria-label={option.label}
            >
              <img
                src={option.imageSrc}
                alt=""
                aria-hidden="true"
                className="type-option-image"
                loading="lazy"
              />
              <span className="sr-only">{option.label}</span>
            </button>
          )
        })}
      </div>
    </QuestionScreen>
  )
}
