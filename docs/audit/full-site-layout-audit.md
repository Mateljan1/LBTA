# Full Site Layout Audit — Phase 2 Results

**Date:** March 2026  
**Source:** `plans/full-site-audit-plan.md` Phase 2  
**Method:** Code review + Mobile Phase 1 baseline (`plans/mobile-audit-phase1-checklist.md`)

---

## 2.1 Viewport Checks (320/375/768px)

### Prior verification (Mobile Phase 1)
| Page | 320px | 375px | Notes |
|------|-------|-------|--------|
| / | ✅ Pass | ✅ Pass | overflow-x-hidden on body |
| /schedules | ✅ Pass | ✅ Pass | ProgramRow md:hidden stack; SchedulesAnchorNav overflow-x-auto internal only |
| /contact | ✅ Pass | ✅ Pass | Form in max-w container |
| /programs | ✅ Pass | — | ProgramCard flex-1 min-w-0 |
| /programs/junior | ✅ Pass | — | Standard layout |
| /coaches | ✅ Pass | — | overflow-x-auto on tabs internal |
| /about | ✅ Pass | — | Standard layout |
| /apply-scholarship | ✅ Fixed | — | Submit was min-w-[300px]; fixed to w-full max-w-[300px] |

### Code-based verification (root layout)
- `overflow-x-hidden` on body — prevents document-level horizontal scroll
- `container-lbta`, `container-narrow`, `max-w-*` used site-wide
- No fixed min-widths > 320px on primary content (except fixed Apply Scholarship)

### Pending live verification at 320px
Remaining pages: /book, /camps, /faq, /fitness, /help, /philosophy, /success-stories, /thank-you, /pathway-planner, /adult-trial, /junior-trial, /beginner-program, /high-performance-pathway, /match-play, /racquet-rescue, /programs/*, /coaches/*, /privacy, /terms, /not-found, /schedules/calendar.

**Recommendation:** Run browser at 320px on sample of unverified pages (e.g. /book, /camps, /pathway-planner, /not-found) to confirm no overflow.

---

## 2.2 Touch Targets (48×48px)

| Component | Status | Evidence |
|-----------|--------|----------|
| Header mobile menu | ✅ | min-h-[48px] min-w-[48px] logo; drawer links py-3.5 min-h-[48px] |
| Footer links | ✅ | inline-flex min-h-[48px] on all nav links |
| StickyCTA | ✅ | min-h-[48px] on CTA; Call button 56×56 (w-14 h-14) |
| ChatWidget | ✅ | h-[60px] w-[60px] min-h-[48px] min-w-[48px] |
| ProgramRow / CampRow / LeagueRow | ✅ | min-h-[48px] on buttons |
| Modals (close, CTAs) | ✅ | min-w-[48px] min-h-[48px] close; min-h-[48px] primary |
| SchedulesAnchorNav | ✅ | min-h-[48px] px-4 py-3 |
| CoachesAnchorNav | ✅ | min-h-[48px] |
| Apply Scholarship submit | ✅ | min-h-[48px] |
| BackToTop | ✅ | min-w-[48px] min-h-[48px] |
| ExitIntentPopup close | ✅ | min-w-[48px] min-h-[48px] |

---

## 2.3 Form Input Font Size (16px)

| Form | Status | Notes |
|------|--------|-------|
| Contact form | ✅ | text-base on inputs, select, textarea |
| LuxuryRegistrationModal | ✅ | text-base |
| TrialBookingModal | ✅ | text-base |
| LuxuryYearModal | ✅ | text-base |
| PrivateLessonModal | ✅ | text-base |
| **NewsletterForm** | ⚠️ | **text-[15px]** on email input — may trigger iOS zoom |
| Apply Scholarship | ⚠️ Verify | No explicit font size; inherits. Ensure body ≥16px or add text-base |

---

## 2.4 Scroll-Anchor

| Page | Section IDs | scroll-mt | Status |
|------|-------------|-----------|--------|
| Schedules | #programs, #private, #camps, #leagues | scroll-mt-28 | ✅ |
| Coaches | Anchor nav if present | — | Verify |

---

## 2.5 Modal Behavior (320/375px)

| Modal | max-height | Internal scroll | Close | Status |
|-------|------------|-----------------|-------|--------|
| LuxuryRegistrationModal | max-h-[90vh] | overflow-y-auto | 48px | ✅ |
| TrialBookingModal | — | — | 48px | ✅ |
| LuxuryYearModal | — | — | 48px | ✅ |
| PrivateLessonModal | — | — | 48px | ✅ |

---

## Findings

### Fix required
1. **NewsletterForm:** Change email input from `text-[15px]` to `text-base` (16px) to avoid iOS zoom.

### Verify
2. **Apply Scholarship:** Confirm inputs inherit 16px or add text-base.
3. **Remaining pages:** Live check at 320px for horizontal scroll on /book, /camps, /pathway-planner, /not-found.

---

## Summary

- **Touch targets:** All primary actions meet 48px
- **Form inputs:** Contact + modals use 16px; NewsletterForm uses 15px (fix needed)
- **Scroll-anchor:** Schedules OK
- **Modals:** OK
- **Viewport:** 8 pages verified; remaining pages need live check
