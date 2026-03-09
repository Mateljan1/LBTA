# Schedules Page UX Overhaul — Implementation Plan

**Cold War Judge Verdict:** The current page is a monument to inefficiency. Excessive scroll, buried Private Lessons, and zero in-page navigation force the user to do the work. This plan re-engineers the experience so the page serves the user instead of punishing them.

---

## Overview

Transform `/schedules` from a long, linear scroll into a **navigable, hierarchy-aware experience**: sticky in-page navigation, Private Lessons one click away, and optional section reordering so high-intent users are not forced through irrelevant content.

---

## Problem Statement

1. **Scroll as punishment** — The page is exceedingly long. Users must scroll through Programs → Camps → Leagues before reaching Private Lessons. No shortcut.
2. **Private Lessons buried** — A primary driver for engagement (private coaching) is at the bottom. Strategic miscalculation.
3. **No in-page wayfinding** — Sections have `id="programs"`, `id="camps"`, `id="leagues"`, `id="private"` but there is no UI that uses them. Users cannot jump.
4. **Obstructive patterns** — Any "Filter By" modal that blocks the view on load (if reintroduced) would trade one problem for another. Filters must be inline or non-blocking.
5. **Linear flow** — Single path: top to bottom. No hierarchy, no shortcuts, no respect for user intent (e.g. "I only want private lessons").

**Why now:** The screenshot and critique make clear that the current design fails basic UX: findability and reduced effort. Fixing this is a prerequisite for conversion and clarity.

---

## Proposed Solution

### 1. Sticky In-Page Navigation (Primary Fix)

- **Component:** A sticky bar that appears after the user scrolls past the hero (or sits just below the hero/breadcrumbs). Contains anchor links: **Programs** | **Camps** | **Leagues** | **Private Lessons**.
- **Behavior:** Click scrolls to the section with smooth behavior (`scroll-margin-top` so the section heading isn’t hidden under the sticky bar). Nav stays visible so users can jump again without scrolling back up.
- **Order in nav:** Put **Private Lessons** in a prominent position (e.g. second: Programs, **Private Lessons**, Camps, Leagues) so it’s not an afterthought.
- **Accessibility:** Keyboard navigable, 48px min touch targets, `aria-current` or visible state for active section when implemented.
- **Mobile:** Horizontal scroll or compact dropdown (e.g. "Jump to section") so the bar doesn’t wrap awkwardly; same anchors.

### 2. Surface Private Lessons (Content Hierarchy)

- **Option A — Reorder sections (recommended):** Change DOM order to: **Programs** → **Private Coaching** → **Camps** → **Leagues**. Rationale: Users looking for private lessons reach them after one section instead of three. Programs stay first (seasonal core); Private is the next highest-intent offer.
- **Option B — Keep order, emphasize in nav only:** Leave DOM order as-is but list "Private Lessons" first or second in the sticky nav and ensure the label is clear (e.g. "Private Lessons" not just "Private").
- **Recommendation:** Option A. Same page, same content; order reflects priority. SEO impact is minimal (one page, one H1, headings preserved).

### 3. No Obstructive Modals on Load

- Do **not** introduce a "Filter By" (or any) modal that opens automatically on page load. If filters are added later, they must be inline (e.g. pills/chips) or in a non-blocking sticky bar, not a full-screen overlay.

### 4. Optional: Active Section Highlighting (Phase 2)

- Use `IntersectionObserver` to set the current section in the sticky nav (e.g. bold or underline the link for the section in view). Improves orientation during scroll. Can ship after the core nav and reorder.

### 5. Out of Scope (Future)

- **Tabbed view:** One section visible at a time (Programs | Camps | Leagues | Private) would eliminate scroll but is a larger interaction change. Defer unless stakeholders explicitly want it.
- **Separate "Private Lessons" page:** Not required for this plan; in-page jump + reorder achieves the goal.

---

## Implementation Steps

### Phase 1: Sticky Anchor Navigation

- [x] **1.1** Create `components/schedules/SchedulesAnchorNav.tsx` (or `components/ui/SchedulesAnchorNav.tsx`).
  - Props: none (or optional `sections: { id, label }[]` for reuse). Default sections: `[{ id: 'programs', label: 'Programs' }, { id: 'private', label: 'Private Lessons' }, { id: 'camps', label: 'Camps' }, { id: 'leagues', label: 'Leagues' }]`.
  - Render: horizontal list of links with `href="#programs"` etc. Use `scroll-margin-top` on target sections so content isn’t hidden under the sticky bar (e.g. `scroll-mt-24` or a CSS variable for nav height).
  - Sticky: `position: sticky; top: 0` (or below site header if header is sticky). Ensure z-index sits below main header but above content. Background and border per .cursorrules (e.g. `bg-white` or `bg-brand-sandstone`, subtle border).
  - Smooth scroll: `scroll-behavior: smooth` on `<html>` (globals.css) or use `element.scrollIntoView({ behavior: 'smooth' })` in an `onClick` handler to avoid reliance on global CSS.
- [x] **1.2** Add `SchedulesAnchorNav` to `app/schedules/page.tsx` below the hero (or below breadcrumbs). Ensure it only renders on `/schedules` (it’s in the schedules page, so no conditional needed).
- [x] **1.3** Add `scroll-margin-top` to sections that have ids: `#programs`, `#camps`, `#leagues`, `#private`. In each section component, add a class like `scroll-mt-28` (or equivalent) so the sticky nav doesn’t cover the section heading.
- [x] **1.4** Accessibility: Ensure each link has a clear label, min height 48px, focus ring. Optional: `aria-current="true"` when that section is in view (Phase 2).

