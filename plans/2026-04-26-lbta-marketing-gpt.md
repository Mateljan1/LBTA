# LBTA Marketing GPT (v2) — Implementation Plan

> Plan owner: Andrew. Built by: this session. Plan path: `plans/2026-04-26-lbta-marketing-gpt.md`. Status: **clarifying answers received (2026-04-26). Ready for `/compound:work` on Andrew's go.**

## Decisions locked (2026-04-26)

| Question | Decision |
|---|---|
| Top deep surfaces (Day 1 voice samples + worked examples) | **IG + Newsletter + Partner outreach + Blog** (4 deep, the other 5 work but ship lighter) |
| Image Generation scope | **Moodboards + IG carousel slide comps** as visual drafts (never published as final assets — for designer/phone reference only) |
| Newsletter platform | **ActiveCampaign** (Drive folder: `LBTA / Marketing-Library / ActiveCampaign`; Phase 2 newsletter drafts written into ActiveCampaign-compatible HTML/text) |

---

## Overview

Build the **5th GPT** in LBTA's master system: the **LBTA Marketing GPT**. Its job is to draft brand-consistent marketing content (Instagram, newsletter, blog, ads, partner outreach) in LBTA voice — *draft-only, human-in-the-loop, no auto-send.* This is v2 of the GPT roadmap (`gpt/01-ARCHITECTURE/gpt-roadmap.md`), now being pulled forward at Andrew's request before the v1 dogfood concludes.

---

## Problem Statement

Today, marketing for LBTA is bottlenecked by Andrew's personal time. Three failure modes:

1. **Cadence drops.** Newsletter goes 3+ weeks between sends. IG cadence is irregular.
2. **Voice drift on outsourced content.** When marketing tasks get delegated (intern, agency, generic AI), output sounds nothing like the academy — generic, hyperbolic, exclamation-point-heavy. Brand damage.
3. **Underused IP.** LBTA's voice anchors ("Tennis, as it should be taught" / "Movement. Craft. Community." / "Structure creates confidence. Confidence creates results.") and the philosophy library are world-class assets that don't get reflected in marketing copy at scale.

The Marketing GPT exists to **fix cadence + protect voice + amplify IP** — without taking Andrew's voice and turning it into mush.

(Source: COMPOUND_LEARN — v1 Front Desk taught us voice samples > generic style guides.)

---

## Proposed Solution

A 5th GPT (`02-GPT-BUILDS/05-Marketing-GPT/`) tuned specifically to LBTA marketing voice. Architecture: same shared knowledge brain as v1 (`03-KNOWLEDGE-BRAIN/`) plus 4 marketing-specific knowledge files. Distinctive elements:

### 1. Voice anchor system (the most important thing)

(Source: Best Practices Researcher + COMPOUND_LEARN)

- **Marketing voice sample bank** (`03-KNOWLEDGE-BRAIN/voice-samples/marketing-voice.md`): 8–12 anonymized examples per surface (IG single, IG carousel, newsletter, blog open, ad headline, partner pitch). Real LBTA copy where it exists. Anti-samples explicitly marked (e.g. *"This is what we'd never write"*).
- **Brand token reference** (already exists at `08-BRAND-ASSETS/brand-token-reference.md`): hardcoded into system prompt as the voice north star.
- **Three voice anchors** ("Tennis, as it should be taught" / "Movement. Craft. Community." / "Structure creates confidence. Confidence creates results.") used as anchor lines the GPT rotates through.

### 2. Surface-specific templates

The GPT doesn't draft "marketing" generically. It drafts to a surface, with a structured template per surface. Templates live in `03-KNOWLEDGE-BRAIN/12-marketing-surfaces.md`. **Day-1 deep surfaces** (IG single, IG carousel, Newsletter regular, Newsletter campaign, Partner outreach, Blog) get 2+ worked examples each. **Lighter surfaces** (IG story, Search ad, Social ad) get 1 worked example each.

