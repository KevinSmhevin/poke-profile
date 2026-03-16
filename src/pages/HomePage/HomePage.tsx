import { useState } from 'react'
import { getDeterministicPokemonResult } from '../../features/result/lib/deterministicScoring'
import { FirstNameQuestion } from '../../features/survey/components/FirstNameQuestion/FirstNameQuestion'
import { TypewriterPrompt } from '../../features/survey/components/TypewriterPrompt/TypewriterPrompt'
import { firstNameQuestion } from '../../features/survey/data/questions'
import { useSurveyAnswers } from '../../features/survey/hooks/useSurveyAnswers'
import { ScreenContainer } from '../../shared/components/ScreenContainer/ScreenContainer'

type SurveyStep = 'intro' | 'firstQuestion'

export function HomePage() {
  const { answers, setAnswer } = useSurveyAnswers()
  const [step, setStep] = useState<SurveyStep>('intro')
  const [isFirstQuestionSubmitted, setIsFirstQuestionSubmitted] = useState(false)
  const previewResult = getDeterministicPokemonResult(answers)
  const trainerName = answers[firstNameQuestion.id] ?? ''

  const handleFirstNameChange = (value: string) => {
    setAnswer(firstNameQuestion.id, value)
  }

  const handleFirstNameSubmit = () => {
    setIsFirstQuestionSubmitted(true)
  }

  return (
    <ScreenContainer
      title="Begin Your Pokemon Journey"
      subtitle="A retro-style trainer quiz with deterministic results."
    >
      {step === 'intro' ? (
        <div className="game-panel">
          <TypewriterPrompt text="A new Pokemon journey is about to begin..." />
          <button
            type="button"
            className="pixel-button"
            onClick={() => setStep('firstQuestion')}
          >
            Begin Journey
          </button>
        </div>
      ) : (
        <FirstNameQuestion
          question={firstNameQuestion}
          value={trainerName}
          onValueChange={handleFirstNameChange}
          onSubmit={handleFirstNameSubmit}
        />
      )}
      {step === 'firstQuestion' ? (
        <div className="game-panel">
          <p>
            Current trainer name: <strong>{trainerName || 'Not set yet'}</strong>
          </p>
          {isFirstQuestionSubmitted ? (
            <p className="saved-note">Name saved. Ready for question two.</p>
          ) : null}
          <p>
            Deterministic preview result: <strong>{previewResult}</strong>
          </p>
        </div>
      ) : null}
    </ScreenContainer>
  )
}
