# LBTA Operations Guide vs Website — Consistency Audit

**Date:** April 15, 2026  
**Operations baseline:** `LBTA_Operations 2.docx` (Desktop) — *Programs, Schedule & Guide — 2026*  
**Website baseline:** This repo — primarily `data/year2026.json`, `data/spring-summer-2026.json`, `data/winter2026.json`, `data/fall2026.json`, `data/private-rates.json`, `data/leagues-2026.json`, plus selected UI and email files.

## Deliverable

| File | Purpose |
|------|---------|
| **[lbta-operations-vs-website-audit-2026-04-15.csv](./lbta-operations-vs-website-audit-2026-04-15.csv)** | Sortable spreadsheet (open in Excel, Numbers, or Google Sheets). Each row is one check. |
| **This markdown** | How to read results, counts, and recommended fix order. |

## Summary counts (from the CSV)

| Status | Approx. rows | Meaning |
|--------|----------------|--------|
| **Match** | 22+ | Guide and website data agree (or guide has no conflicting detail). |
| **Mismatch** | 12 | Change needed somewhere (data, UI, or email). |
| **Partial / Doc internal conflict** | 5 | Clarify intent or fix guide inconsistency. |
| **Not in JSON / Low** | 1 | Informational (e.g. USTA practice block only on printed guide). |

## High-priority fixes (website + email)

1. **`assets/emails/lbta-spring2026-week2.html` — wrong season for adult pricing** — For **Adult Intermediate** and **Adult Advanced**, the email shows **winter** full-season totals ($756 / $1,437 / $2,042 and $810 / $1,620) from the guide’s winter column. For **Spring 2026** the guide §11 (and `spring-summer-2026.json`) uses **Intermediate:** 1× $580, 2× $1,105, 3× $1,570 · **Advanced:** 1× $625, 2× $1,250. Update the email before sending. Optional: fix Intermediate meta line **NTRP 3.0–3.5** → **3.0–4.0** to match the site.
2. **Align summer end date everywhere** — Operations guide §2 says **August 29** (11 weeks). The repo currently disagrees with itself: `spring-summer-2026.json` uses **August 28** in `camps.summer.dates`; `year2026.json` `camps` id `summer` uses **August 20**; `ProgramsTabView.tsx` shows **August 28**. Pick one end date and update all JSON + UI.
3. **Email `LBTA_R7_SummerPlan_SEND_READY.html`** — Says **June 16** start (should be **June 15**) and **Back-to-School Sep 1–5** (guide and `year2026.json` say **August 17–20**). Update before any resend.
4. **Little Tennis Stars — Saturday location** — Guide §6 and spring JSON: **Alta Laguna**. **Winter** and **fall** JSON list **Saturday at LBHS**. If winter/fall intentionally moved, add a footnote in the guide; if not, fix `winter2026.json` / `fall2026.json` locations to match Alta Laguna for Saturday.
5. **Cardio Tennis Friday** — Guide §12: **Peter DeFrantz** only. Spring JSON lists **Andrew Mateljan & Peter DeFrantz**. Confirm roster and align JSON or guide.

## Medium / low priority

- **LiveBall Sunday** — Guide lists **Peter DeFrantz** alone; JSON includes **Andrew Mateljan**. Often co-coach listing; confirm and align wording.
- **High Performance Friday** — Guide shows combined competition with three coaches; JSON Friday HP coaches differ. May be correct split; verify.
- **Competitive Green Dot** — JSON uses `"Staff"` vs guide **Peter DeFrantz** — optional polish.
- **Operations guide internal** — §14 references **June 15 – August 20 (10 weeks)** for summer camps while §2 gives **11 weeks to August 29**. Reconcile the guide so print/PDF does not contradict itself.

## What was verified as consistent

- **Season calendar** (winter / spring / fall) — matches `year2026.json` and season JSON files.  
- **Private lesson rates** (all four coaches, 60/90, packs) — matches `private-rates.json` / `year2026.json`.  
- **Seasonal investment tables (winter totals)** — `year2026.json` `basePricing` matches guide §11 for sampled rows.  
- **Spring/summer program pricing** (e.g. Red Ball spring/summer tiers, adult tiers, monthly LiveBall/Cardio) — matches guide tables when cross-checked to `spring-summer-2026.json`.  
- **Summer camp pricing** (adventure, training, drop-ins) — matches data files.  
- **UTR Match Play** (season window, divisions, prices, venues) — matches `data/leagues-2026.json` and guide §15.  
- **USTA league listing and team economics** — matches `leagues-2026.json` and guide §16 at headline level.  
- **Phone (949) 534-0457** — consistent across sampled site and email footers.

## Scope limits

- **CRM, ActiveCampaign, Airtable, and city registration** were not audited (no automated access). After web/doc alignment, sync those systems using the same fields.  
- **Every landing page paragraph** was not line-by-line compared; focus was **dates, pricing, schedules, and operational facts**.  
- **`coach-hub` JSON** contains operational fields (e.g. school dates); only spot-checked. Large files are excluded from this pass.

## How to use the CSV

- Sort by **Severity** (High → Low) or **Status** (Mismatch first).  
- **Operations_Guide** = what the Word guide says. **Website_A** / **Website_B_or_notes** = file(s) or remark.  
- Re-run this audit after bulk edits: replace the CSV, bump the date in the filename, and keep the Word export version-stamped.

---

*Generated as part of aligning LBTA web data with the Operations guide. For the original audit methodology, see [2026-04-15-full-site-operational-consistency-audit.md](./2026-04-15-full-site-operational-consistency-audit.md).*
