# LBTA Custom GPT — Master Folder Build Plan

> **Compound Engineering Plan** — Phase 1 (PLAN) of /compound-engineering loop. Author: Cursor agent under Andrew's direction. Date: 2026-04-25.

---

## Overview

Transform the existing `gpt/` folder (build kit for 4 LBTA GPTs) into a **complete, sectioned master folder** that contains every file, function, integration spec, runbook, and legal/privacy artifact needed to run the LBTA GPT ecosystem from build → daily use → quarterly review → year-1 milestones. Mirror to `~/Desktop/LBTA-Custom-GPT-MASTER/` for one-folder access.

## Problem Statement

Current state (after the previous turn): the `gpt/` folder has the core architecture (4 system prompts, 10 knowledge files, conversation starters, dogfood playbook, compound loop, activation playbook). It's a strong v1 build kit but it is **not yet a master folder** — it's missing the surrounding ecosystem that makes the build actually shippable and operable:

1. **No per-GPT setup folder** — Andrew has to read across 5+ files to set up one GPT. Everything for a single GPT should live in one folder.
2. **No integration playbooks** — Phase 2 mentions Gmail/Drive but there's no step-by-step OAuth setup or action specs.
3. **No incident runbooks** — When the GPT hallucinates, when voice drifts, when Front Desk goes wrong on a customer — there's no playbook.
4. **No legal/privacy artifacts** — Public Front Desk needs privacy disclosure, parent consent, data handling policy. Coaches drafting on `support@` need consent forms.
5. **No team launch comms** — Andrew has nothing pre-written to send Allison and Saska when he flips the switch.
6. **No brand assets reference** — Colors, typography, voice anchors, logo paths are scattered.
7. **No master setup checklist** — Andrew should be able to print one page and check off everything.

## Proposed Solution

Restructure `gpt/` into a 9-section master architecture. Add ~25 new files filling the gaps above. Mirror to desktop as `LBTA-Custom-GPT-MASTER/` with a single `00-START-HERE.md` entry point.

**Architecture (target state):**

```
gpt/
├── 00-START-HERE.md                            ← Single entry point
│
├── 01-ARCHITECTURE/
│   ├── team-architecture.md                    (existing, moved)
│   ├── post-dogfood-compound-loop.md           (existing, moved)
│   ├── team-activation-playbook.md             (existing, moved)
│   ├── team-rituals.md                         (existing, moved)
│   └── year-1-roadmap.md                       (NEW)
│
├── 02-GPT-BUILDS/
│   ├── 01-Founder-GPT/
│   │   ├── README.md                           (NEW: per-GPT setup)
│   │   ├── identity.md                         (NEW: name/desc/picture)
│   │   ├── system-prompt.md                    (existing, copied)
│   │   ├── conversation-starters.md            (existing, copied)
│   │   ├── capabilities.md                     (NEW: tool toggles)
│   │   └── activation-script.md                (NEW: 20-min first session)
│   ├── 02-Adult-Coach-GPT/                     (same 6-file structure)
│   ├── 03-Junior-Coach-GPT/                    (same)
│   └── 04-Front-Desk-GPT/                      (same, no activation — public)
│
├── 03-KNOWLEDGE-BRAIN/
│   ├── README.md                               (NEW)
│   ├── 01-academy-facts.md → 10-guardrails.md  (existing, moved)
│   └── voice-samples/                          (NEW)
│       ├── andrew-samples.md                   (template)
│       ├── allison-samples.md                  (template)
│       └── saska-samples.md                    (template)
│
├── 04-INTEGRATIONS/
│   ├── README.md                               (NEW)
│   ├── phase-2-gmail-setup.md                  (NEW)
│   ├── phase-2-drive-setup.md                  (NEW)
│   ├── phase-2-calendar-setup.md               (NEW)
│   ├── phase-4-playbypoint.md                  (NEW)
│   └── phase-4-activecampaign.md               (NEW)
│
├── 05-OPERATIONS/
│   ├── README.md                               (NEW)
│   ├── eval/
│   │   ├── dogfood-week-playbook.md            (existing, moved)
│   │   ├── dogfood-log-template.md             (existing, moved)
│   │   ├── weekly-metrics.csv                  (existing, moved)
│   │   ├── red-team-audit-template.md          (existing, moved)
│   │   ├── quarterly-review-template.md        (NEW)
│   │   └── annual-audit-template.md            (NEW)
│   ├── runbooks/                               (NEW)
│   │   ├── hallucination-incident.md
│   │   ├── voice-drift.md
│   │   └── public-front-desk-incident.md
│   └── scripts/
│       └── sync-to-desktop.sh                  (NEW)
│
├── 06-COMMUNICATIONS/                          (NEW)
│   ├── README.md
│   ├── team-launch-announcement.md
│   ├── coach-1on1-talking-points.md
│   └── parent-faq-public.md
│
├── 07-LEGAL-PRIVACY/                           (NEW)
│   ├── README.md
│   ├── privacy-disclosure-public.md
│   ├── coach-consent-form.md
│   └── data-handling-policy.md
│
├── 08-BRAND-ASSETS/                            (NEW)
│   ├── README.md
│   ├── colors-typography.md
│   ├── voice-anchors.md
│   └── logo-and-image-paths.md
│
└── 09-COMMAND-CENTER/                          (NEW)
    └── master-setup-checklist.md
```

