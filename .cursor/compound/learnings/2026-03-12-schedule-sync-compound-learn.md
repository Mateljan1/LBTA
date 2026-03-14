# Compound Learn: 2026 Schedule Sync + Review

**Date:** 2026-03-12  
**Scope:** 2026 program data (Winter, Spring-Summer, Fall) aligned to DOCX; compound review; fixes applied.

---

## CORRECTIONS (what was wrong → what to do instead)

| Original | Correction |
|----------|------------|
| ProgramRow `getPrice()` when program has both `monthly` and `2x`: showed "From $200/season" (min of season prices) instead of "$120/mo" | Prefer monthly when it's the primary: if `monthly != null` and (no season prices OR `monthly <= min(seasonPrices)`), return `{ amount: monthly, label: '/mo' }`; otherwise use season logic. Remove unused 4x/5x branches. |
| ProgramsSection importing `winter2026.json` directly and using `winter2026Data.programs` for winter | Use `getWinter2026Programs()` from `@/lib/programs-data` for winter (and default); remove direct JSON import. Single entry point for all season program lists. |
| Dead exports `getSpringPrograms()` and `getSummerPrograms()` in lib/programs-data.ts | Remove them; only `getSpringProgramsForDisplay` and `getSummerProgramsForDisplay` are used. |
| Winter orange-ball / green-dot: Friday Match Play only in description; no `matchPlay` or `pricingNote` | Add `matchPlay: { "monthly": 65, "drop_in": 25 }` and `pricingNote: "Friday Match Play: $65/mo or $25/session."`; keep description without duplicate sentence. Same shape as Spring-Summer and Fall. |
| Winter adult-beginner-1/2 and adult-intermediate: different program names or ages than other seasons | Align: "Adult Beginner 1 — True Beginner", ages "NTRP 1.0-2.0"; "Adult Beginner 2 — Bridge"; adult-intermediate ages "NTRP 3.0-3.5". |

---

## PATTERNS

| Pattern | When to use | Example |
|--------|-------------|---------|
| **schedule-data-single-entry** | Schedules page or any component that needs seasonal program lists | All seasons (winter, spring, summer, fall) loaded via `programs-data` getters (`getWinter2026Programs`, `getSpringProgramsForDisplay`, etc.); no component imports `data/winter2026.json` or other season JSON directly. |
| **program-price-display-monthly-primary** | Component that shows a single "from" price when program has both monthly and session (1x/2x/3x) pricing | If `monthly` exists and is ≤ min of session prices (or no session prices), display monthly first (e.g. "$120/mo"); otherwise show min session price with "From" when multiple tiers. |
| **program-data-shape-consistent-seasons** | Adding or editing program entries in season JSON files | Use same optional keys across seasons: `matchPlay`, `pricingNote` where applicable; same program display name and ages band (e.g. "Adult Beginner 1 — True Beginner", "NTRP 1.0-2.0") so UI and future tooling see one shape. |

---

## ANTI-PATTERNS

| Id | Description | Avoid | Instead |
|----|-------------|-------|---------|
| **direct-import-season-json-in-client** | Client component imports a season data file (e.g. winter2026.json) when lib provides a getter | `import winter2026Data from '@/data/winter2026.json'` in a 'use client' component; using `winter2026Data.programs` | Import from `@/lib/programs-data` and use `getWinter2026Programs()` (or equivalent); keeps single entry point and avoids duplicating JSON in bundle. |
| **getPrice-ignore-monthly-with-season-prices** | Price display logic uses only session prices (1x/2x/3x) when program also has `monthly` | Building `seasonPrices = [oneX, twoX, threeX]` and returning min of those without checking if `monthly` is the primary or lower | If `monthly != null` and (no session prices OR monthly ≤ min(sessionPrices)), return monthly with label '/mo'; else use session logic. |
| **dead-exports-in-data-lib** | Lib that re-exports or transforms data has exports that are never used | `getSpringPrograms()` and `getSummerPrograms()` in programs-data.ts when only `*ForDisplay` variants are used | Remove unused exports; grep for usages before adding; keep only one way to get "programs for UI" per season. |
| **program-copy-inconsistent-across-seasons** | Same program (e.g. adult-beginner-1) has different display name or ages in different season files | Winter: "Adult Beginner 1", ages "True Beginner"; Spring-Summer: "Adult Beginner 1 — True Beginner", "NTRP 1.0-2.0" | Use identical program name and ages string across winter, spring-summer, fall JSON so UI and data consumers see consistent copy. |

---

## QUALITY BARS (new)

| Key | Rule | Enforcement |
|-----|------|-------------|
| **scheduleDataViaProgramsData** | Schedule program lists must be loaded via lib/programs-data getters (getWinter2026Programs, getSpringProgramsForDisplay, etc.); no component may import season JSON (winter2026, spring-summer-2026, fall2026) directly for program list. | should |
| **programPriceDisplayMonthlyPreferred** | When a program has both `pricing.monthly` and session tiers (1x/2x/3x), the displayed "from" price must prefer monthly when monthly is the minimum or the primary billing (e.g. Little Stars: show $120/mo, not From $200/season). | must |

---

## REVIEW ARTIFACTS TO REUSE

- **Compound review plan:** `plans/compound-review-2026-schedule-sync.md` — overall score, by category, critical/medium fixes, optional follow-ups.
- **Canonical schedules:** DOCX files (e.g. `LBTA_Winter2026_Program_Overview.docx`) are the source of truth for 2026; align JSON to DOCX (times, locations, coaches, pricing, program names).

---

## OPTIONAL FOLLOW-UPS (not required for merge)

- Surface `pricingNote` and schedule slot `note` (e.g. "Separate pricing") in ProgramRow/ProgramCard.
- Normalize time string format across JSON (e.g. "11:45 AM–12:45 PM").
- Consider server-passed schedule data for ProgramsSection to reduce client bundle (schedule JSON loaded on server, passed as props).
