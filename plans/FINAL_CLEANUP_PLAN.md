# LBTA Final Cleanup — Implementation Plan

**Compound Engineering Phase: PLAN**  
**Date:** March 6, 2026  
**Starting Score:** Code Review 94/100, Validation 95/100  
**Target Score:** 98/100+  
**Source:** 3 parallel research agents (codebase, patterns, data integrity)

---

## Overview

Seven focused phases to finish the LBTA website: token cleanup, route rename, docs sync, orphan removal, data hygiene, error styling, and optional testing. No new features — cleanup and compliance only.

## Problem Statement

The site is production-ready (build passes, 42 routes, 53 tests) but has accumulated debt from rapid development: legacy `lbta-burnt` tokens, an `/elite-pathway` URL with forbidden word, `.cursorrules` Part 13 out of sync, 16+ orphaned PERS_* files, orphaned data files, raw Tailwind red classes for errors, and inline hex in 2 components. Resolving these brings the codebase to full brand-kit and .cursorrules compliance.

---

## Implementation Steps

### Phase 1: Brand Token Cleanup (lbta-burnt → brand-sunset-cliff)

**66 occurrences across 10 files. Simple find-and-replace.**

- [ ] **1.1** `app/apply-scholarship/page.tsx` — Replace all `lbta-burnt` with `brand-sunset-cliff` (22 occurrences)
- [ ] **1.2** `app/coaches/andrew-mateljan/page.tsx` — Replace (12 occurrences)
- [ ] **1.3** `app/match-play/page.tsx` — Replace (9 occurrences)
- [ ] **1.4** `components/ui/Chatbot.tsx` — Replace (5 occurrences)
- [ ] **1.5** `app/faq/FAQInteractive.tsx` — Replace (5 occurrences)
- [ ] **1.6** `app/pathway-planner/page.tsx` — Replace (4 occurrences)
- [ ] **1.7** `components/ui/FourLabs.tsx` — Replace (3 occurrences)
- [ ] **1.8** `components/ui/BackToTop.tsx` — Replace (1 occurrence)
- [ ] **1.9** `components/ui/TestimonialQuote.tsx` — Replace (1 occurrence)
- [ ] **1.10** `components/ui/PartnershipSection.tsx` — Replace (1 occurrence)
- [ ] **1.11** `tailwind.config.ts` — Remove `burnt` from `lbta` colors (or keep as deprecated alias with comment)

**Parallel: all 10 files can be done simultaneously.**

---

### Phase 2: Elite-Pathway Route Rename

**Route URL uses forbidden word "elite"; copy already says "High Performance Pathway".**

- [ ] **2.1** Create `app/high-performance-pathway/page.tsx` by moving content from `app/elite-pathway/page.tsx`
- [ ] **2.2** Delete `app/elite-pathway/page.tsx`
- [ ] **2.3** Add redirect in `next.config.js`: `/elite-pathway` → `/high-performance-pathway` (permanent)
- [ ] **2.4** Search and update any internal links to `/elite-pathway` across all .tsx files
- [ ] **2.5** Update `app/sitemap.ts` if elite-pathway is listed
- [ ] **2.6** Update `README.md` route table

---

### Phase 3: .cursorrules Part 13 Sync

**File structure section doesn't match actual repo.**

- [ ] **3.1** Update `app/` tree to include all current routes:
  - Add: `elite-pathway` → `high-performance-pathway` (after Phase 2), `beginner-program`, `junior-trial`, `adult-trial`, `match-play`, `pathway-planner`, `apply-scholarship`, `racquet-rescue`, `philosophy`, `success-stories`, `faq`, `privacy`, `terms`
  - Add: `programs/usta-adult-league`, `programs/utr-match-play`
  - Add: `coaches/andrew-mateljan`
  - Remove: reference to `jtt` (already gone)
- [ ] **3.2** Update `api/` tree to include all 8 routes:
  - Add: `register/route.ts`, `scholarship/route.ts`, `activecampaign-webhook/route.ts`, `jtt-registration/route.ts`
- [ ] **3.3** Update `data/` tree:
  - Add: `leagues-2026.json`, `pricing-supplemental.json`, `private-rates.json`, `spring-summer-2026.json`, `year2026.json`
  - Keep: `winter2026.json`, `fall2025.json`, `pricing-2026.json`
  - Remove: `schedule-2026.json` from list (orphaned — will be deleted in Phase 4)
- [ ] **3.4** Update `lib/` tree:
  - Add: `programs-data.ts`, `camps-data.ts`, `junior-program-data.ts`, `webhook-tester.ts`
  - Keep: `activecampaign.ts`, `env.ts`, `validations.ts`, `rate-limit.ts`, `sanitize.ts`, `form-config.ts`, `form-analytics.ts`
  - Remove: `analytics.ts` from list if orphaned (verify in Phase 4)
