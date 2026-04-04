# 2026-04-02 — UTR Tracker Engagement UX Compound Learn

## Scope
- Leaderboard engagement pass on `/utr-tracker`: movement system, week-over-week delta, momentum modules, GF pace chips, around-you context.
- Color Ball passport engagement messaging.
- Accessibility and QA hardening for tooltip + row detail interactions.
- Test-strengthening for deterministic delta fixtures.

## What shipped
- Added rank movement computation (`up`/`down`/`same`/`new`) in `lib/utr-tracker-points.ts` and surfaced in UI.
- Added weekly delta helper and UI display with clear positive/negative/neutral chips.
- Added engagement helpers: `getAroundYouContext`, `getGrandFinalsRaceStatus`, `getMomentumSummary`.
- Added leaderboard modules: biggest climb, biggest weekly gain, expanded-row rival context.
- Added GF status chips: `Qualified`, `N wks needed`, `N wk behind pace`.
- Added stage-aware Color Ball milestone guidance.
- Added accessible custom tooltip behavior (focus/hover/click/Escape), ARIA control wiring, and SR table caption.
- Added deterministic tests for weekly delta positive/negative/zero cases (exact values).

## Corrections
- Weak assertion (`<= 0`) for weekly delta test can hide logic bugs.
  - Do this instead: use deterministic fixtures and exact numeric assertions for positive, negative, and zero outcomes.
- Native `title` tooltip is insufficient for keyboard-first UX polish.
  - Do this instead: custom tooltip with focus-visible support, Escape close behavior, and ARIA attributes.

## Patterns
- **leaderboard-movement-delta-pairing**: show both rank movement and weekly points delta; movement provides social context while delta gives personal momentum.
- **around-you-context-window**: for each player, show immediate above/current/below with exact point gaps to create proximal goals.
- **deterministic-scoring-fixtures**: when scoring includes multiple factors (match points + attendance + streak + gap logic), test exact fixture outcomes instead of directional checks.
- **gf-pace-chip-communication**: convert eligibility math into compact chips (`Qualified`, `N wks needed`, `N wk behind pace`) for scanability.

## Anti-patterns
- **non-deterministic-helper-tests**: assertions like `> 0` / `< 0` on scoring helpers that should be exact and regression-safe.
- **hover-only-help-affordance**: help icon interactions that do not fully support focus and keyboard dismissal.

## Quality bars reinforced
- New leaderboard helpers must have deterministic unit tests for edge and direction cases.
- Interactive help affordances must be keyboard operable and dismissible.
- Expanded table rows need ARIA control associations (`aria-expanded`, `aria-controls`) and readable mobile wrapping.

## Validation evidence
- `npm run lint` passed.
- `npm test -- lib/utr-tracker-points.test.ts` passed (`20/20`).
