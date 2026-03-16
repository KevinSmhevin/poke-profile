import { useEffect, useRef, useState } from 'react'
import { fetchPokemonById } from '../../../services/pokeapi/client'
import {
  formatPokemonDisplayName,
  getDeterministicPokemonNumber,
  getDeterministicInputSignature,
  hasRequiredIdentityAnswers,
} from '../lib/deterministicScoring'
import type { SurveyAnswers } from '../../survey/types'

type DeterministicPokemonResult = {
  inputSignature: string | null
  pokemonNumber: number | null
  pokemonName: string | null
  isLoading: boolean
  errorMessage: string | null
}

const initialResultState: DeterministicPokemonResult = {
  inputSignature: null,
  pokemonNumber: null,
  pokemonName: null,
  isLoading: false,
  errorMessage: null,
}

export function useDeterministicPokemonResult(answers: SurveyAnswers) {
  const [result, setResult] = useState<DeterministicPokemonResult>(initialResultState)
  const pokemonNameByNumberRef = useRef(new Map<number, string>())
  const hasRequiredInputs = hasRequiredIdentityAnswers(answers)
  const inputSignature = hasRequiredInputs ? getDeterministicInputSignature(answers) : null

  useEffect(() => {
    let hasCancelled = false

    if (!hasRequiredInputs || !inputSignature) {
      return () => {
        hasCancelled = true
      }
    }

    const resolveResult = async () => {
      try {
        const pokemonNumber = await getDeterministicPokemonNumber(answers)

        const cachedPokemonName = pokemonNameByNumberRef.current.get(pokemonNumber)
        if (cachedPokemonName) {
          if (!hasCancelled) {
            setResult({
              inputSignature,
              pokemonNumber,
              pokemonName: cachedPokemonName,
              isLoading: false,
              errorMessage: null,
            })
          }
          return
        }

        const pokemon = await fetchPokemonById(pokemonNumber)
        const displayName = formatPokemonDisplayName(pokemon.name)
        pokemonNameByNumberRef.current.set(pokemonNumber, displayName)

        if (!hasCancelled) {
          setResult({
            inputSignature,
            pokemonNumber,
            pokemonName: displayName,
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
            isLoading: false,
            errorMessage: 'Unable to calculate your Pokemon right now.',
          })
        }
      }
    }

    void resolveResult()

    return () => {
      hasCancelled = true
    }
  }, [answers, hasRequiredInputs, inputSignature])

  if (!hasRequiredInputs || !inputSignature) {
    return initialResultState
  }

  const isCurrentSignature = result.inputSignature === inputSignature
  return {
    inputSignature,
    pokemonNumber: isCurrentSignature ? result.pokemonNumber : null,
    pokemonName: isCurrentSignature ? result.pokemonName : null,
    isLoading: !isCurrentSignature,
    errorMessage: isCurrentSignature ? result.errorMessage : null,
  }
}
