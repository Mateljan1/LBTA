# Email Brand Audit — Round 2 Plan

**Date queued:** 2026-05-09
**Source:** Email brand subagent audit (transcript 1b4fed0f), `assets/emails/` review
**Status:** Queued. Not started. Estimated 2–3 hours focused work.

---

## Why this is its own workstream

Audit Round 1 (commit `b00a57e`) closed the highest-impact app-side bugs (iOS form zoom, blog OG, JSON-LD, contrast, title length) but **deferred the email cleanup deliberately** — emails touch sends and need per-template judgment, not regex sweeps. Doing it carelessly risks breaking real customer comms (registration confirmations, trial follow-ups, weekly updates).

## Findings (from email audit)

### F-1 (cross-cutting): `#d5d1ca` outer wrapper
- **Where:** 17+ template files use `bgcolor="#d5d1ca"` as the outer table wrapper, **plus** `lib/email.ts` (the shared template generator)
- **Issue:** Off-brand neutral, doesn't match `lbta-stone` (`#E8E4DF`) or `brand-sandstone` (`#F5F0E5`)
- **Decision needed:** Migrate to which token — `lbta-stone` (closer hex) or `brand-sandstone` (canonical wrapper)? My recommendation is `lbta-stone` (`#E8E4DF`) because it's visually closest to `#d5d1ca` so existing renders won't shift dramatically.

### F-2 (`lib/email.ts`): Off-brand grays
- `#1B2A4A` — looks like an attempt at Pacific Dusk but the actual token is `#1B3A5C` (drift)
- `#333`, `#666`, `#999` — generic grays, no brand mapping
- **Decision needed:** Replace with closest brand token, or document as legitimate email-specific exceptions (some email clients render brand colors poorly, generic grays are safer for body text)

### F-3 (3 worst templates with heavy drift)
1. `lbta-spring2026-week2.html` — multiple non-brand colors
2. `lbta-utr-season1-week1-kickoff.html` — multiple non-brand colors
3. `LBTA_Spring2026_Schedule_*.html` — heavy drift

### F-4 (CAN-SPAM compliance gap)
- Most templates show "Laguna Beach, CA" + phone in footer
- **Missing:** Full postal address (1098 Balboa Ave, Laguna Beach, CA 92651)
- **Risk:** CAN-SPAM Act §316.5 requires valid physical postal address in commercial email
- **Fix:** Add full address to all transactional + marketing email footers

### F-5 (tooling): Brand checker doesn't scan emails
- `scripts/check-brand-usage.ts` `scanRoots = ['app','components']`
- Should extend to `assets/emails/**/*.html`
- Needs allowlist for legitimate exceptions: webfont @import URLs, `%UNSUBSCRIBELINK%` ActiveCampaign placeholders, table-layout pixel values

## Proposed execution order

1. **F-1**: Migrate `#d5d1ca` → `#E8E4DF` (lbta-stone) in `lib/email.ts` AND all template files in one sweep. Single hex find/replace, low risk.
2. **F-2**: `lib/email.ts` gray cleanup — replace `#1B2A4A` → `#1B3A5C` (Pacific Dusk fix), evaluate if `#333/#666/#999` should map to brand or stay (probably stay for email-client compat).
3. **F-3**: Per-template manual cleanup of the 3 worst offenders (one commit each so we can verify rendering between).
4. **F-4**: Add postal address to email footer template in `lib/email.ts`, mass-apply to standalone templates.
5. **F-5**: Extend `scripts/check-brand-usage.ts` to scan `assets/emails/**/*.html` with allowlist.

Each phase ships its own commit so we can review email renders (Litmus / actual send to test inbox) between steps before continuing.

## Out of scope for Round 2

- Redesigning email templates (that's a full re-brief)
- Testing in 50+ email clients (we ship-and-monitor; no Litmus budget assumed)
- Migrating ActiveCampaign hosted templates (those are platform-managed)

## Decision points blocking start

- **D-1:** `lbta-stone` (#E8E4DF) vs `brand-sandstone` (#F5F0E5) for the outer wrapper? **Default: lbta-stone** (visual proximity).
- **D-2:** `#333/#666/#999` in `lib/email.ts` — keep as documented email-specific exceptions or migrate to brand grays? **Default: keep, document as exception** (Outlook, Apple Mail, and Gmail render brand colors inconsistently for body text).
- **D-3:** Litmus or visual diff for verification, or trust hex math + send-to-self? **Default: send-to-self** (no Litmus budget).

When ready to execute, ping me with the decisions and I'll run the workstream.