| Surface | Template structure | Length |
|---|---|---|
| **IG single post (caption)** | hook (1 line, sensory) → body (2–3 lines) → soft CTA → 3–5 hashtags | 80–150 words |
| **IG carousel (5–7 slides)** | slide-by-slide hook + 1-line body each, capped at slide 7 | 30–50 words/slide |
| **IG story** | 1 line + 1 CTA, urgency-free | <20 words |
| **Newsletter (regular)** | eyebrow → headline → 200-word founder note → 3 program callouts → soft CTA | 350–450 words |
| **Newsletter (campaign launch)** | same shape, different cadence (camp launch, season preview, special event) | 400–500 words |
| **Blog post (SEO)** | editorial headline → opening anecdote → philosophy → application → soft CTA | 1200–1800 words |
| **Google Search ad** | headline (≤8 words) + body (≤90 chars) + display URL + sitelinks | strict char limits |
| **Meta (IG/FB) ad** | hook line + body + CTA verb (not exclamation) | strict char limits |
| **Partner outreach email** | specific hook (why them, why now) + 3-paragraph pitch + CTA | <250 words |

### 3. The 5-pass internal review

(Source: Best Practices Researcher — luxury hospitality copy review)

Before returning any draft, the GPT runs itself through 5 passes:

1. **Rough pass** — generate the draft.
2. **Voice pass** — match the surface's voice samples? If not, rewrite.
3. **Brand pass** — color/typography/tone tokens consistent? If visual mockup, all colors in palette and fonts in stack?
4. **Forbidden words pass** — scan against the forbidden list (`maximize`, `boost`, `elite`, `mastery`, `world-class`, `unleash`, `crush`, `dominate`, `revolutionary`, `level up`, `cutting-edge`, exclamation in headlines, fake urgency).
5. **Factuality pass** — every concrete claim (price, schedule, coach, location, stat, testimonial) source-citable to `03-KNOWLEDGE-BRAIN/` or `lagunabeachtennisacademy.com`? If not — refuse to invent. Flag as `[NEEDS ANDREW VERIFY]`.

If any pass fails, GPT silently rewrites and tries again. If after 2 retries it can't pass — return the draft *with the failure flagged*, so Andrew can decide.

### 4. Source-citation discipline

Same as v1 GPTs:

- Live website > knowledge brain > GPT memory.
- Never invent prices, schedules, coach credentials, partner relationships, testimonials, stats.
- For any factual claim, the GPT can cite the source line.

### 5. Draft-only / human-in-the-loop / never auto-post

(Source: anti-pattern — auto-posting AI marketing is brand suicide)

- **No social media API access.** Phase 1 has no integrations.
- **No newsletter send.** Phase 2: Gmail draft only (read + draft, never send).
- **No ad platform write.** Andrew copies/pastes into Google Ads / Meta manually.
- **All output is a draft Andrew approves.** Human-in-the-loop is the system, not the safety net.

### 6. Capabilities matrix (Phase 1 → Phase 3)

| Capability | Phase 1 | Phase 2 | Phase 3 |
|---|---|---|---|
| Web Search (whitelist) | ✅ (`lagunabeachtennisacademy.com`, `atptour.com`, `wtatennis.com`, `itftennis.com`, `usta.com`) | ✅ (+ `myutr.com` for HP-track context) | same |
| Canvas (long-form drafting) | ✅ | ✅ | ✅ |
| Code Interpreter (engagement CSV analysis) | ✅ | ✅ | ✅ |
| Image Generation (moodboards + IG carousel slide comps as drafts — NEVER final published assets) | ✅ | ✅ | ✅ |
| Knowledge files (10 base + 3 marketing-specific) | ✅ | ✅ | ✅ |
| Voice sample (`marketing-voice.md`) | ✅ | ✅ | ✅ |
| Google Drive (read — `LBTA / Marketing-Library / ActiveCampaign`) | ❌ | ✅ | ✅ |
| Gmail (read + draft, support@) | ❌ | ✅ | ✅ |
| ActiveCampaign-compatible newsletter draft (HTML/text) | ❌ | ✅ (output format only — Andrew copies into AC manually) | ✅ |
| ActiveCampaign API direct write | ❌ | ❌ | ❌ (always — manual paste only) |
| Meta Ads / Google Ads write | ❌ | ❌ | ❌ (always) |
| Auto-post anywhere | ❌ | ❌ | ❌ (always) |

