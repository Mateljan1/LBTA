# Dogfood Log — LBTA GPT

> Use this template every day during the internal-only dogfooding week (you, solo). One row per real conversation. Goal: surface the things the GPT gets wrong before any customer sees it.

## How to use this log

1. Have a real interaction with the GPT — pretend you're a parent / adult player / coach inquiry.
2. Record the prompt and the GPT's answer (paste, don't paraphrase).
3. Score across 5 dimensions (1–5).
4. Flag corrections needed.
5. After 7 days, run `/compound:learn` against this log and update the knowledge files.

## Scoring rubric

| Score | Meaning |
|---|---|
| 5 | Could ship to a customer as-is |
| 4 | Ship-ready after one small edit |
| 3 | Useful but needs rewrite |
| 2 | Wrong facts or wrong voice |
| 1 | Hallucination, forbidden language, or escalation failure |

## Daily template (copy this for each entry)

```
### [Date] — Entry [N]

**Persona:** [Parent of 8yo / Adult beginner / HP inquiry / Camp parent / etc.]

**Prompt:**
> [Paste the exact question you typed.]

**GPT response:**
> [Paste the full response. Do not edit.]

**Scores:**
- Accuracy (right facts?): [1–5]
- Voice (passes file 05 check?): [1–5]
- Specificity (named price/day/coach?): [1–5]
- Next step (one clear CTA?): [1–5]
- Escalation (handed off when needed?): [1–5]
- **Total / 25:** [N]

**Corrections needed:**
- [ ] Knowledge file [01–10] line X — fact wrong
- [ ] Voice — used forbidden phrase "[…]"
- [ ] Scope — over-promised / out-of-bounds
- [ ] Other: [describe]

**Suggested fix:**
[1–2 sentences on how to update the knowledge file or system prompt.]

---
```

## Example entry (filled in)

```
### April 26 2026 — Entry 1

**Persona:** Parent of 8-year-old, never played

**Prompt:**
> My son is 8 and has never picked up a racquet. What do you recommend?

**GPT response:**
> Orange Ball at Moulton Meadows is the natural starting point for an 8-year-old new to tennis. It's a 60-minute group session, $420 for the season at one day a week. Coach Peter runs most of these — he's high-energy and excellent with kids new to the sport.
>
> The simplest next step is a free trial: lagunabeachtennisacademy.com/book. Pick Orange Ball, pick a day that works, and we'll go from there.

**Scores:**
- Accuracy: 5
- Voice: 5
- Specificity: 5
- Next step: 5
- Escalation: 5
- **Total / 25: 25**

**Corrections needed:** none

**Suggested fix:** none
```

## Targets for the dogfood week

- **At least 30 entries** across 7 days (≈4–5/day, varied personas).
- **Average score 22+/25** by day 5.
- **Zero "1" scores** by day 7.
- **All flagged corrections** rolled into knowledge files before public launch.

## Persona rotation (suggested)

| Day | Personas to test |
|---|---|
| 1 | Parent of new junior (8yo, never played) · Adult beginner |
| 2 | Camp inquiry · Returning adult (4.0 level) |
| 3 | High Performance inquiry · USTA league inquiry |
| 4 | Pricing-only shopper · Sibling discount question |
| 5 | Refund / make-up question · Weather cancellation |
| 6 | Robert mention (test the redirect) · Out-of-scope question (e.g. "do you do pickleball") |
| 7 | Hostile/trolling message (test the decline) · "I want a human" handoff |

## Compound capture

After day 7, summarize this log into:

- **CORRECTIONS** — every fact the GPT got wrong, mapped to a knowledge file edit
- **PATTERNS** — phrasings or response shapes that worked particularly well
- **STANDARDS** — anything that should become a hard rule in the system prompt

Save the summary as `gpt/eval/dogfood-week-[date].md` and feed it through `/compound:learn`.
