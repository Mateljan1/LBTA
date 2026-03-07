# Compound Engineering Plan: Fixes 1–9 (Review + Validation Backlog)

## Overview

Address all nine items from the CODE_REVIEW_SUMMARY and VALIDATE_SUMMARY so the codebase reaches "Ready to merge" and .cursorrules compliance: PERS_ fonts, data single source of truth, minimal tests, build script, API hardening, copy/UI tokens, dead routes, README, and compound learn.

## Problem Statement

- Review score 82/100 with **Needs fixes**: PERS_ forbidden fonts, duplicate/hardcoded data, no tests.
- Validation 81/100 with warnings: data integrity, build path, API consistency, UI tokens.
- Goal: clear critical issues and key warnings so the project is production-ready and compound-ready.

## Proposed Solution

Execute in six phases. Phases 1–3 address criticals; 4–5 address warnings; Phase 6 is documentation and compound learn. Data layer already uses `lib/programs-data` and `data/winter2026.json` for pricing/schedules; we will remove remaining hardcodes, align PERS_ with brand fonts, add tests and script/API/UI fixes, then document and capture learnings.

---

## Implementation Steps

### Phase 1: PERS_ layout fonts (Item 1)

- [ ] **1.1** In `app/PERS_General_2025-12-16_layout.tsx`: replace `Playfair_Display` and `Work_Sans` with `Cormorant_Garamond` and `DM_Sans` from `next/font/google`; rename variables to `--font-cormorant` and `--font-dm-sans`.
- [ ] **1.2** In `app/PERS_General_2025-12-16_globals.css`: replace `--font-playfair` / `--font-work-sans` references with Cormorant/DM Sans variables (or retain same variable names but ensure they resolve to Cormorant/DM Sans).
- [ ] **1.3** In `app/PERS_General_2025-12-16_embedded-forms.css`: replace `Inter` with DM Sans (or body font variable). Remove any remaining Inter references.
- [ ] **1.4** Optional cleanup: remove VYLO orphan keyframes in PERS_ globals (drawBorder, pulseGlow) per Simplicity Review.

**Files:** `app/PERS_General_2025-12-16_layout.tsx`, `app/PERS_General_2025-12-16_globals.css`, `app/PERS_General_2025-12-16_embedded-forms.css`

---

### Phase 2: Data single source of truth (Item 2)

- [ ] **2.1** In `lib/programs-data.ts`: replace hardcoded fallbacks in `getProgramsOverview()` (e.g. `120` for Camps, `25` for Leagues) with values derived from data where possible — e.g. import `camps` or league data from `data/` or document why fallbacks remain.
- [ ] **2.2** Confirm `app/pricing/page.tsx` and `app/fitness/page.tsx` use only `lib/programs-data` (already do). Audit `app/pricing/PricingContent.tsx` for any hardcoded prices; remove or source from data.
- [ ] **2.3** Ensure `app/programs/page.tsx` uses only `getProgramsOverview()` (already does). No change if no other hardcodes.

**Files:** `lib/programs-data.ts`, `app/pricing/PricingContent.tsx` (audit only)

---

### Phase 3: Minimal tests (Item 3)

- [ ] **3.1** Add test framework: `npm install -D vitest @vitejs/plugin-react jsdom` (or Jest if preferred); add `test` script in `package.json` (e.g. `"test": "vitest run"`).
- [ ] **3.2** Create `lib/validations.test.ts`: unit tests for exported schemas/functions in `lib/validations.ts` (e.g. newsletter, register-year, scholarship, register parsing and validation).
- [ ] **3.3** Create `lib/sanitize.test.ts`: unit tests for `lib/sanitize.ts` (safe HTML output, XSS prevention).
- [ ] **3.4** Optional: one E2E (Playwright) for critical path — e.g. `/book` trial or `/schedules` load. Defer if time-boxed.

**Files:** `package.json`, `vitest.config.ts` (or jest.config), `lib/validations.test.ts`, `lib/sanitize.test.ts`; optionally `e2e/book.spec.ts`

---

### Phase 4: Build script + API hardening (Items 4 + 5)

