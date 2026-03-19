# Code Review Summary — Header contrast + `next/image` logos

**Scope:** `components/layout/Header.tsx`, `next.config.js`, `docs/solutions/ui-bugs/header-nav-low-contrast-over-hero.md`  
**Out of scope (this review):** Uncommitted `CourtFlyer.tsx`, `flyer-config.ts`, flyer scripts, `docs/court-flyer-print-template.md` (separate feature)  
**Date:** March 2026

---

## Overall Score: 93/100

**Decision:** Ready to merge

---

## By Category

| Category | Score | Status |
|----------|-------|--------|
| Scope Compliance | 100 | ✅ Targeted a11y + image config + solution doc |
| Security Sentinel | 98 | ✅ No new attack surface; `localPatterns` is allowlist only |
| Performance Oracle | 95 | ✅ No new requests; solid header removes blur compositing cost |
| Simplicity Reviewer | 92 | ✅ Minimal diff; inline comment in JSX is slightly long |
| Pattern Recognizer | 96 | ✅ Uses existing brand tokens (`brand-morning-light`, `brand-pacific-dusk`) |
| Architecture Strategist | 95 | ✅ Config + presentation separation clear |
| Data Integrity Guardian | N/A | — |
| Test Coverage Analyst | 88 | ⚠️ No automated visual/a11y test; manual check recommended |
| Accessibility Auditor | 96 | ✅ Fixes composited contrast failure; border aids separation |
| Memory Compliance | 98 | ✅ Aligns with .cursorrules WCAG + local `/logos/` usage |
| API Design Reviewer | N/A | — |
| Documentation Checker | 94 | ✅ Solution doc + next.config comment explain root cause |
| Regression Hunter | 92 | ⚠️ See “Other paths” below |
| CodeRabbit (synthetic) | 93 | ✅ No race/thread issues in static changes |

---

## Top Must Fix

**None.** No blockers for merge of Header + `next.config.js` + solution doc.

---

## Top Should Fix / Notes

| Priority | Finding | Recommendation |
|----------|---------|----------------|
| 1 | **Other static assets under `public/`** | If anything else uses `next/image` with paths outside `/images/**` and `/logos/**`, add a `localPatterns` entry or switch to `<img>` / import. Grep for `src="/` in `Image` components periodically. |
| 2 | **JSX block comment** | The multi-line `/* ... */` inside `className` template is valid but uncommon; optional move to a line comment above the `<header>` or a small `const headerSurfaceClass = ...` for readability. |
| 3 | **Visual regression** | Solid bar is a deliberate look change vs glass; spot-check homepage + inner pages (light heroes) for brand acceptance. |

---

## Critical Issues

**None.**

---

## Structured Output (gates)

```json
{
  "overallScore": 93,
  "byCategory": {
    "scopeCompliance": 100,
    "security": 98,
    "performance": 95,
    "simplicity": 92,
    "pattern": 96,
    "architecture": 95,
    "testCoverage": 88,
    "accessibility": 96,
    "memoryCompliance": 98,
    "documentation": 94,
    "regression": 92
  },
  "criticalCount": 0,
  "warningCount": 3,
  "decision": "ready",
  "criticalFindings": [],
  "topMustFix": [],
  "topShouldFix": [
    "Audit next/image src paths vs localPatterns",
    "Optional: refactor header className comment",
    "Manual visual check homepage + inner pages"
  ]
}
```

---

## Summary

**Header:** Opaque `bg-brand-morning-light` fixes WCAG contrast for `text-brand-pacific-dusk` links when the fixed bar sits over the dark video hero. Subtle `border-b` preserves separation without reintroducing transparency issues.

**next.config.js:** Adding `{ pathname: '/logos/**' }` to `images.localPatterns` is the correct Next.js 16 fix for `INVALID_IMAGE_OPTIMIZE_REQUEST` on `/logos/*` assets.

**Docs:** `docs/solutions/ui-bugs/header-nav-low-contrast-over-hero.md` compounds institutional knowledge (symptom, root cause, prevention).

**Ship when ready:** Commit scoped files; run `npm run build` + quick homepage visual check; deploy.
