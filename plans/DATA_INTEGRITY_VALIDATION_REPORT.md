# LBTA Data Integrity Validation Report

**Date:** 2026-03-12  
**Scope:** Program/pricing single source, camp 3-day prices, overview fallbacks, schedules as source.

---

## Summary

| Status    | Score | Blockers |
|-----------|-------|----------|
| **WARNINGS** | 78/100 | 0 |

No blockers. All program/pricing data is sourced from `/data/*.json`. Schedules page is the single source for programs/pricing; program pages link or redirect to `/schedules`. Two minor issues: fallback literals in `lib/camps-data.ts` and `lib/programs-data.ts` (data files contain values so literals are unused at runtime), and one hardcoded threshold in `app/junior-trial/page.tsx`.

---

## 1. Program/pricing only in `/data/*.json`; no hardcoded prices in components

**Result: PASS**

- **Components:** No hardcoded price numbers in `components/`. `ProgramOverviewCard` uses `program.fromPrice` from data. `LeaguesSection` uses `league.pricing12` from leagues data.
- **App pages:** All pricing comes from data or lib that reads data:
  - `app/fitness/page.tsx`: `session.price` from `getFitnessClasses()` (winter2026).
  - `app/camps/page.tsx`: `camp.price`, `week.price` from `getCampsFromYear2026()` (year2026.json).
  - `app/racquet-rescue/page.tsx`, `app/match-play/page.tsx`, `app/beginner-program/page.tsx`, `app/programs/leagues/page.tsx`, `app/programs/usta-adult-league/page.tsx`: import `pricing-supplemental.json` or equivalent.
  - `app/schema.tsx`: uses `pricingSupplemental.schema` from JSON.
- **Data files:** `winter2026.json`, `spring-summer-2026.json`, `year2026.json`, `pricing-supplemental.json`, `private-rates.json`, `leagues-2026.json` hold all program/camp/league/supplemental pricing.

---

## 2. Camp 3-day prices: year2026.json + lib/camps-data.ts

**Result: WARNINGS (no blockers)**

- **data/year2026.json:** Contains `threeDayFullPrice` and `threeDayHalfPrice` where required:
  - **summer:** `threeDayFullPrice: 435`, `threeDayHalfPrice: 255`.
  - **swim-tennis:** `threeDayFullPrice: 375`.
- **lib/camps-data.ts:** Reads from camp object:
  - `buildSummerWeeks()` uses `camp.threeDayFullPrice ?? 435` and `camp.threeDayHalfPrice ?? 255`.
  - `buildSwimTennisWeeks()` uses `camp.threeDayFullPrice ?? 375`.
- **Issue:** Literals `435`, `255`, and `375` remain in code as fallbacks. With current data they are never used. For strict single-source compliance, remove these literals and either require the fields in JSON for summer/swim-tennis or use a single fallback (e.g. from `pricing-supplemental.json` or `undefined` and handle in UI).

**Recommendation:** Prefer no numeric fallbacks in code; if a fallback is required, source it from a single data file (e.g. `pricing-supplemental.json`).

---

## 3. Overview fallbacks: pricing-supplemental.json + getProgramsOverview()

**Result: WARNINGS (no blockers)**

- **data/pricing-supplemental.json:** Contains `programsOverviewFallbacks` with: `junior: 25`, `youth: 55`, `highPerformance: 58`, `adult: 31`, `fitness: 50`, `camps: 120`, `leagues: 25`.
- **lib/programs-data.ts:** `getProgramsOverview()` uses:
  - `overviewFallbacks` from `(pricingSupplementalData as …).programsOverviewFallbacks ?? {}`
  - `CAMPS_FROM_PRICE_FALLBACK = overviewFallbacks.camps ?? 120`
  - `LEAGUES_FROM_PRICE_FALLBACK = overviewFallbacks.leagues ?? 25`
  - For each category: `overviewFallbacks.junior ?? 25`, `overviewFallbacks.youth ?? 55`, etc.
