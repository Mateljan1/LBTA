# Friday Compound Review — 30 min

> The single most important ritual in this system. **30 minutes every Friday at 4:00pm.** Andrew + Allison + Saska. If we miss this, the GPTs decay. If we run this every Friday for 90 days, the GPTs compound past anything ChatGPT ships off-the-shelf.

---

## Why Friday at 4pm

- After morning programs are done, before weekend life starts.
- Everyone has 5 days of real GPT use to talk about, not abstract opinions.
- Energy is right for a "what's working / what's not" conversation, not for new strategy.

## Agenda (30 min)

### 0:00–0:05 — Round the room: highest leverage moment

Each person, 60 seconds:
- *"This week the GPT helped me most when ___."*
- One specific moment. Not a category. *"Tuesday's parent email about the makeup session"* not *"emails."*

This anchors the meeting in compounded value, not problems.

### 0:05–0:12 — One thing that didn't work

Each person, 90 seconds:
- *"This week the GPT was wrong / off / annoying when ___."*
- One specific. Bring the actual draft / output if possible.
- No fixing yet. Just naming.

### 0:12–0:20 — Pattern → fix

Andrew, 8 min:
- Look at the 3 things that didn't work.
- Are they the same root cause? (Often yes.)
- Pick **one** prompt change or one knowledge file update for the week.
- *"Next week's change: in the Adult Coach prompt, add a line that says ___."*

### 0:20–0:25 — Metrics check

Open `eval/weekly-metrics.csv`. Each person:
- Drafts started in GPT this week: __
- Drafts shipped without major edits: __
- Estimated minutes saved this week: __

Roll up. Trend over 4 weeks?

### 0:25–0:30 — Compound learnings & end

- Andrew captures:
  - The one prompt/KB change made today.
  - One **anti-pattern** for `09-COMMAND-CENTER/anti-patterns.md` (don't repeat this).
  - One **pattern** for `09-COMMAND-CENTER/patterns.md` (do this more).
- Andrew commits and re-uploads any changed knowledge files **before** end-of-meeting (so Monday morning runs on the new version).
- Calendar reminder for next Friday confirmed.

## Rules of the room

- One in_progress fix per week. **Not three.** Compound > optimization.
- Bring drafts, not opinions.
- Andrew has final call on prompt changes. Allison and Saska have final call on whether a draft "sounds like them."
- The phrase "the GPT can't" needs to be replaced with "the GPT didn't *yet*."

## When to skip

- Holiday weeks → skip.
- Andrew traveling → text-based async is fine; full meeting next Friday.
- One person sick → run the meeting with whoever's available; missing person sends notes via voice memo.

## When to expand

If meetings consistently run >30 min:
- Split into Adult Coach Friday + Junior Coach Friday (15 min each).
- Or move metrics to async.

## When something is on fire

- Hallucination incident → don't wait for Friday. See `runbooks/`.
- Voice drift on a critical send (campaign, recap) → fix today, log Friday.

## After 90 days

If we run this every Friday for 90 days:
- Each GPT has been touched ~12 times based on real use.
- The voice samples folder is fresh.
- The knowledge files are fresh.
- Anti-patterns and patterns are documented in `09-COMMAND-CENTER/`.
- Andrew has compounded ~50 hours of his time back. **That's the point.**

## Template — meeting notes

```
# Friday Compound Review — YYYY-MM-DD

## Highest leverage moments
- Andrew: ...
- Allison: ...
- Saska: ...

## What didn't work
- Andrew: ...
- Allison: ...
- Saska: ...

## This week's change
- [GPT]: [system prompt / knowledge file] → [what changed]
- Re-uploaded: [files]
- Tested with: [prompt]

## Metrics
| Person | Drafts started | Shipped no major edits | Min saved |
|---|---|---|---|
| Andrew | | | |
| Allison | | | |
| Saska | | | |

## Compounded
- New anti-pattern: ...
- New pattern: ...

## Next week
- [ ] Andrew: ...
- [ ] Allison: ...
- [ ] Saska: ...
```