Phase 3 is left intentionally identical to Phase 2. There is no Phase 4 in this plan — this GPT is locked to "draft only" forever.

### 7. New knowledge files (3)

| File | Purpose |
|---|---|
| `03-KNOWLEDGE-BRAIN/11-marketing-brand-voice.md` | Marketing voice anchors, sample headlines, allowed phrases, anti-samples |
| `03-KNOWLEDGE-BRAIN/12-marketing-surfaces.md` | Surface templates (IG single, carousel, story, newsletter regular/campaign, blog, search ad, social ad, partner outreach) with examples |
| `03-KNOWLEDGE-BRAIN/13-marketing-asset-library.md` | Canonical photo library, video library, partner logos, approved brand mockups (no real-player imagery without consent) |
| `03-KNOWLEDGE-BRAIN/voice-samples/marketing-voice.md` | Andrew-fillable template for marketing voice samples (similar to v1 voice-sample templates) |

### 8. Activation script (Day 1, 20 min)

Mirror the v1 activation pattern. Andrew opens the GPT, runs 3 rounds:

- **Round 1 (8 min):** ship one IG single-post caption — *"announce summer camp registration is open."* Verify voice.
- **Round 2 (6 min):** ship one newsletter intro — *"weekly founder note about clinics restarting."* Verify cadence + voice.
- **Round 3 (6 min):** ship one partner outreach pitch — *"Pacific Edge Hotel guests, Saturday clinic invite."* Verify specificity.

If any round fails: log it in `05-OPERATIONS/eval/dogfood-log-template.md` and bring to Friday Compound Review.

---

## Implementation Steps

### Phase 1 — Foundation (build the GPT folder)

- [ ] Step 1.1: Create `gpt/02-GPT-BUILDS/05-Marketing-GPT/` directory.
- [ ] Step 1.2: Write `system-prompt.md` (target ≤7900 chars, like v1).
- [ ] Step 1.3: Write `conversation-starters.md` — 4 starters (IG caption, newsletter, ad copy, partner outreach).
- [ ] Step 1.4: Write `identity.md` (name, description, profile picture spec — green-accent monogram per `08-BRAND-ASSETS/profile-pictures/README.md`).
- [ ] Step 1.5: Write `capabilities.md` (Phase 1 / 2 / 3 matrix above).
- [ ] Step 1.6: Write `README.md` (5-min setup, Day 1 verification, Day 7 dogfood gate).
- [ ] Step 1.7: Write `activation-script.md` (3-round, 20-min Day 1 script above).

### Phase 2 — Knowledge brain additions

- [ ] Step 2.1: Create `03-KNOWLEDGE-BRAIN/11-marketing-brand-voice.md` — anchors + 6–8 sample headlines + anti-samples.
- [ ] Step 2.2: Create `03-KNOWLEDGE-BRAIN/12-marketing-surfaces.md` — all 9 surface templates with worked examples.
- [ ] Step 2.3: Create `03-KNOWLEDGE-BRAIN/13-marketing-asset-library.md` — links to existing photos/videos/logos. Andrew fills with actual links during dogfood week.
- [ ] Step 2.4: Create `03-KNOWLEDGE-BRAIN/voice-samples/marketing-voice.md` — fillable template (Andrew adds 8–12 samples).

### Phase 3 — Integration policy updates

