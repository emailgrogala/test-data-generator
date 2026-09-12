import { describe, expect, it } from 'vitest'
import { generateUuid } from './uuid'

describe('generateUuid', () => {
  it('generates a valid RFC 4122 version 4 UUID', () => {
    expect(generateUuid()).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    )
  })

  it('generates unique values', () => {
    const values = new Set(Array.from({ length: 100 }, generateUuid))

    expect(values.size).toBe(100)
  })
})
