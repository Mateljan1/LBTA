# Compound Learn — 2026-03-18 (Book / Thank-you Review+Validate)

**Source:** Review (2026-03-16 summary) + Validate (5 agents, 2026-03-18)  
**Scope:** Private lesson booking, book API, thank-you page (Next 16 searchParams, focus ring, brand tokens).

---

## Summary

- **Review:** 82/100 — no critical; 2 high (API validation error verbatim, modal success focus), 14 warnings.
- **Validate:** 88/100 — blockers fixed (thank-you async searchParams, thank-you focus ring + brand tokens).
- **Learnings:** 4 new corrections, 3 new anti-patterns, 2 new patterns, 4 new quality bars.

---

## CORRECTIONS (added to corrections.jsonl)

| Original | Correction |
|----------|------------|
| Form API 400 returns raw validation.error to client | Return generic message; log server-side only. |
| Modal success view does not move focus to first focusable | Focus first focusable (e.g. close button) when isSuccess(true). |
| Thank-you page focusable links without visible focus ring | Add focus:ring-2 focus:ring-brand-victoria-cove (or ring-white on dark) to every link. |
| Thank-you step styling with raw blue (blue-600, blue-100) | Use brand tokens (brand-victoria-cove, bg-brand-victoria-cove/10). |

---

## ANTI-PATTERNS (added to anti-patterns.json)

- **api-400-raw-validation-error** — Do not return raw Zod validation.error in 400; log server-side, return generic or sanitized.
- **thank-you-links-no-focus-ring** — Thank-you/confirmation pages: all focusable links must have visible focus ring.
- **confirmation-page-raw-blue** — Thank-you/confirmation steps: use brand tokens, not raw blue.

---

## PATTERNS (added to patterns.json)

- **next15-page-searchparams-async** — Next 15+ page: async component, searchParams as Promise, await before use.
- **thank-you-all-links-focus-ring** — Thank-you/confirmation: every link has focus ring; step accents use brand tokens.

---

## QUALITY BARS (added to quality-bars.json)

- **apiValidationErrorGeneric** (must) — Form/booking API 400 must not return raw validation.error; log server-side, return generic or sanitized.
- **modalSuccessViewFocus** (must) — When modal shows success view, move focus to first focusable in that view.
- **thankYouPageFocusRing** (must) — Thank-you/confirmation pages: visible focus ring on all focusable links.
- **pageSearchParamsAsyncNext15** (must) — Next 15+: searchParams/params are Promise; async page, await before use.

---

## Still to do (from review)

- **High:** Book API — return generic 400 message instead of validation.error; log error server-side.
- **High:** PrivateLessonModal — on success, focus first focusable in success view (e.g. close button).
