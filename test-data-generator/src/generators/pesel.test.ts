import { describe, expect, it } from 'vitest'
import { calculatePeselChecksum, generatePesel } from './pesel'

describe('generatePesel', () => {
  it('calculates the checksum for a known PESEL example', () => {
    expect(calculatePeselChecksum('4405140145')).toBe(8)
  })

  it('generates an 11-digit PESEL with a valid checksum', () => {
    const pesel = generatePesel()

    expect(pesel).toMatch(/^\d{11}$/)
    expect(Number(pesel.at(-1))).toBe(calculatePeselChecksum(pesel.slice(0, 10)))
  })

  it('generates a valid encoded birth date', () => {
    const pesel = generatePesel()
    const yearPart = Number(pesel.slice(0, 2))
    const encodedMonth = Number(pesel.slice(2, 4))
    const day = Number(pesel.slice(4, 6))
    const year = encodedMonth > 20 ? 2000 + yearPart : 1900 + yearPart
    const month = encodedMonth > 20 ? encodedMonth - 20 : encodedMonth
    const date = new Date(year, month - 1, day)

    expect(date.getFullYear()).toBe(year)
    expect(date.getMonth()).toBe(month - 1)
    expect(date.getDate()).toBe(day)
  })

  it('rejects malformed checksum input', () => {
    expect(() => calculatePeselChecksum('123')).toThrow()
  })
})
