# LBTA Upgrade and Polish Master Manifest (2026-05-22)

## Purpose

Single handoff package for operators and agents so execution stays cohesive across:

- website and funnel behavior
- city-payment workflow
- risk management
- docs, scripts, and cron automation

## Canonical Handoff Set

- `docs/README-thread-upgrade-and-polish-2026-05-21.md`
- `docs/README-thread-upgrade-and-polish-2026-05-21-exec.md`
- `docs/lbta-system-map-2026.md`
- `docs/lbta-system-map-2026.json`
- `docs/lbta-registration-marketing-racquet-rescue-2026.md`
- `docs/lbta-risk-register-2026.md`
- `docs/lbta-risk-register-2026.json`
- `docs/ops-city-payment-workflow-runbook.md`
- `docs/lbta-listing-and-app-governance.md`
- `docs/lbta-upgrade-polish-master-manifest-2026-05-22.json`

## Live Workflow Endpoints (Auth: `Bearer CRON_SECRET`)

- Stale pending city payment report:
  - `GET|POST /api/cron/stale-city-payment-leads?hours=24&limit=200`
- City-paid reconciliation:
  - `POST /api/cron/city-payment-sync`
  - body: `{ "emails": ["family@example.com"], "dryRun": true|false }`
- CRM follow-up tagging automation (2h / 24h / 72h):
  - `GET|POST /api/cron/city-payment-followups?dryRun=1`
  - set `dryRun=0` to apply tags in GHL
- Daily KPI snapshot:
  - `GET /api/cron/lead-funnel-summary?hours=24`

## Operator Commands

- `npm run leads:stale-city-payment`
- `npm run leads:city-payment-sync -- email1@example.com,email2@example.com`
- `DRY_RUN=1 npm run leads:city-payment-sync -- email1@example.com`
- `npm run leads:city-payment-followups`
- `DRY_RUN=0 npm run leads:city-payment-followups`
- `npm run leads:city-payment-sync-from-export -- --file ./city-paid-export.csv --dry-run`

## Code Map (Where Workflow Logic Lives)

- State model: `lib/lead-workflow.ts`
- Registration/trial wiring:
  - `app/api/book/route.ts`
  - `app/api/register/route.ts`
  - `app/api/register-program/route.ts`
  - `app/api/register-year/route.ts`
- Stale detection:
  - `lib/stale-city-payment-leads.ts`
  - `app/api/cron/stale-city-payment-leads/route.ts`
- City-paid sync:
  - `lib/city-payment-workflow.ts`
  - `app/api/cron/city-payment-sync/route.ts`
- CRM follow-up automation:
  - `lib/city-payment-followups.ts`
  - `app/api/cron/city-payment-followups/route.ts`
  - `scripts/city-payment-followups.ts`
- KPI summary:
  - `lib/lead-funnel-summary.ts`
  - `app/api/cron/lead-funnel-summary/route.ts`

## What Is Now True

- Registration-related leads are tagged with workflow state.
- Stale pending-payment leads can be detected automatically.
- City-paid status can be reconciled back into lead records.
- Daily KPI summary is available from one endpoint.
- Ops has a runbook and commands to execute the loop consistently.

## Remaining Priority Items

1. Conversion-page contrast and speed polish completion.
2. Run live GBP/Yelp/Apple/Bing listing verification against canonical governance doc.

