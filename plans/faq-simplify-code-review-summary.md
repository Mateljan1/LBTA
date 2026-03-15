# FAQ Simplify — Code Review Summary

**Review date:** 2026-03-13  
**Scope:** `data/faq.json`, `components/FAQSection.tsx`, `app/faq/FAQInteractive.tsx`

---

## Overall Score: 78/100

No critical security or data-integrity issues. **Two high-severity behavior/a11y bugs** and several warnings should be addressed before or shortly after merge.

---

## By Reviewer

| Reviewer | Status | Summary |
|----------|--------|---------|
| Security Sentinel | ⚠️ WARNINGS | JSON-LD via `dangerouslySetInnerHTML` is low risk with repo-only data; optional sanitize for defense-in-depth. |
| Performance Oracle | ⚠️ WARNINGS | `categories` / `categoryFaqs` and `faqs.indexOf(faq)` on every render; recommend `useMemo` and precomputed globalIndex. |
| Code Simplicity | ⚠️ WARNINGS | Use Framer `useReducedMotion`, drop `useCallback` on tab handler, remove `AnimatedSection` around sr-only heading. |
| Pattern Recognition | ✅ Aligned | Consistent with codebase; optional shared FAQ type and Framer `useReducedMotion`. |
| Architecture Strategist | ✅ Compliant | Single source of truth and boundaries correct; optional shared type and schema helper. |
| Data Integrity Guardian | ✅ PASS | Single source, schema full list, `featured` backward compatible. |
| TypeScript/React (Kieran) | ⚠️ WARNINGS | Guard empty categories; accordion panel DOM/aria-controls; `type="button"`; FAQSection `min-h-[48px]`. |
| CodeRabbit | ❌ ISSUES | **Stale accordion on tab switch**; **focus not following tab selection**; empty-state guard; optional fixes. |

---

## Critical / High (Must Fix)

### 1. Stale accordion state when switching category tabs — FAQInteractive.tsx  
**Source:** CodeRabbit  

`openIndex` is a global index into `faqs`. When the user changes category, the visible list becomes `categoryFaqs` but `openIndex` is not reset. This can show the wrong FAQ expanded in the new category or confusing reopen behavior when switching back.

**Fix:** Reset accordion when category changes:

```ts
useEffect(() => {
  setOpenIndex(null)
}, [selectedCategoryIndex])
```

---

### 2. Keyboard focus does not follow tab selection — FAQInteractive.tsx  
**Source:** CodeRabbit, Kieran (a11y)  

Arrow keys update `selectedCategoryIndex` but focus stays on the current tab. WCAG 2.1 expects focus to move to the selected tab.

**Fix:** When `selectedCategoryIndex` changes (especially from keyboard), move focus to the tab at that index, e.g. in a `useEffect` that runs when `selectedCategoryIndex` changes and calls `document.getElementById(\`faq-tab-${selectedCategoryIndex}\`)?.focus()` or equivalent via refs.

---

## Warnings (Should Fix)

| # | Location | Issue | Recommendation |
|---|----------|--------|----------------|
| 3 | FAQInteractive.tsx | Empty `faqs` → `categories[0]` and `activeCategory` undefined; `handleTabKeyDown(..., 0)` can set index -1 | If `categories.length === 0`, render empty state and skip tablist; in `handleTabKeyDown` return early when `numTabs <= 0`. |
| 4 | FAQSection.tsx | Accordion trigger button missing `min-h-[48px]` | Add `min-h-[48px]` to the FAQ accordion button (cursor rules: 48×48px touch targets). |
| 5 | FAQInteractive.tsx, FAQSection.tsx | Buttons lack `type="button"` | Add `type="button"` to tab and accordion buttons to avoid accidental submit if ever inside a form. |
| 6 | FAQInteractive.tsx | `categories` and `categoryFaqs` recomputed every render; `faqs.indexOf(faq)` O(n) inside map | Use `useMemo` for `categories` and `categoryFaqs`; precompute globalIndex (e.g. map by `faq.id`) and use in render. |
| 7 | FAQSection.tsx | Contact CTA uses `<a href="/contact">` | Prefer `<Link href="/contact">` for in-app navigation. |
| 8 | FAQInteractive.tsx | Custom `useReducedMotion`; FAQSection uses Framer’s | Use `useReducedMotion` from `framer-motion` in FAQInteractive and remove custom hook. |
| 9 | FAQInteractive.tsx | Accordion panel unmounted when closed → `aria-controls` can point to missing ID | Optional: keep panel in DOM and hide (e.g. `hidden` or `aria-hidden` + CSS) so control relationship stays valid. |

---

## Suggestions (Nice to Have)

| # | Item |
|---|------|
| 1 | **Schema/JSON-LD:** Sanitize or safe-encode question/answer before `JSON.stringify` in FAQSection to avoid theoretical `</script>` break-out (data is repo-only; defense-in-depth). |
| 2 | **Simplicity:** Remove `useCallback` from `handleTabKeyDown` (no memoized children); use plain function. |
| 3 | **Simplicity:** Remove `AnimatedSection` wrapper around the sr-only `<h2>` in the tab panel. |
| 4 | **displayFaqs:** Single pass: `const featured = faqs.filter(f => f.featured); const displayFaqs = featured.length > 0 ? featured : faqs.slice(0, 6);` |
| 5 | **Types:** Shared FAQ type (e.g. `types/faq.ts` or inferred from data) for FAQSection and FAQInteractive. |
| 6 | **A11y:** Optional `aria-live="polite"` on tab panel; optional `aria-label="View all FAQs"` on the link. |
| 7 | **Phone link:** Use `tel:+19495340457` and keep `aria-label="Call (949) 534-0457"` for consistency. |

---

## Decision

- [x] **Ready to merge** — **#1** (accordion reset) and **#2** (focus follows tab) fixed; empty-state guard and `type="button"` / `min-h-[48px]` applied.
- [ ] **Needs fixes** — none remaining for merge.
- [ ] **Needs discussion** — none.

### Fixes applied (post-review)

- **#1** — `useEffect(() => setOpenIndex(null), [safeCategoryIndex])` so accordion resets when category changes.
- **#2** — `useEffect` on `safeCategoryIndex` focuses the active tab (ref or `getElementById`); tab buttons have refs.
- **#3** — Empty-state guard: when `categories.length === 0`, render "No FAQs available yet." and skip tablist; `handleTabKeyDown` returns when `numTabs <= 0`; `safeCategoryIndex = Math.min(selectedCategoryIndex, categories.length - 1)` and `activeCategory`/`categoryFaqs` derived safely.
- **#4** — FAQSection accordion button: added `min-h-[48px]` and `type="button"`.
- **#5** — FAQInteractive tab buttons: added `type="button"`.

---

## Positive Notes

- Single source of truth (`data/faq.json`) and schema (full list) preserved; `featured` is backward compatible.
- Tab pattern is correct: `role="tablist"`, `role="tab"`, `aria-selected`, `aria-controls`, `tabIndex`, Arrow/Home/End.
- Tab panel has correct `role="tabpanel"` and `aria-labelledby`.
- Touch targets and focus-visible rings in place on FAQInteractive; Data Integrity and Architecture pass.
