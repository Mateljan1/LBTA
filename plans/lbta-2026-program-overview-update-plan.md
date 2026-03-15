# LBTA Full-Year 2026 Program Overview — Implementation Plan

## Overview

Synchronize the LBTA website with the finalized 2026 program overviews from the official PDFs: **Winter**, **Spring**, **Summer**, and **Fall** 2026. All program names, schedules, coaches, pricing, session dates, skip dates, camps, discounts, and private coaching must match the PDFs. The `/schedules` page is the single source of truth for programs; data lives in `/data/*.json` and is consumed by `lib/programs-data.ts`, `lib/camps-data.ts`, and `lib/season-utils.ts`.

## Problem Statement

- **Winter 2026**: `data/winter2026.json` has outdated coaches, schedules, and some program names (e.g. Orange/Green Match Play vs single "Friday Match Play"); extra programs (Family Tennis, Adult Match Play) not in PDF; Youth Dev/HP times and locations differ from PDF.
- **Spring & Summer 2026**: `data/spring-summer-2026.json` is close but needs coach assignments, exact times, and any pricing/skip-date tweaks to match PDFs; Spring registration opens "March 2, 2026" per PDF.
- **Fall 2026**: No `data/fall2026.json` exists; Fall tab currently shows legacy `fall2025.json`. PDF defines full Fall session (Aug 31 – Dec 19, 16 weeks, skip dates, Thanksgiving camp, full program grid).
- **Year-level**: `data/year2026.json` has wrong Fall dates/weeks, wrong earlyBird type for fall, and camps (Thanksgiving, Spring Break, Summer) must match PDF pricing and structure; remove or clearly mark non-PDF camps (e.g. Swim & Tennis, Ski Week, Back-to-School, Winter Break) per product decision.
- **Private rates**: `data/private-rates.json` and `year2026.privateCoaching` already match PDF ($250/$2300/$4200 Andrew; $120/$1100/$2000 others).
- **Discounts**: Winter multi-session is "Winter + Spring"; Spring/Summer "Spring + Summer"; Fall "Fall + Winter". Early Bird 5% (2+ weeks before). Sibling 10%. Summer adds Multi-Camp Week 10% (4+ weeks).

## Proposed Solution

1. **Update `data/winter2026.json`**  
   Align every program with Winter 2026 PDF: session dates Jan 5 – Apr 5, 13 weeks; locations (Moulton Meadows, LBHS, Alta Laguna); coach assignments (Allison at Moulton for Little Stars–Green Dot; Peter at Alta Laguna for UTR Green Dot; Peter/Robert/Andrew at LBHS for Youth Dev; Andrew/Robert for HP; Robert/Andrew for adults as per PDF). Schedules and pricing exactly as PDF. Replace separate Orange/Green Match Play entries with a single **Friday Match Play** ($65/mo or $25/session). Remove **Family Tennis** and **Adult Match Play** (not in PDF). Add `skipDates: []` and ensure discounts text matches (Sibling 10%, Early Bird 5%, Multi-Session 5% Winter+Spring).

2. **Update `data/spring-summer-2026.json`**  
   - **Spring**: Dates April 6 – June 13, 10 weeks; skip May 25; registration opens March 2, 2026. Set Spring Break Camp March 30 – April 3; Tennis & Games (Half) $295, Junior Dev $325 at Alta Laguna / LBHS; coach Peter. Programs: same structure as Winter but Spring pricing (e.g. Red 1x $420, 2x $840, 3x $1260, Saturday 1x $380; Youth Dev 1x $625, 2x $1250, 3x $1745; HP 1x $625, 2x $1250, 3x $1745; Adult Beg 1 $420/$615, Sat $380; Adult Beg 2 $420/$615; Adult Int $580/$1105/$1570; Adult Adv $625/$1250). LiveBall/Cardio unchanged ($150/$50). Discounts: Sibling 10%, Early Bird 5%, Multi-Session 5% (Spring+Summer).
   - **Summer**: Dates June 15 – August 29, 11 weeks; skip June 19, July 4. Summer camps: Tennis & Games Full $495, Half $295; Junior Dev $325; Multi-week 10%, Sibling 10%. Program pricing as PDF (e.g. Red 1x $462, 2x $924, 3x $1386, Sat $418; Youth Dev 1x $688, 2x $1375, 3x $1920; HP 1x $688, 2x $1375, 3x $1920; Adult Beg 1 $462/$677, Sat $418; etc.). Add Multi-Camp Week 10% to discounts.

