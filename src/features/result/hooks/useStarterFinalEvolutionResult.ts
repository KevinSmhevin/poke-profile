import { useEffect, useRef, useState } from 'react'
import { fetchPokemonByName } from '../../../services/pokeapi/client'
import { fetchFinalEvolutionSpeciesName } from '../../../services/pokeapi/evolution'
import { formatPokemonDisplayName } from '../lib/deterministicScoring'

type StarterFinalEvolutionResult = {
  starterPokemonId: number | null
  pokemonNumber: number | null
  pokemonName: string | null
  pokemonImageUrl: string | null
  pokemonGifUrl: string | null
  isLoading: boolean
  errorMessage: string | null
}

const initialState: StarterFinalEvolutionResult = {
  starterPokemonId: null,
  pokemonNumber: null,
  pokemonName: null,
  pokemonImageUrl: null,
  pokemonGifUrl: null,
  isLoading: false,
  errorMessage: null,
}

export function useStarterFinalEvolutionResult(starterPokemonId: number | null) {
  const [result, setResult] = useState<StarterFinalEvolutionResult>(initialState)
  const cacheRef = useRef(
    new Map<number, { number: number; name: string; imageUrl: string; gifUrl: string }>(),
  )

  useEffect(() => {
    let hasCancelled = false

    if (!starterPokemonId) {
      return () => {
        hasCancelled = true
      }
    }

    const resolveStarterFinalEvolution = async () => {
      try {
        const cached = cacheRef.current.get(starterPokemonId)
        if (cached) {
          if (!hasCancelled) {
            setResult({
              starterPokemonId,
              pokemonNumber: cached.number,
              pokemonName: cached.name,
              pokemonImageUrl: cached.imageUrl,
              pokemonGifUrl: cached.gifUrl,
              isLoading: false,
              errorMessage: null,
            })
          }
          return
        }

        const finalEvolutionSpeciesName =
          await fetchFinalEvolutionSpeciesName(starterPokemonId)
        const finalEvolutionPokemon = await fetchPokemonByName(finalEvolutionSpeciesName)
        const resolved = {
          number: finalEvolutionPokemon.id,
          name: formatPokemonDisplayName(finalEvolutionPokemon.name),
          imageUrl: finalEvolutionPokemon.imageUrl,
          gifUrl: finalEvolutionPokemon.showdownGifUrl,
        }
        cacheRef.current.set(starterPokemonId, resolved)

        if (!hasCancelled) {
          setResult({
            starterPokemonId,
            pokemonNumber: resolved.number,
            pokemonName: resolved.name,
            pokemonImageUrl: resolved.imageUrl,
            pokemonGifUrl: resolved.gifUrl,
            isLoading: false,
            errorMessage: null,
          })
        }
      } catch {
        if (!hasCancelled) {
          setResult({
            starterPokemonId,
            pokemonNumber: null,
            pokemonName: null,
            pokemonImageUrl: null,
            pokemonGifUrl: null,
            isLoading: false,
            errorMessage: 'Unable to load starter final evolution.',
          })
        }
      }
    }

    void resolveStarterFinalEvolution()

    return () => {
      hasCancelled = true
    }
  }, [starterPokemonId])

  if (!starterPokemonId) {
    return initialState
  }

  const isCurrent = result.starterPokemonId === starterPokemonId
  return {
    starterPokemonId,
    pokemonNumber: isCurrent ? result.pokemonNumber : null,
    pokemonName: isCurrent ? result.pokemonName : null,
    pokemonImageUrl: isCurrent ? result.pokemonImageUrl : null,
    pokemonGifUrl: isCurrent ? result.pokemonGifUrl : null,
    isLoading: !isCurrent,
    errorMessage: isCurrent ? result.errorMessage : null,
  }
}
