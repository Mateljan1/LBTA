# LBTA Custom GPT — Team Architecture

> The system that takes weight off Andrew and lets Allison and Saska be their best.

---

## The 6-GPT system

Six role-tuned GPTs. The five operational GPTs share **one** knowledge brain (the 10 base files in `03-KNOWLEDGE-BRAIN/`). The Marketing GPT also gets that brain plus three marketing-specific extensions (files 11–13). Each GPT pulls from the same source of truth but is sharpened for a specific job.

| GPT | User | Focus | Status |
|---|---|---|---|
| **LBTA Founder GPT** | Andrew | Strategy, hires, inbox triage, founder emails, code/CSV | Phase 1 (Week 1) |
| **LBTA Adult Coach GPT** | Allison | Adult programs, USTA leagues, ladies' team, schedules | Phase 2 (Week 2) |
| **LBTA Junior Coach GPT** | Saska | Kids 4–17, camps, match play, parent comms, pathway | Phase 2 (Week 2) |
| **LBTA Front Desk GPT (public)** | Public (eventually on website) | Hours, programs, pricing, booking link, top FAQs only | Phase 3 (Week 3–4) |
| **LBTA Marketing GPT** | Andrew (Phase 1 solo) | Newsletter, IG, blog, partner outreach, ads (one-to-many copy only) | Phase 7 (Week 5) |
| **LBTA Front Desk Drafts GPT (private)** | Andrew + ops | Drafts replies to inbound parent/player questions in `support@` voice — never customer-facing | Phase 8 (Week 6) |

---

## Why six, not one — and why Marketing + private Drafts are separated

Three internal operational GPTs (Founder + Adult Coach + Junior Coach) because:
- A 9-year-old's parent needs a different reply tone than a USTA captain
- Allison shouldn't have to wade through junior pricing to find adult league logistics
- Saska shouldn't get strategic hire advice mixed into a "my kid cried at camp" reply
- Andrew gets the unfiltered, blunt-internal version with code interpreter and full inbox access

One **public** Front Desk GPT because:
- The website needs a 24/7 front desk that **never** drifts policy, never emails on its own, never gives Andrew's direct line, and stays in a sandbox
- That's a fundamentally different risk profile than the internal three

One **private** Front Desk Drafts GPT because:
- Andrew + ops need a fast way to draft `support@`-voiced replies to inbound parent/player questions without exposing internal context (founder cell, hiring, finances) the public Front Desk can't see
- It uses the same shared brain but writes in a longer, paragraph-form reply voice (not the public Q&A constraints)
- Stays "Only me" forever — drafts paste into Gmail, never post to a public surface

One **separate** Marketing GPT because:
- One-to-many copy is a different surface than 1:1 parent emails — different voice, different review process, different kill-switches (no auto-publish, no realistic faces, no fabricated testimonials)
- Marketing voice has its own forbidden-word list (no "elite," "maximize," "world-class," "unleash") that a coach GPT shouldn't have to load
- Different integrations: extended web-search whitelist (ATP/WTA/ITF), `LBTA / Marketing-Library` Drive folder, marketing-inbox Gmail draft access — all separate from coach scope
- A 5-pass internal review (rough → voice → brand → forbidden-words → factuality) is overkill on a 1:1 email and exactly right on a public IG caption

---

## Shared brain (don't touch — these update once)

All six GPTs upload the 10 base knowledge files. The Marketing GPT also adds files 11–13:

```
03-KNOWLEDGE-BRAIN/
├── 01-academy-facts.md          (canonical phone, email, address, sites)
├── 02-programs-and-pricing.md   (every program, every price, current season)
├── 03-coaches.md                (Andrew + Peter + Allison; Robert removed)
├── 04-policies.md               (30-day guarantee, weather, waivers, conduct)
├── 05-voice-and-brand.md        (voice anchors, forbidden words, colors, fonts)
├── 06-faq-and-scenarios.md      (top 30 inbound questions with model answers)
├── 07-website-and-links.md      (full sitemap, conversion routing)
├── 08-email-templates.md        (8 founder-voice email drafts)
├── 09-philosophy-and-stories.md (founder story, three pillars, success stories)
├── 10-guardrails-and-escalation.md (the 5 hard rules + escalation table)
├── 11-marketing-brand-voice.md  ← Marketing GPT only
├── 12-marketing-surfaces.md     ← Marketing GPT only (templates for 9 surfaces)
├── 13-marketing-asset-library.md← Marketing GPT only (image-gen + consent rules)
└── voice-samples/
    ├── andrew-voice.md
    ├── allison-voice.md
    ├── saska-voice.md
    ├── lbta-public-voice.md
    └── marketing-voice.md       ← Marketing GPT only
```

