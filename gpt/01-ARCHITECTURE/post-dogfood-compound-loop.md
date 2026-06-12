# LBTA GPT — Post-Dogfood Compound Loop

> What happens after the 7-day dogfood week, and how the system gets stronger every week thereafter.

---

## The honest framing

The dogfood week is not the finish line. It is **week 1 of a system that compounds for years**. After 7 days you'll have ~50 logged interactions across the 5 ops GPTs (Founder, Adult Coach, Junior Coach, Front Desk public, Front Desk Drafts private) and a clear list of "this draft was perfect / this one missed / this one shouldn't have been answered at all." That list is gold — and only gold if you have a process to convert it into upgrades.

This document is that process.

---

## The 30/60/90 after dogfood week

### Days 8–14 — Retrospective + first compound

**Goal:** Convert every log entry into a knowledge update, prompt fix, or new starter.

**Andrew runs (60 minutes, solo or with Saska/Allison):**

1. **Read every log entry** across all 3 internal GPTs (Andrew, Allison, Saska). Skip Front Desk (public) and Front Desk Drafts (private) for now — they're not live yet.
2. **Tag each entry** with one of 5 labels:
   - ✅ Perfect — no change needed
   - ✏️ Voice/style fix — update system prompt
   - 📚 Fact gap — update a `gpt/03-KNOWLEDGE-BRAIN/*.md` file
   - 🚫 Out-of-scope answer — tighten guardrails
   - 🔁 Repeated question — convert to a conversation starter
3. **Make the edits in this repo** (or have me do them). Push to `gpt/` and re-sync to ChatGPT.
4. **Re-test** the 3 worst misses on the updated GPTs.
5. **Write a 1-page retro** in `gpt/eval/retro-week-01.md`: what worked, what missed, what's now fixed, what's still open.

**Output:** v2 of all 3 internal GPTs. Saska + Allison feel the difference within 2 days.

### Days 15–30 — Front Desk soft launch (internal)

**Goal:** The public Front Desk GPT lives behind a private link. Andrew, Allison, Saska, and 5 trusted parents stress-test it.

**Soft-launch checklist (all must be ✅ before any public link):**
- [ ] 50 trial questions answered correctly across pricing, schedule, policies, founder story, and "tricky" edge cases (custody, hardship, complaint)
- [ ] Zero hallucinations on price, date, location, coach name, or refund terms
- [ ] Every "kill switch" trigger correctly routes to `support@` (test 10 known-out-of-scope prompts)
- [ ] Voice passes the "would Andrew say this on the phone?" test on 20 random replies
- [ ] Drafted reply latency under 8 seconds end-to-end

**Andrew's job:** Run 5 stress tests per day for 14 days. Log misses. Fix. Re-test.

**Trusted parents' job:** Use it like a customer would. Tell us when it felt "off."

**Output:** Front Desk graduates from "internal beta" to "public-link beta."

### Days 31–60 — Phase 2 integrations

**Goal:** Wire the 3 GPTs that need it into your real tools.

| Integration | For whom | What it unlocks |
|---|---|---|
| Gmail (read + draft only) | Andrew | Drafts in his inbox auto-saved as Gmail drafts. Andrew reviews and sends. Saves 60–90 min/day. |
| Google Drive (read-only on `LBTA / Public-Safe Assets`) | All 3 internal GPTs | Latest schedule, pricing, league flyers always available. No more "let me check and circle back." |
| Calendar (read-only) | Andrew | "What does my Tuesday look like?" → real answer. Drafts respect his actual availability. |

**Hard rule:** No write access on calendars, payments, or registrations. Drafts only. Andrew always has the final click.

**Output:** Andrew's daily ChatGPT time drops from "type a long prompt" to "forward an email, get a clean draft."

### Days 61–90 — Public Front Desk launch + first compound milestone

**Goal:** Front Desk goes live on the website. The team has measurable proof the system is working.

**Public-launch criteria (all must be ✅):**
- [ ] 30 days of soft-launch logs with <1% hallucination rate
- [ ] All 6 GPTs have hit at least v3 (3 compound cycles)
- [ ] Knowledge files have been updated at least twice (proves the loop works)
- [ ] Allison + Saska have each saved at least 2 hours/week from internal GPT use (self-reported, then validated against weekly summary stats)
- [ ] Andrew has saved at least 5 hours/week (self-reported)

