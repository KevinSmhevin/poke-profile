import type { SurveyAnswers } from '../../survey/types'

const SHARE_RESULTS_QUERY_PARAM = 'results'

function encodeToBase64Url(value: string): string {
  const bytes = new TextEncoder().encode(value)
  let binaryString = ''
  bytes.forEach((byte) => {
    binaryString += String.fromCharCode(byte)
  })

  return btoa(binaryString).replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '')
}

function decodeFromBase64Url(value: string): string {
  const normalizedValue = value.replaceAll('-', '+').replaceAll('_', '/')
  const remainder = normalizedValue.length % 4
  const paddedValue =
    remainder === 0 ? normalizedValue : normalizedValue + '='.repeat(4 - remainder)
  const binaryString = atob(paddedValue)
  const bytes = Uint8Array.from(binaryString, (character) => character.charCodeAt(0))

  return new TextDecoder().decode(bytes)
}

function isSurveyAnswersRecord(value: unknown): value is SurveyAnswers {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return false
  }

  return Object.values(value).every((answer) => typeof answer === 'string')
}

export function buildResultsShareUrl(answers: SurveyAnswers, baseUrl: string): string {
  const serializedAnswers = JSON.stringify(answers)
  const encodedAnswers = encodeToBase64Url(serializedAnswers)
  const url = new URL(baseUrl)

  url.searchParams.set(SHARE_RESULTS_QUERY_PARAM, encodedAnswers)
  return url.toString()
}

export function parseSharedResultsFromUrl(search: string): SurveyAnswers | null {
  const params = new URLSearchParams(search)
  const encodedAnswers = params.get(SHARE_RESULTS_QUERY_PARAM)

  if (!encodedAnswers) {
    return null
  }

  try {
    const decodedAnswers = decodeFromBase64Url(encodedAnswers)
    const parsedAnswers = JSON.parse(decodedAnswers)

    return isSurveyAnswersRecord(parsedAnswers) ? parsedAnswers : null
  } catch {
    return null
  }
}