When you change a base knowledge file (01–10), **re-upload into all six GPTs.** When you change a marketing-only file (11–13 or `voice-samples/marketing-voice.md`), **re-upload into the Marketing GPT only.** This is the single source of truth.

---

## Per-GPT differences (the lens)

### What stays identical across all six
- Voice anchors ("Tennis, as it should be taught," "Movement. Craft. Community.")
- Forbidden words list
- Canonical phone (949) 534-0457 and email support@lagunabeachtennisacademy.com
- Currency, date, name conventions
- The 30-day guarantee policy
- Coach roster (Andrew, Peter, Allison)

### What changes per role
| Dimension | Founder | Adult Coach | Junior Coach | Front Desk (public) | Marketing | Front Desk Drafts (private) |
|---|---|---|---|---|---|---|
| Default tone | Direct, blunt, peer | Warm, professional, captain | Warm, gentle, parent-aware | Warm, low-pressure, concise | Editorial, restrained, founder-led | Warm, helpful, support@ voice |
| Default reply length | Whatever Andrew needs | 4–8 sentences | 4–8 sentences | 2–4 sentences | Surface-shape (caption / newsletter section / blog post) | 4–10 sentences, paragraph form |
| Inbox draft authority | Full | Adult/league only | Junior/parent only | None | Marketing inbox draft only (Phase 2) | Full draft authority on `support@` parent/player threads |
| Strategic questions | Yes | Redirect to Andrew | Redirect to Andrew | Hard refuse | Redirect to Andrew | Redirect to Andrew |
| Hire / staffing topics | Yes | Redirect to Andrew | Redirect to Andrew | Hard refuse | Hard refuse (no hiring posts) | Redirect to Andrew |
| Andrew's direct line | On request | Emergencies only | Emergencies only | Never | Never (always support@) | Never — drafts use support@ |
| Kid behavior / safety topics | Routes to Saska | Routes to Saska or Andrew | Direct authority | Routes to support@ | N/A — never publishes individual kids | Drafts a hold-reply, flags for Andrew |
| USTA / adult league | Routes to Allison | Direct authority | Routes to Allison | Generic info only | Generic public info only | Drafts general info, flags for Allison if specific |
| Auto-publish to any platform | ❌ | ❌ | ❌ | ❌ | ❌ (hard kill-switch) | ❌ (drafts only — paste into Gmail manually) |
| Realistic-face image gen | Asset briefs only | ❌ | ❌ | ❌ | ❌ (hard kill-switch) | ❌ |

---

## Per-GPT tool connections

### Phase 1 (week 1) — Founder GPT only
- Web Search (whitelisted: lagunabeachtennisacademy.com, playbypoint.com, myutr.com, usta.com, gptca.com)
- Code Interpreter (CSV/roster work)
- Image Generation (asset briefs only — never fake player photos)
- Canvas (long-form drafts)
- Knowledge files (all 10)

### Phase 2 (week 2) — add Allison + Saska
Each gets:
- Web Search (same whitelist)
- Canvas
- Knowledge files (all 10)
- **Gmail (read + draft only)** on `support@` — drafts only, never sends. This is the highest-ROI connection. Andrew reviews drafts before send.
- **Google Drive (read-only)** on the `LBTA / Public-Safe Assets` folder

Saska adds:
- **Image Generation** (for parent visuals — practice plans, drill diagrams, weekly summaries)

