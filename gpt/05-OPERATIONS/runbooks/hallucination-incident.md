# Runbook — Hallucination Incident

> A GPT confidently stated something untrue. Could be a price, a coach name, a date, a court availability, a player's progress detail. **Severity ranges from minor (typo) to brand-damaging (wrong public-facing claim).**

---

## Severity levels

| Level | Example | Response time |
|---|---|---|
| 🟢 **Low** | Internal-only, easy to spot, no one was misled. | Log in next Friday Compound Review. |
| 🟡 **Medium** | Internal draft about to go to a member that contains a wrong date. Caught before send. | Same day. Update knowledge file. |
| 🔴 **High** | Sent to a member or shown to a prospect. Includes a wrong price, wrong coach, made-up program. | Within 4 hours. See full protocol below. |
| 🚨 **Critical** | Front Desk GPT (public) hallucinated a fact. Or any GPT invented a child's progress detail in a parent email that was sent. | Within 1 hour. Pull public access if Front Desk. Andrew owns. |

## Critical / High protocol (4 steps, in order)

### 1. Stop — pause use of the affected GPT

- For Founder / Adult / Junior: tell the user "don't use this GPT until I update knowledge files." Slack or text them within 15 min.
- For Front Desk: **flip sharing back to "Only me"** if it was public. Take the embed off the website if linked.

### 2. Diagnose

- What exactly did the GPT say?
- What did it cite (or fail to cite)?
- Which knowledge file *should* have grounded the answer?
- Was the knowledge file outdated, missing the fact, or correct (meaning the GPT ignored the file)?

### 3. Fix

| Cause | Fix |
|---|---|
| Knowledge file outdated | Update the file. Re-upload to all 6 GPTs. |
| Fact missing from any file | Add it to the right file. Re-upload. |
| File was correct, GPT ignored it | Tighten system prompt grounding rules. Re-test. |
| User asked a question outside scope | Add explicit "I don't know that — route to support@" instruction in system prompt. |

### 4. Recover

- For sent emails / posts containing the wrong info: send a correction. Voice: calm, specific, no excuses. *"Quick correction — I told you the Saturday clinic was at 9am; the correct time is 10am. Apologies for the confusion."*
- Log the incident in this file (template below).
- Add to next Friday's Compound Review. **One incident = one prompt update.**

## Incident log template

Copy this block. Fill in. Append to bottom of this file.

```
### Incident YYYY-MM-DD-NN
- **GPT:** Founder / Adult / Junior / Front Desk
- **Severity:** Low / Medium / High / Critical
- **What was said:** "..."
- **What was true:** "..."
- **Who saw it:** [internal / one member / one prospect / public]
- **Source of error:** outdated KB / missing KB / GPT ignored KB / scope leak
- **Fix applied:** [updated 02-programs-and-pricing.md / tightened grounding rule / etc]
- **Files re-uploaded:** [list of GPTs and files]
- **Recovery action:** [correction sent / post deleted / etc]
- **Compound learning:** [what we'll do differently]
```

## After 3 of the same kind

If the same KB file causes 3 incidents in 90 days, that file gets a special review at the next monthly knowledge refresh: **what's structurally wrong with how this file is organized?** A fact that keeps slipping through is usually a file that's hard for the GPT to navigate, not a fact that's hard to remember.

## After 3 critical incidents on Front Desk

Pull Front Desk public access. Re-run the Day 28 red team audit before re-launching. If the same root cause appears again, the GPT may need to be rebuilt from scratch with a tighter prompt.

---

## Incident log

(append below)
