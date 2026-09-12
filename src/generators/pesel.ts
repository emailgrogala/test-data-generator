const CHECKSUM_WEIGHTS = [1, 3, 7, 9, 1, 3, 7, 9, 1, 3] as const

function randomInteger(maxExclusive: number): number {
  return Math.floor(Math.random() * maxExclusive)
}

function getRandomDate(): Date {
  const millisecondsPerDay = 24 * 60 * 60 * 1000
  const start = Date.UTC(1940, 0, 1)
  const exclusiveEnd = Date.UTC(2010, 0, 1)
  const numberOfDays = (exclusiveEnd - start) / millisecondsPerDay

  return new Date(start + randomInteger(numberOfDays) * millisecondsPerDay)
}

function encodeMonth(month: number, year: number): number {
  return year >= 2000 ? month + 20 : month
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

export function generatePesel(): string {
  const date = getRandomDate()
  const year = date.getUTCFullYear()
  const month = encodeMonth(date.getUTCMonth() + 1, year)
  const datePart = `${pad(year % 100)}${pad(month)}${pad(date.getUTCDate())}`
  const serialPart = Array.from({ length: 4 }, () => randomInteger(10)).join('')
  const firstTenDigits = datePart + serialPart

  return firstTenDigits + calculatePeselChecksum(firstTenDigits)
}
