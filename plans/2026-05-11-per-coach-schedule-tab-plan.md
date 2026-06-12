# Per-Coach Schedule Tab — Phase 2 Implementation Plan

**Date:** 2026-05-11
**Workflow:** `/compound:plan` + `agent-architecture` v2.0
**Status:** ✏️ AWAITING APPROVAL
**Parent vision:** `plans/2026-05-11-per-coach-hub-product-vision.md`

## Overview

Add a **Schedule** tab to each coach's gated view (`/coach-hub/{allison,andrew,peter}`). Today's plan stays as the default landing tab; Schedule shows the coach's full weekly recurring teaching schedule (sessions, times, locations, programs). Built as the first slice of the Hybrid (Path D) plan agreed in the vision doc.

## Problem Statement

Coaches currently see only "Today" in their per-coach view. To check what's on their plate this week — before driving to court, planning time off, or coordinating substitutes — they have to:
- Open the shared `/coach-hub` (sees ALL coaches' schedules, no per-coach filter)
- Or look at a printout / Google calendar / SMS chain
- Or guess

The gated per-coach view is the natural home for "MY schedule as a coach" — and the data already exists in `data/coach-hub/coach-schedules.json` (17 Allison sessions, 7 Peter sessions, structured by day). We just need to render it per coach.

## Proposed Solution

**Tab navigation in `CoachTodayShell`** — promote the shell from a single content slot to a tabbed shell with Today (default) + Schedule (new). Each tab is a sub-route under the coach's path so deep links work and the URL is shareable.

**Routes:**
- `/coach-hub/{coach}` → redirects to `/coach-hub/{coach}/today` (or renders Today directly — TBD in Implementation)
- `/coach-hub/{coach}/today` → existing Today view (Allison/Peter HTML, Andrew data view)
- `/coach-hub/{coach}/schedule` → NEW — weekly grid of this coach's sessions

**Data flow:**
- Existing `data/coach-hub/coach-schedules.json` is keyed by display name (`"Allison Cronk"`, `"Peter DeFrantz"`)
- New `getCoachSchedule(slug)` helper in `lib/coach-schedule-data.ts` maps slug → display name → schedule entries (uses `coaches.json` registry for the lookup)
- Andrew gets added to `coach-schedules.json` with an empty week; renders as "No sessions on the schedule yet — add entries to data/coach-hub/coach-schedules.json"

**Visual:**
- Mobile-first weekly grid (single-column day cards on phone, multi-column on desktop)
- Each session card shows: time, program name, location, duration, stage code
- Color-coding by program family (red ball, orange ball, green dot, etc) using brand tokens — subtle, not garish
- Visual hierarchy follows the existing CoachDataView pattern (Cormorant headings, DM Sans body, Sandstone surfaces)

**Tab UI:**
- Sticky horizontal tab bar in `CoachTodayShell` header below the title
- Two tabs visible today (Today, Schedule). Future tabs (Lesson Plans, Players, etc.) drop into the same bar.
- Active state: bottom border in Victoria Cove

## Implementation Steps

### Phase 1: Data foundation (15 min)
- [ ] **1.1** Add `andrew` entry to `data/coach-hub/coach-schedules.json` — keyed by display name `"Andrew Mateljan"`, with empty arrays for each weekday (lets the renderer detect "no sessions" gracefully).
- [ ] **1.2** Create `lib/coach-schedule-types.ts` — TypeScript type for the existing schedule shape: `WeeklySchedule = Record<DayName, ScheduleEntry[]>`, `ScheduleEntry = { time, prog, stage, code, dur, loc }`.
- [ ] **1.3** Create `lib/coach-schedule-data.ts` with **static imports** (lessons learned today: dynamic `fs.readFile` bloats bundle). Map slug → schedule via the `coaches.json` registry name.

### Phase 2: Routing — promote to nested routes (20 min)
- [ ] **2.1** Move existing `app/coach-hub/[coach]/page.tsx` content into `app/coach-hub/[coach]/today/page.tsx` (Today view).
- [ ] **2.2** Replace `app/coach-hub/[coach]/page.tsx` with a redirect to `./today` so existing bookmarks still work.
- [ ] **2.3** Verify `proxy.ts` matcher still gates `/coach-hub/[coach]/:path*` (already covers via existing `:path*` glob — no change needed).
- [ ] **2.4** Verify per-coach login redirect still lands on `/coach-hub/{coach}` (which redirects to /today) — no auth route changes needed.

### Phase 3: Schedule view component (45 min)
- [ ] **3.1** Create `components/coach-hub-coach/CoachWeekScheduleView.tsx` — the renderer. Takes `WeeklySchedule | null` prop. Empty state: "No sessions on the schedule yet" (Andrew today). Populated state: grid of day cards with session entries.
- [ ] **3.2** Day card layout: heading (Monday, Tuesday…), session count, then a vertical stack of session cards. Each session card has the time as the eyebrow, program as the title, location + stage code as meta, color stripe down the left edge by program family.
- [ ] **3.3** Mobile-first: single column on `<sm`, two-column on `sm`, three-column on `md+`. Sessions on a phone should NEVER require horizontal scroll.
- [ ] **3.4** Add visual continuity with Today view: same Sandstone card surfaces, same heading scale.

### Phase 4: Schedule page route (15 min)
- [ ] **4.1** Create `app/coach-hub/[coach]/schedule/page.tsx` — server component. Look up coach in registry; redirect to 404 if unknown; fetch schedule via `getCoachSchedule(slug)`; render in `CoachTodayShell` with `<CoachWeekScheduleView />`.
- [ ] **4.2** Pass the `activeTab` prop ("schedule") to `CoachTodayShell` so the shell can highlight the active tab.

### Phase 5: Refactor CoachTodayShell to support tabs (30 min)
- [ ] **5.1** Add `activeTab?: 'today' | 'schedule'` prop with default `'today'`.
- [ ] **5.2** Insert a sub-header tab bar below the existing header: two tabs (Today, Schedule), active state with bottom border in `brand-victoria-cove`. Use `next/link` for client navigation between tabs. Tab bar matches the eyebrow tracking + DM Sans body.
- [ ] **5.3** Mobile a11y: tab bar is keyboard-navigable, ARIA `role="tablist"` semantics, focus ring visible on tab focus.
- [ ] **5.4** Today page passes `activeTab="today"`, Schedule page passes `activeTab="schedule"`.

### Phase 6: Verify + deploy (15 min)
- [ ] **6.1** Local dev smoke: each coach logs in, lands on /today (sees existing Today content), clicks Schedule tab → sees their week. Andrew sees the empty state. Allison sees 17 sessions across 5 days. Peter sees 7 sessions across 4 days.
- [ ] **6.2** Cookie isolation re-confirmed: Allison's cookie cannot see Peter's `/schedule`.
- [ ] **6.3** `./node_modules/.bin/tsc --noEmit` and `npm run lint` clean.
- [ ] **6.4** `npm run build` — confirm `/coach-hub/[coach]/schedule` shows in route table, no size warnings.
- [ ] **6.5** `npm run tokens:check -- --all` STRICT mode passes (no hardcoded hex, only `brand-*` classes).
- [ ] **6.6** `vercel --prod` deploy.
- [ ] **6.7** Production verify: 3 coaches × {today renders, schedule renders, cookie isolation, drill hub access via Shared Hub link} → all 12 cells green. `npm run health:prod` exit 0.

## Files to Create/Modify

| File | Action | Purpose |
|---|---|---|
| `data/coach-hub/coach-schedules.json` | Modify | Add Andrew with empty week structure |
| `lib/coach-schedule-types.ts` | Create | Types for WeeklySchedule, ScheduleEntry, DayName |
| `lib/coach-schedule-data.ts` | Create | Static-import schedule data + slug→schedule lookup |
| `app/coach-hub/[coach]/page.tsx` | Modify | Redirect to /today (preserves existing bookmarks) |
| `app/coach-hub/[coach]/today/page.tsx` | Create (move existing logic here) | Today view (was at parent path) |
| `app/coach-hub/[coach]/schedule/page.tsx` | Create | Schedule view route |
| `components/coach-hub-coach/CoachTodayShell.tsx` | Modify | Add tab bar with activeTab prop |
| `components/coach-hub-coach/CoachWeekScheduleView.tsx` | Create | Weekly grid renderer |

```yaml
# files (machine-readable; keep in sync with table above)
create:
  - lib/coach-schedule-types.ts
  - lib/coach-schedule-data.ts
  - app/coach-hub/[coach]/today/page.tsx
  - app/coach-hub/[coach]/schedule/page.tsx
  - components/coach-hub-coach/CoachWeekScheduleView.tsx
modify:
  - data/coach-hub/coach-schedules.json
  - app/coach-hub/[coach]/page.tsx
  - components/coach-hub-coach/CoachTodayShell.tsx
```

## Out of scope (this plan)

- Calendar view / week-of-the-year navigation (just shows recurring weekly schedule for now).
- Cancellations, holiday awareness, weather overrides.
- Lesson plan library (next plan).
- Player roster (later plan).
- Hours/check-ins/payouts (much later — admin platform decision still open).
- Edit-in-browser functionality (coaches edit JSON directly for now; admin UI is future).
- Notifications (e.g. "next session in 30 min" — not now).
- Substitute-coach management.

## Success Criteria

- [ ] Each coach has two tabs visible: Today (default) and Schedule.
- [ ] Allison's Schedule tab shows 17 sessions correctly distributed across Mon, Tue, Wed, Thu, Sat (mirror of `coach-schedules.json` data).
- [ ] Peter's Schedule tab shows 7 sessions across Mon, Wed, Fri, Sun.
- [ ] Andrew's Schedule tab shows the empty state with clear instruction to populate `coach-schedules.json`.
- [ ] Tab navigation works on mobile (touch target ≥48px) and desktop (keyboard navigable).
- [ ] No regression: Today views still work, drill hub link still works, cookie isolation still works.
- [ ] Production deploy verified live with 12-cell verification grid.

## Acceptance checklist

| Criterion | Verification |
|---|---|
| Schedule tab visible on each coach view | Visual inspection at `/coach-hub/{coach}` (lands on /today by default with tabs in shell) |
| Allison sessions render correctly | `/coach-hub/allison/schedule` → contains "17" total OR check that Mon shows 4 sessions, Tue 2, Wed 4, Thu 2, Sat 5 (or whatever the actual breakdown is) |
| Peter sessions render correctly | `/coach-hub/peter/schedule` → contains 7 sessions across Mon, Wed, Fri, Sun |
| Andrew empty state | `/coach-hub/andrew/schedule` → "No sessions on the schedule yet" message |
| Mobile responsive | Browser dev tools 320px → no horizontal scroll, tap targets ≥48px, day cards stacked single-column |
| Tab keyboard nav | Tab key cycles through tabs, Enter activates, focus ring visible |
| Cookie isolation preserved | Allison cookie + `GET /coach-hub/peter/schedule` → 307 to peter login |
| Drill hub access still works | Allison cookie + `GET /coach-hub` → 200 (auth bridge intact) |
| `npm run health:prod` | Exit 0, all 8 canary routes 🟢 |

## Research Sources

- **Codebase researcher:** `data/coach-hub/coach-schedules.json` (existing data), `app/coach-hub/page.tsx` (already loads this JSON), `components/coach-hub/CoachHubClient.tsx` (existing tab pattern reference).
- **Data inventory:** Allison Cronk has 17 sessions across {Mon, Tue, Wed, Thu, Sat}; Peter DeFrantz has 7 sessions across {Mon, Wed, Fri, Sun}; Andrew Mateljan not present (will add empty week).
- **Memory researcher (today's session):** Static imports for JSON in server components (avoids 300mb function size limit); `vercel.json` X-Frame-Options header gotcha (relevant if Schedule view ever embeds anything).

## Relevant Learnings (from compound memory)

| Learning | How it applies |
|---|---|
| `dynamic-fs-read-in-nextjs-server-component-bloats-bundle` (today) | Phase 1.3 uses STATIC imports for schedule JSON, not `fs.readFile` |
| `vercel-json-x-frame-options-deny-blocks-iframe` (today) | Schedule view is React-rendered, no iframes — no header impact |
| `nextjs16-proxy-coach-hub` (existing pattern) | Per-coach matcher already covers `/coach-hub/[coach]/:path*` — no proxy change needed for new sub-route |
| `post-deploy-auth-endpoint-verification` (today) | Phase 6.7 extends the verification grid to include the new schedule route |
| `vercel-rest-api-fallback-for-cli-prompt-walls` (today) | No new env vars in this plan, so not triggered |
| Brand token policy (.cursorrules Part 7) | All new components use `brand-*` Tailwind classes only; STRICT mode enforced in Phase 6.5 |

## Confidence & uncertainty

**Plan confidence:** 🟢 **High.** Data already exists, route pattern already proven (per-coach gating), no new auth surfaces. Lowest-risk slice possible for the first hybrid tab.

**Uncertainty (to validate in Work):**
- 🟡 Tab semantics — server-rendered tabs (one route per tab) vs client-rendered tabs (one route, JS toggles). Plan uses server-rendered (one route per tab) because it's faster, mobile-friendlier, and gives shareable URLs. Will confirm during build that this UX feels right.
- 🟡 Color stripe by program family — pleasant idea but adds complexity. May skip in v1 if it slows the build past the estimate. Acceptance doesn't require it.
- 🟢 Data shape stability — schedule entries (time, prog, stage, code, dur, loc) won't change.

## Risks & Mitigations

| Risk | Severity | Mitigation |
|---|---|---|
| Existing routes broken by moving Today logic to /today subpath | Medium | Phase 2.2: parent `[coach]/page.tsx` redirects to `/today` so old links still work. Phase 6.1 explicitly tests both old and new paths. |
| Andrew's empty week feels "broken" to him | Low | Empty state message is encouraging + actionable ("Add sessions to coach-schedules.json under 'Andrew Mateljan'") |
| Tab bar bloats CoachTodayShell over time | Low | Future tabs (Lesson Plans, Players) follow same pattern; tab list is data-driven from the shell so adding a tab is one entry. |
| Schedule data drifts out of sync with reality | Medium (long-term) | Coaches eventually edit a single source. For Phase 2 today, JSON is fine; this is captured in vision doc Phase 4 (admin/write surface). |
| Color-coding violates brand restraint | Low | Use only existing brand tokens (Pacific Dusk, Victoria Cove, Tide Pool, Thousand Steps, Sandstone) — max 4 stripe colors total |

**Gate:** If Phase 6.7 verification fails on any cell, STOP, surface the failure, do not claim live (per `post-deploy-auth-endpoint-verification` quality bar).

## Estimated effort

| Phase | Effort | Notes |
|---|---|---|
| 1. Data foundation | 15 min | Add Andrew empty + types + lookup |
| 2. Routing reorg | 20 min | Move /today + redirect at parent |
| 3. Schedule view component | 45 min | Most novel work |
| 4. Schedule route | 15 min | Mirror /today route shape |
| 5. Tab navigation in shell | 30 min | A11y + keyboard nav |
| 6. Verify + deploy | 15 min | Already-known patterns |
| **Total** | **~2h 20min** | |

## Open questions for user

| Q | Default if not answered |
|---|---|
| Should Schedule default to "this week" (current calendar week) or just show the recurring weekly pattern? | Recurring weekly (data is shape-of-week, not date-of-week) |
| Color-coding by program family — yes or skip? | Skip in v1, add as a Phase 2.5 polish if you like the layout |
| When Andrew's schedule is empty, link to the JSON file or just show the message? | Just the message + the slug + display name to put in the JSON |
| Should the tab bar collapse to a select dropdown on mobile (<400px) or stay as horizontal tabs? | Stay as horizontal tabs, with horizontal scroll if more than 3 tabs ever exist |

---

## Compound memory hooks (for `/compound:learn` after deploy)

Likely learnings to capture from this plan's execution:
- **Pattern:** "Per-coach hub tabs as nested routes" — each tab is `/coach-hub/{coach}/{tab}` for shareable URLs and zero JS bundle for inactive tabs.
- **Pattern:** "Coach-name-keyed JSON with slug→displayName indirection" — keep human-readable JSON keys, do the mapping in the data lookup helper.
- Probable validation: existing master `/coach-hub` schedule rendering can be reused as a reference for how to render this data in a similar visual idiom.
