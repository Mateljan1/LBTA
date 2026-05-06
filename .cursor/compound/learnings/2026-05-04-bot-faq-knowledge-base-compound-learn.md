# Compound Learn — 2026-05-04 · Bot FAQ Knowledge Base (full-year 2026)

**Loop:** Plan → Work → Review → Validate → Compound, all in one session.
**Plan:** [`plans/2026-05-04-bot-faq-knowledge-base-2026.md`](../../../plans/2026-05-04-bot-faq-knowledge-base-2026.md)
**Deliverable:** [`gpt/03-KNOWLEDGE-BRAIN/23-bot-knowledge-base-2026.md`](../../../gpt/03-KNOWLEDGE-BRAIN/23-bot-knowledge-base-2026.md) — 70 Q&As covering Winter/Spring/Summer/Fall 2026, every camp, leagues, privates, restringing, scholarships, escalation rubric.
**Validation:** 41/41 functional + 8/8 cross-surface alignment, 0 blockers.

## What this loop closed

| Goal | Resolution |
|---|---|
| Bot/front-desk GPT lacks a single facts source for prices/locations/policies | Created canonical `23-bot-knowledge-base-2026.md`: 13 sections + 3 appendices, every Q&A grounded in `/data/*.json` |
| SMS log shows recurring confusion (Moulton vs Alta, City portal vs app, LiveBall levels, Saturday pricing) | Mapped 23 SMS clusters → Q-numbers in Appendix B; bot routes to escalation when source unclear |
| Drift between JSON, components, and GPT brain docs | Founder-correction sweep updated all surfaces in one pass (data + coach-hub + components + brain doc + KB) |
| 30-Day Guarantee, scholarships, payment plans not codified for bot | Q60, Q67, Q69 with founder-confirmed wording |

## Founder corrections applied mid-loop (2026-05-04)

These shipped during Review — the loop's main quality signal:

1. **LiveBall Intermediate is NTRP 3.0–4.0** (not 2.5+). All four time slots are Intermediate **except** Sunday 10:30 AM (Advanced 4.0+). KB `Q38`, JSON `ages`/`description`/`schedule.note` updated across all 3 season files.
2. **LiveBall minimum 5 players to run.** Codified as `minPlayersToRun: 5` in `data/{winter,spring-summer,fall}2026.json` + KB `Q40`. Replaces the SMS-implied "at least 2" that I almost wrote in (anti-pattern below).
3. **Saturday Adult Intermediate is included in regular package** (1×/2×/3× — Tue/Thu/Sat are interchangeable). `pricingNote: "Saturday session has separate pricing."` removed; `note: "Separate pricing"` removed from Saturday schedule rows. Coach hub mirror cleaned. `components/programs/ProgramsTabView.tsx` updated. `gpt/03-KNOWLEDGE-BRAIN/02-programs-and-pricing.md` updated.

## The five new patterns

### 1. `bot-fact-source-of-truth-hierarchy` ⭐ (the big one)

When the bot/front-desk AI answers a factual question (price, time, location, policy), there's a fixed lookup order — and an "Escalate" path when the answer isn't in any of them. Documented as the standing rule in the KB header:

```
1. data/year2026.json           (calendar, base pricing matrix, camps)
2. data/{season}2026.json       (per-season program rows)
3. data/leagues-2026.json
   data/private-rates.json
   data/pricing-supplemental.json (specialty)
4. KB markdown                  (derives from above; never invents)
5. UI mirror /schedules         (visual confirmation only)
```

When the answer is not in 1–3, bot says **"let me get the desk on this"** and routes to `support@lagunabeachtennisacademy.com` or `(949) 534-0457`. **No invention.** This pattern is enforceable: every Q&A has a `Sources:` line and either `Escalate:` or `Self-serve:`.

### 2. `acceptance-script-as-validator`

When shipping a docs/data file claiming numerical facts (60+ prices in this case), write a small Python assertion script — one assert per claim, comparing the doc's number against the source JSON. This loop ran 49 assertions in <100ms and caught the LiveBall NTRP issue mechanically. Re-run after every correction. Cheap and obvious in hindsight; saves an hour of manual cross-checking per pass.

```python
# essence
checks = [("Spring Red 1x = 420", get(s["programs"],"red-ball")["pricing"]["spring"]["1x"]==420), ...]
report("Regression — data prices unchanged", data_checks)
```

### 3. `founder-correction-cross-surface-sweep`

When a founder corrects a single fact, the same fact often lives in **5+ surfaces**:

- `data/{season}2026.json` × 3 seasons
- `data/coach-hub/hub-data.json` (internal mirror)
- `components/**/*.tsx` (hardcoded static cards — `ProgramsTabView.tsx` had LiveBall NTRP literals)
- `components/ProgramCard.tsx` (JSDoc comments referencing obsolete patterns)
- `gpt/03-KNOWLEDGE-BRAIN/**.md` (parallel source-of-truth doc — `02-programs-and-pricing.md` had the same row)
- The new KB itself

**Rule:** After applying the correction in one place, grep the corrected term across `data/`, `components/`, `gpt/03-KNOWLEDGE-BRAIN/` and resolve every match in the same loop. Never assume the correction propagates.

This loop's case: the SMS-derived "minimum 2 players" never made it to publication because the script + cross-surface sweep caught it before commit.

### 4. `bot-kb-q-and-a-structure-2026`

Each Q&A is structured for retrieval, not narrative:

```
### Q{n}. {canonical question}
**Tags:** comma, separated, keywords
**Answer:** plain English, ≤120 words, includes one anchor (price/time/location)
**Sources:** data/path.json or named source
**Escalate:** phone/email   |  **Self-serve:** URL
```

Plus two compounding appendices:

