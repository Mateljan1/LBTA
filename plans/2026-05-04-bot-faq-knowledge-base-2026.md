# Bot FAQ / Knowledge Base (2026) — Implementation Plan

## Overview

Produce **one canonical reference document** with **30–40 Q&A pairs** in Andrew’s voice so the chatbot (and staff GPT builds) can answer factual questions **without inventing prices, locations, or policies**. Content is **grounded in `/data/*.json` and live site behavior**, supplemented by **themes from real SMS inbound** (`sms-log-AC_REDACTED_see_1password_2026-05-04.csv`).

## Problem Statement

- The bot has conversational tone but **lacks a single, ops-aligned facts layer** for questions like: *Where is this class?*, *How much is drop-in?*, *How do I pay on the City site?*, *What level is Intermediate LiveBall?*, *Is my registration confirmed?*
- **`gpt/03-KNOWLEDGE-BRAIN/06-faq-and-scenarios.md`** is a strong draft but can **drift from JSON** and omits many **City/app/rec1** friction topics visible in SMS.
- **`data/faq.json`** powers the public FAQ page and skews **marketing/strategic** (pathway investment, philosophy); it is **not** a safe bot-only facts sheet and mixes messaging the `.cursorrules` discourages for generic replies.

## Proposed Solution

1. **Define a new canonical file** (bot + GPT source of truth):  
   **`gpt/03-KNOWLEDGE-BRAIN/23-bot-knowledge-base-2026.md`**  
   - Structured for retrieval: **category tags**, **canonical question**, **short answer**, **`sources:` line** (JSON path or URL), **`human_when:`** when the bot must hand off.
   - **Version header**: `last_verified`, `data_git_sha` or date, pointer to `/schedules` as UI mirror.

2. **Truth pipeline (mandatory)**  
   | Fact type | Primary source |
   |-----------|------------------|
   | Program names, ages, times, locations, drop-in/season numbers | `data/spring-summer-2026.json`, `data/winter2026.json`, `data/year2026.json`, `data/fall2026.json` as applicable |
   | Leagues / USTA / pass language | `data/leagues-2026.json`, `data/pricing-supplemental.json` |
   | Private rates | `data/private-rates.json` |
   | LiveBall *concept* copy | `data/liveball.json` (nuance only — **times/levels from schedule JSON**) |
   | City catalog URL | Align with **`components/RegistrationModal.tsx`** `BASE_REC1_URL` / filtered links in repo (multiple deep links exist — **pick one canonical pattern** and document “alternate filters may appear in emails”). |
   | LBTA app | iOS/Android URLs as in repo emails: `apps.apple.com/.../lbta/id6746348933`, Play Store `com.court.laguna` |

3. **SMS → Q&A coverage** (inventory from sample log; extend by scanning full CSV for `Direction=inbound` bodies):  
   - **Venue confusion**: Moulton vs Alta vs LBHS for a given program/day.  
   - **City registration**: pay online vs in-person; confirmation **without** payment; catalog dates not updated; “green dot” / class not visible; drop-in vs multi-session booking quirks.  
   - **LiveBall**: intermediate vs advanced **times**; cancellation when **not enough players**; rain / makeup / credits.  
   - **App**: reschedule/alternate slots; blank screen after signup; notifications vs email timing.  
   - **Trials**: weekend preference, discipline-specific trial requests → honest boundary + `/book`.  
   - **Registration anxiety**: “Are we registered?” → distinguish **City payment confirms spot** vs app confirmation states.  
   - **Policies**: rain-outs, credits, overlapping age-band refunds → **only** if mirrored in `data` or existing policy doc; else **`human_when`** to front desk / support.

4. **Voice**  
   Follow **`gpt/03-KNOWLEDGE-BRAIN/05-voice-and-brand.md`** and **`gpt/03-KNOWLEDGE-BRAIN/voice-samples/andrew-voice.md`**. Avoid `.cursorrules` forbidden hype and emoji in canonical KB (SMS may use emoji; KB should stay clean for RAG).

5. **Optional Phase 2 (out of scope unless approved)**  
   - Inject summarized KB into `components/Chatbot.tsx` system context or RAG chunk list.  
   - Thin duplicate on site: **do not** replace `data/faq.json` blindly (SEO + schema differ).

## Implementation Steps

### Phase 1: Research & reconciliation
- [ ] **1.1** Parse inbound SMS CSV (script or manual tally): cluster ~**25 recurring intents**; map each to planned Q IDs.
- [ ] **1.2** Extract **all numeric and schedule facts** for Spring/Summer 2026 from `data/spring-summer-2026.json` (and winter/fall if referenced in KB).
- [ ] **1.3** Reconcile **LiveBall** copy: `spring-summer-2026.json` lists Sunday **Intermediate (3.0–4.0)** / **Advanced (4.0+)** vs description line **NTRP 2.5+ / 3.5+** — **resolve with Andrew** and make JSON + KB **one consistent story** (prefer schedule row notes for bot facts).
- [ ] **1.4** Confirm **canonical Rec1 base URL** vs marketing emails (`RegistrationModal` vs email templates); document in KB as “official link” + note that City filters vary.

### Phase 2: Draft the 30–40 Q&A pairs
- [ ] **2.1** Write **35 (+5 buffer)** pairs: **~40% City/app/payment**, **~30% where/when/which level**, **~20% pricing/packages**, **~10% policies/escalations**.
- [ ] **2.2** Each answer ≤ **120 words** where possible; include **one factual anchor** (time, price, or location) per answer when relevant.
- [ ] **2.3** Every entry ends with either **`Escalate:`** (phone/email) or **`Self-serve:`** (link) — no orphan answers.

