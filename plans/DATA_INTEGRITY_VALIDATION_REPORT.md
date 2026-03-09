# Data Integrity Validation Report — LBTA Next.js Site

**Date:** 2026-03-08  
**Workspace:** `/Users/andrew-mac-studio/LBTA_WEBSITE_DRAFT_3:5:26`  
**Validator:** Data Integrity Validator

---

## Summary

| Field | Result |
|-------|--------|
| **Status** | **WARNINGS** |
| **Score** | **82 / 100** |
| **Blockers** | 0 |
| **Warnings** | 5 |

---

## 1. Single source of truth (programs / pricing / schedules)

**Checked:**
- `/schedules` is the canonical page for programs, pricing, and schedule; Footer and Header link "Schedule & Pricing" → `/schedules`.
- Program and pricing data are loaded from `/data/*.json` via `lib/programs-data.ts`, `lib/camps-data.ts`, and direct JSON imports in schedule components.
- No standalone `/pricing` or `/schedule` pages; `next.config.js` redirects them to `/schedules`.
- Schedules page uses `ProgramsSection` (winter/spring/summer/fall from `winter2026.json`, `spring-summer-2026.json`, `fall2025.json`), `CampsSection` (`year2026.json`), `LeaguesSection` (`leagues-2026.json`), `PrivateCoachingSection` (`year2026.json`).

**Findings:**
- **PASS:** Program pricing displayed on `/schedules` (ProgramRow, ProgramCard, pricing tables) comes from `winter2026.json` / `spring-summer-2026.json` via `programs-data.ts` or direct JSON. No numeric program prices hardcoded in UI components.
- **PASS:** Fitness page uses `getFitnessClasses()` from `programs-data.ts`, which derives from Winter 2026 Fitness programs; `session.price` is from data.
- **WARNING:** `lib/form-config.ts` contains prePopulateData `pricing` strings (e.g. `'$260 (1x/week) - $520 (2x/week)'`, `'$546/quarter'`) that duplicate program pricing. If `winter2026.json` changes, form-config can drift. Recommend deriving or syncing these from `programs-data` or documenting that they must be updated in lockstep with winter2026.

---

## 2. Programs: lib/programs-data.ts and programs page

**Checked:**
- `lib/programs-data.ts` imports `winter2026.json`, `spring-summer-2026.json`, `private-rates.json` and exposes `getWinter2026Programs`, `getSpringProgramsForDisplay`, `getSummerProgramsForDisplay`, `getProgramsOverview`, `getPricingJuniors`, `getPricingYouth`, `getPricingAdults`, `getPricingCardioLiveball`, `getPrivateRates`, `getFitnessClasses`, `getTrialProgramOptions`.
- `app/programs/page.tsx` uses `getProgramsOverview()` only; cards link to `/schedules` or `/camps`/`/fitness`/`/programs/leagues`. No duplicate program lists or pricing tables on the programs page.
- `ProgramOverviewCard` displays `fromPrice` from `program.fromPrice` (supplied by `getProgramsOverview()`, which derives from winter2026 pricing or documented fallbacks for Camps/Leagues).

**Findings:**
- **PASS:** Programs page and programs-data load from data files; no duplicated program/pricing content on the programs page itself. Fallbacks in `programs-data.ts` (e.g. 25, 55, 58, 31, 50 for empty categories; CAMPS_FROM_PRICE_FALLBACK 120, LEAGUES_FROM_PRICE_FALLBACK 25) are used only when a category has no programs in winter2026 and are acceptable per project rules.

---

## 3. FAQ: Single faq.json; FAQSection and schema use same source

**Checked:**
- `data/faq.json` exists and contains a single list of Q&A (ids: ages, equipment, philosophy, location, cancellation, private, jtt, get-started).
- `components/FAQSection.tsx` (homepage) imports `faq.json` and renders it; it also builds and injects FAQ schema from the same `faqs` array.
- `components/SEOSchemas.tsx` imports `faq.json`, builds `faqItems` (maps faq.json + overrides private-lessons answer with dynamic min/max from private-rates + adds scholarship answer from year2026). `FAQSchema()` in SEOSchemas uses `faqItems`.
- `app/faq/page.tsx` renders `<FAQSchema />` (from SEOSchemas) and `<FAQInteractive />`.

**Findings:**
- **PASS:** Homepage FAQ (FAQSection) and the FAQ schema used on the homepage and on `/faq` (FAQSchema) both use `data/faq.json` as the base source; SEOSchemas only extends with dynamic private/scholarship answers.
- **WARNING:** On `/faq`, the **visible** content is `FAQInteractive`, which uses a **different**, inline `faqs` array (high-performance / “honest” Q&A: costs, D1, burnout, etc.). The **schema** on `/faq` is from `FAQSchema` (faq.json + dynamic). So on the FAQ page, schema Q&A and visible Q&A do not match. For strict single-source and SEO alignment, either drive FAQ page content from faq.json (or a second allowed source documented as “FAQ page set”) or add a dedicated schema built from the FAQInteractive set.

