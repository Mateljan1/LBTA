# Compound Learn — Supabase link + db push (LBTA)

**Source:** Session work — connecting repo to Supabase and applying migrations.  
**Date:** March 6, 2026.  
**Workspace:** LBTA_WEBSITE_DRAFT_3:5:26

---

## Session summary

- **Problem:** `supabase link` (or `supabase db push`) failed with "Cannot find project ref" when project ref was not yet linked in this repo.
- **Fix:** Ran `supabase link --project-ref mapbbmrjgpusegjvbkod` from repo root. Project ref was taken from `next.config.js` (hostname `mapbbmrjgpusegjvbkod.supabase.co` → ref `mapbbmrjgpusegjvbkod`). Then `supabase db push` applied migration `20260306000000_create_leads_table.sql`. NOTICEs about "relation already exists, skipping" are expected when migration uses `IF NOT EXISTS`.

---

## CORRECTIONS (what was wrong → what to do instead)

| Original | Correction | Enforcement |
|----------|------------|-------------|
| Running `supabase db push` or `supabase link` without having linked the project first | Link once from repo root: `supabase link --project-ref <ref>`. Get ref from existing config (e.g. next.config.js image host: `xxx.supabase.co` → ref is `xxx`). Then run `supabase db push`. | Critical for first-time setup |
| Guessing or asking user for project ref when it exists in repo | Derive project ref from next.config.js `remotePatterns.hostname` or README (e.g. `mapbbmrjgpusegjvbkod.supabase.co` → ref `mapbbmrjgpusegjvbkod`). | Should |

---

## PATTERNS (name — when to use — example)

| Pattern | When to use | Example |
|--------|-------------|--------|
| **Supabase link from config** | First-time link or new clone; need project ref for `supabase link` | Parse next.config.js for Supabase hostname (e.g. `mapbbmrjgpusegjvbkod.supabase.co`), use the subdomain as ref: `supabase link --project-ref mapbbmrjgpusegjvbkod`. Then `supabase db push`. |
| **Migrations CLI-only** | Any Supabase schema change in this project | Per .cursorrules Part 5: use only Supabase CLI. Run `supabase db push` after link. Do not run SQL manually in dashboard for migrations that exist in `supabase/migrations/`. |

---

## STANDARDS (rule — enforcement level)

| Rule | Level | Notes |
|------|--------|-------|
| Supabase project ref for `supabase link` must come from repo (next.config.js or README), not guesswork | Should | Ensures link targets the same project the app uses. |
| After link, apply migrations with `supabase db push` from repo root | Critical | Single source of truth for schema; .cursorrules requires CLI-only migrations. |

---

## Memory system snippets (optional)

If you use `~/.claude/memory/`, you can append or merge the following.

### corrections.jsonl

```jsonl
{"timestamp":"2026-03-06T12:00:00Z","original":"Run supabase db push without linking first","correction":"Run supabase link --project-ref <ref> once (ref from next.config.js hostname), then supabase db push","keywords":["supabase","link","db push","project-ref"],"project":"lbta"}
{"timestamp":"2026-03-06T12:00:00Z","original":"Ask user for Supabase project ref when linking","correction":"Get project ref from next.config.js remotePatterns hostname (e.g. mapbbmrjgpusegjvbkod.supabase.co → mapbbmrjgpusegjvbkod) or README","keywords":["supabase","link","project-ref","next.config"],"project":"lbta"}
```

### patterns (semantic/global/patterns.json — add entry)

```json
{
  "supabase_link_and_push": {
    "when": "Repo has supabase/migrations/ and needs to link to Supabase and apply migrations",
    "steps": [
      "Get project ref from next.config.js (image hostname: xxx.supabase.co → ref is xxx) or README.",
      "From repo root: supabase link --project-ref <ref>.",
      "From repo root: supabase db push.",
      "Ignore NOTICE 'relation already exists' when migration uses IF NOT EXISTS."
    ],
    "project": "lbta"
  }
}
```

---

## Approval

- [ ] **Approve** — Apply snippets to your memory system (paths you use).
- [ ] **Reject** — Discard or edit this draft.
- [ ] **Merge** — Merge into existing compound learnings and optionally apply memory snippets.