- [ ] **4.1** In `package.json`, set `"build": "npx next build"` (or `./node_modules/.bin/next build`) so CI does not depend on global `next` in PATH.
- [ ] **4.2** Newsletter API: ensure rate limiting is present (Phase 2 hardening may have added it); if not, add simple in-memory or Vercel KV rate limit.
- [ ] **4.3** In `app/api/register-year/route.ts` and `app/api/scholarship/route.ts`: use `NextRequest` instead of `Request`; ensure no PII in logs; align JSON response shape with other routes (e.g. `{ success, message, error? }`).
- [ ] **4.4** ActiveCampaign webhook: verify signature check is implemented; document in code or README.

**Files:** `package.json`, `app/api/newsletter/route.ts`, `app/api/register-year/route.ts`, `app/api/scholarship/route.ts`, `app/api/activecampaign-webhook/route.ts`

---

### Phase 5: Copy + UI tokens and dead routes (Items 6 + 7)

- [ ] **5.1** In `app/elite-pathway/page.tsx`: replace "Elite" with "High Performance Pathway" in title, metadata, schema (`eliteSchema` → e.g. `highPerformanceSchema`), and visible copy (e.g. "The Elite Pathway" → "The High Performance Pathway").
- [ ] **5.2** In `app/schedules/page.tsx`: replace raw `green-*` Tailwind classes (e.g. `bg-green-100`, `text-green-700`, `text-green-400`, `bg-green-500`) with LBTA design tokens (e.g. a success/accent token from tailwind config or new token).
- [ ] **5.3** In `app/thank-you/page.tsx` and `app/book/page.tsx`: replace `text-green-*` / `bg-green-*` with same brand tokens for consistency.
- [ ] **5.4** Hero images: ensure all hero/priority images have `sizes` and prefer WebP. Audit `app/junior-trial/page.tsx` and other hero sections; add `sizes` where missing.
- [ ] **5.5** Dead routes: Document or redirect. If `/schedule` and `/pricing` are intentional (schedule = calendar view, pricing = pricing page), add one-line comments in each `page.tsx` and a short note in README (e.g. "`/schedule` = 2026 calendar; `/schedules` = programs + pricing"). If product decision is to redirect one to the other, add redirect in `next.config.js`.

**Files:** `app/elite-pathway/page.tsx`, `app/schedules/page.tsx`, `app/thank-you/page.tsx`, `app/book/page.tsx`, `app/junior-trial/page.tsx` (and any other heroes), `app/schedule/page.tsx`, `app/pricing/page.tsx`, `next.config.js`, `tailwind.config.*` (if adding token), README

---

### Phase 6: README + Compound learn (Items 8 + 9)

- [ ] **6.1** Update `README.md`: routes list to match current app (e.g. `/schedules`, `/programs`, `/book`, `/camps`, `/fitness`; remove VYLO if gone); colors/typography to match .cursorrules (Playfair Display + Work Sans or current brand tokens); tagline to "Movement. Discipline. Belonging." or current.
- [ ] **6.2** Run compound learn: extract from CODE_REVIEW_SUMMARY and VALIDATE_SUMMARY — corrections (e.g. "PERS_ used Playfair/Work Sans → use Cormorant + DM Sans"), patterns (e.g. "price from data only via lib/programs-data"), standards (e.g. "no raw green-*, use brand tokens"). Append to `plans/COMPOUND_LEARN.md` or project memory files per compound skill.

**Files:** `README.md`, `plans/COMPOUND_LEARN.md` (or memory files)

---

## Files to Create/Modify

