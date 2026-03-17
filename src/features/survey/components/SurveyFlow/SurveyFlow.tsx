import { useEffect, useMemo, useRef, useState } from 'react'
import { useDeterministicLegendaryResult } from '../../../result/hooks/useDeterministicLegendaryResult'
import { useDeterministicPokemonResult } from '../../../result/hooks/useDeterministicPokemonResult'
import { useDeterministicRegionalTeammateResult } from '../../../result/hooks/useDeterministicRegionalTeammateResult'
import { useDeterministicTeamMemberFiveResult } from '../../../result/hooks/useDeterministicTeamMemberFiveResult'
import { useDeterministicTypeTeammateResult } from '../../../result/hooks/useDeterministicTypeTeammateResult'
import { usePokemonSummaryById } from '../../../result/hooks/usePokemonSummaryById'
import { useStarterFinalEvolutionResult } from '../../../result/hooks/useStarterFinalEvolutionResult'
import { getPreferredPokemonMediaUrl } from '../../../result/lib/pokemonMedia'
import { buildResultsShareUrl, parseSharedResultsFromUrl } from '../../../result/services/resultsShare'
import { saveElementScreenshot } from '../../../result/services/resultsScreenshot'
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

type SurveyFlowProps = {
  onHasStartedJourneyChange?: (hasStartedJourney: boolean) => void
}

