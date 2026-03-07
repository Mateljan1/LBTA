# Compound Learnings — LBTA Website

**Source:** Code review (12 agents), session work (VYLO removal, a11y, performance, docs).  
**Date:** March 6, 2026.  
**Review summary:** `plans/CODE_REVIEW_SUMMARY.md` (score 72/100, decision: needs fixes).

---

## CORRECTIONS (what was wrong → what to do instead)

| Original | Correction | Enforcement |
|----------|------------|-------------|
| HomeCTAForm sends `name`; `/api/book` expects `firstName`/`lastName` | Align contract: form sends `firstName`/`lastName` (e.g. split `name` on first space) OR API accepts `name` and derives server-side | Critical — submissions currently fail |
| Using `lbta-burnt` in Tailwind without defining it in `tailwind.config.ts` | Define `burnt` under `theme.extend.colors.lbta` (e.g. `'#E8834A'`) or replace all uses with existing token (e.g. `brand-sunset-cliff`) | Critical — build/runtime risk |
| Part 13 lists `lib/notion.ts`, `lib/utils.ts` but files don't exist | Part 13 lib list must match repo: list only existing files (e.g. `activecampaign.ts`, `env.ts`, `validations.ts`) or add missing modules | Critical — docs as source of truth |
| Hardcoding program/camp/pricing in `junior-trial/page.tsx` and `camps/page.tsx` | Source from `/data` (e.g. `winter2026.json`, `year2026.json`); remove inline duplicates per single-source-of-truth rule | Critical — Part 12 |
| Public API routes without rate limiting or schema validation | Add rate limiting and Zod (or equivalent) validation to `register-year`, `newsletter` (and other public POST endpoints) | Should fix |
| Header logo using `priority` when hero also uses priority | Use at most one `priority` image per page; remove from header logo | Should fix |
| Orphan VYLO CSS (comment + `drawBorder`, `pulseGlow` keyframes) in globals | Remove dead CSS after feature removal | Should fix |
| Copy using "world-class", "elite" (Part 14 forbidden) | Replace with calm, specific language per Part 14 | Should fix |
| Email/CSS using Arial, Inter, Playfair, Work Sans (Part 14 forbidden) | Use project fonts: Cormorant, DM Sans (or design tokens) | Should fix |

---

## PATTERNS (name — when to use — example)

| Pattern | When to use | Example |
|--------|-------------|---------|
| **Form–API contract alignment** | Any form that POSTs to an API | Before implementing or changing a form, confirm field names and types match the API schema (e.g. Zod). If API expects `firstName`/`lastName`, form must send them (or API must accept `name` and derive). |
| **Tailwind token before use** | Using a custom color/space in Tailwind | Only use classes that reference tokens defined in `tailwind.config.ts` (e.g. `lbta.burnt`). If adding a new token, add it in config first, then use. |
| **Docs match repo** | Updating .cursorrules or README | File-structure sections (e.g. Part 13) must list only existing paths. After adding/removing files, update the doc. |
| **Single source of truth for program/pricing data** | Any page showing programs, camps, or prices | Load from `/data/*.json`; no hardcoded program lists or prices in page components (Part 12). |
| **One priority image per page** | Hero + header or multiple above-fold images | Use `priority` on at most one Image per route (typically the main hero). Do not set priority on header logo if hero has priority. |
| **Remove dead code after feature removal** | After removing a feature (e.g. VYLO) | Remove redirects, layout branches, and any orphan CSS/JS (keyframes, comments, unused components) that referenced the feature. |
| **A11y for forms** | Every form (trial, newsletter, etc.) | Visible or sr-only labels, `aria-live` for errors, 48×48px minimum touch targets, focus rings (Part 10, WCAG 2.1 AAA). |

---

## STANDARDS (rule — enforcement level)

