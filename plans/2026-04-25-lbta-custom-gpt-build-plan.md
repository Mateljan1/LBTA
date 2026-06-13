# LBTA Custom GPT — Build Plan

**Date:** 2026-04-25
**Plan author:** compound-engineering · ceo-advisor · hormozi-offers · brainstorming
**Source of truth:** [lagunabeachtennisacademy.com](https://lagunabeachtennisacademy.com/) (live site) + repo `data/*.json` (operational)
**Confidence:** High on architecture · Medium on Phase 3 (public chatbot) — needs dogfood data first
**Curve classification:** Curve 2 (uncapped payoff — positioning, brand voice, parent experience). Spotter mode applied.

---

## 0. Overview

Build the LBTA Custom GPT as a **founder-extension assistant** — not a chatbot, not a sales tool. It thinks, writes, and answers like Andrew on a calm day, grounded only in what the live website and signed-off knowledge base say. Internal Phase 1 (Andrew + Robert), staff Phase 2, public-facing Phase 3 only after the first two phases are clean.

**The pitch in one sentence:** A custom GPT that knows what LBTA actually is, sounds like the founder, never invents a price or policy, and saves an hour a day on email and content drafting.

---

## 1. Problem Statement

### The five jobs the GPT must do exceptionally

1. **Draft customer-facing emails** in Andrew's calm, confident voice — replies to parent inquiries, lead follow-ups, registration confirmations.
2. **Answer staff questions** about programs, pricing, schedule, philosophy without anyone digging through Notion or the website.
3. **Generate brand-aligned content** — social posts, newsletter copy, blog drafts, ad copy.
4. **Help with practice planning** — outlines that match LBTA philosophy (Movement → Craft → Community).
5. **Surface what's already published** — quote the live website verbatim when asked about facts (phone, hours, refund, location).

### Why now

- Andrew is the bottleneck on parent comms and content — every email passes through him.
- The website is mature enough to be a usable knowledge anchor (homepage, schedules, coaches, programs all live).
- AI tooling (ChatGPT Custom GPT, file knowledge, web actions) is GA and stable in 2026.
- Compound effect: every email Andrew drafts manually instead of editing-an-AI-draft is two minutes lost. 30 emails/wk × 2 min × 50 wks = 50 hours/yr recovered. That's a coaching week.

### Why "just use ChatGPT" is not enough

Generic ChatGPT doesn't know:
- LBTA's voice (calm, confident, restraint — never salesy, no exclamation points in headlines)
- LBTA's facts (current pricing, training sites, refund policy, coach roster)
- LBTA's philosophy (Movement / Craft / Community — three pillars, not marketing fluff)
- LBTA's customer types (junior parent vs. adult player vs. high-performance pathway)

A generic LLM will invent a phone number, hallucinate a price, or write "Sign up now! Don't miss out!" copy that contradicts the brand. The custom GPT prevents this with constrained knowledge + a system prompt that says "if you don't know, you escalate to Andrew — never invent."

---

## 2. Proposed Solution — Architecture

### 2.1 Platform decision: ChatGPT Custom GPT (Builder)

**Why ChatGPT Custom GPT over alternatives:**

| Option | Pro | Con | Verdict |
|---|---|---|---|
| **ChatGPT Custom GPT** | Easiest staff onboarding (everyone has ChatGPT), file knowledge upload, Actions for Drive/Gmail, conversation starters, link-shareable | Requires ChatGPT Team/Plus seats | ✅ **Recommended for Phase 1–2** |
| Claude Project | Best output quality (Sonnet 4.5/Opus), Projects feature, larger context | Less ubiquitous in team workflow, no Actions ecosystem yet | ⚠️ Backup if ChatGPT GPT quality disappoints |
| Self-hosted (OpenAI Assistants API + custom UI) | Full control, public embed friendly | Engineering cost = ~2 weeks; over-build for Phase 1 | ⚠️ Phase 3 option for site embed |
| Anthropic Workbench / API | Same as self-hosted | Same | ⚠️ Phase 3 alternate |

**Decision:** Build the canonical GPT in ChatGPT Builder for Phase 1–2. If Phase 3 (public site embed) becomes a yes, port the system prompt + knowledge base to the OpenAI Assistants API or Vercel AI SDK with the same files. The system prompt and knowledge base are platform-portable.

### 2.2 The four pillars of "the best custom GPT out there"

Most custom GPTs fail on the same four axes. We get all four right:

1. **Identity** — knows who it is, who it's for, who it isn't (a sales bot, a generic chatbot)
2. **Knowledge** — grounded in a tight, signed-off file set (not the entire internet, not the entire Notion workspace)
3. **Voice** — sounds like the brand even on the first reply, every time
4. **Guardrails** — refuses gracefully when out of scope, escalates to human, never invents

The system prompt + knowledge base + conversation starters together are the "offer" we're stacking, in Hormozi terms. Each piece increases the dream outcome (Andrew gets time back) and decreases the perceived effort (no training, no cleanup).

### 2.3 Architecture diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                      LBTA CUSTOM GPT                             │
│                                                                  │
│  ┌─────────────────┐                                             │
│  │  System Prompt  │  ← Identity, voice, refusal rules,           │
│  │   (~1,500 wd)   │     guardrails, escalation triggers          │
│  └─────────────────┘                                             │
│         │                                                         │
│         ▼                                                         │
│  ┌─────────────────┐    ┌──────────────────────────────────┐     │
│  │ Knowledge Base  │◀───│  10 signed-off canonical .md     │     │
│  │   (uploaded     │    │  files (programs, pricing,        │     │
│  │    files)       │    │  philosophy, voice, coaches,      │     │
│  │                 │    │  policies, FAQ, locations,        │     │
│  │                 │    │  forbidden language, response     │     │
│  │                 │    │  templates)                       │     │
│  └─────────────────┘    └──────────────────────────────────┘     │
│         │                                                         │
│         ▼                                                         │
│  ┌─────────────────┐    ┌──────────────────────────────────┐     │
│  │     Actions     │───▶│  • Web Search (live site verify)  │     │
│  │  (3 max in P1)  │    │  • Google Drive read              │     │
│  │                 │    │    (Public-Safe Assets folder)    │     │
│  │                 │    │  • Gmail read + draft (support@)  │     │
│  └─────────────────┘    └──────────────────────────────────┘     │
│         │                                                         │
│         ▼                                                         │
│  ┌─────────────────┐                                             │
│  │  Conversation   │  ← 4 visible starter prompts                 │
│  │    Starters     │                                              │
│  └─────────────────┘                                             │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                          │
                          ▼
                  ┌──────────────┐
                  │  ESCALATION  │  ← When out of scope, GPT outputs
                  │   PATTERN    │     "Andrew should answer this:" +
                  │              │     suggested email draft
                  └──────────────┘
```

### 2.4 Knowledge base spec (10 files, all derived from the live site + repo)

The knowledge base is the **single most important asset**. Get this wrong, the GPT hallucinates. Get it right, the GPT cannot lie.

| # | File | Source | Length |
|---|---|---|---|
| 1 | `01-academy-facts.md` | Homepage (lagunabeachtennisacademy.com) | ~400 wd |
| 2 | `02-programs-and-pricing.md` | Homepage Programs section + `data/year2026.json` + `data/spring-summer-2026.json` | ~800 wd |
| 3 | `03-coaches.md` | Homepage Founder section + `data/coaches.json` + coach `app/coaches/*/page.tsx` | ~600 wd |
| 4 | `04-philosophy-and-voice.md` | Homepage philosophy + `.cursorrules` Part 14 + brand voice extraction | ~700 wd |
| 5 | `05-policies.md` | Homepage 30-day guarantee + reconciled FAQ + camp weather waterfall | ~500 wd |
| 6 | `06-faq.md` | `data/faq.json` (after reconciliation with homepage) | ~600 wd |
| 7 | `07-locations.md` | Homepage Contact section + training site addresses | ~250 wd |
| 8 | `08-response-templates.md` | New — drafted in Andrew's voice, 12 common scenarios | ~1,200 wd |
| 9 | `09-forbidden-language.md` | `.cursorrules` Part 14 — words/phrases the GPT must never use | ~300 wd |
| 10 | `10-escalation-rules.md` | New — when to refuse, when to escalate to Andrew | ~400 wd |

**Total knowledge base: ~5,750 words / ~30 KB.** Comfortably under any platform's file limits. Tight enough that retrieval is precise. Broad enough to cover 90%+ of asks.

### 2.5 System prompt spec (the GPT's personality)

The system prompt has 7 sections. Total target ~1,500 words. Inline-able in ChatGPT Builder's Instructions field.

```
1. WHO YOU ARE
   You are the LBTA Assistant, a founder-extension AI built for
   Andrew Mateljan, founder of Laguna Beach Tennis Academy. You
   speak with the calm, confident restraint of the brand. You are
   not a chatbot. You are not a sales tool. You are a thoughtful
   assistant that helps the team draft, answer, and decide faster.

2. WHO YOU SERVE
   - Phase 1: Andrew + Robert (internal)
   - Phase 2: Coaching team (Peter, Allison, Michelle, others)
   - Phase 3 [future]: Parents, players, prospects (public)
   You will be told which mode you are in via the conversation
   context. Default to Phase 1 if unclear.

3. THE FIVE JOBS YOU DO
   [...]

4. VOICE — HOW YOU SOUND
   - Calm, confident, specific
   - Founder's voice (read 04-philosophy-and-voice.md)
   - No exclamation points in headlines or subject lines
   - Never use forbidden words (read 09-forbidden-language.md)
   - Three-pillar framing when relevant: Movement / Craft / Community

5. GROUNDING — WHERE YOUR FACTS COME FROM
   - The live website is the source of truth for prices, phone,
     email, location, refund, programs.
   - The 10 knowledge files are the canonical reference.
   - If the user asks a fact you can't find in the knowledge base,
     say so explicitly. Do not invent.
   - For time-sensitive info (camp dates, current pricing) you
     may use Web Search to verify against lagunabeachtennisacademy.com,
     never against third-party sources.

6. ESCALATION — WHEN TO HAND OFF TO A HUMAN
   - Refund requests beyond the published 30-day guarantee
   - Medical / injury / safety questions
   - Complaints about a specific coach or session
   - Anything legal or contractual
   - Pricing for custom or non-listed programs
   - Any request you'd give 80% confidence or less
   When escalating, output:
   "This needs Andrew. Suggested draft: [your best draft]"

7. WHAT YOU NEVER DO
   - Invent a phone number, email, price, or coach name
   - Write hyperbole ("Sign up now!", "Don't miss out!")
   - Promise outcomes ("you will become a top junior")
   - Speak for Andrew on philosophy or coaching judgment
   - Quote a refund or policy not in 05-policies.md
```

### 2.6 Conversation starters (the four visible buttons on the GPT homepage)

```
1. ✏️  Draft an email reply to a parent inquiry
2. 📅  Help me explain a program (Junior, Adult, Camps, UTR)
3. 🎯  Write a social post in our brand voice
4. 🤔  What does our website say about [pricing / refunds / location]?
```

Each starter pre-loads a clarifying micro-prompt — e.g. tapping #1 inserts: *"Paste the parent's message and tell me anything about the family I should know (junior name, age, level, prior experience). I'll draft a reply in Andrew's voice."*

### 2.7 Actions / integrations (Phase 1: 3 max)

| # | Action | Purpose | Risk |
|---|---|---|---|
| 1 | **Web Search (built-in)** | Verify time-sensitive facts against `lagunabeachtennisacademy.com` only. Whitelist this domain in the action config. | Low — whitelist prevents drift |
| 2 | **Google Drive read** | Pull from `LBTA / Public-Safe Assets/` folder (logos, brand cards, current pricing PDFs). Read-only. | Low — folder-scoped permission |
| 3 | **Gmail read + draft** | Read `support@` inbox to learn from prior replies; create drafts (never auto-send). | Medium — needs OAuth scoping reviewed |

**Drive folder spec (build before Phase 1 launch):**
```
LBTA / Public-Safe Assets/
├── 01-brand/         (logos, color cards, voice guide)
├── 02-programs/      (current schedule PDF, pricing snapshot)
├── 03-policies/      (refund policy, waiver summary)
├── 04-coaches/       (bios, headshots, credentials)
├── 05-locations/     (training sites, addresses, parking)
├── 06-press/         (founder bio, D1 placement, Karue Sell story)
└── 07-templates/     (email signatures, response templates)
```

Files in this folder are mirrored from the canonical knowledge base — Drive is the read-only delivery layer for the GPT and human staff alike.

### 2.8 Guardrails (the "never invent" layer)

Three guardrails enforced via system prompt + knowledge base structure:

1. **Fact-check refusal** — "If you don't know, say 'I don't have that — let me check with Andrew' instead of guessing."
2. **Voice-check refusal** — "If you'd write a sentence that includes [forbidden word list], rewrite or refuse."
3. **Scope-check refusal** — "If the question is medical, legal, or about a specific complaint, escalate."

Each guardrail is restated in `10-escalation-rules.md` with examples.

---

## 3. Implementation Steps

### Phase 1 — Internal MVP (Week 1–2)

**Goal:** Andrew + Robert can use the GPT for daily email drafting and FAQ lookup.

#### Step 1.1: Reconcile homepage vs FAQ refund language *(BLOCKING)*
- [ ] Pin "30-Day Money-Back Guarantee · No Long-Term Commitment" as the canonical promise (matches homepage).
- [ ] Update `data/faq.json` cancellation entry to match the homepage promise + add post-30-day pro-rated credit rule (already drafted in `2026-04-25-lbta-gpt-ship-blockers-resolution-plan.md` §1 Q4).
- [ ] Run `npm run build` to verify FAQ JSON parses.
- [ ] Visual check: homepage and `/faq` page now agree.

#### Step 1.2: Fix phone-number drift across repo *(BLOCKING)*
- [ ] Replace `(949) 241-0847` with `(949) 534-0457` in:
  - `app/coaches/peter-defrantz/page.tsx`
  - `app/programs/leagues/page.tsx`
  - `assets/other info_LBTA/LBTA_USTA_League_Flyer.html`
- [ ] **Exception:** keep `(949) 241-0847` on `app/coaches/andrew-mateljan/page.tsx` (founder direct line, per `2026-04-16-preship-preview.html`).
- [ ] `rg "241-0847"` in repo to confirm only the Andrew page references it.

#### Step 1.3: Author the 10 knowledge files
- [ ] Create `gpt/knowledge/01-academy-facts.md` from homepage Contact section
- [ ] Create `gpt/knowledge/02-programs-and-pricing.md` from homepage + `data/year2026.json` + `data/spring-summer-2026.json`
- [ ] Create `gpt/knowledge/03-coaches.md` from `data/coaches.json` + coach pages (Andrew, Robert, Peter, Allison, Michelle)
- [ ] Create `gpt/knowledge/04-philosophy-and-voice.md` from homepage philosophy + `.cursorrules` Part 14 + voice extraction from existing emails
- [ ] Create `gpt/knowledge/05-policies.md` from homepage guarantee + reconciled FAQ
- [ ] Create `gpt/knowledge/06-faq.md` from reconciled `data/faq.json`
- [ ] Create `gpt/knowledge/07-locations.md` from homepage Contact section
- [ ] Create `gpt/knowledge/08-response-templates.md` (new — 12 templates: parent inquiry reply, trial confirmation, refund response, schedule conflict, level placement question, etc.)
- [ ] Create `gpt/knowledge/09-forbidden-language.md` from `.cursorrules` Part 14
- [ ] Create `gpt/knowledge/10-escalation-rules.md` (new)

#### Step 1.4: Author the system prompt
- [ ] Write `gpt/system-prompt.md` (the 7-section spec above expanded to ~1,500 words).
- [ ] Include explicit reference instructions: "When asked about pricing, always quote from `02-programs-and-pricing.md`. When in doubt, escalate."

#### Step 1.5: Build the Drive `Public-Safe Assets` folder
- [ ] Create folder structure (7 sub-folders, see §2.7).
- [ ] Mirror knowledge files into Drive as PDFs (one-way sync — repo is canonical).
- [ ] Set folder permission: integration "LBTA GPT" = Reader.

#### Step 1.6: Configure ChatGPT Custom GPT in Builder
- [ ] Name: "LBTA Assistant"
- [ ] Description (visible to staff): "Founder-extension assistant. Drafts in Andrew's voice, grounded in the live website."
- [ ] Avatar: LBTA monogram
- [ ] Instructions field: paste system prompt
- [ ] Knowledge: upload all 10 `.md` files
- [ ] Conversation starters: paste the 4 from §2.6
- [ ] Capabilities: enable Web Search (whitelist `lagunabeachtennisacademy.com`), Code Interpreter OFF, DALL-E OFF
- [ ] Actions: configure Drive read + Gmail draft (require OAuth review)
- [ ] Sharing: "Only people with the link" (private to Andrew, Robert)

#### Step 1.7: Dogfood week (Andrew + Robert, 7 days)
- [ ] Andrew uses GPT for every parent reply for 7 days, logging:
  - "GPT got it right" (count)
  - "GPT was close, needed an edit" (count + edit type)
  - "GPT was wrong, started over" (count + why)
- [ ] Robert uses GPT for staff/coaches comms.
- [ ] At end of week: review log, identify top 3 failure patterns, fix knowledge base or system prompt.

#### Step 1.8: Phase 1 retrospective
- [ ] Did the GPT save time? Quantify: hours/week recovered.
- [ ] Did it hallucinate? List every instance.
- [ ] Did it sound like the brand? Score 1–10.
- [ ] Decision gate: ship to Phase 2 (coaches) or iterate on Phase 1 for another week.

### Phase 2 — Staff rollout (Week 3–6)

**Goal:** Coaches Peter, Allison, Michelle can use the GPT for their own drafting + FAQ lookup.

#### Step 2.1: Coach onboarding doc (~1 page)
- [ ] Write `gpt/coach-quickstart.md`: how to access, what it can do, what NOT to ask, escalation rules.

#### Step 2.2: Add coach-specific scenarios to response templates
- [ ] Update `08-response-templates.md` with: schedule swap requests, parent updates after a session, level placement recommendations.

#### Step 2.3: Track Phase 2 usage for 3 weeks
- [ ] Same metrics as Phase 1 plus: which coaches use it most, which questions trip it up.

#### Step 2.4: Decision gate to Phase 3
- [ ] Hallucination rate < 1 in 50 interactions over 3 weeks → consider Phase 3 (public).
- [ ] Hallucination rate higher → harden knowledge base, do not ship public.

### Phase 3 — Public chatbot (Week 7+, conditional on Phase 2 metrics)

**Goal:** Embedded chatbot on lagunabeachtennisacademy.com answers prospect FAQs and qualifies leads.

#### Step 3.1: Port to Assistants API or Vercel AI SDK
- [ ] Same system prompt + same 10 knowledge files (zero recreation cost).
- [ ] New: rate-limiting, abuse prevention, no Drive/Gmail integration (public scope).

#### Step 3.2: UI build
- [ ] Embed in `components/ui/Chatbot.tsx` (already scaffolded per `.cursorrules` Part 13).
- [ ] Brand-aligned: Pacific Dusk header, Cormorant for the welcome line, DM Sans for body.
- [ ] Always-visible: "Talk to a human" button → routes to `/contact` or `(949) 534-0457`.

#### Step 3.3: Lead capture handoff
- [ ] When user shows enrollment intent, GPT collects: first name, email, program of interest. Hands to existing `lib/leads-store.ts` Supabase store.

#### Step 3.4: 14-day soft launch
- [ ] Behind a feature flag, 10% traffic.
- [ ] Monitor: hallucinations, escalations, lead capture conversion.

---

## 4. Files to Create/Modify

| File | Action | Purpose |
|---|---|---|
| `gpt/README.md` | Create | Index of GPT assets, build/deploy notes |
| `gpt/system-prompt.md` | Create | The full 1,500-word system prompt |
| `gpt/knowledge/01-academy-facts.md` | Create | Phone, email, address, hours, training sites |
| `gpt/knowledge/02-programs-and-pricing.md` | Create | Programs, pricing, schedule blocks |
| `gpt/knowledge/03-coaches.md` | Create | Andrew, Robert, Peter, Allison, Michelle bios + credentials |
| `gpt/knowledge/04-philosophy-and-voice.md` | Create | Three pillars + brand voice rules |
| `gpt/knowledge/05-policies.md` | Create | 30-day guarantee, post-30 credit, camp weather |
| `gpt/knowledge/06-faq.md` | Create | Reconciled FAQ from `data/faq.json` |
| `gpt/knowledge/07-locations.md` | Create | Moulton Meadows + LBHS + Alta Laguna addresses |
| `gpt/knowledge/08-response-templates.md` | Create | 12 brand-voice email templates |
| `gpt/knowledge/09-forbidden-language.md` | Create | Words/phrases the GPT must never produce |
| `gpt/knowledge/10-escalation-rules.md` | Create | When to refuse and escalate to Andrew |
| `gpt/conversation-starters.md` | Create | The 4 starter prompts + their micro-clarifiers |
| `gpt/coach-quickstart.md` | Create | Phase 2 onboarding for coaching staff |
| `gpt/eval/dogfood-log-template.md` | Create | Phase 1 logging template for Andrew + Robert |
| `data/faq.json` | Modify | Reconcile cancellation entry with homepage 30-day guarantee |
| `app/coaches/peter-defrantz/page.tsx` | Modify | Phone (949) 241-0847 → (949) 534-0457 |
| `app/programs/leagues/page.tsx` | Modify | Phone (949) 241-0847 → (949) 534-0457 |
| `assets/other info_LBTA/LBTA_USTA_League_Flyer.html` | Modify | Phone (949) 241-0847 → (949) 534-0457 |

```yaml
# files (for tooling; do not edit by hand)
create:
  - gpt/README.md
  - gpt/system-prompt.md
  - gpt/knowledge/01-academy-facts.md
  - gpt/knowledge/02-programs-and-pricing.md
  - gpt/knowledge/03-coaches.md
  - gpt/knowledge/04-philosophy-and-voice.md
  - gpt/knowledge/05-policies.md
  - gpt/knowledge/06-faq.md
  - gpt/knowledge/07-locations.md
  - gpt/knowledge/08-response-templates.md
  - gpt/knowledge/09-forbidden-language.md
  - gpt/knowledge/10-escalation-rules.md
  - gpt/conversation-starters.md
  - gpt/coach-quickstart.md
  - gpt/eval/dogfood-log-template.md
modify:
  - data/faq.json
  - app/coaches/peter-defrantz/page.tsx
  - app/programs/leagues/page.tsx
  - assets/other info_LBTA/LBTA_USTA_League_Flyer.html
```

---

## 5. Out of scope (this plan)

- The Notion cleanup workstream (separate plan: `2026-04-25-lbta-gpt-ship-blockers-resolution-plan.md` §3).
- Playwright/test automation for the public chatbot UI (Phase 3, after Phase 2 metrics greenlight).
- Migrating to Anthropic Claude Project (backup option, only if ChatGPT quality disappoints).
- Building a "GPT operator" admin dashboard (overbuilding for v1).
- Multi-language support (English-only Phase 1).
- Voice/audio interface (text-only Phase 1).

---

## 6. Success Criteria

### Phase 1 (Andrew + Robert, 7 days)
- [ ] **Hallucination rate** < 1 fact-error per 20 interactions
- [ ] **Brand voice score** ≥ 8/10 self-reported by Andrew across 20 sample drafts
- [ ] **Time savings** ≥ 30 minutes/day on parent email drafting
- [ ] **Escalation accuracy** GPT correctly escalates 100% of refund/legal/medical asks

### Phase 2 (Staff, 3 weeks)
- [ ] **Coach adoption** ≥ 3 of 4 active coaches log in at least 2x/week
- [ ] **Hallucination rate** drops to < 1 in 50 interactions (Phase 3 gate)
- [ ] **Brand voice score** ≥ 9/10 across 50 staff drafts

### Phase 3 (Public, 14-day soft launch)
- [ ] **Lead capture conversion** ≥ 5% of bot conversations end in a captured lead
- [ ] **Escalation-to-human rate** < 30% of conversations (otherwise reduce scope)
- [ ] **Zero brand-violating outputs** (forbidden language never produced in production)

---

## 7. Acceptance checklist

| # | Acceptance item | How to verify |
|---|---|---|
| AC-1 | Homepage and FAQ both quote 30-day guarantee | `data/homepage-copy.json` and `data/faq.json` parsed; visual check |
| AC-2 | All non-Andrew pages use (949) 534-0457 | `rg "241-0847"` returns only `andrew-mateljan/page.tsx` |
| AC-3 | 10 knowledge files exist, each ≤ 1,200 words, each cites source | Count files; word-count each; spot-check footers |
| AC-4 | System prompt exists, ≤ 1,500 words, includes 7 sections | Word count + section grep |
| AC-5 | ChatGPT Custom GPT created, all 10 files uploaded | Manual screen-grab from Builder |
| AC-6 | Web Search action whitelisted to lagunabeachtennisacademy.com | Builder action config screen-grab |
| AC-7 | Drive folder `LBTA / Public-Safe Assets` exists with 7 sub-folders | `gdrive ls` or screen-grab |
| AC-8 | 4 conversation starters configured | Builder UI screen-grab |
| AC-9 | Andrew completes 7-day dogfood with logged metrics | Dogfood log file populated |
| AC-10 | Phase 1 retro identifies top 3 failure patterns + fixes applied | Retro doc in `gpt/eval/` |

---

## 8. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| GPT hallucinates a price or coach name | Medium | High | Tight knowledge base + system prompt "never invent" rule + Phase 1 dogfood catches before Phase 2 |
| Brand voice drift over time | Medium | Medium | Monthly voice audit on 20 random outputs; update `09-forbidden-language.md` |
| Knowledge base goes stale (programs change, prices change) | High | High | One-way sync from repo `data/*.json` → `gpt/knowledge/*.md` quarterly; seasonal pricing changes trigger re-upload |
| Public chatbot (Phase 3) creates legal exposure | Low (Phase 3 gated) | High | Phase 3 only after Phase 2 hallucination rate < 1/50; keep "Talk to a human" button always visible |
| Andrew never adopts the GPT | Low | Medium | Phase 1 designed around his actual pain (parent email drafting); 30-min/day savings target is concrete |
| ChatGPT Builder limits change | Low | Medium | Knowledge base + system prompt are platform-portable; Anthropic backup ready |
| Coach uses GPT for something out of scope (e.g. medical advice) | Medium | High | `10-escalation-rules.md` is explicit; Phase 2 onboarding doc reinforces |
| Refund policy contradicts homepage | RESOLVED | High | AC-1 forces homepage/FAQ alignment before GPT goes live |

---

## 9. Confidence & uncertainty

- **Plan confidence: High** — the architecture is standard, the knowledge base is bounded, the Phase 1 → 2 → 3 gating is conservative.
- **Highest uncertainty:** Whether Andrew's actual brand voice can be captured tightly enough for the GPT to draft reply-ready emails on first pass. This is the dogfood week's job to measure.
- **Second uncertainty:** Whether ChatGPT Builder's file-knowledge retrieval is precise enough at our knowledge base size. If not, we move to Claude Projects (drop-in, same files).

---

## 10. Research conflicts & resolution

**Conflict:** Repo `data/faq.json` (cancellation: 48-hour-before-session refund window) vs. homepage (30-Day Money-Back Guarantee).

**Resolution:** **Homepage wins.** The homepage is the public commitment; the FAQ must align to it, not the reverse. AC-1 enforces this before the GPT ships. Post-30-day rules become "pro-rated account credit" (Hormozi-grade — preserves cash flow + customer optionality without breaking the public promise).

**Conflict:** Coach-specific phone `(949) 241-0847` on Peter, leagues page, USTA flyer vs. canonical `(949) 534-0457`.

**Resolution:** Per `2026-04-16-preship-preview.html` audit — replace everywhere except `andrew-mateljan/page.tsx` (founder direct line). AC-2 enforces.

---

## 11. Relevant learnings (from `.cursorrules` + prior plans)

- **Single source of truth:** `/data/*.json` and the live website are canonical. The GPT's knowledge base is a *projection* of these — never an independent source.
- **No forbidden language:** From `.cursorrules` Part 14 — "Maximize", "boost", "elite", "world-class", "Sign up now!", "Don't miss out!", exclamation points in headlines. Already encoded into `09-forbidden-language.md`.
- **Webhook security pattern:** Not directly relevant to GPT but the same discipline applies — never trust external input as fact, always validate against the canonical knowledge base.
- **Founder voice extraction:** The homepage already does this work — pull voice samples from "Tennis, as it should be taught," "Movement. Craft. Community.," "Structure creates confidence. Confidence creates results." These three lines anchor the entire voice spec.

---

## 12. Research sources

- [Live homepage](https://lagunabeachtennisacademy.com/) — canonical for all customer-visible facts
- `data/faq.json` — current FAQ (needs reconciliation per AC-1)
- `data/year2026.json`, `data/spring-summer-2026.json` — current programs + pricing
- `data/coaches.json` — coach roster
- `data/homepage-copy.json` — guarantee language
- `tailwind.config.ts` + `.cursorrules` Part 7 — brand kit (for any GPT-generated visual briefs later)
- `.cursorrules` Part 14 — forbidden language list
- `components/layout/Footer.tsx`, `lib/site-copy.ts` — canonical contact info
- `plans/2026-04-16-preship-preview.html` — phone-cleanup audit precedent
- `plans/2026-04-25-lbta-gpt-ship-blockers-resolution-plan.md` — sister plan resolving the 19 blockers
- OpenAI Custom GPT Builder docs (2026 — file knowledge limits, action configuration, sharing controls)

---

## 13. The three decisions you actually need to make (before I execute)

Per the LBTA Intelligent AI Usage framework: max 3 substantive questions on a Curve 2 task before delivering value. The other 16 questions from the prior plan are answered by the live website. These three are taste calls only you can make.

### Decision A — Platform: ChatGPT Custom GPT (recommended) or Claude Project?
- **Recommended: ChatGPT Custom GPT** — easiest staff onboarding, ubiquitous, ships fastest.
- **Override case:** If you want highest-quality writing today and don't mind onboarding the team to Claude, switch to Claude Project. Same knowledge base, same system prompt — fully portable.

### Decision B — Phase 1 dogfood length: 7 days or 14 days?
- **Recommended: 7 days** — get to learnings fast, fix, then either extend Phase 1 or ship Phase 2.
- **Override case:** If you'd rather stress-test for two weeks before involving Robert (or the coaches), say 14.

### Decision C — Drive folder build now or later?
- **Recommended: now (Step 1.5)** — small one-time cost, unlocks Action #2, gives staff a self-serve asset library as a side benefit.
- **Override case:** Skip Drive integration in Phase 1, ship the GPT with knowledge files only. Add Drive in Phase 2 if needed.

---

## 14. After approval — what I do next

On your sign-off (just say "go" or "go with A=ChatGPT, B=7, C=now"), I'll execute Phase 1 in this order:

1. **Step 1.1 + 1.2** (15 min) — Reconcile FAQ refund language + fix phone drift. Atomic commit: `[content] Reconcile homepage and FAQ refund policy + canonical phone`.
2. **Step 1.3** (60–90 min) — Author all 10 knowledge files. Atomic commit: `[gpt] Add canonical knowledge base for LBTA Custom GPT`.
3. **Step 1.4** (30 min) — Author the system prompt. Atomic commit: `[gpt] Add system prompt and conversation starters`.
4. **Step 1.5** (15 min, requires you) — I'll write the Drive folder spec; you create the folders + share with the GPT integration.
5. **Step 1.6** (20 min, requires you) — You build the GPT in ChatGPT Builder (paste my files + system prompt); I'll write a step-by-step screenshot-ready guide.
6. **Step 1.7** (7 days) — You + Robert dogfood; you log; I'm available to iterate on the system prompt/knowledge based on your daily feedback.
7. **Step 1.8** (1 hour) — Retro + decision gate to Phase 2.

**Total time-to-ship Phase 1:** ~3 hours of my time + 35 minutes of yours, then 7 days of dogfood. Phase 2 follows in week 3 if metrics are clean.

---

**Ready to execute on your "go."**
