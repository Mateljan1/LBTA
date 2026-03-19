# Coaches Team Section Layout Polish — Implementation Plan

**Status: COMPLETE** (executed 2026-03)  
**Compound Engineering Phase: PLAN**  
**Date:** March 2026  
**Source:** User request — [lagunabeachtennisacademy.com/coaches](https://lagunabeachtennisacademy.com/coaches): change layout of the 3 coaches (Robert, Peter, Allison); photos too big; make it more polished. Leave Andrew (FounderSection) unchanged.

---

## Overview

Replace the current "Meet the Team" layout—one large featured card (Robert) plus two large grid cards (Peter, Allison)—with a single, compact, equal treatment for all three coaches. Smaller photos, tighter typography, and a more polished grid so the section feels editorial and on-brand without dominating the page.

---

## Problem Statement

- **Current state:** Robert is shown in a large 2-column featured card (image ~38% width, up to 360px wide, aspect 3:4; 28–36px name; full bio, quote, credentials). Peter and Allison each get a tall card with a large 3:4 portrait on top and full bio below. The result is a very photo-heavy, long scroll.
- **User need:** "Way too big of photos… make this better, more polished." Founder (Andrew) should stay as is; only the three team coaches’ block should change.
- **Why now:** Improves first impression and scanability; aligns with luxury restraint (40%+ white space, max 3 colors per section) and keeps focus on Andrew as leader.

---

## Proposed Solution

1. **Single layout for all 3 team coaches**  
   Remove the "featured" variant for the lead coach. Treat Robert, Peter, and Allison as one set: same card style, same visual weight.

2. **Compact team card**  
   Introduce a **compact** variant in `CoachCard` used only in `CoachingTeamSection`:
   - **Image:** Smaller footprint — e.g. `aspect-[4/5]` and a **max height** (e.g. `max-h-[240px]` or `max-h-[200px]`) so the photo no longer dominates. Image remains above the fold on card; optional subtle rounded corners to match brand.
   - **Content:** Title (eyebrow), name (headline ~20–22px), specialization (one line). **Bio:** First sentence only (or first ~100–120 chars) + "…" and "View full bio" for full story. **Quote:** Omit on listing (quote lives on individual bio pages). **Credentials:** One row of pills, smaller (e.g. text-[10px], 2–3 shown). **CTAs:** Keep "View full bio" + "Book with {name}" with existing 48px min height and focus rings.
   - **Card:** White background, border black/6, light shadow; padding reduced (e.g. p-5 md:p-6). No hover scale on image if it feels busy; optional hover lift on card only.

3. **Section layout**  
   `CoachingTeamSection`: One grid for all three coaches. **Mobile:** 1 column. **Tablet:** 2 columns (e.g. Robert + Peter, Allison full width or 2+1). **Desktop:** 3 columns so all three sit in one row. Gaps: gap-6 md:gap-8. Section container and section title/subline unchanged; only the cards and grid change.

4. **Data**  
   No change to `data/coaches.json` or `lib/coaches-data.ts`. Use existing `getLeadCoach()` and `getProgramCoaches()`; combine into one ordered list (lead first, then program order) and map to compact cards.

---

## Implementation Steps

### Phase 1: CoachCard compact variant

- [x] **1.1** In `components/coaches/CoachCard.tsx`, add `variant: 'featured' | 'grid' | 'compact'`. Keep `featured` and `grid` implementations as-is for now (no behavior change elsewhere).
- [x] **1.2** Implement **compact** layout:
  - Wrapper: same border/shadow/rounded as grid card; `flex flex-col`; no full-height stretch needed if section grid uses consistent row heights.
  - Image container: `relative aspect-[4/5] w-full max-h-[240px] md:max-h-[200px] overflow-hidden` (or equivalent so width is constrained by grid column and height is capped). Use existing `Image` with `fill`, `object-cover`, `coachImageSrc`, `imagePosition`, and `sizes` appropriate for 1/3 column (e.g. `(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 320px`).
  - Content block: `p-5 md:p-6`. Eyebrow (title) text-[11px]. Name: `font-headline text-[20px] md:text-[22px]`. Specialization: one line, text-[13px] text-brand-pacific-dusk/70. Bio: truncate to first sentence (e.g. `coach.bio.split(/[.!?]/)[0]` + ".") or first 100–120 characters; if truncated, ensure "View full bio" is visible. Credentials: `flex flex-wrap gap-1.5` with small pills (text-[10px], px-2 py-0.5 or similar). CTAs: same as grid (View full bio + Book), `min-h-[48px]`, focus rings per .cursorrules.
  - No quote block in compact; no hover overlay on image required (optional simple hover: card shadow lift only).
- [x] **1.3** Ensure compact card is accessible: same `alt` pattern, link to bio has discernible text, buttons meet 48px.

### Phase 2: CoachingTeamSection — single grid, compact only

- [x] **2.1** In `components/coaches/CoachingTeamSection.tsx`, build one list: `const teamCoaches = [getLeadCoach(), ...getProgramCoaches()].filter(Boolean)` (lead first, then Peter, Allison).
- [x] **2.2** Remove the separate "featured" block (current lead coach `CoachCard variant="featured"`). Replace with a single grid: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 items-stretch`.
- [x] **2.3** Map over `teamCoaches` and render `<CoachCard coach={coach} variant="compact" />` inside `AnimatedSection` (keep stagger delay by index). Use existing key: `coach.slug ?? \`order-${coach.order}\``.
- [x] **2.4** Adjust section container width if desired (e.g. keep `max-w-[1100px]` or tighten to `max-w-[1000px]` for a slightly denser look). No change to section title, section-horizon, or subline copy.

### Phase 3: Visual polish and responsive check

- [x] **3.1** At 320px, 375px, 768px, 1024px, 1440px: no horizontal scroll; compact cards stack or sit in 2/3 columns; images don’t overflow; text readable.
- [x] **3.2** Touch targets: "View full bio" and "Book with X" remain ≥48px; focus visible. Contrast: all text on white meets 7:1 where required.
- [x] **3.3** Optional: add a subtle card hover (e.g. `hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)]` and `hover:-translate-y-0.5`) for polish; respect reduced motion (no hover motion if `prefers-reduced-motion: reduce`).

### Phase 4: Verification

- [x] **4.1** Run `npm run build` and `npm run lint`.
- [x] **4.2** Spot-check `/coaches`: Andrew (FounderSection) unchanged; "Meet the Team" shows three equal, compact cards with smaller photos and truncated bio; links to individual bio pages and Book work.

---

## Files to Create/Modify

| File | Action | Purpose |
|------|--------|---------|
| `components/coaches/CoachCard.tsx` | Modify | Add `compact` variant; smaller image, truncated bio, no quote on card |
| `components/coaches/CoachingTeamSection.tsx` | Modify | Single grid of 3 coaches, all `variant="compact"`; remove featured block |

---

## Out of scope (this plan)

- No change to `FounderSection` or Andrew’s layout/copy.
- No change to `CoachesHero`, `CoachesAnchorNav`, or `CoachesCTA`.
- No change to coach data or schema; no new API or routes.
- Individual coach bio pages (`/coaches/[slug]`) unchanged; quote and full bio remain there.
- No new images or assets; existing headshots used with smaller display size.

---

## Success Criteria

- [x] FounderSection (Andrew) is unchanged.
- [x] "Meet the Team" shows three coaches (Robert, Peter, Allison) in one grid with equal treatment.
- [x] Team coach photos are noticeably smaller (capped height; aspect 4:5 or similar).
- [x] Bio on card is truncated (first sentence or ~100 chars); "View full bio" and "Book with X" present and 48px.
- [x] No horizontal scroll at 320–1440px; touch targets and focus meet .cursorrules.
- [x] Build and lint pass.

---

## Acceptance checklist

- [x] [FounderSection unchanged] → Check: No edits to FounderSection.tsx.
- [x] [Three equal compact cards] → Check: /coaches has one grid of 3 cards; no large 2-column featured block.
- [x] [Smaller photos] → Check: Image container in compact card has max-height and aspect 4:5.
- [x] [Truncated bio + CTAs] → Check: Card shows short bio and both "View full bio" and "Book with X" with 48px.
- [x] [Responsive + a11y] → Check: Layout and CTAs meet .cursorrules; motion-safe used for hover lift.
- [x] [Build + lint] → Check: `npm run build` and `npm run lint` pass.

---

## Relevant Learnings

- **COMPOUND_LEARN / .cursorrules:** 48px touch targets; brand tokens (brand-pacific-dusk, brand-sandstone, etc.); no lbta-slate in new code; section-horizon under headings; PullQuote/section-quote for quotes (we omit quote on compact card).
- **Existing CoachCard:** `featured` and `grid` stay for potential reuse elsewhere; only `CoachingTeamSection` switches to `compact`.
- **Data:** Single source in `data/coaches.json`; `getLeadCoach()` and `getProgramCoaches()`; no new fields for truncation (truncate in component).

---

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Truncated bio cuts mid-word | Truncate at first sentence boundary (split on `.!?`) or at last space before 100–120 chars. |
| Three columns too tight on small desktop | Use `lg:grid-cols-3`; 768–1024 can stay 2 columns for comfort. |
| Compact image too small for recognition | Cap at 200–240px height; aspect 4:5 keeps face visible; individual bio page keeps large photo. |

---

## Research Sources

- Live page: [Our Coaches \| Laguna Beach Tennis Academy](https://lagunabeachtennisacademy.com/coaches)
- Codebase: `components/coaches/CoachCard.tsx`, `CoachingTeamSection.tsx`, `lib/coaches-data.ts`
- .cursorrules Part 6 (breakpoints, touch), Part 10 (buttons, images), Part 7 (color tokens)
