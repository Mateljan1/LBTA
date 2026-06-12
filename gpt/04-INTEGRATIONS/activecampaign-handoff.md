# ActiveCampaign Handoff — Founder, Adult Coach, Marketing GPTs

> ActiveCampaign (AC) handles email automation, broadcast campaigns, and the lead pipeline. **GPTs do not write to AC.** Ever. They draft email copy; Andrew or Allison pastes the draft into AC and sends.
>
> The **Marketing GPT** is now the primary drafting GPT for the weekly newsletter and seasonal enrollment sequences. The Founder + Adult Coach GPTs continue to draft 1:1 nurture copy and re-engagement sequences when needed.

---

## Why no direct integration (universal rule)

1. **AC has APIs**, but writing campaigns or contacts via API is high-risk: a hallucinated tag, an unsubscribed contact resurfaced, or a wrong segment can damage deliverability.
2. **The drafting bottleneck is the value-add.** Andrew/Allison know AC; they don't need help operating AC. They need help drafting **copy** that goes into AC.
3. **Human-in-the-loop is non-negotiable** for any broadcast that hits 100+ people.
4. **Marketing GPT specifically:** it is forbidden from any direct AC write. The kill-switch in the system prompt is *"never auto-publish or send to any list."*

## How drafts flow (by GPT)

### Marketing GPT (newsletter + enrollment sequences)

```
Andrew: "Draft this Sunday's newsletter — focus on camp opening Monday
         and the new Tuesday adult clinic."
        │
        ▼
Marketing GPT: drafts in Canvas using the surface template from
               03-KNOWLEDGE-BRAIN/12-marketing-surfaces.md
               (eyebrow + headline + ~200w founder note + 3 callouts).
               Output is paste-ready for the AC block editor.
        │
        ▼
Andrew: copies into ActiveCampaign → reviews → schedules Sunday 7pm.
```

### Founder + Adult Coach GPTs (1:1 nurture, re-engagement)

```
Andrew: "Draft a welcome sequence for new junior trial sign-ups,
         3 emails over 7 days, in our voice."
        │
        ▼
Founder GPT: drafts 3 emails in Canvas, grounded in
             03-KNOWLEDGE-BRAIN/ + voice samples.
        │
        ▼
Andrew: copies drafts → ActiveCampaign → schedules → sends.
```

**Why two drafting paths exist:** the Marketing GPT is optimized for one-to-many copy (broadcast newsletter, IG, blog). The Founder/Adult Coach GPTs are optimized for one-to-few sequences (trial follow-up, post-camp nurture, re-engagement). Use the right tool for the surface — they will read different.

## Read access (indirect, via Drive)

If Andrew wants a GPT to be aware of past campaign performance:

**For coach GPTs (Founder, Adult Coach):**
1. Export the AC report as CSV.
2. Drop into `LBTA / Public-Safe Assets/04-Public-Press/` (or a new `06-AC-Reports/` subfolder).
3. The Founder/Adult Coach GPT can analyze via Code Interpreter.

**For Marketing GPT (Phase 2 only):**
1. Export anonymized AC reports (subject line, send time, open rate, click rate — no email addresses).
2. Drop into `LBTA / Marketing-Library / 03-ActiveCampaign / past-newsletters/`.
3. The Marketing GPT can analyze via Code Interpreter to spot subject-line patterns, optimal send times, etc.

This is read-only, indirect, and on-demand — not a live integration.

## What GPTs are good at (in the AC context)

**Marketing GPT (primary drafting role for broadcast):**
- Drafting weekly newsletter founder note (~200w) + 3 callouts (paste-ready for AC block editor).
- Drafting seasonal 5-email enrollment sequences (Spring, Summer, Fall openings).
- Drafting subject lines (10–20 variants per send for A/B candidates).
- Drafting preheader text.
- Editing AC drafts for voice + forbidden words before they ship.

**Founder + Adult Coach GPTs (drafting role for 1:1 + small-list):**
- Drafting nurture sequences (welcome, re-engagement, post-trial).
- Drafting personal follow-ups for trial conversions.
- Editing existing copy for voice and brevity.

## What GPTs do NOT do (any GPT, ever)

- Schedule campaigns.
- Edit contacts, tags, or segments.
- Trigger automations.
- Pull live deliverability stats from the AC API.
- Send drafts directly into AC's outbox.

## Output format from the Marketing GPT

When asked to draft a newsletter, the Marketing GPT outputs in **AC-block-editor-compatible** format:

```
EYEBROW: SUNDAY NOTES
HEADLINE: What I noticed at camp this week.

[Founder note block — ~200 words, single paragraph or 2–3 short paragraphs]

— Andrew

---

[Block 2: Three program callouts — each is one of AC's "Text + Button" blocks]

1. JUNIOR DEVELOPMENT · Tue/Thu 3:30pm · Coach Peter · Moulton Meadows
   Ages 8–12, structured movement-first development.
   [Button: Schedule | URL: https://lagunabeachtennisacademy.com/schedules]

2. ADULT BEGINNER CLINIC · Wed 6:30pm · Coach Allison · LBHS
   Six-week clinic for first-time players. New cycle starts in two weeks.
   [Button: Schedule | URL: https://lagunabeachtennisacademy.com/schedules]

3. HIGH SCHOOL CAMP · Aug 11–14 · Alta Laguna Park
   Pre-season prep for varsity-bound players. Three spots open.
   [Button: Schedule | URL: https://lagunabeachtennisacademy.com/schedules]

---

FOOTER: support@lagunabeachtennisacademy.com · (949) 534-0457
"Tennis, as it should be taught." (anchor — optional)
```

Andrew copies each block into the matching AC block in the editor. No reformatting needed.

## Future state (12 months out)

If AC drafting becomes >50% of Andrew's weekly load, consider:
- A **`05-OPERATIONS/scripts/ac-export.py`** to pull weekly AC report → Drive automatically.
- A **read-only AC custom action** for the Marketing GPT (Phase 3, Day 60+) that pulls subject-line + open-rate history without write access. See `gpt/02-GPT-BUILDS/05-Marketing-GPT/capabilities.md`.

For now: Marketing GPT covers broadcast drafting; Founder + Adult Coach cover 1:1 drafting.
