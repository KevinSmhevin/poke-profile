import { useMemo, useState } from 'react'
import { DayPicker } from 'react-day-picker'
import { QuestionScreen } from '../QuestionScreen/QuestionScreen'
import { formatDateAnswer, parseDateAnswer } from '../../lib/dateAnswer'
import type { DateSurveyQuestion } from '../../types'

type DateQuestionStepProps = {
  question: DateSurveyQuestion
  value: string
  onValueChange: (value: string) => void
  onSubmit: () => void
}

export function DateQuestionStep({
  question,
  value,
  onValueChange,
  onSubmit,
}: DateQuestionStepProps) {
  const [showValidationError, setShowValidationError] = useState(false)
  const selectedDate = useMemo(() => parseDateAnswer(value), [value])

  const startMonth = new Date(question.fromYear, 0, 1)
  const endMonth = new Date(question.toYear, 11, 31)
  const today = new Date()

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) {
      onValueChange('')
      return
    }

    onValueChange(formatDateAnswer(date))
    if (showValidationError) {
      setShowValidationError(false)
    }
  }

  const handleSubmit = () => {
    if (!selectedDate) {
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
      errorMessage={showValidationError ? 'Please select your date of birth.' : undefined}
      onSubmit={handleSubmit}
    >
      <p className="pixel-label">{question.label}</p>
      <div className="dob-calendar-wrapper">
        <DayPicker
          mode="single"
          selected={selectedDate}
          onSelect={handleDateSelect}
          captionLayout="dropdown"
          startMonth={startMonth}
          endMonth={endMonth}
          disabled={{ after: today }}
        />
      </div>
    </QuestionScreen>
  )
}
