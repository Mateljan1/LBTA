# Lesson Plan Library — `/compound:full` Implementation Plan

**Date:** 2026-05-11
**Workflow:** `/compound:full` (Plan → Work → Review → Validate → Deploy → Compound)
**Parent vision:** `plans/2026-05-11-per-coach-hub-product-vision.md`
**Predecessor:** `plans/2026-05-11-per-coach-schedule-tab-plan.md` (shipped earlier today)

## Overview

Add a **Lesson Plans** tab to each coach's gated view. Two surfaces: a browsable library of 12 pre-built lesson plans (filterable by program/focus) and a framework reference page documenting the canonical LBTA 4-block lesson schema. Content sourced directly from `LBTA_Coaching_LessonPlanLibrary_v1.md` and the related coaching markdown docs Andrew has already authored — no new content invented, just structured and rendered.

## Problem Statement

Coaches today can see Today's plan and their Schedule, but when they want to **plan tomorrow's session** or **prep a different focus** (e.g. "I have a Red Ball clinic on Wednesday — what's a good forehand day for 5-7yos?") they have no canonical reference. Andrew's already-authored framework lives in markdown files in his Downloads folder, invisible to coaches and to the future plan generator the original `/coach-hub/login` page promised ("Sign in to access the plan generator and resources").

**The data exists. We just need to surface it.**

## Proposed Solution

A library + framework hybrid:

**Routes (sibling to existing `/today` and `/schedule`):**
- `/coach-hub/{coach}/lesson-plans` — Library landing: filter chips (program family) + grid of plan cards
- `/coach-hub/{coach}/lesson-plans/[planId]` — Plan detail page (4-block breakdown rendered like Today view)
- `/coach-hub/{coach}/lesson-plans/framework` — The canonical 4-block schema + the warm-up/craft/live-ball/homework libraries

