# Compound Engineering Review: 2026 Schedule Sync

**Scope:** 2026 program data (Winter, Spring-Summer, Fall) and schedule components.  
**Date:** March 12, 2026.

---

## Overall Score: 78/100

**Decision:** ✅ **Ready to merge** after addressing 1 critical display bug and 1–2 consistency fixes. No blockers for data correctness or security.

---

## By Category

| Category            | Score | Status |
|---------------------|-------|--------|
| Security            | 95    | ✅ PASS |
| Data Integrity      | 90    | ✅ PASS (minor consistency) |
| Pattern / Consistency | 75  | ⚠️ Fix 1 high, 2–3 medium |
| Simplicity          | 80    | ⚠️ Remove dead code, align sources |
| Performance         | 70    | ⚠️ Client bundle + single winter source |
| Architecture        | 85    | ⚠️ One boundary fix |

---

## Critical / High (Must Fix)

### 1. **ProgramRow `getPrice()` — Little Stars shows wrong price** [Pattern Recognizer]

- **Issue:** When a program has both `monthly` (e.g. 120) and `2x` (e.g. 200), logic uses only `seasonPrices = [200]` and shows “From $200/season” instead of “$120/mo”.
- **Location:** `components/schedules/ProgramRow.tsx` — `getPrice()`.
- **Fix:** Prefer monthly when it’s the primary/minimum: if `monthly != null` and (no season prices OR `monthly <= min(seasonPrices)`), return `{ amount: monthly, label: '/mo' }`; otherwise keep current season logic.

---

## Medium (Should Fix)

### 2. **ProgramsSection winter data source** [Performance, Architecture, Simplicity]

- **Issue:** Winter programs use direct `winter2026Data.programs`; other seasons use `programs-data` (`getSpringProgramsForDisplay`, etc.). Duplicate source and client bundle includes winter JSON twice.
- **Location:** `components/schedules/ProgramsSection.tsx`.
- **Fix:** Use `getWinter2026Programs()` from `@/lib/programs-data` for winter (and remove direct `winter2026.json` import from this component).

### 3. **Winter JSON — matchPlay / pricingNote and naming** [Data Integrity, Pattern]

- **Issue:** Winter `orange-ball` and `green-dot` have Friday Match Play only in `description`; no `pricingNote` or `matchPlay`. Fall and Spring-Summer use both. Winter adult-beginner-1/2 and adult-intermediate use slightly different titles/ages.
- **Location:** `data/winter2026.json`.
- **Fix:** Add `matchPlay: { "monthly": 65, "drop_in": 25 }` and `pricingNote: "Friday Match Play: $65/mo or $25/session."` to Winter orange-ball and green-dot. Align adult-beginner-1 (“Adult Beginner 1 — True Beginner”, ages “NTRP 1.0-2.0”), adult-beginner-2 (“Adult Beginner 2 — Bridge”), adult-intermediate (ages “NTRP 3.0-3.5”) with other seasons.

### 4. **Dead exports in programs-data** [Simplicity]

- **Issue:** `getSpringPrograms()` and `getSummerPrograms()` are never used; only `getSpringProgramsForDisplay` / `getSummerProgramsForDisplay` are used.
- **Location:** `lib/programs-data.ts`.
- **Fix:** Remove `getSpringPrograms` and `getSummerPrograms`.

---

## Warnings / Optional

| Item | Location | Recommendation |
|------|----------|----------------|
| Time string format | All JSON | Normalize to one style (e.g. "11:45 AM–12:45 PM"); low priority. |
| `pricingNote` / schedule `note` | Data + types | Either surface in UI (e.g. under price, or “Sat — Separate pricing”) or document as reserved; ensure `springSummerToProgram` passes through `pricingNote`/`matchPlay` if you add to Program type. |
| getPrice() 4x/5x | ProgramRow | Remove 4x/5x branch unless you add 4x/5x programs; simplifies code. |
| getPrice() saturday1x | ProgramRow | Decide whether “From $X” should include Saturday-only option; optional. |
| Server-side schedule data | ProgramsSection | For smaller client bundle, have schedules page (server) load programs and pass as props; optional refactor. |
| React.memo / useMemo for getPrice | ProgramRow | Optional; list is small (~15 rows). |

---

## What’s in Good Shape

- **Security:** No secrets, no injection/XSS in scope; program IDs in forms are length-limited and tag application is whitelist-based.
- **Data integrity:** Spring/Summer pricing complete; schedule arrays and IDs consistent; no duplicate IDs; numeric pricing valid.
- **Single source of truth:** Prices only in data files; no hardcoded prices in components.
- **Patterns:** Brand tokens, typography, spacing, and section structure match .cursorrules.
- **Architecture:** Clear data → loader → UI direction; no circular dependencies; only breach is winter bypassing programs-data.

---

## Recommended Order of Work

1. Fix **ProgramRow `getPrice()`** for monthly + 2x (Little Stars).
2. **ProgramsSection:** Use `getWinter2026Programs()` and drop direct winter JSON import.
3. **Winter JSON:** Add `matchPlay`/`pricingNote` to orange-ball and green-dot; align adult program names/ages.
4. **programs-data:** Remove `getSpringPrograms` and `getSummerPrograms`.
5. (Optional) Surface `pricingNote` and schedule `note` in UI; simplify getPrice 4x/5x; consider server-passed schedule data later.

---

## Agents Run

- Security Sentinel — PASS  
- Data Integrity Guardian — PASS (minor)  
- Pattern Recognition Specialist — Partial pass (1 high, several medium/low)  
- Code Simplicity Reviewer — Remove dead code, align sources, decide on optional keys  
- Performance Oracle — WARNINGS (client bundle, single winter source)  
- Architecture Strategist — One clear fix (winter via programs-data)
