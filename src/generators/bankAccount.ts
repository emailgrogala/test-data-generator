const POLAND_COUNTRY_CODE = 'PL'
const POLAND_COUNTRY_CODE_NUMERIC = '2521'
const NRB_LENGTH = 26
const IBAN_LENGTH = 28
const BBAN_LENGTH = 24

export type BankAccountFormat = 'nrb' | 'iban'

function modulo97(value: string): number {
  return [...value].reduce(
    (remainder, digit) => (remainder * 10 + Number(digit)) % 97,
    0,
  )
}

function generateBban(): string {
  return Array.from({ length: BBAN_LENGTH }, () =>
    Math.floor(Math.random() * 10),
  ).join('')
}

function calculateCheckDigits(bban: string): string {
  const remainder = modulo97(`${bban}${POLAND_COUNTRY_CODE_NUMERIC}00`)
  return (98 - remainder).toString().padStart(2, '0')
}

export function isValidNrb(value: string): boolean {
  if (value.length !== NRB_LENGTH || !/^\d+$/.test(value)) {
    return false
  }

  const rearranged = `${value.slice(2)}${POLAND_COUNTRY_CODE_NUMERIC}${value.slice(0, 2)}`
  return modulo97(rearranged) === 1
}

export function isValidPolishIban(value: string): boolean {
  if (!/^PL\d{26}$/.test(value) || value.length !== IBAN_LENGTH) {
    return false
  }

  const rearranged = `${value.slice(4)}${POLAND_COUNTRY_CODE_NUMERIC}${value.slice(2, 4)}`
  return modulo97(rearranged) === 1
}

export function generateNrb(): string {
  const bban = generateBban()
  return `${calculateCheckDigits(bban)}${bban}`
}

export function nrbToIban(nrb: string): string {
  if (!isValidNrb(nrb)) {
    throw new Error('Cannot convert an invalid NRB')
  }

  return `${POLAND_COUNTRY_CODE}${nrb}`
}

export function generateIban(): string {
  return nrbToIban(generateNrb())
}

export function generateBankAccount(format: BankAccountFormat): string {
  return format === 'nrb' ? generateNrb() : generateIban()
}