3. **Create `data/fall2026.json`**  
   New file, same schema as `winter2026.json`: `season`, `dates`, `weeks`, `skipDates`, `programs` (and optional `discounts`). Fall session Aug 31 – Dec 19, 2026, 16 weeks; skip Sep 7, Nov 11, Nov 26–27. Registration opens Aug 5, 2026. Program list mirrors Winter/Spring/Summer (Little Stars through High Performance, Adult Beginner 1/2, Intermediate, Advanced, LiveBall Int/Adv, Cardio, Friday Match Play). Fall-specific pricing from Fall PDF (e.g. Red 1x $672, 2x $1344, 3x $2016, Sat $608; Youth Dev 1x $1000, 2x $2000, 3x $2792; HP 1x $1000, 2x $2000, 3x $2792; Adult Beg 1 $672/$984, Sat $608; Adult Beg 2 $672/$984; Adult Int $928/$1768/$2512; Adult Adv $1000/$2000). Schedules and coaches same as Winter (Allison Moulton, Peter Alta Laguna, Peter/Robert/Andrew LBHS Youth Dev, Andrew/Robert HP, etc.). Discounts: Sibling 10%, Early Bird 5%, Multi-Session 5% (Fall+Winter).

4. **Update `data/year2026.json`**  
   - **Seasons**:  
     - **Fall**: `dates`: "August 31 – December 19, 2026"; `weeks`: 16; `skipDates`: ["Sep 7", "Nov 11", "Nov 26", "Nov 27"]; `registrationOpen`: "August 5, 2026"; set `earlyBirdDiscount` to 5 (percent); adjust `earlyBirdDeadline` to match 2 weeks before session start if desired.  
     - **Spring**: Add or set `registrationOpen`: "March 2, 2026" if we store it.  
   - **Camps**: Align with PDFs only (product decision: keep or remove Swim & Tennis, Ski Week, Back-to-School, Winter Break). At minimum:  
     - **Spring Break**: March 30 – April 3; Tennis & Games (Half) $295, Junior Dev $325; coach Peter.  
     - **Summer**: June 15 – Aug 28; Tennis & Games Full $495, Half $295; Junior Dev $325; multi-week 10%, sibling 10%.  
     - **Thanksgiving**: Nov 23–25 (Mon–Wed); Tennis & Games (Half) $221, Junior Dev $244; sibling 10%.  
   - **Discounts**: Ensure `year2026.discounts` text/percentages match PDF (sibling 10%, early bird 5%, multi-session 5% for the appropriate season pairs).  
   - **basePricing / monthlyPrograms / privateCoaching**: Already aligned; only adjust if any number in PDF differs.

5. **Wire Fall 2026 into app**  
   - **`lib/programs-data.ts`**: Import `fall2026.json`; add `getFall2026Programs()` and optionally `getFallProgramsForDisplay()` (or reuse Winter-like shape). Export Fall programs for schedules page.  
   - **`lib/season-utils.ts`**: No change if Fall already comes from `year2026.seasons.fall`; ensure `getAllSeasons()` includes correct Fall dates/weeks.  
   - **`components/schedules/ProgramsSection.tsx`**: When `activeSeason === 'fall'`, use Fall 2026 programs from `getFall2026Programs()` (or equivalent) instead of `fall2025Data.programs`.  
   - **`app/schedules/page.tsx`**: No change if it only uses year2026 for camps/private/discounts/scholarships; programs come from ProgramsSection.

6. **Camps page / `lib/camps-data.ts`**  
   Camps are read from `year2026.camps`. After updating `year2026.json` camps (Spring Break, Summer, Thanksgiving), ensure `getCampsFromYear2026()` and any week builders still work; adjust Summer week dates if last day is Aug 28 (not Aug 29). No new data file needed if all camp data stays in year2026.

7. **Optional / polish**  
   - **Coaches**: `data/coaches.json` titles/roles already align (Andrew Founder, Robert Dir Operations, Peter Senior, Allison Youth). No change unless PDF titles differ.  
   - **FAQ / pricing-supplemental**: Update any hardcoded "Winter" or "13 weeks" references if we add Fall examples; update `pricing-supplemental.json` comparison tiers or schema prices if we want Fall represented.  
   - **Branding**: Winter PDF uses "Movement · Craft · Community"; Spring/Summer/Fall use "Movement · Discipline · Belonging". Site can keep current tagline unless you want season-specific taglines.

## Implementation Steps

### Phase 1: Data — Winter 2026