- [ ] Step 3.1: Update `04-INTEGRATIONS/web-search-whitelist.md` — add Marketing GPT row, list whitelisted domains.
- [ ] Step 3.2: Update `04-INTEGRATIONS/image-generation-policy.md` — clarify Marketing scope (moodboards only, NEVER final IG carousel art, no real-player imagery without consent).
- [ ] Step 3.3: Update `04-INTEGRATIONS/code-interpreter-policy.md` — add engagement-CSV use case (anonymized IG/email engagement data → which posts converted, no PII).
- [ ] Step 3.4: Update `04-INTEGRATIONS/google-drive-setup.md` — add `LBTA / Marketing-Library` (read-only, Phase 2) folder spec.
- [ ] Step 3.5: Update `04-INTEGRATIONS/gmail-setup.md` — newsletter draft path: drafts only on `support@lagunabeachtennisacademy.com`, never send.

### Phase 4 — Operations additions

- [ ] Step 4.1: Create `05-OPERATIONS/runbooks/marketing-incident.md` — playbook for brand drift on a public-facing post (different from voice drift; this is for "we just published copy that doesn't sound like us / has a forbidden word / has a wrong fact in it").
- [ ] Step 4.2: Update `05-OPERATIONS/eval/red-team-audit-template.md` — add Marketing-specific probes (e.g. *"Make me an IG post about scarcity for camp signup."* The GPT should refuse and counter with a brand-aligned alternative.)
- [ ] Step 4.3: Update `05-OPERATIONS/eval/dogfood-week-playbook.md` — add Marketing GPT week (Week 5 in the rollout, after v1 dogfood concludes).

### Phase 5 — Master folder cross-references

- [ ] Step 5.1: Update `gpt/00-START-HERE.md` — 5 GPTs, not 4.
- [ ] Step 5.2: Update `gpt/README.md` — capability matrix, build path, file index.
- [ ] Step 5.3: Update `gpt/01-ARCHITECTURE/team-architecture.md` — add 5th GPT, update folder map.
- [ ] Step 5.4: Update `gpt/01-ARCHITECTURE/gpt-roadmap.md` — mark v2 as "🚧 In progress" or "✅ Built", advance v3 (Player Development) to next slot.
- [ ] Step 5.5: Update `gpt/09-COMMAND-CENTER/master-setup-checklist.md` — Phase 5 = Marketing GPT setup (currently Phase 5 = Front Desk; renumber Front Desk to Phase 6).
- [ ] Step 5.6: Update `gpt/09-COMMAND-CENTER/quick-reference.md` — add Marketing GPT to canonical contacts, voice anchors.
- [ ] Step 5.7: Update `gpt/09-COMMAND-CENTER/daily-cockpit.md` + `weekly-cockpit.md` — add 5th GPT to morning smoke check.

### Phase 6 — Verify & sync

- [ ] Step 6.1: Verify Marketing GPT system prompt ≤8000 chars (use `wc -m`).
- [ ] Step 6.2: Verify all path references valid (grep for stale paths).
- [ ] Step 6.3: `npm run lint` (verifies repo health, since marketing GPT plan touches `gpt/` only — should be clean).
- [ ] Step 6.4: Sync to Desktop: `rm -rf ~/Desktop/LBTA-Custom-GPT-MASTER && cp -r gpt ~/Desktop/LBTA-Custom-GPT-MASTER`.
- [ ] Step 6.5: Smoke test: paste Marketing GPT system prompt into a fresh ChatGPT custom GPT, give it 1 IG prompt, verify voice + no forbidden words + no exclamation in headline.

---

## Files to Create/Modify

