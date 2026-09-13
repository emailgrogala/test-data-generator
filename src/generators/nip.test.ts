import { describe, expect, it } from 'vitest'
import { calculateNipChecksum, generateNip, isValidNip } from './nip'
import { generateRecords, MAX_RECORD_COUNT } from './records'

function changeCheckDigit(nip: string): string {
  return `${nip.slice(0, 9)}${(Number(nip[9]) + 1) % 10}`
}

describe('NIP generator', () => {
  it('calculates a checksum for a synthetic prefix', () => {
    expect(calculateNipChecksum('123456321')).toBe(8)
  })

  it('returns null when a prefix cannot form a valid NIP', () => {
    expect(calculateNipChecksum('900000000')).toBeNull()
  })

  it('rejects malformed checksum input', () => {
    expect(() => calculateNipChecksum('123')).toThrow(
      'NIP checksum requires exactly 9 digits',
    )
  })

  it('generates a 10-digit NIP', () => {
    const nip = generateNip()

    expect(nip).toMatch(/^\d{10}$/)
    expect(nip).toHaveLength(10)
  })

  it('generates a NIP that passes independent validation', () => {
    expect(isValidNip(generateNip())).toBe(true)
  })

  it('rejects a NIP with an invalid check digit', () => {
    expect(isValidNip(changeCheckDigit(generateNip()))).toBe(false)
  })

  it.each(['123', '123456789A', '123 456 789'])('rejects invalid NIP: %s', (nip) => {
    expect(isValidNip(nip)).toBe(false)
  })

  it('generates one valid record', () => {
    const values = generateRecords(1, generateNip)

    expect(values).toHaveLength(1)
    expect(isValidNip(values[0])).toBe(true)
  })

  it('generates 1000 valid records', () => {
    const values = generateRecords(MAX_RECORD_COUNT, generateNip)

    expect(values).toHaveLength(MAX_RECORD_COUNT)
    values.forEach((value) => expect(isValidNip(value)).toBe(true))
  })
})
