# Code Review Summary — Schedule Calendar Feature

**Scope:** `ScheduleCalendarView.tsx`, `lib/calendar-schedule.ts` (week grid, list view, filters, PDF/print).  
**Review date:** March 2026.  
**Method:** Compound Engineering — 6 parallel review agents.

---

## Overall Score: 78/100

## By Category

| Category            | Score | Status   |
|---------------------|-------|----------|
| Security            | 95    | ✅ Pass  |
| Performance         | 90    | ✅ Pass  |
| Simplicity          | 75    | ⚠️ Warnings |
| Accessibility       | 72    | ⚠️ Warnings |
| Data / TypeScript   | 70    | ⚠️ Warnings |
| Pattern / Architecture | 92 | ✅ Pass  |

---

## Critical Issues (Must Fix)

*None.* No blocker from any agent.

---

## Warnings (Should Fix)

### Simplicity
1. **Duplicate Print/Download block** (`ScheduleCalendarView.tsx` ~206–225 and ~371–390)  
   Same link + button JSX in two places; only wrapper class differs (`mb-6 no-print` vs `mt-8 no-print`).  
   **Recommendation:** Single block with conditional class, e.g. `className={showFilters ? 'mb-6 no-print ...' : 'mt-8 no-print ...'}`.

### Accessibility
2. **Season tabs — keyboard and ARIA**  
   No arrow-key (Left/Right) or Home/End; tabs lack `aria-controls`; content is not `role="tabpanel"` with `id` and `aria-labelledby`.  
   **Recommendation:** Add roving tabindex + `onKeyDown` (see `FAQInteractive.tsx`); add `aria-controls="season-schedule-panel"` and wrap content in `<div role="tabpanel" id="season-schedule-panel" aria-labelledby="season-tab-{key}">`.

3. **Table `role="grid"`**  
   `role="grid"` implies interactive grid (focusable cells, arrow nav). This table is read-only.  
   **Recommendation:** Remove `role="grid"` so the native `<table>` is exposed; keep `scope="col"` on headers.

4. **Time column and filter buttons**  
   Time column is `<td>`; for better table semantics use `<th scope="row">`. Filter buttons don’t expose selected state to assistive tech.  
   **Recommendation:** Time cell as `<th scope="row">`; add `aria-pressed={...}` on Location and View filter buttons.

5. **PDF/Print focus ring**  
   Uses `ring-black/30` instead of brand focus token.  
   **Recommendation:** Use `focus-visible:ring-2 focus-visible:ring-brand-victoria-cove focus-visible:ring-offset-2`.

### Data / TypeScript
6. **Overlapping slots** (`lib/calendar-schedule.ts`)  
   When a cell is already occupied, the later slot is skipped with no log or UI indication.  
   **Recommendation:** Document “first slot wins” and/or surface overlaps (dev log or “+N more” / tooltip).

7. **Invalid time range: `start > end`**  
   `parseTimeRangeToMinutes` doesn’t enforce `start < end`; `durationSlots` becomes 1 and one cell is shown.  
   **Recommendation:** After parsing, if `parsed.end <= parsed.start` return `null` (or normalize).

8. **Time format “3:30–5:00 PM”**  
   Start without AM/PM yields `null` and slot is omitted.  
   **Recommendation:** Support “start inherits PM when end is PM” or document supported format and validate at ingest.

9. **Slot past grid end**  
   If `parsed.end` is beyond `GRID_END_MINUTES`, `rowSpan` can exceed remaining rows.  
   **Recommendation:** Cap `durationSlots = Math.min(durationSlots, totalRows - rowIndex)`.

10. **Non-null assertion `range!`** (`ScheduleCalendarView.tsx` ~259)  
    When `range` is null, `rowsToShow` is `[]` so the map doesn’t run; assertion is safe but brittle.  
    **Recommendation:** Branch: e.g. `if (!range) return <tbody>...</tbody>` and use `range.min + i` in the else (no `!`).

11. **Fallback when season missing**  
    `calendarBySeason[season] ?? calendarBySeason.winter` can be `undefined` if `winter` is missing.  
    **Recommendation:** Ensure page always supplies at least one season, or add guard and safe fallback (e.g. empty object / “No schedule” state).

---

## Suggestions (Nice to Have)

- **Performance:** Compute `usedRowRange` inside the same `useMemo` that builds `gridsByLocation` and store `{ grids, ranges }` so render only does a lookup.
- **Simplicity:** Make `getUsedRowRange` a plain function (remove `useCallback`); optionally skip building grids when `viewMode === 'list'`; extract shared filter-button class helper; consolidate `normalizeSlotLocation` Saturday/LBHS branches.
- **Data:** Clamp hour to 1–12 and minutes to 0–59 in `parseTimeToMinutes` (or reject) for clearer data quality.
- **Pattern:** Move `SEASON_KEYS` / `SEASON_LABELS` to `lib/season-utils.ts` and reuse in `ScheduleCalendarView` and `ProgramsSection`; add `ScheduleCalendarView` to `components/schedules/index.ts` if other callers need it.
- **Accessibility:** Verify contrast for `text-brand-pacific-dusk/70` and `/80` on light backgrounds (aim ≥4.5:1 for normal text).

---

## Decision

- [x] **Ready to merge** (with follow-up improvements)
- [ ] Needs fixes before merge (see critical issues)
- [ ] Needs discussion

**Rationale:** No critical or blocking issues.

---

## Follow-up (March 2026 — compound:work)

All listed warnings and selected suggestions were addressed:

- **Simplicity:** Single Print/Download block with conditional class; `getUsedRowRange` is a plain function.
- **Accessibility:** Season tabs have arrow-key + Home/End, `aria-controls="season-schedule-panel"`, content wrapped in `role="tabpanel"`; table no longer uses `role="grid"`; time column is `<th scope="row">`; Location/View filters have `aria-pressed`; PDF/Print use Victoria Cove focus ring.
- **Data/TS:** `parseTimeRangeToMinutes` rejects `start >= end`; supports "3:30–5:00 PM" (start inherits AM/PM); `durationSlots` capped to remaining rows; overlapping slots documented (first wins); `range!` replaced with explicit empty-state branch; fallback when season missing uses first available season.
- **Pattern:** `SEASON_KEYS` and `SEASON_LABELS` moved to `lib/season-utils.ts`; `ScheduleCalendarView` and `ProgramsSection` import from there. Security and performance are solid; architecture matches single source of truth and project conventions. Warnings are focused on a11y (tab pattern, table role, focus ring), data robustness (time parsing, overlaps, rowSpan cap), and small cleanups (duplicate block, `range!`, fallback). These can be addressed in a follow-up PR or incrementally.

---

## Agent Summaries (Condensed)

| Agent                  | Status   | Summary |
|------------------------|----------|---------|
| Security Sentinel      | ✅ Pass  | No XSS, no injection, no secrets; data from server/JSON; URL season validated. |
| Performance Oracle    | ✅ Pass  | Memoization and data flow sound; optional: move used-row range into grids useMemo. |
| Simplicity Reviewer   | ⚠️ Warn  | Duplicate Print/Download block; unnecessary useCallback; optional grid-on-list skip. |
| Accessibility Auditor | ⚠️ Warn  | Tab keyboard + tabpanel; remove role="grid"; time as row header; aria-pressed; PDF focus ring. |
| Data Integrity        | ⚠️ Warn  | Overlapping slots; start > end; time format; rowSpan cap; range! and fallback. |
| Pattern / Architecture| ✅ Pass  | Matches data flow and .cursorrules; optional shared season constants. |
