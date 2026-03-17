const POKE_API_BASE_URL = 'https://pokeapi.co/api/v2'

type GenerationPokemonSpecies = {
  name: string
}

type GenerationResponse = {
  pokemon_species: GenerationPokemonSpecies[]
}

export async function fetchGenerationPokemonSpeciesNames(
  generationId: number,
): Promise<string[]> {
  const response = await fetch(`${POKE_API_BASE_URL}/generation/${generationId}`)

  if (!response.ok) {
    throw new Error(`Unable to load generation data for "${generationId}".`)
  }

  const payload = (await response.json()) as GenerationResponse
  return payload.pokemon_species.map((species) => species.name)
}
