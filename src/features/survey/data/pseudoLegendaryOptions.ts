import type { PseudoLegendaryOption } from '../types'
import { getPublicAssetPath } from '../../../services/assets/publicAsset'

const pseudoLegendaryOptions: PseudoLegendaryOption[] = [
  {
    id: 'dragonite',
    label: 'A guardian that is intelligent and kind.',
    pseudoLegendaryName: 'Dragonite',
    pseudoLegendaryNumber: 149,
    gifSrc: getPublicAssetPath('images/pseudo-legendary/showdown/149-dragonite.gif'),
  },
  {
    id: 'tyranitar',
    label: 'A destructive and arrogant force that can alter maps.',
    pseudoLegendaryName: 'Tyranitar',
    pseudoLegendaryNumber: 248,
    gifSrc: getPublicAssetPath('images/pseudo-legendary/showdown/248-tyranitar.gif'),
  },
  {
    id: 'salamence',
    label: 'A dragon that breathes fire and flies uncontrollably with joy.',
    pseudoLegendaryName: 'Salamence',
    pseudoLegendaryNumber: 373,
    gifSrc: getPublicAssetPath('images/pseudo-legendary/showdown/373-salamence.gif'),
  },
  {
    id: 'metagross',
    label: 'A supercomputer with four brains that analyzes battles instantly.',
    pseudoLegendaryName: 'Metagross',
    pseudoLegendaryNumber: 376,
    gifSrc: getPublicAssetPath('images/pseudo-legendary/showdown/376-metagross.gif'),
  },
  {
    id: 'garchomp',
    label: 'An agile flier that moves at mach speed and dives into flocks.',
    pseudoLegendaryName: 'Garchomp',
    pseudoLegendaryNumber: 445,
    gifSrc: getPublicAssetPath('images/pseudo-legendary/showdown/445-garchomp.gif'),
  },
  {
    id: 'hydreigon',
    label: 'A destructive beast that consumes everything in sight.',
    pseudoLegendaryName: 'Hydreigon',
    pseudoLegendaryNumber: 635,
    gifSrc: getPublicAssetPath('images/pseudo-legendary/showdown/635-hydreigon.gif'),
  },
  {
    id: 'goodra',
    label: 'A friendly Pokemon that is highly emotional.',
    pseudoLegendaryName: 'Goodra',
    pseudoLegendaryNumber: 706,
    gifSrc: getPublicAssetPath('images/pseudo-legendary/showdown/706-goodra.gif'),
  },
  {
    id: 'kommo-o',
    label: 'A loud warrior that intimidates its foes.',
    pseudoLegendaryName: 'Kommo-o',
    pseudoLegendaryNumber: 784,
    gifSrc: getPublicAssetPath('images/pseudo-legendary/showdown/784-kommo-o.gif'),
  },
  {
    id: 'dragapult',
    label: 'A stealth Pokemon that can become invisible at will.',
    pseudoLegendaryName: 'Dragapult',
    pseudoLegendaryNumber: 887,
    gifSrc: getPublicAssetPath('images/pseudo-legendary/showdown/887-dragapult.gif'),
  },
  {
    id: 'baxcalibur',
    label: 'A kaiju-like force that can slice through mountains.',
    pseudoLegendaryName: 'Baxcalibur',
    pseudoLegendaryNumber: 998,
    gifSrc: getPublicAssetPath('images/pseudo-legendary/showdown/998-baxcalibur.gif'),
  },
]

export { pseudoLegendaryOptions }
