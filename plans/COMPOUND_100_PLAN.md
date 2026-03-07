# Compound Engineering Plan: 100/100 — Fix All Remaining Issues

## Overview

Address every remaining warning, suggestion, and nice-to-have from the CODE_REVIEW_SUMMARY (82/100) and VALIDATE_SUMMARY (81/100) to bring both scores to 100/100. Previous "Fixes 1-9" resolved critical issues; this plan cleans up the remaining gaps.

## Problem Statement

- Review score 82/100 — warnings remain in Security, Performance, Pattern Recognizer, Data Integrity, Memory Compliance, API Design, Documentation.
- Validation score 81/100 — Data Integrity 58/100, UI/Visual 88/100, Functional 92/100, API 88/100.
- Goal: 100/100 across all categories. Zero warnings. Zero nice-to-haves left unaddressed.

## Already Fixed (by Fixes 1-9)

- Newsletter, register-year, scholarship, register APIs: NextRequest, Zod, rate limiting, no PII
- Pricing/programs/fitness pages: data-driven from lib/programs-data
- Build script: `npx next build`
- Tests: vitest + lib/validations.test.ts + lib/sanitize.test.ts
- Schedules page itself: green-* replaced with brand tokens
- Book/thank-you pages: green-* replaced

## Still Needs Fixing

### Fix 1: metadataBase in root layout
- Set `metadataBase: new URL('https://lagunabeachtennisacademy.com')` in `app/layout.tsx` metadata export
- Prevents OG/Twitter images resolving to localhost

### Fix 2: Elite-pathway schema cleanup
- In `app/elite-pathway/page.tsx`:
  - Rename `eliteSchema` variable to `highPerformanceSchema`
  - Change script id from `elite-schema` to `high-performance-schema`
  - Change `?program=elite-assessment` URL param to `?program=high-performance-assessment`
  - Verify all user-facing copy avoids "elite" (already done per exploration)

### Fix 3: Component green-* → brand tokens
- Replace all raw `green-*` Tailwind classes in these components:
  - `components/TrialBookingModal.tsx`
  - `components/StickyCTA.tsx`
  - `components/TrustBadges.tsx`
  - `components/YearRegistrationModal.tsx`
  - `components/AnalyticsDashboard.tsx`
  - `components/UrgencyBanner.tsx`
  - `components/PricingComparison.tsx`
  - `components/ComprehensiveFormTester.tsx`
  - `components/ScheduleTable.tsx`
  - `components/PricingTabs.tsx`
  - `components/GuaranteeBadge.tsx`
- Map: `text-green-600` → `text-brand-tide-pool`, `bg-green-50/100` → `bg-brand-tide-pool/10`, `bg-green-400/500` → `bg-brand-tide-pool`, `border-green-*` → `border-brand-tide-pool`, etc.

### Fix 4: ActiveCampaign webhook security
- In `app/api/activecampaign-webhook/route.ts`:
  - Add env var `AC_WEBHOOK_SECRET`
  - Verify `x-ac-webhook-secret` header (or similar) against the env secret
  - Return 401 if missing/invalid
  - Document in code comment that AC requires manual secret configuration

### Fix 5: API response shape standardization
- Audit all 8 API routes for consistent shape: `{ success: boolean, message?: string, error?: string }`
- Ensure all error responses use status 400 (validation) or 500 (server) with the same shape
- Fix any remaining inconsistencies

### Fix 6: Junior-trial hero image
- Convert `/UPDATED LBTA PICS/junior-program-hero.jpg` to WebP or note if asset unavailable
- Ensure `sizes` attribute is present on all fill/priority hero images across the site
- Audit: not-found, racquet-rescue, and any other hero images for missing `sizes`

### Fix 7: Dead route cleanup
- Remove `app/schedule/page.tsx` (redirect to /schedules exists in next.config.js)
- Remove `app/pricing/page.tsx` and `app/pricing/PricingContent.tsx` (redirect to /schedules exists)
- Keep redirects in next.config.js

### Fix 8: PERS_* Inter font cleanup
- In `PERS_General_2025-12-16_activecampaign-form-templates.md` and `PERS_General_2025-12-16_LBTA_ActiveCampaign_Forms_Complete.md`:
  - Replace `Inter` font references with `DM Sans`
