---
title: UTR Match Play — Color Ball / CBR parent guidance on marketing page
slug: utr-match-play-color-ball-cbr-parent-guidance
category: implementation-patterns
tags:
  - utr-match-play
  - utr-sports
  - color-ball-rating
  - cbr
  - juniors
  - parent-education
  - conversion
status: completed
date: 2026-03-24
related_files:
  - app/programs/utr-match-play/page.tsx
  - data/leagues-2026.json
---

# UTR Match Play — Color Ball / CBR parent guidance on marketing page

## Problem

The UTR Match Play program page emphasized numeric UTR and adult-oriented bands. Families with **red, orange, and green ball** players did not see enough explanation of **UTR Sports**, **Color Ball Rating (CBR)** vs **yellow-ball numeric UTR**, or reassurance that the Color Ball division belongs in the **same Saturday series**. Risk: juniors and parents perceived the page as “not for them.”

## Root cause

- Copy assumed familiarity with **Universal Tennis** and treated “UTR” as one number for everyone.
- Operational knowledge (CBR stages R/O/G, distinct from numeric UTR) lived in internal KB, not on the public page.
- **Hero** and **divisions** did not surface education before pricing.

## Solution

1. **New section** `#utr-and-color-ball` — “What UTR is—and how Color Ball fits”  
   - Explains UTR Sports as the results platform; numeric UTR for yellow-ball singles/doubles.  
   - Explains **CBR** as stage-based (R/O/G), intentionally not the same display as adult numeric UTR.  
   - States Color Ball division is **same series**, same-day submission, structured for scaled tennis.  
   - **Red / Orange / Green** strip with one-line purpose each.  
   - Link to `/book` for placement questions.

2. **Hero** — Two anchors: “How UTR & Color Ball work” → `#utr-and-color-ball`; “Divisions & pricing” → `#divisions`.

3. **Who it’s for** — First card retitled and copy expanded for **Junior pathway — Color Ball on up**.

4. **Five divisions** intro — Link to `#utr-and-color-ball` for parents new to UTR or Color Ball.

5. **FAQ** — New items: CBR vs “UTR number”; red/orange-only juniors welcome in Color Ball division.

## Prevention / review checklist

- [ ] Any new **junior** or **Color Ball** program page should explain **CBR vs numeric UTR** in plain language (or link to a canonical explainer).
- [ ] Avoid marketing copy that implies “only the big UTR number matters” for scaled-ball players.
- [ ] Align public claims with **UTR Sports** help center when policies change (annual check per KB).

## Cross-references

- Internal KB: `UTR_Sports_Tennis_Knowledge_Base/04_Color_Ball_Rating_CBR_and_Yellow_Ball_Transition.md` (concept source; not copied verbatim).
- Site data: `data/leagues-2026.json` → `utr.divisions` (Color Ball row remains single source for pricing/copy where applicable).

## Verification

- `npm run build` and `npm run lint` on `app/programs/utr-match-play/page.tsx` changes.
- Manual: scroll to `#utr-and-color-ball`, confirm anchors from hero and divisions block.