- **Issue:** The numbers `25`, `31`, `50`, `55`, `58`, `120` are still present in code as fallbacks when a key is missing. All keys exist in JSON, so at runtime only the JSON values are used. For strict “no hardcoded” policy, use only `overviewFallbacks[key]` and handle missing keys (e.g. omit card or use a single default from config).

**Recommendation:** Remove numeric literals from `programs-data.ts` and rely on `programsOverviewFallbacks`; optionally add a single default (e.g. `0`) for missing keys and document expected keys in `pricing-supplemental.json`.

---

## 4. Schedules page is source; no duplicate content

**Result: PASS**

- **Schedules page** (`app/schedules/page.tsx`) is the single source: it uses `ProgramsSection`, `CampsSection`, `LeaguesSection`, `PrivateCoachingSection`. Program data comes from `getWinter2026Programs()` / `getSpringSummer2026()` (programs-data), camps from `year2026Data.camps`, leagues and private coaching from data/lib.
- **Program pages:** Do not duplicate schedule/pricing tables:
  - `programs/junior/page.tsx`, `programs/high-performance/page.tsx`: redirect to `/schedules#programs`.
  - `programs/adult/page.tsx`, `programs/page.tsx`: link to `/schedules` for “Full schedule, pricing, and registration.”
- **Camps page** uses `getCampsFromYear2026()` (year2026 → camps-data) for the full camp list and week-level pricing; schedules page shows the same camps from `year2026.json` in a compact form. No conflicting sources.

---

## 5. Additional finding: junior-trial early-bird threshold

**Result: WARNING (minor)**

- **app/junior-trial/page.tsx (line 48):** `const discount = isEarlyBird && price > 120 ? earlyBirdDiscount : 0`
- The `120` is a hardcoded threshold (only apply early-bird when price > 120). Same logic at line 334: `amount > 120`.
- **Recommendation:** Move the threshold to `pricing-supplemental.json` (e.g. under `promotions.earlyBird.minPriceForDiscount`) or to season-utils and read it in the page.

---

## File-level summary

| File | Status | Notes |
|------|--------|--------|
| data/year2026.json | OK | summer + swim-tennis have threeDayFullPrice / threeDayHalfPrice |
| data/pricing-supplemental.json | OK | programsOverviewFallbacks present and complete |
| lib/camps-data.ts | WARN | Uses data; fallback literals 435, 255, 375 in code |
| lib/programs-data.ts | WARN | Uses overviewFallbacks; fallback literals 25, 31, 50, 55, 58, 120 in code |
| app/junior-trial/page.tsx | WARN | Hardcoded threshold 120 for early-bird |

---

## Score breakdown

| Criterion | Weight | Result | Score |
|-----------|--------|--------|-------|
| Program/pricing only in /data/*.json; no hardcoded in components | 25 | PASS | 25 |
| Camp 3-day from year2026 + camps-data (no literals 435, 375) | 25 | WARN (data correct; fallbacks in code) | 18 |
| Overview fallbacks from pricing-supplemental; getProgramsOverview() | 25 | WARN (data correct; fallbacks in code) | 18 |
| Schedules page source; no duplicate content | 25 | PASS | 25 |
| **Total** | 100 | | **86** |
| *Adjustment* | | Fallback literals + junior-trial threshold | **-8** |
| **Reported score** | | | **78** |


---

## Blockers

**None.** All pricing and program data is driven by `/data/*.json`. Schedules is the single source for programs/pricing. Remaining issues are code-quality improvements (remove fallback literals, move junior-trial threshold to data).

---

## Recommended next steps

1. **lib/camps-data.ts:** Remove literals `435`, `255`, `375`. Use only `camp.threeDayFullPrice` / `camp.threeDayHalfPrice`, or a single fallback from `pricing-supplemental.json` if needed.
2. **lib/programs-data.ts:** Remove literals `25`, `31`, `50`, `55`, `58`, `120` from overview fallbacks; use only `overviewFallbacks[key]` and document required keys in `pricing-supplemental.json`.
3. **app/junior-trial/page.tsx:** Move early-bird minimum price threshold (120) to `pricing-supplemental.json` or season config and read it in the page.
