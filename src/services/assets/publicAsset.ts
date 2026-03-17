export function getPublicAssetPath(assetPath: string): string {
  const normalizedAssetPath = assetPath.startsWith('/') ? assetPath.slice(1) : assetPath
  return `${import.meta.env.BASE_URL}${normalizedAssetPath}`
}
