# LBTA Next.js Site — Three-Agent Code Review

**Date:** March 6, 2026  
**Scope:** Architecture, Accessibility, API Design

---

## Agent 1: Architecture Strategist Review

**Status:** WARNINGS

| Severity | Location | Issue | Recommendation |
|----------|----------|-------|----------------|
| Low | `app/` | PERS_General_2025-12-16_* prefixed files (layout, page, route) duplicate production code | Consolidate or remove if legacy; document if intentional A/B |
| Low | `components/` | PERS_General_2025-12-16_* prefixed components (AnalyticsDashboard, ComprehensiveFormTester, EmbeddedRegistrationPanel) | Same as above; ensure single source of truth |
| Low | `lib/` | PERS_General_2025-12-16_form-config.ts, form-analytics.ts, webhook-tester.ts duplicate lib modules | Consolidate or gate behind feature flag |
| Info | `data/` | PERS_General_2025-12-16_winter2026.json duplicates winter2026.json | Align with single source of truth rule |
| Pass | `app/` vs `components/` | Pages in app/, shared UI in components/ — correct separation | — |
| Pass | `data/` | winter2026.json, fall2025.json, pricing-2026.json, schedule-2026.json, leagues-2026.json, year2026.json, private-rates.json | Data lives in data/ as expected |
| Pass | `lib/` | activecampaign.ts, env.ts, validations.ts, rate-limit.ts, sanitize.ts, analytics.ts, form-config.ts, form-analytics.ts | Utilities correctly in lib/ |
| Pass | `app/schedules/page.tsx` | AnalyticsDashboard, ComprehensiveFormTester gated with `process.env.NODE_ENV === 'development'` | Debug components properly gated |
| Pass | Import structure | Clean `@/` path aliases; no circular imports observed | — |
| Info | Page components | Some pages (e.g. schedules) contain moderate logic for data fetching/transformation | Acceptable; consider extracting to lib/ if logic grows |

**Score: 82/100**

---

## Agent 2: Accessibility Auditor Review

**Status:** PASS

| Severity | Location | Issue | Recommendation |
|----------|----------|-------|----------------|
| Pass | `app/layout.tsx` | Skip link present: `<a href="#main-content" className="sr-only focus:not-sr-only ...">Skip to main content</a>` | — |
| Pass | `components/layout/ConditionalLayout.tsx` | Main content has `id="main-content"` for skip link target | — |
| Pass | `app/globals.css` | `@media (prefers-reduced-motion: reduce)` at lines 598–607; animations/transitions set to 0.01ms | — |
| Pass | `app/globals.css` | Focus states: `*:focus-visible` 2px outline, `outline-offset: 3px`; button/a/input/select/textarea have 2px ring | — |
| Pass | `app/globals.css` | Mobile touch targets: `min-height: 48px`, `min-width: 48px` for buttons/inputs at `max-width: 768px` | — |
| Pass | Sample components | Header: `aria-label="Main navigation"`, mobile menu `aria-label`, `aria-expanded`, `aria-controls`; Programs dropdown `role="menu"`, `role="menuitem"`; Call link `aria-label="Call us"` | — |
| Pass | ProgramCard | Expand button has `aria-expanded`, `aria-label` with program name | — |
| Pass | Images | Homepage, not-found, PartnershipSection, PressBanner, ChatWidget, PhotoVideoGallery use descriptive alt text | — |
| Info | `app/layout.tsx` | noscript img for Meta Pixel has `alt=""` (decorative) | Correct for tracking pixel |

**Score: 95/100**

---

## Agent 3: API Design Reviewer Review

**Status:** WARNINGS

| Severity | Location | Issue | Recommendation |
|----------|----------|-------|----------------|
| Medium | `app/api/register-program/route.ts` | Rate limit key `register:${ip}` collides with `app/api/register/route.ts` | Use `register-program:${ip}` for distinct bucket |
| Low | `app/api/newsletter/route.ts` | Catch block returns `{ status: 400 }` for all errors; server/network failures should be 500 | Differentiate validation (400) vs unexpected (500) in catch |
| Low | `app/api/activecampaign-webhook/route.ts` | No rate limiting (webhook endpoint) | Acceptable — secret verification used; consider optional rate limit for abuse |
| Pass | All 8 routes | Use `NextRequest` consistently | — |
| Pass | Response shape | Success: `{ success: true, message? }`; Error: `{ success: false, error }` | Consistent |
| Pass | HTTP status codes | 200 success, 400 validation, 401 (webhook auth), 429 rate limit, 500 server error, 503 (webhook not configured) | Correct |
| Pass | Form endpoints | book, newsletter, register, register-year, register-program, scholarship, jtt-registration all use `rateLimit()` | Rate limiting present |
| Pass | Error handling | All routes wrap logic in try/catch; errors logged and returned with appropriate status | — |
| Info | `app/api/activecampaign-webhook/route.ts` | Returns 200 with `{ success: false }` on error to prevent AC retries | Intentional; document in route comment |

**API Routes Audited:**
- `app/api/book/route.ts` ✓
- `app/api/newsletter/route.ts` ✓
- `app/api/register/route.ts` ✓
- `app/api/register-year/route.ts` ✓
- `app/api/register-program/route.ts` ✓ (rate limit key fix needed)
- `app/api/scholarship/route.ts` ✓
- `app/api/activecampaign-webhook/route.ts` ✓
- `app/api/jtt-registration/route.ts` ✓

**Score: 88/100**

---

## Summary

| Agent | Status | Score |
|-------|--------|-------|
| Architecture Strategist | WARNINGS | 82/100 |
| Accessibility Auditor | PASS | 95/100 |
| API Design Reviewer | WARNINGS | 88/100 |

**Priority Fixes:**
1. **API:** Change `register-program` rate limit key from `register:` to `register-program:` to avoid collision with `/api/register`.
2. **API:** In `newsletter` catch block, return 500 for non-validation errors.
3. **Architecture:** Document or consolidate PERS_General_2025-12-16_* prefixed files.