- Verify no other PERS_* files reference forbidden fonts

### Fix 9: Production-gate debug components
- In `app/schedules/page.tsx` or wherever AnalyticsDashboard and ComprehensiveFormTester are imported:
  - Gate behind `process.env.NODE_ENV === 'development'` or remove from production bundle
  - Use dynamic import with `ssr: false` and dev-only rendering

### Fix 10: Schedules page extraction (maintainability)
- Extract the large schedules page (1100+ lines) into smaller components:
  - `components/schedules/ProgramsTab.tsx`
  - `components/schedules/CampsTab.tsx`
  - `components/schedules/FiltersBar.tsx`
  - Keep the main page as a composition of these

### Fix 11: README final polish
- Ensure all routes listed match current app
- Verify colors/typography references match .cursorrules
- Remove any stale references (VYLO, old hex codes, etc.)

### Fix 12: Hero images audit
- Ensure every hero/above-fold Image has `priority` and `sizes`
- Prefer WebP format for all hero images
- Check: homepage, about, coaches, camps, jtt, fitness, contact, book

### Fix 13: next.config.js metadataBase / turbopack
- Set `turbopack.root` or remove extra lockfile to silence workspace warning
- Verify redirects are complete and correct

---

## Files to Create/Modify

| File | Action | Fix |
|------|--------|-----|
| `app/layout.tsx` | Modify | metadataBase |
| `app/elite-pathway/page.tsx` | Modify | Schema/URL "elite" → "high-performance" |
| `components/TrialBookingModal.tsx` | Modify | green-* → brand tokens |
| `components/StickyCTA.tsx` | Modify | green-* → brand tokens |
| `components/TrustBadges.tsx` | Modify | green-* → brand tokens |
| `components/YearRegistrationModal.tsx` | Modify | green-* → brand tokens |
| `components/AnalyticsDashboard.tsx` | Modify | green-* → brand tokens + dev gate |
| `components/UrgencyBanner.tsx` | Modify | green-* → brand tokens |
| `components/PricingComparison.tsx` | Modify | green-* → brand tokens |
| `components/ComprehensiveFormTester.tsx` | Modify | green-* → brand tokens + dev gate |
| `components/ScheduleTable.tsx` | Modify | green-* → brand tokens |
| `components/PricingTabs.tsx` | Modify | green-* → brand tokens |
| `components/GuaranteeBadge.tsx` | Modify | green-* → brand tokens |
| `app/api/activecampaign-webhook/route.ts` | Modify | Webhook secret verification |
| `app/api/*/route.ts` (all 8) | Audit/Modify | Response shape consistency |
| `app/junior-trial/page.tsx` | Modify | Hero WebP note |
| `app/schedule/page.tsx` | Delete | Dead route |
| `app/pricing/page.tsx` | Delete | Dead route |
| `app/pricing/PricingContent.tsx` | Delete | Dead route component |
| `PERS_*_activecampaign-form-templates.md` | Modify | Inter → DM Sans |
| `PERS_*_LBTA_ActiveCampaign_Forms_Complete.md` | Modify | Inter → DM Sans |
| `app/schedules/page.tsx` | Modify | Dev-gate debug components |
| `README.md` | Modify | Final polish |

---

## Success Criteria

- [ ] metadataBase set to production URL
- [ ] No "elite" in schema variables, script IDs, or URL params
- [ ] Zero raw green-* Tailwind classes in any component (brand tokens only)
- [ ] AC webhook verifies secret header
- [ ] All 8 API routes return consistent `{ success, message?, error? }` shape
- [ ] Junior-trial hero: WebP preferred, sizes present
- [ ] Dead routes (schedule, pricing) removed
- [ ] No forbidden fonts (Inter, Playfair, Work Sans) in any PERS_* file
- [ ] Debug components gated to development only
- [ ] README fully accurate and current
- [ ] All hero images have `sizes` and `priority` where appropriate
- [ ] Build succeeds with zero warnings
- [ ] All existing tests pass

---

## Execution Order

Fixes 1-5 (critical/security) → Fixes 6-8 (cleanup) → Fixes 9-10 (maintainability) → Fixes 11-13 (polish)