| Rule | Level | Notes |
|------|--------|------|
| Form payload must satisfy API schema (field names and types) | Critical | Verify with a quick manual or automated POST test. |
| All Tailwind custom tokens (colors, spacing) must be defined in `tailwind.config.ts` | Critical | Grep for `lbta-*` / `brand-*` and cross-check config. |
| Part 13 (and any file-structure doc) must match actual repo layout | Critical | Audit after adding/removing top-level dirs or `lib/` files. |
| Program and pricing data live only in `/data/*.json`; pages import from there | Critical | Part 12; no duplicate lists or prices in components. |
| Public POST endpoints must have rate limiting and request validation | Should | Security/review finding. |
| At most one `priority` image per page | Should | Performance/review finding. |
| No forbidden copy (e.g. "world-class", "elite") or forbidden fonts in new or touched copy/CSS | Should | Part 14. |
| After feature removal: no orphan routes, layout branches, or CSS/JS for that feature | Should | Regression hygiene. |

---

## Memory system snippets (optional)

If you use `~/.claude/memory/`, you can append or merge the following.

### corrections.jsonl (one line per correction)

```jsonl
{"timestamp":"2026-03-06T00:00:00Z","original":"Form sends name; API expects firstName/lastName","correction":"Align form and API: send firstName/lastName or accept name server-side","keywords":["form","api","validation","book"],"project":"lbta"}
{"timestamp":"2026-03-06T00:00:00Z","original":"Use lbta-burnt in Tailwind without defining in config","correction":"Define token in theme.extend.colors.lbta or use existing token","keywords":["tailwind","lbta","colors"],"project":"lbta"}
{"timestamp":"2026-03-06T00:00:00Z","original":"Part 13 lists non-existent lib files","correction":"Keep Part 13 lib list in sync with actual lib/ contents","keywords":["documentation","cursorrules","lib"],"project":"lbta"}
{"timestamp":"2026-03-06T00:00:00Z","original":"Hardcode program/pricing in page components","correction":"Source from /data/*.json only; no duplicate data","keywords":["data","single-source-of-truth","programs"],"project":"lbta"}
```

### anti-patterns.json (add to existing or create)

```json
{
  "lbta": [
    "Form fields and API request schema must match; do not send 'name' when API expects 'firstName' and 'lastName'.",
    "Do not use Tailwind classes for undefined theme tokens (e.g. lbta-burnt without defining in config).",
    "Do not document files or paths in .cursorrules Part 13 that do not exist in the repo.",
    "Do not duplicate program/camp/pricing data in page components; use /data/*.json only.",
    "Do not set priority on more than one Image per page (e.g. not both hero and header logo)."
  ]
}
```

### quality-bars.json (merge into existing)

```json
{
  "lbta": {
    "form-api-contract": "Form payload must pass API schema validation (field names and types).",
    "tailwind-tokens": "Every custom Tailwind token (lbta.*, brand.*) must be defined in tailwind.config.ts.",
    "docs-match-repo": "Part 13 and file-structure docs must list only existing paths.",
    "data-single-source": "Program and pricing data only in /data; no hardcoded duplicates in components.",
    "priority-image-per-page": "At most one priority image per route."
  }
}
```

---

## Next actions (from review)

1. **Fix critical issues:** HomeCTAForm/API, lbta-burnt, Part 13 lib, junior-trial/camps data source.
2. **Address warnings:** Rate limiting, webhook verification, header logo priority, dead VYLO CSS and dead routes, forbidden copy/fonts, doc and regression updates.
3. **Optional:** E2E tests for redirects and HomeCTAForm submit; not-found image quality; button radius and spacing alignment.

---

## Phase 2: API Hardening (March 2026)

**Scope:** newsletter, register-year, scholarship, register, activecampaign-webhook.  
**Reference implementations:** `app/api/book/route.ts`, `app/api/register-program/route.ts`.

### CORRECTIONS (Phase 2)