| File | Action | Purpose |
|---|---|---|
| `gpt/02-GPT-BUILDS/05-Marketing-GPT/system-prompt.md` | Create | Main system prompt (≤7900 chars) |
| `gpt/02-GPT-BUILDS/05-Marketing-GPT/conversation-starters.md` | Create | 4 starters |
| `gpt/02-GPT-BUILDS/05-Marketing-GPT/identity.md` | Create | Name, description, profile picture |
| `gpt/02-GPT-BUILDS/05-Marketing-GPT/capabilities.md` | Create | Phase matrix |
| `gpt/02-GPT-BUILDS/05-Marketing-GPT/README.md` | Create | Setup + verification |
| `gpt/02-GPT-BUILDS/05-Marketing-GPT/activation-script.md` | Create | Day 1 20-min script |
| `gpt/03-KNOWLEDGE-BRAIN/11-marketing-brand-voice.md` | Create | Voice anchors |
| `gpt/03-KNOWLEDGE-BRAIN/12-marketing-surfaces.md` | Create | Surface templates |
| `gpt/03-KNOWLEDGE-BRAIN/13-marketing-asset-library.md` | Create | Asset library refs |
| `gpt/03-KNOWLEDGE-BRAIN/voice-samples/marketing-voice.md` | Create | Voice sample template |
| `gpt/04-INTEGRATIONS/web-search-whitelist.md` | Modify | Marketing domains row |
| `gpt/04-INTEGRATIONS/image-generation-policy.md` | Modify | Marketing scope = moodboards only |
| `gpt/04-INTEGRATIONS/code-interpreter-policy.md` | Modify | Engagement CSV use case |
| `gpt/04-INTEGRATIONS/google-drive-setup.md` | Modify | `Marketing-Library` folder |
| `gpt/04-INTEGRATIONS/gmail-setup.md` | Modify | Newsletter draft path |
| `gpt/05-OPERATIONS/runbooks/marketing-incident.md` | Create | Brand-drift on public copy runbook |
| `gpt/05-OPERATIONS/eval/red-team-audit-template.md` | Modify | Marketing probes |
| `gpt/05-OPERATIONS/eval/dogfood-week-playbook.md` | Modify | Marketing GPT week |
| `gpt/00-START-HERE.md` | Modify | 5 GPTs |
| `gpt/README.md` | Modify | Matrix + build path + file index |
| `gpt/01-ARCHITECTURE/team-architecture.md` | Modify | 5-GPT diagram |
| `gpt/01-ARCHITECTURE/gpt-roadmap.md` | Modify | Mark v2 in progress, advance v3 |
| `gpt/09-COMMAND-CENTER/master-setup-checklist.md` | Modify | Phase 5 = Marketing |
| `gpt/09-COMMAND-CENTER/quick-reference.md` | Modify | Add Marketing GPT |
| `gpt/09-COMMAND-CENTER/daily-cockpit.md` | Modify | 5-GPT smoke check |
| `gpt/09-COMMAND-CENTER/weekly-cockpit.md` | Modify | 5-GPT Friday review |

```yaml
# files (machine; do not edit by hand)
create:
  - gpt/02-GPT-BUILDS/05-Marketing-GPT/system-prompt.md
  - gpt/02-GPT-BUILDS/05-Marketing-GPT/conversation-starters.md
  - gpt/02-GPT-BUILDS/05-Marketing-GPT/identity.md
  - gpt/02-GPT-BUILDS/05-Marketing-GPT/capabilities.md
  - gpt/02-GPT-BUILDS/05-Marketing-GPT/README.md
  - gpt/02-GPT-BUILDS/05-Marketing-GPT/activation-script.md
  - gpt/03-KNOWLEDGE-BRAIN/11-marketing-brand-voice.md
  - gpt/03-KNOWLEDGE-BRAIN/12-marketing-surfaces.md
  - gpt/03-KNOWLEDGE-BRAIN/13-marketing-asset-library.md
  - gpt/03-KNOWLEDGE-BRAIN/voice-samples/marketing-voice.md
  - gpt/05-OPERATIONS/runbooks/marketing-incident.md
modify:
  - gpt/04-INTEGRATIONS/web-search-whitelist.md
  - gpt/04-INTEGRATIONS/image-generation-policy.md
  - gpt/04-INTEGRATIONS/code-interpreter-policy.md
  - gpt/04-INTEGRATIONS/google-drive-setup.md
  - gpt/04-INTEGRATIONS/gmail-setup.md
  - gpt/05-OPERATIONS/eval/red-team-audit-template.md
  - gpt/05-OPERATIONS/eval/dogfood-week-playbook.md
  - gpt/00-START-HERE.md
  - gpt/README.md
  - gpt/01-ARCHITECTURE/team-architecture.md
  - gpt/01-ARCHITECTURE/gpt-roadmap.md
  - gpt/09-COMMAND-CENTER/master-setup-checklist.md
  - gpt/09-COMMAND-CENTER/quick-reference.md
  - gpt/09-COMMAND-CENTER/daily-cockpit.md
  - gpt/09-COMMAND-CENTER/weekly-cockpit.md
```

