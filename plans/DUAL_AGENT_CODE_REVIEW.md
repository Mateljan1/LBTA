# LBTA Website — Dual Agent Code Review

**Date:** March 6, 2026  
**Scope:** Security (API routes) + Performance (layout, config, pages)

---

## Security Sentinel Review

**Status:** WARNINGS

| Severity | Location | Issue | Recommendation |
|----------|----------|-------|----------------|
| High | `app/api/activecampaign-webhook/route.ts` | When `AC_WEBHOOK_SECRET` is unset, verification is skipped and any caller can trigger the webhook. Code does not check `NODE_ENV`. | Require `AC_WEBHOOK_SECRET` in production; reject with 503 if missing. Add `if (!AC_WEBHOOK_SECRET && process.env.NODE_ENV === 'production') return 503`. |
| High | `app/api/activecampaign-webhook/route.ts` | No rate limiting. Webhook can be spammed to exhaust ActiveCampaign API or trigger unintended automations. | Add `rateLimit(\`webhook:${ip}\`, RATE_LIMITS.webhook)` before processing. |
| Medium | `app/api/activecampaign-webhook/route.ts` | On error, returns `{ error: error.message }` in response body (with 200 status). Can leak internal details (e.g. connection errors, paths). | Return generic message: `{ error: 'Webhook processing failed' }`. Log full error server-side only. |
| Medium | `app/api/book/route.ts` | PII logged: `name`, `email`, `program` in `console.log` (lines 69–74, 102, 106, 121–126). | Remove PII from logs. Log only non-identifying fields (e.g. program, timestamp). |
| Medium | `app/api/register-program/route.ts` | PII logged: `email`, `contactId`, `program` in multiple `console.log` calls (lines 155–159, 184, 198–199, 204). | Remove PII from logs. Use non-identifying metadata only. |
| Medium | `app/api/jtt-registration/route.ts` | PII logged: `playerName`, `parentEmail` in `console.log` (lines 71–76, 186, 215–219). | Remove PII from logs. Log only division, timestamp, success flags. |
| Low | `app/api/activecampaign-webhook/route.ts` | Webhook payload not validated with Zod. `webhookPayloadSchema` exists in `lib/validations.ts` but is unused. | Validate payload with `webhookPayloadSchema` before processing to avoid malformed data and potential injection. |
| Low | `app/api/register-program/PERS_General_2025-12-16_route.ts` | Orphan file (invalid route name). Uses `process.env.NOTION_API_KEY` and `process.env.ACTIVECAMPAIGN_API_KEY` directly. | Remove or relocate to archive. If kept, use `getEnvVar()` and ensure it is never deployed as an active route. |
| Low | `app/api/activecampaign-webhook/PERS_General_2025-12-16_route.ts` | Same as above — orphan file with direct `process.env` usage. | Remove or archive. |

**Positive findings:**
- Rate limiting present on all form endpoints: `book`, `newsletter`, `register`, `register-program`, `register-year`, `scholarship`, `jtt-registration`
- Zod validation on all form endpoints
- ActiveCampaign webhook has secret verification when `AC_WEBHOOK_SECRET` is set
- No hardcoded API keys in active routes (use `getEnvVar` / `hasEnvVar`)
- Generic error messages in user-facing responses (no stack traces)
- JTT registration uses `escapeHtml` for email HTML generation (XSS protection)
- `lib/sanitize.ts` provides `escapeHtml`, `sanitizeForEmail`, `sanitizeUrl`

**Score: 72/100**

---

## Performance Oracle Review

**Status:** WARNINGS

| Severity | Location | Issue | Recommendation |
|----------|----------|-------|----------------|
| Medium | `app/schedules/PERS_General_2025-12-16_page.tsx` | AnalyticsDashboard and ComprehensiveFormTester are not gated by `NODE_ENV`. They render in production. | Add `process.env.NODE_ENV === 'development' &&` around both components (as in main `schedules/page.tsx`). Or remove this orphan page. |
| Low | `app/junior-trial/page.tsx` | Hero image uses `.jpg` (`/UPDATED LBTA PICS/junior-program-hero.jpg`) instead of WebP. | Prefer WebP/AVIF. Next.js will optimize, but source WebP reduces initial transfer. |
| Low | `components/layout/Header.tsx`, `components/layout/Footer.tsx` | Logo Images use fixed `width`/`height` but no `sizes`. | For fixed-size logos this is acceptable. Optional: add `sizes` for clarity (e.g. `sizes="120px"`). |
| Info | `app/racquet-rescue/page.tsx` | Second Image (line ~38) — verify `sizes` present. | Confirm all `fill` images have appropriate `sizes`. |

**Positive findings:**
- `optimizePackageImports` in `next.config.js` for `lucide-react` and `framer-motion`
- Image config: `formats: ['image/avif', 'image/webp']` — Next.js serves WebP/AVIF
- Hero/priority images have `sizes` (e.g. `100vw`, `(max-width: 1024px) 100vw, 50vw`)
- Main `schedules/page.tsx` gates AnalyticsDashboard and ComprehensiveFormTester with `process.env.NODE_ENV === 'development'`
- `removeConsole` in production via compiler config
- No obvious N+1 data fetching; data from JSON files
- Third-party scripts (Meta Pixel, GA) use `strategy="afterInteractive"`
- Fonts use `next/font` with `display: 'swap'`

**Score: 85/100**

---

## Summary

| Agent | Status | Score | Priority Actions |
|-------|--------|-------|------------------|
| Security Sentinel | WARNINGS | 72/100 | 1) Require webhook secret in prod; 2) Add webhook rate limit; 3) Remove PII from logs |
| Performance Oracle | WARNINGS | 85/100 | 1) Gate or remove PERS page debug components; 2) Prefer WebP for junior-trial hero |

---

## Recommended Next Steps

1. **Security:** Add rate limiting to `activecampaign-webhook`, require `AC_WEBHOOK_SECRET` in production, and remove PII from all API route logs.
2. **Security:** Sanitize webhook error responses — return generic message, log details server-side only.
3. **Performance:** Gate debug components on PERS page or remove the orphan file.
4. **Cleanup:** Remove or archive `PERS_General_2025-12-16_route.ts` and `PERS_General_2025-12-16_page.tsx` if no longer needed.
