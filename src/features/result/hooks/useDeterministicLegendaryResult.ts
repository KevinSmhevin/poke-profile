import { useEffect, useRef, useState } from 'react'
import { fetchPokemonById } from '../../../services/pokeapi/client'
import {
  formatPokemonDisplayName,
  getDeterministicLegendaryPokemonNumber,
  getLegendaryInputSignature,
  hasRequiredLegendaryAnswers,
} from '../lib/deterministicScoring'
import type { SurveyAnswers } from '../../survey/types'

type DeterministicLegendaryResult = {
  inputSignature: string | null
  pokemonNumber: number | null
  pokemonName: string | null
  pokemonImageUrl: string | null
  pokemonGifUrl: string | null
  isLoading: boolean
  errorMessage: string | null
}

const initialState: DeterministicLegendaryResult = {
  inputSignature: null,
  pokemonNumber: null,
  pokemonName: null,
  pokemonImageUrl: null,
  pokemonGifUrl: null,
  isLoading: false,
  errorMessage: null,
}

export function useDeterministicLegendaryResult(answers: SurveyAnswers) {
  const [result, setResult] = useState<DeterministicLegendaryResult>(initialState)
  const resultCacheRef = useRef(
    new Map<number, { name: string; imageUrl: string; gifUrl: string }>(),
  )
  const hasRequiredInputs = hasRequiredLegendaryAnswers(answers)
  const inputSignature = hasRequiredInputs ? getLegendaryInputSignature(answers) : null

  useEffect(() => {
    let hasCancelled = false

    if (!hasRequiredInputs || !inputSignature) {
      return () => {
        hasCancelled = true
      }
    }

    const resolveLegendary = async () => {
      try {
        const pokemonNumber = await getDeterministicLegendaryPokemonNumber(answers)
        const cached = resultCacheRef.current.get(pokemonNumber)

        if (cached) {
          if (!hasCancelled) {
            setResult({
              inputSignature,
              pokemonNumber,
              pokemonName: cached.name,
              pokemonImageUrl: cached.imageUrl,
              pokemonGifUrl: cached.gifUrl,
              isLoading: false,
              errorMessage: null,
            })
          }
          return
        }

        const pokemon = await fetchPokemonById(pokemonNumber)
        const mapped = {
          name: formatPokemonDisplayName(pokemon.name),
          imageUrl: pokemon.imageUrl,
          gifUrl: pokemon.showdownGifUrl,
        }
        resultCacheRef.current.set(pokemonNumber, mapped)

        if (!hasCancelled) {
          setResult({
            inputSignature,
            pokemonNumber,
            pokemonName: mapped.name,
            pokemonImageUrl: mapped.imageUrl,
            pokemonGifUrl: mapped.gifUrl,
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
            errorMessage: 'Unable to calculate your Legendary Pokemon right now.',
          })
        }
      }
    }

    void resolveLegendary()

    return () => {
      hasCancelled = true
    }
  }, [answers, hasRequiredInputs, inputSignature])

  if (!hasRequiredInputs || !inputSignature) {
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
