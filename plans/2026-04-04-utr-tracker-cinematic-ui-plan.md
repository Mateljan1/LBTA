# UTR Tracker Cinematic UI Alignment Plan

## Overview
Re-theme the live `/utr-tracker` experience to borrow the strongest visual language from `LBTA-Asset-Generator.html` (cinematic depth, refined contrast, control-panel hierarchy, editorial typography) while preserving current scoring logic and accessibility quality bars.

## Problem Statement
The current UTR tracker is functionally strong and recently gained engagement mechanics, but it still presents as a standard data page rather than a distinctive LBTA product surface. The asset generator demonstrates a premium visual system the team likes: dark atmospheric backdrop, high-contrast typography, subtle glass layers, staged information architecture, and polished micro-states. We need the tracker page and leaderboard to feel like they belong to that same design family without regressing performance, accessibility, or points correctness.

## Proposed Solution
Adopt a "Cinematic Tracker Shell" with a two-zone composition pattern inspired by the generator:
- **Atmospheric canvas:** dark radial backdrop + restrained grain/gradient treatments (not heavy visual noise).
- **Structured information stack:** clear section sequencing, numbered/eyebrow labels, refined cards, and stronger hierarchy for key moments.
- **Leaderboard presentation upgrade:** preserve existing movement/delta/momentum logic, but recompose rows/cards into a more editorial scoreboard style with tighter visual rhythm and better spotlight states.
- **Color Ball alignment:** preserve non-ranked passport behavior while matching the same premium styling system.

Implementation keeps all business logic in existing helpers and uses design-only changes where possible.  
(Source: `Desktop/UTR_Event_Graphics/LBTA-Asset-Generator.html`)  
(Source: `app/utr-tracker/page.tsx`, `components/utr-tracker/UtrLeaderboard.tsx`, `components/utr-tracker/ColorBallPassportGrid.tsx`)  
(Source: `plans/COMPOUND_LEARN.md` and `2026-04-02-utr-tracker-engagement-ux-compound-learn.md`)

## Implementation Steps

### Phase 1: Visual system extraction and shell foundation
- [x] Step 1.1: Define a small set of reusable cinematic utility classes (backdrop layer, card surface tiers, micro-badges, section label system) in tracker-scoped styles.
- [x] Step 1.2: Refactor `app/utr-tracker/page.tsx` hero and intro sections to mirror the generator's hierarchy (eyebrow, high-contrast heading, supportive body copy, structured info modules).
- [x] Step 1.3: Add section rhythm and spacing updates for clearer "scan flow" (header → explainer modules → leaderboard → passports).

### Phase 2: Leaderboard visual architecture redesign
- [x] Step 2.1: Recompose top stats, podium, and momentum blocks into a cohesive cinematic "command strip" with improved contrast and typography.
- [x] Step 2.2: Upgrade leaderboard table styling (header treatment, row emphasis, hover/focus states, movement/delta chip consistency, spotlight for top ranks).
- [x] Step 2.3: Redesign expanded detail row blocks to read as structured sub-panels instead of plain lists while retaining current data.
- [x] Step 2.4: Maintain and verify tooltip + keyboard behavior from prior phase (no regression).

### Phase 3: Color Ball + full-page brand cohesion
- [x] Step 3.1: Align `ColorBallPassportGrid` card treatment, milestone UI, and metadata tone with the new leaderboard shell.
- [x] Step 3.2: Ensure consistent icon usage, radii, border opacity, and text contrast across all UTR sections.
- [x] Step 3.3: Add explicit reduced-motion treatment for any newly introduced transitions/parallax-like effects.

### Phase 4: Quality, accessibility, and validation hardening
- [ ] Step 4.1: Validate at 320/375/768/1024/1440 breakpoints with no horizontal overflow.
- [ ] Step 4.2: Re-check focus visibility, keyboard traversal, tooltip behavior, and contrast in dark/light contexts.
- [ ] Step 4.3: Run lint/tests and update `docs/utr-tracker-ops.md` with a "cinematic UI QA checklist".

