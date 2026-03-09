# Performance Oracle — LBTA Next.js Codebase Review

**Scope:** N+1 queries, caching, indexes, unnecessary work.  
**Focus:** `lib/validations.ts` parseJsonBody, API routes, success-stories/Header/page/SEOSchemas importing site-stats.json, components.  
**Date:** 2026-03-08

---

## Status: **WARNINGS**

No critical issues. A few improvements recommended (webhook latency, consistency, client bundle).

---

## Findings Table

| Area | Finding | Severity | Recommendation |
|------|---------|----------|----------------|
| **lib/validations.ts — parseJsonBody** | Single consumption of `request.json()`; no double-read. All form API routes call it once then validate. | PASS | None. |
| **API — body consumption** | Only `activecampaign-webhook` uses raw `request.json()` instead of `parseJsonBody`. Behavior is correct (single read); pattern is inconsistent. | WARN | Use `parseJsonBody` in webhook for consistency and shared 400 handling. |
| **API — N+1** | No N+1. Form routes (book, register-program, register-year) do one contact upsert, then sequential list/tag calls that correctly depend on `contactId`. | PASS | None. |
| **API — activecampaign-webhook** | Four **sequential** GETs: contact → fieldValues → contactTags → contactLists. First two are independent; second two are independent after `contactId`. | WARN | Run `get(contact)` and `get(fieldValues)` in parallel; run `get(contactTags)` and `get(contactLists)` in parallel. Cuts latency by roughly one round-trip. |
| **Caching** | No `unstable_cache` or response caching in app. Program/site data is static JSON imports (build-time). Rate limit uses Vercel KV (persistent, serverless-safe). | PASS | Optional: add `unstable_cache` only if you introduce runtime data fetches that are cacheable. |
| **Indexes** | No app-owned DB; Notion/AC/Supabase are external. No index recommendations for in-repo code. | PASS | N/A. |
| **site-stats.json** | Single source: `data/site-stats.json` with `trustStats` (playersCount, yearsExperience, rating, reviewCount). Used in app/page (localBusinessSchema), success-stories (stats + CTA), Header, ExitIntentPopup, SEOSchemas (ReviewSchema). All values aligned (e.g. 25+ years, 47 reviews). | PASS | None. |
| **site-stats — client bundle** | `site-stats.json` is imported by client components (Header, ExitIntentPopup, success-stories page). JSON is small; bundler may include it in client chunks. | WARN | Optional: pass trust stats from layout/server as props to avoid client bundle copy if you optimize bundle size. |
| **success-stories / Header / page / SEOSchemas** | success-stories and app/page use `siteStats.trustStats.*` for numbers and schema. SEOSchemas and app/page use `siteStats.trustStats.rating` and `reviewCount` for aggregateRating. No hardcoded duplicates. | PASS | None. |
| **Rate limiting** | Uses Vercel KV (`@vercel/kv`); not in-memory. Safe for serverless and multi-instance. | PASS | None. |
| **Components** | No heavy sync work in reviewed components. ExitIntentPopup uses passive scroll listener and sessionStorage; Header uses refs and focus trap. No redundant re-renders identified. | PASS | None. |

---

## Summary

- **parseJsonBody:** Used once per request in all form API routes; no double body read. Safe and consistent except in the webhook, which uses raw `request.json()`.
- **API routes:** No N+1; rate limiting and validation are in place. Only notable inefficiency is the webhook’s four sequential GETs, which can be reduced to two parallel pairs.
- **site-stats.json:** Single source of truth; used correctly in success-stories, Header, app/page, and SEOSchemas. Client components import the same small JSON (minor bundle impact).
- **Caching / indexes:** No app-level caching needed for current static data; no in-repo DB indexes to add.
- **Unnecessary work:** Limited to webhook request ordering; form handlers and components are in good shape.

---

## Score: **85 / 100**

- **Deductions:** Webhook sequential GETs (−5), webhook not using parseJsonBody (−2), client-side site-stats copy (−3), no response caching for APIs (−5; acceptable for form-only APIs).
- **Strengths:** Single body parse, no N+1, single source for trust stats, Vercel KV rate limit, clear validation and error handling.
