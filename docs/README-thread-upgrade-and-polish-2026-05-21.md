# LBTA Thread README — Upgrade & Polish Handoff

**Created:** 2026-05-21  
**Purpose:** One place to review what was researched, what was implemented, what docs were produced, and what to do next.

---

## What This Thread Covered

This thread focused on:

1. Full LBTA website/system mapping and operational context.
2. City Rec1 registration reality and handoff risks.
3. Workflow and automation recommendations (lead -> trial -> paid).
4. Year-round marketing calendar framework.
5. Racquet Rescue integration status, implementation, and revenue path.
6. Business premortem: what can go wrong and how to prevent it.

---

## Deliverables Created

### 1) System map (human + machine)
- `docs/lbta-system-map-2026.md`
- `docs/lbta-system-map-2026.json`

Contains:
- Website route inventory and purpose map
- Facilities and canonical contact details
- App links, Rec1 links, API surfaces
- Program catalog and season references
- Coach Hub visibility status
- External system cross-reference

---

### 2) Registration + marketing + Racquet Rescue strategy doc
- `docs/lbta-registration-marketing-racquet-rescue-2026.md`

Contains:
- City Rec1 operating rules and expected program inventory
- User workflow diagrams (new family, returning, camps, UTR, private)
- Known friction points and proposed fixes
- 2026 marketing calendar and automation candidates
- Racquet Rescue roadmap and revenue model options

---

### 3) Full risk register (human + machine)
- `docs/lbta-risk-register-2026.md`
- `docs/lbta-risk-register-2026.json`

### 4) Ops runbook (city payment loop)
- `docs/ops-city-payment-workflow-runbook.md`

### 5) Master manifest bundle
- `docs/lbta-upgrade-polish-master-manifest-2026-05-22.md`
- `docs/lbta-upgrade-polish-master-manifest-2026-05-22.json`

Contains:
- 20 concrete failure modes
- Impact/likelihood scoring
- Owners per risk
- Leading indicators
- Preventive controls
- Recovery playbooks
- 30-day execution plan

---

## Key Code Changes Completed In This Thread

### Racquet Rescue funnel (now functional, not contact-only)
- Added `components/racquet-rescue/RacquetRescueRequestForm.tsx`
- Integrated it into `app/racquet-rescue/page.tsx`
- Form sends structured request via `/api/book` with `source: 'racquet-rescue'`

### API routing + tagging for Racquet Rescue
- Updated `app/api/book/route.ts` to treat `source === 'racquet-rescue'` as a distinct intake path:
  - Distinct source value (`website-racquet-rescue`)
  - Distinct intent classification (`racquet-rescue`)
  - Distinct notification subject/tag behavior
  - Stored payload includes source metadata

### City payment workflow scaffolding (new)
- Added `lib/lead-workflow.ts` for standardized lead lifecycle states
- Added `workflow.cityPaymentStatus` payload tracking on:
  - `/api/register`
  - `/api/register-program`
  - `/api/register-year`
  - registration-assist branch in `/api/book`
- Added stale-lead detection:
  - `lib/stale-city-payment-leads.ts`
  - `GET/POST /api/cron/stale-city-payment-leads`
  - `npm run leads:stale-city-payment`
- Added city-paid reconciliation tooling:
  - `lib/city-payment-workflow.ts`
  - `POST /api/cron/city-payment-sync` (supports `dryRun`)
  - `npm run leads:city-payment-sync -- email1,email2`

### Thank-you path support
- Updated `app/thank-you/page.tsx` with `type='racquet-rescue'` variant copy.

### Redirect fixes
- Updated `next.config.js`:
  - `/racket-stringing` -> `/racquet-rescue`
  - `/racket-rescue` -> `/racquet-rescue`

---

## Business/Operations Conclusions Reached

### Biggest revenue leak
The primary leak is **handoff drop-off** between LBTA lead/trial intent and external City Rec1 payment completion.

### Most important operational truth
**Lead captured is not enrollment.**  
Enrollment is only confirmed after City payment is completed.

### Highest-priority upgrade themes
1. Closed-loop payment confirmation state (`pending_city_payment` -> `city_paid`).
2. Aggressive SLA follow-up automation (2h / 24h / 72h).
3. Unified scripts across website/bot/front desk.
4. Source-to-paid reporting, not just source-to-lead.
5. Link consistency and listing consistency (NAP + app links).

---

## Performance and Quality Context Referenced

The thread used the May audit artifacts:
- `docs/audits/2026-05/scorecard.md`
- `docs/audits/2026-05/post-remediation/review-summary.md`
- `docs/audits/2026-05/post-remediation/validate-summary.md`

Notable findings cited:
- Contact CLS issue had been remediated in validation docs.
- A11y improvements are real, but contrast backlog still exists in targeted areas.
- Production quality posture improved; conversion instrumentation exists but paid-enrollment closure is still the gap.

---

## Frictions Tracked (Condensed)

- Parent confusion about what confirms spot
- Rec1 listing lag versus website schedule updates
- Missing closed-loop payment event to CRM
- Follow-up gaps after trial submission or attendance
- Inconsistent app links in some assets
- Local listing/ranking confidence without full GSC/GBP evidence

---

## Upgrade & Polish Checklist (Recommended Execution Order)

### Phase A — Revenue leakage control (first)
1. Enforce pipeline stages: `new_lead -> trial_requested -> trial_completed -> pending_city_payment -> city_paid -> app_activated`
2. Add SLA task automation for unresolved pending-payment leads.
3. Add daily reconciliation routine from City exports to CRM status.
4. Add dashboard metrics from risk register (`docs/lbta-risk-register-2026.md`).

### Phase B — Messaging and consistency
1. Standardize payment-confirmation language across:
   - website confirmations
   - bot knowledge prompts
   - staff scripts
2. Standardize app links (single Android package decision + replacement pass).
3. Standardize Rec1 linking policy (base catalog + exact listing name fallback).

### Phase C — Website polish
1. Complete outstanding contrast/accessibility backlog from audit docs.
2. Improve high-intent page speed on `/book`, `/schedules`, `/contact`.
3. Tighten CTA hierarchy so next action is always unambiguous.

### Phase D — Local SEO and listing confidence
1. Canonical NAP audit across GBP/Yelp/Apple Maps/Bing Places.
2. Weekly Search Console + GBP report for rank/CTR/call evidence.
3. Resolve duplicate/incorrect citations.

### Phase E — Racquet Rescue scale-up
1. Choose intake owner system (GHL vs Airtable vs email alias).
2. Add ticketing SLA and capacity guardrails for same-day requests.
3. Launch packaged revenue options (10-pack, event upsells) once ops stable.

---

## Suggested “Start Tomorrow” Workflow

1. Open:
   - `docs/lbta-risk-register-2026.md`
   - `docs/lbta-registration-marketing-racquet-rescue-2026.md`
2. Pick one owner for each P0 risk.
3. Implement daily dashboard + stale lead sweep first.
4. Run app-link consistency pass.
5. Run listings/NAP audit and lock canonical entries.

---

## Notes

- This README is a thread-level handoff summary, not a replacement for the detailed strategy docs above.
- For automation ingestion, use `docs/lbta-risk-register-2026.json` and `docs/lbta-system-map-2026.json`.

