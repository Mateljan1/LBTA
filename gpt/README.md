# LBTA Custom GPT — Master Folder

> **Tennis, as it should be taught.** This folder is the build, operate, and compound kit for LBTA's Custom GPTs.

## ⭐ Build Order — Read this first

| When | Folder | What it builds |
|---|---|---|
| **Today** (start here) | `01_BUILD-NOW_ADMIN-DESK-GPT/` | One internal **LBTA Admin Desk GPT** — parent questions, booking intake, program fit, reply drafts, Notion handoffs. Internal-only, draft-only. |
| **Next week** (after dogfood) | `02_BUILD-NEXT_FULL-6-GPT-PACK/` | The full **6-GPT team** — Founder, Adult Coach, Junior Coach, Front Desk (public), Marketing, and Front Desk Drafts (private). |

Older iterations live in `_ARCHIVE/`. Ignore unless debugging.

---

## Read this first

👉 **`00-START-HERE.md`** — 5-minute orientation. If you've never opened this folder, that's page 1. Then come back here for the index.

---

## Folder index (the 9 sections)

```
gpt/
├── 00-START-HERE.md               ← First-time orientation
├── README.md                      ← You are here (index + at-a-glance)
│
├── 01-ARCHITECTURE/               ← Why multiple GPTs, the team rituals, post-dogfood compound loop, gpt-roadmap
├── 02-GPT-BUILDS/                 ← Source build kits; current upload copies live in 02_BUILD-NEXT_FULL-6-GPT-PACK/
│   ├── 01-Founder-GPT/
│   ├── 02-Adult-Coach-GPT/
│   ├── 03-Junior-Coach-GPT/
│   ├── 04-Front-Desk-GPT/         ← public
│   ├── 05-Marketing-GPT/          ← v2: built Week 5
│   └── 06-Front-Desk-Draft-GPT/   ← private; built Week 6
├── 03-KNOWLEDGE-BRAIN/            ← Source knowledge brain; current upload folders already contain scoped per-GPT knowledge files
├── 04-INTEGRATIONS/               ← Gmail (read+draft), Drive (read), web-search whitelist, image-gen policy
├── 05-OPERATIONS/                 ← Runbooks, eval scripts, weekly metrics, ownership matrix
│   ├── eval/                      ← Dogfood playbook (incl. Section M for Marketing GPT), weekly metrics CSV, red-team audit (Section A: 5 ops GPTs; Section B: Marketing GPT)
│   ├── runbooks/                  ← Hallucination, voice drift, front-desk incident, marketing-incident
│   └── scripts/                   ← Friday Compound Review, monthly/quarterly/annual review
├── 06-COMMUNICATIONS/             ← Team launch announcements, coach 1:1 talking points, parent FAQ
├── 07-LEGAL-PRIVACY/              ← Privacy disclosure, internal terms, coach consent, parent consent
├── 08-BRAND-ASSETS/               ← Brand token reference, profile-picture specs, generated drop zone
└── 09-COMMAND-CENTER/             ← Master setup checklist, daily cockpit, weekly cockpit, quick reference
```

---

## At a glance: the current 6 GPTs

| GPT | User | Folder | Tools (Phase 1) | Sharing (Phase 1) |
|---|---|---|---|---|
| **LBTA Founder** | Andrew | `02_BUILD-NEXT_FULL-6-GPT-PACK/01_FOUNDER_GPT/` | Web Search, Canvas, Code Interpreter, Image Gen, Apps for Gmail/Drive drafts | Only me |
| **LBTA Adult Coach** | Allison | `02_BUILD-NEXT_FULL-6-GPT-PACK/02_ADULT_COACH_GPT/` | Web Search, Canvas, Apps for Gmail/Drive drafts | Only me → Allison |
| **LBTA Junior Coach** | Saska | `02_BUILD-NEXT_FULL-6-GPT-PACK/03_JUNIOR_COACH_GPT/` | Web Search, Canvas, Code Interpreter, Image Gen, Apps for Gmail/Drive drafts | Only me → Saska |
| **LBTA Front Desk** | Public | `02_BUILD-NEXT_FULL-6-GPT-PACK/04_FRONT_DESK_GPT/` | Web Search only; no Gmail | Only me until reviewed |
| **LBTA Marketing** | Andrew | `02_BUILD-NEXT_FULL-6-GPT-PACK/05_MARKETING_GPT/` | Web Search, Canvas, Code Interpreter, Image Gen, Apps for Gmail/Drive drafts | Only me |
| **LBTA Front Desk Drafts** | Internal front desk | `02_BUILD-NEXT_FULL-6-GPT-PACK/06_FRONT_DESK_DRAFT_GPT/` | Web Search, Canvas, Apps for Gmail/Drive drafts | Only me/internal only |

Stripe, Gmail-send, payments, roster writes, and auto-publish are **out of scope for all six**. Drafts only. Human-in-the-loop, always.

---

## Capabilities matrix

| Capability | Founder | Adult | Junior | Public Front Desk | Marketing | Front Desk Drafts |
|---|---|---|---|---|---|---|
| Web Search | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Canvas | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| Code Interpreter | ✅ | ❌ | ✅ | ❌ | ✅ | ❌ |
| Image Generation | ✅ | ❌ | ✅ | ❌ | ✅ | ❌ |
| Gmail draft Apps | ✅ draft only | ✅ draft only | ✅ draft only | ❌ | ✅ draft only | ✅ draft only |
| Google Drive read Apps | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| Stripe/payments | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Auto-send/auto-publish | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

