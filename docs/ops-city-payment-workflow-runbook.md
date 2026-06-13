# LBTA Ops Runbook — City Payment Workflow

## Purpose

Close the enrollment leak between lead capture and City payment confirmation.

This runbook uses the workflow states now saved in `leads.payload.workflow`:

- `pending_city_payment`
- `city_paid`
- `not_required`

## Daily Workflow (10-15 min)

1. **Check stale pending leads**
   - Local: `npm run leads:stale-city-payment`
   - API: `GET /api/cron/stale-city-payment-leads?hours=24`
2. **Run CRM follow-up task tagging (2h / 24h / 72h)**
   - Local dry run (default): `npm run leads:city-payment-followups`
   - Local apply tags: `DRY_RUN=0 npm run leads:city-payment-followups`
   - API dry run (default): `GET /api/cron/city-payment-followups?dryRun=1`
   - API apply tags: `POST /api/cron/city-payment-followups?dryRun=0`
3. **Contact unresolved families**
   - Priority order: oldest `pending_city_payment` first.
4. **Reconcile City-paid list**
   - Gather confirmed payment emails from City export.
   - Dry run:
     - `POST /api/cron/city-payment-sync` with:
       - `{ "emails": ["family@example.com"], "dryRun": true }`
   - Apply:
     - `{ "emails": ["family@example.com"], "dryRun": false }`
5. **Review funnel summary**
   - `GET /api/cron/lead-funnel-summary?hours=24`
   - Track:
     - `newLeads`
     - `trialsRequested`
     - `registrationAssistRequested`
     - `pendingCityPaymentOver24h`
     - `pendingCityPaymentOver72h`
     - `cityPaidInWindow`
6. **Spot-check Notion sync**
   - Confirm records in `Notion_LBTA_Lead_Ops_Action_Board_2026-05-09` are updating (latest edited timestamps).
   - Confirm `GHL Current Program Tags` reflect follow-up tags after apply runs.

## API Endpoints

All cron endpoints require:

- Header: `Authorization: Bearer ${CRON_SECRET}`

### Stale report

- `GET|POST /api/cron/stale-city-payment-leads`
- Query params:
  - `hours` (default `24`)
  - `limit` (default `200`)

### City-paid reconciliation

- `POST /api/cron/city-payment-sync`
- Body:
  - `emails: string[]` (required)
  - `dryRun: boolean` (optional)

### Daily KPI summary

- `GET /api/cron/lead-funnel-summary`
- Query params:
  - `hours` (default `24`)

### CRM follow-up tagging automation

- `GET|POST /api/cron/city-payment-followups`
- Query params:
  - `dryRun` (`1` default, set `0` to apply)
  - `tier2h` (default `2`)
  - `tier24h` (default `24`)
  - `tier72h` (default `72`)
  - `limit` (default `500`)
- Optional owner tags from env:
  - `FOLLOWUP_TIER_2H_OWNER_TAG` (default `City Payment Owner - Front Desk`)
  - `FOLLOWUP_TIER_24H_OWNER_TAG` (default `City Payment Owner - Enrollment`)
  - `FOLLOWUP_TIER_72H_OWNER_TAG` (default `City Payment Owner - Director`)

## Escalation owner map + SOP

- **2h tier (fast-touch):**
  - Owner tag: `City Payment Owner - Front Desk`
  - SOP: outbound SMS + email reminder, include direct City registration link.
- **24h tier (active recovery):**
  - Owner tag: `City Payment Owner - Enrollment`
  - SOP: phone call + SMS recap, confirm blocker (timing, placement, payment confusion).
- **72h tier (save attempt):**
  - Owner tag: `City Payment Owner - Director`
  - SOP: personalized founder/director touch + escalation decision (hold spot vs close loop).

## Local Operator Commands

- Stale report:
  - `npm run leads:stale-city-payment`
- CRM follow-up tagging:
  - `npm run leads:city-payment-followups`
  - `DRY_RUN=0 npm run leads:city-payment-followups`
- City-paid sync (direct):
  - `npm run leads:city-payment-sync -- family1@example.com,family2@example.com`
- City-paid sync dry run:
  - `DRY_RUN=1 npm run leads:city-payment-sync -- family1@example.com`
- City-paid sync from export file (CSV/JSON):
  - `npm run leads:city-payment-sync-from-export -- --file ./city-paid-export.csv --dry-run`
  - `npm run leads:city-payment-sync-from-export -- --file ./city-paid-export.csv --apply`

## Messaging Guardrail (non-negotiable)

Use this exact meaning in comms:

- Lead/trial submitted: request received
- Enrollment confirmed: **only after City payment is complete**

## Operational Notes

- Rec1 lag can happen. If website schedule is ahead of City listing, notify family and hold manually.
- Private lessons and Racquet Rescue are not City-paid flows (`not_required`).
- Keep app links and Rec1 links consistent in all parent-facing templates.

