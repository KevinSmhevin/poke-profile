import { useEffect, useRef, useState } from 'react'
import { fetchPokemonByName } from '../../../services/pokeapi/client'
import { fetchGenerationPokemonSpeciesNames } from '../../../services/pokeapi/generation'
import {
  formatPokemonDisplayName,
  getDeterministicIndexFromSignature,
  getRegionalTeammateInputSignature,
  hasRequiredRegionalTeammateAnswers,
} from '../lib/deterministicScoring'
import { mapRegionIdToGenerationId } from '../lib/regionGeneration'
import type { SurveyAnswers } from '../../survey/types'

type DeterministicRegionalTeammateResult = {
  inputSignature: string | null
  pokemonNumber: number | null
  pokemonName: string | null
  pokemonImageUrl: string | null
  pokemonGifUrl: string | null
  isLoading: boolean
  errorMessage: string | null
}

const initialState: DeterministicRegionalTeammateResult = {
  inputSignature: null,
  pokemonNumber: null,
  pokemonName: null,
  pokemonImageUrl: null,
  pokemonGifUrl: null,
  isLoading: false,
  errorMessage: null,
}

export function useDeterministicRegionalTeammateResult(answers: SurveyAnswers) {
  const [result, setResult] = useState<DeterministicRegionalTeammateResult>(initialState)
  const speciesCacheByGenerationRef = useRef(new Map<number, string[]>())
  const pokemonCacheBySignatureRef = useRef(
    new Map<string, { number: number; name: string; imageUrl: string; gifUrl: string }>(),
  )
  const hasRequiredInputs = hasRequiredRegionalTeammateAnswers(answers)
  const generationId = mapRegionIdToGenerationId(answers.trainerRegion)
  const inputSignature =
    hasRequiredInputs && generationId
      ? getRegionalTeammateInputSignature(answers, generationId)
      : null

  useEffect(() => {
    let hasCancelled = false

    if (!hasRequiredInputs || !generationId || !inputSignature) {
      return () => {
        hasCancelled = true
      }
    }

    const resolveRegionalTeammate = async () => {
      try {
        const cachedBySignature = pokemonCacheBySignatureRef.current.get(inputSignature)
        if (cachedBySignature) {
          if (!hasCancelled) {
            setResult({
              inputSignature,
              pokemonNumber: cachedBySignature.number,
              pokemonName: cachedBySignature.name,
              pokemonImageUrl: cachedBySignature.imageUrl,
              pokemonGifUrl: cachedBySignature.gifUrl,
              isLoading: false,
              errorMessage: null,
            })
          }
          return
        }

        let speciesNames = speciesCacheByGenerationRef.current.get(generationId)
        if (!speciesNames) {
          speciesNames = await fetchGenerationPokemonSpeciesNames(generationId)
          speciesCacheByGenerationRef.current.set(generationId, speciesNames)
        }

        if (speciesNames.length === 0) {
          throw new Error('Generation species list is empty.')
        }

        const deterministicIndex = await getDeterministicIndexFromSignature(
          inputSignature,
          speciesNames.length,
        )
        const selectedSpeciesName = speciesNames[deterministicIndex]
        const pokemon = await fetchPokemonByName(selectedSpeciesName)
        const resolvedPokemon = {
          number: pokemon.id,
          name: formatPokemonDisplayName(pokemon.name),
          imageUrl: pokemon.imageUrl,
          gifUrl: pokemon.showdownGifUrl,
        }
        pokemonCacheBySignatureRef.current.set(inputSignature, resolvedPokemon)

        if (!hasCancelled) {
          setResult({
            inputSignature,
            pokemonNumber: resolvedPokemon.number,
            pokemonName: resolvedPokemon.name,
            pokemonImageUrl: resolvedPokemon.imageUrl,
            pokemonGifUrl: resolvedPokemon.gifUrl,
            isLoading: false,
            errorMessage: null,
          })
        }
      } catch {
        if (!hasCancelled) {
          setResult({
            inputSignature,
            pokemonNumber: null,
            pokemonName: null,
            pokemonImageUrl: null,
            pokemonGifUrl: null,
            isLoading: false,
            errorMessage: 'Unable to calculate regional team member right now.',
          })
        }
      }
    }

    void resolveRegionalTeammate()

    return () => {
      hasCancelled = true
    }
  }, [answers, generationId, hasRequiredInputs, inputSignature])

  if (!hasRequiredInputs || !generationId || !inputSignature) {
    return initialState
  }

  const isCurrentSignature = result.inputSignature === inputSignature
  return {
    inputSignature,
    pokemonNumber: isCurrentSignature ? result.pokemonNumber : null,
    pokemonName: isCurrentSignature ? result.pokemonName : null,
    pokemonImageUrl: isCurrentSignature ? result.pokemonImageUrl : null,
    pokemonGifUrl: isCurrentSignature ? result.pokemonGifUrl : null,
    isLoading: !isCurrentSignature,
    errorMessage: isCurrentSignature ? result.errorMessage : null,
  }
}
