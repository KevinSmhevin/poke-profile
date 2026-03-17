const POKE_API_BASE_URL = 'https://pokeapi.co/api/v2'

type TypePokemonEntry = {
  pokemon: {
    name: string
  }
}

type TypeResponse = {
  pokemon: TypePokemonEntry[]
}

export async function fetchTypePokemonNames(pokemonType: string): Promise<string[]> {
  const response = await fetch(`${POKE_API_BASE_URL}/type/${pokemonType}`)

  if (!response.ok) {
    throw new Error(`Unable to load pokemon type data for "${pokemonType}".`)
  }

  const payload = (await response.json()) as TypeResponse
  return payload.pokemon.map((entry) => entry.pokemon.name)
}
