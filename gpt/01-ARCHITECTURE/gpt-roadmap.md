# LBTA Custom GPT — Roadmap (v1 → v2 → v3)

> **v1 (4 ops GPTs) + v2 (Marketing GPT) + v2.5 (Front Desk Drafts private) = now built.** This document is the honest roadmap of what's built, what's deferred, and how we decide what to build next.

---

## TL;DR

| Version | GPTs | When | Status |
|---|---|---|---|
| **v1** | Founder, Adult Coach, Junior Coach, Front Desk (public) | Built (Apr 2026) | ✅ Live |
| **v2** | LBTA Marketing GPT | Built (Apr 2026) — dogfoods Week 5 | ✅ Live (Phase 1, Andrew solo) |
| **v2.5** | LBTA Front Desk Drafts GPT (private) | Built (Apr 2026) — activates Week 6 | ✅ Live (private, "Only me") |
| **v3 candidate** | LBTA Player Development GPT | Day 180+ | 📋 Sketched |
| **Deferred / fold-in** | Operations, Camp, Tournament, Finance, Hiring, Personal Assistant | TBD or already covered by v1 | 📋 Documented below |

---

## Why we built v1 + v2 + v2.5, not all 7

Three reasons, in priority order:

### 1. Anti-pattern: "GPT for everything" before any GPT is dogfooded
Building 10 GPTs on Day 1 means 10 things to maintain that haven't been validated. **The Friday Compound Review will tell us what's actually missing.** Building Player Development before the drill library is digitized would mean shipping a GPT that hallucinates drills — worse than no GPT.

### 2. v1 + v2 + v2.5 covers ~95% of comms volume
Email drafts, parent FAQs, public answers (v1) + IG, newsletter, blog, partner outreach, ads (v2) + private `support@` reply drafting in long-form parent voice (v2.5) — this is virtually all comms volume in the academy. **v3 is coaching IP, which is a different problem.**

### 3. The Knowledge Brain is shared
Adding GPT #7 (Player Development) is ~1 day of GPT setup once the drill library is digitized — the digitization is the actual work, not the GPT.

---

## The full GPT roadmap (v1 + candidates)

### v1 (built — `02-GPT-BUILDS/`)

| GPT | User | What it does | Status |
|---|---|---|---|
| **Founder** | Andrew | Strategic + operational copilot — pre-mortems, hiring, ops, founder emails | ✅ |
| **Adult Coach** | Allison | Adult-program comms, parent emails, schedule explainers | ✅ |
| **Junior Coach** | Saska | Junior-program comms, parent emails, kid-specific feedback | ✅ |
| **Front Desk (public)** | Public | Public-facing Q&A, refund/policy, trial-booking handoff | ✅ |

### v2 — LBTA Marketing GPT (BUILT)

**Who uses it:** Andrew (Phase 1 solo; Phase 2+ optional part-time marketing operator with Andrew approval)
**Folder:** `02-GPT-BUILDS/05-Marketing-GPT/`
**Marketing-specific knowledge:** `03-KNOWLEDGE-BRAIN/11-marketing-brand-voice.md`, `12-marketing-surfaces.md`, `13-marketing-asset-library.md`, `voice-samples/marketing-voice.md`
**Marketing incident runbook:** `05-OPERATIONS/runbooks/marketing-incident.md`
**Dogfood section:** `05-OPERATIONS/eval/dogfood-week-playbook.md` Section M (7-day, Andrew solo, Week 5)
**Red team section:** `05-OPERATIONS/eval/red-team-audit-template.md` Section B (8 probes)

**What it does (9 surfaces):**
- 4 deep surfaces: Newsletter (ActiveCampaign block-editor format), Instagram (carousel + single post + story), Partner outreach (cold/follow-up/yes/pitch), Blog posts (1500w+ editorial)
- 5 light surfaces: IG captions, IG stories, Google/Meta ad copy, enrollment email sequences, press / partner pitches

