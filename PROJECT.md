# Test Data Generator

## Cel projektu

Lekka aplikacja webowa do generowania danych testowych używanych podczas developmentu.

Projekt służy również jako środowisko testowe do eksperymentów z pracą wielu agentów AI:
- Agent 1: implementacja
- Agent 2: niezależny code review

## Technologia

- React
- Vite
- TypeScript
- MUI
- Vitest
- aplikacja frontend-only
- brak backendu
- brak bazy danych

## MVP

Zakres pierwszej wersji obejmuje:

### Generatory
- PESEL
- UUID v4
- losowy tekst

### Generator tekstu
Obsługiwane tryby:
- litery
- cyfry
- alfanumeryczny

Długość:
- liczba całkowita
- minimum 1
- maksimum 1000 znaków

### UI
- wybór typu generatora
- konfiguracja parametrów
- przycisk Generate
- prezentacja wyniku
- przycisk Copy
- komunikat powodzenia lub błędu kopiowania

## Testy MVP

Wymagane:
- testy jednostkowe generatorów
- lint
- build

Nie są wymagane w MVP:
- testy komponentowe
- testy E2E

## Poza zakresem MVP

Nie implementować bez osobnej decyzji:
- NIP
- REGON
- NRB / IBAN
- email
- telefon
- JSON generator
- backend
- baza danych
- logowanie
- konta użytkowników
- GitHub Pages
- deployment
- testy komponentowe
- testy E2E

## Architektura

Logika generatorów powinna być niezależna od UI.

Przykład:

src/
generators/
pesel.ts
uuid.ts
text.ts

Komponenty React nie powinny zawierać logiki generowania danych, jeśli można ją wydzielić do modułów.

## Zasady jakości

Kod powinien:
- używać TypeScript bez zbędnego `any`
- mieć czytelne nazwy
- mieć małe, spójne moduły
- poprawnie obsługiwać błędne dane wejściowe
- nie dodawać zależności bez uzasadnienia
- przechodzić lint, testy i build

## Roadmapa

Planowane kolejne etapy:
1. GitHub Pages
2. testy komponentowe
3. NRB / IBAN
4. NIP
5. REGON
6. email i telefon
7. generowanie wielu rekordów
8. eksport danych