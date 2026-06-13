# LBTA Junior Coach GPT — Activation Script (Saska, Day 1)

> 20 minutes. Saska + Andrew, in person. Goal: by the end of the session, Saska has shipped one real parent email and one weekly recap from this GPT — and trusts it for tomorrow.

---

## Why a script

Junior coaching parent comms are the highest-emotion, highest-volume drafts in the academy. The GPT either becomes Saska's most-used tool inside a week, or she abandons it. The 20-minute first session is the difference. Three real outputs.

## Prep (3 min, before Saska sits down)

- Andrew opens the GPT, runs all 4 conversation starters, confirms it responds correctly.
- Quiet table. Phones face-down.
- Saska brings: one real parent email she's been putting off, this week's group notes (5–10 bullet points), the upcoming summer camp dates.
- Andrew explains the rule: **"You drive. I watch. I'll only jump in if it goes off voice or off scope."**

## Round 1 — Ship one parent email (8 min)

**Saska's prompt to the GPT (paste verbatim):**

> *"I'll paste a parent email below. Draft a reply in my voice — warm, parent-aware, specific. Lead with one observation about the kid (if I gave you context). Stay under 8 sentences. End with `support@lagunabeachtennisacademy.com` and `(949) 534-0457`. If the email is emotionally charged (kid cried, parent worried, custody, safety) — write a 24-hour holding reply, not a customer-final, and flag it for Andrew."*
>
> *"[paste email]"*

**Saska's job:**
- Read once. Don't edit yet.
- Check: does the kid feel seen, not described as a "student"?
- If yes — copy to Gmail, edit one line if needed, **send.**
- If no — tell the GPT exactly what's off ("you missed that he was nervous about the new group," "too clinical," "feels like a chatbot wrote it") and ask for v2.

**Outcome:** one real parent email shipped. Time saved logged in `05-OPERATIONS/eval/weekly-metrics.csv`.

## Round 2 — Weekly group recap (6 min)

**Prompt:**

> *"Draft this week's recap for the [Tuesday 4pm 8-10s / Saturday 9am 11-13s / etc]. Format: 1-line group recap, 2 specific things we worked on, 1 thing parents can do at home this week, next week's focus. Skip naming individual kids unless I tell you to call out something specific. Sign off with my first name."*
>
> *"[Saska pastes group notes — bullets fine]"*

**Saska's job:**
- Read once. Sit with it.
- Edit one line to sharpen the at-home tip.
- Save in Drive (or Gmail draft to the parent distribution).

**Outcome:** one real recap in 6 min instead of 25.

## Round 3 — Camp packing-list one-pager (4 min)

**Prompt:**

> *"Draft a one-page parent prep doc for our [Week of June 16 / July 7 / etc] junior camp at Alta Laguna Park. Include: drop-off / pickup time, packing list (water, sunscreen, hat, snack, racquet, court shoes), weather plan, what kids will work on this week, who to text if something comes up. Tone: warm, calm, specific. End with `support@` and `(949) 534-0457`. Use Canvas for the layout."*

**Saska's job:**
- Read once.
- Edit any camp-specific details (which week, which group).
- Save in Drive under the camp folder.

**Outcome:** Saska has a deliverable for the next camp parent send.

---

## Closing ritual (under 1 min)

- Andrew asks Saska: **"On a scale of 1–10, how much did this help?"**
- If 7+: pin the GPT to her browser. Trigger for tomorrow: *"Every parent email gets pasted in first."*
- If <7: log the why in `05-OPERATIONS/eval/dogfood-log-template.md`. Don't oversell. The GPT compounds with use.

## What success looks like 7 days from now

- Saska drafts ≥ 5 parent emails through the GPT.
- ≥ 30 min/day saved.
- One time the GPT was wrong; Saska caught it and logged it.
- At Friday Compound Review, Saska brings one specific change request.

## What failure looks like

- "I forgot to use it." → Trigger isn't tight enough. Reset.
- "It writes too generic / too founder, doesn't sound like me with parents." → Voice drift. Andrew updates the prompt with 3 of Saska's actual past parent emails as anchors. Re-paste.
- "It made up a kid's progress detail." → 🚨 Critical. Open `05-OPERATIONS/runbooks/hallucination-incident.md` immediately. **Especially serious for junior comms.**

---

## Andrew's job after the session

- Saska text: *"You shipped 3 things in 20 min. Trust it tomorrow."*
- Block Friday 30 min for first Compound Review.
- Note one voice cue Saska gave; fold into prompt before Friday.

---

## Special note for junior comms

Anything involving a child's emotional or physical safety, custody, or a parent complaint about another coach — **the GPT must not draft a customer-final.** It writes a 24-hour holding reply and flags for Andrew. Verify this on Day 1 by feeding it a fake "my kid was crying after practice" email and confirming the response is a holding reply, not a final.

---

**Saska, when in doubt:** ship the draft. The GPT learns by being used. Reps over perfection.
