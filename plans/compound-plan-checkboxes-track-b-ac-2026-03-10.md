# Plan: Checkboxes + Track B Finish + AC Setup Checklist

**Purpose:** (1) Tick all plan checkboxes so work is "committed and tracked"; (2) Finish Track B (copy audit + imagery checklist/alt verification); (3) Add an actionable ActiveCampaign setup checklist so you can configure automations from the ops doc.

---

## Overview

Three high-value deliverables: plan docs match reality, Track B success criteria verified and ticked, and a one-page AC setup checklist for confirmation emails.

---

## Problem Statement

- Master plan and homepage-overhaul-plan still show `[ ]` for implemented work (Track A done, Track B/C partially done).
- Schedules plan Success Criteria and Phase 4 need ticking; Lighthouse left as "verify."
- Track B: Copy audit (single source, no forbidden words) and imagery (checklist exists in media-brief; verify alt/sizes on homepage) need verification and checkboxes ticked.
- AC automations are documented in `docs/registration-flows-and-ops.md` but a step-by-step "do this in AC" checklist will make setup one-time and explicit.

---

## Implementation Steps

### Phase 1: Tick plan checkboxes (doc-only)

- [ ] **1.1** **optional-polish-and-homepage-master-plan.md**
  - Tick **A.1.1–A.1.5** and **A.2.1–A.2.2** (Track A implemented).
  - Tick **Track A Success criteria** (all four).
  - Tick **B.1.1–B.1.5**, **B.2.1–B.2.3**, **B.3.1–B.3.2**, **B.4.1–B.4.3** (implemented or verified).
  - Tick **Track B Success criteria** (all seven; Lighthouse note: "verify when ready").
  - Track C already [x].
- [ ] **1.2** **homepage-overhaul-plan.md**
  - Tick Phase 1 steps **1.1–1.5** (layout/UX done).
  - Tick Phase 2 steps **2.1–2.7** (copy from JSON, CTAs, no forbidden words).
  - Tick Phase 3 **3.3** (optional asset checklist — exists in homepage-media-brief.md), **3.4** (alt/sizes verified).
  - Tick Phase 4 **4.1–4.3** (contrast, reduced-motion, HomeCTAForm a11y).
  - Tick Success Criteria (all that are true; note Lighthouse for later).
- [ ] **1.3** **schedules-page-ux-overhaul-plan.md**
  - Ensure Phase 4 **4.1–4.2** are [x] (already done).
  - Success Criteria: leave **Lighthouse** as `[ ]` with note "verify Lighthouse when ready"; rest [x].

### Phase 2: Track B — Copy audit and imagery verification

- [ ] **2.1** **Copy audit** — Confirm `data/homepage-copy.json` is single source: `app/page.tsx`, `HomeHero`, `HomeCTAForm` import it; no forbidden words in codebase (grep already run: none found). Document result in plan or this doc.
- [ ] **2.2** **Imagery** — `plans/homepage-media-brief.md` already has "Asset checklist" with slots and ☐. Confirm all homepage `<Image>` and `<video>` have `alt`/`aria-label` and `sizes`: page.tsx (Images + founder Image), HomeHero (video aria-label). No code change unless one is missing.

### Phase 3: ActiveCampaign setup checklist

- [ ] **3.1** Create **docs/activecampaign-setup-checklist.md** (or add section to registration-flows-and-ops): step-by-step "In ActiveCampaign, do the following" so you can set automations in one pass. Content: (1) List 4 → when contact added, send welcome/confirmation; (2) Tag 82 (Trial Request) → send trial confirmation; (3) Tag 107 (JTT Spring 2026) → send JTT confirmation; (4) Tag 108 (Scholarship) → send "we received your application." Reference list/tag IDs from `lib/activecampaign.ts` and `docs/registration-flows-and-ops.md`.

---

## Files to Create/Modify

| File | Action | Purpose |
|------|--------|---------|
| `plans/optional-polish-and-homepage-master-plan.md` | Modify | Tick A/B steps and success criteria. |
| `plans/homepage-overhaul-plan.md` | Modify | Tick Phases 1–4 and Success Criteria. |
| `plans/schedules-page-ux-overhaul-plan.md` | Modify | Ensure Phase 4 and Success Criteria ticked; Lighthouse note. |
| `docs/activecampaign-setup-checklist.md` | Create | Step-by-step AC automation setup for confirmation emails. |

---

## Success Criteria

- [ ] All three plans reflect implemented work (checkboxes ticked where true).
- [ ] Track B copy and imagery verified; no code change required if already compliant.
- [ ] AC setup checklist exists; you can follow it in ActiveCampaign to enable confirmation emails.
- [ ] Build and lint pass.

---

## Research / references

- `docs/registration-flows-and-ops.md` — Flow table and AC checklist section.
- `lib/activecampaign.ts` — `LBTA_LIST_ID`, `CAMPAIGN_TAGS`, `CLASS_TAGS`.
- `data/homepage-copy.json` — Single source; consumed by page, HomeHero, HomeCTAForm.
- `plans/homepage-media-brief.md` — Asset checklist already present.