---

## 4. Site stats: data/site-stats.json and other uses of player count / ratings

**Checked:**
- `data/site-stats.json` contains `trustStats`: `playersCount` "500+", `yearsExperience` "15+", `rating` "5.0". No `reviewCount`.
- `components/ExitIntentPopup.tsx` imports `site-stats.json` and displays `trustStats.playersCount`, `trustStats.yearsExperience`, `trustStats.rating` — single source.

**Findings:**
- **PASS:** ExitIntentPopup uses site-stats.json for trust stats.
- **WARNING:** `app/success-stories/page.tsx` hardcodes trust stats: "500+" (players), "5.0" (Google rating), "25+" (Years Experience), "5.0 average from 47 Google reviews", "Join 500+ players…". These are not sourced from `site-stats.json`. **Conflict:** "25+" (success-stories) vs "15+" (site-stats) for years experience.
- **WARNING:** `app/page.tsx` localBusinessSchema has `aggregateRating: { ratingValue: '5.0', reviewCount: '47' }` hardcoded — not from site-stats. `components/SEOSchemas.tsx` `ReviewSchema` also hardcodes `ratingValue` "5.0", `ratingCount` "47", `reviewCount` "47". site-stats has no `reviewCount`; if added, schema and success-stories could be driven from site-stats for consistency.

---

## 5. Pricing / supplemental: pricing-supplemental.json, winter2026, etc.

**Checked:**
- `data/pricing-supplemental.json` holds: comparisonTiers, promotions, leagues (perWeekApprox, perSeason), schema (priceRange, courses), beginnerProgram, matchPlay, ustaAdultLeague, racquetRescue.
- `app/schema.tsx` uses `pricingSupplemental.schema` for `priceRange` and course prices (juniorDevelopment, youthDevelopment, highPerformance, adultPrograms).
- `components/PricingComparison.tsx` uses `comparisonTiers` from pricing-supplemental.
- `app/programs/usta-adult-league/page.tsx` uses `pricingData.ustaAdultLeague` (and leagues-2026 for league rows).
- `data/leagues-2026.json` has `usta.totalSeasonCost: 5500`, `ustaMembershipAnnual: 48` — values match pricing-supplemental `ustaAdultLeague`; LeaguesSection uses leagues-2026 for display. USTA totals are duplicated in two files but currently in sync.
- Main program pricing on `/schedules` comes from winter2026 / spring-summer-2026 via programs-data; no conflicting numbers found in the main programs UI.

**Findings:**
- **PASS:** No conflicting or duplicate **program** pricing in the main schedules/programs UI; program prices are from winter2026 / spring-summer-2026.
- **PASS:** Supplemental/marketing pricing (comparison tiers, USTA summary, match play, racquet rescue, schema) is centralized in pricing-supplemental or leagues-2026; no hardcoded prices in components for these.
- **WARNING:** Schema course prices and comparison tier amounts in pricing-supplemental are not derived from winter2026; if winter2026 changes, schema and comparison tiers can drift. Acceptable as “supplemental” but should be kept in sync manually or via a documented process.

---

## Blockers

**None.** No data integrity issues that must be fixed before release.

---

## Recommended follow-ups (non-blocking)

1. **Trust stats single source:** Use `data/site-stats.json` (and optional `reviewCount`) in success-stories page and in all schema (app/page.tsx localBusinessSchema, SEOSchemas ReviewSchema). Resolve "15+" vs "25+" years and use one canonical value.
2. **form-config pricing:** Either derive registration modal pricing strings from programs-data/winter2026 or document that form-config pricing must be updated whenever winter2026 changes.
3. **FAQ page:** Align /faq so that either (a) visible FAQs and schema both come from the same source(s), or (b) document that faq.json = homepage + schema and FAQInteractive = intentional separate “honest” set for /faq, and consider a separate schema for the /faq visible set if desired for SEO.
4. **site-stats.json:** Add `reviewCount` (e.g. "47") if schema and success-stories will be driven from it.

---

## Score breakdown (0–100)

| Area | Weight | Result | Note |
|------|--------|--------|------|
| Single source (schedules, data files, no hardcoded program prices) | 25 | 22 | Minor: form-config pricing duplication |
| Programs + programs-data | 20 | 20 | Data from files; no duplication on programs page |
| FAQ single source | 20 | 16 | faq.json used for homepage + schema; /faq visible content different from schema |
| Site stats single source | 20 | 14 | ExitIntentPopup OK; success-stories + schema hardcoded; 15+ vs 25+ conflict |
| Pricing/supplemental no conflict | 15 | 10 | No UI conflict; schema/tiers not derived from winter2026 |
| **Total** | **100** | **82** | WARNINGS only |

---

*End of report.*
