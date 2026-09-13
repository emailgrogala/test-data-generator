import type { ReactNode } from 'react'
import { Box, Chip, Paper, Stack, Typography } from '@mui/material'
import './AboutProject.css'

interface AboutSectionProps {
  number: string
  title: string
  children: ReactNode
  featured?: boolean
}

const workflowSteps = [
  'Wymaganie',
  'PROJECT.md',
  'Agent 1 — implementacja',
  'Lint + testy + build',
  'Agent 2 — code review',
  'Poprawki, jeśli wymagane',
  'APPROVE',
  'Pull Request',
  'Merge do main',
  'GitHub Actions',
  'GitHub Pages',
]

function AboutSection({
  number,
  title,
  children,
  featured = false,
}: AboutSectionProps) {
  return (
    <Paper
      component="section"
      elevation={0}
      className={featured ? 'about-section about-section-featured' : 'about-section'}
    >
      <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
        <Chip label={number} size="small" color="primary" variant="outlined" />
        <Typography component="h2" variant="h5">
          {title}
        </Typography>
      </Stack>
      <Box className="about-section-content">{children}</Box>
    </Paper>
  )
}

export function AboutProject() {
  return (
    <Stack spacing={2.5} className="about-project">
      <AboutSection number="01" title="O projekcie" featured>
        <Typography>
          Test Data Generator to lekka aplikacja webowa do generowania danych
          testowych przydatnych w codziennej pracy developerskiej.
        </Typography>
        <Typography>
          Projekt jest również praktycznym eksperymentem pokazującym, jak można
          budować oprogramowanie z wykorzystaniem dwóch agentów AI o
          rozdzielonych rolach.
        </Typography>
      </AboutSection>

      <AboutSection number="02" title="Podejście do realizacji">
        <Typography>
          Projekt rozwijany jest iteracyjnie, w małych i kontrolowanych krokach.
          Każde zadanie ma jasno określony zakres, kryteria akceptacji oraz
          elementy pozostające poza bieżącym etapem.
        </Typography>
        <Typography>
          Wspólnym źródłem informacji dla implementera i reviewera są:
        </Typography>
        <Box component="ul" className="about-list">
          <li><strong>PROJECT.md</strong> — cel, zakres i wymagania jakościowe,</li>
          <li><strong>AGENTS.md</strong> — role i zasady pracy agentów,</li>
          <li><strong>README.md</strong> — podstawowe informacje o projekcie.</li>
        </Box>
      </AboutSection>

      <AboutSection number="03" title="Model pracy z dwoma agentami">
        <Box className="agent-grid">
          <Box className="agent-card">
            <Typography component="h3" variant="h6">
              Agent 1 — Implementer
            </Typography>
            <Typography>
              Analizuje repozytorium, implementuje funkcję, dodaje testy i
              uruchamia techniczną weryfikację projektu.
            </Typography>
          </Box>
          <Box className="agent-card">
            <Typography component="h3" variant="h6">
              Agent 2 — Reviewer
            </Typography>
            <Typography>
              Niezależnie analizuje zmiany, zgodność z wymaganiami, testami i
              architekturą. Klasyfikuje problemy jako BLOCKER, MAJOR, MINOR lub
              SUGGESTION i nie poprawia kodu bezpośrednio.
            </Typography>
          </Box>
        </Box>
        <Typography>
          Review Agenta 2 jest obecnie uruchamiane ręcznie. Istotne problemy
          kierują zmianę z powrotem do Agenta 1.
        </Typography>
        <Box component="ol" className="process-flow" aria-label="Przebieg pracy">
          {workflowSteps.map((step) => (
            <Box component="li" key={step}>
              {step}
            </Box>
          ))}
        </Box>
      </AboutSection>

      <AboutSection number="04" title="Kontrola zakresu">
        <Typography>
          Reviewer nie blokuje zmiany z powodu braku funkcji, która nie była
          częścią aktualnego zadania. Elementy spoza zakresu mogą zostać
          zgłoszone jako sugestie, ale nie jako błędy blokujące.
        </Typography>
        <Typography>
          Ta zasada ogranicza niekontrolowane rozszerzanie zadania podczas
          implementacji i code review.
        </Typography>
      </AboutSection>

      <AboutSection number="05" title="Architektura">
        <Typography>
          Aplikacja jest rozwiązaniem frontend-only. Nie wymaga backendu ani
          bazy danych, a wszystkie wartości powstają lokalnie w przeglądarce.
        </Typography>
        <Box component="ul" className="technology-list">
          {['React', 'Vite', 'TypeScript', 'Material UI', 'Vitest'].map((item) => (
            <Box component="li" key={item}>{item}</Box>
          ))}
        </Box>
        <Typography>
          Logika generatorów jest oddzielona od komponentów React, dzięki czemu
          algorytmy PESEL, NRB, IBAN i NIP można testować niezależnie od UI.
          Liczba rekordów, prezentacja wyników i kopiowanie danych korzystają ze
          wspólnych elementów wielokrotnego użytku.
        </Typography>
      </AboutSection>

      <AboutSection number="06" title="Rozwój iteracyjny">
        <Typography>
          Pierwsze MVP obejmowało PESEL, UUID v4 i losowy tekst. Kolejne małe
          iteracje rozszerzały aplikację o:
        </Typography>
        <Box component="ul" className="about-list">
          <li>układ oparty na zakładkach i accordionach,</li>
          <li>generowanie wielu rekordów,</li>
          <li>zakres dat i wybór płci dla PESEL,</li>
          <li>generatory NRB, IBAN i NIP,</li>
          <li>wspólny panel wyników,</li>
          <li>poprawki dostępności i optymalizację renderowania.</li>
        </Box>
        <Typography>
          Każdy większy etap realizowany jest na osobnym branchu i przechodzi
          niezależny review przed merge do <code>main</code>.
        </Typography>
      </AboutSection>

      <AboutSection number="07" title="Automatyczna weryfikacja">
        <Typography>
          Przed zaakceptowaniem zmian uruchamiane są cztery kontrole:
        </Typography>
        <Box component="ul" className="verification-list">
          {['lint', 'testy jednostkowe', 'build', 'git diff --check'].map((item) => (
            <Box component="li" key={item}><code>{item}</code></Box>
          ))}
        </Box>
        <Typography>
          Po merge do <code>main</code> GitHub Actions automatycznie wykonuje
          weryfikację, buduje aplikację i publikuje ją na GitHub Pages. Dzięki
          temu proces od implementacji do działającej wersji jest powtarzalny i
          kontrolowany.
        </Typography>
      </AboutSection>

      <AboutSection number="08" title="Najważniejszy wniosek" featured>
        <Typography>
          AI nie jest tu wyłącznie narzędziem do generowania fragmentów kodu.
          Agenci uczestniczą w analizie, implementacji, testowaniu i niezależnym
          code review.
        </Typography>
        <Typography>
          Największą wartość daje połączenie automatyzacji z jasnymi zasadami:
          wspólnym źródłem wymagań, małymi zadaniami, niezależnym review oraz
          kontrolą zmian przez Git i Pull Requesty. Człowiek definiuje kierunek
          i podejmuje decyzje, a agenci realizują i kontrolują kolejne etapy.
        </Typography>
      </AboutSection>
    </Stack>
  )
}
