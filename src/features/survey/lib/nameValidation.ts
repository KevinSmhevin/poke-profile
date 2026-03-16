const ALPHABETICAL_CHARACTERS_PATTERN = /[^a-zA-Z]/g

export function sanitizeNameInput(value: string, maxLength: number): string {
  return value.replace(ALPHABETICAL_CHARACTERS_PATTERN, '').slice(0, maxLength)
}

export function isValidName(value: string, maxLength: number): boolean {
  const fullNamePattern = new RegExp(`^[a-zA-Z]{1,${maxLength}}$`)
  return fullNamePattern.test(value)
}