- [ ] 1.1 Update `data/winter2026.json`: Set `dates`, `weeks`, `skipDates: []`.
- [ ] 1.2 Replace programs array with PDF-accurate list: Little Tennis Stars (Allison; Mon/Wed 3:30–4:15, Sat 9:00–9:45; $120/mo 1x, $200/mo 2x, $40 drop-in); Red Ball (Allison; Mon/Wed 4:15–5:15, Sat 9:45–10:45; $546/$1092/$1635, Sat $497, $50 drop-in); Orange Ball and Green Dot (same pricing as Red Ball, 60 min, 8 max); Friday Match Play (single entry, $65/mo or $25/session); UTR Green Dot (Alta Laguna, Peter, 120 min, 6 max, same pricing as Youth Dev, drop-in $70); Youth Dev Tier 1+2 (LBHS, Peter/Robert/Andrew, Mon/Wed/Fri 4:30–6:30, 1x $810, 2x $1620, 3x $2268, drop-in $70); High Performance (LBHS, Andrew/Robert, Mon/Wed 6:30–8:30, Fri 4:30–6:30 match play, 1x $810, 2x $1620, 3x $2268, drop-in $100); Adult Beginner 1 (Robert Mon/Wed 6–7, Andrew Tue/Thu 10–11, Both Sat 9–10; $546/$797, Sat $497, $55 drop-in); Adult Beginner 2 Bridge (Moulton Mon/Wed 6:30–7:30, $546/$797, $55 drop-in); Adult Intermediate (Tue/Thu 11–12:30, Sat 10–11:30 Andrew; $756/$1437/$2042, $70 drop-in); Adult Advanced (Mon/Fri 12–2, $810/$1620, $90 drop-in); LiveBall Int (Thu 6–7:30 Moulton, Sun 9–10 LBHS); LiveBall Adv (Sun 10:30–12 LBHS); Cardio (Fri 9–10:30 LBHS). Remove Family Tennis, Adult Match Play, and separate Orange/Green Match Play entries.
- [ ] 1.3 Add top-level `discounts` array or note: Sibling 10%, Early Bird 5%, Multi-Session 5% (Winter+Spring).

### Phase 2: Data — Spring & Summer 2026

- [ ] 2.1 In `data/spring-summer-2026.json`, set Spring registration note (e.g. "Registration opens March 2, 2026" in meta or keep in year2026).
- [ ] 2.2 Spring: Update `spring.dates`, `spring.weeks`, `spring.skipDates`; ensure all program pricing in `programs` has `spring` object with PDF values (Red/Orange/Green, Youth Dev, HP, Adult Beg 1/2, Int, Adv); update schedule entries to match Winter coach/time layout where same.
- [ ] 2.3 Summer: Update `summer.dates`, `summer.weeks`, `summer.skipDates`; ensure `summer` pricing objects match PDF; add Multi-Camp Week 10% to `discounts`.
- [ ] 2.4 Camps in same file: Spring Break March 30 – April 3; Tennis & Games (Half) $295, Junior Dev $325; Summer: Tennis & Games Full $495, Half $295, Junior Dev $325; multi-week 10%, sibling 10%.

### Phase 3: Data — Fall 2026

- [ ] 3.1 Create `data/fall2026.json` with `season`, `dates`, `weeks`, `skipDates`, `programs` array. Fall dates Aug 31 – Dec 19, 16 weeks; skip Sep 7, Nov 11, Nov 26, Nov 27.
- [ ] 3.2 Populate `programs` with same program IDs and structure as winter2026 (Little Stars through Cardio, Friday Match Play), Fall pricing from PDF, same schedule/coach pattern as Winter.
- [ ] 3.3 Add `discounts`: Sibling 10%, Early Bird 5%, Multi-Session 5% (Fall+Winter).

### Phase 4: Data — year2026 and camps

- [ ] 4.1 In `data/year2026.json`, update `seasons.fall`: `dates` "August 31 – December 19, 2026", `weeks` 16, `skipDates` ["Sep 7", "Nov 11", "Nov 26", "Nov 27"], `registrationOpen` "August 5, 2026", `earlyBirdDiscount` 5 (not 50).
- [ ] 4.2 Update `camps`: Spring Break (dates, options $295/$325); Summer (dates, options $495/$295/$325, multi-week/sibling); Thanksgiving Nov 23–25, Tennis & Games Half $221, Junior Dev $244, sibling 10%. Remove or retain Swim & Tennis, Ski Week, Back-to-School, Winter Break per product decision (if retain, leave as-is for now).
- [ ] 4.3 Set Spring `registrationOpen` to "March 2, 2026" if field exists.

### Phase 5: Code — ProgramsSection and programs-data