### Phase 2: Reorder Sections (Surface Private Lessons)

- [x] **2.1** In `app/schedules/page.tsx`, reorder the main content: render **PrivateCoachingSection** after **ProgramsSection** and before **CampsSection**. New order: ProgramsSection → PrivateCoachingSection → CampsSection → LeaguesSection. Keep HorizonDividers between sections.
- [x] **2.2** Ensure `PrivateCoachingSection` still receives the same props (`coaches`, `monthlyPrograms`, `discounts`, `scholarships` from `year2026Data`). No data changes.

### Phase 3: Mobile and Polish

- [x] **3.1** On small viewports, make the anchor nav horizontally scrollable (e.g. `flex overflow-x-auto gap-2` with `scroll-snap` if desired) or replace with a single "Jump to section" dropdown that lists the four sections. Avoid wrapping into multiple rows that push content down.
- [x] **3.2** Verify sticky bar doesn’t overlap the global header. If the site header is sticky, set `top` of the schedules nav to the header height (e.g. `top-16` or a CSS variable).
- [x] **3.3** Check interaction with `StickyCTA`: ensure the schedules anchor nav and the bottom StickyCTA don’t fight (different positions; StickyCTA shows after scroll, anchor nav is always visible after hero). If both are sticky, ensure z-index and placement are correct.

### Phase 4 (Optional): Active Section Highlighting

- [ ] **4.1** In `SchedulesAnchorNav`, use `IntersectionObserver` to detect which section is in view (e.g. when its root intersection ratio > 0.2). Set state for `activeSectionId`.
- [ ] **4.2** Apply `aria-current="true"` and a distinct style (e.g. font-weight or underline) to the link whose section is active. Respect `prefers-reduced-motion` (no flashing).

---

## Files to Create / Modify

| File | Action | Purpose |
|------|--------|---------|
| `components/schedules/SchedulesAnchorNav.tsx` | **Create** | Sticky in-page nav with anchor links (Programs, Private Lessons, Camps, Leagues). |
| `app/schedules/page.tsx` | **Modify** | Insert `SchedulesAnchorNav`; reorder sections to Programs → Private → Camps → Leagues. |
| `components/schedules/ProgramsSection.tsx` | **Modify** | Add `scroll-mt-*` class to section root so anchor scroll lands correctly. |
| `components/schedules/PrivateCoachingSection.tsx` | **Modify** | Add `scroll-mt-*` class to section root. |
| `components/schedules/CampsSection.tsx` | **Modify** | Add `scroll-mt-*` class to section root. |
| `components/schedules/LeaguesSection.tsx` | **Modify** | Add `scroll-mt-*` class to section root. |
| `app/globals.css` | **Modify** (optional) | Add `scroll-behavior: smooth` on `html` if not using JS scroll. |

---

## Success Criteria

- [ ] **Private Lessons reachable in one click** from above the fold (via sticky nav link "Private Lessons").
- [ ] **No mandatory long scroll** to reach any section; all four sections reachable via the sticky nav.
- [ ] **Sticky nav visible** after user scrolls past hero (or always below hero); remains visible on scroll.
- [ ] **Section order** reflects priority: Programs → Private Coaching → Camps → Leagues.
- [ ] **Touch targets** ≥ 48px for nav links; **keyboard** navigable; **focus** visible.
- [ ] **Smooth scroll** to sections; section heading not hidden under sticky bar (`scroll-margin-top`).
- [ ] **No modal** that opens on page load to filter or otherwise obstruct content.
- [ ] **Mobile:** Nav usable (horizontal scroll or dropdown); no horizontal overflow on page.
- [ ] **Lighthouse** accessibility ≥ 90; no new violations.
- [ ] **Data and single source of truth:** No hardcoded prices; all data still from `data/*.json` and lib loaders.

---

## Research Sources

- Web search: long-form pricing/schedule page UX, sticky nav, anchor navigation, tabs (2024).
- Codebase: `app/schedules/page.tsx`, `components/schedules/*`, existing section ids, `StickyCTA.tsx`.
- Project docs: `docs/archive/SCHEDULE_PRICING_UNIFICATION_COMPLETE.md` (filter/sticky history).
- .cursorrules: typography, color tokens, spacing, button/CTA patterns, accessibility (WCAG 2.1 AAA, 48px touch targets).

---

## Relevant Learnings (from COMPOUND_LEARN / .cursor/compound)

- **Page composition:** Schedules page already uses extracted sections in `components/schedules/`; add new component there.
- **Single source of truth:** Pricing and program data remain in `data/*.json`; no changes to data flow.
- **Brand tokens only:** Nav bar uses `brand-*` (e.g. `bg-brand-sandstone`, `text-brand-pacific-dusk`).
- **Accessibility:** 48px min touch targets, focus states, no removal of focus outlines.
- **Anti-pattern:** Footer/low-contrast and hero CTA without solid bg already documented; nav must meet contrast and touch target rules.

---

## Risks and Mitigations

| Risk | Mitigation |
|------|------------|
| Sticky nav overlaps site header | Set `top` to header height; test with sticky header. |
| Reordering confuses users who expect "Camps" before "Private" | Nav order and section order both put Private after Programs; label clearly "Private Lessons". |
| Active-section observer adds complexity | Phase 4 optional; ship Phase 1–3 first. |
| Horizontal scroll on mobile feels awkward | Prefer compact "Jump to" dropdown on very small viewports if horizontal scroll is poor. |

---

## Cold War Judge — Final Note

The current page earns a **3/10**: it has content and structure but ignores wayfinding and priority. This plan earns approval only if implemented without fluff: a real sticky nav, real reorder, and no new obstructive UI. Execute with precision.
