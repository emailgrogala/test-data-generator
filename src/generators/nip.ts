const NIP_WEIGHTS = [6, 5, 7, 2, 3, 4, 5, 6, 7] as const

function randomDigit(): number {
  return Math.floor(Math.random() * 10)
}

export function calculateNipChecksum(firstNineDigits: string): number | null {
  if (!/^\d{9}$/.test(firstNineDigits)) {
    throw new Error('NIP checksum requires exactly 9 digits')
  }

  const checksum = [...firstNineDigits].reduce(
    (sum, digit, index) => sum + Number(digit) * NIP_WEIGHTS[index],
    0,
  ) % 11

  return checksum === 10 ? null : checksum
}

export function isValidNip(value: string): boolean {
  if (!/^\d{10}$/.test(value)) {
    return false
  }

  const checksum = calculateNipChecksum(value.slice(0, 9))
  return checksum !== null && checksum === Number(value[9])
}

export function generateNip(): string {
  let firstNineDigits: string
  let checksum: number | null

  do {
    firstNineDigits = Array.from({ length: 9 }, randomDigit).join('')
    checksum = calculateNipChecksum(firstNineDigits)
  } while (checksum === null)

  return `${firstNineDigits}${checksum}`
}
