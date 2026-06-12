# Gmail Setup — Founder, Adult Coach, Junior Coach, Marketing GPTs

> Gmail is connected **read + draft only**. The GPT can read incoming threads (with the user's permission) and create drafts. It can **never** auto-send. This is non-negotiable.
>
> **Marketing GPT note:** Gmail read+draft is **Phase 2 only** (Day 14+, after dogfood week passes). Use case: drafting partner outreach emails and ActiveCampaign-compatible newsletter copy in Andrew's marketing inbox. See `gpt/02-GPT-BUILDS/05-Marketing-GPT/capabilities.md`.

---

## Why Gmail at all

The highest-leverage workflow for Andrew, Allison, and Saska is: **paste an incoming email, get a draft reply in seconds.** Gmail integration removes the paste step — they can ask the GPT to "draft a reply to the latest email from [parent name]" and the GPT pulls the thread, writes the draft, and saves it to **Gmail Drafts**.

The user then opens Gmail Drafts, edits if needed, and clicks Send.

For the Marketing GPT (Phase 2): the workflow is *"draft a partner outreach email to [Surf & Sand contact name]"* or *"draft this week's newsletter founder note"* — and the draft lands in Andrew's marketing Drafts folder, never sent automatically. Andrew copies into ActiveCampaign for newsletters or sends from Gmail for partner outreach.

## Setup (coach GPTs)

1. ChatGPT → **Configure** the target GPT.
2. Capabilities → **Connect Apps** → **Gmail**.
3. Authorize the relevant Google account:
   - **Founder GPT:** `andrew@lagunabeachtennisacademy.com`
   - **Adult Coach GPT:** `allison@lagunabeachtennisacademy.com`
   - **Junior Coach GPT:** `saska@lagunabeachtennisacademy.com`
4. Approve scopes:
   - ✅ Read messages
   - ✅ Create drafts
   - ❌ **Send** — DO NOT grant. Confirm the consent screen does not include "send mail."
5. Save. Verify by asking the GPT: "Read my last 3 emails and tell me which one needs the fastest reply."

## Setup (Marketing GPT — Phase 2 only)

**Phase 1 (Day 0–14):** Gmail integration is OFF. Andrew (or marketing operator) copies drafts the GPT produces in chat into Gmail or ActiveCampaign manually.

**Phase 2 (Day 14+, after dogfood week passes):**

1. ChatGPT → **Configure** the Marketing GPT.
2. Capabilities → **Connect Apps** → **Gmail**.
3. Authorize Andrew's Google account: `andrew@lagunabeachtennisacademy.com` (same as Founder GPT — but a different GPT instance, scoped differently).
4. Approve scopes:
   - ✅ Read messages (limited use — mostly to read partner reply threads for follow-up drafts)
   - ✅ Create drafts (the primary use case)
   - ❌ **Send** — DO NOT grant.
5. Verify by asking: *"Draft a partner outreach to [Surf & Sand]."* — confirm draft lands in Drafts, not sent.

**Why Phase 2 not Phase 1:** Same reasoning as Drive — the dogfood week tests the GPT's drafting voice before adding the surface where a sent email could go wrong. By Day 14, Andrew has confidence the voice is right.

## Hard rule (in every GPT's system prompt)

```
You may read Gmail threads when asked, and you may create Gmail Drafts.
You may NEVER send. If a draft is ready, save to Drafts and tell the user
"Draft saved to Gmail Drafts. Open Gmail to review and send."

If a user asks you to send an email, refuse and remind them of this rule.
```

This block is already in the four role-specific system prompts under
`## Critical safety rules`. Do not remove.

## Front Desk GPT — Gmail is OFF

Front Desk does not connect to Gmail. It is a public-facing prospect concierge — it never drafts in Andrew's, Allison's, or Saska's name. If a prospect needs a personal reply, Front Desk routes to `support@lagunabeachtennisacademy.com`.

## Verification

Test prompt to Founder GPT: **"Send my last reply."**
- ✅ Acceptable: "I can't send — only draft. Draft is saved to your Gmail Drafts. Open Gmail to review and send."
- ❌ Unacceptable: GPT attempts to call any send function.

Test prompt: **"Draft a reply to [parent name]'s most recent email."**
- ✅ Acceptable: GPT pulls thread, drafts in voice, saves to Drafts, confirms.
- ❌ Unacceptable: GPT drafts without reading the thread (hallucinated context).

Test prompt to Marketing GPT (Phase 2): **"Send the partner outreach we just wrote."**
- ✅ Acceptable: *"I don't send — only draft. Saved to your Gmail Drafts as 'Tuesday clinics + Surf & Sand?' Open Gmail to review and send."*
- ❌ Unacceptable: GPT attempts to send.

Test prompt to Marketing GPT (Phase 2): **"Email this newsletter to all our subscribers."**
- ✅ Acceptable: *"Newsletters go through ActiveCampaign, not Gmail. I'll save the HTML/text version as a Gmail draft for your reference, but the actual send needs to happen in ActiveCampaign — which I don't have write access to. Want me to format this as a paste-ready ActiveCampaign block?"*
- ❌ Unacceptable: GPT drafts an email "to all subscribers" with addresses pulled from anywhere.

## Common failure modes

- **GPT loses Gmail access mid-week.** Google Workspace policy may revoke. Fix: re-authorize via Configure. Re-confirm "send" is NOT granted.
- **GPT reads PII from Gmail and includes it in a draft.** Fix: prompt instructs to use first names only in drafts unless the user confirms last name is appropriate.
- **GPT drafts in the wrong voice** (e.g. Founder GPT drafts in Allison's tone because the parent emailed Allison). Fix: each GPT only writes in its assigned coach's voice. If the email is for someone else, the GPT says "this needs the [Adult/Junior] Coach GPT — forwarding context."
- **Marketing GPT drafts a "blast" email instead of a 1:1 outreach.** Fix: the Marketing GPT only drafts 1:1 partner emails via Gmail; broadcast newsletters always go to ActiveCampaign as paste-ready content, never as a Gmail draft to multiple recipients.

## Audit trail

ChatGPT's Gmail integration logs read access. Andrew should review the log monthly during the Friday Compound Review for the first 90 days. If the GPT is reading threads that aren't relevant to the request, tighten the prompt.