## Implementation Steps

### Phase 1 — Structure (5 min)
- [x] Step 1.1: Plan written (this file)
- [ ] Step 1.2: Create new directory tree under `gpt/`
- [ ] Step 1.3: Move existing files into new sections (preserve content, update internal links)

### Phase 2 — Per-GPT Builds (20 min)
- [ ] Step 2.1: For each of 4 GPTs, create `identity.md`, `capabilities.md`, `README.md` (per-GPT setup)
- [ ] Step 2.2: For 3 internal GPTs, create `activation-script.md` (the 20-min first session)
- [ ] Step 2.3: Copy `system-prompt-*.md` and `conversation-starters-*.md` into per-GPT folders

### Phase 3 — Integrations (15 min)
- [ ] Step 3.1: Write Gmail OAuth setup
- [ ] Step 3.2: Write Drive setup (folder structure spec)
- [ ] Step 3.3: Write Calendar setup
- [ ] Step 3.4: Spec PlayByPoint Phase 4
- [ ] Step 3.5: Spec ActiveCampaign Phase 4
- [ ] Step 3.6: Integrations README

### Phase 4 — Operations (15 min)
- [ ] Step 4.1: Three runbooks (hallucination, voice drift, public Front Desk incident)
- [ ] Step 4.2: Quarterly review template
- [ ] Step 4.3: Annual audit template
- [ ] Step 4.4: `sync-to-desktop.sh` script
- [ ] Step 4.5: Operations README

### Phase 5 — Comms, Legal, Brand (15 min)
- [ ] Step 5.1: Team launch announcement (Slack/email-ready)
- [ ] Step 5.2: Coach 1-on-1 talking points
- [ ] Step 5.3: Parent-facing FAQ for public Front Desk
- [ ] Step 5.4: Privacy disclosure (public Front Desk)
- [ ] Step 5.5: Coach consent form
- [ ] Step 5.6: Data handling policy
- [ ] Step 5.7: Brand assets reference (3 files)
- [ ] Step 5.8: Voice samples templates × 3 (andrew, allison, saska)

### Phase 6 — Command Center (5 min)
- [ ] Step 6.1: Master setup checklist (one page, all 4 GPTs)
- [ ] Step 6.2: 00-START-HERE.md (root entry point)
- [ ] Step 6.3: Year-1 roadmap

### Phase 7 — Sync & Verify (5 min)
- [ ] Step 7.1: Run `sync-to-desktop.sh` to mirror to `~/Desktop/LBTA-Custom-GPT-MASTER/`
- [ ] Step 7.2: Tree-check structure
- [ ] Step 7.3: Verify per-GPT system prompt char counts still under 8000
- [ ] Step 7.4: Lint repo

