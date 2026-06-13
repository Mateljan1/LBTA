# Full Website & Operational System Consistency Audit — Implementation Plan

## Overview

Run a structured, repeatable review that compares **LBTA_Operations 2.docx** (operations guide), the **website repo** (`/data/*.json` + App Router pages + components), and **downstream operational surfaces** (email HTML, CRM, booking flows) to surface every discrepancy in **dates**, **pricing**, **schedules**, **program names**, and **long-form descriptions**—then reconcile to a single source of truth so enrollment, comms, and web stay aligned.

## Problem Statement

Operational truth currently lives in multiple places: a polished Word guide, JSON data files, occasional hardcoded UI strings, legacy camp entries, and outbound emails. Without a single pass that maps field-by-field across these layers, drift is inevitable (example findings already visible in-repo: summer season end **August 28 vs 29**, camp block dates **June 15–28 vs 29**, and an email line showing **June 16** vs **June 15** start). The goal is a **complete discrepancy inventory** and a **remediation order** (what to change where), not ad-hoc spot fixes.

## Proposed Solution

### Source-of-truth hierarchy (default for reconciliation)

1. **Primary (website programs/schedules/pricing):** `data/winter2026.json`, `data/spring-summer-2026.json`, `data/fall2026.json`, `data/year2026.json`, `data/private-rates.json`, `data/pricing-supplemental.json`, `data/leagues-2026.json` — consumed by `lib/programs-data.ts`, `lib/season-utils.ts`, and schedule UI. Per project rules: **no hardcoded prices in components**; JSON is canonical for live site.
2. **Operations guide:** `LBTA_Operations 2.docx` — treat as **stakeholder-approved narrative + printed/PDF reference**. Where it conflicts with JSON, either **update JSON** (if the doc is correct) or **update the doc export** (if the site/data was intentionally shipped).
3. **Secondary / derivative:** `assets/emails/**/*.html`, `homepage-copy.json`, `faq.json`, `flyer-coach-bios.json`, coach hub JSON, marketing one-pagers — must **match** primary after decisions.
4. **External systems** (ActiveCampaign, Go High Level, Airtable, Playbypoint, city registration): **out of scope for automated diff** in this plan; include **manual verification checklist** and field list to sync after web/doc alignment.

### Audit dimensions (everything we can)

| Dimension | What to compare | Primary repo locations |
|-----------|-----------------|-------------------------|
| **Season dates & week counts** | Winter/Spring/Summer/Fall ranges, skip days, week multipliers | `data/year2026.json` → `seasons.*`, `lib/season-utils.ts`; `spring-summer-2026.json` spring/summer blocks |
| **Per-program schedules** | Day, time, location, coach, max group | Program arrays in season JSON; `components/schedules/*`; any `ProgramsTabView` or similar hardcoded season cards |
| **Pricing** | Monthly, per-week, drop-in, packs, camp weekly/daily, seasonal totals | `pricing` objects in program JSON; `private-rates.json`; `pricing-supplemental.json`; `year2026.json` camp entries |
| **Program naming & IDs** | Titles, tiers (e.g. JD Tier 1/2), age strings | JSON `program`/`id` fields vs doc section headers vs page routes under `app/programs/` |
| **Coach names & titles** | Spelling, role lines | `data/coaches.json`, `flyer-coach-bios.json`, doc §4 |
| **Long descriptions** | First paragraph + methodology blurbs | JSON `description` vs doc prose vs program landing pages that duplicate copy |
| **Leagues & match play** | USTA/UTR dates, fees, links | `data/leagues-2026.json`, dedicated program pages |
| **Camps** | Summer weeks calendar, prices, suspended programs | `spring-summer-2026.json` `camps`, `year2026.json` `camps[]`, `app/camps/page.tsx` |
| **Legal/meta** | Phone, address, “book at” URL | Footer, contact, JSON notes vs doc |

### Methodology

