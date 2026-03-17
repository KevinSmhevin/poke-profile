const POKE_API_BASE_URL = 'https://pokeapi.co/api/v2'

export type PokemonSummary = {
  id: number
  name: string
  imageUrl: string
  showdownGifUrl: string
}

type PokemonApiResponse = {
  id: number
  name: string
  sprites: {
    front_default: string | null
    other?: {
      showdown?: {
        front_default: string | null
      }
    }
  }
}

function mapPokemonPayload(payload: PokemonApiResponse): PokemonSummary {
  return {
    id: payload.id,
    name: payload.name,
    imageUrl: payload.sprites.front_default ?? '',
    showdownGifUrl: payload.sprites.other?.showdown?.front_default ?? '',
  }
}

async function fetchPokemonResource(resource: string): Promise<PokemonSummary> {
  const response = await fetch(`${POKE_API_BASE_URL}/pokemon/${resource}`)

  if (!response.ok) {
    throw new Error(`Unable to load Pokemon data for "${resource}".`)
  }

  const payload = (await response.json()) as PokemonApiResponse
  return mapPokemonPayload(payload)
}

export async function fetchPokemonByName(name: string): Promise<PokemonSummary> {
  return fetchPokemonResource(name)
}

export async function fetchPokemonById(id: number): Promise<PokemonSummary> {
  return fetchPokemonResource(String(id))
}
