# Runbook — Marketing Incident

> Anything off-voice, off-brand, factually wrong, consent-violating, or near-published from the Marketing GPT. Andrew owns. **First action: pause use, then check what shipped.**
>
> The Marketing GPT is the GPT closest to the public reputation surface. The blast radius of one bad post (newsletter, IG carousel, blog, ad) is large — measured in subscribers, follower trust, and partner relationships. This runbook treats every incident with that weight.

---

## Trigger conditions

Open this runbook if any of the following happens:

### Voice / brand drift
- A draft uses a forbidden word from `gpt/03-KNOWLEDGE-BRAIN/11-marketing-brand-voice.md` (elite, world-class, master, maximize, boost, transform, "don't miss out", "limited time", etc.).
- A draft has 3+ exclamation points across a single piece, or any exclamation in a headline / subject line / blog title / ad headline.
- A draft uses ALL CAPS for emphasis.
- A draft sounds generic-AI ("In today's fast-paced world", "Are you tired of…?", "Look no further").
- A draft drops one of the brand anchors more than once per piece (the seasoning rule).
- A piece **shipped** with any of the above.

### Factual / grounding drift
- A draft cites a coach who isn't on staff (e.g. references Robert — he's no longer with LBTA).
- A draft references a program / camp / clinic that doesn't exist on `lagunabeachtennisacademy.com`.
- A draft cites a price that doesn't match the website.
- A draft uses a phone number / email / address that isn't `(949) 534-0457` / `support@lagunabeachtennisacademy.com` / `1098 Balboa Ave, Laguna Beach, CA 92651`.
- A draft cites Web Search results from outside the whitelist (Reddit, Yelp, competitor sites, "top 10" blogs).

### Consent / privacy
- A draft references a player by full name without a check that consent is on file.
- A draft includes a player photo or quote that hasn't been consent-cleared (see `gpt/03-KNOWLEDGE-BRAIN/13-marketing-asset-library.md`).
- A draft was published with a player's image when consent has expired (>12 months old).
- A draft fabricates a testimonial.

### Image-gen near-violation
- Marketing GPT generated a photorealistic image of a "real-looking player" — even labeled `DRAFT`.
- An AI-generated image came within one click of being published (Andrew almost copied it to Canva → IG, etc.).
- An image-gen request for a real person (Andrew, Peter, Allison) succeeded in producing a face — even abstract.

### Auto-publish / scope violation
- The GPT attempted to send via Gmail (it should never).
- The GPT generated a "blast" email draft addressed to a contact list it inferred.
- The GPT pushed copy to ActiveCampaign, Meta, Google Ads, or any platform via API (this should be impossible — investigate immediately).
- A draft skipped the 5-pass internal review and was shipped without Andrew's review.