- [ ] 5.1 In `lib/programs-data.ts`: Import `fall2026.json`; add `getFall2026Programs(): WinterProgram[]` (or typed) returning fall2026.programs.
- [ ] 5.2 In `components/schedules/ProgramsSection.tsx`: Import Fall 2026 data or getter; when `activeSeason === 'fall'` use `getFall2026Programs()` (or fall2026Data.programs) instead of fall2025Data.programs. Ensure Program type and category order remain correct.

### Phase 6: Verification and docs

- [ ] 6.1 Run `npm run build` and fix any type/import errors.
- [ ] 6.2 Manually verify `/schedules`: Winter, Spring, Summer, Fall tabs show correct programs and prices; compare one program per category to PDF.
- [ ] 6.3 Verify `/camps`: Spring Break, Summer, Thanksgiving dates and prices match PDFs.
- [ ] 6.4 Update README or docs if we document where program data lives (optional).
- [ ] 6.5 (Optional) Add a short note in `COMPOUND_LEARN.md` or learnings: "2026 program data is sourced from LBTA_Winter/Spring/Summer/Fall2026_Program_Overview.pdf; pricing and schedules must match those PDFs."

## Files to Create/Modify

| File | Action | Purpose |
|------|--------|---------|
| `data/winter2026.json` | Modify | Align all programs, coaches, schedules, pricing, remove non-PDF programs, add Friday Match Play single entry. |
| `data/spring-summer-2026.json` | Modify | Spring/Summer dates, skip dates, pricing, camps, discounts. |
| `data/fall2026.json` | Create | Full Fall 2026 program list and pricing. |
| `data/year2026.json` | Modify | Fall season dates/weeks/skipDates/registration/earlyBird; camps (Spring Break, Summer, Thanksgiving). |
| `lib/programs-data.ts` | Modify | Import fall2026, add getFall2026Programs(). |
| `components/schedules/ProgramsSection.tsx` | Modify | Use Fall 2026 programs when activeSeason === 'fall'. |

## Success Criteria

- [ ] Winter 2026 PDF and `winter2026.json` match for every program (name, schedule, coach, price).
- [ ] Spring and Summer PDFs match `spring-summer-2026.json` for dates, skip dates, pricing, and camps.
- [ ] Fall 2026 PDF and new `fall2026.json` match; Fall tab on `/schedules` shows Fall 2026 data.
- [ ] `year2026.json` Fall section and camps (Spring Break, Summer, Thanksgiving) match PDFs.
- [ ] No duplicate or stray programs (Family Tennis, Adult Match Play removed; single Friday Match Play).
- [ ] Build passes; schedules page and camps page render without errors.

## Research Sources

- LBTA_Winter2026_Program_Overview.pdf (session dates, locations, junior/adult/monthly/private/discounts/coaches).
- LBTA_Spring2026_Program_Overview.pdf (session dates, skip dates, registration, camps, programs, pricing).
- LBTA_Summer2026_Program_Overview.pdf (session dates, skip dates, camps, programs, pricing, multi-camp discount).
- LBTA_Fall2026_Program_Overview.pdf (session dates, skip dates, registration, Thanksgiving camp, programs, pricing).
- Existing: `data/winter2026.json`, `data/spring-summer-2026.json`, `data/year2026.json`, `lib/programs-data.ts`, `components/schedules/ProgramsSection.tsx`.

## Relevant Learnings

- Single source of truth: `/schedules` and program data from `/data/*.json`; no hardcoded prices in components (see .cursorrules and compound learnings).
- Program overview "from" prices and fallbacks live in `pricing-supplemental.json` and year2026; lib only reads with code fallback as last resort.
- Season tabs: Winter/Spring/Summer use winter2026 and spring-summer-2026; Fall currently points to fall2025 — must point to fall2026 after new file exists.

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Breaking ProgramCard or pricing display for Winter/Spring/Summer | Keep same program `id` and category values; only change schedule/pricing/description. Test each tab after edits. |
| Fall 2026 shape inconsistent with Winter | Use same JSON shape as winter2026.json (programs array with id, category, program, ages, location, duration, schedule, pricing, description). |
| Camp week builders assume different dates | Verify SUMMER_WEEK_DATES in camps-data.ts against PDF (e.g. last week Aug 17–19); adjust if needed. |
| earlyBirdDiscount 50 vs 5 in year2026 fall | PDF says 5% early bird; change fall.earlyBirdDiscount from 50 to 5. |

---

**Next step**: Execute Phase 1 (Winter 2026 data) then Phase 2 (Spring/Summer), then Phase 3–5 (Fall data + code), then Phase 6 (verify and document).
