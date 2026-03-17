# Code Simplicity Review — Coach Hub

**Scope:** `components/coach-hub/`, `lib/coach-hub*.ts`

---

## Status: ⚠️ WARNINGS

No blocking issues; a few YAGNI and DRY improvements will reduce complexity and dead code.

---

## Findings

| Severity | Location | Issue | Recommendation |
|----------|----------|--------|----------------|
| **Low** | `CoachHubClient.tsx:63` | `reduceMotion` is computed but never used | Remove the variable (dead code). |
| **Low** | `CoachHubClient.tsx` | `config` / `setConfig` state lives in parent but is only used by `ProgramsTab` | Move `config` state into `ProgramsTab`; remove from `CoachHubClient` and drop from `ProgramsTab` props. Reduces parent state and prop drilling. |
| **Low** | `lib/coach-hub-auth-server.ts:9` | `COOKIE_MAX_AGE_MS` duplicated from `coach-hub-auth.ts` | Derive from existing API: `const exp = Date.now() + getCoachHubCookieMaxAge() * 1000` and delete local `COOKIE_MAX_AGE_MS`. |
| **Low** | `ProgramsTab.tsx:58–68` | `useEffect` syncs `selectedSlot` to schedule; `SD` re-derives “effective slot” with a long ternary | Prefer single source of truth: derive `effectiveSlot = selectedSlot && schedule.find(...) ? selectedSlot : schedule[0] ?? null` (e.g. `useMemo` or inline). Remove the `useEffect` and the eslint-disable. |
| **Low** | `ProgramsTab.tsx:68` | Long one-liner for `SD` hurts readability | Extract e.g. `getEffectiveSlot(selectedSlot, schedule): typeof schedule[0] \| null` and use it for `SD`. |
| **Info** | `lib/coach-hub-auth` vs `coach-hub-auth-server` | Split between two modules | **Justified.** Middleware runs on Edge (Web Crypto only); API route runs in Node (signing + Set-Cookie). Keep split; only remove duplicated `COOKIE_MAX_AGE_MS` in server. |
| **Info** | `components/coach-hub/` structure | Tabs and overlays | No redundant stub layers. Tabs are real UI; `index.ts` is a thin barrel. |

---

## Summary

- **Auth split:** `coach-hub-auth.ts` (Edge-safe verify) vs `coach-hub-auth-server.ts` (Node sign + cookie headers) is justified by runtime. No merge suggested.
- **Components:** No unnecessary abstractions or stub layers. Optional simplifications: drop unused `reduceMotion` in `CoachHubClient`, move `config` into `ProgramsTab`, and simplify `ProgramsTab` slot state by deriving effective slot and removing the sync effect.
- **DRY:** One constant duplication (`COOKIE_MAX_AGE_MS`) in auth-server; remove by using `getCoachHubCookieMaxAge() * 1000` for `exp`.
- **ProgramsTab:** State and helpers can be simplified by (1) deriving effective slot instead of syncing in `useEffect`, and (2) extracting `getEffectiveSlot` for clarity. No new features required.

**Estimated impact:** ~15–25 LOC removed or simplified; no behavior change. Complexity score: **Low**. Recommended action: **Minor tweaks** (optional cleanups when touching Coach Hub).
