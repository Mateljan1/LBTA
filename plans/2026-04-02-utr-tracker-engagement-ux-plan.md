# UTR Tracker Engagement UX Plan

## Overview
Improve the UTR tracker so players return weekly by making progress, rivalry, and achievement more visible without changing scoring rules.

## Problem Statement
The leaderboard is now accurate and improved visually, but players still need stronger "come back next week" loops: clearer personal progress, proximity to goals, and social motivation. We need this now before season participation grows, so the experience scales with new and returning players.

## Proposed Solution
Add layered engagement mechanics on top of existing data: (1) "Around You" rank context, (2) weekly momentum modules, (3) achievement milestones, and (4) responsive visual polish and accessibility hardening. Keep all points/rank logic server-safe and reuse existing calculations from `lib/utr-tracker-points.ts`.  
(Source: Codebase review of current `UtrLeaderboard` and `ColorBallPassportGrid`, `plans/COMPOUND_LEARN.md`)  
(Source: WAI tooltip/accessibility guidance [W3C APG](https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/) and [MDN tooltip role](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/tooltip_role))  
(Source: leaderboard engagement patterns [UI Patterns](http://ui-patterns.com/patterns/leaderboard))

## Implementation Steps

### Phase 1: Foundation and data shaping
- [ ] Step 1.1: Add a leaderboard view-model helper for per-player "around rank context" (above/me/below), weekly delta trend text, and next-goal metadata.
- [ ] Step 1.2: Add unit tests for edge cases (week 1, ties, new players, no prior week activity).

### Phase 2: Core UX upgrades
- [ ] Step 2.1: Add "Around You" mini rail under expanded player rows so each player can see nearest rivals.
- [ ] Step 2.2: Add "Race to Grand Finals" progress chips (weeks remaining vs required minimum).
- [ ] Step 2.3: Add "Week Momentum" summaries (biggest climb, biggest weekly gain, hottest streak) with clear criteria text.
- [ ] Step 2.4: Add Color Ball engagement polish (milestone wording + next achievable badge cue per stage).

### Phase 3: Quality and interaction polish
- [ ] Step 3.1: Improve keyboard and screen reader behavior for new interactive UI (focus states, aria labels, tooltip/popover semantics).
- [ ] Step 3.2: Add responsive checks for 320/375/768/1024/1440 and reduce overflow risk in table/summary cards.
- [ ] Step 3.3: Run lint + test and document any UX-specific QA steps in `docs/utr-tracker-ops.md`.

## Files to Create/Modify
| File | Action | Purpose |
|------|--------|---------|
| `components/utr-tracker/UtrLeaderboard.tsx` | Modify | Add around-you context, GF race chips, momentum modules, accessibility polish |
| `components/utr-tracker/ColorBallPassportGrid.tsx` | Modify | Add stage-aware milestone cues and clearer next-action language |
| `lib/utr-tracker-points.ts` | Modify | Add reusable helpers for context windows and goal progress metadata |
| `lib/utr-tracker-points.test.ts` | Modify | Add regression tests for new helper logic |
| `docs/utr-tracker-ops.md` | Modify | Capture QA checklist for engagement modules |

```yaml
# files (for tooling; do not edit by hand)
create: []
modify:
  - components/utr-tracker/UtrLeaderboard.tsx
  - components/utr-tracker/ColorBallPassportGrid.tsx
  - lib/utr-tracker-points.ts
  - lib/utr-tracker-points.test.ts
  - docs/utr-tracker-ops.md
```

## Out of scope (this plan)
- Push notifications, emails, or SMS nudges.
- New backend tables or schema migrations.
- Changing points formulas, multipliers, or ranking policy.
- Admin workflow changes for match entry.

## Success Criteria
- [ ] Players can see rank movement, weekly point delta, and nearest competitors without confusion.
- [ ] GF eligibility path is clearer via a visible progress cue.
- [ ] All new UI remains readable and usable at mobile and desktop breakpoints.
- [ ] Existing points/rank math remains unchanged and covered by tests.
- [ ] All tests pass.
- [ ] No lint errors.

## Acceptance checklist
- [ ] "Around You" context renders correct adjacent ranks for at least 3 sampled players in each division.
- [ ] Weekly momentum cards and this-week delta render deterministic values from existing points logic.
- [ ] GF race cue accurately reflects `grand_finals_min_weeks` vs `weeksPlayed`.
- [ ] Tooltip/popover and interactive controls are keyboard-focusable and readable by screen readers.
- [ ] `npm run lint` passes.
- [ ] `npm test -- lib/utr-tracker-points.test.ts` passes.

## Research Sources
- [Tooltip Pattern | W3C WAI-ARIA APG](https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/)
- [ARIA tooltip role | MDN](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/tooltip_role)
- [Leaderboard design pattern | UI Patterns](http://ui-patterns.com/patterns/leaderboard)

## Relevant Learnings
- Keep brand token usage strict and avoid raw ad-hoc colors (`plans/COMPOUND_LEARN.md`).
- Maintain data accuracy by deriving UI stats from existing point calculators, not duplicated logic.
- Preserve accessibility on dark/light surfaces with explicit focus rings and contrast-safe text levels.
- Keep enhancements inside existing component boundaries unless a clear extraction benefit appears.

## Risks & Mitigations
| Risk | Mitigation |
|------|------------|
| Engagement UI adds visual noise | Prioritize one primary signal per module and keep copy short |
| New computations drift from official points | Reuse `calculateWeeklyPoints`/`calculateRankMovement` only; test edge cases |
| Mobile table density becomes hard to scan | Move secondary insights to expandable rows/cards on small screens |
| Accessibility regressions from micro-interactions | Add keyboard/focus checks and keep semantic labels for all controls |

