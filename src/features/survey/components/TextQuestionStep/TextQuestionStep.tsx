import { useState } from 'react'
import { TextAnswerField } from '../AnswerFields/TextAnswerField/TextAnswerField'
import { QuestionScreen } from '../QuestionScreen/QuestionScreen'
import { isValidName, sanitizeNameInput } from '../../lib/nameValidation'
import type { TextSurveyQuestion } from '../../types'

type TextQuestionStepProps = {
  question: TextSurveyQuestion
  value: string
  onValueChange: (value: string) => void
  onSubmit: () => void
}

export function TextQuestionStep({
  question,
  value,
  onValueChange,
  onSubmit,
}: TextQuestionStepProps) {
  const [showValidationError, setShowValidationError] = useState(false)

  const handleInputChange = (rawValue: string) => {
    const sanitizedValue = sanitizeNameInput(rawValue, question.maxLength)
    onValueChange(sanitizedValue)

    if (showValidationError) {
      setShowValidationError(!isValidName(sanitizedValue, question.maxLength))
    }
  }

  const handleSubmit = () => {
    if (!isValidName(value, question.maxLength)) {
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
        label={question.label}
        autoComplete={question.autoComplete}
        maxLength={question.maxLength}
        placeholder={question.placeholder}
        value={value}
        onValueChange={handleInputChange}
      />
    </QuestionScreen>
  )
}
