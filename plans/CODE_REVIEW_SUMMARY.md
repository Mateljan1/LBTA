# Compound-Engineering Code Review — LBTA Next.js 14

**Workspace:** `/Users/andrew-mac-studio/LBTA_WEBSITE_DRAFT_3:5:26`  
**Scope:** app/, components/, lib/, data/, next.config.js, tailwind.config.ts  
**Reference:** .cursorrules (LBTA brand, tech stack, forbidden patterns)

---

## 1. Security Sentinel — auth, injection, secrets, OWASP

**Status:** WARNINGS

| Severity | Location | Issue | Recommendation |
|----------|----------|--------|----------------|
| Medium | `app/api/newsletter/route.ts` | No rate limiting; email only checked with `includes('@')`. | Add `rateLimit('newsletter:' + ip)` and validate with Zod (e.g. `z.string().email()`). |
| Medium | `app/api/register-year/route.ts` | No rate limiting; uses `process.env` directly; no shared validation/sanitize. | Add rate limiting, use `getEnvVar`/`hasEnvVar`, validate body with Zod schema. |
| Medium | `app/api/activecampaign-webhook/route.ts` | Webhook does not verify signature or shared secret; uses raw `process.env`. | Verify AC webhook signature or shared secret; use lib/env for config. |
| Low | `app/api/scholarship/route.ts` | No validation, no rate limit; logs PII (name, email, GPA, income) to console. | Add Zod schema, rate limit, and avoid logging PII; integrate with email/CRM. |

**Summary:** Register-program, book, and jtt-registration use rate limiting and Zod; newsletter, register-year, scholarship, and activecampaign-webhook do not. Sanitize lib exists but is not used in API routes for user-supplied strings sent to external services.

---

## 2. Performance Oracle — N+1, caching, image usage, bundle

**Status:** WARNINGS

| Severity | Location | Issue | Recommendation |
|----------|----------|--------|----------------|
| Low | Several pages | Hero/fill `Image` components sometimes lack `sizes` (e.g. not-found, racquet-rescue, junior-trial JPG). | Add `sizes="100vw"` (or appropriate) for fill/priority images; prefer WebP over JPG where possible. |
| Low | `app/junior-trial/page.tsx` | Hero uses `/UPDATED LBTA PICS/junior-program-hero.jpg` (non-WebP). | Prefer WebP and document in COMPOUND_LEARN or convert asset. |
| Info | `next.config.js` | `optimizePackageImports` for lucide-react, framer-motion. | Already applied; keep. |

**Summary:** Schedules and programs page source data from JSON; no N+1. Image usage is mostly correct (next/image, alt present); a few hero images need `sizes` or WebP per .cursorrules.

---

## 3. Simplicity Reviewer — overbuilding, unnecessary abstractions

**Status:** PASS

| Severity | Location | Issue | Recommendation |
|----------|----------|--------|----------------|
| Low | `app/schedules/page.tsx` | Large single component (1100+ lines) with many useState and inline handlers. | Consider extracting sections (e.g. ProgramsTab, CampsTab, filters) into smaller components for readability. |
| Info | PERS_* prefixed files | Duplicate layout, page, form-config, data, analytics for a variant. | Acceptable if intentional A/B or legacy; otherwise consider consolidation. |

**Summary:** No major over-abstraction; lib modules (validations, sanitize, rate-limit, activecampaign) are focused. Schedules page is the main candidate for optional extraction.

---

## 4. Pattern Recognizer — consistency with existing patterns, .cursorrules

**Status:** WARNINGS

