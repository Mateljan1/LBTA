# Security Sentinel Review — LBTA Next.js Codebase

**Date:** 2026-03-08  
**Scope:** Auth, injection, secrets, OWASP; recent changes in `app/api/*`, `lib/validations.ts`, `components/ExitIntentPopup`, `components/FAQSection`, `data/site-stats.json` usage.

---

## Status: **WARNINGS**

No critical or high-severity issues that require immediate code changes. Several defensive improvements and hardening items are recommended.

---

## Findings Table

| Severity | Location | Issue | Recommendation |
|----------|----------|--------|-----------------|
| **Medium** | `app/api/activecampaign-webhook/route.ts` | Webhook allows secret via **query param** (`?secret=`) in addition to header. Query params can leak in server logs, referrer headers, and browser history. | Prefer **header-only** (`x-webhook-secret`) in production; document that query param is for AC compatibility only and consider deprecating or restricting to non-production. |
| **Medium** | `app/api/activecampaign-webhook/route.ts` | **No rate limiting** on webhook POST/GET. If `AC_WEBHOOK_SECRET` is ever compromised, an attacker could flood the endpoint and abuse downstream ActiveCampaign API calls. | Apply `rateLimit()` with `RATE_LIMITS.webhook` (or a per-IP limit) before processing. Use a stable identifier (e.g. IP or hash of secret) so legitimate AC traffic is not blocked. |
| **Low** | `lib/validations.ts` / API routes using `parseJsonBody` | **No request body size limit.** Very large JSON payloads could cause high memory/CPU (DoS) before Zod validation. | Add an optional max body size (e.g. 100–200 KB) in `parseJsonBody` or at the Next.js config level; return 413 when exceeded. |
| **Low** | `components/FAQSection.tsx` | FAQ schema is injected with `dangerouslySetInnerHTML` via `JSON.stringify(faqSchema)`. If `data/faq.json` ever contained a literal `</script>` (or similar) in question/answer text, it could break out of the script tag and execute. | Data is repo-controlled and currently safe. For defense-in-depth: sanitize FAQ strings (e.g. strip or escape `</script>`) before building `faqSchema`, or build the script node without raw `__html` (e.g. pass JSON as safe text). |
| **Low** | `app/api/activecampaign-webhook/route.ts` | On validation failure, response returns `validation.error` (the full Zod error string) to the client. Could reveal field names/schema structure to an attacker probing the endpoint. | Return a generic message (e.g. `Invalid payload`) for 400 validation failures while logging the full error server-side. |
| **Info** | Public form API routes | No CSRF tokens on POST endpoints (newsletter, book, register-year, etc.). Relies on same-origin and optional SameSite cookies. | Acceptable for current use (public forms). If you later add authenticated sessions or sensitive one-click actions, introduce CSRF tokens or double-submit cookie pattern. |
| **Info** | `lib/rate-limit.ts` | When Vercel KV is unavailable (e.g. missing env in prod), rate limiter **fail-open** (allows request). Reduces availability risk but allows unbounded traffic during KV outage. | Document as intentional; consider monitoring/alerts when KV is down so you can react. |

---

## Summary

- **Auth:** Webhook is protected by `AC_WEBHOOK_SECRET` (header or query). Production correctly returns 503 when the secret is not set. Public form routes are intentionally unauthenticated and scoped for lead capture.
- **Injection:** Input handling is strong: all relevant API routes use `parseJsonBody` plus Zod schemas; `contactId` in `register-year` comes only from the ActiveCampaign API response (`contactResponse.data?.contact?.id`), not from the client. Webhook payload is validated with `webhookPayloadSchema`; `contactId` from the payload is used only in server-side AC API calls (no user-controlled URLs → no SSRF).
- **Secrets:** No hardcoded secrets; all sensitive values come from env via `getEnvVar`/`hasEnvVar`. `.env.example` documents `AC_WEBHOOK_SECRET` without values.
- **OWASP alignment:** Access control (webhook secret), input validation (Zod + parseJsonBody), safe error responses (generic 500 messages), and production enforcement of webhook config are in place. Main gaps: webhook rate limiting, body size limit, and reducing validation error detail and query-param secret usage.
- **Recent changes reviewed:**
  - **parseJsonBody:** Consistent 400 on invalid JSON; only improvement is optional body size cap.
  - **register-year contactId:** Sourced only from AC response; used safely for list/tag operations.
  - **Webhook error typing:** `catch (error: unknown)` with safe message extraction and generic client response; no leakage.
  - **ExitIntentPopup:** Uses `data/site-stats.json` for trust stats; React text rendering (no raw HTML) — no XSS risk.
  - **FAQSection:** Trusted FAQ data; only recommendation is hardening around `dangerouslySetInnerHTML` for schema.
  - **data/site-stats.json:** Contains `reviewCount`; used in `app/page.tsx`, `SEOSchemas.tsx`, `success-stories`, `Header`, `ExitIntentPopup` as a single source of truth. No security concern; usage is appropriate.

---

## Score: **82 / 100**

- **Deductions:** Webhook query-param secret and lack of rate limiting (-8); no body size limit and validation error disclosure (-5); minor XSS defense-in-depth for FAQ schema (-3); fail-open rate limit and no CSRF noted as info (-2).
- **Strengths:** Solid validation and parsing pattern, no hardcoded secrets, production webhook checks, safe use of `contactId`, and consistent error handling.

---

## Recommended Actions (Priority Order)

1. **Webhook:** Add rate limiting to `POST` (and optionally `GET`) for `activecampaign-webhook` using `RATE_LIMITS.webhook` or a per-IP limit.
2. **Webhook:** In production, accept only `x-webhook-secret` header (or document and restrict query param to staging/AC compatibility).
3. **Webhook:** Return a generic “Invalid payload” (or similar) on validation failure; log full `validation.error` server-side only.
4. **parseJsonBody / API:** Introduce an optional max body size and return 413 when exceeded.
5. **FAQSection:** Sanitize or escape FAQ strings used in the JSON-LD schema before injecting into `dangerouslySetInnerHTML`, or render schema in a way that avoids raw HTML.
