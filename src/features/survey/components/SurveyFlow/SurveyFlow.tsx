import { useState } from 'react'
import { useDeterministicPokemonResult } from '../../../result/hooks/useDeterministicPokemonResult'
import { usePokemonSummaryById } from '../../../result/hooks/usePokemonSummaryById'
import { surveyQuestions } from '../../data/questions'
import { useSurveyAnswers } from '../../hooks/useSurveyAnswers'
import type {
  PseudoLegendarySurveyQuestion,
  PokemonTypeSurveyQuestion,
  RegionSurveyQuestion,
  StarterSurveyQuestion,
  TraitsSurveyQuestion,
} from '../../types'
import { DateQuestionStep } from '../DateQuestionStep/DateQuestionStep'
import { PseudoLegendaryQuestionStep } from '../PseudoLegendaryQuestionStep/PseudoLegendaryQuestionStep'
import { PokemonTypeQuestionStep } from '../PokemonTypeQuestionStep/PokemonTypeQuestionStep'
import { RegionQuestionStep } from '../RegionQuestionStep/RegionQuestionStep'
import { StarterQuestionStep } from '../StarterQuestionStep/StarterQuestionStep'
import { TextQuestionStep } from '../TextQuestionStep/TextQuestionStep'
import { TraitsQuestionStep } from '../TraitsQuestionStep/TraitsQuestionStep'
import { TypewriterPrompt } from '../TypewriterPrompt/TypewriterPrompt'
import { WildEncounterQuestionStep } from '../WildEncounterQuestionStep/WildEncounterQuestionStep'

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
  const pokemonTypeQuestion = surveyQuestions.find(
    (question): question is PokemonTypeSurveyQuestion =>
      question.type === 'pokemonType' && question.id === 'favoritePokemonType',
  )
  const selectedFavoriteType = pokemonTypeQuestion?.options.find(
    (option) => option.id === answers.favoritePokemonType,
  )
  const favoriteTypeAnswer = selectedFavoriteType?.label ?? 'Not set yet'
  const regionQuestion = surveyQuestions.find(
    (question): question is RegionSurveyQuestion =>
      question.type === 'region' && question.id === 'trainerRegion',
  )
  const selectedRegion = regionQuestion?.options.find(
    (option) => option.id === answers.trainerRegion,
  )
  const trainerRegionAnswer = selectedRegion?.label ?? 'Not set yet'
  const starterQuestion = surveyQuestions.find(
    (question): question is StarterSurveyQuestion =>
      question.type === 'starter' && question.id === 'starterPokemon',
  )
  const starterOptionsForRegion = starterQuestion?.optionsByRegionId[answers.trainerRegion ?? '']
  const selectedStarter = starterOptionsForRegion?.find(
    (option) => option.id === answers.starterPokemon,
  )
  const starterAnswer = selectedStarter?.name ?? 'Not set yet'
  const traitsQuestion = surveyQuestions.find(
    (question): question is TraitsSurveyQuestion =>
      question.type === 'traits' && question.id === 'personalityTraits',
  )
  const selectedTraitOption = traitsQuestion?.options.find(
    (option) => option.id === answers.personalityTraits,
  )
  const eeveelutionAnswer = selectedTraitOption
    ? `#${selectedTraitOption.eeveelutionNumber} ${selectedTraitOption.eeveelutionName}`
    : 'Not set yet'
  const pseudoLegendaryQuestion = surveyQuestions.find(
    (question): question is PseudoLegendarySurveyQuestion =>
      question.type === 'pseudoLegendary' && question.id === 'pseudoLegendaryPartner',
  )
  const selectedPseudoLegendary = pseudoLegendaryQuestion?.options.find(
    (option) => option.id === answers.pseudoLegendaryPartner,
  )
  const pseudoLegendaryAnswer = selectedPseudoLegendary
    ? `#${selectedPseudoLegendary.pseudoLegendaryNumber} ${selectedPseudoLegendary.pseudoLegendaryName}`
    : 'Not set yet'
  const randomTeammatePokemonId = Number.parseInt(answers.randomTeammatePokemon ?? '', 10)
  const normalizedRandomTeammateId = Number.isNaN(randomTeammatePokemonId)
    ? null
    : randomTeammatePokemonId
  const randomTeammatePokemon = usePokemonSummaryById(normalizedRandomTeammateId)
  const randomTeammateMediaSrc =
    randomTeammatePokemon.pokemonGifUrl || randomTeammatePokemon.pokemonImageUrl || ''
  const deterministicPokemonResult = useDeterministicPokemonResult(answers)
  const deterministicPokemonMediaSrc =
    deterministicPokemonResult.pokemonGifUrl ||
    deterministicPokemonResult.pokemonImageUrl ||
    ''

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
        ) : activeQuestion.type === 'starter' ? (
          <StarterQuestionStep
            question={activeQuestion}
            selectedRegionId={answers.trainerRegion ?? ''}
            value={activeQuestionValue}
            onValueChange={handleCurrentQuestionValueChange}
            onSubmit={handleCurrentQuestionSubmit}
          />
        ) : activeQuestion.type === 'traits' ? (
          <TraitsQuestionStep
            question={activeQuestion}
            value={activeQuestionValue}
            onValueChange={handleCurrentQuestionValueChange}
            onSubmit={handleCurrentQuestionSubmit}
          />
        ) : activeQuestion.type === 'pseudoLegendary' ? (
          <PseudoLegendaryQuestionStep
            question={activeQuestion}
            value={activeQuestionValue}
            onValueChange={handleCurrentQuestionValueChange}
            onSubmit={handleCurrentQuestionSubmit}
          />
        ) : activeQuestion.type === 'wildEncounter' ? (
          <WildEncounterQuestionStep
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
          <div className="result-media-row">
            <span>Favorite type:</span>
            <strong>{favoriteTypeAnswer}</strong>
            {selectedFavoriteType ? (
              <img
                src={selectedFavoriteType.imageSrc}
                alt={selectedFavoriteType.label}
                className="result-inline-media"
              />
            ) : null}
          </div>
          <p>
            Region: <strong>{trainerRegionAnswer}</strong>
          </p>
          <div className="result-media-row">
            <span>Starter:</span>
            <strong>{starterAnswer}</strong>
            {selectedStarter ? (
              <img
                src={selectedStarter.gifSrc}
                alt={selectedStarter.name}
                className="result-inline-media result-starter-media"
              />
            ) : null}
          </div>
          <div className="result-media-row">
            <span>Eeveelution:</span>
            <strong>{eeveelutionAnswer}</strong>
            {selectedTraitOption ? (
              <img
                src={selectedTraitOption.gifSrc}
                alt={selectedTraitOption.eeveelutionName}
                className="result-inline-media result-starter-media"
              />
            ) : null}
          </div>
          <div className="result-media-row">
            <span>Pseudo-legendary:</span>
            <strong>{pseudoLegendaryAnswer}</strong>
            {selectedPseudoLegendary ? (
              <img
                src={selectedPseudoLegendary.gifSrc}
                alt={selectedPseudoLegendary.pseudoLegendaryName}
                className="result-inline-media result-starter-media"
              />
            ) : null}
          </div>
          {randomTeammatePokemon.isLoading ? (
            <p>
              Team member 6 (Random): <strong>Awaiting wild encounter selection...</strong>
            </p>
          ) : randomTeammatePokemon.errorMessage ? (
            <p>
              Team member 6 (Random): <strong>{randomTeammatePokemon.errorMessage}</strong>
            </p>
          ) : randomTeammatePokemon.requestedPokemonId && randomTeammatePokemon.pokemonName ? (
            <div className="result-media-row">
              <span>Team member 6 (Random):</span>
              <strong>
                #{randomTeammatePokemon.requestedPokemonId} {randomTeammatePokemon.pokemonName}
              </strong>
              {randomTeammateMediaSrc ? (
                <img
                  src={randomTeammateMediaSrc}
                  alt={randomTeammatePokemon.pokemonName}
                  className="result-inline-media result-starter-media"
                />
              ) : null}
            </div>
          ) : (
            <p>
              Team member 6 (Random): <strong>No selection yet.</strong>
            </p>
          )}
          {isSurveySubmitted ? (
            <p className="saved-note">Profile saved. Your team lineup is forming.</p>
          ) : null}
          {deterministicPokemonResult.isLoading ? (
            <p>
              Pokemon result: <strong>Calculating...</strong>
            </p>
          ) : deterministicPokemonResult.errorMessage ? (
            <p>
              Pokemon result: <strong>{deterministicPokemonResult.errorMessage}</strong>
            </p>
          ) : deterministicPokemonResult.pokemonNumber &&
            deterministicPokemonResult.pokemonName ? (
            <div className="result-media-row">
              <span>Pokemon result:</span>
              <strong>
                #{deterministicPokemonResult.pokemonNumber}{' '}
                {deterministicPokemonResult.pokemonName}
              </strong>
              {deterministicPokemonMediaSrc ? (
                <img
                  src={deterministicPokemonMediaSrc}
                  alt={deterministicPokemonResult.pokemonName}
                  className="result-inline-media result-starter-media"
                />
              ) : null}
            </div>
          ) : (
            <p>
              Pokemon result:{' '}
              <strong>Complete first name, last name, and DOB to reveal.</strong>
            </p>
          )}
        </div>
      ) : null}
    </>
  )
}
