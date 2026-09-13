import { describe, expect, it } from 'vitest'
import {
  generateBankAccount,
  generateIban,
  generateNrb,
  isValidNrb,
  isValidPolishIban,
  nrbToIban,
} from './bankAccount'
import { generateRecords, MAX_RECORD_COUNT } from './records'

function ibanModulo97(iban: string): bigint {
  const rearranged = `${iban.slice(4)}${iban.slice(0, 4)}`
  const numeric = [...rearranged]
    .map((character) =>
      /[A-Z]/.test(character)
        ? (character.charCodeAt(0) - 55).toString()
        : character,
    )
    .join('')

  return BigInt(numeric) % 97n
}

function changeFirstCheckDigit(value: string): string {
  const digit = Number(value[0])
  return `${(digit + 1) % 10}${value.slice(1)}`
}

describe('Polish bank account generator', () => {
  it('generates a 26-digit NRB', () => {
    const nrb = generateNrb()

    expect(nrb).toMatch(/^\d{26}$/)
    expect(nrb).toHaveLength(26)
  })

  it('generates an NRB that passes modulo 97 validation', () => {
    const nrb = generateNrb()

    expect(isValidNrb(nrb)).toBe(true)
    expect(ibanModulo97(`PL${nrb}`)).toBe(1n)
  })

  it('rejects an NRB with an invalid check digit', () => {
    const invalidNrb = changeFirstCheckDigit(generateNrb())

    expect(isValidNrb(invalidNrb)).toBe(false)
  })

  it('generates a Polish IBAN without spaces', () => {
    const iban = generateIban()

    expect(iban).toMatch(/^PL\d{26}$/)
    expect(iban).toHaveLength(28)
    expect(iban).not.toContain(' ')
  })

  it('generates an IBAN that independently passes modulo 97 validation', () => {
    const iban = generateIban()

    expect(isValidPolishIban(iban)).toBe(true)
    expect(ibanModulo97(iban)).toBe(1n)
  })

  it.each(['DE00123456789012345678', 'PL001234', 'PL 12345678901234567890123456'])(
    'rejects an invalid Polish IBAN: %s',
    (iban) => {
      expect(isValidPolishIban(iban)).toBe(false)
    },
  )

  it('rejects an IBAN with an invalid check digit', () => {
    const iban = generateIban()
    const invalidIban = `PL${changeFirstCheckDigit(iban.slice(2))}`

    expect(isValidPolishIban(invalidIban)).toBe(false)
  })

  it('converts a valid NRB to IBAN', () => {
    const nrb = generateNrb()
    const iban = nrbToIban(nrb)

    expect(iban).toBe(`PL${nrb}`)
    expect(isValidPolishIban(iban)).toBe(true)
  })

  it('rejects conversion of an invalid NRB', () => {
    expect(() => nrbToIban('0'.repeat(26))).toThrow(
      'Cannot convert an invalid NRB',
    )
  })

  it('generates one valid record', () => {
    const values = generateRecords(1, () => generateBankAccount('nrb'))

    expect(values).toHaveLength(1)
    expect(isValidNrb(values[0])).toBe(true)
  })

  it.each([
    ['nrb', isValidNrb],
    ['iban', isValidPolishIban],
  ] as const)('generates 1000 valid %s records', (format, validate) => {
    const values = generateRecords(MAX_RECORD_COUNT, () =>
      generateBankAccount(format),
    )

    expect(values).toHaveLength(MAX_RECORD_COUNT)
    values.forEach((value) => expect(validate(value)).toBe(true))
  })
})
