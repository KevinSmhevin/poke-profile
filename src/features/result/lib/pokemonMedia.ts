type PokemonMedia = {
  pokemonGifUrl: string | null
  pokemonImageUrl: string | null
}

export function getPreferredPokemonMediaUrl(media: PokemonMedia): string {
  return media.pokemonGifUrl || media.pokemonImageUrl || ''
}
