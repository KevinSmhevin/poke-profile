const POKE_API_BASE_URL = 'https://pokeapi.co/api/v2'

type PokemonSpeciesResponse = {
  evolution_chain: {
    url: string
  }
}

type EvolutionChainNode = {
  species: {
    name: string
  }
  evolves_to: EvolutionChainNode[]
}

type EvolutionChainResponse = {
  chain: EvolutionChainNode
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Unable to load resource: ${url}`)
  }

  return (await response.json()) as T
}

function getFinalEvolutionNode(chain: EvolutionChainNode): EvolutionChainNode {
  let currentNode = chain

  while (currentNode.evolves_to.length > 0) {
    currentNode = currentNode.evolves_to[0]
  }

  return currentNode
}

export async function fetchFinalEvolutionSpeciesName(
  pokemonResource: string | number,
): Promise<string> {
  const speciesUrl = `${POKE_API_BASE_URL}/pokemon-species/${pokemonResource}/`
  const species = await fetchJson<PokemonSpeciesResponse>(speciesUrl)
  const evolutionChain = await fetchJson<EvolutionChainResponse>(species.evolution_chain.url)
  const finalEvolutionNode = getFinalEvolutionNode(evolutionChain.chain)

  return finalEvolutionNode.species.name
}