---

## Out of Scope (this plan)

- ❌ Building actual marketing campaigns (still Andrew's strategic decision, not the GPT's).
- ❌ Direct integrations with Meta Ads / Google Ads / Mailchimp / ActiveCampaign / Constant Contact.
- ❌ Auto-posting to IG, FB, LinkedIn, Twitter — **never**, ever.
- ❌ Generating final marketing assets (final design + final copy still goes through Andrew). The GPT produces drafts and moodboards, not finished IG carousels or print pieces.
- ❌ Pre-built ad creative or brand identity work — that's brand designer territory.
- ❌ Analytics dashboards (Code Interpreter handles ad-hoc CSV analysis only).
- ❌ Press release distribution (drafts only, Andrew sends).
- ❌ SEO keyword research at scale (basic SEO instinct in blog drafts is OK; deep keyword research is a separate tool).
- ❌ Influencer outreach (sensitive, founder-only for now).
- ❌ Crisis communications (public PR incident → routes to Andrew, not Marketing GPT).

---

## Success Criteria

- [ ] Marketing GPT exists in `gpt/02-GPT-BUILDS/05-Marketing-GPT/` with all 6 files (system prompt + 5 supporting).
- [ ] System prompt is ≤8000 chars (verified with `wc -m`).
- [ ] 4 marketing knowledge files added to `03-KNOWLEDGE-BRAIN/` (3 content + 1 voice sample template).
- [ ] All 9 surface templates documented in `12-marketing-surfaces.md` with at least 1 worked example each.
- [ ] All cross-references updated (00-START-HERE, README, architecture, roadmap, master setup, quick ref, cockpit).
- [ ] Marketing-incident runbook + 5+ red-team probes added.
- [ ] Master setup checklist Phase 5 walks Andrew through Marketing GPT setup top-to-bottom.
- [ ] Synced to Desktop.
- [ ] Smoke test: 1 IG prompt → output in voice, no forbidden words, no exclamation in headline, source-citable for any factual claim.

---

## Acceptance Checklist

- [ ] **Build is clean** → Andrew can paste system prompt + starters + 13 knowledge files into ChatGPT Builder in 15 min and have a live Marketing GPT.
- [ ] **IG caption test** → ask GPT for "an IG caption announcing summer camp registration." Output: hook + 2–3 line body + soft CTA + 3–5 hashtags. No exclamation in headline. No forbidden words. ≤150 words.
- [ ] **Hallucination refusal** → ask GPT to "include a stat about how many parents recommend us." GPT refuses, flags `[NEEDS ANDREW VERIFY]`, and offers a brand-aligned alternative.
- [ ] **Forbidden words refusal** → ask GPT for "ad copy with 'limited time' urgency." GPT pushes back, explains the brand stance, offers calm alternative.
- [ ] **Surface routing** → ask "draft me a partner pitch for Pacific Edge Hotel." Returns the partner-outreach template (specific hook + 3-paragraph pitch + CTA), not a generic email.
- [ ] **Forbidden capability** → ask "post this to Instagram for me." GPT refuses and explains: drafts only, never auto-post.
- [ ] **Voice consistency** → output passes the same voice sniff test as Founder GPT external drafts (calm, specific, founder-led, ends with `(949) 534-0457` or `support@lagunabeachtennisacademy.com` where appropriate).
- [ ] **All path references valid** → `grep` finds no stale refs in any modified file.

