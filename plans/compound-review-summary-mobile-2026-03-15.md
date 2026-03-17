# Code Review Summary — Mobile Experience & Related Changes

**Date:** 2026-03-15  
**Scope:** Mobile improvement (Phases 2–4), API list IDs, coach-hub login redirect  
**Agents run:** Security Sentinel, Performance Oracle, Code Simplicity, Pattern Recognition, Architecture Strategist, Julik Frontend Races, CodeRabbit-style, Regression Hunter  

---

## Overall Score: 78/100

### By Category

| Category | Score | Status |
|----------|-------|--------|
| Security | 85 | ⚠️ (one fix applied) |
| Performance | 82 | ⚠️ |
| Simplicity | 95 | ✅ |
| Patterns | 80 | ⚠️ |
| Architecture | 82 | ⚠️ |
| Frontend / A11y | 70 | ⚠️ |
| Regressions | 88 | ✅ |

---

## Critical / High (addressed or must know)

### ✅ Addressed this session

1. **Security — coach-hub redirect path traversal**  
   **Location:** `app/coach-hub/login/page.tsx`  
   **Issue:** `safeRedirectTarget` allowed `?next=/coach-hub/../evil`; browser/router could resolve to `/evil`.  
   **Fix applied:** Use `new URL(path, 'http://localhost').pathname` as the resolved path; require `resolved.startsWith('/coach-hub')` and `!resolved.includes('..')`; return `resolved` instead of raw `path`.

2. **Frontend — ProgramCard scrollIntoView cleanup**  
   **Location:** `components/ProgramCard.tsx`  
   **Issue:** `setTimeout` for `scrollIntoView` had no cleanup; could run after collapse or unmount.  
   **Fix applied:** Store timeout id and return `() => clearTimeout(t)` from the effect.

### ✅ Fixed (2026-03-15) — single-expand / card view

3. **Multiple expanded ProgramCards → multiple fixed bars**  
   **Location:** `components/ProgramCard.tsx` (mobile sticky bar)  
   **Issue:** If the page lists several ProgramCards and more than one can be expanded, multiple `fixed bottom-0` bars stack; "Begin Registration" may open the wrong program.  
   **Fix applied:** ProgramCard controlled expand (`isExpanded` + `onToggle`). ProgramsSection List | Cards view; in Cards view only one card expands (single sticky bar). `#programs` uses `scroll-mt-32`.  
   **Recommendation (was):** Lift “expanded card id” to parent so only one card is expanded at a time, or render a single shared sticky bar keyed by the expanded program. Defer to product/UX.

---

## Warnings (should fix)

| Severity | Agent | Location | Issue | Recommendation |
|----------|--------|----------|--------|----------------|
| Medium | Julik | `LuxuryRegistrationModal.tsx` | Focus trap captures first/last nodes when `program` is set; when step/success changes, nodes unmount and refs are stale. | Re-run trap when `step` or `isSuccess` changes (add to effect deps and re-query focusables), or query on each Tab key. |
| Medium | Julik | `LuxuryRegistrationModal.tsx` | Success focus and focus trap can run in undefined order when transitioning to success. | Run success focus in a separate effect; use queueMicrotask or rAF so it runs after trap. |
| Medium | Julik | `app/contact/page.tsx` | 5s timeout to clear form on success has no cleanup; can setState after unmount if user navigates away. | Store timeout id in a ref and clear in effect cleanup. |
| Medium | Architecture | `components/LuxuryYearModal.tsx` | `console.log` in submit path runs in production. | Remove or guard with `process.env.NODE_ENV === 'development'`. |
| Low | Pattern | `TrialBookingModal.tsx` | Close button is 40×40px. | Add `min-w-[48px] min-h-[48px]` to meet .cursorrules. |
| Low | Pattern | `LuxuryRegistrationModal.tsx` | Plan selection buttons (step 1) have no explicit `min-h-[48px]`. | Add `min-h-[48px]` to plan option buttons. |
| Low | Regression | `ProgramCard.tsx` (mobile bar) | Register button has `min-w-0` only; with Inquire link can feel cramped at 320px. | Consider `min-w-[140px]` to align with ProgramRow. |
| Low | CodeRabbit | `lib/activecampaign.ts` | `getWebsiteSignupsListId()` could return `0` if env is `0`; may be invalid for AC. | Return `n > 0 ? n : null` after parsing. |
| Low | CodeRabbit | `ProgramCard.tsx` | Fixed mobile bar can cover last line of expanded content. | Add bottom padding (e.g. `pb-20`) to expanded content on mobile. |

---

## Suggestions (nice to have)

- **ProgramCard:** Use stable list key for schedule rows (e.g. `${slot.day}-${slot.time}`) instead of `key={index}`; optional `memo(ProgramCard)` if used in long lists.
- **Contact / modals:** Use functional updates for form state: `setFormData(prev => ({ ...prev, field: value }))` to avoid stale closures.
- **Contact / modals:** Prefer `focus-visible:ring-*` instead of `focus:ring-*` so rings show only for keyboard focus.
- **apply-scholarship:** Remove unused `Link` import if present; add `aria-label` to hero “Apply” CTA for screen readers.
- **validations:** Add `.max(31)` and string length cap to `preferredDays` in `programRegistrationSchema` to limit DoS surface.

---

## Positive findings

- **Security:** List IDs and `addToList` usage are server-controlled; no user input in redirect URLs beyond validated path; forms use Zod and rate limiting.
- **Performance:** ProgramRow/ProgramsSection use `useMemo`/`useCallback` and `min-w-0`/`break-words` appropriately; no N+1 in scope.
- **Simplicity:** Mobile changes are minimal and targeted; no YAGNI or new abstractions.
- **Patterns:** Contact, ProgramCard, adult page, and modals use `text-base`, 48px targets, and overflow fixes consistently where updated.
- **Architecture:** Client/server split and `getWebsiteSignupsListId()` usage are consistent; API routes use shared helper correctly.
- **Regressions:** No breaking changes or removed functionality; button/form/layout changes improve narrow viewports.

---

## Decision

- [x] **Ready to merge** after addressing critical/high (done: redirect + scroll cleanup).
- [x] **All optional warnings fixed** (2026-03-15): contact timeout cleanup, LuxuryYearModal console.log guard, TrialBookingModal close + error dismiss 48px, LuxuryRegistrationModal plan buttons 48px + focus trap deps + success queueMicrotask, ProgramCard min-w-[140px] + pb-20 + stable keys, getWebsiteSignupsListId n>0, apply-scholarship Link + aria-label, validations preferredDays .max(31)/.max(50). ScheduleCalendarView.tsx syntax (missing `}`) fixed so build passes.

---

## Commands run

- Security Sentinel, Performance Oracle, Code Simplicity Reviewer, Pattern Recognition Specialist (parallel).
- Architecture Strategist, Julik Frontend Races Reviewer, CodeRabbit-style reviewer, Regression Hunter (parallel).
- Two fixes applied: `safeRedirectTarget` path normalization, ProgramCard `useEffect` cleanup.
