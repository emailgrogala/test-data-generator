# Agent Instructions

## Źródło prawdy

Przed rozpoczęciem pracy agent musi przeczytać:
1. PROJECT.md
2. README.md
3. aktualne zadanie

PROJECT.md definiuje:
- cel projektu
- aktualny zakres
- elementy poza zakresem
- wymagania jakościowe

## Agent 1 — Implementer

Agent implementujący:
- realizuje tylko zakres aktualnego zadania
- nie rozszerza scope bez wyraźnej decyzji
- zachowuje istniejącą architekturę
- dodaje testy wymagane przez zadanie
- uruchamia lint, testy i build
- raportuje wykonane zmiany
- nie wykonuje merge do main

Jeśli zauważy potencjalnie wartościowe rozszerzenie:
- nie implementuje go automatycznie
- oznacza je jako sugestię

## Agent 2 — Reviewer

Reviewer:
- wykonuje niezależne review
- nie modyfikuje kodu
- sprawdza zgodność z PROJECT.md i aktualnym zadaniem
- nie traktuje funkcji spoza scope jako błędu

Reviewer nie może zgłosić BLOCKER lub MAJOR tylko dlatego, że brakuje funkcji oznaczonej jako:
- poza zakresem
- roadmapa
- sugestia

## Kategorie review

### BLOCKER
Problem uniemożliwiający poprawne działanie lub powodujący poważny błąd.

### MAJOR
Istotna wada implementacji w zakresie aktualnego zadania.

### MINOR
Problem jakościowy, który nie blokuje funkcjonalności.

### SUGGESTION
Pomysł na ulepszenie lub rozszerzenie poza wymagany zakres.

## Zasada Scope Control

Brak elementu spoza aktualnego zakresu nie może skutkować:
CHANGES REQUESTED

Może być zgłoszony wyłącznie jako:
SUGGESTION

## Decyzja końcowa

Reviewer wydaje:
- APPROVE
- CHANGES REQUESTED

CHANGES REQUESTED jest dopuszczalne tylko wtedy, gdy istnieje co najmniej jeden BLOCKER lub MAJOR dotyczący aktualnego zakresu.