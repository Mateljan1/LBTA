# Mobile Experience Improvement — Implementation Plan

**Status:** Phases 1–4 complete (2026-03-17). **Remaining:** Phase 5 (global layout verification: Header drawer, StickyCTA/BackToTop/ChatWidget stacking, Footer at 320px) and Phase 6 (re-run audit, lint/build, optional compound:validate, add mobile checklist to COMPOUND_LEARN).

## Overview

Improve the LBTA site’s mobile experience so key flows (schedules, contact, programs, navigation) are fast, readable, and easy to use on 320px–768px viewports, with no horizontal scroll, reliable 48px touch targets, and clear hierarchy—aligned with existing .cursorrules breakpoints and WCAG 2.1 AAA.

## Problem Statement

- **Why now:** Parents and players often browse and register from phones; a strong mobile experience supports conversion and brand perception.
- **Current state:** The site is mobile-first in principle (ProgramRow has a dedicated mobile stack, Header has a drawer, StickyCTA/BackToTop use safe-area). Gaps to address: possible horizontal scroll at 320px, scroll-anchor clearance under sticky nav, modal and form behavior on small viewports, and a lack of a single mobile audit baseline.

## Proposed Solution

- **Audit first:** Systematically check 320px and 375px for overflow, touch targets, and readability; document findings.
- **Fix by area:** Schedules (anchor nav + scroll-mt, ProgramRow copy/layout) → Contact/form → Programs/cards → Global (Header drawer, modals, sticky elements). Use existing design tokens and patterns; no new frameworks.
- **Validate:** Re-test at 320px, 375px, 768px after changes; confirm no horizontal scroll and 48px targets.

---

## Implementation Steps

### Phase 1: Mobile Audit (Baseline) ✅ Done 2026-03-17

- [x] **1.1** Run viewport checks at 320px and 375px on: Home, Schedules, Contact, Programs overview, one program page (e.g. junior), Coaches, About. Record any horizontal scroll (element and page).
- [x] **1.2** Audit touch targets: all buttons and links that act as primary actions must have effective 48×48px (min-height/min-width or padding). Check Header mobile menu links, SchedulesAnchorNav tabs, ProgramRow Register/Inquire, season pills, modal close and CTAs, Contact form submit, StickyCTA, Footer links.
- [x] **1.3** Check body/input font size: ensure no critical inputs or body text are below 16px on mobile (avoids iOS zoom on focus). Note any violations.
- [x] **1.4** Document scroll-anchor behavior: on Schedules, after clicking anchor nav (Programs, Private, Camps, Leagues), confirm content scrolls into view with appropriate clearance below sticky nav (scroll-mt-28 vs header + SchedulesAnchorNav height).
- [x] **1.5** Capture modal behavior: LuxuryRegistrationModal and TrialBookingModal at 320px/375px—max-height, internal scroll, close button reachable without scrolling.

**Deliverable:** Short audit checklist (pages × viewports) with pass/fail and list of issues to fix. → **Created:** `plans/mobile-audit-phase1-checklist.md`

---

### Phase 2: Schedules Page Mobile ✅ Done 2026-03-17

- [x] **2.1** Fix horizontal scroll (if any): track down min-width or fixed-width elements on Schedules (ProgramRow desktop table, SchedulesAnchorNav, season pills container). Ensure no element forces viewport scroll at 320px; use min-w-0, overflow-hidden, or responsive width where needed.
- [x] **2.2** SchedulesAnchorNav: verify sticky top-16 clears header; ensure scroll-mt on sections (programs, private, camps, leagues) accounts for both header and anchor bar so focused section isn’t hidden. Adjust scroll-mt-* if needed (e.g. scroll-mt-[7rem] or a shared constant).
- [x] **2.3** ProgramRow mobile stack: keep 48px targets on Register and Inquire; ensure long location text (e.g. multi-venue) wraps or truncates with title so the card doesn’t overflow or look broken.
- [x] **2.4** Season pills (ProgramsSection): already min-h-[48px] min-w-[88px]; confirm at 320px they wrap and don’t cause overflow; add margin/padding if they sit too close to edges.

**Deliverable:** Schedules page and ProgramsSection/ProgramRow/SchedulesAnchorNav free of horizontal scroll and with correct scroll-mt behavior.

---

### Phase 3: Contact and Forms ✅ Done 2026-03-15

- [x] **3.1** Contact page: at 320px/375px ensure form container doesn’t overflow; inputs and labels readable; submit button 48px min height; “Interested in” dropdown/options usable.
- [x] **3.2** LuxuryRegistrationModal: confirm modal container uses max-w-[480px] and max-h-[90vh] with internal overflow-y-auto; close button remains in view or is sticky; plan selection buttons and form fields don’t cause horizontal scroll.
- [x] **3.3** TrialBookingModal and LuxuryYearModal: same checks—max height, internal scroll, 48px close and primary actions.

**Deliverable:** Contact page and all registration/booking modals usable and scrollable on small viewports without horizontal scroll.

---

### Phase 4: Programs and Cards ✅ Done 2026-03-15

- [x] **4.1** ProgramCard (programs overview and any listing): on mobile, ensure cards stack cleanly; expanded state (if any) doesn’t overflow; primary actions meet 48px.
- [x] **4.2** Program overview pages (e.g. junior, adult): hero and body copy readable; CTAs 48px; no fixed-width content causing horizontal scroll.

**Deliverable:** Program cards and program pages pass 320px/375px layout and touch checks.

---

### Phase 5: Global Layout and Sticky Elements

