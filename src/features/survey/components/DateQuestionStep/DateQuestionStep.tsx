import { Component, useEffect, useMemo, useState, type ChangeEvent, type ReactNode } from 'react'
import DatePicker from 'react-mobile-datepicker'
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

type MobileDatePickerErrorBoundaryProps = {
  onError: () => void
  children: ReactNode
}

type MobileDatePickerErrorBoundaryState = {
  hasError: boolean
}

class MobileDatePickerErrorBoundary extends Component<
  MobileDatePickerErrorBoundaryProps,
  MobileDatePickerErrorBoundaryState
> {
  state: MobileDatePickerErrorBoundaryState = {
    hasError: false,
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch() {
    this.props.onError()
  }

  render() {
    if (this.state.hasError) {
      return null
    }

    return this.props.children
  }
}

export function DateQuestionStep({
  question,
  value,
  onValueChange,
  onSubmit,
}: DateQuestionStepProps) {
  const [showValidationError, setShowValidationError] = useState(false)
  const [isMobileViewport, setIsMobileViewport] = useState(false)
  const [isMobilePickerOpen, setIsMobilePickerOpen] = useState(false)
  const [hasMobilePickerRuntimeError, setHasMobilePickerRuntimeError] = useState(false)
  const selectedDate = useMemo(() => parseDateAnswer(value), [value])

  const startMonth = new Date(question.fromYear, 0, 1)
  const endMonth = new Date(question.toYear, 11, 31)
  const today = new Date()
  const maxSelectableDate = today < endMonth ? today : endMonth
  const selectedDateLabel = selectedDate
    ? selectedDate.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Select your date of birth'

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 47.99rem)')
    const syncViewportState = () => setIsMobileViewport(mediaQuery.matches)

    syncViewportState()

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', syncViewportState)
      return () => mediaQuery.removeEventListener('change', syncViewportState)
    }

    mediaQuery.addListener(syncViewportState)
    return () => mediaQuery.removeListener(syncViewportState)
  }, [])

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

  const handleMobileDateSelect = (date: Date) => {
    onValueChange(formatDateAnswer(date))
    if (showValidationError) {
      setShowValidationError(false)
    }
    setIsMobilePickerOpen(false)
  }

  const handleNativeMobileDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedValue = event.target.value
    if (!selectedValue) {
      onValueChange('')
      return
    }

    onValueChange(selectedValue)
    if (showValidationError) {
      setShowValidationError(false)
    }
  }

  return (
    <QuestionScreen
      prompt={question.prompt}
      submitLabel="Continue"
      errorMessage={showValidationError ? 'Please select your date of birth.' : undefined}
      onSubmit={handleSubmit}
    >
      <p className="pixel-label">{question.label}</p>
      {isMobileViewport ? (
        <div className="dob-mobile-picker">
          {hasMobilePickerRuntimeError ? (
            <input
              type="date"
              className="pixel-input dob-mobile-picker-trigger"
              value={value}
              min={formatDateAnswer(startMonth)}
              max={formatDateAnswer(maxSelectableDate)}
              onChange={handleNativeMobileDateChange}
            />
          ) : (
            <>
              <button
                type="button"
                className="pixel-input dob-mobile-picker-trigger"
                onClick={() => setIsMobilePickerOpen(true)}
              >
                {selectedDateLabel}
              </button>
              {isMobilePickerOpen ? (
                <MobileDatePickerErrorBoundary
                  onError={() => {
                    setHasMobilePickerRuntimeError(true)
                    setIsMobilePickerOpen(false)
                  }}
                >
                  <DatePicker
                    isOpen
                    value={selectedDate ?? maxSelectableDate}
                    min={startMonth}
                    max={maxSelectableDate}
                    theme="dark"
                    headerFormat="YYYY/MM/DD"
                    dateConfig={{
                      year: {
                        format: 'YYYY',
                        caption: 'Year',
                        step: 1,
                      },
                      month: {
                        format: 'MM',
                        caption: 'Month',
                        step: 1,
                      },
                      date: {
                        format: 'DD',
                        caption: 'Day',
                        step: 1,
                      },
                    }}
                    onSelect={handleMobileDateSelect}
                    onCancel={() => setIsMobilePickerOpen(false)}
                    confirmText="Done"
                    cancelText="Cancel"
                  />
                </MobileDatePickerErrorBoundary>
              ) : null}
            </>
          )}
        </div>
      ) : (
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
      )}
    </QuestionScreen>
  )
}