### Performance signals (slower triggers)
- 2+ unsubscribes from a single newsletter that the Marketing GPT drafted.
- A partner replies to a Marketing-GPT-drafted outreach with confusion or offense.
- An IG post the GPT drafted gets a reply from a parent calling out tone or accuracy.
- Andrew has rewritten 3+ Marketing GPT drafts in one week (the GPT isn't pulling its weight; recalibrate).

---

## Severity rubric

| Severity | What it looks like | Response |
|---|---|---|
| **Critical** | A piece shipped publicly with a forbidden word, factual error, consent violation, or fake testimonial. Or: image-gen near-publish of a realistic face. Or: GPT attempted auto-publish. | Pause GPT immediately. Steps 1–6 below. Same-day fix. |
| **High** | A draft contains a forbidden word, factual error, or consent issue but Andrew caught it before publishing. Repeated voice drift across 3+ drafts in one week. | Pause GPT. Steps 1–5 below. 48hr fix. |
| **Medium** | One-off voice drift Andrew caught in review. Subject line that almost broke the forbidden-word rule. A single weak draft. | No pause. Note in Friday Compound Review. Fix at next monthly knowledge refresh. |
| **Low** | A draft was less specific than usual. A surface template wasn't applied perfectly. Andrew rewrote one paragraph. | No action. Track frequency. If it becomes a pattern → escalate to Medium. |

**Key:** **Critical = something shipped or almost shipped.** **High = caught in review.** Don't downgrade Critical to High because "we caught it eventually" — by definition, Critical means the system didn't catch it before the operator did.

---

## Step 1 — pause use (5 min, Critical/High only)

1. **Stop drafting.** Don't ask the Marketing GPT to do anything else until the incident is resolved.
2. **Pull anything in flight.** If a newsletter is scheduled in ActiveCampaign and the incident affects it: unschedule. If an IG post is queued: pull from queue. If a partner email is in Gmail Drafts: do not send.
3. **Slack the team** (if applicable): *"Marketing GPT paused. Investigating an incident. Will share update by [time]. Don't ship Marketing GPT drafts in the meantime."*

For Medium/Low: skip Step 1 — go straight to capture + fix at the next Friday Compound Review.

---

## Step 2 — assess blast radius (10–30 min)

The Marketing GPT touches public surfaces. Figure out who saw what:

| Surface | What to check | Where to check |
|---|---|---|
| **Newsletter** | Was it sent? How many recipients? Open rate so far? | ActiveCampaign → Campaigns → recent send |
| **IG post / carousel** | Posted? Likes? Comments? Reach? | IG Insights → recent post |
| **IG story** | Live? Views? Replies? | IG Story Insights (24hr window) |
| **Blog post** | Published? Indexed by Google? Backlinks? | `lagunabeachtennisacademy.com/blog/` + Google Search Console |
| **Partner email** | Sent from Gmail? Opened? Replied? | Gmail Sent + reply thread |
| **Ad** | Active in Google / Meta? Impressions? Clicks? | Google Ads / Meta Ads Manager |

**Document:** what surface, what audience size, what time it went live, current engagement.

---

## Step 3 — capture the incident (10 min)

- Save the **GPT chat** that produced the bad draft. (ChatGPT → … → Share → copy link, or screenshot the full thread.)
- Save the **published asset** (newsletter HTML export, IG screenshot, blog URL, etc.).
- Note **what was wrong**, **what the brief was**, and **what the GPT did with the brief**.
- If anyone external flagged it (parent, partner, subscriber): note who, when, and what they said.

---

## Step 4 — diagnose root cause (20–60 min)

Map the failure to a category:

| Symptom | Likely cause | First file to check |
|---|---|---|
| **Forbidden word slipped through** | Voice drift, or weak voice samples in `marketing-voice.md` | `gpt/03-KNOWLEDGE-BRAIN/voice-samples/marketing-voice.md` |
| **Wrong fact (program, price, coach name)** | Knowledge file outdated, or grounding rule not enforced | `gpt/03-KNOWLEDGE-BRAIN/01-academy-facts.md`, `02-programs-pricing.md`, `03-coaches.md` |
| **Wrong tone (salesy, hyped)** | System prompt's tone section eroded, or the GPT wasn't given enough context for the surface | `gpt/02-GPT-BUILDS/05-Marketing-GPT/system-prompt.md` |
| **Cited Web Search outside whitelist** | Whitelist loosened or the GPT searched without checking domain first | `gpt/04-INTEGRATIONS/web-search-whitelist.md` |
| **Used a player name without consent check** | Consent-check logic missing or bypassed | `gpt/03-KNOWLEDGE-BRAIN/13-marketing-asset-library.md` |
| **Generated a realistic AI face** | Image-gen kill-switch failed — refusal logic needs strengthening | `gpt/04-INTEGRATIONS/image-generation-policy.md` |
| **Attempted to send / publish / write to AC** | System prompt's kill-switch eroded — should be impossible, investigate immediately | `gpt/02-GPT-BUILDS/05-Marketing-GPT/system-prompt.md` (Default Behaviors / Kill Switch section) |
| **Skipped 5-pass internal review** | Internal review section in system prompt is too vague or got truncated | `gpt/02-GPT-BUILDS/05-Marketing-GPT/system-prompt.md` |

---

## Step 5 — fix (30–90 min)

Apply the fix to the **knowledge file or system prompt** that was the root cause.

**For voice drift:**
1. Add 2–3 stronger voice samples to `voice-samples/marketing-voice.md` showing the right voice for the surface that drifted.
2. Re-upload the file to the Marketing GPT (Configure → Knowledge → replace file).
3. If a forbidden word slipped: tighten the forbidden-word list in `11-marketing-brand-voice.md`. Add the specific pattern that slipped (e.g. "next-level", "ultimate guide").

**For factual drift:**
1. Update the relevant knowledge file (`01-academy-facts.md`, `02-programs-pricing.md`, `03-coaches.md`).
2. Re-upload to the Marketing GPT.
3. Verify by asking the GPT the same question that produced the wrong fact — confirm correction.

**For image-gen near-violation:**
1. Tighten the refusal logic in `system-prompt.md` (the "Default Behaviors / Kill Switch" section).
2. Add a red-team probe to `eval/red-team-audit-template.md` for the specific request pattern that succeeded.
3. Re-upload the system prompt.

**For consent violation:**
1. Update `13-marketing-asset-library.md` consent check protocol.
2. Add an explicit requirement in the system prompt: *"Before any draft references a player by name, output `[NEEDS ANDREW VERIFY: consent for [player] on [surface]]`."*
3. Re-test with a probe.

**For auto-publish / scope violation:**
This should be impossible by design (no API write access exists). If it happened:
1. Audit the GPT's Custom Actions configuration (Configure → Actions). Confirm there are no actions enabled.
2. Audit Gmail integration. Confirm "send" scope is NOT granted.
3. Audit ActiveCampaign integration. Confirm no API key is configured.
4. If any of the above is wrong: revoke immediately. Re-create the GPT from scratch if uncertainty remains.

---

## Step 6 — public response (Critical only, 30–60 min)

If something **shipped publicly** and is harmful (factually wrong, consent-violating, off-tone enough that it damages trust):

| Surface | Action |
|---|---|
| **Newsletter (already sent)** | Send a correction email to the same segment within 4 hours. Subject: *"Correction to today's note."* Brief, calm, specific about what was wrong. Don't grovel; don't make a thing of it; do correct it. |
| **IG post** | Delete or archive immediately. Repost corrected version with a story note: *"Earlier post had an error — fixed."* |
| **IG story** | Delete. Add a replacement story note if relevant. |
| **Blog post** | Edit in place. Add a footnote at the bottom: *"Updated [date] to correct [what]."* |
| **Partner email (already sent)** | Reply to the original thread within 30 min. *"[Partner name], my apologies — I want to correct one thing in the note I sent earlier: [what]. Here's the right version."* |
| **Ad** | Pause immediately. Edit. Restart only after Andrew approves. |
| **Consent violation** | Reach out to the affected family within 24 hours. Apologize directly. Take down the asset across all surfaces. Document the conversation. |

**Tone for any public correction:** the LBTA voice — calm, specific, no over-apologizing. *"Earlier today's note said our spring camp opens June 9. The actual opening date is June 16. Corrected here. Thanks for the patience — Andrew."*

---

## Step 7 — compound the learning (15 min)

- Append the incident to the **Incident log** at the bottom of this file (template below).
- Add a **probe** to `gpt/05-OPERATIONS/eval/red-team-audit-template.md` covering the failure mode. *Same attack should never work twice.*
- If the failure was a knowledge gap → flag the knowledge file for the next monthly refresh.
- If the failure was a system-prompt erosion → version-control note it; re-paste the system prompt from `gpt/02-GPT-BUILDS/05-Marketing-GPT/system-prompt.md` to confirm parity.
- Bring it to the **next Friday Compound Review**: what happened, what we learned, what changed.

---

## Pull-it-down threshold

If the Marketing GPT has **2 Critical incidents in 30 days**, **stop using it.**

1. Audit the system prompt for parity against `gpt/02-GPT-BUILDS/05-Marketing-GPT/system-prompt.md`.
2. Re-upload all knowledge files from this repo (overwrite ChatGPT's stored versions).
3. Run the full red-team audit — must pass with 0 critical failures.
4. Run a 7-day **second dogfood week** before resuming public-facing drafting.
5. If a third Critical hits within 60 days of the second dogfood week: **rebuild from scratch** (new GPT instance, fresh system prompt, fresh knowledge upload). The current instance is corrupted somehow.

---

## Incident log template

```
### Incident YYYY-MM-DD-NN
- **Severity:** [Critical / High / Medium / Low]
- **Surface affected:** [Newsletter / IG post / IG story / Blog / Partner email / Ad / Image draft]
- **Blast radius:** [audience size, time live, engagement so far]
- **Trigger:** [what the brief was, what the GPT produced]
- **What was wrong:** "..." [the specific text or image]
- **What it should have been:** "..." [the corrected version]
- **Root cause:** [from the table in Step 4]
- **Fix:** [what file changed]
- **Public response:** [if applicable: what we sent, when]
- **Audit score after fix:** [N/N red-team probes pass]
- **Time paused → resumed (or pulled down):** [duration]
- **External outreach:** [partner / parent / subscriber contact, what we said]
- **New probe added to red team:** [the prompt that catches this in the future]
```

---

## Incident log

(append below)

---

## Quick-reference: who owns what

- **Andrew (Founder):** owns this runbook. First responder for every Critical/High.
- **Marketing operator (when designated):** flags Medium/Low at the Friday Compound Review. Cannot resume publishing after a Critical/High pause without Andrew's go-ahead.
- **Allison / Saska:** not involved unless a Marketing GPT incident affects program copy they teach (rare).

## Cross-references

- **Voice drift specifically:** see `voice-drift.md` in this folder.
- **Hallucination specifically:** see `hallucination-incident.md`.
- **Public-surface (Front Desk) incidents:** see `front-desk-incident.md`.
- **Red-team probes:** see `gpt/05-OPERATIONS/eval/red-team-audit-template.md` (Marketing section).
- **Marketing GPT system prompt:** `gpt/02-GPT-BUILDS/05-Marketing-GPT/system-prompt.md` — ground truth for the GPT's safety rules.
