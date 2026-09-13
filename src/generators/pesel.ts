const CHECKSUM_WEIGHTS = [1, 3, 7, 9, 1, 3, 7, 9, 1, 3] as const
const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000

export const MIN_PESEL_DATE = '1800-01-01'
export const MAX_PESEL_DATE = '2299-12-31'

export type PeselGender = 'any' | 'female' | 'male'
export type PeselValidationErrorCode =
  | 'invalid-date'
  | 'date-out-of-range'
  | 'reversed-date-range'

export class PeselValidationError extends Error {
  readonly code: PeselValidationErrorCode

  constructor(code: PeselValidationErrorCode) {
    super(code)
    this.name = 'PeselValidationError'
    this.code = code
  }
}

export interface PeselOptions {
  dateFrom: string
  dateTo: string
  gender: PeselGender
}

export const DEFAULT_PESEL_OPTIONS: PeselOptions = {
  dateFrom: '1940-01-01',
  dateTo: '2009-12-31',
  gender: 'any',
}

function randomInteger(maxExclusive: number): number {
  return Math.floor(Math.random() * maxExclusive)
}

function parseIsoDate(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)

  if (!match) {
    return null
  }

  const [, yearValue, monthValue, dayValue] = match
  const year = Number(yearValue)
  const month = Number(monthValue)
  const day = Number(dayValue)
  const date = new Date(Date.UTC(year, month - 1, day))

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null
  }

  return date
}

export function getPeselOptionsError(
  options: PeselOptions,
): PeselValidationErrorCode | null {
  const dateFrom = parseIsoDate(options.dateFrom)
  const dateTo = parseIsoDate(options.dateTo)
  const minDate = parseIsoDate(MIN_PESEL_DATE)!
  const maxDate = parseIsoDate(MAX_PESEL_DATE)!

  if (!dateFrom || !dateTo) {
    return 'invalid-date'
  }

  if (
    dateFrom < minDate ||
    dateFrom > maxDate ||
    dateTo < minDate ||
    dateTo > maxDate
  ) {
    return 'date-out-of-range'
  }

  if (dateFrom > dateTo) {
    return 'reversed-date-range'
  }

  return null
}

function getRandomDate(dateFrom: Date, dateTo: Date): Date {
  const numberOfDays =
    Math.round((dateTo.getTime() - dateFrom.getTime()) / MILLISECONDS_PER_DAY) +
    1

  return new Date(
    dateFrom.getTime() + randomInteger(numberOfDays) * MILLISECONDS_PER_DAY,
  )
}

function encodeMonth(month: number, year: number): number {
  if (year >= 2200) return month + 60
  if (year >= 2100) return month + 40
  if (year >= 2000) return month + 20
  if (year >= 1900) return month

  return month + 80
}

function getGenderDigit(gender: PeselGender): number {
  if (gender === 'female') return randomInteger(5) * 2
  if (gender === 'male') return randomInteger(5) * 2 + 1

  return randomInteger(10)
}

function pad(value: number): string {
  return value.toString().padStart(2, '0')
}

export function calculatePeselChecksum(firstTenDigits: string): number {
  if (!/^\d{10}$/.test(firstTenDigits)) {
    throw new Error('PESEL checksum requires exactly 10 digits')
  }

  const weightedSum = [...firstTenDigits].reduce(
    (sum, digit, index) => sum + Number(digit) * CHECKSUM_WEIGHTS[index],
    0,
  )

  return (10 - (weightedSum % 10)) % 10
}

export function generatePesel(
  options: PeselOptions = DEFAULT_PESEL_OPTIONS,
): string {
  const validationError = getPeselOptionsError(options)

  if (validationError) {
    throw new PeselValidationError(validationError)
  }

  const date = getRandomDate(
    parseIsoDate(options.dateFrom)!,
    parseIsoDate(options.dateTo)!,
  )
  const year = date.getUTCFullYear()
  const month = encodeMonth(date.getUTCMonth() + 1, year)
  const datePart = `${pad(year % 100)}${pad(month)}${pad(date.getUTCDate())}`
  const series = Array.from({ length: 3 }, () => randomInteger(10)).join('')
  const firstTenDigits = datePart + series + getGenderDigit(options.gender)

  return firstTenDigits + calculatePeselChecksum(firstTenDigits)
}
