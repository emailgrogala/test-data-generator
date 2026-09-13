import { TextField } from '@mui/material'
import {
  MAX_RECORD_COUNT,
  MIN_RECORD_COUNT,
} from '../generators/records'

interface RecordCountFieldProps {
  value: string
  onChange: (value: string) => void
  valid: boolean
}

export function RecordCountField({
  value,
  onChange,
  valid,
}: RecordCountFieldProps) {
  return (
    <TextField
      label="Liczba rekordów"
      type="number"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      error={!valid}
      helperText={
        valid
          ? `Od ${MIN_RECORD_COUNT} do ${MAX_RECORD_COUNT}`
          : `Podaj liczbę całkowitą od ${MIN_RECORD_COUNT} do ${MAX_RECORD_COUNT}`
      }
      slotProps={{
        htmlInput: {
          min: MIN_RECORD_COUNT,
          max: MAX_RECORD_COUNT,
          step: 1,
        },
      }}
      fullWidth
    />
  )
}