### Phase 3 (week 3+) — Front Desk goes public
- Web Search (whitelisted only)
- Knowledge files (all 10)
- **NO Gmail. NO Drive. NO Code Interpreter. NO Image Gen.**
- Hard sandbox: zero ability to act on accounts, only ability to inform and route to `/book` or `support@`
- Embedded on website only after 2-week internal burn-in by team

### Phase 7 (week 5) — Marketing GPT solo dogfood (Andrew only)
- **Web Search (extended whitelist):** base 5 + atptour.com + wtatennis.com + itftennis.com (for tournament context, never roster claims)
- **Knowledge files:** all 10 base + files 11–13 + `voice-samples/marketing-voice.md`
- **Code Interpreter:** anonymized engagement CSVs only (IG insights export, AC newsletter export with PII stripped)
- **Image Generation:** moodboards + IG carousel slide comps **as drafts only**, always labeled `DRAFT — not for publishing`, never realistic faces, never published-as-final
- **Canvas:** long-form drafts (newsletter, blog)
- **NO direct API write access** to Instagram, Mailchimp, ActiveCampaign, ad platforms — ever. All output is paste-ready copy in the platform's native block format.

### Phase 8 (week 6+) — Marketing GPT Phase 2 unlock (gated)
After 7-day Marketing dogfood passes (`05-OPERATIONS/eval/dogfood-week-playbook.md` Section M), unlock:
- **Gmail (read + draft only)** on Andrew's marketing inbox — partner outreach drafts, newsletter drafts in ActiveCampaign-paste format
- **Google Drive (read-only)** on `LBTA / Marketing-Library` — campaigns, assets, anonymized AC reports

Phase 3 (read-only AC custom action) is deferred until ActiveCampaign exposes a stable read API and the GPT has 4 weeks of clean Phase 2 dogfood.

### Phase 8 (week 6+) — Front Desk Drafts GPT (private)
- **Web Search (whitelisted only)** — same base whitelist as the public Front Desk
- **Knowledge files:** all 10 base files (no marketing files)
- **Canvas:** longer-form draft replies
- **Gmail (read + draft only)** on `support@` — drafts only, never sends. Andrew + ops review before paste-and-send.
- **Google Drive (read-only)** on `LBTA / Public-Safe Assets`
- **NO Code Interpreter, NO Image Gen** — this is a writing surface only
- **Sharing: Only me** — never public, never shared with link.

---

## Connection priority (the weight-off-Andrew order)

🟢 **Highest ROI first. Connect in this order, not the other way around:**

1. **Gmail draft on support@** — saves 5–10 hours/week of inbox work
2. **Google Drive read on Public-Safe Assets** — kills the "where is the schedule PDF?" loop
3. **PlayByPoint read** (when API/integration available) — real-time program availability
4. **ActiveCampaign read** (Phase 4) — personalize replies by lead history
5. **Web Search** — useful, low ROI; works without external connection

Web search alone takes very little weight off you. Inbox drafting takes a lot.

---

## What the Front Desk GPT will and will not do

### ✅ Will
- Quote published prices ($50 drop-in, $420 seasonal, $840 committed; $495/$325 camp)
- Recommend a program by age/level using `06-faq-and-scenarios.md`
- Point to `/book` for trials
- Share canonical phone and email
- Describe the three sites (LBHS, Moulton Meadows, Alta Laguna Park)
- Explain the 30-day money-back guarantee verbatim
- Offer to have Andrew's team email them back within 4 business hours

### ❌ Will not
- Draft any email
- Give Andrew's personal phone or email
- Make a coach assignment
- Offer custom pricing or scholarships
- Discuss specific players, parents, or staff
- Speculate on a child's future ranking, college, or pathway
- Engage with complaints — those route immediately to support@
- Open or close trial slots, refund anything, or "take" a registration

The Front Desk GPT's only verbs are **inform** and **route**.

---

## The Friday compounding ritual (30 minutes, weekly)

Every Friday at 4:30pm Pacific, Andrew + Allison + Saska run this ritual:

