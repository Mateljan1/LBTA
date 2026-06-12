# Exit-Ready Website Tracker — Plan

## Overview

A single visual HTML tracker (`plans/2026-04-16-lbta-website-mindmap.html`) that maps the current website, the operational audit findings, the proposed new sitemap, and the 18-month task list that ties the site to the **$1.5M–$2M sale by October 2027** (per `LBTA_Exit_Playbook_2M_Target.md`).

## Problem Statement

Three separate documents today: operational consistency audit, HNW/destination strategy, and the exit playbook. None of them is a **single visual artifact** a non-engineer can scan in two minutes and know what's done, what's off, and what's next. Without that, the website work doesn't feel tied to the sale — and the sale math depends on the website telling the right story.

## Proposed Solution

One self-contained HTML mind map with seven sections:

1. **Three-lane mind map** — Today · Off · Direction.
2. **Known discrepancies** — the real Aug 28/29, June 15/16 issues from the audit.
3. **Site at a glance** — 43 routes, where the gap is (no destination hub).
4. **Strategy triangle** — Local-first · Boutique developmental · Laguna as destination.
5. **Sequenced next moves** — trust first, positioning second, one thin increment.
6. **Proposed new sitemap tree** — mobile-friendly nested cards with Keep / Move / New / Consolidate / Remove pills. (Source: CEO advisor + exit playbook §8, §6)
7. **Exit tracker** — 4 phases (Apr–Jun 2026, Jul–Dec 2026, Jan–Jun 2027, Jul–Oct 2027) with task lists, status dots, and progress bars. (Source: exit playbook §6, §11)

**Design constraints:** Cormorant + DM Sans, brand palette, luxury restraint (`.cursorrules`). No JS framework. `<details>` for disclosure. Mobile-first — everything stacks single-column below 900px and tightens padding below 640px.

## Implementation Steps

### Phase 1: Tracker artifact (done this session)
- [x] Step 1.1: Render the 7-section HTML at `plans/2026-04-16-lbta-website-mindmap.html`.
- [x] Step 1.2: Mobile-tighten: reduce section padding, stack grids, shrink step numerals under 640px.
- [x] Step 1.3: Wire exit playbook numbers into the tracker header ($390K / $538K / $650K / 3.0–3.5×).
- [x] Step 1.4: Reflect known audit discrepancies as concrete table rows.

### Phase 2: Connect to the engineering backlog (next)
- [ ] Step 2.1: Per tracker phase, open one-line tickets (or plan stubs) for each task — so progress dots map to real work.
- [ ] Step 2.2: After each task ships, flip its status class in the HTML (`task progress` → `task done`).
- [ ] Step 2.3: After each Phase fills, run `/compound:learn` to capture what worked.

### Phase 3: Monthly refresh
- [ ] Step 3.1: On the 1st of each month, update revenue numbers in the tracker header from the latest P&L snapshot.
- [ ] Step 3.2: Reconcile against exit playbook §11 (Andrew / Saska / Robert weekly ownership).
- [ ] Step 3.3: Link any new plan file under `plans/` into the tracker's closing footer note.

## Files to Create/Modify

| File | Action | Purpose |
|------|--------|---------|
| `plans/2026-04-16-lbta-website-mindmap.html` | Created | Visual mind map + sitemap tree + exit tracker |
| `plans/2026-04-16-exit-ready-website-tracker.md` | Created (this file) | Plan index so the HTML isn't orphaned |
| `plans/2026-04-15-full-site-operational-consistency-audit.md` | Referenced | Phase 1 source of truth |
| `plans/2026-04-15-hnw-destination-local-first-website-strategy.md` | Referenced | Phase 2–3 positioning |
| `~/Downloads/LBTA_Exit_Playbook_2M_Target.md` | Referenced | Sale math, phased tasks, buyer personas |

```yaml
# files (for tooling)
create:
  - plans/2026-04-16-lbta-website-mindmap.html
  - plans/2026-04-16-exit-ready-website-tracker.md
modify: []
```

## Out of scope (this plan)

- Rebuilding the live Next.js site from this tracker — the tracker is the **plan**, not the implementation.
- Visual redesign beyond what already ships to lagunabeachtennisacademy.com.
- Legal, financial, or EB-5 buyer outreach — consult CA counsel, CPA, and immigration attorney per playbook.

## Success Criteria

- [ ] A non-engineer (Andrew, Saska, Robert) can open the HTML and answer in under 2 minutes: *what's done, what's next, what's at risk.*
- [ ] Every task in the exit tracker maps back to a specific phase in `LBTA_Exit_Playbook_2M_Target.md`.
- [ ] Mobile: no horizontal scroll at 375px on any section.
- [ ] Zero references to hardcoded dates or prices that live only in the HTML — everything that matters still comes from `/data/*.json` on the live site.

## Acceptance checklist

- [ ] **Readability** → Check: open the HTML on an iPhone-sized viewport; legend, tree pills, and tracker dots remain legible.
- [ ] **Traceability** → Check: each Phase 2/3/4 task cites a due date that matches the exit playbook §6 / §11.
- [ ] **Brand** → Check: no forbidden hype phrases, Cormorant + DM Sans loaded, brand palette only.
- [ ] **Compound hook** → Check: `/compound:learn` reference present so phase completions feed memory.

## Research Sources

- `LBTA_Exit_Playbook_2M_Target.md` (sections 1, 4, 6, 8, 9, 11)
- `plans/2026-04-15-full-site-operational-consistency-audit.md`
- `plans/2026-04-15-hnw-destination-local-first-website-strategy.md`
- `app/sitemap.ts`, `next.config.js` redirects, `app/**/page.tsx`

## Relevant Learnings

- **Operational drift burns premium multiples.** Fix date/price truth layer **before** marketing spend on HNW / destination.
- **Trackers are only useful if someone updates them.** Keeping the HTML hand-editable (status-class flips) lowers the cost of updates vs. a build-dependent dashboard.
- **Compound phase alignment:** the HTML tracker *is* the plan artifact for `/compound:work` ownership hand-offs — no separate ticket system required for this level of work.

## Research conflicts & resolution

- **Tracker as static HTML vs. Airtable view** → Chose static HTML. Buyers, coaches, and founder can all open it without accounts; Airtable stays the source of truth for revenue/records. HTML reflects narrative + milestones, not raw data.

## Confidence & uncertainty

- **Plan confidence:** High on structure and source-linking. Medium on whether the `/visit` hub lands in time for the Aug 2026 hotel pilot — dependent on positioning lock and partner readiness.
- **Uncertainty:** Whether Vercel analytics + Plausible need to be on the site by Phase 3 for due-diligence metrics. Flagged; decide in Phase 2.

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Tracker becomes stale | Monthly refresh ritual (Phase 3.1–3.3); tied to P&L update cadence |
| Buyers see the tracker before we're ready | Keep under `plans/` (unindexed by production Next.js); do not publish to the live site |
| Scope creep inside the HTML itself | Changes only via this plan doc; add new sections only after Phase acceptance |
| Sale strategy changes mid-path | Refresh exit playbook first; tracker follows, never leads |

---

*Compound phase: PLAN. Output artifact: `plans/2026-04-16-lbta-website-mindmap.html`. Next: stakeholder walk-through with the visual tracker, then `/compound:work` on Phase 1 audit tasks.*
