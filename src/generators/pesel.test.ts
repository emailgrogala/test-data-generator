import { describe, expect, it } from 'vitest'
import {
  calculatePeselChecksum,
  generatePesel,
  getPeselOptionsError,
  MAX_PESEL_DATE,
  MIN_PESEL_DATE,
} from './pesel'
import type { PeselOptions } from './pesel'
import { generateRecords } from './records'

function decodePeselDate(pesel: string): string {
  const yearPart = Number(pesel.slice(0, 2))
  const encodedMonth = Number(pesel.slice(2, 4))
  const day = pesel.slice(4, 6)
  let century: number
  let month: number

  if (encodedMonth >= 81) {
    century = 1800
    month = encodedMonth - 80
  } else if (encodedMonth >= 61) {
    century = 2200
    month = encodedMonth - 60
  } else if (encodedMonth >= 41) {
    century = 2100
    month = encodedMonth - 40
  } else if (encodedMonth >= 21) {
    century = 2000
    month = encodedMonth - 20
  } else {
    century = 1900
    month = encodedMonth
  }

  return `${century + yearPart}-${month.toString().padStart(2, '0')}-${day}`
}

function options(overrides: Partial<PeselOptions> = {}): PeselOptions {
  return {
    dateFrom: '1990-01-01',
    dateTo: '2020-12-31',
    gender: 'any',
    ...overrides,
  }
}

describe('generatePesel', () => {
  it('calculates the checksum for a known PESEL example', () => {
    expect(calculatePeselChecksum('4405140145')).toBe(8)
  })

  it('generates multiple PESEL values with valid checksums', () => {
    const values = generateRecords(50, () => generatePesel(options()))

    expect(values).toHaveLength(50)
    values.forEach((pesel) => {
      expect(pesel).toMatch(/^\d{11}$/)
      expect(Number(pesel.at(-1))).toBe(
        calculatePeselChecksum(pesel.slice(0, 10)),
      )
    })
  })

  it.each([
    '1800-01-01',
    '1899-12-31',
    '1900-01-01',
    '1999-12-31',
    '2000-01-01',
    '2099-12-31',
    '2100-01-01',
    '2199-12-31',
    '2200-01-01',
    '2299-12-31',
  ])('encodes the date and century for %s', (date) => {
    const pesel = generatePesel(
      options({ dateFrom: date, dateTo: date }),
    )

    expect(decodePeselDate(pesel)).toBe(date)
  })

  it('keeps generated dates within the requested range', () => {
    const values = generateRecords(100, () =>
      generatePesel(options({ dateFrom: '2001-03-10', dateTo: '2001-03-20' })),
    )

    values.forEach((pesel) => {
      const date = decodePeselDate(pesel)
      expect(date >= '2001-03-10').toBe(true)
      expect(date <= '2001-03-20').toBe(true)
    })
  })

  it.each([
    ['female', 0],
    ['male', 1],
  ] as const)('encodes %s gender', (gender, expectedParity) => {
    const values = generateRecords(50, () =>
      generatePesel(options({ gender })),
    )

    values.forEach((pesel) => {
      expect(Number(pesel[9]) % 2).toBe(expectedParity)
    })
  })

  it('rejects a reversed date range', () => {
    const invalidOptions = options({
      dateFrom: '2020-01-02',
      dateTo: '2020-01-01',
    })

    expect(getPeselOptionsError(invalidOptions)).toBe(
      'Start date cannot be later than end date',
    )
    expect(() => generatePesel(invalidOptions)).toThrow(
      'Start date cannot be later than end date',
    )
  })

  it.each([
    ['1799-12-31', '2000-01-01'],
    ['2000-01-01', '2300-01-01'],
    ['2300-01-01', '2300-01-02'],
    ['1799-01-01', '1799-01-02'],
  ])('rejects dates outside the PESEL range', (dateFrom, dateTo) => {
    expect(
      getPeselOptionsError(options({ dateFrom, dateTo })),
    ).toBe(`Dates must be between ${MIN_PESEL_DATE} and ${MAX_PESEL_DATE}`)
  })

  it('rejects malformed dates and checksum input', () => {
    expect(
      getPeselOptionsError(options({ dateFrom: '2024-02-30' })),
    ).toBe('Provide valid dates')
    expect(() => calculatePeselChecksum('123')).toThrow()
  })
})
