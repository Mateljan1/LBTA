# LBTA Adult Coach GPT — Activation Script (Allison, Day 1)

> 20 minutes. Allison + Andrew, in person. Goal: by the end of the session, Allison has shipped one real email and one real recap from this GPT — and trusts it for tomorrow.

---

## Why a script

Most coaches abandon a tool inside a week if they don't ship something real with it on day 1. This script forces three real outputs: one parent/member email, one clinic recap, one league prep doc. Each one Allison would have written anyway, just faster and in a clearer voice.

## Prep (3 min, before Allison sits down)

- Andrew opens the GPT, runs all 4 conversation starters quickly, confirms it's responding correctly.
- Quiet table. Phones face-down.
- Allison brings: one real adult member email she's been putting off, one set of notes from this week's clinic, the upcoming league roster.
- Andrew explains the rule: **"You drive. I watch. I'll only jump in if it goes off voice."**

## Round 1 — Ship one member email (8 min)

**Allison's prompt to the GPT (paste verbatim):**

> *"I'll paste a member email below. Draft a reply in my voice — warm, peer-level, specific. Stay under 8 sentences. End with `support@lagunabeachtennisacademy.com` and `(949) 534-0457`. If it's a scheduling conflict on a clinic I run, suggest a fix. If it's a complaint about another coach, route it to Andrew."*
>
> *"[paste email]"*

**Allison's job:**
- Read once. Don't edit yet.
- Ask herself: would I sign this exactly? If yes — copy to Gmail, send.
- If no — tell the GPT what's off and ask for v2. Use Allison's actual words: "too stiff," "missed the part where she mentioned her shoulder," "wrong league reference."
- Send.

**Outcome:** one real member email shipped. Time saved logged in `05-OPERATIONS/eval/weekly-metrics.csv`.

## Round 2 — Weekly clinic recap (6 min)

**Prompt:**

> *"Draft this week's recap for the [Tuesday 9am women's clinic / Thursday 10am men's clinic / etc]. Format: 1-line group recap, 2 specific things we worked on, 1 thing players can do at home this week, next week's focus. Skip names unless I tell you a specific player did something worth calling out. Sign off with my first name."*
>
> *"[Allison pastes her court notes — bullet points are fine]"*

**Allison's job:**
- Read the draft. Sit with it. Does it sound like her?
- Edit one or two lines to sharpen the at-home tip.
- Save in Drive (or Gmail draft to the clinic distribution list).

**Outcome:** one real recap drafted in 6 minutes instead of 25.

## Round 3 — League prep (4 min)

**Prompt:**

> *"For our [USTA Adult 3.5 / 4.0 / Combo] team this season — give me a 5-minute prep talk to deliver before our next match against [opponent]. Lead with one tactical adjustment based on opponent strength. End with the LBTA mindset cue (Movement / Craft / Community). Keep it under 200 words."*

**Allison's job:**
- Read once.
- Mark the line that's worth saying out loud.
- Save in Drive under the team folder.

**Outcome:** Allison has a deliverable for next match.

---

## Closing ritual (under 1 min)

- Andrew asks Allison: **"On a scale of 1–10, how much did this help?"**
- If 7+: pin the GPT to her browser. Set a tomorrow trigger ("Every member email gets pasted in first").
- If <7: log the why in `05-OPERATIONS/eval/dogfood-log-template.md`. Don't oversell. The GPT compounds with use, not with pep talks.

## What success looks like 7 days from now

- Allison drafts ≥ 5 emails through the GPT.
- ≥ 30 min/day saved.
- One time the GPT was wrong; Allison caught it and logged it (this is healthy).
- At Friday Compound Review, Allison brings one specific change request ("it keeps signing off too formal — let's tweak the prompt").

## What failure looks like

- "I forgot to use it." → Trigger isn't tight. Reset: "Every member email goes through the GPT first, no exceptions, for 7 days."
- "It writes too formal / too founder, not me." → Voice drift. Andrew updates the system prompt with 3 of Allison's actual past emails as voice anchors. Re-paste.
- "It made up a price / date / coach name." → Hallucination. Open `05-OPERATIONS/runbooks/hallucination-incident.md` with Andrew the same day.

---

## Andrew's job after the session

- Send Allison a one-line Slack/text: *"You shipped 3 things in 20 min. The GPT works. Use it tomorrow morning."*
- Block Friday 30 min on the calendar for the first Compound Review (Allison + Andrew).
- Write down one thing Allison said about voice — fold it into the prompt before Friday.

---

**Allison, when in doubt:** ship the draft. The GPT learns by being used, not by being studied. The first 7 days are about reps, not perfection.