---

## The build path (high-level)

| Week | Phase | Outcome |
|---|---|---|
| Week 1 | Phase 1 — Founder GPT solo | Andrew dogfoods. 1 founder email + 1 pre-mortem shipped. |
| Week 2 | Phase 2 — Adult Coach + Junior Coach | Allison + Saska activated; Gmail + Drive connected. |
| Week 3 | Phase 5 — Front Desk internal stress test | Internal-only. Day 28 red team audit (Section A). |
| Week 4 | Phase 6 — Front Desk public launch | Public link live. Daily monitoring for 7 days. |
| Week 5 | Phase 7 — Marketing GPT solo dogfood | Andrew runs Section M (7-day playbook) + Section B red team. Phase 2 unlock at end of Week 5. |
| Week 6 | Phase 8 — Front Desk Drafts (private) activation | Andrew + ops use it 2–3×/wk for parent reply drafts. Stays "Only me" forever. |
| Week 7+ | Compound loop | Friday ritual every week, forever. All 6 GPTs in steady state. |

Step-by-step: **`09-COMMAND-CENTER/master-setup-checklist.md`**.

---

## Daily / weekly / monthly cadence

| Cadence | Who | Doc |
|---|---|---|
| Daily smoke check (60 sec) | Andrew | `09-COMMAND-CENTER/daily-cockpit.md` |
| Friday pre-game (5 min) | Andrew | `09-COMMAND-CENTER/weekly-cockpit.md` |
| Friday Compound Review (30 min) | All 3 | `05-OPERATIONS/scripts/friday-compound-review.md` |
| Monthly knowledge refresh (60 min) | Andrew | `05-OPERATIONS/scripts/monthly-knowledge-refresh.md` |
| Monthly red team audit | Andrew | `05-OPERATIONS/eval/red-team-audit-template.md` |
| Quarterly review (90 min) | All 3 | `05-OPERATIONS/scripts/quarterly-review.md` |
| Annual strategy review (2 hr) | Andrew + advisors | `05-OPERATIONS/scripts/annual-strategy-review.md` |
| Annual legal/privacy review | Andrew + counsel | `07-LEGAL-PRIVACY/README.md` |

---

## When something goes wrong

| Symptom | Runbook |
|---|---|
| GPT made up a fact | `05-OPERATIONS/runbooks/hallucination-incident.md` |
| GPT sounds generic / not in voice | `05-OPERATIONS/runbooks/voice-drift.md` |
| Front Desk public incident | `05-OPERATIONS/runbooks/front-desk-incident.md` |
| Marketing GPT issue (forbidden word, image-gen, near-publish, fake testimonial) | `05-OPERATIONS/runbooks/marketing-incident.md` |
| Coach said *"I stopped using it"* | `06-COMMUNICATIONS/coach-1on1-talking-points.md` |
| Parent asks about AI | `06-COMMUNICATIONS/parent-faq.md` |

---

## Source-of-truth hierarchy

1. **Live website** — `https://lagunabeachtennisacademy.com/`. The truth for public-facing facts.
2. **`03-KNOWLEDGE-BRAIN/`** — what the GPTs know. Every entry traces to the website or a documented internal source.
3. **`09-COMMAND-CENTER/`** — the cockpit. If it disagrees with upstream, upstream wins.
4. **`07-LEGAL-PRIVACY/`** — annual review with counsel before public-facing change.

---

## Sync to desktop

After editing source docs in the repo, mirror **only the 9 section folders** to Desktop. Do NOT use `rm -rf` on the Desktop folder — that would delete the upload packs (`01_BUILD-NOW_…/`, `02_BUILD-NEXT_…/`) and `_ARCHIVE/`, which only exist on Desktop.

Safe sync (preserves upload packs and archive):

```bash
rsync -av --delete \
  /Users/andrew-mac-studio/LBTA_WEBSITE_DRAFT_3\:5\:26/gpt/ \
  ~/Desktop/LBTA-Custom-GPT-FINAL/ \
  --exclude '01_BUILD-NOW_ADMIN-DESK-GPT' \
  --exclude '02_BUILD-NEXT_FULL-6-GPT-PACK' \
  --exclude '_ARCHIVE'
```

---

## The 10/10 standard

By Day 90, this system is 10/10 when:

1. ✅ Architecture matches the team's real jobs (six scoped GPTs spanning operations, marketing, public answers, and private front-desk drafting).
2. ⏳ Andrew's weight is measurably lighter (8+ hrs/wk saved across operational + marketing combined).
3. ✅ Learning loop in place (Friday ritual).
4. ✅ Safe to scale (Front Desk locked, Marketing kill-switches verified, monthly red team across Sections A + B).
5. ⏳ Compounds (Week 12 visibly better than Week 1 across both surfaces).
6. ⏳ All three coaches use operational GPTs daily; Marketing GPT shipping ≥1 newsletter + ≥4 IG drafts/week.

**v1 (5 ops GPTs) + v2 (Marketing GPT) = a strong 8/10.** The path to 10/10 is in `01-ARCHITECTURE/post-dogfood-compound-loop.md`. Day 90 is the first honest audit.

---

## Closing principle

The build is the easy part. **The Friday Compound Review is the system.**

— Andrew Mateljan

> Tennis, as it should be taught — and the operations to match.
