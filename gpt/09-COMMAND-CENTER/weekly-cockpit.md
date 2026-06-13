# Weekly Cockpit — Friday Compound Review (Pre-Game)

> The 5 minutes Andrew runs **before** the team's Friday Compound Review (`05-OPERATIONS/scripts/friday-compound-review.md`). Pulls every signal into one view so the 30-min review is high-leverage, not bookkeeping.

---

## Run this every Friday at 11:55 AM (5 min before the 12:00 ritual)

### 1. Pull metrics (1 min)

- Open `05-OPERATIONS/eval/weekly-metrics.csv`.
- For each coach (Andrew, Allison, Saska) — and Andrew/Marketing once Phase 7 is live:
  - **Sessions this week:** ____
  - **First-draft hit rate:** ____% (sessions where the GPT's first draft was used with ≤ 2 edits)
  - **Edits required (avg):** ____
  - **Time saved estimate:** ____ hrs
  - **Incidents logged:** 🔴 ___ / 🟡 ___ / 🟢 ___

### 2. Spot the trend (1 min)

| Coach / Surface | Trend vs last week |
|---|---|
| Andrew (Founder) | ⬆️ ⬇️ ➡️ |
| Allison (Adult) | ⬆️ ⬇️ ➡️ |
| Saska (Junior) | ⬆️ ⬇️ ➡️ |
| Andrew (Marketing — Phase 7+) | ⬆️ ⬇️ ➡️ |

If any coach/surface is ⬇️ for 2 weeks in a row → triage in the 1:1 next week (`06-COMMUNICATIONS/coach-1on1-talking-points.md`). For Marketing-specific drift → also check `05-OPERATIONS/runbooks/marketing-incident.md` for category 4 (voice/quality drift).

### 3. Top issue this week (1 min)

The single most repeated issue across all 6 GPTs:

> _________________________________________________

(Examples: "Voice too generic on emotional emails," "Quoting the wrong age band for camps," "Not routing to support@ on policy questions.")

### 4. Pre-stage the fix (2 min)

- **Which knowledge file** is the source of truth for the issue? `03-KNOWLEDGE-BRAIN/__-________.md`.
  - Operational issue → typically files 01–10 (re-upload into all 6 GPTs after edit).
  - Marketing-only issue (voice, surface template, image-gen, consent) → typically files 11–13 or `voice-samples/marketing-voice.md` (re-upload into Marketing GPT only).
- **Open it.** Don't edit yet — bring to the team review and decide together.

---

## What lands on the Friday Compound Review agenda from this 5 minutes

1. **Wins** (each coach 1 sentence): from the metrics + their head.
2. **Top issue** (you pre-staged it): one fix, one file.
3. **Decision:** edit which file? Re-upload to which GPTs?
4. **Owner + by-when:** typically Andrew, by Sunday EOD.
5. **Compounding artifact:** what gets logged into `01-ARCHITECTURE/post-dogfood-compound-loop.md` as a learning?

---

## Output of every Friday review (≤ 5 lines)

Append to `01-ARCHITECTURE/post-dogfood-compound-loop.md` under the running log:

```
Week ___:
- Wins: [3 short bullets]
- Top issue: [1 sentence]
- Fix: [file edited + GPTs re-uploaded]
- Metric to watch next week: [pick 1]
- Compound learning: [1 sentence]
```

That's the durable artifact. The 30 minutes was the meeting; the 5 lines is the compound.

---

## Owner

Andrew Mateljan runs the pre-game. The full ritual is co-owned by all 3 coaches.
