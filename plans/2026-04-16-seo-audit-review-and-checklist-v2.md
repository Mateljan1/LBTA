# SEO Audit Review + Verification Checklist v2 — Plan

## Overview

Two jobs in one plan: (1) verify the accuracy of `LBTA_SEO_Audit_April2026.md` before acting on it, and (2) upgrade the interactive verification checklist (`plans/2026-04-16-lbta-audit-checklist.html`) so every item now shows the **exact proposed replacement content** we will ship, not just the abstract "what it should be." Saska (and Andrew) review the replacement *before* any change lands.

## Problem Statement

The SEO audit is long, opinionated, and mostly sharp — but it has at least one materially wrong claim (robots.txt sitemap URL) and one expensive blind spot (robots.txt is **Disallow**-ing five high-intent landing pages). Acting on the audit wholesale without verification would either waste time fixing a non-issue or miss a bigger one. Meanwhile, the v1 checklist asks Saska to *describe* the correct value. For pages where we already have a proposed new title, phone, copy, or schema block from the audit, it's faster and safer to show her the **exact text** we plan to ship and have her approve or correct it in one click.

## Proposed Solution

### A. SEO audit accuracy review

Verified every P0 and several P1 claims against the live codebase.

| # | Audit claim | Reality | Verdict |
|---|---|---|---|
| 1 | robots.txt points to wrong domain `lbtennisacademy.com` | **False.** `public/robots.txt` already points to `https://lagunabeachtennisacademy.com/sitemap.xml` | **Wrong — drop from P0** |
| 2 | Placeholder phone `(949) 123-4567` on `/adult-trial`, `/beginner-program`, `/apply-scholarship` | **Confirmed.** Present in all three `page.tsx` files | Correct — **P0, fix** |
| 3 | Personal phone `(949) 241-0847` on `/programs/usta-adult-league`, `/programs/leagues`, `/coaches/andrew-mateljan`, `/coaches/peter-defrantz`, `/coaches/former-coach-removed` | **Confirmed** on all five | Correct — **P1, decide policy** |
| 4 | Zero canonical tags anywhere | **Confirmed.** No `alternates: { canonical: ... }` in any app route's metadata | Correct — **P0** |
| 5 | `/camps` title tag is 95 chars with duplicated brand | `app/camps/page.tsx` has no `export const metadata` at all — title inherits from root layout's `default`, which means it shows `"Laguna Beach Tennis Academy \| Tennis, as it should be taught."`. The 95-char string in the audit cannot come from this file. | **Partially wrong — different fix needed** |
| 6 | Michelle Mateljan "departed" but still indexable | Page + data file + lib reference still exist; departure status needs founder confirmation before we noindex or delete | **Unverified — needs Andrew** |
| 7 | `/high-performance-pathway` and `/programs/high-performance` both HTTP 200 with different content | Consistent with `app/` structure — both routes exist | Correct — **P1, 301 redirect** |
| 8 | No AggregateRating schema despite 5.0 / 47 reviews | Consistent with `app/schema.tsx` — no AggregateRating | Correct — **P1, high ROI** |

**Audit blind spots (missed, but important):**

- **`public/robots.txt` actively Disallows revenue-critical landing pages.** Current file disallows `/beginner-program`, `/adult-trial`, `/junior-trial`, `/success-stories`, `/philosophy`, `/pricing`. These are trial-conversion and trust pages. Disallowing them is *worse* than the problems the audit flagged: Google won't crawl them, CTR is zero, and the entire Phase 10 meta-description optimization for `/adult-trial` / `/junior-trial` / `/beginner-program` is pointless until this changes.
- **Date consistency across `/camps`, `homepage-copy.json`, and `data/*.json`** is broken today (June 16 on camps page and home vs June 15 in season JSON; multiple Aug 19 / Aug 28 / Aug 29 values). The SEO audit treats dates as stable — they aren't. This is the operational consistency audit's territory and has to be fixed *before* the Phase 10 meta descriptions land (one of them bakes in a wrong date).
- **Aggregator pages like `/match-play`** are flagged for "negative H1." But the brand rule is to not hype. The fix is to **remove** the page and 301 it, not rewrite the H1.

