import { useEffect, useMemo, useState } from 'react'
import { formatPokemonDisplayName } from '../../../result/lib/deterministicScoring'
import { fetchPokemonById } from '../../../../services/pokeapi/client'
import { generateUniqueRandomPokemonNumbers, waitForDuration } from '../../lib/randomPokemon'
import { QuestionScreen } from '../QuestionScreen/QuestionScreen'
import { TypewriterPrompt } from '../TypewriterPrompt/TypewriterPrompt'
import type { WildEncounterSurveyQuestion } from '../../types'

type WildEncounterOption = {
  id: string
  pokemonNumber: number
  pokemonName: string
  mediaUrl: string
}

type WildEncounterQuestionStepProps = {
  question: WildEncounterSurveyQuestion
  value: string
  onValueChange: (value: string) => void
  onSubmit: () => void
}

export function WildEncounterQuestionStep({
  question,
  value,
  onValueChange,
  onSubmit,
}: WildEncounterQuestionStepProps) {
  const [isLoadingEncounter, setIsLoadingEncounter] = useState(true)
  const [encounterPrompt, setEncounterPrompt] = useState(question.initialApproachPrompt)
  const [encounterOptions, setEncounterOptions] = useState<WildEncounterOption[]>([])
  const [loadError, setLoadError] = useState<string | null>(null)
  const [showValidationError, setShowValidationError] = useState(false)
  const [refreshCount, setRefreshCount] = useState(0)
  const [hasUsedRefresh, setHasUsedRefresh] = useState(false)

  const validOptionIds = useMemo(
    () => new Set(encounterOptions.map((option) => option.id)),
    [encounterOptions],
  )

  useEffect(() => {
    let hasCancelled = false

    const loadEncounterOptions = async () => {
      try {
        const randomNumbers = generateUniqueRandomPokemonNumbers(question.optionCount)
        const [pokemonList] = await Promise.all([
          Promise.all(randomNumbers.map((pokemonNumber) => fetchPokemonById(pokemonNumber))),
          waitForDuration(question.minLoadingMs),
        ])

        if (hasCancelled) {
          return
        }

        const nextOptions = pokemonList.map((pokemon) => ({
          id: String(pokemon.id),
          pokemonNumber: pokemon.id,
          pokemonName: formatPokemonDisplayName(pokemon.name),
          mediaUrl: pokemon.showdownGifUrl || pokemon.imageUrl,
        }))

        setEncounterOptions(nextOptions)
        setLoadError(null)
        setIsLoadingEncounter(false)
      } catch {
        if (hasCancelled) {
          return
        }

        setEncounterOptions([])
        setLoadError('A wild encounter failed to appear. Please try again.')
        setIsLoadingEncounter(false)
      }
    }

    void loadEncounterOptions()

    return () => {
      hasCancelled = true
    }
  }, [question.optionCount, question.minLoadingMs, refreshCount])

  const handleSubmit = () => {
    if (!value || !validOptionIds.has(value)) {
      setShowValidationError(true)
      return
    }

    setShowValidationError(false)
    onSubmit()
  }

  const handleRefresh = () => {
    if (hasUsedRefresh) {
      return
    }

    onValueChange('')
    setShowValidationError(false)
    setLoadError(null)
    setEncounterPrompt(question.rerollApproachPrompt)
    setHasUsedRefresh(true)
    setIsLoadingEncounter(true)
    setRefreshCount((count) => count + 1)
  }

  if (isLoadingEncounter) {
    return (
      <div className="game-panel">
        <TypewriterPrompt key={encounterPrompt} text={encounterPrompt} />
      </div>
    )
  }

  return (
    <QuestionScreen
      prompt={question.prompt}
      submitLabel="Continue"
      errorMessage={
        loadError ||
        (showValidationError ? 'Please choose one Pokemon from the encounter.' : undefined)
      }
      onSubmit={handleSubmit}
    >
      <p className="pixel-label">{question.label}</p>
      <div className="wild-option-grid" role="radiogroup" aria-label={question.label}>
        {encounterOptions.map((option) => {
          const isSelected = value === option.id

          return (
            <button
              key={option.id}
              type="button"
              className={`wild-option-button${isSelected ? ' is-selected' : ''}`}
              onClick={() => {
                onValueChange(option.id)
                if (showValidationError) {
                  setShowValidationError(false)
                }
              }}
              role="radio"
              aria-checked={isSelected}
            >
              <img
                src={option.mediaUrl}
                alt=""
                aria-hidden="true"
                className="wild-option-media"
                loading="lazy"
              />
              <span className="wild-option-name">
                #{option.pokemonNumber} {option.pokemonName}
              </span>
            </button>
          )
        })}
      </div>
      {!hasUsedRefresh ? (
        <button type="button" className="pixel-button pixel-button-secondary" onClick={handleRefresh}>
          I dont want any
        </button>
      ) : null}
    </QuestionScreen>
  )
}