- [ ] **5.1** Header: mobile drawer (320px width / 88vw) — confirm no overflow; focus trap and close work; all nav links and “Book Trial” have adequate touch targets.
- [ ] **5.2** StickyCTA: already md:hidden and uses safe-area-inset-bottom; ensure it doesn’t cover critical content (e.g. form submit) and doesn’t overlap BackToTop/ChatWidget in a way that blocks taps.
- [ ] **5.3** BackToTop and ChatWidget: verify stacking (z-index) and safe-area so all are tappable on notched devices.
- [ ] **5.4** Footer: already uses safe-area-inset-bottom; confirm link groups wrap and don’t cause horizontal scroll at 320px.

**Deliverable:** Header, StickyCTA, BackToTop, ChatWidget, and Footer behave correctly on small viewports with no overlap or scroll issues.

---

### Phase 6: Validation and Docs

- [ ] **6.1** Re-run audit (Phase 1) at 320px, 375px, 768px; confirm all “must” items pass.
- [ ] **6.2** Run project lint and build; fix any regressions.
- [ ] **6.3** Optionally run `/compound:validate` (UI/Visual + Functional) and fix any mobile-specific blockers.
- [ ] **6.4** Add a short “Mobile checklist” to COMPOUND_LEARN.md or quality-bars: test at 320/375/768, no horizontal scroll, 48px targets, 16px+ inputs.

**Deliverable:** Passing validation and a repeatable mobile checklist for future changes.

---

## Files to Create/Modify

| File | Action | Purpose |
|------|--------|---------|
| `components/schedules/SchedulesAnchorNav.tsx` | Modify | Ensure scroll-mt or section IDs work with sticky nav; no overflow at 320px |
| `components/schedules/ProgramRow.tsx` | Modify | Mobile stack: location wrapping/truncation if needed; keep 48px targets |
| `components/schedules/ProgramsSection.tsx` | Modify | Season pills / container: no overflow at 320px |
| `components/schedules/ProgramsSection.tsx` (section) | Modify | scroll-mt if needed to clear header + anchor nav |
| `app/contact/page.tsx` | Modify | Form layout and input sizing at 320/375px |
| `components/LuxuryRegistrationModal.tsx` | Modify | Mobile: max-height, internal scroll, close always reachable if needed |
| `components/TrialBookingModal.tsx` | Modify | Same as LuxuryRegistrationModal for small viewports |
| `components/LuxuryYearModal.tsx` | Modify | Same as above |
| `components/ProgramCard.tsx` | Modify | Mobile layout and 48px targets if gaps found in audit |
| `components/layout/Header.tsx` | Modify | Mobile drawer overflow and touch targets if audit finds issues |
| `app/globals.css` or section components | Modify | scroll-mt-* for schedules sections if needed |
| `plans/mobile-experience-improvement-plan.md` | Create | This plan (done) |
| `.cursor/compound/learnings/` or quality-bars | Modify | Add mobile checklist after Phase 6 |

(Other files may be added after the Phase 1 audit pinpoints specific components.)

---

## Success Criteria

- [ ] No horizontal scroll at 320px or 375px on Home, Schedules, Contact, Programs, Coaches, About.
- [ ] All primary interactive elements (Register, Inquire, Submit, Close, nav links, season tabs, anchor nav) have at least 48×48px effective touch target on mobile.
- [ ] Schedules anchor nav scrolls to sections with content visible below the sticky bar (correct scroll-mt or equivalent).
- [ ] Registration and booking modals are usable on 320px: scrollable content, reachable close and CTAs.
- [ ] Contact form readable and submittable on 320px; no inputs below 16px that trigger iOS zoom.
- [ ] Lint and build pass; optional compound:validate UI/Functional passes with no mobile blockers.

---

## Research Sources

- `.cursorrules`: Part 6 (breakpoints 320–1440, touch 48px, no horizontal scroll), Part 10 (buttons, images), Part 16 (testing checklist).
- Existing components: `ProgramRow.tsx` (mobile stack), `SchedulesAnchorNav.tsx` (sticky, overflow-x-auto), `Header.tsx` (drawer), `StickyCTA.tsx`, `LuxuryRegistrationModal.tsx`.
- Compound learnings: `.cursor/compound/learnings/quality-bars.json` (e.g. closeButton48px), `patterns.json` (placement-inquiry-unified).

---

## Relevant Learnings

- **Quality bars:** Close buttons 48×48px (closeButton48px); footer contrast on dark (footerContrast). Primary CTAs black/white (primaryCtaBlackWhite).
- **Patterns:** placement-inquiry-unified for Inquire/Register on ProgramRow; single source of truth for programs on Schedules.
- **Anti-patterns:** No horizontal scroll; no removal of focus outlines; touch targets ≥48px on mobile.

---

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| scroll-mt conflicts with multiple sticky elements | Use one scroll-mt value that clears header + SchedulesAnchorNav; test anchor nav clicks on real devices. |
| Modal content too tall on small screens | Rely on max-h-[90vh] and overflow-y-auto; optionally make close button sticky in modal header. |
| Audit misses edge cases | Run Phase 1 on real devices or browser device emulation with throttle; document viewport and device. |

---

## Next Steps

1. **Phase 5:** Verify Header mobile drawer (overflow, focus trap, 48px targets), StickyCTA/BackToTop/ChatWidget stacking and safe-area, Footer at 320px (no horizontal scroll).
2. **Phase 6:** Re-run audit at 320/375/768px; run `npm run lint` and `npm run build`; optionally `/compound:validate`; add mobile checklist to COMPOUND_LEARN.md or quality-bars.
3. Optionally run **/compound:review** on any changed files and **/compound:learn** to capture new mobile patterns.
