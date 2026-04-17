# Compound Learn — 2026-04-16 · SEO P0 Bundle Deploy

**Loop:** Plan (`2026-04-16-seo-audit-review-and-checklist-v2.md`) → Work → Review → Validate → Deploy → Learn
**Deploy SHA:** `e54d596` (push to `origin/main`, Vercel prod verified live at `lagunabeachtennisacademy.com`)
**Commits:** 8 atomic commits spanning phone placeholders, robots.txt, canonical strategy, noindex routes, hero eyebrow test, and a post-deploy hotfix

## Wins

1. **Two compound phases saved us from SEO disasters.**
   - Phase 3 Review caught the **root-canonical-cascade bug** before deploy — a single `alternates.canonical: '/'` in root layout would have told Google every page was a duplicate of the homepage. One line, fully recoverable but only because we didn't push it.
   - Phase 5 Post-Deploy Smoke Test caught the **`app/robots.txt` shadow file bug** that Phase 4 static-HTML validation could not see (since static validation reads prerendered HTML, not runtime routing decisions).

2. **Live site now has correct SEO foundation:**
   - All 34 public routes emit self-referencing canonicals
   - `/high-performance-pathway` canonicals to its hub (`/programs/high-performance`)
   - 5 revenue pages (`adult-trial`, `beginner-program`, `junior-trial`, `philosophy`, `success-stories`) are **no longer blocked** by robots.txt — they were blocked before
   - 3 admin/utility routes properly noindexed
   - Input-placeholder phone numbers swapped to real business line across 3 conversion pages
   - Hero eyebrow short-name test live ("Laguna Beach Tennis · The Academy"), fully reversible

3. **Auth posture confirmed stronger than the SEO audit believed.** `proxy.ts` (Next.js 16 routing middleware) already gates `/coach-hub/**` and `/utr-tracker/admin/**` with HMAC-signed cookies. My Warning #2 from the Review phase was a false positive caused by grepping only for `middleware.*`.

## Mistakes worth never repeating

### 1. Root canonical cascade (caught in Review, before any deploy)
Wrote `alternates: { canonical: '/' }` in `app/layout.tsx`. Next.js shallow-merges metadata across segments; any page without its own `alternates` inherits the parent's. With no child overrides, all ~40 routes would canonical to `/`. → Anti-pattern: `root-layout-canonical-cascade`

### 2. Edited the shadow file (caught in Post-Deploy Smoke, after deploy — hotfixed in 4 min)
Edited `public/robots.txt`. Didn't know `app/robots.txt` existed and takes precedence. Live site kept serving the old content even after a successful build + deploy. → Anti-pattern: `app-robots-txt-shadows-public`

### 3. `middleware.ts` blindness (caused a false positive in Review)
Globbed for `middleware.*`, got zero hits, flagged `/utr-tracker/admin` as a security warning. The repo actually uses `proxy.ts` (Next.js 16 name for the same file). → Anti-pattern: `middleware-search-misses-nextjs-16-proxy`

### 4. Trusted an SEO audit's P0 claim that was literally wrong (caught in Plan, before any work)
The audit said "robots.txt points to wrong domain `lbtennisacademy.com`." Read the file — it pointed to the correct domain. If I had queued the "fix" without verification, I would have shipped a no-op. Separately, the audit missed that `app/robots.txt` existed and DID point at the wrong domain. → Anti-pattern: `seo-audit-claims-unverified`

### 5. Over-dramatized framing of placeholder phone (accuracy issue, not a bug)
Said "broken conversion path, prospects literally can't reach you." Those were input `placeholder=` attributes — gray UX hint text, disappears the moment a user types. The actual displayed phone in the header and footer was always correct. Fix was still worth making for trust/polish, but the stakes framing was wrong. → Anti-pattern: `placeholder-phone-vs-displayed-phone`

## New patterns to reuse

1. **`per-page-self-referencing-canonical`** — declare `alternates.canonical` per page, never cascade from root
2. **`post-deploy-live-smoke-test`** — mandatory final step in every `/compound:deploy`; static HTML alone isn't enough
3. **`atomic-commits-per-logical-concern`** — 8 separate commits for this bundle enabled a 1-line, 4-minute revert/fix
4. **`build-output-validation-fallback`** — grep `.next/server/app/*.html` when live HTTP testing blocked; good for static routes, flag dynamic ones
5. **`shadow-file-detection-script`** — `ls app/<name>* public/<name>*` before editing any static asset

## New quality bars

- `canonicalPerPageOnly` (must) — every indexable route declares its own canonical; root layout never declares one
- `oneRobotsTxtSource` (must) — exactly one robots.txt source per project; delete the loser
- `deployLiveSmokeTest` (must) — live HTTP checks required at end of every deploy phase
- `auditClaimsVerifiedBeforeP0` (should) — treat external audits as hypotheses, verify per file
- `proxyTsAwarenessNextjs16` (should) — grep for both `middleware.ts` and `proxy.ts` when auditing auth

## Artifacts produced this loop

- `plans/2026-04-15-full-site-operational-consistency-audit.md`
- `plans/2026-04-15-hnw-destination-local-first-website-strategy.md`
- `plans/2026-04-16-lbta-website-mindmap.html` — visual mind map + exit tracker
- `plans/2026-04-16-exit-ready-website-tracker.md`
- `plans/2026-04-16-lbta-audit-checklist.html` — interactive verification checklist v2
- `plans/2026-04-16-seo-audit-review-and-checklist-v2.md`
- `plans/2026-04-16-preship-preview.html` — pre-ship review preview
- `scripts/rollback/rollback-2026-04-16-seo-bundle.sh` — executable rollback

## Metrics

- **Plan:** ~2 hours (incl. verification of SEO audit claims against actual repo)
- **Work:** ~1 hour (scoped edits, 8 commits, lint + typecheck per step)
- **Review:** ~25 minutes (all 14 perspectives applied to 30-line diff directly)
- **Validate:** ~15 minutes (build-output validation due to port conflict, flagged dynamic routes as inferred-pass)
- **Deploy:** ~15 minutes (ship gate + Vercel push + 2 deploys including hotfix + live smoke tests)
- **Learn:** ~10 minutes
- **Total:** ~4 hours from plan to deployed + compounded
- **Critical findings caught before production:** 1 (canonical cascade)
- **Critical findings caught post-deploy:** 1 (robots.txt shadow — hotfixed 4 min)
- **False positives in Review:** 1 (middleware.ts blindness)

## What's next (queued for follow-up PRs)

1. Saska completes checklist review → ship dates, D1 count, Google rating verification, Alta Laguna address, Michelle Mateljan status
2. Remaining items from pre-ship preview: title tag rewrites, meta descriptions, AggregateRating + LocalBusiness schema, founder bio tighten, testimonial swap, `500+ → 695`
3. Pre-existing `lib/form-config.test.ts` swim-tennis failure — needs pricing entry or config cleanup; blocks `ship:gate`

---

*Compound phase: LEARN complete. Memory system updated (6 corrections, 5 anti-patterns, 6 patterns, 5 quality bars). Next `/compound:plan` will load these automatically.*
