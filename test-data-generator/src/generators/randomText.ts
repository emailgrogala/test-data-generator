export type CharacterSet = 'letters' | 'numbers' | 'alphanumeric'

export const MAX_RANDOM_TEXT_LENGTH = 1000

const CHARACTER_SETS: Record<CharacterSet, string> = {
  letters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  alphanumeric:
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
}

export function generateRandomText(
  length: number,
  characterSet: CharacterSet = 'alphanumeric',
): string {
  if (
    !Number.isInteger(length) ||
    length < 1 ||
    length > MAX_RANDOM_TEXT_LENGTH
  ) {
    throw new Error(
      `Text length must be an integer from 1 to ${MAX_RANDOM_TEXT_LENGTH}`,
    )
  }

  const characters = CHARACTER_SETS[characterSet]

  return Array.from(
    { length },
    () => characters[Math.floor(Math.random() * characters.length)],
  ).join('')
}
