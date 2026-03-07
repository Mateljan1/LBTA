# Compound Full — Fix All Review/Validate Items

## Overview
Address all critical and warning items from CODE_REVIEW_SUMMARY and VALIDATE_SUMMARY so the project reaches "Ready to merge / Ready to ship."

## Problem Statement
Review score 82/100 (Needs fixes), Validation 81/100. Data Integrity 58 (hardcoded pricing). Issues: PERS_ forbidden fonts, duplicate pricing data, no tests, API security/consistency, "elite" copy, images, README, dead routes.

## Implementation Steps

### Phase 1: Data single source of truth
- [ ] Add `lib/programs-data.ts`: load winter2026.json, export `getProgramsOverview()` with fromPrice derived per category, and `getWinter2026Programs()` for pricing page.
- [ ] Add `data/private-rates.json` for private lesson rates (or derive from existing data).
- [ ] Add `data/fitness.json` for fitness classes (from winter2026 fitness programs).
- [ ] Refactor `app/programs/page.tsx` to use `getProgramsOverview()` (no hardcoded fromPrice).
- [ ] Refactor `app/pricing/page.tsx` to use winter2026 + private-rates from data.
- [ ] Refactor `app/fitness/page.tsx` to use data/fitness.json.

### Phase 2: API hardening
- [ ] Newsletter: rate limit (form), Zod email validation, consistent response `{ success, message?, error? }`.
- [ ] Register-year: rate limit (form), Zod schema for body (minimal required fields), consistent response.
- [ ] Scholarship: NextRequest, rate limit, Zod schema, remove PII from console.log, consistent response.
- [ ] Register: NextRequest, rate limit, Zod (reuse/extend contactSchema), reduce PII in logs, consistent response.
- [ ] ActiveCampaign webhook: add verification note or verify signature if AC provides it.

### Phase 3: PERS_ layout fonts
- [ ] PERS_General_2025-12-16_layout.tsx: replace Playfair_Display + Work_Sans with Cormorant_Garamond + DM_Sans.
- [ ] PERS_General_2025-12-16_globals.css: update --font-playfair to Cormorant.
- [ ] PERS_General_2025-12-16_embedded-forms.css: replace Inter with DM Sans (or body font variable).

### Phase 4: Copy and UI tokens
- [ ] elite-pathway: replace "Elite" with "High Performance" in title, metadata, schema name/description.
- [ ] schedules/page.tsx: replace text-green-400 / text-green-600 with brand tokens (e.g. text-brand-* or lbta).

### Phase 5: Images
- [ ] Add `sizes` to hero/fill Images where missing; prefer WebP for junior-trial hero.

### Phase 6: README and dead routes
- [ ] Update README: routes, colors, tagline; note pricing/schedule redirect to /schedules.
- [ ] Document dead routes (pricing, schedule) as legacy redirects or remove if redundant.

### Phase 7: Tests
- [ ] Add unit tests for `lib/validations` (validateRequest, contactSchema, bookingSchema).
- [ ] Add unit tests for `lib/sanitize` (escapeHtml, sanitizeForEmail).
- [ ] Or add TESTING.md documenting accepted risk if tests deferred.

## Success Criteria
- Lint passes; build passes.
- No hardcoded prices in components; data from data/*.json or lib/programs-data.
- API routes use NextRequest, rate limit, Zod, no PII in logs, consistent JSON shape.
- PERS_ uses Cormorant + DM Sans; elite-pathway says "High Performance"; schedules use brand tokens.
- README and docs updated; tests added or risk documented.