**Phase A — Inventory (read-only)**  
- Export doc to text (e.g. `textutil -convert txt` on macOS) or maintain a pinned **PDF/export hash** so future audits diff against the same baseline.  
- Generate a **machine-readable extract** from JSON: script or spreadsheet that lists each program’s `id`, season, dates, schedule rows, and all numeric price fields (one row per program × season slice).

**Phase B — Crosswalk matrix**  
- Build a **Discrepancy Log** (table): `Field | Doc value | JSON value | File:line | Page/component | Severity | Resolution owner`.  
- Prioritize: **dates affecting billing weeks** → **price** → **schedule** → **cosmetic copy**.

**Phase C — Codepath sweep for drift**  
- Grep for season strings and currency amounts outside `/data` (e.g. `August 28`, `$495`, `June 16`).  
- Pay attention to: `components/programs/ProgramsTabView.tsx` (known hardcoded dates), `assets/emails/`, and any `year2026.json` camp entries marked `suspended` that might still surface in UI.

**Phase D — Human verification**  
- Spot-check **schedules page** and **2–3 program landings** at breakpoints (per `.cursorrules`).  
- Confirm **investment math** in doc (per-week × weeks) equals JSON-derived totals for a sample of programs.

**Phase E — Remediation (separate work ticket)**  
- Apply changes **only** in approved files: prefer **single JSON edit** + regenerate any derived copy; avoid duplicating numbers in TSX.  
- Re-run `npm run ship:gate` before merge.

## Implementation Steps

### Phase 1: Baseline & extraction
- [ ] Freeze **doc version** (filename + last-edited date) and store export path or checksum in the discrepancy log header.
- [ ] Export all program/pricing fields from `data/*.json` into one review sheet (CSV or Google Sheet).
- [ ] List every **route** that shows program or pricing: `app/schedules`, `app/programs/**`, `app/camps`, `app/book`, leagues pages.

### Phase 2: Doc ↔ JSON reconciliation
- [ ] Season calendar: compare §2 vs `year2026.json` / `spring-summer-2026.json` (dates, weeks, skip lists).
- [ ] Private coaching table: compare §5 vs `private-rates.json`.
- [ ] Youth/Adult/Monthly sections: compare §6–10 vs merged program entries across winter/spring-summer/fall JSON as applicable.
- [ ] Seasonal investment tables: compare §11 vs computed totals from JSON per-week rates × weeks (spot-check each band).
- [ ] Weekly schedule spring: compare §12 vs `spring-summer-2026.json` schedules.
- [ ] Camps: compare §13–14 vs `camps` in JSON + `year2026.json` camp array (note **Swim & Tennis** suspended story vs replacement copy).

### Phase 3: Repo internals & derivatives
- [ ] Search codebase for **hardcoded dates/prices** outside data files; log each hit.
- [ ] Diff **email templates** under `assets/emails/` against JSON for the same campaign (season dates, prices, CTA URLs).
- [ ] Compare `homepage-copy.json` and `faq.json` to doc/JSON for stats and claims (coach credentials, phone).

### Phase 4: External operational system (checklist only)
- [ ] ActiveCampaign: list tags, automation emails, and custom fields that mirror program names or prices.
- [ ] CRM/booking (GHL / other): confirm pipelines use same season labels as web.
- [ ] Airtable or registers: if used for roster/pricing, verify columns match JSON field names where applicable.

### Phase 5: Deliverables
- [ ] **Discrepancy Log** (sortable table) with severity and recommended canonical value.
- [ ] **One-page executive summary**: count of issues by category; blockers vs nice-to-fix.
- [ ] **Remediation backlog**: GitHub issues or Linear tickets grouped by file/system.

## Files to Create/Modify

| File | Action | Purpose |
|------|--------|---------|
| `plans/discrepancy-log-2026-04-15.csv` (or `.md` table) | **Create during audit** | Working discrepancy inventory |
| `LBTA_Operations 2.docx` (Desktop) | **Modify only after sign-off** | Align narrative PDF with canonical data |
| `data/*.json` | **Modify in remediation phase** | Canonical updates |
| `components/**`, `assets/emails/**` | **Modify in remediation phase** | Remove hardcoded drift |