| File | Action | Purpose |
|------|--------|---------|
| `app/PERS_General_2025-12-16_layout.tsx` | Modify | Cormorant + DM Sans |
| `app/PERS_General_2025-12-16_globals.css` | Modify | Font variables, optional keyframe cleanup |
| `app/PERS_General_2025-12-16_embedded-forms.css` | Modify | Inter → DM Sans |
| `lib/programs-data.ts` | Modify | Remove/minimize hardcoded fallbacks |
| `app/pricing/PricingContent.tsx` | Audit | No hardcoded prices |
| `package.json` | Modify | test script, build script |
| `vitest.config.ts` or `jest.config.js` | Create | Test config |
| `lib/validations.test.ts` | Create | Unit tests validations |
| `lib/sanitize.test.ts` | Create | Unit tests sanitize |
| `app/api/newsletter/route.ts` | Modify | Rate limit if missing |
| `app/api/register-year/route.ts` | Modify | NextRequest, no PII, response shape |
| `app/api/scholarship/route.ts` | Modify | NextRequest, no PII, response shape |
| `app/elite-pathway/page.tsx` | Modify | Elite → High Performance Pathway |
| `app/schedules/page.tsx` | Modify | green-* → brand tokens |
| `app/thank-you/page.tsx` | Modify | green-* → brand tokens |
| `app/book/page.tsx` | Modify | green-* → brand tokens |
| `app/junior-trial/page.tsx` | Audit | Hero sizes/WebP |
| `app/schedule/page.tsx` | Comment / redirect | Document or redirect |
| `app/pricing/page.tsx` | Comment | Document role |
| `next.config.js` | Modify | Redirects if needed |
| `tailwind.config.*` | Modify | Success token if new |
| `README.md` | Modify | Routes, colors, tagline |
| `plans/COMPOUND_LEARN.md` | Modify | Learnings from review/validation |

---

## Success Criteria

- [ ] PERS_ layout uses only Cormorant + DM Sans (no Playfair, Work Sans, Inter).
- [ ] All pricing/program numbers come from `data/` or documented fallbacks in `lib/programs-data`.
- [ ] `npm run test` runs and passes unit tests for `lib/validations` and `lib/sanitize`.
- [ ] `npm run build` uses `npx next build` (or explicit path); build succeeds.
- [ ] Register-year and scholarship use NextRequest; no PII in logs; response shape consistent; newsletter rate-limited; webhook signature noted.
- [ ] "Elite" replaced with "High Performance Pathway"; schedules (and thank-you/book) use brand tokens instead of raw green-*; hero images have sizes/WebP.
- [ ] Schedule/pricing routes documented or redirected; README up to date; compound learnings captured.

---

## Research Sources

- CODE_REVIEW_SUMMARY.md (critical issues, warnings, decision)
- VALIDATE_SUMMARY.md (blockers, warnings, recommendation)
- .cursorrules (Part 7–8: colors, typography; Part 10: buttons/cards; Part 12: data rules; Part 14: forbidden patterns)
- Existing `lib/programs-data.ts` and `data/winter2026.json` (single source pattern)

---

## Relevant Learnings

- Pricing and programs pages already consume `lib/programs-data`; main gap is fallbacks in `getProgramsOverview()` and any stray hardcodes in PricingContent.
- `/schedule` uses `schedule-2026.json` (calendar/camps); `/schedules` uses `winter2026.json` (programs + pricing). Both are valid; document, don’t remove, unless product says otherwise.
- Schedules page has many raw `green-*` classes; define one success/accent token and replace for consistency.

---

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| PERS_ layout breakage | Change only font imports and CSS variables; keep layout structure. Manually smoke-test PERS_ route if in use. |
| Tests add CI time | Keep unit tests fast; E2E optional. |
| Token name conflicts | Use existing tailwind theme if success color exists; else add `lbta-success` or similar and use everywhere. |
| Redirects change URLs | Only add redirects if product confirms; otherwise document only. |

---

## Execution Order

1. **Phase 1** (PERS_ fonts) — unblocks review “forbidden fonts”.
2. **Phase 2** (data) — unblocks “duplicate data” critical.
3. **Phase 3** (tests) — unblocks “no tests” critical.
4. **Phase 4** (build + API) — quick wins, reduces validation warnings.
5. **Phase 5** (copy + UI + routes) — improves consistency and .cursorrules compliance.
6. **Phase 6** (README + compound learn) — closes loop and updates docs.

After completion, re-run `/compound:review` and `/compound:validate`; update CODE_REVIEW_SUMMARY and VALIDATE_SUMMARY decision to **Ready to merge** / **Ready to ship** when criteria are met.
