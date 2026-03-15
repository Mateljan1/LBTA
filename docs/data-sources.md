# Data sources

## pricing-supplemental.json

**File:** `data/pricing-supplemental.json`

**Role:** Single source for registration modal pricing and site copy used across the app.

- **Registration modal pricing** — `registrationModalPricing` is loaded by `lib/pricing-supplemental.ts` (Zod-validated) and consumed by `lib/form-config.ts`. Every program ID in form-config must have a key in `registrationModalPricing` (enforced by `lib/form-config.test.ts`).
- **Site copy** — The `siteCopy` object (e.g. `stickyCtaSchedules`, `beginnerProgramCohort`, `campsHeading`) is exposed via `lib/site-copy.ts` getters. StickyCTA, beginner-program, and camps pages use these getters instead of importing the JSON directly.

The file also contains other keys (e.g. `beginnerProgram`, `matchPlay`, `leagues`, `schema`) used by specific pages. The `leagues` key in this file is **copy for league landing/marketing**; schedule/league **program data** comes from `data/leagues-2026.json` (see schedules page).
