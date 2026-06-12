# Working-Tree Triage — 2026-05-13

**Compiled by:** Subagent triage pass (read-only)
**Repo state:** `main` HEAD `13942ee` (compound-learn artifacts), parent merge `b50413a` (mobile-ux Tier 1)
**Production:** healthy (`health:prod` exit 0, 8/8 canary HTTP 200)
**Constraint:** This document is a planning artifact. **No commits, no gitignore changes, no deletes were performed.**

---

## Headline numbers

- **`git status --porcelain`** entries: **93** (collapsed)
- **`git status --porcelain -uall`** files: **420** (expanded — likely what Cursor IDE "Needs Review" counts; Cursor reports ~644 which probably double-counts directories or includes IDE-state files)
- **Total untracked disk footprint:** **~215 MB**
- **Tracked-file modifications:** **0** (the 4 modified JSON/JSONL files were cleared by Task 2's commit; tree is now purely untracked)
- **Outside Tier 1 scope:** all 420 (Tier 1's tracked code was already merged and pushed via `b50413a`)

---

## Bucket map (single-screen)

| # | Bucket | Files | Size | Suggested action | Priority |
|---|---|---:|---:|---|:--:|
| 1 | **`docs/audits/2026-05/**`** — Mobile UX audit outputs (Lighthouse JSON+HTML, axe JSON, screenshots @ 6 viewports × 11 routes, findings/scorecard/gap-report MDs) | 140 | **196 MB** | Move PNGs to `.gitignore` (regen-from-tools artifacts); commit the MDs (`findings.md`, `scorecard.md`, `gap-report.md`, `andrew-decisions.md`, `remediation-plan-review.md`, `post-remediation/*.md`) + Lighthouse JSON to a small `mobile-ux-audit-docs-2026-05` branch | **HIGH** — these are the audit-trail evidence Tier 1 was based on; valuable for future cycles |
| 2 | **`gpt/**`** — Custom GPT system (architecture, knowledge brain, operations, integrations, brand assets, legal/privacy, command center) — 9 sub-dirs | 101 | 0.7 MB | Separate workstream. Commit to its own `gpt-system-init` branch + PR. Almost entirely Markdown. | MED |
| 3 | **`brochures/**`** — Print/email brochure pipeline (14 templates, 14 rendered HTML, 14 PDFs, 23 assets, 5 partials, tokens, docs, master content) | 74 | 12 MB | Mix of source (commit) and output (gitignore). Commit `brochures/{templates,partials,tokens,data,docs,00_MASTER_CONTENT_V2.md,assets/}` to `brochures-pipeline-init` branch. Add `brochures/out/` (PDFs) and `brochures/.rendered/` (HTML) to `.gitignore`. | MED |
| 4 | **Coach-hub WIP — UI + lib + data + api (untracked, NOT on WIP branch!)** — see [Critical drift finding](#critical-finding-coach-hub-wip-branch-does-not-contain-the-ui) | 38 | 244 KB | **STOP — DECIDE FIRST.** These files are ONLY on local disk. `coach-hub-wip-2026-05-13` branch contains only env/validation/proxy plumbing + 1 data file. The actual coach-hub product (13 app/ pages, 9 components, 4 data JSONs, 11 lib/.ts files, 3 API routes) **has not been preserved anywhere**. Disk wipe = work lost. | **CRITICAL** |
| 5 | **`plans/**`** — Planning docs accumulated since 2026-04-14 (30+ files including mobile-ux audit plan, brochure plans, GPT plans, coach-hub plans, SEO plans) | 31 | 0.7 MB | Commit to `planning-docs-archive` branch in one sweep; these are historical artifacts that don't need a PR cycle. | LOW |
| 6 | **`generated/**`** — OCR probe outputs (UTR/star-match crops), tagged coach photos | 15 | 5.6 MB | Add `generated/` to `.gitignore` (these are pipeline outputs, regenerable). Optionally keep `generated/current-coaches/` and `generated/coach-collection/` if these are final marketing assets, then move them to `public/coaches/`. | MED |
| 7 | **`assets/emails/**`** — 2 new email templates (Spring 2026 Week 2 + UTR Season 1 Week 1) | 2 | 88 KB | Commit to `email-templates-2026-q2` branch. These pass through `lib/email.ts` + brand-checker. | LOW |
| 8 | **`assets/playbypoint/**`** — 2 large PNG/JPG hero images (1920×1080, 2560×1440) | 2 | 648 KB | Surface for Andrew decision. Likely commit to `assets/playbypoint/` or move to `public/images/playbypoint/`. | LOW |
| 9 | **`scripts/**`** — 10 new Python scripts (brochure rendering, asset packs, playbypoint hero render, rollback, audit helpers) | 10 | 108 KB | Commit to whichever workstream branch they belong (most are brochure pipeline → bucket 3). | LOW |
| 10 | **`public/coach-hub-content/**`** — 2 files (lessons + sessions HTML/JSON likely) | 2 | 80 KB | Part of coach-hub WIP — fold into bucket 4 decision. | (see #4) |
| 11 | **`.cursor/compound/learnings/2026-05-11-*-compound-learn.md`** — 4 coach-hub workstream compound-learns | 4 | 40 KB | Commit alongside coach-hub (#4) when that branch is finalized. Intentionally left untracked in Task 2 per scope. | (see #4) |
| 12 | **`docs/utr-tracker-tracking-and-scoring-guide.md`** — standalone UTR guide | 1 | 8 KB | Surface for Andrew decision. Likely commit to `docs/` directly or fold into coach-hub. | LOW |

**Total accounted: 420 files, ~215 MB.** All entries verified by `git status --porcelain -uall`.

---

## Top 15 largest untracked files

```
9220 KB  docs/audits/2026-05/screenshots/programs--junior-1440.png
9200 KB  docs/audits/2026-05/screenshots/schedules-1440.png
7472 KB  docs/audits/2026-05/screenshots/about-1440.png
6568 KB  docs/audits/2026-05/screenshots/home-1440.png
6020 KB  docs/audits/2026-05/screenshots/schedules-768.png
6020 KB  docs/audits/2026-05/screenshots/programs--junior-768.png
4716 KB  docs/audits/2026-05/screenshots/programs-1440.png
4604 KB  docs/audits/2026-05/screenshots/schedules-414.png
4604 KB  docs/audits/2026-05/screenshots/programs--junior-414.png
4552 KB  docs/audits/2026-05/screenshots/programs--junior-390.png
4544 KB  docs/audits/2026-05/screenshots/schedules-390.png
4408 KB  docs/audits/2026-05/screenshots/programs--junior-375.png
4220 KB  docs/audits/2026-05/screenshots/about-768.png
4204 KB  docs/audits/2026-05/screenshots/schedules-375.png
3812 KB  docs/audits/2026-05/screenshots/contact-1440.png
```

**Observation:** every entry in top-15 is a `docs/audits/2026-05/screenshots/*.png`. 84 PNGs total, ~140 MB combined. They're regenerable from the audit script (`scripts/audit/` likely contains the runner). Strongly recommend `.gitignore` pattern `docs/audits/**/screenshots/`.

---

## Critical finding: `coach-hub-wip-2026-05-13` branch does NOT contain the UI

The previous worker reported that coach-hub WIP was "preserved on `coach-hub-wip-2026-05-13` branch (commit `e250659`)." This is **partially true and dangerously misleading**:

**What IS on the branch (vs main):**

```
.env.example
data/coach-hub/coach-schedules.json
lib/env.ts
lib/validations.ts
proxy.ts
vercel.json
+ 5 .cursor/compound/learnings/ files (now duplicated on main after 13942ee)
```

(11 files total in `git diff main..coach-hub-wip-2026-05-13`.)

**What is NOT on the branch — exists ONLY in working tree on `main`:**

```
app/api/coach-hub/[coach]/auth/route.ts
app/api/coach-hub/[coach]/lesson-plans/generate/route.ts
app/api/coach-hub/[coach]/logout/route.ts
app/coach-hub/[coach]/layout.tsx
app/coach-hub/[coach]/lesson-plans/[planId]/page.tsx
app/coach-hub/[coach]/lesson-plans/drafts/[draftId]/page.tsx
app/coach-hub/[coach]/lesson-plans/framework/page.tsx
app/coach-hub/[coach]/lesson-plans/generate/page.tsx
app/coach-hub/[coach]/lesson-plans/page.tsx
app/coach-hub/[coach]/login/page.tsx
app/coach-hub/[coach]/page.tsx
app/coach-hub/[coach]/schedule/page.tsx
app/coach-hub/[coach]/today/page.tsx
components/coach-hub-coach/CoachDataView.tsx
components/coach-hub-coach/CoachHtmlContent.tsx
components/coach-hub-coach/CoachTodayShell.tsx
components/coach-hub-coach/CoachWeekScheduleView.tsx
components/coach-hub-coach/LessonFrameworkView.tsx
components/coach-hub-coach/LessonPlanCard.tsx
components/coach-hub-coach/LessonPlanDetailView.tsx
components/coach-hub-coach/LessonPlanGeneratorForm.tsx
components/coach-hub-coach/LessonPlanLibraryView.tsx
data/coach-hub/coaches.json
data/coach-hub/coaching-today/andrew/2026-05-11.json
data/coach-hub/lesson-plans/framework.json
data/coach-hub/lesson-plans/plans.json
lib/coach-passwords.ts
lib/coach-schedule-data.ts
lib/coach-schedule-types.ts
lib/coach-today-data.ts
lib/coach-today-types.ts
lib/lesson-plan-composer.test.ts
lib/lesson-plan-composer.ts
lib/lesson-plan-data.ts
lib/lesson-plan-drafts-store.ts
lib/lesson-plan-types.ts
lib/per-coach-auth-server.ts
lib/per-coach-auth.ts
```

**38 working-tree files. ~244 KB of source. Only on local disk on `main`.**

This matches the `corrections.jsonl` entry just committed in `13942ee`:

> At preview-deploy moment, 10 tracked files had uncommitted edits from a parallel coach-hub workstream... Disclose dirty file list in deploy-summary.md... Then split WIP onto its own local branch (`coach-hub-wip-2026-05-13`) BEFORE main merge — preserves both lineages cleanly...

**The split preserved the 10 _tracked-file modifications_ but did not capture the 38 _untracked new files_** that make up the actual coach-hub product. The branch carries the plumbing changes (env vars, validation schemas, proxy/vercel config) — which is what enables the UI to run — but the UI itself was never committed anywhere.

**This is a single-machine-loss risk.** If Andrew's disk fails or he `git clean -fd`s the working tree, the entire coach-hub product disappears.

### Recommended remediation order

1. **TODAY — preserve coach-hub UI** before any other triage action: check out `coach-hub-wip-2026-05-13`, copy the 38 files in, commit with message `wip(coach-hub): preserve UI + lib + api + data (38 files) — not yet split into focused PRs`, push to GitHub. Cost: 5 min. Risk eliminated: loss of ~4 days of coach-hub work.
2. Then split into focused PRs from that branch per Andrew's product plan.

---

## `.gitignore` candidates (proposed, NOT applied)

If Andrew approves, the following patterns would cleanly remove ~150 MB of regenerable artifacts from the "needs review" surface without losing any source:

```gitignore
# Audit artifacts (regen from scripts/audit/)
docs/audits/**/screenshots/
docs/audits/**/lighthouse/*.html

# Generated pipeline outputs
generated/

# Brochure rendered outputs (regen from templates/)
brochures/.rendered/
brochures/out/
```

**Effect:** ~166 MB of untracked artifacts moved out of `git status` view. Source (templates, partials, tokens, content, scripts that produce them) all stay tracked.

**NOT proposed for gitignore:**
- `docs/audits/**/*.md` (findings, scorecards — these are decision artifacts, worth keeping)
- `docs/audits/**/*.json` (Lighthouse JSON — small, regenerable, but they document a specific point-in-time score, so retaining them as committed artifacts gives historical perspective; ~50 KB total)
- `gpt/`, `brochures/templates/`, `brochures/assets/` (source, not output)

---

## File-extension breakdown

```
 143 md    (planning + audit findings + GPT system docs)
 104 png   (84 audit screenshots + 20 generated/brochure assets)
  50 html  (brochure rendered + audit lighthouse + plan previews + email templates)
  42 json  (audit lighthouse + axe + coach-hub data + lesson plans)
  19 tsx   (coach-hub UI pages + components)
  15 ts    (coach-hub lib + auth + lesson-plan + schedule)
  14 pdf   (brochure outputs)
   9 jpg   (playbypoint hero + brochure photos)
   7 woff2 (brochure fonts)
   6 py    (audit/brochure render scripts)
   3 css   (brochure tokens + fonts)
   2 tsv   (OCR probe outputs)
   2 sh    (build_brochures.sh + audit helper)
   2 mjs
   2 csv   (operations audit)
```

---

## Workstream summary (for Andrew decision)

| Workstream | Status | Risk | Action |
|---|---|---|---|
| Mobile UX Tier 1 | ✅ Shipped (`b50413a` + `13942ee`) | None | Done |
| Mobile UX audit artifacts | 196 MB untracked | LOW (regenerable) | Commit MDs + Lighthouse JSON to `mobile-ux-audit-docs-2026-05` branch; gitignore screenshots |
| Coach-hub product | **38 files ONLY on local disk** | **HIGH** (data loss) | **Preserve to `coach-hub-wip-2026-05-13` branch TODAY** |
| GPT system | 101 files untracked, all source | LOW | `gpt-system-init` branch |
| Brochure pipeline | 74 files (mix source/output) | LOW | `brochures-pipeline-init` branch + gitignore outputs |
| Planning docs | 31 MDs accumulated since April | LOW | `planning-docs-archive` branch sweep |
| Email templates | 2 new HTMLs | LOW | `email-templates-2026-q2` branch |
| OCR probe outputs | 15 files | LOW | Gitignore `generated/` |

---

## Files I'm flagging as "shouldn't be tracked at all"

After review, none of the 420 files look like accidental drops (no .env leaks, no node_modules, no .DS_Store, no compiled binaries). The largest files are all legitimately part of one of the workstreams. The closest things to "shouldn't be tracked":

- `generated/utr_ocr_probe.{png,tsv}`, `generated/sat-row-crop*.png`, `generated/star-match-crop*.png` — OCR-pipeline development scratch. Gitignore.
- `brochures/.rendered/*.html` and `brochures/out/*.pdf` — render outputs. Gitignore (source-of-truth is `brochures/templates/`).

---

## What this triage does NOT do

- Does not commit anything
- Does not modify `.gitignore`
- Does not delete anything
- Does not move files
- Does not check out other branches

All actions above are recommendations. Each requires explicit approval before execution.