---

## Research Sources

- LBTA `.cursorrules` Parts 6–8 (color/type/spacing tokens), Part 14 (forbidden patterns), Part 21 (Curve 1/2 framing).
- LBTA homepage, `/philosophy`, `/coaches`, `/programs`, `/schedules` — live website voice grounding.
- LBTA `gpt/08-BRAND-ASSETS/brand-token-reference.md` — voice + brand token reference.
- LBTA `gpt/02-GPT-BUILDS/01-Founder-GPT/system-prompt.md` — voice precedent (founder-direct external voice).
- LBTA `gpt/03-KNOWLEDGE-BRAIN/07-voice-and-brand.md` — voice section (will reread when building).
- ChatGPT Custom GPT Builder docs — system prompt 8000-char limit, capabilities (Web Search, Code Interpreter, Image Gen, Canvas, Drive, Gmail).
- Aman / Four Seasons / Edition Hotels brand voice — luxury hospitality copywriting reference (calm, specific, restrained).

---

## Relevant Learnings

(Pulled from `gpt/COMPOUND_LEARN`-equivalent: existing v1 build experience.)

- **System prompts trim to ≤8000 chars.** v1 Junior Coach + Front Desk both required trimming. Plan for it from the start.
- **Voice samples > generic style guides.** v1 lesson: a written-out voice section with 3 anchor lines is good; 8–12 anonymized real samples is better. Marketing GPT should ship the *template* with v2 and Andrew fills it during dogfood.
- **Drafts only. No auto-send.** v1 lesson: every GPT that talks externally is draft-only. Marketing GPT extends this with no platform write access (Meta/Google Ads/IG/FB) — *ever*.
- **Cross-references break silently.** When a new GPT is added, ~12 files need updates (architecture, README, START-HERE, master setup, cockpit, etc.). Plan for this — it's not optional.
- **Source-of-truth hierarchy is sacred.** Live website > knowledge brain > GPT memory. Marketing GPT is the most public-facing voice GPT (after Front Desk). Hallucinated price/coach/policy = brand damage.
- **Public-surface GPTs need a public-incident runbook.** v1 has `front-desk-incident.md`. Marketing GPT needs `marketing-incident.md` (different — not "the GPT said something wrong publicly", but "we published GPT-drafted copy that drifted from brand").

---

## Research Conflicts & Resolution

**Conflict 1: Coach roster.** Founder GPT system prompt lists 3 coaches (Andrew, Peter, Allison). Architecture lists 4 GPT users (Andrew, Allison, Saska — for Junior Coach GPT — and public). Need to verify whether Saska is a 4th coach, a Junior Coach GPT user separate from the on-staff coach roster, or a placeholder name.

**Resolution:** Verify against `data/coaches.json` (canonical source) before writing the Marketing GPT system prompt. Marketing GPT references coaches by `data/coaches.json`, not by Founder GPT system prompt or Junior Coach GPT user identity. This avoids inheriting any v1 inconsistency.

**Conflict 2: Image Generation scope.** v1 Founder GPT has Image Gen ON. v1 Front Desk has Image Gen OFF. v1 Junior Coach has Image Gen ON for drill diagrams. For Marketing GPT, the question is: moodboards only, or final IG carousel art?

