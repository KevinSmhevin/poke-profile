import html2canvas from 'html2canvas'

export async function saveElementScreenshot(
  element: HTMLElement,
  fileName = 'pokemon-profile-results.png',
) {
  const screenshotCanvas = await html2canvas(element, {
    useCORS: true,
    scale: 2,
    backgroundColor: '#1a2128',
  })
  const screenshotUrl = screenshotCanvas.toDataURL('image/png')
  const downloadAnchor = document.createElement('a')

  downloadAnchor.href = screenshotUrl
  downloadAnchor.download = fileName
  downloadAnchor.click()
}
