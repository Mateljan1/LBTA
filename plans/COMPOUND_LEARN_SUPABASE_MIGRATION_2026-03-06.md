# Compound Learn — Supabase project migration (LBTA)

**Source:** Session work — new Supabase project setup + repo-wide ref replace.  
**Date:** March 6, 2026.  
**Workspace:** LBTA_WEBSITE_DRAFT_3:5:26

---

## Session summary

- **User:** Created Supabase project "LBTA" (ref `mapbbmrjgpusegjvbkod`), ran leads migration, set Vercel env vars. Lead store ready.
- **Agent:** Replaced old project ref `qtrypzzcjebvfcihiynt` with `mapbbmrjgpusegjvbkod` across **24 files**: `next.config.js`, README, app pages, layout/Header, SEOSchemas, all nurture + newsletter emails, ActiveCampaign templates, docs/archive.
- **No code change** in `lib/leads-store.ts` — it already uses `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` from env.

---

## CORRECTIONS (what was wrong → what to do instead)

| Original | Correction | Enforcement |
|----------|------------|-------------|
| Old Supabase project ref left in codebase after migrating to a new project | After creating a new Supabase project and setting env vars, do a repo-wide search for the old project ref and replace with the new ref in config, app, components, emails, templates, and docs | Critical for migrations |
| Logo/image URLs pointing at a project that no longer exists | Update all asset URLs to the new project host; upload assets (e.g. logo) to the new project’s Storage so paths match | Critical — otherwise 404s |
| Only app code updated, emails/docs forgotten | When replacing a project ref, search **all** of: `next.config.js`, README, `app/`, `components/`, `emails/`, `skills/**/templates/`, `docs/` | Should |

---

## PATTERNS (name — when to use — example)

| Pattern | When to use | Example |
|--------|-------------|---------|
| **Supabase project migration** | New Supabase project (e.g. org change, fresh start) | (1) Create project, run migrations, set env (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY). (2) Repo-wide replace old ref with new ref. (3) Update next.config image domains to new host. (4) Upload any needed assets to new Storage. |
| **Backend identity in env only** | Any Supabase (or similar) usage in app code | Use only `process.env.SUPABASE_URL` and `process.env.SUPABASE_SERVICE_ROLE_KEY` in app/lib code. No hardcoded project ref in application logic. Ref may appear in asset URLs (logo) and next.config image domains. |
| **Ref-replace scope** | Replacing an external project/tenant ID across repo | Grep for the old ID everywhere; replace in config, app, components, emails, email templates, and docs (including archive). Use replace_all per file or a single sed/grep pass. |

---

## STANDARDS (rule — enforcement level)

| Rule | Level | Notes |
|------|--------|-------|
| After a Supabase (or similar) project migration, zero references to the old project ref in the repo | Critical | Prevents broken asset URLs and confusion. |
| next.config.js image domains must list the current Supabase host used for images | Critical | Prevents Next.js Image from blocking or failing. |
| README and docs that mention the Supabase project must use the current ref and URL | Should | Single source of truth for future migrations. |

---

## Memory system snippets (optional)

If you use `~/.claude/memory/`, you can append or merge the following.

### corrections.jsonl

```jsonl
{"timestamp":"2026-03-06T00:00:00Z","original":"Leave old Supabase project ref in repo after migration","correction":"Repo-wide replace old ref with new ref in config, app, components, emails, templates, docs","keywords":["supabase","migration","ref","replace"],"project":"lbta"}
{"timestamp":"2026-03-06T00:00:00Z","original":"Update only app code when changing project ref","correction":"Search and replace in next.config, README, app, components, emails, skills templates, docs","keywords":["supabase","ref","scope","replace"],"project":"lbta"}
```

### patterns (semantic/global/patterns.json — add entry)

```json
{
  "supabase_project_migration": {
    "when": "New Supabase project created; env vars set; need codebase to use new project",
    "steps": [
      "Replace old project ref with new ref everywhere (grep entire repo).",
      "Update next.config.js image domains to new Supabase host.",
      "Update README/docs with new project ref and URL.",
      "Upload required assets (e.g. logo) to new project Storage if URLs point to Storage."
    ],
    "project": "lbta"
  }
}
```

### anti-patterns (add to existing lbta array)

```json
"Do not leave the previous Supabase project ref in config, emails, or docs after migrating to a new project.",
"Do not assume only app/ and components/ need ref updates; include emails/, skills/**/templates/, docs/, and next.config.js."
```

---

## Approval

- [ ] **Approve** — Apply snippets to your memory system (paths you use).
- [ ] **Reject** — Discard or edit this draft.
- [ ] **Merge** — Merge into existing `plans/COMPOUND_LEARNINGS.md` and optionally apply memory snippets.
