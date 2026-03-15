# Compound Review — Validation-fix changes (2026-03-14)

**Scope:** Blocker + warnings from compound:validate (form-config pricing from data, loading flash, API shapes, date/copy from data, Chatbot emoji).

**Agents run:** Security Sentinel, Data Integrity Guardian, Pattern/API, Code Simplicity, TypeScript/A11y, Architecture Strategist.

---

## Code Review Summary

### Overall Score: 88/100

### By Category

| Category            | Score | Status   |
|---------------------|-------|----------|
| Security            | 98    | ✅ PASS  |
| Data Integrity      | 92    | ✅ PASS  |
| Pattern / API       | 95    | ✅ PASS  |
| Simplicity          | 78    | ⚠️ WARNINGS |
| TypeScript / A11y   | 82    | ⚠️ WARNINGS |
| Architecture        | 85    | ⚠️ WARNINGS |

---

### Critical Issues (Must Fix)

**None.** No blockers identified.

---

### Warnings (Should Fix)

1. **Chatbot.tsx (A11y)** — Quick-reply and Send buttons lack visible focus ring; floating toggle icons (X, MessageCircle) not marked decorative. Add `focus:outline-none focus:ring-2 focus:ring-brand-sunset-cliff focus:ring-offset-2` to buttons; add `aria-hidden` to toggle icons; set Send to `type="button"`.
2. **siteCopy consumers (Simplicity)** — StickyCTA, beginner-program, camps each import full `pricing-supplemental.json` and use a type assertion for one `siteCopy` key. Centralize: one module (e.g. `lib/site-copy.ts`) that imports once, types `siteCopy`, and exports getters; have the three components use that.
3. **LeaguesData type (Architecture)** — `LeaguesData` is defined in SchedulesPageClient while server uses `LeaguesDataValidated` from Zod; cast `as unknown as LeaguesData` is brittle. Prefer a single source for the type (e.g. export from schema or shared types) so the cast is unnecessary.

---

### Suggestions (Nice to Have)

| Source        | Suggestion |
|---------------|------------|
| Security      | Add `.max(2000)` to chat `history[].content` and `.max(50)` to history array in validations for defense in depth. |
| Data Integrity | Add a test or build-time check that `getAllConfiguredPrograms()` keys match `Object.keys(registrationModalPricing)` to catch drift. |
| Data Integrity | Add Zod (or similar) for `pricing-supplemental.json` and parse once in a small lib; export typed `siteCopy` and use in form-config; fail fast on invalid keys. |
| Data Integrity | Consider a single default for siteCopy fallbacks (shared constant) so copy lives only in data + one fallback definition. |
| Pattern/API   | Document in a short API note that chat success uses `reply` (not `message`) for the assistant message. |
| Architecture  | Document that pricing-supplemental is the source for modal copy, site copy, and supplemental pricing. |
| Architecture  | Optional: rename `pricingSupplemental.leagues` (e.g. `leagueLandingCopy`) to distinguish from leagues-2026 league data. |

---

### Decision

- [x] **Ready to merge** — No critical issues; warnings are improvements, not blockers.
- [ ] Needs fixes (see critical issues)
- [ ] Needs discussion

---

## Agent summaries (excerpts)

- **Security:** Changes are secure; no secrets, no injection; optional hardening on chat body size.
- **Data Integrity:** Single source of truth in place for modal pricing, site copy, and UTR season label; minor risks around fallback duplication and lack of schema validation for pricing-supplemental.
- **Pattern/API:** Response shapes consistent; 429 for rate limit correct; ChatWidget compatible with success/error.
- **Simplicity:** form-config helper is fine; main simplification is centralizing siteCopy reading.
- **TypeScript/A11y:** Types and quick-reply a11y good; add focus rings and decorative aria-hidden on Chatbot.
- **Architecture:** Data flow coherent; leagues type duplication and cast are the main follow-ups.
