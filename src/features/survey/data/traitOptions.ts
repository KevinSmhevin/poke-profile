import type { TraitOption } from '../types'
import { getPublicAssetPath } from '../../../services/assets/publicAsset'

type TraitSeed = Omit<TraitOption, 'id' | 'gifSrc'>

const TRAIT_SEEDS: TraitSeed[] = [
  {
    label: 'Curious and Friendly',
    eeveelutionName: 'Eevee',
    eeveelutionNumber: 133,
    eeveelutionType: 'Normal',
  },
  {
    label: 'Positive and Independent',
    eeveelutionName: 'Vaporeon',
    eeveelutionNumber: 134,
    eeveelutionType: 'Water',
  },
  {
    label: 'Outgoing and Energetic',
    eeveelutionName: 'Jolteon',
    eeveelutionNumber: 135,
    eeveelutionType: 'Electric',
  },
  {
    label: 'Loyal and Emotional',
    eeveelutionName: 'Flareon',
    eeveelutionNumber: 136,
    eeveelutionType: 'Fire',
  },
  {
    label: 'Wise and Cautious',
    eeveelutionName: 'Espeon',
    eeveelutionNumber: 196,
    eeveelutionType: 'Psychic',
  },
  {
    label: 'Calm and Serious',
    eeveelutionName: 'Umbreon',
    eeveelutionNumber: 197,
    eeveelutionType: 'Dark',
  },
  {
    label: 'Caring and Sensitive',
    eeveelutionName: 'Leafeon',
    eeveelutionNumber: 470,
    eeveelutionType: 'Grass',
  },
  {
    label: 'Intelligent and Respectful',
    eeveelutionName: 'Glaceon',
    eeveelutionNumber: 471,
    eeveelutionType: 'Ice',
  },
  {
    label: 'Affectionate and Helpful',
    eeveelutionName: 'Sylveon',
    eeveelutionNumber: 700,
    eeveelutionType: 'Fairy',
  },
]

export const traitOptions: TraitOption[] = TRAIT_SEEDS.map((seed) => {
  const normalizedName = seed.eeveelutionName.toLowerCase()

  return {
    ...seed,
    id: normalizedName,
    gifSrc: getPublicAssetPath(
      `images/eeveelutions/showdown/${seed.eeveelutionNumber}-${normalizedName}.gif`,
    ),
  }
})
