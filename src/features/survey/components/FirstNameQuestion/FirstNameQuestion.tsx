import { useState } from 'react'
import { QuestionScreen } from '../QuestionScreen/QuestionScreen'
import { TextAnswerField } from '../AnswerFields/TextAnswerField/TextAnswerField'
import type { TextSurveyQuestion } from '../../types'
import { isValidFirstName, sanitizeFirstNameInput } from '../../lib/firstNameValidation'

type FirstNameQuestionProps = {
  question: TextSurveyQuestion
  value: string
  onValueChange: (value: string) => void
  onSubmit: () => void
}

export function FirstNameQuestion({
  question,
  value,
  onValueChange,
  onSubmit,
}: FirstNameQuestionProps) {
  const [showValidationError, setShowValidationError] = useState(false)

  const handleInputChange = (rawValue: string) => {
    const sanitizedValue = sanitizeFirstNameInput(rawValue)
    onValueChange(sanitizedValue)

    if (showValidationError) {
      setShowValidationError(!isValidFirstName(sanitizedValue))
    }
  }

  const handleSubmit = () => {
    if (!isValidFirstName(value)) {
      setShowValidationError(true)
      return
    }

    setShowValidationError(false)
    onSubmit()
  }

  const validationMessage = showValidationError
    ? `Use letters only (A-Z), up to ${question.maxLength} characters.`
    : undefined

  return (
    <QuestionScreen
      prompt={question.prompt}
      submitLabel="Continue"
      errorMessage={validationMessage}
      onSubmit={handleSubmit}
    >
      <TextAnswerField
        id={question.id}
        label="Trainer first name"
        autoComplete="given-name"
        maxLength={question.maxLength}
        placeholder={question.placeholder}
        value={value}
        onValueChange={handleInputChange}
      />
    </QuestionScreen>
  )
}
