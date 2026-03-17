import type { StarterOption } from '../types'
import { getPublicAssetPath } from '../../../services/assets/publicAsset'

type StarterSeed = {
  name: string
  pokemonNumber: number
}

const REGION_STARTER_SEEDS: Record<string, StarterSeed[]> = {
  '1': [
    { name: 'Bulbasaur', pokemonNumber: 1 },
    { name: 'Charmander', pokemonNumber: 4 },
    { name: 'Squirtle', pokemonNumber: 7 },
  ],
  '2': [
    { name: 'Chikorita', pokemonNumber: 152 },
    { name: 'Cyndaquil', pokemonNumber: 155 },
    { name: 'Totodile', pokemonNumber: 158 },
  ],
  '3': [
    { name: 'Treecko', pokemonNumber: 252 },
    { name: 'Torchic', pokemonNumber: 255 },
    { name: 'Mudkip', pokemonNumber: 258 },
  ],
  '4': [
    { name: 'Turtwig', pokemonNumber: 387 },
    { name: 'Chimchar', pokemonNumber: 390 },
    { name: 'Piplup', pokemonNumber: 393 },
  ],
  '5': [
    { name: 'Snivy', pokemonNumber: 495 },
    { name: 'Tepig', pokemonNumber: 498 },
    { name: 'Oshawott', pokemonNumber: 501 },
  ],
  '6': [
    { name: 'Chespin', pokemonNumber: 650 },
    { name: 'Fennekin', pokemonNumber: 653 },
    { name: 'Froakie', pokemonNumber: 656 },
  ],
  '7': [
    { name: 'Rowlet', pokemonNumber: 722 },
    { name: 'Litten', pokemonNumber: 725 },
    { name: 'Popplio', pokemonNumber: 728 },
  ],
  '8': [
    { name: 'Grookey', pokemonNumber: 810 },
    { name: 'Scorbunny', pokemonNumber: 813 },
    { name: 'Sobble', pokemonNumber: 816 },
  ],
  // Legends Arceus starters for Hisui.
  '9': [
    { name: 'Rowlet', pokemonNumber: 722 },
    { name: 'Cyndaquil', pokemonNumber: 155 },
    { name: 'Oshawott', pokemonNumber: 501 },
  ],
  '10': [
    { name: 'Sprigatito', pokemonNumber: 906 },
    { name: 'Fuecoco', pokemonNumber: 909 },
    { name: 'Quaxly', pokemonNumber: 912 },
  ],
}

function buildStarterOption(starterSeed: StarterSeed): StarterOption {
  const normalizedName = starterSeed.name.toLowerCase()

  return {
    id: normalizedName,
    name: starterSeed.name,
    pokemonNumber: starterSeed.pokemonNumber,
    gifSrc: getPublicAssetPath(
      `images/pokemon-starters/showdown/${starterSeed.pokemonNumber}-${normalizedName}.gif`,
    ),
  }
}

export const starterOptionsByRegionId: Record<string, StarterOption[]> = Object.fromEntries(
  Object.entries(REGION_STARTER_SEEDS).map(([regionId, seeds]) => [
    regionId,
    seeds.map(buildStarterOption),
  ]),
)
