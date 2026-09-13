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

## MVP — zakończone

Zakres pierwszej wersji obejmował:

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

Wymagane były:

- testy jednostkowe generatorów
- lint
- build

Nie były wymagane w MVP:

- testy komponentowe
- testy E2E

## Poza zakresem MVP

MVP zostało zakończone.

Elementy, które nie były częścią MVP, mogą być realizowane w kolejnych etapach wyłącznie wtedy, gdy zostaną jawnie dodane do aktualnego zakresu.

## Aktualny etap rozwoju

Celem obecnego etapu jest poprawa ergonomii UI oraz rozszerzenie istniejących generatorów o parametry i generowanie wielu rekordów.

### Nawigacja i układ UI

Docelowy układ:

- główne kategorie jako zakładki:
    - Dane osobowe
    - Finanse
    - Tekst
    - Techniczne

- wewnątrz każdej kategorii generatory prezentowane jako rozwijane panele / accordiony

- pierwszy domyślnie otwarty generator:
    - PESEL

Nie używać pojedynczej listy wyboru generatora jako głównego mechanizmu nawigacji.

### Wspólne zachowanie generatorów

W bieżącym etapie każdy istniejący generator powinien obsługiwać:

- liczbę generowanych rekordów
- wartość domyślną: 1
- minimalnie: 1
- maksymalnie: 1000

Wyniki powinny być prezentowane we wspólnym panelu.

Panel wyników powinien umożliwiać:

- kopiowanie pojedynczej wartości
- kopiowanie wszystkich wartości
- wyświetlenie liczby wygenerowanych rekordów

Eksport do CSV pozostaje osobnym etapem.

### PESEL

Generator PESEL powinien obsługiwać:

- liczbę rekordów
- zakres dat urodzenia:
    - data od
    - data do
- płeć:
    - dowolna
    - kobieta
    - mężczyzna

Zakres dat:

- data od nie może być późniejsza niż data do
- obie daty muszą mieścić się w zakresie obsługiwanym przez format PESEL
- generator musi poprawnie kodować stulecie zgodnie ze specyfikacją PESEL

Płeć:

- kobieta: odpowiednia cyfra PESEL musi być parzysta
- mężczyzna: odpowiednia cyfra PESEL musi być nieparzysta

Generowane numery muszą:

- mieć poprawną datę zakodowaną zgodnie z PESEL
- mieć poprawnie zakodowaną płeć
- mieć poprawną cyfrę kontrolną
- być poprawnymi numerami PESEL

Domyślnie:

- generator PESEL powinien być pierwszym widocznym generatorem

### UUID

Generator UUID powinien obsługiwać:

- liczbę rekordów
- generowanie poprawnych UUID v4

### Generator tekstu

Generator tekstu powinien obsługiwać:

- liczbę rekordów
- długość tekstu
- tryb:
    - litery
    - cyfry
    - alfanumeryczny

Długość:

- minimum 1
- maksimum 1000

Rozszerzenia takie jak:

- wielkie / małe litery
- znaki specjalne

pozostają opcjonalne i nie są wymagane w bieżącym etapie.

## Architektura

Logika generatorów powinna być niezależna od UI.

Przykład:

```text
src/
  generators/
    pesel.ts
    uuid.ts
    text.ts