1. **Each person shares 1 great answer their GPT gave this week** (something they'd send as-is)
2. **Each person shares 1 weak answer their GPT gave this week** (where they had to rewrite)
3. **Andrew picks 1–3 fixes** that go into the knowledge files this week
4. **Re-upload** updated knowledge files into all six GPTs
5. **Done.** Knowledge core gets sharper every Friday.

Without this ritual, the GPTs decay. With it, they compound.

See `team-rituals.md` for the full agenda and a copy-paste template.

---

## Phase rollout calendar

| Week | Phase | Who | What ships |
|---|---|---|---|
| 1 | Internal MVP | Andrew solo | Founder GPT live; dogfood week with `dogfood-week-playbook.md` Section A |
| 2 | Staff rollout | Andrew + Allison + Saska | Adult Coach + Junior Coach GPTs live; Gmail draft + Drive read connected; first Friday ritual |
| 3 | Front Desk burn-in | Internal team | Front Desk GPT live but only used by team to test customer scenarios |
| 4 | Front Desk public | Public | Front Desk GPT embedded on website with kill switch and human escalation path |
| **5** | **Marketing solo dogfood** | **Andrew solo** | **Marketing GPT Phase 1 live; 7-day dogfood per `dogfood-week-playbook.md` Section M; Gmail/Drive locked** |
| 6 | Marketing Phase 2 unlock + Front Desk Drafts activation | Andrew + ops | If dogfood passes: Marketing GPT gets marketing-inbox Gmail draft + `LBTA / Marketing-Library` Drive read. Front Desk Drafts GPT goes live (private, "Only me") for `support@` reply drafting. |
| 7+ | Compounding | Team | Friday ritual every week; knowledge files (incl. 11–13) get sharper; metrics tracked (see `team-rituals.md`) |

---

## Success metric

The 10/10 test, measured weekly:

- Andrew: **5+ hours/week** of inbox + admin time saved (target by week 4)
- Allison: **3+ hours/week** of league + scheduling time saved (target by week 4)
- Saska: **3+ hours/week** of parent comms + camp prep time saved (target by week 4)
- Front Desk (public): **70%+ of inbound web inquiries answered without human touch** (target by week 8)
- **Marketing: 4+ hours/week** of newsletter + IG + partner outreach time saved (target by week 8, 3 weeks after Marketing GPT launch)
- **Front Desk Drafts (private): 2+ hours/week** of `support@` reply drafting time saved (target by week 10)

Track these in the Friday ritual. If we're not hitting these by week 8, the architecture is wrong, not the GPTs.

---

## Where the files live now (the 9-section master folder)

```
gpt/
├── 00-START-HERE.md                           ← First-time orientation
├── README.md                                  ← Master index
├── 01-ARCHITECTURE/                           ← This file lives here
├── 02-GPT-BUILDS/                             ← Per-GPT folders (6 of them)
│   ├── 01-Founder-GPT/                        ← Andrew's system prompt + identity + capabilities
│   ├── 02-Adult-Coach-GPT/                    ← Allison's
│   ├── 03-Junior-Coach-GPT/                   ← Saska's
│   ├── 04-Front-Desk-GPT/                     ← Public
│   ├── 05-Marketing-GPT/                      ← Andrew (one-to-many copy)
│   └── 06-Front-Desk-Draft-GPT/               ← Andrew + ops (private support@ drafts)
├── 03-KNOWLEDGE-BRAIN/                        ← Shared brain (10 base files) + 11–13 marketing-only + voice samples
├── 04-INTEGRATIONS/                           ← Gmail, Drive, web search, etc.
├── 05-OPERATIONS/                             ← Runbooks + eval + scripts
│   ├── eval/                                  ← Dogfood playbook (Section A + Section M) + weekly metrics + red team (Section A + Section B)
│   ├── runbooks/                              ← Hallucination, voice drift, front-desk incident, marketing-incident
│   └── scripts/                               ← Friday Compound Review, monthly/quarterly/annual
├── 06-COMMUNICATIONS/                         ← Team launch, coach 1:1, parent FAQ
├── 07-LEGAL-PRIVACY/                          ← Disclosure, terms, consent
├── 08-BRAND-ASSETS/                           ← Profile pictures, brand tokens
└── 09-COMMAND-CENTER/                         ← Master setup checklist + cockpit
```

Build instructions live in **`09-COMMAND-CENTER/master-setup-checklist.md`**.
