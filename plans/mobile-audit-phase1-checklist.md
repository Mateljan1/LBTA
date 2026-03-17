# Mobile Experience — Phase 1 Audit Checklist

**Date:** 2026-03-17  
**Viewports:** 320px, 375px (and 768px for reference)  
**Scope:** Horizontal scroll, touch targets (48px), input/body font size (16px+), scroll-anchor behavior, modals.

---

## 1.1 Viewport checks — horizontal scroll

| Page | 320px | 375px | Notes |
|------|-------|-------|--------|
| Home | ✅ Pass | ✅ Pass | `overflow-x-hidden` on body; live check at 320px — no overflow observed. |
| Schedules | ✅ Pass | ✅ Pass | ProgramRow uses `md:hidden` mobile stack; SchedulesAnchorNav uses `overflow-x-auto` on tab list (internal scroll only). Live check — no page overflow. |
| Contact | ✅ Pass | ✅ Pass | Form in max-w container; inputs full width. Live check — no overflow. |
| Programs overview | ✅ Pass | — | ProgramCard uses `flex-1 min-w-0` and mobile sticky bar has `min-w-[160px]` (fits 320px). |
| Junior program (e.g. /programs/junior) | ✅ Pass | — | Standard section layout; no fixed min-widths forcing overflow. |
| Coaches | ✅ Pass | — | CoachesAnchorNav has `overflow-x-auto` on tabs (internal). FounderSection uses `min-w-0` for grid. |
| About | ✅ Pass | — | Standard layout. |
| **Apply Scholarship** | ⚠️ Risk | ⚠️ Risk | Submit button has `min-w-[300px]`. At 320px with padding this can cause horizontal scroll. **Fix in Phase 2:** use `min-w-0` or responsive width (e.g. `w-full max-w-[300px]`). |

**Summary (1.1):** One known risk — Apply Scholarship submit button. All other audited pages pass at 320/375px. Root layout has `overflow-x-hidden` which prevents document-level scroll but can hide symptom; fix any offending component.

---

## 1.2 Touch targets (48×48px minimum)

| Component / area | Status | Notes |
|------------------|--------|--------|
| Header mobile menu (Open menu, links, Book Trial) | ✅ | `min-h-[48px] min-w-[48px]` on logo; drawer links use `p-3 min-w-[48px] min-h-[48px]`. |
| SchedulesAnchorNav tabs | ✅ | `min-h-[48px] px-4 md:px-5 py-3`. |
| ProgramRow (Register, Inquire) | ✅ | Both desktop and mobile: `min-h-[48px]`; mobile Register has `min-w-[140px]`. |
| Season pills (ProgramsSection) | ✅ | `min-h-[48px] min-w-[88px]`. |
| LuxuryRegistrationModal (close, CTAs) | ✅ | Close: `min-w-[48px] min-h-[48px]`; buttons `min-h-[48px]`. |
| TrialBookingModal / LuxuryYearModal | ✅ | Close 48px; primary actions meet 48px. |
| Contact form submit | ⚠️ Verify | Submit uses `min-h-[48px]` in success state; confirm primary submit button has 48px (code: py-4 + min-height if present). |
| StickyCTA | ✅ | Bar uses padding; CTA button meets 48px. |
| Footer links | ⚠️ Verify | Footer is dense; link tap areas may be smaller than 48px. Prefer padding/line-height to meet 48px on mobile. |
| BackToTop / ChatWidget | ✅ | `min-w-[48px] min-h-[48px]` and 60×60. |
| ProgramCard (Register, Inquire) | ✅ | `min-h-[52px]`; mobile sticky bar buttons 48px+. |
| CampRow / LeagueRow | ✅ | Buttons `min-h-[48px]`. |

**Summary (1.2):** Most primary actions meet 48px. Verify Contact submit and Footer link tap areas on device.

---

## 1.3 Body / input font size (16px+ on mobile)

| Location | Current | Status | Recommendation |
|----------|---------|--------|----------------|
| Contact page inputs (name, email, phone) | `text-[15px]` | ⚠️ Fail | Use 16px for inputs to avoid iOS zoom on focus (e.g. `text-[16px]` or `text-base`). |
| Contact page select (Interested In) | `text-[15px]` | ⚠️ Fail | Same — 16px. |
| Contact page textarea | — | ⚠️ Check | Ensure 16px. |
| LuxuryRegistrationModal inputs | `text-[15px]` | ⚠️ Fail | Modal inputs use 15px; recommend 16px for main form fields. |
| Body / labels | 13–15px in places | ✅ OK | Labels and secondary text can stay; primary **inputs** should be 16px. |

**Summary (1.3):** Contact form and registration modal **inputs** are 15px; raise to 16px on mobile (or globally for inputs) to avoid iOS zoom.

---

## 1.4 Scroll-anchor behavior (Schedules)

| Check | Status | Notes |
|-------|--------|--------|
| Section IDs | ✅ | `#programs`, `#private`, `#camps`, `#leagues` present. |
| scroll-mt on sections | ✅ | All four use `scroll-mt-28` (7rem = 112px). |
| Header + anchor bar height | ✅ | Header ~64px (4rem); SchedulesAnchorNav ~48px (min-h-[48px] + py). Total ~112px. `scroll-mt-28` matches. |
| Anchor nav scroll behavior | ✅ | `scrollIntoView({ behavior: 'smooth', block: 'start' })` with reduced-motion check. |

**Summary (1.4):** scroll-mt-28 aligns with combined sticky height. If in testing the section title is still hidden under the nav, increase to `scroll-mt-[7.5rem]` or `scroll-mt-32` in Phase 2.

---

## 1.5 Modal behavior at 320px / 375px

| Modal | max-height | Internal scroll | Close reachable | Status |
|-------|------------|-----------------|------------------|--------|
| LuxuryRegistrationModal | `max-h-[90vh]` | `overflow-y-auto max-h-[calc(90vh-4px)]` on content | Close absolute top-5 right-5; may scroll away on long form | ✅ Pass (consider sticky close in Phase 2 if UX issue) |
| TrialBookingModal | — | — | 48px close | ✅ Pass |
| LuxuryYearModal | — | — | 48px close | ✅ Pass |

**Summary (1.5):** Modals use max-height and internal scroll. Close buttons are 48px. Optional improvement: make close button sticky in modal header for long flows.

---

## Issues to fix (by phase)

### Phase 2 (Schedules / global overflow) ✅ Done 2026-03-17
- [x] **Apply Scholarship:** Submit button changed to `w-full max-w-[300px] mx-auto` so 320px viewport doesn't overflow.

### Phase 3 (Contact and forms) ✅ Done 2026-03-15
- [x] **Contact page:** Form inputs, select, and textarea set to `text-base` (16px) to prevent iOS zoom.
- [x] **LuxuryRegistrationModal:** All inputs set to `text-base` (16px). TrialBookingModal and LuxuryYearModal inputs updated to `text-base` as well.

### Phase 4 / 5 (if needed)
- [ ] **Footer:** Ensure footer links have adequate tap area (e.g. min 48px height via padding) on mobile.
- [ ] **Scroll-mt:** If user testing shows section title hidden under sticky nav, bump to `scroll-mt-32` or `scroll-mt-[7.5rem]`.

---

## Audit method

- **Code:** Grep and read of layout, schedules, contact, modals, ProgramCard, Header, Footer.
- **Live:** Browser MCP at 320px and 375px on Home, Schedules, Contact; no horizontal scroll observed on those pages.
- **Recommendation:** Re-run a quick visual pass at 320px on Apply Scholarship and Contact (after fixes) before closing Phase 2/3.
