# Monthly Knowledge Refresh — 60 min

> The **last Friday of each month** Andrew runs a 60-minute knowledge refresh on top of the Friday Compound Review. Goal: every fact in `03-KNOWLEDGE-BRAIN/` is current, and every stale voice sample has been retired.

---

## Why monthly

Knowledge files drift faster than coaches notice. Pricing changes, calendar updates, a new policy, a coach moves on. By the time someone hallucinates from a stale file, the damage is done. Monthly refresh = guaranteed freshness.

## Pre-work (5 min, day before)

Andrew opens each of the 10 knowledge files and does a fast scan:
- Anything in here that changed this month?
- Anything missing that came up 2+ times?

Quick list, ready for the meeting.

## Agenda (60 min)

### 0:00–0:10 — Friday Compound Review (short version)

Same as the standard Friday. Compress to 10 min if needed.

### 0:10–0:30 — Knowledge file pass

Walk through each of the 10 files. For each:
- Anything outdated? Update.
- Anything missing? Add.
- Anything contradicted by a new website page? Reconcile.

Files to check:
- [ ] `01-academy-facts.md` — locations, contact, hours
- [ ] `02-programs-and-pricing.md` — programs, prices, frequencies
- [ ] `03-coaches.md` — coach roster, bios, certifications
- [ ] `04-calendar-and-camps.md` — current and upcoming sessions, camp dates
- [ ] `05-leagues-and-tournaments.md` — USTA, UTR, JTT, junior pathways
- [ ] `06-policies.md` — refund, weather, cancellation, attendance
- [ ] `07-voice-and-brand.md` — voice anchors, forbidden words, sign-offs
- [ ] `08-faqs.md` — top 20 prospect questions
- [ ] `09-faqs-internal.md` — top 20 member / parent questions
- [ ] `10-guardrails-and-escalation.md` — when to route to Andrew

### 0:30–0:40 — Voice samples refresh

- Each coach picks 3 of their best drafts from this past month.
- Andrew helps anonymize (replace names, phone, email).
- Save to `gpt/03-KNOWLEDGE-BRAIN/voice-samples/[coach]/YYYY-MM/`.
- Retire any sample older than 12 months.

### 0:40–0:50 — Re-upload

Andrew uploads updated files to all 6 GPTs:
1. Founder GPT — Configure → Knowledge → re-upload changed files.
2. Adult Coach GPT — same.
3. Junior Coach GPT — same.
4. Front Desk GPT (public) — same. **Run the smoke test below before saving.**
5. Marketing GPT — same (and re-upload files 11–13 + `voice-samples/marketing-voice.md` if changed).
6. Front Desk Drafts GPT (private) — same.

### 0:50–1:00 — Smoke test (6 GPTs × 1 prompt each)

Quick verification that the re-uploads stuck:

| GPT | Smoke prompt | Expected |
|---|---|---|
| Founder | "What's a current LBTA program price?" | Latest price from `02-` |
| Adult Coach | "Draft a reply citing the 30-day guarantee." | Cites correctly from `06-` |
| Junior Coach | "When does summer camp start?" | Correct date from `04-` |
| Front Desk (public) | "List our coaches." | Andrew + Peter + Allison only (no Robert) |
| Marketing | "Draft an IG caption about our junior summer camp." | On-voice, no forbidden words, draft-only |
| Front Desk Drafts | "Draft a reply to a parent asking about refund policy." | Cites 30-day rule, routes to support@ |

If any fail → re-upload that file → re-test.

## Output

- Updated knowledge files committed to repo.
- Updated knowledge files uploaded to all 6 GPTs.
- Updated voice samples in Drive and `voice-samples/`.
- Notes in `09-COMMAND-CENTER/changelog.md`.

## When to escalate to a full rebuild

If during the refresh Andrew finds:
- 3+ files significantly out of date.
- A structural issue (wrong file holding the wrong category of info).
- The same fact appearing in multiple files with different wording.

→ Schedule a 2-hour rebuild session in the next 2 weeks. Don't try to fix all of it on a Friday afternoon.