| Original | Correction | Enforcement |
|----------|------------|-------------|
| Reading `process.env` at module load in API routes | Read env inside the handler with `getEnvVar`/`hasEnvVar` from `lib/env`; return 503 with `{ success: false, error: '…' }` when required env is missing | Should — avoids crash, clear behavior |
| Public POST routes without rate limiting | Use `checkRateLimit(RATE_LIMITS.form, identifier)` before processing; return 429 when over limit | Should |
| Request body not validated with schema | Use `validateRequest(request, schema)` from `lib/validations`; return 400 with validation errors | Should |
| API responses with mixed shapes (`message` vs `error`) | Standardize JSON: `{ success, message?, error? }` and consistent status codes (400 validation, 429 rate limit, 503 not configured, 500 server) | Should |
| Logging PII (email, name, etc.) in API routes | Log only non-PII (e.g. `hasContactId`, contact ID, or "No contact ID"); never log full body or email/name in production | Should |
| Webhook calling external service when env missing | Check `hasEnvVar` for URL and API key inside POST handler; if missing, return 503 and do not call external API | Should |

### PATTERNS (Phase 2)

| Pattern | When to use | Example |
|--------|-------------|---------|
| **API route hardening checklist** | Any new or touched `app/api/*/route.ts` (POST) | NextRequest, checkRateLimit (RATE_LIMITS.form), validateRequest with Zod schema from lib/validations, getEnvVar/hasEnvVar inside handler (not at top level), response `{ success, message?, error? }`, no PII in logs. |
| **Env inside handler** | Routes that need ACTIVECAMPAIGN_*, NOTION_*, etc. | Call `getEnvVar('ACTIVECAMPAIGN_URL')` and `hasEnvVar('ACTIVECAMPAIGN_API_KEY')` inside the POST handler; if missing, return 503 and exit. |
| **Shared rate limit key** | All form/post-style endpoints | Use `RATE_LIMITS.form` and a stable identifier (e.g. IP or forwarded header) so limits apply consistently. |
| **Webhook “not configured”** | Incoming webhooks that depend on external config | If URL or API key is missing, return 503 with `{ success: false, error: 'Webhook not configured' }` and document that signature verification is optional (e.g. comment in code). |

### STANDARDS (Phase 2)

| Rule | Level | Notes |
|------|--------|------|
| Public POST API routes must use rate limiting and Zod validation | Should | Use lib/rate-limit and lib/validations; align with book and register-program. |
| Routes using env for external services must read env in handler and return 503 when not configured | Should | Prevents module-load failures and gives clear error. |
| API JSON responses must use shape `{ success, message?, error? }` and appropriate status codes | Should | 400 validation, 429 rate limit, 503 not configured, 500 server error. |
| No PII in API route logs (no email, name, full body) | Should | Log only presence flags, IDs, or generic messages. |

### Memory snippets (Phase 2) — for ~/.claude/memory/

**corrections.jsonl:**

```jsonl
{"timestamp":"2026-03-06T00:00:00Z","original":"Read process.env at module load in API routes","correction":"Read env inside handler with getEnvVar/hasEnvVar; return 503 when missing","keywords":["api","env","getEnvVar","503"],"project":"lbta"}
{"timestamp":"2026-03-06T00:00:00Z","original":"Public POST without rate limit or Zod","correction":"Use checkRateLimit and validateRequest with schema from lib/validations","keywords":["api","rate-limit","zod","validation"],"project":"lbta"}
{"timestamp":"2026-03-06T00:00:00Z","original":"Inconsistent API response shape","correction":"Use { success, message?, error? } and consistent status codes","keywords":["api","response","json"],"project":"lbta"}
```

**anti-patterns.json (add to lbta array):**

- "Do not read process.env at module load in API routes; use getEnvVar/hasEnvVar inside the handler."
- "Do not skip rate limiting or Zod validation on public POST endpoints."
- "Do not log PII (email, name, full body) in API route handlers."

**quality-bars.json (merge into lbta):**

- "api-env-in-handler": "Env for external services read in handler; return 503 when not configured."
- "api-response-shape": "JSON responses use { success, message?, error? } with correct status codes."
- "api-no-pii-logs": "API routes must not log PII; log only identifiers or presence flags."

---

## Reference

- **Review summary:** `plans/CODE_REVIEW_SUMMARY.md`
- **Scope:** `plans/REVIEW_SCOPE.md`
- **Project rules:** `.cursorrules` (Parts 12–14 for data, structure, forbidden patterns)