### Phase 3: Review & alignment
- [ ] **3.1** Side-by-side diff against **`06-faq-and-scenarios.md`**: merge improvements; mark deprecated numbers in 06 or add banner “superseded by 23-bot-knowledge-base-2026”.
- [ ] **3.2** Spot-check **public site** `/schedules` vs JSON (same season): if UI loaders disagree, **fix data loader or JSON first**, then KB.

### Phase 4: Bot integration (minimum viable)
- [ ] **4.1** Add KB path to GPT **README / capabilities** (`gpt/02-GPT-BUILDS/*/capabilities.md` or `07-website-and-links.md`) so builds load **`23-bot-knowledge-base-2026.md`**.
- [ ] **4.2** If codebase chatbot reads static context, add **single import comment** in `components/Chatbot.tsx` pointing maintainers to the markdown file (no behavior change unless product asks).

### Phase 5: Acceptance & compound
- [ ] **5.1** Run checklist below with **Andrew or desk sign-off** on City-sensitive wording (confirmation vs payment, credits).

## Files to Create/Modify

| File | Action | Purpose |
|------|--------|---------|
| `gpt/03-KNOWLEDGE-BRAIN/23-bot-knowledge-base-2026.md` | **Create** | Canonical 30–40 Q&A bot facts |
| `data/spring-summer-2026.json` | **Modify only if** reconciliation finds error | LiveBall NTRP/description alignment |
| `gpt/03-KNOWLEDGE-BRAIN/06-faq-and-scenarios.md` | **Modify** | Banner + pointer to 23; reduce drift |
| `gpt/03-KNOWLEDGE-BRAIN/07-website-and-links.md` | **Modify** | Link KB + Rec1 + app URLs |
| Optional: `components/Chatbot.tsx` | **Modify** | Wire context / comment only |

```yaml
# files (for tooling; keep in sync with table)
create:
  - gpt/03-KNOWLEDGE-BRAIN/23-bot-knowledge-base-2026.md
modify:
  - gpt/03-KNOWLEDGE-BRAIN/06-faq-and-scenarios.md
  - gpt/03-KNOWLEDGE-BRAIN/07-website-and-links.md
optional_modify:
  - data/spring-summer-2026.json
  - components/Chatbot.tsx
```

## Out of scope (this plan)

- Rewriting the entire public **`app/faq`** experience or **`data/faq.json`** content strategy.
- Promising specific **City IT fixes** (catalog bugs, filter URLs) beyond “contact us + use schedules page.”
- Legal guarantees not already in written policy; arbitrary refund rules without founder-approved text.

## Success Criteria

- [ ] **34–40** Q&A pairs shipped in **`23-bot-knowledge-base-2026.md`**.
- [ ] **100%** of prices and session times in that file trace to **`/data/*.json`** or explicit **Escalate** (no guessed numbers).
- [ ] Covers **≥80%** of top SMS clusters (venue, City pay, LiveBall times/levels, app, trial entry, rain/credit handoffs).
- [ ] Voice matches Andrew samples; no forbidden marketing fluff per `.cursorrules`.

## Acceptance checklist

| Criterion | Check |
|-----------|--------|
| Pair count 34–40 | Count H2/H3 Q headings in `23-bot-knowledge-base-2026.md`. |
| Price accuracy | For each price in KB, grep matching numeric field in target `data/*.json`. |
| LiveBall times | Thu/Sat/Sun rows match `spring-summer-2026.json` `liveball.schedule` exactly. |
| Rec1 URL | Matches `RegistrationModal` constant or documented exception list. |
| SMS coverage | Matrix: intent column × “covered Y/N” for ≥15 clusters from CSV. |
| Escalation paths | Every sensitive row has `support@…` and/or `(949) 534-0457`. |

## Research Sources

- SMS export: `/Users/andrew-mac-studio/Downloads/sms-log-AC_REDACTED_see_1password_2026-05-04.csv`
- Schedule truth: `data/spring-summer-2026.json` (e.g. LiveBall block lines 294–312)
- Existing playbook: `gpt/03-KNOWLEDGE-BRAIN/06-faq-and-scenarios.md`
- Public FAQ data: `data/faq.json`, `app/faq/page.tsx`
- Rec1 patterns: `components/RegistrationModal.tsx`, `assets/emails/spring-2026/prospects/*.html`

## Relevant Learnings

- **Single source of truth for programs/pricing** is `/schedules` data pipeline (`/data/*.json`); bot KB must not contradict it. (Source: `.cursorrules` Part 12)
- **Confirmation vs payment**: SMS shows users can get **confirmation without successful City payment** — KB must state **payment through City holds the spot** (align with email footers: “payment there confirms your spot”). (Source: SMS log + `LBTA_Spring2026_Schedule_SEND_READY.html`)

## Research conflicts & resolution

| Conflict | Resolution |
|----------|--------------|
| LiveBall NTRP in JSON `description` vs `schedule` **note** fields | Use **schedule notes** for Sun Intermediate/Advanced bands in bot answers; open issue to align `description` in JSON in Phase 1.3. |
| Multiple Rec1 deep links in repo | KB lists **one primary** (same as modal base); add “filtered links in emails may differ” to avoid false contradictions. |

## Confidence & uncertainty

- **Plan confidence:** High for structure and sourcing strategy; **Medium** on exact City-office hours / credit-application steps until verified from City or internal runbook (use **Escalate** until verified).
- **Uncertainty:** Minimum players to run LiveBall (SMS says “at least 2”) — confirm with operations before stating as policy.

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| JSON and website drift | Acceptance: grep prices; spot-check `/schedules` after data changes. |
| KB becomes stale mid-season | Version header + quarterly refresh tied to season JSON updates. |
| Over-promising on City fixes | Keep language factual; defer IT issues to human. |
