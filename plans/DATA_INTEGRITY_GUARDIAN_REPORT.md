# Data Integrity Guardian — LBTA Codebase Review

**Date:** 2026-03-08  
**Scope:** Single source of truth (site-stats.json, faq.json), hardcoded prices in components, register-year ActiveCampaign response handling, migration safety.

---

## Status: **WARNINGS**

No critical data-integrity failures. Minor warnings and one design trade-off to document or tighten.

---

## Findings Table

| # | Area | Finding | Severity | Location |
|---|------|---------|----------|----------|
| 1 | **site-stats.json** | Single source used everywhere: `Header`, `ExitIntentPopup`, `success-stories/page`, `app/page` (localBusinessSchema), `SEOSchemas` (ReviewSchema). All trust stats (playersCount, yearsExperience, rating, reviewCount) come from `data/site-stats.json`. | PASS | `data/site-stats.json`; consumers above |
| 2 | **faq.json** | Homepage FAQ (FAQSection) and FAQ schema (SEOSchemas) use `data/faq.json`. SEOSchemas overrides private-lessons and scholarship answers from `private-rates.json` and `year2026.json`. | PASS | `data/faq.json`; `FAQSection.tsx`, `SEOSchemas.tsx` |
| 3 | **FAQ page mismatch** | On `/faq`, visible content is `FAQInteractive` (inline “honest” Q&A); schema is from `FAQSchema` (faq.json + dynamic). Schema and visible Q&A differ by design. | WARNING | `app/faq/page.tsx`, `app/faq/FAQInteractive.tsx` |
| 4 | **Prices in components** | Schedules and program UIs get pricing from data: `ProgramRow`, `CampRow`, `LeagueRow`, `PrivateCoachingSection`, `ProgramCard`, `LuxuryRegistrationModal`, `LuxuryYearModal`, `ProgramPricingDropdown`, `PricingComparison` use `winter2026`, `year2026`, `leagues-2026`, `private-rates`, `pricing-supplemental`. No numeric prices hardcoded in components. | PASS | `lib/programs-data.ts`, `app/schedules/page.tsx`, schedule components |
| 5 | **form-config pricing** | `lib/form-config.ts` holds `prePopulateData.pricing` strings (e.g. `$260 (1x/week) - $520 (2x/week)`). Used as modal labels only; canonical program pricing remains in `/data`. Duplicate source that can drift from JSON data. | WARNING | `lib/form-config.ts` |
| 6 | **register-year AC — missing contact id** | If ActiveCampaign returns no contact id, API correctly returns **500** and user-friendly message. | PASS | `app/api/register-year/route.ts` (lines 343–349) |
| 7 | **register-year AC — request failure** | If AC contact create **throws** (network, 5xx, etc.), error is caught, logged, and execution continues; API still returns **200** with success message. Lead may be stored in Notion and Supabase but not in AC. | WARNING | `app/api/register-year/route.ts` (lines 398–404) |
| 8 | **register-year AC — list/tags** | List add and tag apply failures are caught and logged; success still returned (degraded success). Intentional; contact exists in AC. | INFO | Same route |
| 9 | **Migrations** | Single migration `20260306000000_create_leads_table.sql`: `CREATE TABLE IF NOT EXISTS`, indexes `IF NOT EXISTS`, rollback steps in comments. Applied via Supabase CLI only (per .cursorrules). | PASS | `supabase/migrations/` |

---

## Summary

- **Single source of truth**
  - **site-stats.json:** One source; all trust stats (playersCount, yearsExperience, rating, reviewCount) consumed from it. No remaining hardcoded stats in reviewed components/pages.
  - **faq.json:** One source for homepage FAQ and FAQ schema; SEOSchemas extends with dynamic private/scholarship from other data files. On `/faq`, visible content intentionally uses a different set (FAQInteractive); document or align if SEO/schema consistency is a goal.

- **Prices**
  - No hardcoded prices in UI components; schedules and program/camp/league/private UIs read from `/data` (winter2026, year2026, leagues-2026, private-rates, pricing-supplemental).  
  - **Caveat:** `lib/form-config.ts` holds pricing strings for registration modal labels; consider deriving from data or documenting as display-only to avoid drift.

- **register-year and ActiveCampaign**
  - Missing contact id → 500 and clear message (correct).
  - AC contact create failure (exception) → 200 and “success” (lead may be in Notion/Supabase but not in AC). Consider returning 503 or a distinct response when AC is required and fails, and/or surfacing a warning for ops.

- **Migrations**
  - Single, additive, idempotent migration with rollback notes; Supabase CLI–only usage is respected.

---

## Score: **88 / 100**

| Category | Weight | Score | Notes |
|----------|--------|-------|------|
| Single source (site-stats) | 25 | 25 | Fully centralized and used consistently. |
| Single source (faq) | 20 | 18 | faq.json + schema aligned; /faq visible vs schema mismatch by design. |
| No hardcoded prices in components | 25 | 22 | Components use data; form-config has duplicate pricing strings. |
| register-year AC handling | 20 | 15 | 500 on missing id is correct; AC failure still returns 200. |
| Migration safety | 10 | 10 | Additive, idempotent, rollback documented. |

**Recommendations (short term)**  
1. Document that faq.json = homepage + schema and FAQInteractive = intentional “honest” set for /faq (and add /faq-specific schema only if desired for SEO).  
2. Either derive form-config pricing labels from `/data` or add a comment that they are display-only and must be kept in sync with data.  
3. In register-year: on AC contact create failure, return 503 (or 200 with a flag like `acSynced: false`) so frontend/ops can distinguish “saved but not in AC” from “fully synced.”
