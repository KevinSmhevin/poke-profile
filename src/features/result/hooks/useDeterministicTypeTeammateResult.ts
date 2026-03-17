import { useEffect, useRef, useState } from 'react'
import { fetchPokemonByName } from '../../../services/pokeapi/client'
import { fetchTypePokemonNames } from '../../../services/pokeapi/type'
import {
  formatPokemonDisplayName,
  getDeterministicIndexFromSignature,
  getTypeTeammateInputSignature,
  hasRequiredTypeTeammateAnswers,
} from '../lib/deterministicScoring'
import type { SurveyAnswers } from '../../survey/types'

type DeterministicTypeTeammateResult = {
  inputSignature: string | null
  pokemonNumber: number | null
  pokemonName: string | null
  pokemonImageUrl: string | null
  pokemonGifUrl: string | null
  isLoading: boolean
  errorMessage: string | null
}

const initialState: DeterministicTypeTeammateResult = {
  inputSignature: null,
  pokemonNumber: null,
  pokemonName: null,
  pokemonImageUrl: null,
  pokemonGifUrl: null,
  isLoading: false,
  errorMessage: null,
}

export function useDeterministicTypeTeammateResult(answers: SurveyAnswers) {
  const [result, setResult] = useState<DeterministicTypeTeammateResult>(initialState)
  const speciesCacheByTypeRef = useRef(new Map<string, string[]>())
  const pokemonCacheBySignatureRef = useRef(
    new Map<string, { number: number; name: string; imageUrl: string; gifUrl: string }>(),
  )
  const hasRequiredInputs = hasRequiredTypeTeammateAnswers(answers)
  const selectedType = answers.favoritePokemonType ?? ''
  const inputSignature =
    hasRequiredInputs && selectedType
      ? getTypeTeammateInputSignature(answers, selectedType)
      : null

  useEffect(() => {
    let hasCancelled = false

    if (!hasRequiredInputs || !selectedType || !inputSignature) {
      return () => {
        hasCancelled = true
      }
    }

    const resolveTypeTeammate = async () => {
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

        let typePokemonNames = speciesCacheByTypeRef.current.get(selectedType)
        if (!typePokemonNames) {
          typePokemonNames = await fetchTypePokemonNames(selectedType)
          speciesCacheByTypeRef.current.set(selectedType, typePokemonNames)
        }

        if (typePokemonNames.length === 0) {
          throw new Error('Type pokemon list is empty.')
        }

        const deterministicIndex = await getDeterministicIndexFromSignature(
          inputSignature,
          typePokemonNames.length,
        )
        const selectedPokemonName = typePokemonNames[deterministicIndex]
        const pokemon = await fetchPokemonByName(selectedPokemonName)
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
            errorMessage: 'Unable to calculate type-based team member right now.',
          })
        }
      }
    }

    void resolveTypeTeammate()

    return () => {
      hasCancelled = true
    }
  }, [answers, hasRequiredInputs, inputSignature, selectedType])

  if (!hasRequiredInputs || !selectedType || !inputSignature) {
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