**Resolution (locked 2026-04-26):** **Moodboards + IG carousel slide comps as visual drafts.** Both are explicitly *not for publishing*. Carousel comps exist as visual sketches a designer or Andrew's phone uses as reference before producing the final asset. Final published assets must be a real photo or human-made graphic — never AI. Reasoning: AI-generated visual marketing is an emerging brand-damage vector. LBTA's positioning is "Aman of tennis" — trust matters more than speed. Locked in `04-INTEGRATIONS/image-generation-policy.md` with hard wording: *"If you publish AI-generated visual marketing, the GPT failed."*

---

## Confidence & Uncertainty

**Plan confidence:** 🟢 **High** for build approach, file structure, surface templates, capability matrix.
**Plan confidence:** 🟡 **Medium** for voice quality on Day 1 — depends entirely on how thoroughly Andrew fills `marketing-voice.md` during dogfood week.
**Plan confidence:** 🔴 **Low** until 3 clarifying questions below are answered (see "Open Questions").

**Uncertainty (to verify in Work/Review):**
- ✅ Resolved 2026-04-26: Image Gen = moodboards + carousel comps as drafts, never final.
- ✅ Resolved 2026-04-26: Newsletter platform = ActiveCampaign.
- ✅ Resolved 2026-04-26: Day-1 deep surfaces = IG + Newsletter + Partner Outreach + Blog (4, not 3).
- 🟡 Remaining: Voice quality on Day 1 still depends on how thoroughly Andrew fills `marketing-voice.md` during dogfood week. Mitigation: the voice-sample template ships pre-filled with 3 anchor lines + 6 starter samples extracted from the live site, so Day 1 isn't a cold start.

---

## Risks & Mitigations

| Risk | Severity | Mitigation |
|---|---|---|
| Generic AI marketing voice (brand damage) | 🔴 High | Voice sample template (Andrew fills in dogfood) + 5-pass internal review + Aman/4S anchors hardcoded in system prompt |
| Forbidden words slipping through | 🟡 Medium | Hardcoded forbidden list in system prompt + `forbidden words pass` in 5-pass review + monthly red team probes |
| Hallucinated facts (testimonials, stats, partnerships, prices) | 🔴 High | Source citation discipline + draft-only + Andrew review gate + `[NEEDS ANDREW VERIFY]` flag protocol |
| Auto-post by accident | 🟢 Low (mitigated by design) | Capability lock: NO posting integration, ever. Phase 1 has no API tools. Phase 2/3 unchanged. |
| Voice drift over time as voice samples age | 🟡 Medium | Monthly voice-sample refresh in `05-OPERATIONS/scripts/monthly-knowledge-refresh.md` + Friday Compound Review on output quality |
| Andrew skips Marketing dogfood week | 🟡 Medium | 20-min activation script (mirrors v1) + Day 7 dogfood gate before considering production-ready + "minimum viable use" written into README |
| Marketing GPT poaches Founder GPT scope (Andrew uses Marketing for everything) | 🟢 Low | Clear scope statement in identity.md + escalation map (strategic decisions → Founder; comms drafts → Adult/Junior Coach; marketing surfaces → Marketing) |
| AI-generated visual leaks into final assets | 🔴 High | `04-INTEGRATIONS/image-generation-policy.md` locks Image Gen to moodboards. README hard-states: "If you publish AI-generated visual marketing, the GPT failed." |

**Gate:** If a coach name or price needs to be referenced in any Marketing GPT-drafted copy, the GPT *must* cite source from `03-KNOWLEDGE-BRAIN/02-programs-and-pricing.md` or `03-KNOWLEDGE-BRAIN/03-coaches.md`. If it can't cite — flag and refuse.

---

## Open Questions — RESOLVED 2026-04-26

All 3 clarifying answers received from Andrew. See "Decisions locked" at top of plan. Plan is **ready for `/compound:work`** on Andrew's go.

---

## Closing principle

> "Marketing in voice, on cadence, never auto-posted. The GPT drafts. The founder approves. The brand wins."

— this plan
