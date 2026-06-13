# Voice Samples — How They Work

> The single biggest thing that separates "AI slop" from "this sounds like Andrew/Allison/Saska" is **good voice samples.** This folder holds anonymized examples of how each coach actually writes. The role-specific GPTs read these to anchor voice. Without them, drafts are generic. With them, drafts pass.

---

## Files in this folder

| File | Owner | What it is |
|---|---|---|
| `andrew-voice.md` | Andrew (Founder) | 8–12 anonymized emails Andrew has actually sent. |
| `allison-voice.md` | Allison (Adult Coach) | 8–12 anonymized parent/member emails Allison has sent. |
| `saska-voice.md` | Saska (Junior Coach) | 8–12 anonymized parent emails Saska has sent. |
| `lbta-public-voice.md` | LBTA (Front Desk) | 8–12 anonymized website FAQ-style answers, schedule confirmations, marketing copy. |
| `marketing-voice.md` | Andrew (Founder) | 10–14 anonymized public-facing marketing pieces (IG, newsletter, blog, partner outreach). **Different from `andrew-voice.md`** — those are 1:1 emails; this is one-to-many copy. |

Templates for all five are below.

## How to fill them

### Step 1: Get coach consent (one-time)

Before harvesting any past emails, get the coach's signature on `07-LEGAL-PRIVACY/coach-consent-form.md`. This is the one-time "yes, you can pull my past emails and anonymize them" gate.

### Step 2: Pick 8–12 strong examples per coach

Look for emails that:
- Show their actual voice (not over-edited, not formal templates).
- Cover the **range** they write — short logistics, longer thoughtful ones, gentle pushback, warm thank-yous.
- Were **well-received** (parent replied positively, member followed through).
- Span the past 12 months (not all from one week — coaches' voice varies by season).

Avoid:
- Emails that are 80% canned/templated.
- Emails written under pressure (frustration, late-night).
- Emails about a specific incident that won't generalize.

### Step 3: Anonymize ruthlessly

Replace:
- Last names → first name + initial. ("Sarah Johnson" → "Sarah J.")
- Phone numbers → `(XXX) XXX-XXXX`.
- Email addresses → `[email]`.
- Specific addresses → `[address]`.
- Specific dates → `[Tuesday, week of Apr 14]` (keep the day-of-week and rough timeframe; remove the year unless relevant).
- Anything that identifies a specific kid (medical, behavioral, family-specific) → generalize or remove the email entirely. **When in doubt, drop the email.**

### Step 4: Add light annotation

Below each anonymized email, a line about why it's a good voice sample. E.g.:

> *Why this works: gentle pushback on a parent comparing two academies, without making the parent feel wrong. Lands the LBTA difference in two sentences. Andrew's calm-confident tone.*

This annotation helps the GPT understand WHY the email is exemplary, not just WHAT it says.

### Step 5: Upload to GPT

Once a coach's `*-voice.md` file is filled with 8–12 samples + annotations:

1. Save it here.
2. ChatGPT → [Coach's GPT] → Configure → Knowledge → Upload `[coach]-voice.md`.
3. Save → Update.
4. Run conversation starter #1 and verify drafts now sound more like the coach.

### Step 6: Maintenance

- **Monthly:** Quick scan. Did any new exemplary email come in? Add it. (See `05-OPERATIONS/scripts/monthly-knowledge-refresh.md`.)
- **Quarterly:** Full review. Are the samples still representative? Replace any that don't ring true. Cap at 12 per coach (more is not better — it dilutes the signal).
- **When a coach's voice drifts:** First check is "are the voice samples still right?" Often the fix is updating samples, not the system prompt.

## What good looks like (a sample annotation)

> ```
> Subject: Re: Tuesday clinic — make-up?
>
> Hi [Parent Name],
>
> No problem at all. We don't formally do make-ups in the seasonal — the cadence is the point — but Marcus is welcome to come Saturday at 9 if he wants to keep his rhythm. Tell him to bring water.
>
> Andrew
> ```
>
> *Why this works: respects the policy without being rigid. "The cadence is the point" is voice. Offers a path that keeps the kid in rhythm. Short, warm, specific. No apology, no excuse-making. This is the calm-confident center of Andrew's voice.*

## Templates

See:
- `andrew-voice.md` (template — 12 slots, 1:1 emails)
- `allison-voice.md` (template — 12 slots)
- `saska-voice.md` (template — 12 slots)
- `lbta-public-voice.md` (template — 12 slots)
- `marketing-voice.md` (template — 14 slots, public-facing one-to-many marketing copy)

Each template has numbered slots ready to fill.

## House rules

- **Never** put a real member's last name, full email, or phone in here. Even in a "draft" — accidental commits happen.
- **Never** use voice samples that mention a kid's medical, behavioral, custodial, or safety details. Drop the email entirely.
- **One file per coach.** Don't split.
- **Cap at 12.** More dilutes the signal.
- **Good > complete.** Six exemplary anonymized emails beats twelve mediocre ones.

## Owner

Andrew owns the harvesting + anonymizing process. Coaches own the consent and the voice itself.