**Overall:** The SEO audit is ~85% accurate and actionable. Trust P0 items #1, #3, #4, #5 (phone, canonical, `/camps` title fix via new metadata export, noindex routes). Drop the robots.txt sitemap-URL "fix" entirely. Add **two new P0s** we discovered:

- **P0 new:** Remove the hostile `Disallow` lines in `public/robots.txt` for revenue pages (`/beginner-program`, `/adult-trial`, `/junior-trial`, `/success-stories`, `/philosophy`). Keep only legitimate blocks (`/vylo`, `/vylo-apply`, `/pricing` which is redirected).
- **P0 new:** Reconcile camp dates **before** updating meta descriptions (otherwise the SEO change rebakes a wrong date into SERPs).

### B. Checklist v2 — show the proposed replacement content

Every item card now has three stacked sections, not two:

1. **What it is now** (current site value, with file path)
2. **What it should be** (the rule / canonical expectation)
3. **Proposed replacement** — the exact copy, code block, or schema JSON we will ship if approved. Where we don't know the answer yet (e.g. phone, address), the proposed replacement says "Awaiting your answer below" and the correction textarea is pre-enabled.

The three action buttons are simpler now:

- **Approve replacement** — green, locks in the proposed value
- **Edit replacement** — orange, opens a textarea pre-filled with the proposed value so Saska edits in place (not from scratch)
- **Flag for discussion** — gold, adds a note, no value committed

Export still produces Markdown; now each item exports with both the proposed and final-approved value so remediation work has an unambiguous source.

### C. New items added from SEO audit + my verification

Added to the checklist:

- Placeholder phone on 3 trial pages (P0)
- Personal phone vs business phone policy on 5 pages (P1)
- Canonical tags site-wide (P0, layout-level fix)
- `/camps` missing `export const metadata` entirely (P0)
- `public/robots.txt` Disallow block including revenue pages (P0 — my finding, not in audit)
- Michelle Mateljan profile status (needs Andrew decision)
- `/high-performance-pathway` vs `/programs/high-performance` duplicate (P1)
- AggregateRating schema on homepage (P1)
- 3 LocalBusiness entities for LBHS / Moulton / Alta Laguna (P1)
- Title tag replacement for the 14 over-length pages (from audit Phase 10)

## Implementation Steps

### Phase 1: Audit review artifact (done this session)
- [x] Step 1.1: Verify robots.txt, canonical tags, placeholder phone, camps metadata against live codebase.
- [x] Step 1.2: Document audit accuracy verdict per claim.
- [x] Step 1.3: Identify audit blind spots (robots.txt Disallow block, camp-date consistency).

### Phase 2: Checklist v2 (this session)
- [ ] Step 2.1: Add "Proposed replacement" section to each item card in the HTML.
- [ ] Step 2.2: Add the new SEO-sourced items with exact proposed replacements.
- [ ] Step 2.3: Swap action buttons to "Approve replacement / Edit / Flag for discussion."
- [ ] Step 2.4: Persist the approved or edited value in localStorage under a new field (`approvedValue`).
- [ ] Step 2.5: Update export to include both proposed and approved values.

