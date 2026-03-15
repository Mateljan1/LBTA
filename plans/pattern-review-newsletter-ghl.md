# Pattern Consistency Review: Newsletter + GHL

**Scope:** Newsletter route AC gate & flow order; GHL logging vs `externalApiErrorLogSafe`; dual-write order and env-gate consistency.

---

## Status

**PASS with one consistency finding.** Newsletter flow and GHL logging match the requested patterns; one behavioral inconsistency (newsletter returns 500 on AC failure while other form routes continue and return 200).

---

## Findings

| # | Area | Finding | Severity | Location |
|---|------|---------|----------|----------|
| 1 | Newsletter – AC gate | AC is gated with `hasEnvVar('ACTIVECAMPAIGN_URL') && hasEnvVar('ACTIVECAMPAIGN_API_KEY')`. Same as book, register-program, scholarship. | OK | `app/api/newsletter/route.ts:44-45` |
| 2 | Newsletter – flow order | Order is: validate → (AC if configured) → sendToGHL → storeLead → return 200. Matches other form routes. | OK | `app/api/newsletter/route.ts:33-71` |
| 3 | Newsletter – AC failure behavior | When AC is configured, newsletter returns 500 if upsert fails or `!result.data?.id`. book, register-program, scholarship, jtt-registration all wrap AC in try/catch and continue (log only, then sendToGHL → storeLead → 200). Pattern `optional-dual-write-after-primary` and peer routes imply “on failure log only, never change API response.” | **Consistency** | `app/api/newsletter/route.ts:51-56` |
| 4 | GHL – production logs | On API error, production logs only status: `console.error('[GHL] Create contact failed:', res.status)` and same for add-to-workflow. No response body in prod. | OK | `lib/gohighlevel.ts:49-51`, `79-81` |
| 5 | GHL – dev logs | In non-production, body is read and truncated: `text.length > 100 ? text.slice(0,100)+'…' : text`. Matches quality bar and pattern. | OK | `lib/gohighlevel.ts:52-55`, `82-85` |
| 6 | Dual-write order | All form routes that dual-write use: validate → primary (AC/Notion) → sendToGHL (void) → storeLead (void) → return 200. No regressions. | OK | newsletter, book, register-program, scholarship, jtt-registration |
| 7 | Env-gate consistency | Newsletter uses same AC gate as book, register-program, scholarship (both ACTIVECAMPAIGN_URL and ACTIVECAMPAIGN_API_KEY). GHL uses hasEnvVar for GHL_API_KEY, GHL_LOCATION_ID, GHL_WORKFLOW_ID. | OK | All relevant routes + `lib/gohighlevel.ts` |

---

## Summary

- **Newsletter:** AC is correctly gated with `hasEnvVar` and the flow order (validate → AC → sendToGHL → storeLead → 200) matches other form routes. The only inconsistency is that newsletter returns 500 when AC upsert fails, while book, register-program, scholarship, and jtt-registration continue and return 200. Align by wrapping the AC block in try/catch, logging on failure, and still calling sendToGHL and storeLead so behavior matches the “optional dual-write; on failure log only” pattern.
- **GHL:** Production logs only status on API errors; dev keeps a truncated body (≤100 chars). Aligns with `externalApiErrorLogSafe` (quality-bars.json) and `external-api-error-log-truncate` (patterns.json). No changes needed.
- **Dual-write order and env-gates:** Consistent across routes; no regressions identified.

**Recommendation:** In `app/api/newsletter/route.ts`, wrap the AC block (lines 45–65) in try/catch; on failure log with `console.error('[newsletter] ActiveCampaign ...', err)` and do not return 500. Then always run `void sendToGHL(...)` and `void storeLead(...)` and return 200 so newsletter matches the other form routes.
