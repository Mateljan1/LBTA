# Validation Blockers Fix — Implementation Plan

## Overview
Address the three blockers from the compound-engineering validate run: (1) court flyer hardcoded camp prices, (2) touch targets below 48px, (3) raw red/blue in user-facing components.

## Problem Statement
Data Integrity flagged hardcoded `$295/wk` and `$495/wk` on the court flyer; UI/Visual flagged 44px/40px controls and raw red/blue instead of brand tokens.

## Proposed Solution
- Court flyer: derive Spring Break and Summer camp price (and ages/location) from `year2026.camps` (spring-break, summer).
- Touch targets: set primary interactive elements to `min-h-[48px]` in ProgramsSection, PrivateCoachingSection, ScheduleCalendarView.
- Colors: replace `text-red-*`, `bg-red-*`, `border-red-*` with `text-lbta-red`, `bg-lbta-red/5`, `border-lbta-red/20` (and similar) in contact, PrivateLessonModal, beginner-program, adult-trial.

## Implementation Steps

### Phase 1: Data (court flyer)
- [x] Step 1.1: In `app/print/court-flyer/page.tsx`, add `springBreakCamp = year2026.camps?.find(c => c.id === 'spring-break')`; use `springBreakCamp?.price`, `springBreakCamp?.ages`, `springBreakCamp?.location` for Spring Break row; use `summerCamp?.price` and `summerCamp?.ages` for Summer row (remove hardcoded `'$295/wk'`, `'$495/wk'`). **Done.**

### Phase 2: Touch targets
- [x] Step 2.1: ProgramsSection.tsx: change both toggle buttons from `min-h-[44px]` to `min-h-[48px]`. **Done.**
- [x] Step 2.2: PrivateCoachingSection.tsx: change CTA button from `min-h-[44px]` to `min-h-[48px]`. **Done.**
- [x] Step 2.3: ScheduleCalendarView.tsx: change table cell `min-h-[44px]` to `min-h-[48px]`; change content block `min-h-[40px]` to `min-h-[48px]` for the interactive slot block. **Done.**

### Phase 3: Brand colors (user-facing)
- [x] Step 3.1: app/contact/page.tsx: replace `text-red-600` with `text-lbta-red` for validation errors. **Done.**
- [x] Step 3.2: components/PrivateLessonModal.tsx: replace required asterisk and error box (text-red-600, bg-red-50, border-red-200, text-red-700) with lbta-red tokens. **Done.**
- [x] Step 3.3: app/beginner-program/page.tsx and app/adult-trial/page.tsx: replace error box and link (bg-red-50, border-red-200, text-red-800, text-red-400, text-red-600) with lbta-red tokens. **Done.**

## Files to Create/Modify
| File | Action | Purpose |
|------|--------|---------|
| `app/print/court-flyer/page.tsx` | Modify | Derive camp prices from year2026 |
| `components/schedules/ProgramsSection.tsx` | Modify | 48px touch targets |
| `components/schedules/PrivateCoachingSection.tsx` | Modify | 48px touch target |
| `components/schedules/ScheduleCalendarView.tsx` | Modify | 48px touch targets |
| `app/contact/page.tsx` | Modify | Brand error color |
| `components/PrivateLessonModal.tsx` | Modify | Brand error color |
| `app/beginner-program/page.tsx` | Modify | Brand error color |
| `app/adult-trial/page.tsx` | Modify | Brand error color |

## Out of scope (this plan)
- AnalyticsDashboard / ComprehensiveFormTester (internal tools).
- API rate-limit-on-failure 500 → allow/429 (validation warning only).
- Adding `sizes` to CourtFlyer/SeamlessLogo images.

## Success Criteria
- [x] Court flyer uses year2026 for Spring Break and Summer prices/ages/location.
- [x] All listed primary controls use min-h-[48px].
- [x] Contact, PrivateLessonModal, beginner-program, adult-trial use lbta-red for errors.
- [x] Lint passes.

## Acceptance checklist
- [x] Court flyer: no literal `'$295/wk'` or `'$495/wk'`; springBreakCamp and summerCamp used.
- [x] Grep for min-h-[44px] and min-h-[40px] in ProgramsSection, PrivateCoachingSection, ScheduleCalendarView returns no matches.
- [x] Grep for text-red-600, bg-red-50, border-red-200 in contact, PrivateLessonModal, beginner-program, adult-trial returns no matches (replaced with lbta-red).
- [x] `npm run lint` passes.

## Relevant Learnings
- COMPOUND_LEARN: hardcoded prices → source from data; .cursorrules: use lbta-red for errors, 48px touch targets.
