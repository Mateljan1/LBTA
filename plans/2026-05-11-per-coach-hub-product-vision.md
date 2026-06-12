# Per-Coach Hub — Product Vision (Future Plan)

**Date captured:** 2026-05-11
**Status:** 📋 Vision document (not yet planned for implementation)
**Source:** User context shared during today's per-coach views deploy

## Why this exists

Today (2026-05-11) we shipped per-coach Today views at `/coach-hub/{allison,andrew,peter}` with a thoughtful empty starter for Andrew and the existing static HTMLs for Allison/Peter. That's just the seed of a much bigger surface. This doc captures the user's stated vision so the next plan/work cycle has the full picture instead of a guess.

## The full vision

Each coach's `/coach-hub/{coach}` view should grow into a **personal coaching cockpit** with these surfaces, populated per-coach:

| Surface | What it shows | Source of data |
|---|---|---|
| **Today's plan** | ✅ DONE — drills, themes, sessions for today | Static HTML (Allison/Peter) or JSON (Andrew) |
| **Schedule** | The coach's full week / month of sessions, locations, times | Likely lives in existing schedules data + coach assignment |
| **Lesson plans** | Structured plans (not just today's) — recurring patterns, ladders by level | Needs new data model |
| **Feedback** | Notes from coach to player, player progress notes, post-session debriefs | Needs new data model + write surface |
| **Players** | Roster of players this coach works with — names, levels, contact, notes, photo | Likely cross-references existing leads/students data |
| **Hours tracked** | Hours worked this pay period, by session/location, with totals | Needs check-in mechanism (manual log? GPS check-in like the LBTA admin platform?) |
| **Payout date / estimate** | Next payout date + running estimate based on hours × rate | Derived from hours + rate per coach |
| **Packages with players** | Multi-session packages this coach owns or is assigned to (e.g. 10-pack of privates with player X) | Needs package data model |
| **Drill hub access** | ✅ DONE today (auth bridge) — coach can navigate to shared `/coach-hub` with the same login | Master cookie auto-issued on per-coach login |
| **Anything else** | Open-ended — TBD as the system matures | TBD |

## Architecture impact

The per-coach view shipped today is **already the right shell** for this — `app/coach-hub/[coach]/page.tsx` is just a content slot wrapped in `CoachTodayShell`. As surfaces are built, they become tabs or sections inside that shell, not separate routes.

Suggested progression:

1. **Phase 1 (today, DONE):** Single content slot showing "Today's plan". HTML for some, JSON-driven for others.
2. **Phase 2:** Add tabs to `CoachTodayShell` — Today | Schedule | Players | Hours. Keep Today as the default tab.
3. **Phase 3:** Each tab gets its own data source. Schedule reads from `data/winter2026.json` filtered by coach. Players list pulls from a coach-assignment table (likely needs to be created). Hours pulls from a check-in log.
4. **Phase 4:** Two-way surfaces — feedback notes, hours logging, package management. Needs Supabase or similar write store; can't be JSON-only past a certain scale.
5. **Phase 5:** Payout dashboard — derived from hours + rates. Likely cross-references the LBTA admin platform's existing coach earnings concept (already exists in `/Users/andrew-mac-studio/lbta-admin-platform/client/src/pages/CoachPortal.tsx`).

## Key tension to resolve in the future plan

**Where does this functionality live?** Two viable options:

| Option | Pros | Cons |
|---|---|---|
| **Build it inside this Next.js website** | One codebase, one deploy, coaches use the URL they already know | Duplicates concepts already built in `lbta-admin-platform` (CoachPortal, CoachAvailability, CoachPerformance, GPS check-ins, earnings, session notes) |
| **Link out to the existing `lbta-admin-platform`** | No duplicate work, leverages already-built CoachPortal with check-ins, session notes, earnings, payroll | Different system, different login, different look, currently a Replit/Vite app not a Next.js app |

Worth a real discussion before Phase 2. The `lbta-admin-platform` CoachPortal is functionally most of what's described above, but it's a different stack and not on the public site.

## Decision needed before next phase

**Before building Phase 2**, the user should decide:
- Build inside this LBTA website (lagunabeachtennisacademy.com), OR
- Link from per-coach Today view to the existing `lbta-admin-platform` CoachPortal (different stack, different domain, but already built), OR
- Migrate the LBTA admin platform's CoachPortal into this Next.js website as the long-term home

Until that decision is made, `/coach-hub/{coach}` stays as today's view + drill hub link only.

## Out of scope

- This doc is **not** a Phase 2 plan. It's a vision capture. Real planning waits for the decision above.
- Not deciding pricing/payout logic, tax handling, or 1099 — those are admin platform concerns.

## Compound learning from this conversation

- **Surfacing product vision early prevents architectural debt.** The shell + content-slot architecture chosen on day 1 can grow into the full vision without a rewrite — but only because the vision was captured before Phase 2 started. If the user had asked for Phase 1 + planned Phase 2 separately later, we might have shipped a fixed iframe-only design and had to refactor.
- The per-coach auth bridge (per-coach login = also issue master cookie) is a one-time pattern that scales with any future cross-route auth needs. Captured today.