```yaml
# files (for tooling; discrepancy log path TBD)
create:
  - plans/discrepancy-log-2026-04-15.csv
modify: []
```

## Out of scope (this plan)

- Changing production CRM/automation content without explicit credentials and approval.
- Redesigning pages or brand copy beyond factual alignment.
- Automated scraping of third-party sites (USTA) beyond **manual spot-check** against `leagues-2026.json` and cited verification date in the doc.
- Resolving **which** source is “right” without stakeholder decision—this plan **surfaces** conflicts; product owner resolves.

## Success Criteria

- [ ] Every program in JSON has been compared to the doc section(s) that describe it, or marked N/A.
- [ ] All season-level dates/weeks/skip days are cross-checked once.
- [ ] Pricing dimensions used on `/schedules` are traced to JSON with no unexplained hardcoded duplicates (or each exception is logged).
- [ ] Discrepancy log is complete enough to drive a **remediation sprint** without re-auditing from scratch.

## Acceptance checklist

- [ ] **Season dates** → Check: `year2026.json` and `spring-summer-2026.json` match doc §2 and §12 headers; note any Aug 28/29 or June 15/16 conflicts resolved in log.
- [ ] **Pricing** → Check: sample of 5 junior + 5 adult + 2 camp SKUs match doc §10–11; private rates match §5.
- [ ] **Schedules** → Check: one weekday column (e.g. Monday) matches doc §12 for spring.
- [ ] **Descriptions** → Check: no contradictory claims (locations, coach roles) between doc §4, `coaches.json`, and site.
- [ ] **Derivatives** → Check: at least 2 email templates and `ProgramsTabView` (if still used) scanned for stale dates/prices.

## Research Sources

- Project rules: `.cursorrules` (single source of truth, `/data`, no hardcoded prices).
- Loader: `lib/programs-data.ts`, `lib/season-utils.ts`.
- Operations baseline: `LBTA_Operations 2.docx` (user Desktop), extracted April 15, 2026.

## Relevant Learnings

- Prefer **one JSON edit** over scattering updates across components; grep for literals after changes.
- Season multipliers and skip weeks affect **totals**—doc tables must use the same week counts as `year2026.json`.

## Research conflicts & resolution

- **Doc vs JSON when both are “official”:** Default to **website JSON for live enrollment** unless leadership decides the doc is the legal tariff; then update JSON and redeploy.

## Confidence & uncertainty

- **Plan confidence:** High for **repo + doc** matrix; **medium** for external CRM without API read access.
- **Uncertainty:** Whether **Playbypoint** or city portals duplicate pricing—confirm with ops which systems are authoritative for **collected revenue** vs **marketing**.

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Doc edited on Desktop without version control | Date-stamp exports; add “verified as of” footer in discrepancy log |
| Fixing one layer and missing emails | Remediation checklist must include `assets/emails/` |
| Math errors in seasonal totals | Script: `per_week * weeks` from JSON for each tier |
| Scope creep into copy rewrite | Log “wording preference” separately from “factual discrepancy” |

---

## Appendix A — Example discrepancies already flagged (non-exhaustive)

Use these as **proof the audit is necessary**; full pass required.

| Item | Location A | Location B | Notes |
|------|------------|------------|-------|
| Summer camp date range | `spring-summer-2026.json` → `camps.summer.dates` uses **Aug 28** | `summer.dates` / `year2026.json` use **Aug 29** | Align end date and week count narrative |
| Summer displayed in UI | `ProgramsTabView.tsx` **June 15 – August 28** | JSON summer **Aug 29** | Hardcoded drift |
| Email narrative | `LBTA_R7_SummerPlan_SEND_READY.html` **June 16** start | JSON/doc **June 15** | Fix before resend |

---

## Appendix B — Suggested grep starters (remediation phase)

Run from repo root after baseline:

```bash
rg -n "August 2[0-9]|June 1[0-9]|\\\$[0-9]+" --glob '!node_modules' app components data assets
```

Refine to catch **hardcoded** season strings in TSX/HTML while excluding JSON if desired.
