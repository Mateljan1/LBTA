# Daily Cockpit — 60 Seconds

> Andrew opens this each morning during the 7-day dogfood week, then 2–3x/week thereafter. Goal: catch drift early.

---

## The 60-second check

1. **Are all 6 GPTs still answering correctly?**
   - Open Founder, Adult Coach, Junior Coach, Front Desk (public), Marketing, and Front Desk Drafts (private).
   - To each: paste the prompt *"What's our refund policy and what's our phone number?"*
   - Pass: all 6 say *30-Day Money-Back Guarantee* + *(949) 534-0457* + *support@lagunabeachtennisacademy.com* — and **only** those.
   - Fail: any GPT invents a 48-hour cancellation, a different phone, or a different email → run `05-OPERATIONS/runbooks/hallucination-incident.md`.
   - (Skip Marketing GPT until Phase 7 / Week 5. Skip Front Desk Drafts until it's built.)

2. **Did anyone log a 🔴 in `weekly-metrics.csv` yesterday?**
   - Open `05-OPERATIONS/eval/weekly-metrics.csv`.
   - Scan for any row with `incident=🔴` from the last 24h.
   - Yes → 5-minute triage with the coach who logged it.

3. **Front Desk transcripts (only after public launch):**
   - Spot-check 3 sessions from yesterday.
   - Any factual error? → `05-OPERATIONS/runbooks/front-desk-incident.md`.

4. **Marketing GPT spot check (only during Phase 7/8 active use):**
   - Spot-check yesterday's outputs (newsletter, IG, partner outreach).
   - Any forbidden word slipped through? Any draft mistakenly worded as final/published? → `05-OPERATIONS/runbooks/marketing-incident.md`.
   - Any image-gen output without `DRAFT — not for publishing` label? → same runbook.

That's it. 60 seconds (90 once Marketing is live). Close the tab.

---

## When to escalate from a daily check to a runbook

| Symptom | Runbook |
|---|---|
| GPT got a fact wrong | `05-OPERATIONS/runbooks/hallucination-incident.md` |
| GPT sounded generic | `05-OPERATIONS/runbooks/voice-drift.md` |
| Front Desk produced a bad public answer | `05-OPERATIONS/runbooks/front-desk-incident.md` |
| Marketing GPT issue (forbidden word, image-gen, near-publish, fake testimonial) | `05-OPERATIONS/runbooks/marketing-incident.md` |
| Coach said *"I stopped using it"* | `06-COMMUNICATIONS/coach-1on1-talking-points.md` |

---

## What you do NOT do during the daily check

- ❌ Read every transcript end-to-end (that's the Friday review's job).
- ❌ Re-engineer the system prompt because of one off answer (log + Friday).
- ❌ Add a new knowledge file mid-week (batch on Friday).

The daily cockpit is a **smoke test**, not a deep audit. Don't drift it into one.

---

## Owner

Andrew Mateljan.
