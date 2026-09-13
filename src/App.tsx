import { useState } from 'react'
import type { SyntheticEvent } from 'react'
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded'
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
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
  Radio,
  RadioGroup,
  Snackbar,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material'
import { RecordCountField } from './components/RecordCountField'
import { ResultsPanel } from './components/ResultsPanel'
import {
  generatePesel,
  getPeselOptionsError,
  MAX_PESEL_DATE,
  MIN_PESEL_DATE,
} from './generators/pesel'
import type { PeselGender, PeselOptions } from './generators/pesel'
import {
  generateRandomText,
  MAX_RANDOM_TEXT_LENGTH,
} from './generators/randomText'
import type { CharacterSet } from './generators/randomText'
import {
  generateRecords,
  isValidRecordCount,
} from './generators/records'
import { generateUuid } from './generators/uuid'
import './App.css'

type Category = 'personal' | 'finance' | 'text' | 'technical'
type GeneratorPanel = 'pesel' | 'text' | 'uuid'

const defaultPanelByCategory: Record<Category, GeneratorPanel | false> = {
  personal: 'pesel',
  finance: false,
  text: 'text',
  technical: 'uuid',
}

function parseRecordCount(value: string): number | null {
  if (value.trim() === '') return null

  const count = Number(value)
  return isValidRecordCount(count) ? count : null
}

