# Code Review Summary — Phase 1 (LBTA Design Alignment)

**Scope:** `.cursorrules` + `components/layout/Header.tsx`  
**Date:** March 6, 2026

---

## Overall Score: **82/100**

---

## By Category

| Category              | Score | Status   |
|-----------------------|-------|----------|
| Security              | 95    | Pass     |
| Performance           | 85    | Pass     |
| Simplicity            | 80    | Warnings |
| Pattern / Consistency | 90    | Pass     |
| Architecture          | 75    | Warnings |
| Data Integrity        | 70    | Warnings |
| Test Coverage         | 60    | Warnings |
| Accessibility         | 85    | Pass     |
| Memory Compliance     | 65    | Issues   |
| API Design            | N/A   | —        |
| Documentation         | 85    | Pass     |
| Regression            | 85    | Pass     |

---

## Critical Issues (Must Fix)

1. **Memory Compliance — `app/globals.css`**  
   `.btn-primary` uses Sunset Cliff (#E8834A) as primary button fill. `.cursorrules` (CTA decision) requires primary CTAs to be black/white only; Sunset Cliff is for hover/accents only.  
   **Fix:** Change `.btn-primary` to black background (and optional hover to gray-800); keep Sunset Cliff only for hover or a separate utility if needed.

2. **Memory Compliance — `components/schedules/LeaguesSection.tsx`**  
   Hardcoded price string (e.g. "$48/year"). Project rule: no hardcoded prices; use `/data/*.json`.  
   **Fix:** Move value to a data file (e.g. `data/leagues-2026.json` or `pricing-supplemental.json`) and read from there.

3. **Memory Compliance — `components/SEOSchemas.tsx`**  
   Hardcoded price strings (e.g. "$100-250 per hour", "$25,000 annually").  
   **Fix:** Source from `/data/*.json` (or a shared schema/pricing module) and inject into schema.

---

## Warnings (Should Fix)

1. **Simplicity — `.cursorrules`**  
   Part 7 says "Buttons: Sunset Cliff primary"; Part 10 (CTA decision) says primary CTAs are black/white.  
   **Fix:** Align Part 7 with Part 10 (e.g. "Primary CTAs: black/white; Sunset Cliff for hover/accents only").

2. **Test Coverage**  
   No unit/integration/E2E tests for Header (nav, logo, a11y).  
   **Fix:** Add tests for navigation, logo render, and keyboard/focus behavior.

3. **Architecture**  
   Nav links duplicated in `Header.tsx` and `Footer.tsx`.  
   **Fix:** Introduce shared config (e.g. `data/nav.json` or `lib/nav-config.ts`) and consume in both.

4. **Regression Hunter**  
   Other Supabase logo URLs remain (e.g. in `SEOSchemas.tsx`, `app/page.tsx`, `app/beginner-program/page.tsx`, `app/junior-trial/page.tsx`).  
   **Fix:** Prefer local or single canonical URL for consistency and maintainability.

---

## Suggestions (Nice to Have)

1. **Performance:** Add `priority` to the header logo `Image` (above-the-fold) to help LCP.
2. **Data:** Consider moving the "500+ players trained" stat (mobile menu) to shared config or `/data` if you centralize marketing copy.
3. **Accessibility:** Apply Accessibility Auditor recommendations: `aria-hidden="true"` on "The Academy" span and Programs ChevronDown icon; ensure `min-h-[48px]` / `min-w-[48px]` on header interactive elements for touch targets.

---

## Decision

- [ ] **Ready to merge**  
- [x] **Needs fixes** (address critical issues above)  
- [ ] Needs discussion  

Address the three critical items (CTA/CSS, LeaguesSection, SEOSchemas) and optionally the warnings before treating the phase as complete.
