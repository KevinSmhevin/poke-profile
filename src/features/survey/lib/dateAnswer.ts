function padToTwoDigits(value: number): string {
  return value.toString().padStart(2, '0')
}

export function formatDateAnswer(date: Date): string {
  const year = date.getFullYear()
  const month = padToTwoDigits(date.getMonth() + 1)
  const day = padToTwoDigits(date.getDate())

  return `${year}-${month}-${day}`
}

export function parseDateAnswer(value: string): Date | undefined {
  if (!value) {
    return undefined
  }

  const parsedDate = new Date(`${value}T00:00:00`)
  if (Number.isNaN(parsedDate.getTime())) {
    return undefined
  }

  return parsedDate
}
