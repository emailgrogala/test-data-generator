import { useState } from 'react'
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded'
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  FormControl,
  FormControlLabel,
  FormLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import type { SelectChangeEvent } from '@mui/material'
import { generatePesel } from './generators/pesel'
import {
  generateRandomText,
  MAX_RANDOM_TEXT_LENGTH,
} from './generators/randomText'
import type { CharacterSet } from './generators/randomText'
import { generateUuid } from './generators/uuid'
import './App.css'

type GeneratorType = 'pesel' | 'uuid' | 'text'

const generatorLabels: Record<GeneratorType, string> = {
  pesel: 'PESEL',
  uuid: 'UUID',
  text: 'Random text',
}

function App() {
  const [generatorType, setGeneratorType] = useState<GeneratorType>('pesel')
  const [textLength, setTextLength] = useState('24')
  const [characterSet, setCharacterSet] =
    useState<CharacterSet>('alphanumeric')
  const [result, setResult] = useState('')
  const [copyStatus, setCopyStatus] = useState<'success' | 'error' | null>(null)
  const parsedTextLength = Number(textLength)
  const isTextLengthValid =
    textLength.trim() !== '' &&
    Number.isInteger(parsedTextLength) &&
    parsedTextLength >= 1 &&
    parsedTextLength <= MAX_RANDOM_TEXT_LENGTH

  const handleGeneratorChange = (event: SelectChangeEvent) => {
    setGeneratorType(event.target.value as GeneratorType)
    setResult('')
  }

  const handleGenerate = () => {
    if (generatorType === 'pesel') {
      setResult(generatePesel())
      return
    }

    if (generatorType === 'uuid') {
      setResult(generateUuid())
      return
    }

    if (isTextLengthValid) {
      setResult(generateRandomText(parsedTextLength, characterSet))
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result)
      setCopyStatus('success')
    } catch {
      setCopyStatus('error')
    }
  }

  return (
    <Box component="main" className="app-shell">
      <Container maxWidth="sm">
        <Stack spacing={4}>
          <Box className="page-heading">
            <Chip label="Developer toolkit" color="primary" size="small" />
            <Typography component="h1" variant="h3" sx={{ fontWeight: 800 }}>
              Test data generator
            </Typography>
            <Typography color="text.secondary" sx={{ fontSize: '1.05rem' }}>
              Generate safe sample values directly in your browser.
            </Typography>
          </Box>

          <Card elevation={0} className="generator-card">
            <CardContent>
              <Stack spacing={3}>
                <FormControl fullWidth>
                  <FormLabel id="generator-type-label">Data type</FormLabel>
                  <Select
                    aria-labelledby="generator-type-label"
                    value={generatorType}
                    onChange={handleGeneratorChange}
                  >
                    {Object.entries(generatorLabels).map(([value, label]) => (
                      <MenuItem key={value} value={value}>
                        {label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {generatorType === 'text' && (
                  <Stack spacing={2.5} className="text-options">
                    <TextField
                      label="Length"
                      type="number"
                      value={textLength}
                      onChange={(event) => setTextLength(event.target.value)}
                      error={!isTextLengthValid}
                      slotProps={{
                        htmlInput: {
                          min: 1,
                          max: MAX_RANDOM_TEXT_LENGTH,
                          step: 1,
                        },
                      }}
                      helperText={
                        isTextLengthValid
                          ? `Enter a value from 1 to ${MAX_RANDOM_TEXT_LENGTH}`
                          : `Length must be a whole number from 1 to ${MAX_RANDOM_TEXT_LENGTH}`
                      }
                    />
                    <FormControl>
                      <FormLabel id="character-set-label">Characters</FormLabel>
                      <RadioGroup
                        aria-labelledby="character-set-label"
                        value={characterSet}
                        onChange={(event) =>
                          setCharacterSet(event.target.value as CharacterSet)
                        }
                      >
                        <FormControlLabel
                          value="letters"
                          control={<Radio />}
                          label="Letters only"
                        />
                        <FormControlLabel
                          value="numbers"
                          control={<Radio />}
                          label="Numbers only"
                        />
                        <FormControlLabel
                          value="alphanumeric"
                          control={<Radio />}
                          label="Alphanumeric"
                        />
                      </RadioGroup>
                    </FormControl>
                  </Stack>
                )}

                <Button
                  size="large"
                  variant="contained"
                  startIcon={<AutoAwesomeRoundedIcon />}
                  onClick={handleGenerate}
                  disabled={generatorType === 'text' && !isTextLengthValid}
                >
                  Generate
                </Button>

                <Box className="result-panel" aria-live="polite">
                  <Typography variant="overline" color="text.secondary">
                    Result
                  </Typography>
                  <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                    <Typography
                      className={result ? 'result-value' : 'result-placeholder'}
                      component="output"
                    >
                      {result || 'Your generated value will appear here'}
                    </Typography>
                    <Button
                      variant="outlined"
                      startIcon={<ContentCopyRoundedIcon />}
                      onClick={handleCopy}
                      disabled={!result}
                    >
                      Copy
                    </Button>
                  </Stack>
                </Box>
              </Stack>
            </CardContent>
          </Card>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textAlign: 'center' }}
          >
            All values are generated locally. Nothing leaves your browser.
          </Typography>
        </Stack>
      </Container>

      <Snackbar
        open={copyStatus !== null}
        autoHideDuration={2500}
        onClose={() => setCopyStatus(null)}
      >
        <Alert
          severity={copyStatus ?? 'success'}
          variant="filled"
          onClose={() => setCopyStatus(null)}
        >
          {copyStatus === 'success'
            ? 'Copied to clipboard'
            : 'Could not copy the value'}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default App