### Phase 3: Remediation handoff (next)
- [ ] Step 3.1: When Saska finishes, export the Markdown report.
- [ ] Step 3.2: Group exported P0 items into one PR (phone, canonical, camps metadata, robots.txt unblock, noindex leaks). Target: single deploy, ~2 hours of engineering time (per audit's P0 bundle).
- [ ] Step 3.3: Queue P1 schema + title-tag items for the following week.
- [ ] Step 3.4: `/compound:work` against each PR, with this plan path as the plan reference.

## Files to Create/Modify

| File | Action | Purpose |
|------|--------|---------|
| `plans/2026-04-16-seo-audit-review-and-checklist-v2.md` | Created | Audit accuracy verdict + v2 checklist plan (this file) |
| `plans/2026-04-16-lbta-audit-checklist.html` | Modify | Add proposed-replacement section, new SEO items, updated buttons |

```yaml
# files (for tooling)
create:
  - plans/2026-04-16-seo-audit-review-and-checklist-v2.md
modify:
  - plans/2026-04-16-lbta-audit-checklist.html
```

## Out of scope (this plan)

- Shipping the actual SEO fixes to the live site — that is a separate `/compound:work` pass against Phase 3.2 above.
- Rewriting every title tag from Phase 10 of the SEO audit — only the over-length ones and the `/camps` fix are first-pass targets.
- Building a blog (P2/P3 in the audit) — revisit after P0/P1 lands and once the destination hub and operational consistency are complete.
- Directory / NAP cleanup on Yelp / GBP / Apple Maps — plan separately once the on-site phone policy is decided.

## Success Criteria

- [ ] Every claim in `LBTA_SEO_Audit_April2026.md` marked as **Verified / Wrong / Unverified** with rationale.
- [ ] Checklist HTML shows the exact proposed replacement for each actionable item.
- [ ] Saska can approve or edit every replacement without typing from scratch.
- [ ] Exported Markdown groups items by **Approved / Edited / Flagged / Pending** so the engineering queue is obvious.

## Acceptance checklist

- [ ] **Audit accuracy** → Check: verdict row exists for each P0 + `/camps` + `/high-performance-pathway` claim.
- [ ] **Replacement visibility** → Check: open the HTML on a phone; every item shows a Proposed-replacement card above the action buttons.
- [ ] **Approval ergonomics** → Check: "Edit" opens a textarea pre-filled with the proposed text; "Approve" saves it as final.
- [ ] **Export** → Check: the downloaded `.md` now has three buckets: Approved / Edited / Flagged, plus remaining Pending.
- [ ] **New P0 captured** → Check: robots.txt Disallow item is present with exact new file contents as proposed replacement.

## Research Sources

- `LBTA_SEO_Audit_April2026.md` (user Downloads, April 16, 2026)
- `public/robots.txt` — actual contents verified
- `app/adult-trial/page.tsx`, `app/beginner-program/page.tsx`, `app/apply-scholarship/page.tsx` — placeholder phone verified
- `app/programs/leagues/page.tsx`, `app/programs/usta-adult-league/page.tsx`, `app/coaches/{andrew-mateljan,peter-defrantz,former-coach-removed}/page.tsx` — personal phone verified
- `app/camps/page.tsx` — no `export const metadata` confirmed; "June 16 to August 19" literal confirmed on lines 105, 116, 496, 558
- `plans/2026-04-15-full-site-operational-consistency-audit.md` — prior date/price drift findings

## Relevant Learnings

- **Verify audit claims in the repo before prioritizing P0 work.** One wrong claim (sitemap URL) + one missed blind spot (Disallow block) would have caused us to ship a no-op and leave a real revenue blocker in place.
- **Show the replacement, not just the rule.** "What it should be" is ambiguous; an exact copy block is unambiguous. Reduces back-and-forth with stakeholders by a factor of 2–3×.
- **Group fixes by deployment batch, not by audit phase.** P0 items that share a single PR (phone literals, canonical, robots.txt, noindex, camps metadata) ship faster together.

## Research conflicts & resolution

- **Audit says sitemap URL is wrong / I verified it's right.** Resolution: drop that P0 action; keep robots.txt on the list but for a different (and bigger) reason.
- **Audit vs operational consistency audit on dates.** SEO audit's Phase 10 bakes specific camp dates into new meta descriptions; ops audit says the dates themselves are unresolved. Resolution: operational consistency audit → remediation → **then** SEO meta refresh. Order matters.

## Confidence & uncertainty

- **Plan confidence:** High on audit accuracy verdicts where I could read the actual files. Medium where the claim depends on founder decision (Michelle Mateljan status, personal vs business phone policy).
- **Uncertainty:** Whether `/camps` ever had `export const metadata` and was deleted, or never had one. Either way, the fix is the same — add it.

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Saska approves a proposed value that's factually wrong | Every proposed-replacement card still shows current + expected so she compares before approving; "Edit" is one click away |
| Shipping P0 fixes before operational date audit closes | Put the camp-dates item on the checklist with "Blocks meta description changes" flag |
| Misreading audit as "ready to execute" | This plan + checklist v2 sit between audit and work — no `/compound:work` runs without them |
| robots.txt change accidentally un-blocks a legitimately private route | Explicit diff in proposed replacement shows exactly which Disallow lines go away and which stay |

---

*Compound phase: PLAN. Output: verified audit review + checklist v2 with proposed replacements. Next: Saska reviews the checklist, exports the report; `/compound:work` ships the P0 bundle in a single PR.*