## Files to Create/Modify

| Path | Action | Purpose |
|------|--------|---------|
| `gpt/00-START-HERE.md` | Create | Single entry point for the master folder |
| `gpt/01-ARCHITECTURE/year-1-roadmap.md` | Create | Q1–Q4 milestones for the GPT ecosystem |
| `gpt/02-GPT-BUILDS/01-Founder-GPT/{identity,capabilities,README,activation-script}.md` | Create | 4 files |
| `gpt/02-GPT-BUILDS/02-Adult-Coach-GPT/{identity,capabilities,README,activation-script}.md` | Create | 4 files |
| `gpt/02-GPT-BUILDS/03-Junior-Coach-GPT/{identity,capabilities,README,activation-script}.md` | Create | 4 files |
| `gpt/02-GPT-BUILDS/04-Front-Desk-GPT/{identity,capabilities,README}.md` | Create | 3 files (no activation script — public) |
| `gpt/02-GPT-BUILDS/*/system-prompt.md` | Copy from existing | 4 copies |
| `gpt/02-GPT-BUILDS/*/conversation-starters.md` | Copy from existing | 4 copies |
| `gpt/03-KNOWLEDGE-BRAIN/voice-samples/{andrew,allison,saska}-samples.md` | Create | Templates for collecting voice training samples |
| `gpt/04-INTEGRATIONS/{README,phase-2-gmail-setup,phase-2-drive-setup,phase-2-calendar-setup,phase-4-playbypoint,phase-4-activecampaign}.md` | Create | 6 files |
| `gpt/05-OPERATIONS/runbooks/{hallucination-incident,voice-drift,public-front-desk-incident}.md` | Create | 3 runbooks |
| `gpt/05-OPERATIONS/eval/{quarterly-review-template,annual-audit-template}.md` | Create | 2 review templates |
| `gpt/05-OPERATIONS/scripts/sync-to-desktop.sh` | Create | Mirror to desktop |
| `gpt/05-OPERATIONS/README.md` | Create | Operations index |
| `gpt/06-COMMUNICATIONS/{README,team-launch-announcement,coach-1on1-talking-points,parent-faq-public}.md` | Create | 4 files |
| `gpt/07-LEGAL-PRIVACY/{README,privacy-disclosure-public,coach-consent-form,data-handling-policy}.md` | Create | 4 files |
| `gpt/08-BRAND-ASSETS/{README,colors-typography,voice-anchors,logo-and-image-paths}.md` | Create | 4 files |
| `gpt/09-COMMAND-CENTER/master-setup-checklist.md` | Create | One-page master checklist |
| `gpt/03-KNOWLEDGE-BRAIN/README.md` | Create | Knowledge brain index |
| `gpt/README.md` | Update | Point to new structure |

**Total: ~33 new files; ~22 existing files moved/copied.**

## Out of scope (this plan)

- Building the actual GPTs in ChatGPT Builder (Andrew does this manually with the master folder)
- Connecting Gmail/Drive OAuth (Phase 2 — done in Days 31–60 per `post-dogfood-compound-loop.md`)
- Embedding Front Desk on the live website (Phase 4 — done after Day 90 audit pass)
- Generating LBTA-branded GPT profile pictures (specs only; image generation out of scope here)
- Translating any docs to other languages
- Replacing existing `data/coaches.json` Robert entry (separate cleanup task)

## Success Criteria

- [ ] All 33 new files created and brand-aligned
- [ ] Folder restructured into 9 sections (00–09)
- [ ] Existing files moved without content loss
- [ ] All 4 system prompts still under 8000 char ChatGPT cap
- [ ] `~/Desktop/LBTA-Custom-GPT-MASTER/` mirrors `gpt/` exactly
- [ ] `00-START-HERE.md` exists and points to correct sub-paths
- [ ] `09-COMMAND-CENTER/master-setup-checklist.md` references all 4 GPTs in setup order
- [ ] No broken internal cross-references in moved files
- [ ] Repo lint clean (`npm run lint` exit 0)

