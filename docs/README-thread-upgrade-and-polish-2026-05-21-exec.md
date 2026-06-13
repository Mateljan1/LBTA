# LBTA Executive Brief — Upgrade and Polish (May 2026)

## What This Thread Delivered

- Built a full cross-system map of LBTA website, apps, programs, calendar, coaches, APIs, and dependencies.
- Documented City Rec1 enrollment reality, operational friction points, and parent handoff risks.
- Created a full premortem risk register with top failure modes, owners, signals, and mitigation playbooks.
- Shipped Phase 1 Racquet Rescue funnel improvements in code (form intake, tagging, redirects, thank-you flow).
- Organized a practical yearly marketing and automation framework tied to the 2026 program calendar.

## Core Business Truth

The biggest revenue leak is not traffic. It is the handoff between LBTA lead/trial intent and City payment completion.

Lead captured does not equal enrollment.  
Enrollment is confirmed only after City payment.

## Artifacts You Can Hand to Any Agent

- `docs/README-thread-upgrade-and-polish-2026-05-21.md` (full handoff)
- `docs/lbta-system-map-2026.md`
- `docs/lbta-system-map-2026.json`
- `docs/lbta-registration-marketing-racquet-rescue-2026.md`
- `docs/lbta-risk-register-2026.md`
- `docs/lbta-risk-register-2026.json`
- `docs/ops-city-payment-workflow-runbook.md`
- `docs/lbta-upgrade-polish-master-manifest-2026-05-22.md`
- `docs/lbta-upgrade-polish-master-manifest-2026-05-22.json`

## Code Changes Completed

- Added `components/racquet-rescue/RacquetRescueRequestForm.tsx`.
- Integrated form into `app/racquet-rescue/page.tsx`.
- Routed Racquet Rescue submissions through `/api/book` with source tagging.
- Added `/thank-you?type=racquet-rescue` flow support.
- Fixed redirects: `/racket-stringing` and `/racket-rescue` now point to `/racquet-rescue`.

## Top Frictions (Now Explicitly Tracked)

- Lead/trial captured but City payment not completed.
- Parent confusion about what actually confirms a spot.
- Schedule and City catalog can drift out of sync.
- Weak closed-loop attribution from source to paid enrollment.
- Android app link inconsistency across assets.
- Citation/listing consistency risk (NAP, Yelp/GBP/map surfaces).

## Priority Actions (Upgrade Sequence)

1. Lock pipeline statuses: `trial_requested -> trial_completed -> pending_city_payment -> city_paid`.
2. Add 2h/24h/72h stale-lead automations with owner tasks.
3. Run daily City reconciliation until direct payment integration exists.
4. Standardize one Android app URL across site, emails, bot, and confirmations.
5. Finalize listing governance (canonical NAP, monthly audit cadence).
6. Continue conversion-page speed and a11y polish from audit backlog.

## Compound Build Progress (Implemented)

- `pending_city_payment` workflow state now persists on registration-related leads.
- Stale-lead report endpoint and schedule scaffold:
  - `/api/cron/stale-city-payment-leads`
- City payment reconciliation endpoint:
  - `/api/cron/city-payment-sync` (`dryRun` supported)
- KPI summary endpoint:
  - `/api/cron/lead-funnel-summary`
- Operator scripts:
  - `npm run leads:stale-city-payment`
  - `npm run leads:city-payment-sync -- email1,email2`

## Racquet Rescue Decision (Current Best Interim)

- Keep current low-risk model active: on-site request form + ops follow-up + payment at pickup.
- Defer irreversible stack decisions (GHL vs Airtable ticketing, Stripe packaging) until owner decision.
- Treat Racquet Rescue as LBTA-direct revenue, not City catalog by default.

## KPI Board to Run Daily

- New leads
- Trials requested
- Trials completed
- Pending City payment >24h
- Pending City payment >72h
- City paid count
- Lead-to-paid conversion rate
- Median first response time
- No-show recovery rate
- Top leak reason

## What “Good” Looks Like in 30 Days

- No stale high-intent leads without owner.
- Every trial has same-day next-step outreach.
- Source-to-paid is visible by channel.
- Parent messaging is consistent across site, bot, and staff.
- Racquet Rescue requests are tracked with SLA and no dropped tickets.

