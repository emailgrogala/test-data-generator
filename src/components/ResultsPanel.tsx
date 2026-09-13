import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded'
import {
  Box,
  Button,
  IconButton,
  Paper,
  Stack,
  Typography,
} from '@mui/material'

interface ResultsPanelProps {
  values: string[]
  onCopy: (values: string[]) => void
}

export function ResultsPanel({ values, onCopy }: ResultsPanelProps) {
  return (
    <Paper elevation={0} className="results-panel" aria-live="polite">
      <Stack
        direction="row"
        spacing={2}
        sx={{ alignItems: 'center', justifyContent: 'space-between' }}
      >
        <Box>
          <Typography variant="overline" color="text.secondary">
            Wyniki
          </Typography>
          <Typography component="h2" variant="h6">
            Wygenerowano: {values.length}
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<ContentCopyRoundedIcon />}
          onClick={() => onCopy(values)}
          disabled={values.length === 0}
        >
          Kopiuj wszystko
        </Button>
      </Stack>

      {values.length === 0 ? (
        <Typography className="result-placeholder">
          Wygenerowane wartości pojawią się tutaj.
        </Typography>
      ) : (
        <Box component="ol" className="results-list">
          {values.map((value, index) => (
            <Box component="li" className="result-row" key={`${index}-${value}`}>
              <Typography component="code" className="result-value">
                {value}
              </Typography>
              <IconButton
                aria-label={`Kopiuj wartość ${index + 1}`}
                onClick={() => onCopy([value])}
                size="small"
              >
                <ContentCopyRoundedIcon fontSize="small" />
              </IconButton>
            </Box>
          ))}
        </Box>
      )}
    </Paper>
  )
}