- [ ] **3.5** Update `components/` tree:
  - Add: `schedules/` directory with tab components
  - Add: `HomeCTAForm.tsx`, `HomeHero.tsx`, `NewsletterForm.tsx`

---

### Phase 4: Orphan Cleanup

**Remove orphaned files that add confusion and dead weight.**

- [ ] **4.1** Delete orphaned data files:
  - `data/PERS_General_2025-12-16_winter2026.json`
  - `data/schedule-2026.json` (not imported by anything)
  - `data/pricing-2026.json` (not imported by anything)
- [ ] **4.2** Delete orphaned PERS_* lib files:
  - `lib/PERS_General_2025-12-16_form-config.ts`
  - `lib/PERS_General_2025-12-16_form-analytics.ts`
  - `lib/PERS_General_2025-12-16_webhook-tester.ts`
- [ ] **4.3** Delete orphaned PERS_* components:
  - `components/PERS_General_2025-12-16_AnalyticsDashboard.tsx`
  - `components/PERS_General_2025-12-16_ComprehensiveFormTester.tsx`
  - `components/PERS_General_2025-12-16_EmbeddedRegistrationPanel.tsx`
- [ ] **4.4** Archive remaining PERS_* files (layout, globals, CSS, page, API routes, docs):
  - Move to `archive/PERS_General_2025-12-16/` or delete if no longer needed
  - At minimum: delete `app/api/register-program/PERS_General_2025-12-16_route.ts` and `app/api/activecampaign-webhook/PERS_General_2025-12-16_route.ts` (orphaned API routes that could accidentally deploy)
- [ ] **4.5** Evaluate `lib/analytics.ts` — only referenced in GA4 plan doc. Keep if GA4 integration is planned; otherwise mark as planned/stub.
- [ ] **4.6** Verify `activecampaign-webhook/route.ts` uses `lib/env` for `AC_WEBHOOK_SECRET` instead of raw `process.env`

---

### Phase 5: Error State Token Standardization

**~25 raw Tailwind `text-red-*` / `bg-red-*` classes used for form errors. Not brand-critical but improves consistency.**

- [ ] **5.1** Define error tokens in `tailwind.config.ts` (if not already):
  - `brand.error` or `lbta.error`: `#DC2626` (red-600 equivalent)
  - `brand.error-light`: `#FEF2F2` (red-50 equivalent)
- [ ] **5.2** Replace in form components:
  - `components/TrialBookingModal.tsx` (5 occurrences)
  - `components/RegistrationModal.tsx` (3 occurrences)
  - `components/YearRegistrationModal.tsx` (9 occurrences)
  - `app/contact/page.tsx` (4 occurrences)
  - `components/HomeCTAForm.tsx` (1 occurrence)
  - `components/NewsletterForm.tsx` (1 occurrence)
- [ ] **5.3** Replace inline hex in `components/ui/FourLabs.tsx` with brand tokens or CSS vars
- [ ] **5.4** Skip `components/ui/Chatbot.tsx` inline hex — chatbot is a low-priority component with many inline styles; flag for future rewrite

---

### Phase 6: Data Verification

**Confirm Spring/Summer 2026 data accuracy against program overview.**

- [ ] **6.1** Verify phone number: HTML overview uses `(949) 534-0457`; .cursorrules uses `(949) 464-6645`. Confirm which is current with owner.
- [ ] **6.2** Verify `data/spring-summer-2026.json` coach list for Adult Beginner 2 (HTML lists Andrew Mateljan in addition to Peter and Robert)
- [ ] **6.3** Verify LiveBall Intermediate schedule (HTML shows Thu 6–7:30pm at Moulton Meadows + Sun 9–10am)

---

### Phase 7: Optional — API Integration Tests

**Non-blocking. Add when CI is set up.**

- [ ] **7.1** Create `lib/api-integration.test.ts` with MSW (or similar) mocking external services
- [ ] **7.2** Test happy path for: `/api/book`, `/api/newsletter`, `/api/register-program`
- [ ] **7.3** Test error paths: rate limiting returns 429, bad payload returns 400, missing env returns 503
- [ ] **7.4** Add to CI pipeline when available

---

## Files to Create/Modify

