# Transaction Email Brand Audit — Plan Stub

**Status:** Queued from /compound:full brand-system run (2026-05-06)
**Predecessor:** `plans/2026-05-05-brand-system-lockdown-audit.md` (brand v1.1 locked)
**Type:** Plan stub — run `/compound:plan` to expand before executing

## Why now

Web brand is locked. Email is the second-most-visible LBTA surface (registration confirmations, season kickoffs, weekly UTR updates). Email rendering rules differ sharply from web (inline styles, table layouts, font fallbacks, no CSS vars), so it needs its own audit.

## Scope (start here when expanding)

### Inventory

- `lib/email.ts` — transactional email send paths (registration, scholarship, JTT, etc.)
- `assets/emails/*.html` — campaign and weekly templates (12+ files including `lbta-spring2026-week2.html`, `lbta-utr-season1-week1-kickoff.html`)
- ActiveCampaign templates (if managed in-app rather than in-repo)

### Audit dimensions

- **Color compliance** — every email template uses brand colors. Inline hex literals are OK in emails (CSS vars don't render in most clients) but the values must come from `BRAND` (or a generated email-tokens.json that mirrors `tokens/lbta-web-tokens.json`).
- **Typography** — Cormorant + DM Sans where possible (Google Fonts via @import); fallback stacks to web-safe (Georgia / Helvetica / Arial). Document the exact fallback per template.
- **Logo usage** — only `/logos/LBTA*` (no external URLs). Check absolute URLs render in Outlook + dark mode.
- **Layout** — table-based (Outlook compatibility), max-width 600px, hero ratio matches brand standards
- **Dark mode** — Apple Mail / iOS dark-mode styles tested
- **Footer** — required unsubscribe + physical address (CAN-SPAM); brand-consistent typography

### Generate `tokens/lbta-email-tokens.json`?

**Decision needed:** Should email get its own generated token file (subset of brand colors mapped to inline-safe values), or should `lib/brand-tokens.ts` be the single source for both?

## Acceptance (draft)

- Every `.html` template in `assets/emails/` audited against the brand checklist (table-based, colors from brand, fonts with documented fallback, dark-mode tested)
- `lib/email.ts` documented: which templates exist, what triggers them, where colors live
- Litmus or Email-on-Acid test for top 3 templates (Apple Mail, Gmail web, Outlook 365, iOS Mail dark mode)
- Brand checker extended to scan email templates (or explicitly document why they're excluded)

## Out of scope

- New email templates / new send flows
- ActiveCampaign automation rebuild
- Web brand (already done in `ddd76e6`)

## Estimate

~1 day (inventory + audit + small fixes). Run `/compound:plan plans/2026-05-06-transaction-email-brand-audit-plan.md` to expand.
