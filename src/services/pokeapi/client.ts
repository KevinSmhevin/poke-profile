const POKE_API_BASE_URL = 'https://pokeapi.co/api/v2'

export type PokemonSummary = {
  id: number
  name: string
  imageUrl: string
}

export async function fetchPokemonByName(name: string): Promise<PokemonSummary> {
  const response = await fetch(`${POKE_API_BASE_URL}/pokemon/${name}`)

  if (!response.ok) {
    throw new Error(`Unable to load Pokemon data for "${name}".`)
  }

  const payload = await response.json()

  return {
    id: payload.id,
    name: payload.name,
    imageUrl: payload.sprites.front_default,
  }
}