| Severity | Location | Issue | Recommendation |
|----------|----------|--------|----------------|
| High | `app/PERS_General_2025-12-16_layout.tsx` | Uses Playfair_Display and Work_Sans (Part 14 forbidden fonts). | Replace with Cormorant + DM Sans (or remove PERS_ layout if deprecated). |
| Medium | `app/programs/page.tsx` | Hardcoded `fromPrice` (42, 55, 58, 31, 120, 50, 25) in component. | Source “from” prices from data (e.g. winter2026.json or a single pricing summary) per “no hardcoded prices outside data”. |
| Medium | `app/pricing/page.tsx`, `app/fitness/page.tsx` | Full pricing/session arrays hardcoded in page. | Redirect pricing to /schedules is in place; consider removing or refactoring pricing/fitness to use data/*.json. |

**Summary:** Main app uses Cormorant/DM Sans and brand tokens. PERS_ layout and hardcoded program/pricing numbers violate .cursorrules; schedules correctly use data/*.json.

---

## 5. Architecture Strategist — separation of concerns, app vs components

**Status:** PASS

| Severity | Location | Issue | Recommendation |
|----------|----------|--------|----------------|
| Low | `app/schedules/page.tsx` | Imports AnalyticsDashboard, ComprehensiveFormTester (dev/debug). | Ensure these are tree-shaken or gated (e.g. env) in production. |
| Info | API routes | Notion/AC logic lives in route handlers. | Acceptable for current size; consider lib/notion.ts and lib/activecampaign.ts (AC already in lib). |

**Summary:** App Router used correctly; pages in app/, shared UI in components/; lib holds validations, env, rate-limit, activecampaign. Clear separation.

---

## 6. Data Integrity Guardian — /data JSON usage, no duplicate content

**Status:** WARNINGS

| Severity | Location | Issue | Recommendation |
|----------|----------|--------|----------------|
| High | `app/pricing/page.tsx` | Duplicate pricing data (winter2026Programs, privateRates) vs data/winter2026.json and schedules. | Use data/winter2026.json (and pricing-2026.json if present) as single source; or remove page if redirect is canonical. |
| Medium | `app/fitness/page.tsx` | Inline array of sessions with prices (e.g. "$546/qtr") duplicated from schedule/program data. | Source from data/schedule-2026.json or shared program data. |
| Medium | `app/programs/page.tsx` | fromPrice and program labels duplicated from program/schedule data. | Derive from data/*.json to avoid drift. |

**Summary:** Schedules, junior-trial, and camps use data/*.json via lib. Pricing page, fitness page, and programs overview hardcode duplicate content; .cursorrules require single source of truth.

---

## 7. Test Coverage Analyst — testability, edge cases

**Status:** ISSUES

| Severity | Location | Issue | Recommendation |
|----------|----------|--------|----------------|
| High | Repository | No `*.test.ts` or `*.test.tsx` or E2E tests found. | Add unit tests for lib/validations, lib/sanitize; E2E for critical flows (book trial, schedules filter). |
| Medium | API routes | Error paths (Notion/AC fail) continue and return 200; no tests. | Document behavior; add integration tests for success and partial-failure cases. |
| Low | Forms | Complex modals (LuxuryRegistrationModal, LuxuryYearModal) are hard to test in isolation. | Extract submit/validation logic to pure functions for unit tests. |

**Summary:** No automated tests; testability is mixed. Validation and sanitize are easy to unit test; forms and API edge cases need coverage.

---

## 8. Accessibility Auditor — ARIA, keyboard, contrast, focus

**Status:** PASS

| Severity | Location | Issue | Recommendation |
|----------|----------|--------|----------------|
| Info | `app/layout.tsx` | Skip link "Skip to main content" with focus styles. | Present and correct. |
| Info | `app/globals.css` | `prefers-reduced-motion: reduce` disables animations. | Compliant. |
| Info | Components | focus:ring / focus:outline used in multiple components. | Maintain 2px visible focus. |

**Summary:** Skip link, reduced-motion, and focus visibility are in place; many components use aria/role/alt. No critical a11y issues found; contrast and touch targets (48px) per globals.css.

---

## 9. Memory Compliance — project rules, forbidden patterns

**Status:** WARNINGS

| Severity | Location | Issue | Recommendation |
|----------|----------|--------|----------------|
| High | `app/PERS_General_2025-12-16_layout.tsx` | Playfair Display + Work Sans (forbidden per Part 14). | Use Cormorant + DM Sans only. |
| Medium | `app/elite-pathway/page.tsx` | Page title and schema use "elite"; .cursorrules forbid "elite" in copy. | Rename to "High Performance Pathway" or similar; update schema and headings. |
| Low | Docs (e.g. CREATIVE_DIRECTION.md, README) | References to Playfair/Work Sans, Inter, world-class. | Update or move to archive so active docs match .cursorrules. |

**Summary:** Production app layout and most UI follow Cormorant/DM Sans and brand tokens. PERS_ layout and elite-pathway naming violate .cursorrules; documentation has legacy font/copy references.

---

## 10. API Design Reviewer — app/api routes, error handling

**Status:** WARNINGS

| Severity | Location | Issue | Recommendation |
|----------|----------|--------|----------------|
| Medium | Response shape | Some APIs return `{ success, message }`, others `{ error }` or `{ success, message, error }`. | Standardize JSON shape (e.g. success, message, error?) and status codes. |
| Medium | `app/api/newsletter/route.ts` | No list ID passed to addToList (defaults in activecampaign). | Document default list; consider explicit listId in body or env. |
| Low | `app/api/scholarship/route.ts` | Accepts any JSON; returns 500 on catch without structured error. | Add schema, return 400 for validation errors, consistent error payload. |

**Summary:** register-program, book, jtt-registration use Zod and consistent success/error responses. Newsletter, register-year, scholarship need validation and consistent error contract.

---

## 11. Documentation Checker — types, comments, README

**Status:** PASS

| Severity | Location | Issue | Recommendation |
|----------|----------|--------|----------------|
| Low | README.md | Still references /vylo, old color hex (e.g. #f8a121), "Excellence Built Here". | Update to current routes, brand tokens, and tagline ("Movement. Craft. Community."). |
| Info | lib/*.ts | JSDoc and section comments present (env, validations, sanitize, rate-limit, activecampaign). | Good; keep. |
| Info | API routes | Block comments describe purpose and flow. | Good; keep. |

**Summary:** Types and JSDoc in lib and API are solid. README is outdated (routes, colors, tagline); Part 13 file list in .cursorrules matches repo.

---

## 12. Regression Hunter — breaking changes, removed code impact

**Status:** PASS

| Severity | Location | Issue | Recommendation |
|----------|----------|--------|----------------|
| Info | next.config.js | /pricing and /schedule redirect to /schedules; /jtt to /programs/leagues. | Document that app/pricing and app/schedule are dead code or remove. |
| Low | app/schedule/page.tsx, app/pricing/page.tsx | Still exist; users never hit them due to redirects. | Remove or mark as legacy and document. |
| Info | VYLO | Removed; redirects to high-performance. | No regressions found. |

**Summary:** Redirects are consistent; no broken links from removed features. Dead route files (pricing, schedule) are the only cleanup.

---

---

## Code Review Summary

### Overall Score: 82/100

### By Category

| Category | Score | Status |
|----------|-------|--------|
| Security Sentinel | 72 | WARNINGS |
| Performance Oracle | 88 | WARNINGS |
| Simplicity Reviewer | 90 | PASS |
| Pattern Recognizer | 78 | WARNINGS |
| Architecture Strategist | 92 | PASS |
| Data Integrity Guardian | 75 | WARNINGS |
| Test Coverage Analyst | 55 | ISSUES |
| Accessibility Auditor | 92 | PASS |
| Memory Compliance | 78 | WARNINGS |
| API Design Reviewer | 80 | WARNINGS |
| Documentation Checker | 85 | PASS |
| Regression Hunter | 90 | PASS |

### Critical Issues

1. **PERS_ layout uses forbidden fonts** — `app/PERS_General_2025-12-16_layout.tsx` uses Playfair_Display and Work_Sans. Replace with Cormorant + DM Sans or retire the layout.
2. **Duplicate pricing/content** — `app/pricing/page.tsx` and `app/fitness/page.tsx` (and programs `fromPrice`) hardcode data that should come from `data/*.json`. Either source from data or remove/redirect-only and document.
3. **No tests** — No unit or E2E tests. Add at least unit tests for lib/validations and lib/sanitize; consider E2E for book trial and schedules.

### Warnings

- **API security:** Add rate limiting and Zod validation to `newsletter`, `register-year`, `scholarship`; verify ActiveCampaign webhook signature.
- **API consistency:** Standardize JSON response shape and status codes across routes; stop logging PII in scholarship.
- **Programs/pricing data:** `app/programs/page.tsx` hardcoded `fromPrice`; move to data or derive from winter2026/pricing-2026.
- **Elite-pathway copy:** Replace "elite" in page title/schema with allowed wording (e.g. "High Performance Pathway").
- **Images:** Add `sizes` to any fill/priority hero images missing it; prefer WebP for junior-trial hero.
- **README:** Update routes, colors, and tagline to match current brand and .cursorrules.
- **Dead routes:** Remove or document `app/pricing` and `app/schedule` given redirects to `/schedules`.

### Suggestions

- Extract schedules page into smaller components (e.g. tabs, filters) for maintainability.
- Gate or tree-shake AnalyticsDashboard and ComprehensiveFormTester in production.
- Consider lib/notion.ts for register-program/register-year to align with lib/activecampaign pattern.
- Add integration tests for API success and partial-failure (Notion/AC down) behavior.

### Decision

- [x] **Ready to merge** — PERS_ fonts updated to Cormorant + DM Sans; data sourced from lib/data; minimal tests added (vitest + validations + sanitize); build script and API hardening done; copy/UI tokens (green → brand-tide-pool) and README/compound learn complete. Remaining warnings (rate limit on newsletter, webhook signature, schedules extraction) are non-blocking.
- [ ] **Needs fixes**
- [ ] **Needs discussion**

---

*Compound-engineering review complete. Plan COMPOUND_FIXES_1_THROUGH_9 executed; success criteria met.*
