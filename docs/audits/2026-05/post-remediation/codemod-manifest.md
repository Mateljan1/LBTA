# Codemod Manifest — `text-brand-pacific-dusk/{30-70}` → `text-brand-pacific-dusk-soft`

**Generated:** 2026-05-13 by `/compound:work` Phase 4.2 dry-run.
**Source data:** `scripts/check-brand-usage.ts` `forbiddenTextOpacityOnLight` rule (info-only mode, surface-aware heuristic — see commit `118259f`).
**Codemod target:** Replace `text-brand-pacific-dusk/{30,40,50,60,65,70}` with `text-brand-pacific-dusk-soft` on lines the scanner classifies as light-surface.

---

## Decision: ⛔ STOP — manifest exceeds the gate. Awaiting Andrew before applying.

Per the `/compound:work` brief gate (matches the plan's §13 Gate 1 + Gate 2):

> If the Phase 4.2 codemod produces more than 45 hits (audit projected ~30+), stop, dry-run-preview the unexpected hits, and confirm before applying.
> If any single Phase changes more than 5 tracked files outside the planned list, stop and ask before continuing.

Both conditions are decisively triggered:

| Metric                                     | Result            | Gate                | Status      |
| ------------------------------------------ | ----------------- | ------------------- | ----------- |
| Total flagged hits                         | **402**           | > 45 → STOP         | ⛔ exceeds  |
| Total flagged files                        | **77**            | > 40 → STOP         | ⛔ exceeds  |
| Files in **public scope** (audit-flagged)  | **53**            | n/a                 | (would-apply) |
| Files in **hard-out-of-scope** (coach-hub) | **24**            | hard-out-of-scope per `.cursorrules` | ⛔ blocked   |

**Audit's "30+ instances" projection was a count of axe color-contrast violations on the 9 audited routes, not a count of `text-brand-pacific-dusk/{30-70}` source occurrences.** The actual source occurrence count is ~10× higher because:

1. Many opacity-utility usages are on light surfaces but in code paths the audit didn't measure (e.g. `/help`, `/programs/utr-match-play`, `/blog`).
2. The audit measured rendered-DOM contrast violations; many class occurrences are in conditionally-rendered branches that only fire on certain user paths.
3. Legitimate dark-surface usages are correctly skipped by the scanner heuristic (40 raw matches filtered out → 402 flagged).

---

## Recommended path forward — three options for Andrew

### Option A — Land the 13-color token + scanner now; codemod in a follow-up PR (recommended)

- **This PR ships:** the new `pacific-dusk-soft` token (commit `cebc6e9`), the info-only scanner category (commit `118259f`), the fixture tests (commit `337fd40`), and the in-context Phase 4.1 drawer migration (commit `52969ca`). Strict-mode promotion (Phase 4.3) is deferred — see Decision: Phase 4.3 below.
- **Follow-up PR(s)** scope the codemod to **public-scope files only** (~53 files) split into reviewable batches by route family — e.g. `/schedules/**` (8 files), `/programs/**` (6 files), `/coaches/**` (3 files), `app/about/page.tsx` etc. — each with its own visual diff against `docs/audits/2026-05/screenshots/` baselines.
- **Coach-hub paths stay deferred entirely** until coach-hub gets its own audit and remediation plan (out-of-scope per `.cursorrules`).
- **Honest cost:** the audit's "30+ → 0 contrast violations" claim becomes "tier-1 token + scanner ready, codemod follows" rather than "all done in one PR." Fewer Pass A points moved this week, but the system is set up to compound.

### Option B — Apply codemod now to in-scope public files only (53 files, ~378 line changes)

- **Risk:** 53 files in one PR is high-blast-radius for a single-purpose refactor. Per the v1.4 `mass-migration-needs-context-heuristics` learning, a per-route-family batch is safer.
- Skip the 24 coach-hub files entirely (out-of-scope per `.cursorrules`).
- Visual spot-check would be required at multiple breakpoints across most public pages.
- Strict-mode promotion still deferred (would lock CI on the 24 unmigrated coach-hub hits).

### Option C — Apply codemod across all 77 files, including coach-hub

- **VIOLATES `.cursorrules` Hard out-of-scope.** Listed only for completeness; not recommended.

---

## Per-file manifest (full)

**Total:** 402 hits across 77 files (sorted by hit count descending).

| Scope tag | File | Count | Lines |
|---|---|---|---|
| **public** | `components/LuxuryYearModal.tsx` | 32 | 542, 548, 551, 557, 593, 601, 638, 649, 662, 683, 690, 696, 706, 725, 745, 764, 773, 778, 787, 795, 804, 811, 820, 828, 836, 841, 849, 859, 883, 893, 897, 945 |
| **public** | `components/LuxuryRegistrationModal.tsx` | 23 | 300, 306, 339, 366, 373, 379, 388, 397, 402, 411, 419, 428, 435, 444, 452, 460, 465, 473, 483, 508, 527, 550, 614 |
| **internal** | `app/brand/page.tsx` | 19 | 145, 150, 152, 155, 157, 194, 207, 215, 216, 232, 265, 267, 269, 275, 278, 285, 310, 340, 345 |
| **public** | `components/schedules/PrivateCoachingSection.tsx` | 19 | 53, 60, 69, 72, 75, 78, 81, 84, 87, 90, 104, 119, 148, 153, 157, 161, 165, 197, 212 |
| **public** | `app/racquet-rescue/page.tsx` | 17 | 85, 95, 104, 113, 128, 140, 143, 175, 204, 233, 258, 266, 281, 305, 320, 341, 355 |
| **public** | `components/programs/ProgramsTabView.tsx` | 17 | 210, 238, 266, 293, 346, 402, 406, 407, 440, 468, 472, 481, 486, 492, 613, 635, 638 |
| **public** | `components/ProgramCard.tsx` | 14 | 126, 140, 177, 194, 204, 208, 215, 223, 231, 239, 247, 255, 263, 272 |
| **public** | `app/programs/utr-match-play/page.tsx` | 12 | 117, 149, 220, 226, 285, 300, 329, 361, 410, 543, 588, 665 |
| **out-of-scope (coach-hub)** | `app/coach-hub/leads/page.tsx` | 11 | 116, 127, 128, 129, 130, 131, 132, 133, 143, 145, 185 |
| **public** | `app/help/page.tsx` | 11 | 26, 46, 57, 68, 79, 92, 95, 121, 126, 137, 148 |
| **public** | `app/programs/usta-adult-league/page.tsx` | 9 | 81, 131, 149, 166, 175, 184, 186, 192, 198 |
| **public** | `app/camps/page.tsx` | 8 | 287, 298, 309, 310, 338, 339, 369, 511 |
| **public** | `components/schedules/CampRow.tsx` | 8 | 61, 64, 84, 89, 113, 116, 128, 133 |
| **public** | `components/schedules/LeagueRow.tsx` | 8 | 53, 58, 90, 95, 120, 125, 149, 154 |
| **out-of-scope (utr-tracker)** | `components/utr-tracker/UtrLeaderboard.tsx` | 8 | 390, 430, 467, 479, 490, 539, 575, 609 |
| **public** | `components/TrialBookingModal.tsx` | 7 | 267, 276, 282, 395, 443, 447, 452 |
| **out-of-scope (coach-hub)** | `components/coach-hub-coach/CoachDataView.tsx` | 7 | 53, 74, 149, 245, 253, 265, 292 |
| **public** | `components/coaches/CoachCard.tsx` | 7 | 61, 67, 71, 82, 280, 294, 309 |
| **public** | `components/schedules/LeaguesSection.tsx` | 7 | 25, 32, 55, 62, 69, 75, 98 |
| **public** | `app/coaches/allison-cronk/page.tsx` | 6 | 81, 87, 91, 95, 99, 138 |
| **public** | `app/coaches/peter-defrantz/page.tsx` | 6 | 91, 97, 101, 105, 150, 161 |
| **public** | `components/PrivateLessonModal.tsx` | 6 | 245, 250, 256, 375, 410, 413 |
| **out-of-scope (coach-hub)** | `components/coach-hub-coach/CoachWeekScheduleView.tsx` | 6 | 103, 131, 135, 164, 170, 176 |
| **public** | `components/schedules/ProgramRow.tsx` | 6 | 61, 75, 94, 129, 141, 158 |
| **public** | `components/schedules/ProgramsSection.tsx` | 6 | 253, 263, 269, 293, 299, 319 |
| **public** | `components/schedules/ScheduleCalendarView.tsx` | 6 | 143, 187, 297, 300, 402, 430 |
| **public** | `components/schedules/SchedulesPageClient.tsx` | 6 | 166, 172, 215, 221, 260, 266 |
| **public** | `components/schedules/SchedulesProgramFinder.tsx` | 6 | 60, 64, 71, 86, 101, 122 |
| **out-of-scope (utr-tracker)** | `components/utr-tracker/ColorBallPassportGrid.tsx` | 6 | 112, 135, 141, 165, 170, 177 |
| **public** | `app/about/page.tsx` | 5 | 113, 191, 205, 224, 277 |
| **public** | `app/programs/adult/page.tsx` | 5 | 123, 141, 167, 182, 200 |
| **out-of-scope (coach-hub)** | `components/coach-hub-coach/LessonFrameworkView.tsx` | 5 | 37, 58, 61, 196, 236 |
| **public** | `app/coaches/michelle-mateljan/page.tsx` | 4 | 54, 58, 62, 92 |
| **public** | `components/camps/CampListingCard.tsx` | 4 | 143, 146, 181, 235 |
| **out-of-scope (coach-hub)** | `components/coach-hub/BinderOverlay.tsx` | 4 | 82, 85, 97, 99 |
| **out-of-scope (coach-hub)** | `components/coach-hub-coach/CoachTodayShell.tsx` | 4 | 42, 51, 57, 83 |
| **out-of-scope (coach-hub)** | `components/coach-hub-coach/LessonPlanDetailView.tsx` | 4 | 78, 115, 184, 207 |
| **out-of-scope (coach-hub)** | `components/coach-hub-coach/LessonPlanLibraryView.tsx` | 4 | 127, 129, 182, 194 |
| **public** | `app/blog/[slug]/page.tsx` | 3 | 118, 140, 153 |
| **public** | `app/high-performance-pathway/page.tsx` | 3 | 153, 201, 235 |
| **public** | `app/programs/leagues/page.tsx` | 3 | 97, 105, 129 |
| **public** | `app/programs/utr-match-play/UTRMatchPlayDivisions.tsx` | 3 | 80, 119, 177 |
| **public** | `components/coaches/FounderSection.tsx` | 3 | 38, 53, 82 |
| **public** | `components/layout/Header.tsx` | 3 | 293, 409, 471 |
| **public** | `app/philosophy/page.tsx` | 2 | 117, 176 |
| **public** | `app/programs/page.tsx` | 2 | 140, 157 |
| **public** | `components/ExitIntentPopup.tsx` | 2 | 202, 275 |
| **out-of-scope (coach-hub)** | `components/coach-hub-coach/LessonPlanCard.tsx` | 2 | 38, 54 |
| **public** | `components/coaches/CoachingTeamSection.tsx` | 2 | 17, 27 |
| **public** | `components/contact/FacilitiesSection.tsx` | 2 | 46, 58 |
| **public** | `components/schedules/CampsSection.tsx` | 2 | 15, 22 |
| **public** | `components/ui/PartnershipSection.tsx` | 2 | 91, 101 |
| **public** | `app/blog/page.tsx` | 1 | 66 |
| **out-of-scope (coach-hub)** | `app/coach-hub/[coach]/login/page.tsx` | 1 | 86 |
| **out-of-scope (coach-hub)** | `app/coach-hub/[coach]/today/page.tsx` | 1 | 38 |
| **out-of-scope (coach-hub)** | `app/coach-hub/login/page.tsx` | 1 | 61 |
| **public** | `app/page.tsx` | 1 | 232 |
| **public** | `app/privacy/page.tsx` | 1 | 24 |
| **public** | `app/terms/page.tsx` | 1 | 24 |
| **out-of-scope (utr-tracker)** | `app/utr-tracker/admin/login/page.tsx` | 1 | 64 |
| **out-of-scope (utr-tracker)** | `app/utr-tracker/page.tsx` | 1 | 47 |
| **public** | `components/PricingComparison.tsx` | 1 | 27 |
| **public** | `components/TimelineSection.tsx` | 1 | 69 |
| **public** | `components/camps/CampFAQAccordion.tsx` | 1 | 38 |
| **out-of-scope (coach-hub)** | `components/coach-hub/GuideOverlay.tsx` | 1 | 66 |
| **out-of-scope (coach-hub)** | `components/coach-hub/tabs/HandbookTab.tsx` | 1 | 32 |
| **out-of-scope (coach-hub)** | `components/coach-hub/tabs/LBHSTab.tsx` | 1 | 14 |
| **out-of-scope (coach-hub)** | `components/coach-hub/tabs/LiveBallTab.tsx` | 1 | 19 |
| **out-of-scope (coach-hub)** | `components/coach-hub/tabs/PrivateTab.tsx` | 1 | 13 |
| **public** | `components/coaches/CoachesAnchorNav.tsx` | 1 | 36 |
| **public** | `components/home/HomeProgramCardLink.tsx` | 1 | 41 |
| **public** | `components/print/CourtFlyer.tsx` | 1 | 351 |
| **public** | `components/programs/ProgramOverviewCard.tsx` | 1 | 67 |
| **public** | `components/ui/PullQuote.tsx` | 1 | 23 |
| **public** | `components/ui/StatGrid.tsx` | 1 | 28 |
| **out-of-scope (utr-tracker)** | `components/utr-tracker/AdminMatches.tsx` | 1 | 232 |
| **out-of-scope (utr-tracker)** | `components/utr-tracker/ColorBallAdmin.tsx` | 1 | 140 |

---

## Decision: Phase 4.3 strict-mode promotion is also deferred

Strict-mode promotion (the third leg of `introduce-cleanup-enforce`) cannot land in this PR for the same reason: the cleanup phase is not complete. Promoting `forbiddenTextOpacityOnLight` to strict now would block CI on the 402 unmigrated hits across 77 files.

The token + info-only scanner + fixture tests **stay** in this PR. Strict mode follows once cleanup is staged via Andrew-approved batches.

---

## Suggested follow-up PR sequence (if Andrew picks Option A)

1. **PR 1 — `/schedules` family** (~7 files, ~50 hits): `components/schedules/*`, `app/schedules/*`. Smallest blast-radius, addresses the audit's most-cited C-3 page.
2. **PR 2 — `/programs` family** (~6 files, ~50 hits): `app/programs/**`, `components/programs/*`.
3. **PR 3 — `/about` + `/coaches` + `/contact` family** (~8 files, ~30 hits): Editorial pages, low component reuse.
4. **PR 4 — `/camps` + `/racquet-rescue` + `/help` + miscellaneous** (~12 files, ~50 hits).
5. **PR 5 — Modals + cards** (`LuxuryYearModal`, `LuxuryRegistrationModal`, `ProgramCard`, `TrialBookingModal`, `PrivateLessonModal`) (~5 files, ~80 hits): high blast-radius components, deserves dedicated PR + visual diff.
6. **PR 6 — internal `/brand`** (1 file, 19 hits): `app/brand/page.tsx` is a noindex internal page (visual proof of token system); cleanup is symbolic.
7. **PR 7 — `/utr-tracker` family** (4 files, 16 hits): less urgent (admin/internal feature).
8. **PR 8 — promote `forbiddenTextOpacityOnLight` to strict mode** (1 file: `scripts/check-brand-usage.ts`). Lands AFTER PR 1-7 land cleanly.

Coach-hub (`app/coach-hub/**`, `components/coach-hub-coach/**`, `components/coach-hub/**`) stays out-of-scope until its own dedicated audit.
