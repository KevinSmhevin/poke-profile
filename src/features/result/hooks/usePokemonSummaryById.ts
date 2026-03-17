import { useEffect, useState } from 'react'
import { fetchPokemonById } from '../../../services/pokeapi/client'
import { formatPokemonDisplayName } from '../lib/deterministicScoring'

type PokemonSummaryByIdResult = {
  requestedPokemonId: number | null
  pokemonName: string | null
  pokemonImageUrl: string | null
  pokemonGifUrl: string | null
  isLoading: boolean
  errorMessage: string | null
}

const initialState: PokemonSummaryByIdResult = {
  requestedPokemonId: null,
  pokemonName: null,
  pokemonImageUrl: null,
  pokemonGifUrl: null,
  isLoading: false,
  errorMessage: null,
}

export function usePokemonSummaryById(pokemonId: number | null) {
  const [result, setResult] = useState<PokemonSummaryByIdResult>(initialState)

  useEffect(() => {
    let hasCancelled = false

    if (!pokemonId) {
      return () => {
        hasCancelled = true
      }
    }

    const resolvePokemon = async () => {
      try {
        const pokemon = await fetchPokemonById(pokemonId)
        if (hasCancelled) {
          return
        }

        setResult({
          requestedPokemonId: pokemonId,
          pokemonName: formatPokemonDisplayName(pokemon.name),
          pokemonImageUrl: pokemon.imageUrl,
          pokemonGifUrl: pokemon.showdownGifUrl,
          isLoading: false,
          errorMessage: null,
        })
      } catch {
        if (hasCancelled) {
          return
        }

        setResult({
          requestedPokemonId: pokemonId,
          pokemonName: null,
          pokemonImageUrl: null,
          pokemonGifUrl: null,
          isLoading: false,
          errorMessage: 'Unable to load this Pokemon.',
        })
      }
    }

    void resolvePokemon()

    return () => {
      hasCancelled = true
    }
  }, [pokemonId])

  if (!pokemonId) {
    return initialState
  }

  const isCurrentRequest = result.requestedPokemonId === pokemonId
  return {
    requestedPokemonId: pokemonId,
    pokemonName: isCurrentRequest ? result.pokemonName : null,
    pokemonImageUrl: isCurrentRequest ? result.pokemonImageUrl : null,
    pokemonGifUrl: isCurrentRequest ? result.pokemonGifUrl : null,
    isLoading: !isCurrentRequest,
    errorMessage: isCurrentRequest ? result.errorMessage : null,
  }
}