**Capabilities:**
- Web Search: extended whitelist (base 5 + ATP/WTA/ITF)
- Image Generation: moodboards + IG carousel slide comps **as drafts only**, always labeled `DRAFT — not for publishing`. **No realistic faces, ever.**
- Code Interpreter: anonymized engagement CSVs only (IG analytics, AC reports). No PII.
- Canvas: yes (long-form drafts)
- Gmail: Phase 2 only (read + draft, never send), authorized to Andrew's marketing inbox
- Google Drive: Phase 2 only, read-only on `LBTA / Marketing-Library/` (separate from coach `Public-Safe Assets/`)

**Hard kill-switches (verified by Section B red team):**
- Never auto-publishes, schedules, or pushes to any platform (IG, ActiveCampaign, ad platforms)
- Never generates a realistic face, especially of children
- Never fabricates a testimonial, quote, name, or stat
- Never uses a player's full name without consent log check

**Build status:** ✅ Built April 2026.
**Dogfood status:** Runs Week 5 of phased rollout (after operational 4-GPT dogfood passes).
**Phase 2 unlock gate:** 8/8 on Section B critical-fail probes (B3, B4, B5, B8) + 7/8 overall + zero forbidden-word slips on Day M7.

### v2.5 — LBTA Front Desk Drafts GPT (BUILT, private)

**Who uses it:** Andrew + ops (private; "Only me")
**Folder:** `02-GPT-BUILDS/06-Front-Desk-Draft-GPT/`
**Knowledge:** the 10 base files (no marketing files)
**Activation:** Week 6, after Marketing GPT Phase 2 unlock

**What it does:**
- Drafts replies to inbound `support@` parent/player questions in a longer paragraph form than the public Front Desk's 2–4 sentence Q&A surface
- Pre-fills the founder/ops voice with correct policy citations (30-day money-back, weather, conduct, sites)
- Routes complaints, hardship, custody, injury, and media to Andrew with a hold-reply draft

**Why this is separate from public Front Desk:**
- Different reply length and tone (public = concise FAQ; drafts = full email)
- Different read scope (drafts can read `support@` Gmail thread context; public Front Desk has no Gmail at all)
- Different audience (drafts surface = Andrew + ops only; public Front Desk = anyone with link)
- Different review path (drafts = paste-into-Gmail manually; public Front Desk = lives on website)

**Capabilities:**
- Web Search (whitelisted only)
- Canvas (longer-form drafts)
- Gmail (read + draft only) on `support@`
- Google Drive (read-only) on `LBTA / Public-Safe Assets`
- **NO** Code Interpreter, Image Gen, marketing files, or auto-send

**Hard kill-switches:**
- Never sends an email — drafts only
- Never goes public — sharing stays "Only me" forever
- Never gives Andrew's direct phone or personal email — uses `support@` and (949) 534-0457
- Never pastes founder/finance/hiring context into a parent reply

**Build status:** ✅ Built April 2026.

### v3 candidate — LBTA Player Development GPT

**Who uses it:** Andrew (and Allison/Saska in lesson prep)
**What it does:**
- Generates drill libraries by skill level, age, and time available
- Drafts individualized practice plans for HP-track juniors
- Reviews video clips (with Vision input) and gives technical feedback
- Suggests pathway recommendations based on assessment data
- Drafts coach-facing lesson plans (60 min, 90 min, group, semi-private)

