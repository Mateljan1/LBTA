# LBTA Codebase Review — Race Conditions, Memory Leaks, Validation

**Scope:** `app/api` routes (parseJsonBody, register-year, webhook), `lib/validations.ts`, `components/ExitIntentPopup.tsx`, `components/FAQSection.tsx`  
**Method:** Static analysis (CodeRabbit CLI timed out)  
**Date:** 2026-03-08

---

## Status: **WARNINGS**

---

## Findings Table

| # | Category | Severity | Location | Finding |
|---|----------|----------|----------|--------|
| 1 | Race condition | Medium | `lib/rate-limit.ts` | `incr` + `expire` are two operations; under high concurrency the same key can be incremented by multiple requests before `expire` runs. First request sets TTL; subsequent requests in same tick may see `current === 1` only for the first. Actual risk is low (at most a slightly longer window), but a single Lua/atomic script would be more correct. |
| 2 | Memory leak | Low | `components/ExitIntentPopup.tsx` | Success timeout is cleared in `close()` and ref is nulled, but if the component unmounts while `isSuccess` is true and before the 3s timeout fires, the timeout is not cleared (no cleanup in a `useEffect` return that depends on `isVisible`/unmount). The scheduled `setIsVisible(false)` will run after unmount and call `setState` on an unmounted component. |
| 3 | Focus / timeout | Low | `components/ExitIntentPopup.tsx` | Focus trap effect cleanup calls `previousActiveRef.current?.focus()`. If the dialog is closed by the success timeout (auto-close after 3s), the cleanup of the *timer* does not run the focus-restore path; only the *keydown* effect cleanup does. So when auto-closing, focus may not return to the previously focused element. |
| 4 | Independent validation | Medium | `app/api/activecampaign-webhook/route.ts` | Webhook parses body with `request.json()` and then `validateRequest(webhookPayloadSchema, body)`. This is correct and independent of other routes. No use of `parseJsonBody` here—intentional (different error handling). Validation is applied consistently. **No issue**; noted for completeness. |
| 5 | Independent validation | Low | `app/api/newsletter/route.ts` | Newsletter schema only validates `email`. ExitIntentPopup sends `{ email, source, offer }`. Extra fields are ignored by Zod (no `.passthrough()` on `newsletterSchema`), so validation is strict and independent. **No issue.** |
| 6 | parseJsonBody usage | Info | All form API routes | All routes that need JSON use `parseJsonBody` then `validateRequest(schema, parsed.data)`. No double-read of `request.json()`; body is consumed once. **Good.** |
| 7 | Error handling | Low | `lib/validations.ts` | `parseJsonBody` rethrows non-SyntaxError (e.g. body size limit). Callers catch and return 500. Acceptable; consider mapping body-too-large to 413 if needed. |
| 8 | Race condition | Low | `app/api/register-year/route.ts` | Notion and ActiveCampaign are run sequentially; no shared in-memory state. `storeLead` is fire-and-forget (`void`). No race between handlers. **No issue.** |
| 9 | Webhook idempotency | Info | `app/api/activecampaign-webhook/route.ts` | Duplicate webhook deliveries can cause duplicate list/tag operations. ActiveCampaign is idempotent for “add to list” and “add tag”; at most redundant API calls. **Acceptable.** |
| 10 | FAQSection | Info | `components/FAQSection.tsx` | No timers, no refs, no async; single `openIndex` state. No race or memory leak. `useReducedMotion` used. **No issue.** |
| 11 | Stale closure | Low | `components/ExitIntentPopup.tsx` | Effect depends on `[hasShown]`. Handlers use `hasShown` from closure; after `setHasShown(true)` the listener still sees the old value until re-run. Because the effect removes listeners and re-adds only when `hasShown` is false, and `hasShown` is set true when showing, the next run has `hasShown === true` and no listeners are re-added. **Correct.** |
| 12 | Double body read | High (avoided) | `app/api/*` | No route calls both `parseJsonBody`/`request.json()` and then reads the body again. **Good.** |

---

## Summary

- **parseJsonBody / validation:** All form routes use `parseJsonBody` once then `validateRequest` with the right schema. Webhook uses its own `request.json()` + `validateRequest(webhookPayloadSchema, body)`. Validation is independent and consistent; no double body read.
- **Race conditions:** Rate limiter uses two KV operations (incr, expire); minor theoretical race. Register-year and webhook have no in-process races; webhook idempotency is acceptable.
- **Memory leaks / ExitIntentPopup:** Main risk is the success timeout (3s) not being cleared on unmount, and focus not restored when the dialog auto-closes via that timeout. Fix: clear `successTimeoutRef` in a cleanup effect on unmount, and run focus restore when clearing the success timeout.
- **FAQSection:** No issues found.

**Recommendations:**

1. **ExitIntentPopup:** In a `useEffect` cleanup (or an effect that runs on unmount), clear `successTimeoutRef.current` and null it. When the success timeout fires, before `setIsVisible(false)`, call `previousActiveRef.current?.focus()` so focus is restored on auto-close.
2. **Rate limit:** Optionally move to an atomic “incr + expire if 1” (e.g. Lua script or KV command that sets TTL only when key is new) to avoid any window edge case.
3. **Validations:** Keep current pattern; consider 413 for body-too-large in `parseJsonBody` or route-level catch if desired.

---

## Score: **78 / 100**

- **Deductions:** ExitIntentPopup unmount/cleanup and focus restore (-12); rate-limit atomicity (-5); minor error-handling and doc (-5).
- **Strengths:** Consistent validation, no double body read, clear separation of parse vs validate, webhook validation and auth in place, FAQSection and API structure are sound.
