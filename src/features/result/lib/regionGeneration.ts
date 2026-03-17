const REGION_ID_TO_GENERATION_ID: Record<string, number> = {
  '1': 1,
  '2': 2,
  '3': 3,
  '4': 4,
  '5': 5,
  '6': 6,
  '7': 7,
  '8': 8,
  // Hisui shares Generation VIII roster group.
  '9': 8,
  '10': 9,
}

export function mapRegionIdToGenerationId(regionId: string | undefined): number | null {
  if (!regionId) {
    return null
  }

  return REGION_ID_TO_GENERATION_ID[regionId] ?? null
}
