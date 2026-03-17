# Coach Hub — Compound Review + Validate (2026-03-17)

**Scope**: Coach Hub optional-item fixes (rate-limit fail-open doc, signature timing, config→ProgramsTab, getEffectiveSlot, logout rate limit, CoachHubInitialData/types, overlay a11y, tab ARIA, touch targets).  
**Agents**: Security Sentinel, Performance Oracle, Code Simplicity, Pattern Recognition, Architecture Strategist, Data Integrity Guardian (6 parallel).  
**Validation**: Lint, production build.

---

## Review Summary

### Overall Score: **88/100**

**Decision**: ✅ **Ready to merge** — all agents PASS or minor recommendations; optional fixes applied.

### By Category

| Category | Score | Status |
|----------|-------|--------|
| Security | 95 | ✅ PASS |
| Performance | 90 | ✅ Good |
| Simplicity | 88 | ✅ Good (one YAGNI note: playerLevels unused) |
| Pattern consistency | 85 | ✅ Fixed (logout 429 headers added) |
| Architecture | 90 | ✅ Good |
| Data integrity | 92 | ✅ PASS (BinderOverlay cast removed; getAssessMode typed) |

---

### Critical Issues (Must Fix)

*None.*

### Warnings Addressed

| # | Agent | Finding | Resolution |
|---|-------|--------|------------|
| 1 | Pattern | Logout 429 missing `X-RateLimit-Remaining` / `X-RateLimit-Reset` | Added; logout POST now captures `resetTime` from rateLimit result and sets both headers on 429. |
| 2 | Data Integrity | BinderOverlay redundant cast; getAssessMode inline type | `lib/coach-hub-utils.ts` now uses `AssessmentCalendar | undefined`; BinderOverlay calls `getAssessMode(week, hubData.assessment_calendar)` without cast. |

### Suggestions (Optional / Deferred)

| # | Agent | Suggestion |
|---|-------|------------|
| 1 | Security | Add `X-RateLimit-Remaining` / `X-RateLimit-Reset` to logout 429 — **done**. |
| 2 | Simplicity | Remove unused `playerLevels` from ProgramsTab config type — optional; kept for possible future use. |
| 3 | Performance | `toggleEq` useCallback deps could be `[]` — optional. |
| 4 | Architecture | Sign-out is GET (unrate-limited); POST is rate-limited but unused — document or switch to POST later. |
| 5 | Architecture | Prefer importing `CoachHubInitialData` from `@/lib/coach-hub-types` everywhere; re-export from CoachHubClient is redundant but harmless. |

---

## Validation Summary

### Overall: **100/100**

| Check | Result |
|-------|--------|
| **Lint** | ✅ Pass (no errors) |
| **Build** | ✅ Pass (Next.js 16.1.1, TypeScript clean) |
| **Auth script** | Run manually: `node scripts/verify-coach-hub-auth.mjs` (requires env). |

### Functional / API

- Coach Hub auth: timing-safe compare, fail-open documented, 429 message and headers consistent.
- Logout: GET clears cookie and redirects; POST rate-limited, fail-open, 429 includes rate-limit headers.
- Edge verify: constant-time signature compare over `maxLen` then length check.

---

## Fixes Applied This Run

1. **Logout 429 headers**: `app/api/coach-hub/logout/route.ts` — capture `resetTime` from rateLimit result; on 429 return `X-RateLimit-Remaining: '0'` and `X-RateLimit-Reset`.
2. **getAssessMode type**: `lib/coach-hub-utils.ts` — second parameter typed as `AssessmentCalendar | undefined` (import from coach-hub-types).
3. **BinderOverlay**: Removed cast; `getAssessMode(week, hubData.assessment_calendar)`.

---

## Agent Summaries (Condensed)

- **Security Sentinel**: Auth/logout and Edge verify reviewed; no vulnerabilities; fail-open and timing-safe behavior confirmed.
- **Performance Oracle**: Config local to ProgramsTab reduces re-renders; getEffectiveSlot and weekOptions useMemo are appropriate; no N+1 or bundle impact.
- **Code Simplicity**: Config colocated, getEffectiveSlot single-purpose, single CoachHubInitialData contract; optional cleanup of unused `playerLevels`.
- **Pattern Recognition**: Rate-limit fail-open and 429 copy consistent; 429 headers aligned with auth after fix; overlay and tab ARIA and touch targets match codebase.
- **Architecture Strategist**: Single initial-data contract; config state correctly in ProgramsTab; auth and logout both use RATE_LIMITS.sensitive where applicable; GET logout intentionally unrate-limited.
- **Data Integrity Guardian**: Types and hub JSON shape consistent; getAssessMode and BinderOverlay updated for single source of truth.