**Why this is v3, not v2:**
- This is **the academy's IP** — generic AI advice ruins it
- Requires the drill library to be digitized first (currently in Andrew's head + scattered notes)
- Highest brand-risk if it goes wrong (parents trust drill quality more than email drafts)
- Best built **after** RacquetIQ pollination (it's basically a domain-specific RacquetIQ instance)

**Build effort:** ~1 week + ~2–4 weeks codifying the drill library (the real work).

**Trigger to build:** Day 90–180. After v2 ships and after the drill library is on paper. **Do not ship this without a digitized drill library** — it'll hallucinate drills, which is worse than no GPT.

---

## Candidates that should fold into v1 (don't build separately)

These all *sound* like they need their own GPT but they don't — they're better as system-prompt extensions or knowledge-file additions inside the existing 5 ops GPTs.

| Sounds like its own GPT | Actually folds into | Why |
|---|---|---|
| **Operations GPT** (schedule changes, weather, makeup classes) | Adult Coach + Junior Coach | PlayByPoint is the system of record. Coaches answer with PBP context, not LLM-generated schedule data. |
| **Camp GPT** (summer-specific FAQs, camp scheduling) | Front Desk + Junior Coach | Seasonal — add a `camp-specific.md` to `03-KNOWLEDGE-BRAIN/` instead of a separate GPT. |
| **Tournament / UTR GPT** | Junior Coach (HP-track sub-mode) | Junior Coach already covers junior performance. Add UTR + match-play data to the knowledge brain, not a new GPT. |
| **Finance / Reporting GPT** | Founder GPT + Code Interpreter | Founder GPT already has Code Interpreter. Upload anonymized CSVs and ask. New GPT = unnecessary. |
| **Hiring / Coach Management GPT** | Founder GPT | Hiring is low-volume, founder-decision work. Stays in Founder GPT until Andrew hires coach #5+. |
| **Founder Personal Assistant** | Stock ChatGPT (no custom GPT needed) | ChatGPT default + voice sample is enough. Building a custom GPT for personal calendar/travel is overkill. |

---

## The decision framework — when to build a new GPT

Before building GPT #7+, check **all four** must-haves:

### 1. Volume signal
Has the team brought up *"I wish I had a GPT for X"* **in 3+ Friday Compound Reviews**? If no — wait. If yes — proceed.

### 2. Voice / scope risk is manageable
Can we point to a voice sample (or a clear voice anchor in the system prompt) so the GPT won't drift? If no — build the voice samples first, *then* the GPT.

### 3. The 6 existing GPTs can't handle it via knowledge brain or system prompt extension
Have we tried adding it to an existing GPT first (e.g. add a `camp-specific.md` to the knowledge brain)? If we haven't tried that — try it before building a new GPT.

### 4. Andrew has 60 min to dogfood it solo before handing off
If Andrew can't carve out a dogfood week for the new GPT — don't ship it. The dogfood is non-negotiable.

**If all 4 = yes → build it. If any = no → defer.**

---

## What this means for the 7-day dogfood week(s)

The dogfood is now **two phases**:

**Weeks 1–4: Operational dogfood** (the original 4-GPT week, see `05-OPERATIONS/eval/dogfood-week-playbook.md` Section A → Day M start).
- Day 1–2: Andrew solo (Founder GPT)
- Day 3–4: Allison joins (Adult Coach GPT)
- Day 5–6: Saska joins (Junior Coach GPT)
- Day 7: All three test Front Desk GPT (public)
- Weeks 2–4: Phased rollout per `master-setup-checklist.md`

**Week 5: Marketing GPT dogfood** (Section M, Andrew solo).
- Day M1: Newsletter day
- Day M2: Instagram day
- Day M3: Partner outreach day
- Day M4: Blog day
- Day M5: Ad copy day
- Day M6: Voice + safety drill day (run B3/B4/B5/B8 critical probes)
- Day M7: Andrew's review + Phase 2 unlock decision

**Week 6: Front Desk Drafts (private) activation** (Andrew + ops).
- Day D1–2: Andrew dogfoods solo on 5 real `support@` threads
- Day D3–5: Ops joins; drafts go through Andrew's review before paste
- Day D6: Run Section A critical probes against the drafts surface
- Day D7: Confirm "Only me" sharing locked, log first metrics

You are **not** dogfooding Player Development (v3). It doesn't exist yet, and shouldn't until the drill library is digitized.

What you *are* doing in weeks 1–5:
- Logging *"I wish my GPT would do X"* moments in `05-OPERATIONS/eval/dogfood-log-template.md`
- Tracking forbidden-word slips, near-publishes, and image-gen near-misses on Marketing GPT week (5)
- Counting how often X is *"draft a coaching plan"* vs. *"generate a drill"* — that count drives v3 timing

---

## Honest self-assessment of v1 + v2 + v2.5

| Aspect | v1+v2+v2.5 grade | Path to 10/10 |
|---|---|---|
| Architecture (6 GPTs aligned to real roles, public/private/marketing separated) | 9/10 | This is the right shape. v3 closes coaching-IP gap. |
| Coverage of comms workload (1:1 + 1-to-many + private long-form drafts) | 9/10 | v2 closes the marketing comms gap; v2.5 closes the long-form `support@` drafting gap. |
| Coverage of total LBTA workload | 7/10 | Coaching IP (drill library, technical feedback) not yet covered. v3 closes this. |
| Quality of each GPT (voice, scope, safety) | 7/10 | Voice samples are templates, not filled. That's the next 60-min task per role (6 roles × 60 min). Marketing GPT also needs `marketing-voice.md` filled with 10–14 anonymized samples before Phase 2 unlock. |
| Marketing-specific safety (kill-switches, image-gen, consent) | 9/10 | Section B red team covers it. Verified weekly during Marketing GPT week 5 dogfood. |
| Compound learning system | 9/10 | Friday ritual + monthly red team (Sections A + B) + quarterly review are baked in. |
| **Overall v1+v2+v2.5 score** | **8/10** | Day 90 audit (after Marketing GPT Phase 2 unlocks + Drafts in steady state + voice samples filled) is the first honest 10/10. |

**v1 + v2 + v2.5 ships strong. v3 (Player Development) is the destination.**

---

## What changes if you say "no, build everything now"

If Andrew overrides and says *"build all 7 GPTs now"* — here's what would happen:

- **Risk:** Voice samples are still empty. 7 GPTs × 0 voice samples = 7 GPTs that sound generic on Day 1.
- **Risk:** No dogfood data → we'd be guessing at scope.
- **Risk:** 7 GPTs to maintain in the Friday ritual instead of 6 — which is more weight, not less.
- **Cost:** 2–3 more days of build (Player Dev), and we're shipping into uncertainty.
- **Benefit:** Andrew has more options to test in week 1.

**Recommended posture:** Ship v1, dogfood for 30 days, **then** build v2 + v2.5 with real data. Don't outrun the team's ability to use what we've built.

If Andrew disagrees → say so in the Friday Compound Review on Day 7. Then build #7 (Player Development) in week 2.

---

## The shape of the future

In 12 months, this folder probably looks like:

```
gpt/
├── 02-GPT-BUILDS/
│   ├── 01-Founder-GPT/                ← v1 ✅
│   ├── 02-Adult-Coach-GPT/            ← v1 ✅
│   ├── 03-Junior-Coach-GPT/           ← v1 ✅
│   ├── 04-Front-Desk-GPT/             ← v1 ✅ (public)
│   ├── 05-Marketing-GPT/              ← v2 ✅ (Apr 2026)
│   ├── 06-Front-Desk-Draft-GPT/       ← v2.5 ✅ (Apr 2026, private)
│   └── 07-Player-Development-GPT/     ← v3 (Day 180+)
└── 03-KNOWLEDGE-BRAIN/
    ├── (10 base files)           ← v1 ✅
    ├── 11-marketing-brand-voice.md  ← v2 ✅
    ├── 12-marketing-surfaces.md     ← v2 ✅
    ├── 13-marketing-asset-library.md← v2 ✅
    ├── camp-specific.md          ← Added in summer for camp season
    ├── tournament-utr.md         ← Added when Saska's HP-track is dogfooded
    └── drill-library.md          ← Required before v3 ships
```

That's the destination. Not 10 GPTs. **7 deeply-tuned GPTs + a deep knowledge brain.**

---

## Closing principle

The mistake on Day 1 isn't *"we built only 6."* The mistake on Day 1 would be *"we built 10 and dogfooded 0."*

> Build narrow. Dogfood. Learn. Then expand.

— Andrew Mateljan
