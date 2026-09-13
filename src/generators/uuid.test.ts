import { describe, expect, it } from 'vitest'
import { generateRecords } from './records'
import { generateUuid } from './uuid'

const UUID_V4_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

describe('generateUuid', () => {
  it('generates a valid RFC 4122 version 4 UUID', () => {
    expect(generateUuid()).toMatch(UUID_V4_PATTERN)
  })

  it('generates multiple unique UUID v4 values', () => {
    const values = generateRecords(100, generateUuid)

    expect(values).toHaveLength(100)
    expect(new Set(values).size).toBe(100)
    values.forEach((value) => expect(value).toMatch(UUID_V4_PATTERN))
  })
})
