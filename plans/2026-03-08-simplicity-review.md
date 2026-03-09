# LBTA Codebase — Simplicity Review (Code-Simplicity-Reviewer)

**Date:** 2026-03-08  
**Scope:** parseJsonBody usage, ExitIntentPopup focus trap, FAQSection reduced motion/ARIA, trust stats from site-stats  
**Verdict:** WARNINGS

---

## Status: **WARNINGS**

No critical overbuilding or unnecessary abstractions. A few minor inconsistencies and one optional hardening.

---

## Findings

| Area | Finding | Severity | Recommendation |
|------|---------|----------|-----------------|
| **parseJsonBody** | Thin, single-purpose helper in `lib/validations.ts`: wraps `request.json()`, returns `{ ok, data }` or `{ ok: false, status: 400 }` on `SyntaxError`. Used in 8 API routes (book, chat, jtt-registration, newsletter, register, register-program, register-year, scholarship). | OK | Keep as-is. Abstraction is minimal and avoids repeating try/catch in every route. |
| **parseJsonBody** | `app/api/activecampaign-webhook/route.ts` does not use `parseJsonBody`; it uses inline `try { body = await request.json() } catch { return 400 }` and then `validateRequest(webhookPayloadSchema, body)`. | WARN | For consistency, consider using `parseJsonBody` + `validateRequest` like other routes. Optional. |
| **ExitIntentPopup focus trap** | Manual focus trap: saves `document.activeElement`, focuses first focusable, Tab/Shift+Tab cycle, Escape closes, restores focus in `close()` and again in effect cleanup. No third-party focus-trap library. | OK | Implementation is minimal and correct. |
| **ExitIntentPopup focus trap** | Focus restore is duplicated (in `close()` and in the effect cleanup). Harmless. | WARN | Optional: restore only in `close()` and remove from cleanup to avoid double-call. |
| **ExitIntentPopup focus trap** | If `focusable.length === 0`, `first` is undefined and `first.focus()` would throw. Current UI always has at least close button + input + submit. | WARN | Optional hardening: `if (first) first.focus()`. |
| **FAQSection** | `useReducedMotion()` from Framer Motion used; when true, renders plain `<div>` with no `AnimatePresence`/motion. When false, uses `AnimatePresence` + `motion.div` with height/opacity. | OK | Reduced motion is correctly respected. |
| **FAQSection ARIA** | Button has `aria-expanded`, `aria-controls`, `id`; panel has `id={panelId}`, `role="region"`, `aria-labelledby={buttonId}`. | OK | ARIA usage is correct and minimal. |
| **Trust stats (site-stats)** | Single source: `data/site-stats.json` with `trustStats` (playersCount, yearsExperience, rating, reviewCount). Used in ExitIntentPopup, Header, success-stories, SEOSchemas, app/page. | OK | No overbuilding; single source is used consistently. |

---

## Summary

- **parseJsonBody:** Appropriate abstraction; one route (activecampaign-webhook) reimplements the same pattern instead of using it.
- **ExitIntentPopup:** Focus trap is minimal and correct; small redundancy on focus restore and theoretical edge case when no focusable elements.
- **FAQSection:** Reduced motion and ARIA are implemented correctly with no extra abstraction.
- **Trust stats:** Sourced from `site-stats.json` across the app; no duplication or unnecessary indirection.

No issues that require changes. Optional improvements: unify webhook on `parseJsonBody`, remove duplicate focus restore, and guard `first.focus()` when no focusables.

---

## Score: **88 / 100**

- **-5:** One API route not using shared `parseJsonBody` (inconsistency).
- **-4:** Redundant focus restore and missing guard in ExitIntentPopup (minor).
- **-3:** No other deductions; abstractions are lean and purposeful.

---

*Simplicity review complete. No blocking issues.*
