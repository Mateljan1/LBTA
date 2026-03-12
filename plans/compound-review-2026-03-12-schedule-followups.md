# Compound Review: Schedule Follow-ups (Leagues, Zod, ProgramRow memo)

**Date:** 2026-03-12  
**Scope:** Leagues server load, Zod validation (year2026 + programs + leagues), React.memo(ProgramRow) + useMemo(getPrice)

---

## Review Summary

| Agent | Status | Notes |
|-------|--------|--------|
| **Security Sentinel** | ⚠️ WARNINGS | Leagues not validated (fixed: added parseLeagues). programSchema.passthrough() documented. |
| **Performance Oracle** | ✅ PASS | Leagues off client bundle; memo/useMemo correct; Zod server-only. |
| **Code Simplicity** | ✅ Good | Simplified year2026: parseYear2026Sections(year2026Data) directly; added parseLeagues for consistency. |

## Fixes Applied

1. **year2026** — Parse `year2026Data` directly: `parseYear2026Sections(year2026Data) as Year2026Sections` (no intermediate year2026Raw).
2. **Leagues validation** — Added `leaguesDataSchema` and `parseLeagues()` in `lib/schedule-schemas.ts`; page uses `parseLeagues(leaguesData)` so malformed leagues JSON fails at build/render.
3. **Lint** — ProgramRow useMemo: destructure pricing primitives; eslint-disable-next-line for exhaustive-deps with comment (intentional primitive deps only).

## Validation

- Build: ✅
- Lint: ✅ (0 errors, 0 warnings)
- Functional: Schedules page loads; programs, year2026, and leagues validated at server boundary.

## Decision

✅ Ready to merge and deploy.