## Files to Create/Modify
| File | Action | Purpose |
|------|--------|---------|
| `app/utr-tracker/page.tsx` | Modify | Rebuild page-level visual hierarchy and shell composition |
| `components/utr-tracker/UtrLeaderboard.tsx` | Modify | Apply cinematic scoreboard treatment while preserving logic |
| `components/utr-tracker/ColorBallPassportGrid.tsx` | Modify | Align passport cards with new visual system |
| `app/globals.css` | Modify | Add reusable tracker cinematic utility classes (scoped and token-based) |
| `docs/utr-tracker-ops.md` | Modify | Add styling/accessibility QA checks for new visual system |

```yaml
# files (for tooling; do not edit by hand)
create: []
modify:
  - app/utr-tracker/page.tsx
  - components/utr-tracker/UtrLeaderboard.tsx
  - components/utr-tracker/ColorBallPassportGrid.tsx
  - app/globals.css
  - docs/utr-tracker-ops.md
```

## Out of scope (this plan)
- Any scoring formula, standings logic, or data model changes.
- Admin workflow redesign (`/utr-tracker/admin` pages).
- New backend endpoints, migrations, or auth changes.
- Adding heavy media/video backgrounds that risk LCP regressions.
- Marketing-copy rewrites beyond small UX labels.

## Success Criteria
- [ ] `/utr-tracker` visually aligns with the asset generator's premium style language while keeping LBTA brand tokens.
- [ ] Leaderboard and passport sections feel coherent as one design system.
- [ ] No regression in movement/delta/momentum/GF behavior.
- [ ] Accessibility and keyboard interactions remain fully functional.
- [ ] No lint errors.
- [ ] Existing UTR tests continue to pass.

## Acceptance checklist
- [ ] Hero + explainer section show clear cinematic hierarchy (eyebrow, headline, subcopy, structured modules).
- [ ] Leaderboard rows, chips, and expansion panels are visually upgraded with stable mobile readability.
- [ ] Top-rank and momentum modules are more prominent without introducing clutter.
- [ ] Color Ball cards share the same surface/contrast/radius language as leaderboard modules.
- [ ] Focus states are visible for all interactive elements; tooltip remains keyboard dismissible with `Escape`.
- [ ] `npm run lint` passes.
- [ ] `npm test -- lib/utr-tracker-points.test.ts` passes.

## Research Sources
- `Desktop/UTR_Event_Graphics/LBTA-Asset-Generator.html`
- `app/utr-tracker/page.tsx`
- `components/utr-tracker/UtrLeaderboard.tsx`
- `components/utr-tracker/ColorBallPassportGrid.tsx`
- `plans/COMPOUND_LEARN.md`
- `.cursor/compound/learnings/2026-04-02-utr-tracker-engagement-ux-compound-learn.md`

## Relevant Learnings
- Preserve `leaderboard-movement-delta-pairing` and related engagement helpers; visual improvements should not fork scoring logic.
- Keep deterministic scoring tests intact (`deterministic-scoring-fixtures`).
- Avoid hover-only affordances; maintain keyboard-first interaction quality.
- Use brand tokens and avoid ad-hoc colors to prevent style drift.

## Research conflicts & resolution
- **Conflict:** Asset generator uses a dark app shell, while tracker currently uses a light Morning Light page.
  - **Resolution:** Use a restrained dark atmospheric wrapper + high-contrast content surfaces, but keep LBTA token palette and readability standards. This captures the feel without importing non-brand color behavior.
- **Conflict:** Generator uses dense control-panel UI patterns that could overload a player-facing page.
  - **Resolution:** Borrow hierarchy and surface language, not tool-control density. Keep player page simple and task-oriented.

## Confidence & uncertainty
- **Plan confidence:** Medium-high.
- **Uncertainty to validate in work:** final contrast values in dark sections at AAA targets; whether row density needs a mobile-specific condensed variant.

## Risks & Mitigations
| Risk | Mitigation |
|------|------------|
| Visual over-stylization harms readability | Use incremental visual passes and keep data-first hierarchy |
| Performance regression from effects | Limit effects to CSS gradients/shadows; avoid heavy runtime filters |
| Accessibility regression in darker surfaces | Add explicit contrast and focus checks in QA checklist |
| Scope creep into admin and backend | Enforce strict file scope and out-of-scope list during work |
