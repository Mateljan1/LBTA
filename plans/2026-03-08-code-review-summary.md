# Code Review Summary — 2026-03-08

## Overall Score: 82/100

## By Category

| Category | Score | Status |
|----------|-------|--------|
| Security Sentinel | 82 | ⚠️ |
| Performance Oracle | 85 | ⚠️ |
| Simplicity Reviewer | 88 | ✅ |
| Pattern Recognizer | 84 | ⚠️ |
| Architecture Strategist | 88 | ✅ |
| Data Integrity Guardian | 88 | ✅ |
| Test Coverage Analyst | 62 | ⚠️ |
| Accessibility Auditor | 88 | ✅ |
| Memory Compliance | 78 | ⚠️ |
| API Design Reviewer | 82 | ⚠️ |
| Documentation Checker | 78 | ⚠️ |
| Regression Hunter | 88 | ✅ |
| CodeRabbit External | 78 | ⚠️ |

---

## Critical Issues (Must Fix)

*None.* All agents reported WARNINGS or PASS only.

---

## Warnings (Should Fix)

### Security
- Webhook secret accepted via query param; prefer header-only in production; add rate limiting on webhook.
- Optional: body size limit (e.g. 100–200 KB) for JSON routes; sanitize/escape FAQ if using `dangerouslySetInnerHTML`.

### API & consistency
- Use shared `parseJsonBody` in `app/api/activecampaign-webhook/route.ts` (currently inline `request.json()` try/catch).
- In `register-year`: validate `contactId` as positive integer; consider using shared `upsertContact`/`addToList`/`addTag` from `@/lib/activecampaign`.
- Webhook: replace `any` with minimal types for AC response handlers.

### ExitIntentPopup (CodeRabbit / Simplicity)
- Clear `successTimeoutRef` in effect cleanup on unmount to avoid setState after unmount.
- When success timeout fires, restore focus before closing (e.g. `previousActiveRef.current?.focus()` then `setIsVisible(false)`).
- Optional: guard `first.focus()` when no focusable elements; consider restoring focus only in `close()`.

### Accessibility
- **FAQInteractive** (`app/faq/FAQInteractive.tsx`): add `aria-expanded`, `aria-controls`, panel `id`, and `useReducedMotion()`.
- **LuxuryRegistrationModal**: increase close button to at least 48×48px.
- Footer: verify contrast for `text-white/30`–`text-white/50` on deep-water; increase opacity or limit to labels for WCAG AAA.

### Conventions (.cursorrules)
- Primary CTAs: many page-level hero CTAs use `bg-brand-sunset-cliff`; align with black/white or `btn-primary` for full compliance.
- JTT registration email: Arial in HTML; consider `sans-serif` or brand stack.

### Data & docs
- Document or align FAQ page visible content vs schema (faq.json).
- Optional: add Zod or type guard for `faq.json`; document form-config pricing as second source.
- register-year: when AC contact create throws, consider 503 or `acSynced: false` instead of 200.

### Tests
- Add unit tests for `parseJsonBody` (invalid JSON → 400, valid → data).
- Add route export tests for `/api/chat` and `/api/activecampaign-webhook`.
- Add schema tests for `chatSchema` and `webhookPayloadSchema`.
- Optional: integration test for one route (invalid body → 400).

### Regression / dead code
- LuxuryYearModal: show `result.error` when present (not only `result.message`).
- Remove or use `SEOSchemas.OrganizationSchema` (currently unused).

### Performance
- Webhook: run 4 AC GETs as 2 parallel pairs to save a round-trip.

### Rate limit
- Optional: use atomic incr+TTL (e.g. Lua) in `lib/rate-limit.ts` for strict correctness under concurrency.

---

## Suggestions (Nice to Have)

- Shared types for FAQ and pricing JSON; replace `as Array<...>` / `as { ... }` in components.
- File or POST JSDoc on register, newsletter, scholarship, register-program, jtt-registration.
- Brief JSDoc on key components (modals, schedule sections, ProgramOverviewCard).
- JSDoc for generic `T` in `validateRequest<T>`.
- Map body-too-large to 413 in validations.

---

## Decision

- [x] **Ready to merge** (no critical issues)
- [ ] Needs fixes (see critical issues)
- [ ] Needs discussion

Proceed to validation; address warnings as follow-up.
