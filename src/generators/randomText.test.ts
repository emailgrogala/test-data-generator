import { describe, expect, it } from 'vitest'
import {
  generateRandomText,
  MAX_RANDOM_TEXT_LENGTH,
} from './randomText'
import { generateRecords } from './records'

describe('generateRandomText', () => {
  it.each([
    ['letters', /^[A-Za-z]+$/],
    ['numbers', /^\d+$/],
    ['alphanumeric', /^[A-Za-z0-9]+$/],
  ] as const)(
    'generates %s text with the requested length',
    (characterSet, pattern) => {
      const result = generateRandomText(64, characterSet)

      expect(result).toHaveLength(64)
      expect(result).toMatch(pattern)
    },
  )

  it('generates multiple text records', () => {
    const values = generateRecords(25, () => generateRandomText(12, 'letters'))

    expect(values).toHaveLength(25)
    values.forEach((value) => expect(value).toMatch(/^[A-Za-z]{12}$/))
  })

  it.each([0, -1, 1.5, MAX_RANDOM_TEXT_LENGTH + 1])(
    'rejects invalid length: %s',
    (length) => {
      expect(() => generateRandomText(length)).toThrow(
        `Text length must be an integer from 1 to ${MAX_RANDOM_TEXT_LENGTH}`,
      )
    },
  )

  it('supports the documented maximum length', () => {
    expect(generateRandomText(MAX_RANDOM_TEXT_LENGTH)).toHaveLength(
      MAX_RANDOM_TEXT_LENGTH,
    )
  })
})
