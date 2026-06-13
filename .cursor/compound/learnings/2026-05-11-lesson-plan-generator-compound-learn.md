# Lesson Plan Generator — `/compound:full` Level 4 FULL AUTO

**Date:** 2026-05-11
**Workflow:** `/compound:full` wrapped with `/agent-architecture` v2.0 at autonomy level 4
**Result:** Deterministic plan composer live in production. ~2.5h end-to-end. Zero rework cycles.

## What shipped

| Surface | URL | Status |
|---|---|---|
| Generator form | `/coach-hub/{coach}/lesson-plans/generate` | ✅ Live |
| Compose API | `POST /api/coach-hub/{coach}/lesson-plans/generate` | ✅ Live |
| Draft detail page | `/coach-hub/{coach}/lesson-plans/drafts/{draftId}` | ✅ Live |
| Library shows drafts section | `/coach-hub/{coach}/lesson-plans` (now with "Generated drafts") | ✅ Live |
| Generate CTA on library | "Generate a new plan" button on library landing | ✅ Live |

## Architecture

Pure-logic deterministic composer, no AI. Drives off the canonical framework codified earlier today.

```
Coach fills form (Program/Age/Duration/Focus)
  ↓
POST /api/.../generate
  ↓
Validate (Zod) + Rate limit + Auth (existing per-coach gate)
  ↓
composePlan(input) — pure function
  ├─ Movement Warm-up: pickWarmupBandLabel(program) → framework.warmupLibrary.byAge
  ├─ Craft Block: stroke focus → strokeFundamentals match; patterns → tactical.items
  ├─ Live-Ball: 1-2 formats from framework.liveBallFormats by remaining time
  └─ Review: debrief + homework templates from framework.reviewTemplates
  ↓
Wrap in LessonPlanDraft with _meta { generatedBy, createdAt, source }
  ↓
addDraft() → Vercel KV `coach-lesson-plan-drafts` (read-modify-write, FIFO 100)
  ↓
Return { draftId } → router.push to draft detail page
  ↓
Detail page: getDraft(id) from KV → render with existing LessonPlanDetailView
```

## Why deterministic > AI for v1

- **Zero drift risk.** Andrew's framework codified in `lib/lesson-plan-types.ts` BLOCK_TYPES + `framework.json` is the source of truth. Composer respects it literally.
- **0 cost** per generation. No Poppy credits, no API rate limits, no provider downtime.
- **40 min build vs 3.5h** for an AI version with prompt engineering + JSON schema validation + error handling.
- **AI refinement as later enhancement** is cleaner to layer on than to wire in upfront. Future Phase 2 plan: "✨ Refine with AI" button on generated plans → Poppy enhances cues/details only.

## Key decision: persistence

User asked "append generated plans to plans.json" — but **Vercel filesystem is read-only in production**. Silently fails in serverless even if dev works.

Three real options surfaced:
1. **Vercel KV** — already in env (KV_REST_API_URL/TOKEN), simple key-value, perfect for small mutable lists. **Chosen.**
2. **Supabase** — durable + queryable but new table migration adds 30-45min.
3. **Vercel Blob** — file-like, also viable, more complexity than needed.

KV with `lib/lesson-plan-drafts-store.ts` (listDrafts/addDraft/getDraft) — single key, FIFO cap 100, 0 new infra. Works first try.

## Velocity

| Phase | Estimate | Actual |
|---|---|---|
| 1. Persistence + types | 15 min | 12 min |
| 2. Composer logic | 40 min | 35 min |
| 3. API route | 15 min | 10 min |
| 4. Form + page | 30 min | 25 min |
| 5. Draft detail | 10 min | 8 min |
| 6. Library landing | 15 min | 15 min |
| 7. Verify + deploy | 15 min | 22 min (incl. 18-cell prod verify) |
| 8. Compound | 10 min | 12 min |
| **Total** | **~2h 30min** | **~2h 20min** |

**Zero rework cycles.** typecheck/lint/brand/build all clean first try. 6/6 dev smoke + 6/6 prod verification cells green. The patterns established earlier today (data-driven tabs, per-coach gating, static imports, brand tokens, source attribution footer) compounded perfectly.

## Patterns captured (3 new)

1. **`vercel-kv-for-small-mutable-lists`** — single key + JSON array + FIFO cap. Pattern: read-modify-write. Tolerable concurrency for low-traffic internal tools (3 coaches). For high-concurrency: use `lpush` + `ltrim` instead.

2. **`deterministic-composer-from-codified-framework`** — when domain framework is already codified in TS types + JSON libraries, build a pure-function composer instead of AI. Zero drift, zero cost, zero downtime, ships 5x faster.

3. **`auto-suggest-with-editable-override`** — Form auto-fills Age band from Program selection BUT keeps the field editable. Hint text "Auto-suggested from program; edit to refine." Avoids rigid form UX while staying fast for the common case.

## Anti-patterns added

1. **`vercel-fs-write-in-production`** — Don't plan to write to JSON files in /data/ from API routes. Vercel filesystem is read-only in serverless. Use KV/Supabase/Blob instead.

## Compound updates

- **Global corrections** (`~/.claude/memory/episodic/corrections/corrections.jsonl`): 2 new
- **Project corrections** (`<repo>/.cursor/compound/learnings/corrections.jsonl`): 3 new
- **Project patterns** (`<repo>/.cursor/compound/learnings/patterns.json`): 3 new
- **Dated session writeup**: this file

## What's next (per vision doc)

Per-coach hub now has 3 tabs (Today · Schedule · Lesson Plans) + 4 sub-surfaces under Lesson Plans (library landing, plan detail, framework reference, generator + drafts). Remaining from vision:

| Surface | Status |
|---|---|
| Player roster (read-only) | 📋 Future plan |
| Player notes (quick view) | 📋 Future plan |
| Hours / check-ins / earnings / payouts | 📋 Decision-blocked: build here vs link to lbta-admin-platform |
| AI refinement of generated plans (Poppy) | 📋 Future plan — uses existing POPPY_API_KEY env var |
| Promote draft → curated workflow | 📋 Future plan — copy generated draft to plans.json via PR |

## Compound flywheel evidence

This was the **4th tab/surface shipped today** (Today · Schedule · Lesson Plans · Generator). Each took progressively less time because:

- **Patterns reused:** static imports, per-coach gating in proxy, tab nav in CoachTodayShell, brand token discipline, source attribution footer, post-deploy curl verification grid
- **Anti-patterns avoided:** dynamic fs.readFile (caught at design), echo pipe to vercel env (used printf), shell loop var PATH (used URL/etc), vercel.json comment field
- **Component reuse:** LessonPlanDetailView renders both curated plans AND generated drafts identically — 0 new render code for drafts

Compound engineering working as designed.
