import { useState } from 'react'
import { useDeterministicPokemonResult } from '../../../result/hooks/useDeterministicPokemonResult'
import { surveyQuestions } from '../../data/questions'
import { useSurveyAnswers } from '../../hooks/useSurveyAnswers'
import type { RegionSurveyQuestion } from '../../types'
import { DateQuestionStep } from '../DateQuestionStep/DateQuestionStep'
import { PokemonTypeQuestionStep } from '../PokemonTypeQuestionStep/PokemonTypeQuestionStep'
import { RegionQuestionStep } from '../RegionQuestionStep/RegionQuestionStep'
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
  const favoriteTypeAnswer = answers.favoritePokemonType ?? 'Not set yet'
  const regionQuestion = surveyQuestions.find(
    (question): question is RegionSurveyQuestion =>
      question.type === 'region' && question.id === 'trainerRegion',
  )
  const selectedRegion = regionQuestion?.options.find(
    (option) => option.id === answers.trainerRegion,
  )
  const trainerRegionAnswer = selectedRegion?.label ?? 'Not set yet'
  const deterministicPokemonResult = useDeterministicPokemonResult(answers)

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
        ) : activeQuestion.type === 'date' ? (
          <DateQuestionStep
            question={activeQuestion}
            value={activeQuestionValue}
            onValueChange={handleCurrentQuestionValueChange}
            onSubmit={handleCurrentQuestionSubmit}
          />
        ) : activeQuestion.type === 'region' ? (
          <RegionQuestionStep
            question={activeQuestion}
            value={activeQuestionValue}
            onValueChange={handleCurrentQuestionValueChange}
            onSubmit={handleCurrentQuestionSubmit}
          />
        ) : (
          <PokemonTypeQuestionStep
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
          <p>
            Favorite type: <strong>{favoriteTypeAnswer}</strong>
          </p>
          <p>
            Region: <strong>{trainerRegionAnswer}</strong>
          </p>
          {isSurveySubmitted ? (
            <p className="saved-note">Profile saved. Ready for personality questions.</p>
          ) : null}
          <p>
            Pokemon result:{' '}
            <strong>
              {deterministicPokemonResult.isLoading
                ? 'Calculating...'
                : deterministicPokemonResult.errorMessage
                  ? deterministicPokemonResult.errorMessage
                  : deterministicPokemonResult.pokemonNumber &&
                      deterministicPokemonResult.pokemonName
                    ? `#${deterministicPokemonResult.pokemonNumber} ${deterministicPokemonResult.pokemonName}`
                    : 'Complete first name, last name, and DOB to reveal.'}
            </strong>
          </p>
        </div>
      ) : null}
    </>
  )
}