| File | Action | Phase | Purpose |
|------|--------|-------|---------|
| `app/apply-scholarship/page.tsx` | Modify | 1 | Replace lbta-burnt |
| `app/coaches/andrew-mateljan/page.tsx` | Modify | 1 | Replace lbta-burnt |
| `app/match-play/page.tsx` | Modify | 1 | Replace lbta-burnt |
| `components/ui/Chatbot.tsx` | Modify | 1 | Replace lbta-burnt |
| `app/faq/FAQInteractive.tsx` | Modify | 1 | Replace lbta-burnt |
| `app/pathway-planner/page.tsx` | Modify | 1 | Replace lbta-burnt |
| `components/ui/FourLabs.tsx` | Modify | 1,5 | Replace lbta-burnt + inline hex |
| `components/ui/BackToTop.tsx` | Modify | 1 | Replace lbta-burnt |
| `components/ui/TestimonialQuote.tsx` | Modify | 1 | Replace lbta-burnt |
| `components/ui/PartnershipSection.tsx` | Modify | 1 | Replace lbta-burnt |
| `tailwind.config.ts` | Modify | 1,5 | Remove burnt; add error tokens |
| `app/high-performance-pathway/page.tsx` | Create | 2 | Route rename |
| `app/elite-pathway/page.tsx` | Delete | 2 | Route rename |
| `next.config.js` | Modify | 2 | Add redirect |
| `app/sitemap.ts` | Modify | 2 | Update route |
| `README.md` | Modify | 2 | Update route table |
| `.cursorrules` | Modify | 3 | Part 13 sync |
| `data/PERS_General_2025-12-16_winter2026.json` | Delete | 4 | Orphan |
| `data/schedule-2026.json` | Delete | 4 | Orphan |
| `data/pricing-2026.json` | Delete | 4 | Orphan |
| 3 PERS_* lib files | Delete | 4 | Orphans |
| 3 PERS_* component files | Delete | 4 | Orphans |
| 2 PERS_* API route files | Delete | 4 | Orphan routes |
| `components/TrialBookingModal.tsx` | Modify | 5 | Error tokens |
| `components/RegistrationModal.tsx` | Modify | 5 | Error tokens |
| `components/YearRegistrationModal.tsx` | Modify | 5 | Error tokens |
| `app/contact/page.tsx` | Modify | 5 | Error tokens |
| `data/spring-summer-2026.json` | Verify | 6 | Data accuracy |

---

## Success Criteria

- [ ] Zero `lbta-burnt` in active app/ and components/ code
- [ ] No `/elite-pathway` route (renamed + redirect in place)
- [ ] `.cursorrules` Part 13 matches actual repo file structure
- [ ] No orphaned PERS_* files in lib/, components/, data/, or api/
- [ ] No orphaned data/*.json files
- [ ] Error states use defined brand tokens (not raw red-*)
- [ ] Spring/Summer 2026 data verified against program overview
- [ ] `npm run build` passes with 0 errors
- [ ] All existing 53 tests pass

---

## Execution Strategy

**Phases 1–4 are independent and can run in parallel via sub-agents:**

| Agent | Phases | Estimated Time |
|-------|--------|----------------|
| Agent A | Phase 1 (token replace) | 5 min |
| Agent B | Phase 2 (route rename) | 10 min |
| Agent C | Phase 3 (.cursorrules) | 10 min |
| Agent D | Phase 4 (orphan cleanup) | 5 min |

**Phases 5–6 run after, as they depend on the tailwind config changes in Phase 1.**

**Phase 7 is optional and non-blocking.**

**Total estimated time: 20–30 minutes with parallel execution.**

---

## Research Sources

- 3 parallel research agents (codebase, pattern/memory, data/API)
- `plans/CODE_REVIEW_SUMMARY_V2.md` (94/100)
- `plans/VALIDATE_SUMMARY_V2.md` (95/100)
- `COMPOUND_LEARN.md` and `plans/COMPOUND_LEARNINGS.md`
- `.cursorrules` (Parts 7, 12, 13, 14)
- `assets/other info_LBTA/LBTA_SP-SU26_Program_Overview.html`

---

## Relevant Learnings (from memory)

- Brand Kit tokens (`brand-*`) are preferred over legacy `lbta-*` tokens for new code
- `lbta-burnt` (#E8834A) = `brand-sunset-cliff` (#E8834A) — identical values
- Part 13 must match code after adding/removing files
- One `priority` per page; fill/priority images need `sizes`
- After feature removal: no orphan routes, layout branches, or CSS/JS

---

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| `lbta-burnt` removal breaks styling | Same hex value as `brand-sunset-cliff`; purely a rename |
| `/elite-pathway` external links break | Redirect preserves old URL |
| Deleting PERS_* files breaks something | Research confirmed all are orphaned; build verification after |
| Error token rename affects form UX | Visual-only change; same red color family |
| `pricing-2026.json` deletion | Confirmed not imported by any file |
