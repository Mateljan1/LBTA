# 07 — Legal & Privacy

> Everything related to how we tell members, parents, and coaches that LBTA uses AI in its communications, and what they're agreeing to. Plain language. Defensible.

---

## Files in this section

| File | Audience | When to use |
|---|---|---|
| `privacy-disclosure.md` | Public (members, parents, prospects) | Lives in our website footer / FAQ. Updated whenever AI use materially changes. |
| `terms-of-use-internal.md` | Coaches with GPT access | Counter-signed once, before activation. Re-signed annually. |
| `coach-consent-form.md` | Each coach individually | Signed once, before voice samples and Gmail integration are turned on. |
| `parent-consent-language.md` | Drafted, not deployed | Optional enrollment add-on. Hold until counsel review. |

## Posture

- **Disclose, don't hide.** If a parent asks, we tell them honestly how we use AI.
- **Coach-reviewed before send.** No auto-send. Ever.
- **Anonymize before upload.** Member PII never touches a Custom GPT's knowledge files or training samples.
- **Easy opt-out.** A parent can request human-only communication at any time. No friction, no retention impact.
- **Low surface area.** AI is for drafting routine logistics. Human for everything personal.

## Order of operations

1. **Before any coach activates a GPT:** Andrew reviews + signs `terms-of-use-internal.md` and gets the coach's signature on `coach-consent-form.md`.
2. **Before publishing the Front Desk GPT:** Verify `privacy-disclosure.md` is live on the website footer or FAQ.
3. **Before deploying explicit parent consent:** Andrew runs `parent-consent-language.md` past counsel/privacy advisor. Today: keep as draft.

## Annual review

Once a year (typically in January, paired with the annual strategy review in `05-OPERATIONS/scripts/annual-strategy-review.md`):
- Re-read all four files in this folder.
- Update for any new AI tools, integrations, or vendors added during the year.
- Have each active coach re-sign `terms-of-use-internal.md` and `coach-consent-form.md`.
- Update the website footer disclosure if `privacy-disclosure.md` changed.

## Owner

**Andrew Mateljan.** This is founder-level responsibility. It does not delegate to coaches.