function App() {
  const [category, setCategory] = useState<Category>('personal')
  const [expandedPanel, setExpandedPanel] =
    useState<GeneratorPanel | false>('pesel')
  const [peselCount, setPeselCount] = useState('1')
  const [uuidCount, setUuidCount] = useState('1')
  const [textCount, setTextCount] = useState('1')
  const [dateFrom, setDateFrom] = useState('1990-01-01')
  const [dateTo, setDateTo] = useState('2009-12-31')
  const [gender, setGender] = useState<PeselGender>('any')
  const [textLength, setTextLength] = useState('24')
  const [characterSet, setCharacterSet] =
    useState<CharacterSet>('alphanumeric')
  const [results, setResults] = useState<string[]>([])
  const [copyStatus, setCopyStatus] = useState<'success' | 'error' | null>(null)

  const parsedPeselCount = parseRecordCount(peselCount)
  const parsedUuidCount = parseRecordCount(uuidCount)
  const parsedTextCount = parseRecordCount(textCount)
  const parsedTextLength = Number(textLength)
  const isTextLengthValid =
    textLength.trim() !== '' &&
    Number.isInteger(parsedTextLength) &&
    parsedTextLength >= 1 &&
    parsedTextLength <= MAX_RANDOM_TEXT_LENGTH
  const peselOptions: PeselOptions = { dateFrom, dateTo, gender }
  const peselOptionsError = getPeselOptionsError(peselOptions)

  const handleCategoryChange = (_event: SyntheticEvent, value: Category) => {
    setCategory(value)
    setExpandedPanel(defaultPanelByCategory[value])
  }

  const togglePanel = (panel: GeneratorPanel) =>
    (_event: SyntheticEvent, expanded: boolean) => {
      setExpandedPanel(expanded ? panel : false)
    }

  const handleGenerate = (
    count: number | null,
    generateValue: () => string,
  ) => {
    if (count !== null) {
      setResults(generateRecords(count, generateValue))
    }
  }

  const handleCopy = async (values: string[]) => {
    try {
      await navigator.clipboard.writeText(values.join('\n'))
      setCopyStatus('success')
    } catch {
      setCopyStatus('error')
    }
  }

  return (
    <Box component="main" className="app-shell">
      <Container maxWidth="md">
        <Stack spacing={4}>
          <Box className="page-heading">
            <Chip label="Developer toolkit" color="primary" size="small" />
            <Typography component="h1" variant="h3" sx={{ fontWeight: 800 }}>
              Generator danych testowych
            </Typography>
            <Typography color="text.secondary" sx={{ fontSize: '1.05rem' }}>
              Generuj przykładowe dane lokalnie w przeglądarce.
            </Typography>
          </Box>

          <Card elevation={0} className="generator-card">
            <Tabs
              value={category}
              onChange={handleCategoryChange}
              variant="scrollable"
              scrollButtons="auto"
              aria-label="Kategorie generatorów"
            >
              <Tab value="personal" label="Dane osobowe" />
              <Tab value="finance" label="Finanse" />
              <Tab value="text" label="Tekst" />
              <Tab value="technical" label="Techniczne" />
            </Tabs>

            <CardContent className="generator-content">
              <Box role="tabpanel" hidden={category !== 'personal'}>
                {category === 'personal' && (
                  <Accordion
                    expanded={expandedPanel === 'pesel'}
                    onChange={togglePanel('pesel')}
                    disableGutters
                    elevation={0}
                  >
                    <AccordionSummary expandIcon={<ExpandMoreRoundedIcon />}>
                      <Box>
                        <Typography variant="h6">PESEL</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Zakres dat urodzenia i płeć
                        </Typography>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Stack spacing={3}>
                        <RecordCountField
                          value={peselCount}
                          onChange={setPeselCount}
                          valid={parsedPeselCount !== null}
                        />
                        <Box className="date-fields">
                          <TextField
                            label="Data od"
                            type="date"
                            value={dateFrom}
                            onChange={(event) => setDateFrom(event.target.value)}
                            error={peselOptionsError !== null}
                            slotProps={{
                              htmlInput: {
                                min: MIN_PESEL_DATE,
                                max: MAX_PESEL_DATE,
                              },
                              inputLabel: { shrink: true },
                            }}
                            fullWidth
                          />
                          <TextField
                            label="Data do"
                            type="date"
                            value={dateTo}
                            onChange={(event) => setDateTo(event.target.value)}
                            error={peselOptionsError !== null}
                            slotProps={{
                              htmlInput: {
                                min: MIN_PESEL_DATE,
                                max: MAX_PESEL_DATE,
                              },
                              inputLabel: { shrink: true },
                            }}
                            fullWidth
                          />
                        </Box>
                        {peselOptionsError && (
                          <Alert severity="error">{peselOptionsError}</Alert>
                        )}
                        <FormControl>
                          <FormLabel id="pesel-gender-label">Płeć</FormLabel>
                          <RadioGroup
                            row
                            aria-labelledby="pesel-gender-label"
                            value={gender}
                            onChange={(event) =>
                              setGender(event.target.value as PeselGender)
                            }
                          >
                            <FormControlLabel
                              value="any"
                              control={<Radio />}
                              label="Dowolna"
                            />
                            <FormControlLabel
                              value="female"
                              control={<Radio />}
                              label="Kobieta"
                            />
                            <FormControlLabel
                              value="male"
                              control={<Radio />}
                              label="Mężczyzna"
                            />
                          </RadioGroup>
                        </FormControl>
                        <Button
                          variant="contained"
                          size="large"
                          startIcon={<AutoAwesomeRoundedIcon />}
                          disabled={
                            parsedPeselCount === null ||
                            peselOptionsError !== null
                          }
                          onClick={() =>
                            handleGenerate(parsedPeselCount, () =>
                              generatePesel(peselOptions),
                            )
                          }
                        >
                          Generuj
                        </Button>
                      </Stack>
                    </AccordionDetails>
                  </Accordion>
                )}
              </Box>

              <Box role="tabpanel" hidden={category !== 'finance'}>
                {category === 'finance' && (
                  <Alert severity="info">
                    Generatory finansowe zostaną dodane w kolejnych etapach.
                  </Alert>
                )}
              </Box>

              <Box role="tabpanel" hidden={category !== 'text'}>
                {category === 'text' && (
                  <Accordion
                    expanded={expandedPanel === 'text'}
                    onChange={togglePanel('text')}
                    disableGutters
                    elevation={0}
                  >
                    <AccordionSummary expandIcon={<ExpandMoreRoundedIcon />}>
                      <Box>
                        <Typography variant="h6">Tekst losowy</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Litery, cyfry lub znaki alfanumeryczne
                        </Typography>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Stack spacing={3}>
                        <RecordCountField
                          value={textCount}
                          onChange={setTextCount}
                          valid={parsedTextCount !== null}
                        />
                        <TextField
                          label="Długość"
                          type="number"
                          value={textLength}
                          onChange={(event) => setTextLength(event.target.value)}
                          error={!isTextLengthValid}
                          helperText={
                            isTextLengthValid
                              ? `Od 1 do ${MAX_RANDOM_TEXT_LENGTH} znaków`
                              : `Podaj liczbę całkowitą od 1 do ${MAX_RANDOM_TEXT_LENGTH}`
                          }
                          slotProps={{
                            htmlInput: {
                              min: 1,
                              max: MAX_RANDOM_TEXT_LENGTH,
                              step: 1,
                            },
                          }}
                          fullWidth
                        />
                        <FormControl>
                          <FormLabel id="character-set-label">Znaki</FormLabel>
                          <RadioGroup
                            row
                            aria-labelledby="character-set-label"
                            value={characterSet}
                            onChange={(event) =>
                              setCharacterSet(
                                event.target.value as CharacterSet,
                              )
                            }
                          >
                            <FormControlLabel
                              value="letters"
                              control={<Radio />}
                              label="Tylko litery"
                            />
                            <FormControlLabel
                              value="numbers"
                              control={<Radio />}
                              label="Tylko cyfry"
                            />
                            <FormControlLabel
                              value="alphanumeric"
                              control={<Radio />}
                              label="Alfanumeryczne"
                            />
                          </RadioGroup>
                        </FormControl>
                        <Button
                          variant="contained"
                          size="large"
                          startIcon={<AutoAwesomeRoundedIcon />}
                          disabled={
                            parsedTextCount === null || !isTextLengthValid
                          }
                          onClick={() =>
                            handleGenerate(parsedTextCount, () =>
                              generateRandomText(
                                parsedTextLength,
                                characterSet,
                              ),
                            )
                          }
                        >
                          Generuj
                        </Button>
                      </Stack>
                    </AccordionDetails>
                  </Accordion>
                )}
              </Box>

              <Box role="tabpanel" hidden={category !== 'technical'}>
                {category === 'technical' && (
                  <Accordion
                    expanded={expandedPanel === 'uuid'}
                    onChange={togglePanel('uuid')}
                    disableGutters
                    elevation={0}
                  >
                    <AccordionSummary expandIcon={<ExpandMoreRoundedIcon />}>
                      <Box>
                        <Typography variant="h6">UUID v4</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Unikalne identyfikatory techniczne
                        </Typography>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Stack spacing={3}>
                        <RecordCountField
                          value={uuidCount}
                          onChange={setUuidCount}
                          valid={parsedUuidCount !== null}
                        />
                        <Button
                          variant="contained"
                          size="large"
                          startIcon={<AutoAwesomeRoundedIcon />}
                          disabled={parsedUuidCount === null}
                          onClick={() =>
                            handleGenerate(parsedUuidCount, generateUuid)
                          }
                        >
                          Generuj
                        </Button>
                      </Stack>
                    </AccordionDetails>
                  </Accordion>
                )}
              </Box>
            </CardContent>
          </Card>

          <ResultsPanel values={results} onCopy={handleCopy} />

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textAlign: 'center' }}
          >
            Wszystkie wartości powstają lokalnie. Nic nie opuszcza przeglądarki.
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
            ? 'Skopiowano do schowka'
            : 'Nie udało się skopiować wartości'}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default App