- **Appendix B — Coverage matrix vs SMS log** — every recurring intent mapped to a Q-number, so we know what we DIDN'T cover.
- **Appendix C — Reconciliation notes** — open vs resolved items with founder-confirmation timestamps. When a fact is verified, move from "Open" to "Resolved YYYY-MM-DD" with the resolver named.

This makes the doc grow without rotting — every founder correction adds a timestamped resolution row instead of editing history.

### 5. `season-aware-pricing-quote`

Never quote a single LBTA program price without anchoring to a season. Why: per-session value is similar, but absolute totals differ because each season has different week counts (Winter 13, Spring 10, Summer 11, Fall 16). A junior 1×/wk is $546 / $420 / $462 / $672 across the four seasons. Bot rule:

> "Always confirm season first when quoting prices. If unsure which season, ask."

This is encoded in the KB header rules of engagement and in Q10.

## The three new anti-patterns

### 1. `sms-implied-policy-as-codified-fact`

Codifying a number from a single outbound SMS (e.g. "we don't have enough players for tonight — we need at least 2") as policy in the bot KB without founder confirmation. SMS reflects what's been said in the moment, not what's policy. **Always verify with founder before codifying numbers/thresholds.** Use `AskQuestion` if the loop is live; flag in `Reconciliation notes (open)` if not.

This loop's catch: I wrote "at least 2 players" into Appendix C as an open item rather than into Q40 as policy — Andrew came back with "5" the next pass.

### 2. `ntrp-band-mixed-truth-in-record`

Setting `ages: "NTRP 2.5+"` while `description` says "Intermediate (3.0–4.0) and Advanced (4.0+)" and `schedule.note` says "Intermediate (3.0–4.0)" — three different truths in the same record. Even if 2 of 3 are right, the bot will pick whichever one its retrieval surfaces first.

**Rule:** When founder corrects an NTRP/UTR band on a program, update **all three fields in the same record** (`ages`, `description`, `schedule[*].note`) and run the acceptance script.

### 3. `bot-kb-quote-without-source-line`

A Q&A that asserts a price/time/policy without a `Sources:` line pointing to a JSON path or named source. Future audits cannot verify; future founder corrections cannot find all the dependent answers.

**Rule:** Every Q&A in `gpt/03-KNOWLEDGE-BRAIN/23-bot-knowledge-base-2026.md` must end with `**Sources:**` (≥1 reference). Verified by grep at acceptance time.

## The three new quality bars

| Bar | Rule | Enforcement |
|---|---|---|
| `botKnowledgeBaseSourceLine` | Every Q&A in `gpt/03-KNOWLEDGE-BRAIN/23-*.md` has `**Sources:**` and either `**Escalate:**` or `**Self-serve:**`. | must |
| `founderCorrectionCrossSurfaceSweep` | After applying a founder correction, grep the term across `data/**/*.json`, `components/**/*.{tsx,ts}`, and `gpt/03-KNOWLEDGE-BRAIN/**.md`; resolve all matches in the same loop. | must |
| `numericalFactValidationScript` | Docs files claiming ≥10 numerical facts ship with a Python/Node assertion script that compares each claim to source JSON. Re-run after every edit. | should |

## What got into memory this pass

| File | Added |
|---|---|
| `corrections.jsonl` | 4 new corrections |
| `patterns.json` | `bot-fact-source-of-truth-hierarchy`, `acceptance-script-as-validator`, `founder-correction-cross-surface-sweep`, `bot-kb-q-and-a-structure-2026`, `season-aware-pricing-quote` (5 new) |
| `anti-patterns.json` | `sms-implied-policy-as-codified-fact`, `ntrp-band-mixed-truth-in-record`, `bot-kb-quote-without-source-line` (3 new) |
| `quality-bars.json` | `botKnowledgeBaseSourceLine` (must), `founderCorrectionCrossSurfaceSweep` (must), `numericalFactValidationScript` (should) (3 new) |
| `LEARNINGS.md` | New "Recent" pointer entry |
| `plans/COMPOUND_LEARN.md` | Latest pointer updated |

## Files touched in the loop

**Created:** `gpt/03-KNOWLEDGE-BRAIN/23-bot-knowledge-base-2026.md`, `plans/2026-05-04-bot-faq-knowledge-base-2026.md`

**Modified (founder-correction sweep):**
- `data/winter2026.json`, `data/spring-summer-2026.json`, `data/fall2026.json` — LiveBall + Adult Intermediate blocks
- `data/coach-hub/hub-data.json` — Adult Intermediate Saturday `notes` field
- `components/programs/ProgramsTabView.tsx` — LiveBall static card NTRP levels
- `components/ProgramCard.tsx` — JSDoc example obsolete-pattern reference
- `gpt/03-KNOWLEDGE-BRAIN/02-programs-and-pricing.md` — LiveBall row + Saturday note
- `gpt/03-KNOWLEDGE-BRAIN/06-faq-and-scenarios.md` — banner pointing to 23
- `gpt/03-KNOWLEDGE-BRAIN/07-website-and-links.md` — banner + canonical Rec1/app URLs

## What this teaches future loops

1. **The KB pattern generalizes.** This same Q&A + Sources + Coverage-matrix shape can be cloned for: parent FAQ, coach onboarding, USTA captain handoff, scholarship-applicant FAQ, recruiting FAQ. Each new KB starts as a copy of `23-*.md` with new sections.
2. **Acceptance scripts make docs feel like code.** A markdown file with a Python validator next to it is a far stronger artifact than markdown alone — and once the script exists, every founder correction triggers one assertion update + one script run, not a manual re-audit.
3. **The bot will find drift before users do.** A bot with this KB will answer correctly on the day we ship; a bot without it will quote stale prices for months. The compounding asset is the **discipline of always grepping all surfaces**, not the KB file itself.
