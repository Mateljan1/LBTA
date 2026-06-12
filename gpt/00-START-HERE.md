# 00 — START HERE

**This is the master folder for LBTA's Custom GPT system. Read this in 3 minutes.**

---

## What is this folder?

This is the build kit + operations system for LBTA's GPTs. There are two layers:

1. **Build folders** (`01_…`, `02_…`) — drag-and-drop ready to upload into ChatGPT GPT Builder. *This is what you actually use day to day.*
2. **Source / docs folders** (`01-ARCHITECTURE/` through `09-COMMAND-CENTER/`) — the documented system: why it's built this way, runbooks, voice samples, brand tokens, weekly cockpit. *Read these when you want to understand or update something.*

If you've never opened this before — start with the box below. Skip everything else.

---

## ⭐ What do I do RIGHT NOW?

### Step 1 — Build the Admin Desk GPT first (today, ~30 min)

Open this folder:

```
01_BUILD-NOW_ADMIN-DESK-GPT/
```

Inside it: `00_READ_ME_FIRST.md` is a 7-step build guide. One GPT, 10 knowledge files, internal use only. Used for parent intake, booking questions, draft replies, Notion handoffs.

**This replaces the "should I build all 6 GPTs at once?" decision. Build this one. Use it for a week. Then come back for Step 2.**

### Step 2 — Build the full 6-GPT team (next week, ~2 hours)

Open this folder:

```
02_BUILD-NEXT_FULL-6-GPT-PACK/
```

Inside it: `00_READ_ME_FIRST.md` is a 10-step build guide per GPT. The 6 GPTs are:

1. **LBTA Founder GPT** — Andrew's strategic + operational copilot.
2. **LBTA Adult Coach GPT** — Allison's adult-program copilot.
3. **LBTA Junior Coach GPT** — Saska's junior-program copilot.
4. **LBTA Front Desk GPT** — public-facing answer machine.
5. **LBTA Marketing GPT** — Andrew's one-to-many copy partner.
6. **LBTA Front Desk Draft GPT** — private support-inbox drafting only.

Two reference files in that same folder:

- `APPS_CANVAS_REFERENCE.md` — which Apps to connect to which GPT.
- `DRAFT_EMAILS_AND_NOTION_HANDOFF_REFERENCE.md` — Gmail draft + Notion workflow rules.

---

## The folder structure (cleaned up Apr 27, 2026)

```
LBTA-Custom-GPT-FINAL/
│
├── 00-START-HERE.md                     ← You are here
├── README.md                            ← Index
│
├── 01_BUILD-NOW_ADMIN-DESK-GPT/         ← ⭐ START HERE — single GPT, build today
├── 02_BUILD-NEXT_FULL-6-GPT-PACK/       ← Next step — full 6-GPT team
│
├── 01-ARCHITECTURE/                     ← Why this is built the way it is
├── 02-GPT-BUILDS/                       ← Source build kits (each GPT's source)
├── 03-KNOWLEDGE-BRAIN/                  ← Source knowledge base
├── 04-INTEGRATIONS/                     ← Gmail, Drive, web search policies
├── 05-OPERATIONS/                       ← Runbooks, eval, weekly metrics
├── 06-COMMUNICATIONS/                   ← Team launch, parent FAQ, coach 1:1s
├── 07-LEGAL-PRIVACY/                    ← Privacy disclosure, consent, terms
├── 08-BRAND-ASSETS/                     ← Profile pictures, brand tokens
├── 09-COMMAND-CENTER/                   ← Master setup checklist + cockpit
│
└── _ARCHIVE/                            ← Old iterations — ignore unless debugging
```

**Sort order is intentional:** `00 → 01_BUILD-NOW → 02_BUILD-NEXT → 01-09 docs → _ARCHIVE`. The two folders you actually upload from are pinned right under this file.

---

## How to use this folder

Pick the path that matches you:

### Path A — "I'm building these for the first time" (most likely)

1. Read this file. ✅ (you are doing it)
2. Open `01_BUILD-NOW_ADMIN-DESK-GPT/00_READ_ME_FIRST.md`. Build that GPT today.
3. Use it for one week (the "dogfood week" — see `05-OPERATIONS/eval/dogfood-week-playbook.md`).
4. Then open `02_BUILD-NEXT_FULL-6-GPT-PACK/00_READ_ME_FIRST.md`. Build the team.

### Path B — "I'm running these every day"

1. `09-COMMAND-CENTER/daily-cockpit.md` each morning (60 sec).
2. Friday at 11:55 AM: `09-COMMAND-CENTER/weekly-cockpit.md` → run `05-OPERATIONS/scripts/friday-compound-review.md`.

### Path C — "I'm onboarding a coach (Allison or Saska)"

1. Confirm signed `07-LEGAL-PRIVACY/coach-consent-form.md`.
2. Run their `02-GPT-BUILDS/0X-XXX-GPT/activation-script.md` (20 min, side-by-side).
3. Day-2 follow-up: `06-COMMUNICATIONS/team-launch-announcement.md`.

### Path D — "Something just broke"

- Hallucination → `05-OPERATIONS/runbooks/hallucination-incident.md`.
- Voice drift → `05-OPERATIONS/runbooks/voice-drift.md`.
- Front Desk public incident → `05-OPERATIONS/runbooks/front-desk-incident.md`.
- Marketing GPT issue → `05-OPERATIONS/runbooks/marketing-incident.md`.

### Path E — "I just want a phone number / hex code / file location"

- `09-COMMAND-CENTER/quick-reference.md`. Pin it to your desk.

---

## Source-of-truth rules

1. **The live website (`https://lagunabeachtennisacademy.com/`) is the source of truth for all public-facing facts.** Pricing, refund policy, contact info, schedules. If a knowledge file disagrees with the website, the website wins.
2. `**03-KNOWLEDGE-BRAIN/`** is the source of truth for what the GPTs know. The two `BUILD` folders contain *copies* of the relevant scoped slices for each GPT.
3. `**09-COMMAND-CENTER/*`* is the cockpit. If a number disagrees with an upstream file, the upstream file wins.
4. `**07-LEGAL-PRIVACY/**` is reviewed annually with counsel before any public-facing change.

---

## What this folder is NOT

- ❌ A drop-in product. It's a build kit + operations system. You still have to paste prompts into ChatGPT, run the dogfood week, and hold the Friday ritual.
- ❌ A replacement for coaches. The GPTs draft; coaches own the relationship and ship the output.
- ❌ Auto-send anything. No GPT here ever sends an email, takes a payment, or modifies a registration. Drafts only. Human-in-the-loop, always.

---

## Why "Admin Desk GPT first" instead of all 6 at once

Because shipping one is how you find out what's wrong. The full 6-GPT pack works on paper; the Admin Desk GPT will tell you in week 1 whether the knowledge base is right, whether the voice matches Andrew's actual voice, whether the safety rails are too tight or too loose. Fix that once, then ship the team.

This is the "loss-function iteration" rule from the framework: change one variable, measure, decide. Don't ship 6 GPTs and try to debug all of them at once.

Full reasoning: `01-ARCHITECTURE/team-architecture.md` (5 min).

---

## Closing

> Tennis, as it should be taught — and the operations to match.
> — Andrew Mateljan

Now open `01_BUILD-NOW_ADMIN-DESK-GPT/00_READ_ME_FIRST.md`. Step 1.