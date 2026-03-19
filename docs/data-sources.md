# Data sources

## pricing-supplemental.json

**File:** `data/pricing-supplemental.json`

**Role:** Single source for registration modal pricing and site copy used across the app.

- **Registration modal pricing** — `registrationModalPricing` is loaded by `lib/pricing-supplemental.ts` (Zod-validated) and consumed by `lib/form-config.ts`. Every program ID in form-config must have a key in `registrationModalPricing`, **except `utr-circuit`**: that string is built from `data/leagues-2026.json` → `utr.divisions[].price` via `lib/utr-circuit-modal-pricing.ts` so it matches the Leagues tab (enforced by `lib/form-config.test.ts`).
- **Site copy** — The `siteCopy` object (e.g. `stickyCtaSchedules`, `beginnerProgramCohort`, `campsHeading`) is exposed via `lib/site-copy.ts` getters. StickyCTA, beginner-program, and camps pages use these getters instead of importing the JSON directly.

The file also contains other keys (e.g. `beginnerProgram`, `matchPlay`, `leagues`, `schema`) used by specific pages. The `leagues` key in this file is **copy for league landing/marketing**; schedule/league **program data** comes from `data/leagues-2026.json` (see schedules page).

**Cohesion rule:** Values in `pricing-supplemental.json` (registration modal strings, comparison tiers, matchPlay, schema, promotions) must match the canonical program/camp/league data. When you change prices or dates in season or camp files, update this file so copy and modals stay in sync.

---

## Pricing & scheduling — canonical sources

| What | Source of truth | Used by |
|------|-----------------|--------|
| Winter program pricing & schedule | `data/winter2026.json` | Schedules page (Winter), ProgramRow, programs-data |
| Spring/Summer program pricing & schedule | `data/spring-summer-2026.json` | Schedules page (Spring/Summer), programs-data; court flyer Youth Development UTR tier copy via `programs[].utrPlacementBands` on `youth-development` |
| Fall program pricing & schedule | `data/fall2026.json` | Schedules page (Fall) |
| Camps (dates, prices, options) | `data/year2026.json` (camps) + `data/spring-summer-2026.json` (camps) | Schedules Camps tab, camps page, camps-data |
| Leagues (USTA/UTR) | `data/leagues-2026.json` | Schedules Leagues tab, league pages |
| Private coaching rates | `data/private-rates.json` | Schedules Private section, programs-data |
| Early bird & discounts | `data/year2026.json` (discounts) + per-season in `winter2026.json` etc. | Schedules, junior-trial (year2026.discounts.earlyBird for type + amount) |
| Registration modal display strings | `data/pricing-supplemental.json` (registrationModalPricing); **UTR Match Play Series** (`utr-circuit`) from `data/leagues-2026.json` → `utr.divisions` | form-config, modal prefill |

Do not hardcode prices in components or pages; derive from the data files above or from `pricing-supplemental` where it is the designated copy source.
