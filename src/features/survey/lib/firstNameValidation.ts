import { FIRST_NAME_MAX_LENGTH } from '../data/questions'

const ALPHABETICAL_CHARACTERS_PATTERN = /[^a-zA-Z]/g
const FULL_FIRST_NAME_PATTERN = /^[a-zA-Z]{1,20}$/

export function sanitizeFirstNameInput(value: string): string {
  return value.replace(ALPHABETICAL_CHARACTERS_PATTERN, '').slice(0, FIRST_NAME_MAX_LENGTH)
}

export function isValidFirstName(value: string): boolean {
  return FULL_FIRST_NAME_PATTERN.test(value)
}