## Acceptance checklist

- [ ] Andrew opens `~/Desktop/LBTA-Custom-GPT-MASTER/00-START-HERE.md` → knows what to do next in 30 seconds → Check: file exists, top of file has "if you have 5/15/45 min, do X/Y/Z"
- [ ] Andrew can hand any one of 4 GPT folders (`02-GPT-BUILDS/0X-*-GPT/`) to a coach and they have everything to set up that GPT → Check: each GPT folder has 5–6 files including system-prompt.md, conversation-starters.md, capabilities.md, identity.md, README.md
- [ ] Andrew, Allison, or Saska can run a 20-minute first-session script in person → Check: 3 activation-script.md files exist (Founder, Adult, Junior — not Front Desk)
- [ ] If a public Front Desk reply hallucinates, there's a runbook to follow → Check: `05-OPERATIONS/runbooks/hallucination-incident.md` exists with steps
- [ ] If Allison or Saska resist using the GPT, there's a 1:1 talking points doc → Check: `06-COMMUNICATIONS/coach-1on1-talking-points.md` exists
- [ ] Public Front Desk has a written privacy disclosure ready before any public link → Check: `07-LEGAL-PRIVACY/privacy-disclosure-public.md` exists
- [ ] Sync script works → Check: `bash gpt/05-OPERATIONS/scripts/sync-to-desktop.sh` succeeds; desktop folder updated

## Relevant Learnings (from prior compound work)

- **System prompts must be under 8000 chars** for ChatGPT's Instructions field. Currently: founder 7,713 / adult 7,399 / junior 7,990 / front-desk 7,912. Don't bloat during the move.
- **Coach roster locked to Andrew + Peter + Allison.** Former coach (removed) explicitly removed; any new doc that mentions coaches must follow this.
- **Single canonical phone/email:** `(949) 534-0457` and `support@lagunabeachtennisacademy.com`. Andrew's personal cell appears only on `app/coaches/andrew-mateljan/page.tsx` and the legacy USTA flyer (intentional for those contexts).
- **Refund policy is the homepage 30-day guarantee + account credit after.** Aligned in `data/faq.json` already.
- **Voice anchors:** *"Tennis, as it should be taught."* / *"Movement. Craft. Community."* / *"Structure creates confidence. Confidence creates results."*
- **Forbidden words:** elite, world-class, mastery, maximize, boost, unlock, level up, game-changer, transformational, journey of excellence, unleash, dominate, crush it, sign up now, don't miss out, limited spots.

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Folder reorg breaks existing references in README | After move, grep for old paths and update |
| System prompt files balloon during copy/edit cycles | Re-verify char counts after final move |
| New files use forbidden words / off-voice copy | Apply voice-and-brand guardrails to every new file; spot-check 5 random files post-build |
| Master folder duplicates content unnecessarily | Per-GPT folders intentionally duplicate system-prompt + conversation-starters (so the folder is self-contained); knowledge brain stays single-source in 03 |
| Andrew opens master folder and feels overwhelmed | `00-START-HERE.md` as the single entry; tiered "if you have 5/15/45 min" reading paths |
| Sync script clobbers user-added files on desktop | Script does `rm -rf` of the master folder only; warn user not to edit files there directly |

## Confidence & uncertainty

🟢 **High confidence:** Architecture (9 sections), per-GPT folder structure, brand-voice consistency, runbook structure.

🟡 **Medium confidence:** Phase 4 integration specs (PlayByPoint, ActiveCampaign) — written as forward specs; actual API contracts may differ when Andrew is ready to build.

🔴 **Low confidence (will refine post-dogfood):** Voice samples templates — currently empty placeholders for Andrew/Allison/Saska to fill with real past emails. The right way to fill them is during the dogfood week, not pre-built by me.

## Closing

Ship this build, sync to desktop, hand to Andrew. Day-1 setup of all 4 GPTs becomes a 30-minute task instead of a 3-hour read-everything task. The master folder is what makes this system actually deployable without me in the room.
