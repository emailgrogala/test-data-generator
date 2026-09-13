import { describe, expect, it } from 'vitest'
import {
  generateRecords,
  MAX_RECORD_COUNT,
  MIN_RECORD_COUNT,
} from './records'

describe('generateRecords', () => {
  it.each([MIN_RECORD_COUNT, MAX_RECORD_COUNT])(
    'generates the supported boundary count: %s',
    (count) => {
      expect(generateRecords(count, (index) => index)).toHaveLength(count)
    },
  )

  it.each([0, MAX_RECORD_COUNT + 1, 1.5, Number.NaN])(
    'rejects an invalid record count: %s',
    (count) => {
      expect(() => generateRecords(count, () => 'value')).toThrow(
        `Record count must be an integer from ${MIN_RECORD_COUNT} to ${MAX_RECORD_COUNT}`,
      )
    },
  )
})