export function SurveyFlow({ onHasStartedJourneyChange }: SurveyFlowProps) {
  const sharedResultsAnswers = useMemo(() => {
    if (typeof window === 'undefined') {
      return null
    }

    return parseSharedResultsFromUrl(window.location.search)
  }, [])
  const { answers, setAnswer } = useSurveyAnswers(sharedResultsAnswers ?? {})
  const [hasStartedJourney, setHasStartedJourney] = useState(Boolean(sharedResultsAnswers))
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [isSurveySubmitted, setIsSurveySubmitted] = useState(Boolean(sharedResultsAnswers))
  const [resultsPresentationPhase, setResultsPresentationPhase] = useState<
    'hidden' | 'gathering' | 'revealing' | 'complete'
  >(sharedResultsAnswers ? 'complete' : 'hidden')
  const [currentRevealIndex, setCurrentRevealIndex] = useState(0)
  const [isSavingResults, setIsSavingResults] = useState(false)
  const [resultsActionMessage, setResultsActionMessage] = useState<string | null>(null)
  const resultsContentRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    onHasStartedJourneyChange?.(hasStartedJourney)
  }, [hasStartedJourney, onHasStartedJourneyChange])

  const hasActiveQuestion = hasStartedJourney && currentQuestionIndex < surveyQuestions.length
  const activeQuestion = hasActiveQuestion ? surveyQuestions[currentQuestionIndex] : null
  const activeQuestionValue = activeQuestion ? (answers[activeQuestion.id] ?? '') : ''

  const trainerFullName =
    surveyQuestions
      .filter((question) => question.id === 'firstName' || question.id === 'lastName')
      .map((question) => answers[question.id])
      .filter(Boolean)
      .join(' ') || 'Not set yet'
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
  const trainerRegionAnswer =
    selectedRegion?.label.replace(/^\d+\.\s*/, '') ?? 'Not set yet'
  const starterQuestion = surveyQuestions.find(
    (question): question is StarterSurveyQuestion =>
      question.type === 'starter' && question.id === 'starterPokemon',
  )
  const starterOptionsForRegion = starterQuestion?.optionsByRegionId[answers.trainerRegion ?? '']
  const selectedStarter = starterOptionsForRegion?.find(
    (option) => option.id === answers.starterPokemon,
  )
  const starterFinalEvolution = useStarterFinalEvolutionResult(
    selectedStarter?.pokemonNumber ?? null,
  )
  const starterFinalEvolutionMediaSrc = getPreferredPokemonMediaUrl({
    pokemonGifUrl: starterFinalEvolution.pokemonGifUrl,
    pokemonImageUrl: starterFinalEvolution.pokemonImageUrl,
  })
  const starterAnswer = selectedStarter?.name ?? 'Not set yet'
  const traitsQuestion = surveyQuestions.find(
    (question): question is TraitsSurveyQuestion =>
      question.type === 'traits' && question.id === 'personalityTraits',
  )
  const selectedTraitOption = traitsQuestion?.options.find(
    (option) => option.id === answers.personalityTraits,
  )
  const eeveelutionAnswer = selectedTraitOption ? selectedTraitOption.eeveelutionName : 'Not set yet'
  const pseudoLegendaryQuestion = surveyQuestions.find(
    (question): question is PseudoLegendarySurveyQuestion =>
      question.type === 'pseudoLegendary' && question.id === 'pseudoLegendaryPartner',
  )
  const selectedPseudoLegendary = pseudoLegendaryQuestion?.options.find(
    (option) => option.id === answers.pseudoLegendaryPartner,
  )
  const pseudoLegendaryAnswer = selectedPseudoLegendary
    ? selectedPseudoLegendary.pseudoLegendaryName
    : 'Not set yet'
  const randomTeammatePokemonId = Number.parseInt(answers.randomTeammatePokemon ?? '', 10)
  const normalizedRandomTeammateId = Number.isNaN(randomTeammatePokemonId)
    ? null
    : randomTeammatePokemonId
  const randomTeammatePokemon = usePokemonSummaryById(normalizedRandomTeammateId)
  const randomTeammateMediaSrc = getPreferredPokemonMediaUrl({
    pokemonGifUrl: randomTeammatePokemon.pokemonGifUrl,
    pokemonImageUrl: randomTeammatePokemon.pokemonImageUrl,
  })
  const deterministicPokemonResult = useDeterministicPokemonResult(answers)
  const deterministicPokemonMediaSrc = getPreferredPokemonMediaUrl({
    pokemonGifUrl: deterministicPokemonResult.pokemonGifUrl,
    pokemonImageUrl: deterministicPokemonResult.pokemonImageUrl,
  })
  const deterministicTeamMemberFiveResult = useDeterministicTeamMemberFiveResult(answers)
  const deterministicTeamMemberFiveMediaSrc = getPreferredPokemonMediaUrl({
    pokemonGifUrl: deterministicTeamMemberFiveResult.pokemonGifUrl,
    pokemonImageUrl: deterministicTeamMemberFiveResult.pokemonImageUrl,
  })
  const deterministicLegendaryResult = useDeterministicLegendaryResult(answers)
  const deterministicLegendaryMediaSrc = getPreferredPokemonMediaUrl({
    pokemonGifUrl: deterministicLegendaryResult.pokemonGifUrl,
    pokemonImageUrl: deterministicLegendaryResult.pokemonImageUrl,
  })
  const deterministicRegionalTeammateResult = useDeterministicRegionalTeammateResult(answers)
  const deterministicRegionalTeammateMediaSrc = getPreferredPokemonMediaUrl({
    pokemonGifUrl: deterministicRegionalTeammateResult.pokemonGifUrl,
    pokemonImageUrl: deterministicRegionalTeammateResult.pokemonImageUrl,
  })
  const deterministicTypeTeammateResult = useDeterministicTypeTeammateResult(answers)
  const deterministicTypeTeammateMediaSrc = getPreferredPokemonMediaUrl({
    pokemonGifUrl: deterministicTypeTeammateResult.pokemonGifUrl,
    pokemonImageUrl: deterministicTypeTeammateResult.pokemonImageUrl,
  })
  const legendaryResultValue = deterministicLegendaryResult.isLoading
    ? 'Calculating...'
    : deterministicLegendaryResult.errorMessage
      ? deterministicLegendaryResult.errorMessage
      : deterministicLegendaryResult.pokemonNumber && deterministicLegendaryResult.pokemonName
        ? deterministicLegendaryResult.pokemonName
        : 'Complete first name, last name, DOB, and pseudo-legendary to reveal.'
  const legendaryResultDisplayMediaSrc =
    deterministicLegendaryResult.pokemonNumber && deterministicLegendaryResult.pokemonName
      ? deterministicLegendaryMediaSrc
      : null
  const pokemonYouAreValue = deterministicPokemonResult.isLoading
    ? 'Calculating...'
    : deterministicPokemonResult.errorMessage
      ? deterministicPokemonResult.errorMessage
      : deterministicPokemonResult.pokemonNumber && deterministicPokemonResult.pokemonName
        ? deterministicPokemonResult.pokemonName
        : 'Complete first name, last name, and DOB to reveal.'
  const pokemonYouAreDisplayMediaSrc =
    deterministicPokemonResult.pokemonNumber && deterministicPokemonResult.pokemonName
      ? deterministicPokemonMediaSrc
      : null
  const infoGridItems = [
    {
      id: 'favorite-type',
      title: 'Favorite type',
      value: selectedFavoriteType ? '' : favoriteTypeAnswer,
      mediaSrc: selectedFavoriteType?.imageSrc ?? null,
      mediaAlt: selectedFavoriteType?.label ?? 'Favorite type',
    },
    {
      id: 'starter',
      title: 'Starter',
      value: starterAnswer,
      mediaSrc: selectedStarter?.gifSrc ?? null,
      mediaAlt: selectedStarter?.name ?? 'Starter',
    },
    {
      id: 'region',
      title: 'Region',
      value: trainerRegionAnswer,
      mediaSrc: null,
      mediaAlt: 'Region',
    },
    {
      id: 'eeveelution',
      title: 'Your Eeveelution',
      value: eeveelutionAnswer,
      mediaSrc: selectedTraitOption?.gifSrc ?? null,
      mediaAlt: selectedTraitOption?.eeveelutionName ?? 'Eeveelution',
    },
    {
      id: 'pseudo-legendary',
      title: 'Pseudo-legendary you chose',
      value: pseudoLegendaryAnswer,
      mediaSrc: selectedPseudoLegendary?.gifSrc ?? null,
      mediaAlt: selectedPseudoLegendary?.pseudoLegendaryName ?? 'Pseudo-legendary choice',
    },
    {
      id: 'legendary-result',
      title: 'Your Legendary Pokemon',
      value: legendaryResultValue,
      mediaSrc: legendaryResultDisplayMediaSrc,
      mediaAlt: deterministicLegendaryResult.pokemonName ?? 'Legendary result',
    },
    {
      id: 'pokemon-you-are',
      title: 'Pokemon you are',
      value: pokemonYouAreValue,
      mediaSrc: pokemonYouAreDisplayMediaSrc,
      mediaAlt: deterministicPokemonResult.pokemonName ?? 'Pokemon you are',
    },
  ]
  const teamGridItems = [
    starterFinalEvolution.isLoading
      ? {
          id: 'starter-final-evolution',
          label: 'Calculating...',
          mediaSrc: null,
          mediaAlt: 'Team member',
        }
      : starterFinalEvolution.errorMessage
        ? {
            id: 'starter-final-evolution',
            label: starterFinalEvolution.errorMessage,
            mediaSrc: null,
            mediaAlt: 'Team member',
          }
        : starterFinalEvolution.pokemonNumber && starterFinalEvolution.pokemonName
          ? {
              id: 'starter-final-evolution',
              label: starterFinalEvolution.pokemonName,
              mediaSrc: starterFinalEvolutionMediaSrc,
              mediaAlt: starterFinalEvolution.pokemonName,
            }
          : {
              id: 'starter-final-evolution',
              label: 'No selection yet.',
              mediaSrc: null,
              mediaAlt: 'Team member',
            },
    selectedPseudoLegendary
      ? {
          id: 'pseudo-legendary',
          label: selectedPseudoLegendary.pseudoLegendaryName,
          mediaSrc: selectedPseudoLegendary.gifSrc,
          mediaAlt: selectedPseudoLegendary.pseudoLegendaryName,
        }
      : {
          id: 'pseudo-legendary',
          label: 'No selection yet.',
          mediaSrc: null,
          mediaAlt: 'Team member',
        },
    deterministicRegionalTeammateResult.isLoading
      ? {
          id: 'regional',
          label: 'Calculating...',
          mediaSrc: null,
          mediaAlt: 'Team member',
        }
      : deterministicRegionalTeammateResult.errorMessage
        ? {
            id: 'regional',
            label: deterministicRegionalTeammateResult.errorMessage,
            mediaSrc: null,
            mediaAlt: 'Team member',
          }
        : deterministicRegionalTeammateResult.pokemonNumber &&
            deterministicRegionalTeammateResult.pokemonName
          ? {
              id: 'regional',
              label: deterministicRegionalTeammateResult.pokemonName,
              mediaSrc: deterministicRegionalTeammateMediaSrc,
              mediaAlt: deterministicRegionalTeammateResult.pokemonName,
            }
          : {
              id: 'regional',
              label: 'No selection yet.',
              mediaSrc: null,
              mediaAlt: 'Team member',
            },
    deterministicTypeTeammateResult.isLoading
      ? {
          id: 'type',
          label: 'Calculating...',
          mediaSrc: null,
          mediaAlt: 'Team member',
        }
      : deterministicTypeTeammateResult.errorMessage
        ? {
            id: 'type',
            label: deterministicTypeTeammateResult.errorMessage,
            mediaSrc: null,
            mediaAlt: 'Team member',
          }
        : deterministicTypeTeammateResult.pokemonNumber &&
            deterministicTypeTeammateResult.pokemonName
          ? {
              id: 'type',
              label: deterministicTypeTeammateResult.pokemonName,
              mediaSrc: deterministicTypeTeammateMediaSrc,
              mediaAlt: deterministicTypeTeammateResult.pokemonName,
            }
          : {
              id: 'type',
              label: 'No selection yet.',
              mediaSrc: null,
              mediaAlt: 'Team member',
            },
    deterministicTeamMemberFiveResult.isLoading
      ? {
          id: 'deterministic',
          label: 'Calculating...',
          mediaSrc: null,
          mediaAlt: 'Team member',
        }
      : deterministicTeamMemberFiveResult.errorMessage
        ? {
            id: 'deterministic',
            label: deterministicTeamMemberFiveResult.errorMessage,
            mediaSrc: null,
            mediaAlt: 'Team member',
          }
        : deterministicTeamMemberFiveResult.pokemonNumber &&
            deterministicTeamMemberFiveResult.pokemonName
          ? {
              id: 'deterministic',
              label: deterministicTeamMemberFiveResult.pokemonName,
              mediaSrc: deterministicTeamMemberFiveMediaSrc,
              mediaAlt: deterministicTeamMemberFiveResult.pokemonName,
            }
          : {
              id: 'deterministic',
              label: 'No selection yet.',
              mediaSrc: null,
              mediaAlt: 'Team member',
            },
    randomTeammatePokemon.isLoading
      ? {
          id: 'random',
          label: 'Awaiting wild encounter selection...',
          mediaSrc: null,
          mediaAlt: 'Team member',
        }
      : randomTeammatePokemon.errorMessage
        ? {
            id: 'random',
            label: randomTeammatePokemon.errorMessage,
            mediaSrc: null,
            mediaAlt: 'Team member',
          }
        : randomTeammatePokemon.requestedPokemonId && randomTeammatePokemon.pokemonName
          ? {
              id: 'random',
              label: randomTeammatePokemon.pokemonName,
              mediaSrc: randomTeammateMediaSrc,
              mediaAlt: randomTeammatePokemon.pokemonName,
            }
          : {
              id: 'random',
              label: 'No selection yet.',
              mediaSrc: null,
              mediaAlt: 'Team member',
            },
  ]
  const infoItemById = Object.fromEntries(infoGridItems.map((item) => [item.id, item]))
  const presentationItems = [
    {
      id: 'favorite-type',
      promptText: 'Your favorite type is...',
      kind: 'single' as const,
      item: infoItemById['favorite-type'],
    },
    {
      id: 'starter',
      promptText: 'Your bestfriend, your starter is..',
      kind: 'single' as const,
      item: infoItemById.starter,
    },
    {
      id: 'region',
      promptText: 'Your journey where it all began is...',
      kind: 'single' as const,
      item: infoItemById.region,
    },
    {
      id: 'eeveelution',
      promptText: 'If you were an Eeveelution you would be...',
      kind: 'single' as const,
      item: infoItemById.eeveelution,
    },
    {
      id: 'pseudo-legendary',
      promptText: 'The Pseudolegendary you chose is..',
      kind: 'single' as const,
      item: infoItemById['pseudo-legendary'],
    },
    {
      id: 'legendary-result',
      promptText: 'Your legendary pokemon is...',
      kind: 'single' as const,
      item: infoItemById['legendary-result'],
    },
    {
      id: 'pokemon-you-are',
      promptText: 'The pokemon you are is...',
      kind: 'single' as const,
      item: infoItemById['pokemon-you-are'],
    },
    {
      id: 'team-reveal',
      promptText: 'And finally.. Your 6 man pokemon team is...',
      kind: 'team' as const,
      items: teamGridItems,
    },
  ]
  const activePresentationItem = presentationItems[currentRevealIndex] ?? null
  const resultsShareUrl = useMemo(() => {
    if (typeof window === 'undefined') {
      return '#'
    }

    return buildResultsShareUrl(answers, window.location.href)
  }, [answers])

  useEffect(() => {
    if (resultsPresentationPhase !== 'gathering') {
      return
    }

    const gatherTimer = window.setTimeout(() => {
      setResultsPresentationPhase('revealing')
      setCurrentRevealIndex(0)
    }, 3000)

    return () => window.clearTimeout(gatherTimer)
  }, [resultsPresentationPhase])

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
      setResultsPresentationPhase('gathering')
      setCurrentRevealIndex(0)
      return
    }

    setCurrentQuestionIndex((index) => index + 1)
  }

  const handleAcknowledgeReveal = () => {
    const isLastRevealItem = currentRevealIndex >= presentationItems.length - 1

    if (isLastRevealItem) {
      setResultsPresentationPhase('complete')
      return
    }

    setCurrentRevealIndex((index) => index + 1)
  }

  const handleSaveResults = async () => {
    const resultsContainerElement = resultsContentRef.current
    if (!resultsContainerElement) {
      return
    }

    try {
      setIsSavingResults(true)
      await saveElementScreenshot(resultsContainerElement)
      setResultsActionMessage('Results screenshot saved.')
    } catch {
      setResultsActionMessage('Unable to save screenshot right now.')
    } finally {
      setIsSavingResults(false)
    }
  }

  return (
    <>
      {!hasStartedJourney ? (
        <div className="game-panel">
          <TypewriterPrompt text="Click `Begin journey` to get your pokemon profile" />
          <button
            type="button"
            className="pixel-button"
            onClick={() => setHasStartedJourney(true)}
          >
            Begin Journey
          </button>
        </div>
      ) : null}

      {activeQuestion && !isSurveySubmitted ? (
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

      {isSurveySubmitted ? (
        <div
          className={`game-panel results-panel ${
            resultsPresentationPhase === 'complete' ? '' : 'results-panel-staged'
          }`}
        >
          {resultsPresentationPhase === 'gathering' ? (
            <TypewriterPrompt text="... gathering your results ... " speedMs={40} />
          ) : null}

          {resultsPresentationPhase === 'revealing' && activePresentationItem ? (
            <div className="result-reveal-overlay" role="dialog" aria-modal="true">
              <div className="result-reveal-modal">
                <TypewriterPrompt text={activePresentationItem.promptText} speedMs={28} />
                {activePresentationItem.kind === 'single' ? (
                  <>
                    {activePresentationItem.item.value ? (
                      <strong className="result-info-value">{activePresentationItem.item.value}</strong>
                    ) : null}
                    {activePresentationItem.item.mediaSrc ? (
                      <img
                        src={activePresentationItem.item.mediaSrc}
                        alt={activePresentationItem.item.mediaAlt}
                        className="result-inline-media result-starter-media result-info-media"
                      />
                    ) : null}
                  </>
                ) : (
                  <div className="result-team-grid result-team-grid-modal">
                    {activePresentationItem.items.map((teamGridItem) => (
                      <div key={teamGridItem.id} className="result-team-card">
                        {teamGridItem.mediaSrc ? (
                          <img
                            src={teamGridItem.mediaSrc}
                            alt={teamGridItem.mediaAlt}
                            className="result-inline-media result-starter-media result-team-card-media"
                          />
                        ) : null}
                        <strong>{teamGridItem.label}</strong>
                      </div>
                    ))}
                  </div>
                )}
                <div className="result-reveal-actions">
                  <button
                    type="button"
                    className="pixel-button"
                    onClick={handleAcknowledgeReveal}
                  >
                    YAY! 🙌
                  </button>
                  <button
                    type="button"
                    className="pixel-button"
                    onClick={handleAcknowledgeReveal}
                  >
                    Nice!🙂
                  </button>
                  <button
                    type="button"
                    className="pixel-button"
                    onClick={handleAcknowledgeReveal}
                  >
                    Ok!🤔
                  </button>
                  <button
                    type="button"
                    className="pixel-button"
                    onClick={handleAcknowledgeReveal}
                  >
                    Lame!😖
                  </button>
                </div>
              </div>
            </div>
          ) : null}

          {resultsPresentationPhase === 'complete' ? (
            <>
              <div ref={resultsContentRef} className="results-content">
                <h1>
                  Trainer <strong>{trainerFullName}</strong> Results
                </h1>
                <div className="result-info-grid">
                  {infoGridItems.map((resultItem) => (
                    <div key={resultItem.id} className="result-info-card">
                      <span className="result-info-label">{resultItem.title}</span>
                      {resultItem.value ? (
                        <strong className="result-info-value">{resultItem.value}</strong>
                      ) : null}
                      {resultItem.mediaSrc ? (
                        <img
                          src={resultItem.mediaSrc}
                          alt={resultItem.mediaAlt}
                          className="result-inline-media result-starter-media result-info-media"
                        />
                      ) : null}
                    </div>
                  ))}
                </div>
                <p className="team-grid-description">Your 6 man pokemon team is</p>
                <div className="result-team-grid">
                  {teamGridItems.map((teamGridItem) => (
                    <div key={teamGridItem.id} className="result-team-card">
                      {teamGridItem.mediaSrc ? (
                        <img
                          src={teamGridItem.mediaSrc}
                          alt={teamGridItem.mediaAlt}
                          className="result-inline-media result-starter-media result-team-card-media"
                        />
                      ) : null}
                      <strong>{teamGridItem.label}</strong>
                    </div>
                  ))}
                </div>
              </div>
              <div className="results-actions">
                <button
                  type="button"
                  className="pixel-button"
                  disabled={isSavingResults}
                  onClick={handleSaveResults}
                >
                  {isSavingResults ? 'Saving...' : 'Save Results'}
                </button>
                <a
                  href={resultsShareUrl}
                  className="pixel-button pixel-button-secondary"
                  target="_blank"
                  rel="noreferrer"
                >
                  Share Results Link
                </a>
              </div>
              {resultsActionMessage ? <p className="saved-note">{resultsActionMessage}</p> : null}
            </>
          ) : null}
        </div>
      ) : null}
    </>
  )
}
