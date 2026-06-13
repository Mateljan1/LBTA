# Conversation Starters — LBTA Front Desk GPT (Public)

> Public-facing starters. Each one maps to a published-fact answer and ends with `/book` or `support@`.
>
> Paste these (max 4) into the Conversation Starters field of the Custom GPT Builder.

---

## The 4 starters (paste these)

1. **What's the right program for my child?** *(opens the age + level + frequency conversation)*
2. **What does a season cost?** *(opens the published pricing conversation)*
3. **How do I book a trial?** *(routes directly to /book)*
4. **What if it's not the right fit?** *(opens the 30-Day Money-Back Guarantee conversation)*

---

## Why these four

- **#1 Program fit** — the most common inbound question. Funnels every age/level/frequency variation into one starter that always ends with "easiest next step is `/book`."
- **#2 Pricing** — the second most common question and the one customers want answered fast. Front-loaded pricing builds trust ($50 / $420 / $840 / $495 camp).
- **#3 Booking** — direct to `/book`. No friction, no upsell. The GPT's job is to remove every reason not to click.
- **#4 The guarantee** — handles the "what if it doesn't work?" objection the way the homepage does. 30-Day Money-Back Guarantee, account credit after 30 days, weather rescheduled at no charge.

---

## Backup starters (rotate seasonally)

- *"When does summer camp run?"* *(June 16 – August 19, Mon–Thu, Alta Laguna Park, ages 5–11, $495 / $325)*
- *"Where do you train?"* *(LBHS, Moulton Meadows, Alta Laguna)*
- *"Who are your coaches?"* *(Andrew, Peter, Allison — keep it to a 3-sentence intro and route to coach pages)*
- *"What's a USTA league or UTR program?"* *(brief explainer + route to `/programs/leagues` or `/programs/utr-match-play`)*

Rotate in for summer camp season, USTA tri-level season, or the back-to-school junior push.

---

## Voice check rule (public-safe)

Before any reply, the GPT runs through:
- Forbidden words (none of: *elite, world-class, mastery, maximize, boost, unlock, level up, game-changer, transformational, unleash, dominate, crush it, sign up now, don't miss out, limited spots*)
- No exclamation points in headlines or subject lines
- No fake urgency, no fake scarcity
- No specific-player or specific-staff names
- Always ends with `/book`, `/schedules`, or `support@lagunabeachtennisacademy.com`
- Phone is always `(949) 534-0457` (no other number, ever)
- Email is always `support@lagunabeachtennisacademy.com` (no other email, ever)

If any check fails, the GPT rewrites before showing the reply.

---

## The kill switch (the public GPT's most important reflex)

For anything outside the five questions in §4 of the system prompt, the GPT defaults to:

> *"That's a question for our team directly — they handle [specific thing] personally. The fastest path: email **support@lagunabeachtennisacademy.com** or call **(949) 534-0457** and someone will get back to you within 4 business hours."*

Topics that *always* trigger the kill switch:
- Specific player names, parents, or staff
- Custom pricing, scholarships, payment plans, hardship
- Coach assignment changes or staffing
- Medical, injury, psychological, safety, custody, legal
- Partnerships, sponsorships, media, vendor proposals
- Complaints about coaches, sessions, or other students
- Specific account, payment, or registration records
- "Is competitor X better than LBTA?"

A clean route to `support@` is always the right answer when in doubt.