**Day 90 milestone:** First "honest 10/10 audit." See the standard below.

---

## The weekly compound ritual (locked in)

**Friday Compound Review — 30 minutes, every Friday.**

Already documented in `gpt/team-rituals.md`. The TL;DR:

- 5 min — Each person shares one "wow" GPT moment from the week
- 10 min — Each person shares one "miss" (where the GPT was wrong, off-voice, or out of scope)
- 10 min — Decide: which knowledge file gets updated? which prompt gets tweaked? which starter gets added?
- 5 min — Andrew commits the changes by Sunday night

If the meeting can't happen, **async on Slack** in #gpt-compound. Same template. Don't skip the loop — that's how the system stops compounding.

---

## The honest 10/10 standard

This is what 10/10 actually looks like. We are not there yet. We are building toward it.

| Dimension | 7/10 (where v1 lands) | 10/10 (the bar) |
|---|---|---|
| **Andrew's time saved** | 3 hours/week | 8+ hours/week, every week |
| **Allison's adoption** | Uses it 2× per week when she remembers | Daily; first move on every parent email |
| **Saska's adoption** | Drafts 1–2 emails/week | Drafts 5+ emails/week, weekly summary in 10 min |
| **Front Desk accuracy** | <5% hallucination on stress test | 0 hallucinations on 100-question audit |
| **Voice match** | Sounds like Andrew 60% of the time | Sounds like Andrew 90%+ of the time |
| **Knowledge freshness** | Files updated when someone notices | Monthly fact audit, owned by named person per file |
| **Escalation hygiene** | GPT correctly routes 80% of edge cases | 95%+; Front Desk never answers a "should-have-routed" question |
| **Compound velocity** | First retro by week 2 | Every Friday, every week, 50+ weeks/year |

**Path to 10/10:** Months 4–6, after the system has a real history of corrections, real measurement, and real adoption muscle from all three coaches.

---

## Measurement layer (the missing piece in v1)

To track whether we're at 7/10 or 10/10, we measure 5 things, weekly.

### 5 weekly metrics (Allison, Saska, and Andrew each track in their own row)

1. **Drafts started** — how many times you opened the GPT this week
2. **Drafts shipped without edit** — how many drafts you sent (or pasted into Gmail) with zero changes
3. **Drafts shipped with edit** — sent with minor tweaks (counts as "value created")
4. **Drafts thrown away** — GPT missed the moment; you wrote it yourself instead
5. **Time saved (your honest gut estimate)** — minutes/week

**Where it lives:** `gpt/eval/weekly-metrics.csv` — 1 row per person per week. Track for 12 weeks. The trendline is the answer.

**The number that matters most:** *Drafts shipped without edit / Drafts started.* That's the GPT's "first-draft hit rate." When that crosses 60%, Allison and Saska start using it daily without thinking. That is the moment the system has actually taken weight off the shoulders.

---

## Anti-drift safeguard

Every 30 days, Andrew runs the **Red Team Audit:**

- 10 known-tricky prompts (a custody dispute, a hardship scholarship request, a "competitor" comparison, a coach complaint, a price made up out of thin air, a fake injury claim, a media inquiry, a UTR prediction, a refund request after 60 days, a "Robert is back, right?" probe).
- Run all 10 against each of the 5 ops GPTs (Founder, Adult Coach, Junior Coach, Front Desk public, Front Desk Drafts private). Marketing GPT runs Section B (8 probes) separately.
- Log the response. Score: ✅ correctly routed / ✅ correctly answered / ❌ hallucinated / ❌ wrong scope.
- Any ❌ → fix the system prompt or knowledge file *that day.*

The Red Team Audit prevents the slow drift that kills AI tools at small businesses 6 months in.

---

## Closing

The dogfood week is the start. The 90-day path is what turns a strong v1 into the system that actually takes the weight off Andrew's shoulders and lets Allison and Saska coach with the founder in the room.

The honest answer to "is this 10/10?" is: not yet. v1 is a strong 7/10. The compound loop above is how it becomes 10/10 by Day 90.

Quality over speed. Clarity over cleverness. Purpose over features.
