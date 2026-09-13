export const MIN_RECORD_COUNT = 1
export const MAX_RECORD_COUNT = 1000

export function isValidRecordCount(count: number): boolean {
  return (
    Number.isInteger(count) &&
    count >= MIN_RECORD_COUNT &&
    count <= MAX_RECORD_COUNT
  )
}

export function generateRecords<T>(
  count: number,
  generateValue: (index: number) => T,
): T[] {
  if (!isValidRecordCount(count)) {
    throw new Error(
      `Record count must be an integer from ${MIN_RECORD_COUNT} to ${MAX_RECORD_COUNT}`,
    )
  }

  return Array.from({ length: count }, (_, index) => generateValue(index))
}