**Data:**
- `data/coach-hub/lesson-plans/plans.json` — 12 pre-built plans across the LBTA program ladder (Red, Orange, Green, Yellow Junior, Adult Bridge, HP Adult, Cardio Tennis)
- `data/coach-hub/lesson-plans/framework.json` — The 4-block schema + age-banded warm-up library + craft topics + live-ball formats + review templates
- Static imports (today's `dynamic-fs-read-bloats-bundle` learning) keyed by plan ID for the detail route

**Shared across coaches:** Single library, every coach sees the same plans. (No per-coach customization in v1; an "edit-in-browser" or per-coach favorites is a future plan.)

**Source attribution:** Each plan card shows source markdown filename in a small footer line so Andrew can trace what he authored vs what's in the renderer.

## Implementation Steps

### Phase 1: Data foundation (30 min)
- [ ] **1.1** Create `lib/lesson-plan-types.ts` — types for `LessonPlan`, `LessonBlock`, `LessonPlanItem`, `Framework`, `WarmupLibrary`, `CraftTopic`, etc.
- [ ] **1.2** Create `data/coach-hub/lesson-plans/framework.json` — extract the 4-block schema + library content from `LBTA_Coaching_LessonPlanLibrary_v1.md` + age-banded warm-ups + craft topics + live-ball formats + review templates.
- [ ] **1.3** Create `data/coach-hub/lesson-plans/plans.json` — author 12 starter plans across the LBTA program ladder (4 junior + 4 adult + 4 specialty). Each plan includes id, title, program, ageRange, durationMin, focus, blocks (4 standard), homework, tags, source.
- [ ] **1.4** Create `lib/lesson-plan-data.ts` — static-import the JSON files; export `getAllPlans()`, `getPlanById(id)`, `getFramework()`, `filterPlansByProgram(program)`.

### Phase 2: Route + tab nav (10 min)
- [ ] **2.1** Update `components/coach-hub-coach/CoachTodayShell.tsx` — add `'lesson-plans'` to the `CoachTab` type and `TABS` array.
- [ ] **2.2** Create `app/coach-hub/{coach}/lesson-plans/page.tsx` — library landing route, server component, renders `LessonPlanLibraryView`.
- [ ] **2.3** Create `app/coach-hub/{coach}/lesson-plans/framework/page.tsx` — framework route.
- [ ] **2.4** Create `app/coach-hub/{coach}/lesson-plans/[planId]/page.tsx` — plan detail route, dynamic segment.

### Phase 3: Library landing component (40 min)
- [ ] **3.1** Create `components/coach-hub-coach/LessonPlanLibraryView.tsx` — header with brief intro + link to framework page, then filter chip row (program filter), then responsive grid of `LessonPlanCard`s. Active filter state held in URL query (`?program=red`) so links are shareable.
- [ ] **3.2** Create `components/coach-hub-coach/LessonPlanCard.tsx` — card surface with title, program tag, age range, duration, focus, and a meta line. Click → plan detail route. Keyboard-accessible.
- [ ] **3.3** Empty filter state ("No plans match this filter — show all").

### Phase 4: Plan detail component (45 min)
- [ ] **4.1** Create `components/coach-hub-coach/LessonPlanDetailView.tsx` — visual model echoes `CoachDataView` (Today's plan): hero with title + program tag + duration + age range, theme card if plan has one, then 4 block sections each rendered as a session card with items, homework section, source attribution footer, "Back to library" link.
- [ ] **4.2** Color stripe per block by block type (movement / craft / live-ball / review) using brand tokens. Subtle.
- [ ] **4.3** "Print this plan" affordance — uses CSS `@media print` to hide nav/header.

### Phase 5: Framework reference component (30 min)
- [ ] **5.1** Create `components/coach-hub-coach/LessonFrameworkView.tsx` — render the 4-block schema as a 4-card row at top, then sections for each library: warm-ups by age, craft topics by category (stroke / tactical / mental), live-ball formats, review templates.
- [ ] **5.2** Add a "Use as template" CTA at top → links back to the library landing with a "create your own from this framework" footnote (tells coaches: copy a plan card, edit the JSON for now; future builder is coming).

### Phase 6: Verify + deploy + compound (25 min)
- [ ] **6.1** Local: `tsc --noEmit`, `npm run lint`, `STRICT_BRAND_CHECK=1 npm run tokens:check -- --all`, `npm run build` (verify no function-size warnings).
- [ ] **6.2** Local dev smoke: Allison logs in → navigate to /lesson-plans → see 12 plans → filter by "Red" → see filtered subset → click into one plan → see 4-block detail → click "Framework" → see canonical schema.
- [ ] **6.3** Cookie isolation re-confirmed: Allison's cookie cannot see Peter's `/lesson-plans` (per-coach gating still works).
- [ ] **6.4** `vercel --prod` deploy.
- [ ] **6.5** Production verification grid: 3 coaches × {/today, /schedule, /lesson-plans, /lesson-plans/framework, /lesson-plans/{planId}, /coach-hub} = 18 cells. All ≥ 200 (or 307 for cross-coach isolation tests).
- [ ] **6.6** `npm run health:prod` exit 0.
- [ ] **6.7** Capture session learnings via `/compound:learn` (this plan + 2 prior unsaved learnings: `dynamic-fs-read-bloats-bundle`, `vercel-json-x-frame-options-deny-blocks-iframe`).

## Files to Create/Modify

| File | Action | Purpose |
|---|---|---|
| `lib/lesson-plan-types.ts` | Create | Types for plans, framework, blocks, items |
| `lib/lesson-plan-data.ts` | Create | Static-import + lookup helpers |
| `data/coach-hub/lesson-plans/framework.json` | Create | 4-block schema + library content extracted from markdown |
| `data/coach-hub/lesson-plans/plans.json` | Create | 12 starter lesson plans |
| `components/coach-hub-coach/CoachTodayShell.tsx` | Modify | Add Lesson Plans tab |
| `components/coach-hub-coach/LessonPlanLibraryView.tsx` | Create | Library landing |
| `components/coach-hub-coach/LessonPlanCard.tsx` | Create | Card for plan in library grid |
| `components/coach-hub-coach/LessonPlanDetailView.tsx` | Create | 4-block detail page renderer |
| `components/coach-hub-coach/LessonFrameworkView.tsx` | Create | Framework reference page renderer |
| `app/coach-hub/[coach]/lesson-plans/page.tsx` | Create | Library landing route |
| `app/coach-hub/[coach]/lesson-plans/framework/page.tsx` | Create | Framework route |
| `app/coach-hub/[coach]/lesson-plans/[planId]/page.tsx` | Create | Plan detail route |

```yaml
# files (machine-readable)
create:
  - lib/lesson-plan-types.ts
  - lib/lesson-plan-data.ts
  - data/coach-hub/lesson-plans/framework.json
  - data/coach-hub/lesson-plans/plans.json
  - components/coach-hub-coach/LessonPlanLibraryView.tsx
  - components/coach-hub-coach/LessonPlanCard.tsx
  - components/coach-hub-coach/LessonPlanDetailView.tsx
  - components/coach-hub-coach/LessonFrameworkView.tsx
  - app/coach-hub/[coach]/lesson-plans/page.tsx
  - app/coach-hub/[coach]/lesson-plans/framework/page.tsx
  - app/coach-hub/[coach]/lesson-plans/[planId]/page.tsx
modify:
  - components/coach-hub-coach/CoachTodayShell.tsx
```

## Out of scope (this plan)

- **Plan generator / builder UI** — the future surface that composes a custom plan from form inputs. Foundation laid by this plan; builder is its own future plan.
- **Per-coach favorites or personal plans** — single shared library only.
- **Edit-in-browser / authoring UI** — coaches edit JSON directly for now.
- **Search by free text** — filter chips by program only in v1.
- **PDF export of plans** — `@media print` styling counts as the v1 way to "save / share".
- **Versioning of plans** — JSON edits are direct; git history is the version log.
- **Linking lesson plans into the Schedule view** ("this Monday's Red Ball uses Plan X") — relationship is a future plan.

## Success Criteria

- [ ] Each coach sees a third tab "Lesson Plans" in the shell.
- [ ] Library landing renders 12 plan cards.
- [ ] Filter by program (Red / Orange / Green / Yellow / Adult / HP / Cardio) shows the right subset.
- [ ] Clicking a plan card opens its detail page with 4-block breakdown.
- [ ] Framework reference page renders the canonical schema + library content.
- [ ] Cookie isolation, drill hub access, /today, /schedule all unaffected.
- [ ] Production deploy verified with 18-cell grid + health:prod.

## Acceptance checklist

| Criterion | Verification |
|---|---|
| Lesson Plans tab visible | Visual at `/coach-hub/{coach}` (lands /today, see tab) |
| Library landing renders | `curl /coach-hub/{coach}/lesson-plans` returns 200 with 12 card titles |
| Program filter works | `curl /coach-hub/{coach}/lesson-plans?program=red` returns 200 with only Red Ball plans |
| Plan detail renders | `curl /coach-hub/{coach}/lesson-plans/{firstPlanId}` returns 200 with 4-block content |
| Framework page renders | `curl /coach-hub/{coach}/lesson-plans/framework` returns 200 with 4-block schema |
| Mobile responsive | 320px viewport — no horizontal scroll, cards stacked single-column |
| Tab keyboard nav | Tab key reaches Lesson Plans tab, Enter activates |
| Cookie isolation preserved | Allison cookie + `GET /coach-hub/peter/lesson-plans` → 307 |
| `npm run health:prod` | Exit 0 |

## Research Sources

- **Codebase researcher:** `app/coach-hub/[coach]/{today,schedule}/page.tsx`, `components/coach-hub-coach/{CoachTodayShell,CoachDataView,CoachWeekScheduleView}.tsx` — established the page+component pattern this plan extends.
- **Content researcher:** `LBTA_Coaching_LessonPlanLibrary_v1.md` (canonical 4-block schema, 80 lines), `LBTA_Coaching_AdultClinics_v1.md` (adult tier programming, 65 lines), `LBTA_Coaching_JuniorPathway_v1.md` (5-level pathway, 59 lines), `LBTA_Coaching_RatingFrameworks_v1.md` (UTR/NTRP/WTN, 50 lines) — ALL plan content is derived from these.
- **Memory researcher (today's session):** Static imports for JSON in server components (avoids 300mb function size limit); brand-token strict mode catches hand-rolled eyebrows; tab nav via nested routes with `activeTab` prop.

## Relevant Learnings (from compound memory)

| Learning | How it applies |
|---|---|
| `dynamic-fs-read-in-nextjs-server-component-bloats-bundle` (today) | Phase 1.4 uses STATIC imports; both JSON files imported in `lesson-plan-data.ts` |
| `vercel-json-x-frame-options-deny-blocks-iframe` (today) | No iframes in this plan — pure React rendering |
| `nextjs16-proxy-coach-hub` | Per-coach matcher already covers `/coach-hub/[coach]/:path*` — no proxy change |
| `post-deploy-auth-endpoint-verification` | Phase 6.5 extends grid to all 18 cells |
| Brand-token policy | All new components use `brand-*` Tailwind only; STRICT mode in 6.1 |
| Server-rendered tabs as nested routes (just-coined) | Lesson Plans tab is `/coach-hub/{coach}/lesson-plans` for shareable URLs and zero JS for inactive tabs |
| Coach-name-keyed JSON with slug→displayName indirection (just-coined) | N/A here — lesson plans are shared, not coach-keyed |

## Confidence & uncertainty

**Plan confidence:** 🟢 **High.** Pattern is direct extension of Today + Schedule (3rd tab), data structure is well-documented in the source markdown, no new infra (no env vars, no migrations, no auth changes).

**Uncertainty (to validate in Work):**
- 🟡 Number of starter plans — 12 feels right but could be 6 or 20. Will calibrate during Phase 1.3 if writing all 12 takes >25min, defer the rest with a "more coming" note.
- 🟡 Filter UX — chip row vs select dropdown vs sidebar. Default to chip row for desktop and a horizontal-scrollable chip row on mobile (already proven in Schedule's day grid).
- 🟢 Plan detail visual style — directly mirror `CoachDataView` (sessions/drills); confidence high.

## Risks & Mitigations

| Risk | Severity | Mitigation |
|---|---|---|
| Authoring 12 plans takes >30min | Medium | Time-box Phase 1.3 to 25min. Ship with whatever's done + clear "more coming" placeholder. |
| Lesson plan JSON becomes unwieldy at scale | Low | Single file is fine for ≤50 plans. If it grows, split into per-program files (`plans-junior.json`, `plans-adult.json`). |
| Plans drift from Andrew's actual coaching philosophy | Medium | Source attribution footer per plan ("From: LBTA_Coaching_LessonPlanLibrary_v1.md") so Andrew can trace + correct. Plans use his exact framework, not invented. |
| Framework page gets too dense | Medium | Render as collapsible sections (closed by default for libraries, open for the schema). Or: keep flat but limit to most-used items. Start flat, refactor if review feedback. |
| Detail page misses important fields | Low | Type-driven; if a field is in the type and not rendered, lint or visual test catches it. |
| Existing `/coach-hub` (shared drill hub) competes with Lesson Plans | Low | The shared hub has rotating tabs (Programs, Live Ball, Private, etc.) — those are program-marketing. Lesson Plans here are coaching prep. Different mental model. Document in plan card subhead if needed. |

**Gate:** If Phase 6.5 verification fails any cell, STOP, surface failure, do not claim live (per `postDeployAuthEndpointCurlVerification` quality bar).

## Estimated effort

| Phase | Effort | Notes |
|---|---|---|
| 1. Data foundation | 30 min | Authoring 12 plans is the chunk |
| 2. Route + tab nav | 10 min | 3 new pages + 1 line to TABS array |
| 3. Library landing | 40 min | Filter chips + responsive grid |
| 4. Plan detail | 45 min | Mirror CoachDataView idiom |
| 5. Framework reference | 30 min | Render 4-block schema + libraries |
| 6. Verify + deploy + compound | 25 min | Already-known patterns |
| **Total** | **~3h** | |

---

## Compound memory hooks (extracted in Phase 6.7)

- **Pattern:** "Coaching content sourced from canonical markdown docs" — when authoring data files derived from existing user-authored markdown, attribute the source filename in the rendered output so the author can trace what's rendered vs raw.
- **Pattern:** "Lesson plan as a 4-block schema" — LBTA's framework codified in TypeScript types, can be reused by future plan-generator UI.
- **Validation candidate:** filter-by-query-string for shareable filtered views (vs client state).
