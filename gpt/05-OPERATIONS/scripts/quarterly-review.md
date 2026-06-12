# Quarterly Review — 90 min

> Every 3 months. Andrew alone or with a trusted advisor (not Allison or Saska — this is strategic). Goal: zoom out, look at compounded value, decide what to add / cut / harden.

---

## When

End of Q1 (Mar 31), Q2 (Jun 30), Q3 (Sep 30), Q4 (Dec 31). Block the last Friday of those weeks.

## Pre-work (45 min, the night before)

Pull these inputs:

1. **`eval/weekly-metrics.csv`** — 12 weeks of Friday metrics. Trend analysis.
2. **`runbooks/*.md`** — every incident this quarter. Pattern recognition.
3. **`09-COMMAND-CENTER/anti-patterns.md` and `patterns.md`** — what we've compounded.
4. **`09-COMMAND-CENTER/changelog.md`** — what changed in prompts and KB this quarter.
5. **Top 5 actually-shipped GPT outputs from each coach** — the proof of value.
6. **Membership / revenue / lead numbers** for the same period (from PBP, AC, Stripe).

## Agenda (90 min)

### 0:00–0:15 — What did we compound?

Review the past quarter's `patterns.md` and `anti-patterns.md`. The questions:
- What pattern is now muscle memory (no longer needs prompt nudging)?
- What anti-pattern keeps coming back? (Means the prompt fix isn't working.)
- What did we ship this quarter we couldn't have shipped without GPTs?

### 0:15–0:30 — Metrics

Plot or eyeball the 12 weeks of metrics:
- **Drafts shipped without major edits** trend — is it climbing or flat?
- **Minutes saved per coach per week** — converging toward what number?
- **Incidents per quarter** — falling? Same kind?

If "drafts shipped without major edits" is flat or down → there's drift somewhere. Audit.

### 0:30–0:45 — What broke

Look at every incident logged in `runbooks/` this quarter. For each:
- Was the fix structural (we won't see this again) or band-aid (we'll see this again)?
- Should it become a test in the red team audit?
- Should it become a quality bar in `09-COMMAND-CENTER/quality-bars.md`?

### 0:45–1:00 — Strategic review of each GPT

| GPT | Question |
|---|---|
| Founder | Is Andrew using it >5x/day? If not, why? Are we missing a workflow? |
| Adult Coach | Is Allison on track to save ≥2 hr/wk? Is voice still hers? |
| Junior Coach | Same for Saska, plus: any safety/parent-emotional incidents we should harden against? |
| Front Desk | If public: traffic, conversion to `/book`, complaints. If not yet public: launch decision this quarter? |

### 1:00–1:15 — Add / cut / harden

Pick 1–2 of each:

- **Add:** what's the next workflow we want to GPT-ize? (Examples: a member onboarding sequence, a tournament prep routine, a coach 1:1 prep doc.)
- **Cut:** what's a workflow we tried to GPT-ize that didn't compound? Stop forcing it.
- **Harden:** what's a fragile spot? (Example: voice drift on welcome emails. Solution: dedicated voice samples folder for that template.)

### 1:15–1:30 — Roadmap & write up

- Capture decisions in `09-COMMAND-CENTER/roadmap.md` under the new quarter.
- Anything that requires a build > 2 hours: schedule the build day this quarter.
- Anything that needs Allison or Saska's input: schedule a 15-min check-in this week.

## Output

- Updated `09-COMMAND-CENTER/roadmap.md` with next quarter's plan.
- 1–3 build sessions on the calendar.
- A short note (5–10 sentences) in `09-COMMAND-CENTER/changelog.md` summarizing the quarter.

## What this is NOT

- Not a Friday Compound Review (that's tactical, weekly, 30 min).
- Not a strategic offsite (that's annual, 2 hours, in `annual-strategy-review.md`).
- Not a metrics meeting (it's strategic — metrics inform but don't drive).

## What good looks like

After 4 quarters of this:
- The six GPTs have evolved with real usage, not aspirational specs.
- The roadmap is shorter and clearer each quarter (less open-ended exploration, more compounding refinement).
- The team trusts the system. Andrew doesn't redo Allison or Saska's drafts. Allison and Saska don't ask Andrew permission for routine sends.
- The Front Desk GPT is the first thing prospects encounter. It's calm, accurate, and on-voice.
