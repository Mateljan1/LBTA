# Regression Hunt Report — LBTA Next.js Codebase

**Date:** 2026-03-08  
**Scope:** Breaking changes, removed code, API response shapes, schema exports, Header/Footer links, removed behavior.

---

## Status: **PASS** (with warnings)

---

## Findings Table

| Area | Finding | Severity | Notes |
|------|---------|----------|--------|
| **API response shapes** | All form/API routes return consistent success/error shapes. | OK | Success: `{ success: true, message?: string }`. Error: `{ success: false, error: string }` (or validation error). Rate limit: 429 with same shape or chat returns 200 + `reply`. |
| **API consumers** | HomeCTAForm, TrialBookingModal, NewsletterForm, ExitIntentPopup, ChatWidget, LuxuryYearModal, LuxuryRegistrationModal, apply-scholarship, contact, adult-trial, junior-trial, beginner-program all use `response.ok` and/or `result.success` / `data.reply`. | OK | No consumer expects a field that was removed. |
| **Chat API** | `/api/chat` returns `{ reply: string }` on 200, 400, 500 and on rate limit (200). | OK | ChatWidget uses `data?.reply` with fallback; safe. |
| **Register-year error payload** | API returns `error` on 4xx/5xx; LuxuryYearModal shows `result.message \|\| fallback`. | WARN | User never sees server error message; fallback is shown. Not a break. |
| **Schema exports** | `app/schema.tsx`: OrganizationSchema, CourseSchema, LeagueEventSchema. `components/SEOSchemas.tsx`: FAQSchema, ReviewSchema, OrganizationSchema. | WARN | Two components named `OrganizationSchema`. Layout uses `app/schema` (SportsActivityLocation). `SEOSchemas.OrganizationSchema` is **never imported** — dead code. |
| **Schema usage** | Layout: OrganizationSchema (app/schema), ReviewSchema (SEOSchemas). FAQ page: FAQSchema (SEOSchemas). Programs page: CourseSchema (app/schema). USTA/UTR league pages: LeagueEventSchema (app/schema). | OK | No removed or broken schema usage. |
| **Header links** | Home (/), Schedule (/schedules), Coaches (/coaches), About (/about), Contact (/contact), Camp (/camps), Programs dropdown (/programs, /camps, /fitness, /programs/leagues), View Full Schedule (/schedules), Book Trial (/book). | OK | All targets exist. `/schedule` redirects to `/schedules` in next.config. |
| **Footer links** | Programs: /programs, /camps, /fitness, /programs/leagues, /schedules. Academy: /about, /coaches, /book, /contact, /racquet-rescue. Bottom: /privacy, /terms. | OK | All target pages exist (privacy, terms, racquet-rescue, etc.). |
| **Data dependencies** | site-stats.json (trustStats.playersCount, etc.), year2026.json (seasons, scholarships), faq.json, pricing-supplemental.json (schema, comparisonTiers), winter2026, spring-summer-2026, leagues-2026, private-rates. | OK | All referenced files exist; year2026.scholarships has awardedAnnually, coverage. |
| **ProgramsOverviewCard / programs-data** | `getProgramsOverview()` returns `ProgramsOverviewCard[]`; type and component align (eyebrow, title, description, href, fromPrice, image?). | OK | No shape mismatch. |
| **Redirects** | next.config: /schedule→/schedules, /pricing→/schedules, VYLO/JTT/pro-training/shop/racket-stringing/adult-academy/junior-academy/youth-development/private-lessons/the-team/elite-pathway. | OK | Legacy URLs covered; no removed behavior. |
| **Orphan API routes** | No PERS_General_* route files under app/api. | OK | Only PERS .md docs in repo; no accidental route. |
| **/api/register** | No in-repo front-end consumer; registerSchema (age, skillLevel, experience required) used only by route. | INFO | No regression; may be used externally or in future. |

---

## Summary

- **APIs:** Response shapes are consistent. Success uses `success: true` and optional `message`; errors use `success: false` and `error`. Chat always returns `reply`. All identified consumers (forms, modals, ChatWidget) rely on `response.ok` and/or `result.success` / `data.reply`; no consumer depends on a removed or renamed field.
- **Schemas:** No breaking change. Layout uses OrganizationSchema from `app/schema` and ReviewSchema from SEOSchemas. FAQ and programs/league pages use the expected schema components. Duplicate name `OrganizationSchema` in SEOSchemas is unused (dead code).
- **Navigation:** Every Header and Footer link targets an existing page or a redirected URL. Redirects in next.config cover legacy paths (VYLO, JTT, /schedule, /pricing, etc.).
- **Data:** All imported JSON and `lib` data loaders (programs-data, camps-data, season-utils, SEOSchemas) reference existing files and expected keys (e.g. year2026.scholarships, site-stats.trustStats).
- **Removed behavior:** No evidence of removed API routes, removed schema exports, or broken links. JTT/VYLO removal is handled by redirects.

**Warnings (non-blocking):**

1. **LuxuryYearModal:** Displays `result.message` on error, but register-year sends `error`. Users always see the fallback string; consider showing `result.error` when present.
2. **SEOSchemas.OrganizationSchema:** Exported but never used; consider removing or documenting if reserved for future use.
3. **FAQ page:** FAQSchema (faq.json + dynamic) and FAQInteractive (different Q&A set) — known content/schema mismatch per existing plans; not a regression.

---

## Score: **88 / 100**

- **Deductions:**  
  - −5: Unused schema export (SEOSchemas.OrganizationSchema).  
  - −4: Error payload inconsistency (register-year `error` vs modal `message`).  
  - −3: Minor documentation/consistency (duplicate OrganizationSchema name in two files).

---

*Generated by Regression Hunt review of API routes, schema usage, layout links, and data dependencies.*
