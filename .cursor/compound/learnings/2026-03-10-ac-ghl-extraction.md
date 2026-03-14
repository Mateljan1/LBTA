# Compound learn extraction — 2026-03-10 (AC + GHL SMS)

## Source
- Simplified AC + GHL SMS implementation (plan: `plans/simplified-ac-plus-ghl-sms-plan.md`)
- Security/pattern/simplicity review findings: log full GHL error body (PII risk), doc wording "create" vs "create/find"

## Added

### corrections.jsonl
- **Logging full third-party API error response body** → Truncate (e.g. `text.slice(0, 100) + '…'`) or log status only; full body may contain PII.

### anti-patterns.json
- **log-full-external-api-error-body:** When a third-party API returns an error, do not log full `res.text()`; truncate or log status only to avoid PII in logs.

### patterns.json
- **optional-dual-write-after-primary:** When adding optional integration (e.g. GHL) after primary (e.g. AC): env-gate, `void sendToGHL(payload)` with same validated payload, log-only on failure, never change API response.
- **external-api-error-log-truncate:** When logging third-party API errors, truncate response body (e.g. 100 chars) or log status only.

### quality-bars.json
- **externalApiErrorLogSafe:** When logging third-party API errors, do not log full response body; truncate or status only (should).

## Session summary
- **Work:** One AC automation (client + internal email), optional GHL module (`lib/gohighlevel.ts`), dual-write from six form APIs; docs: AC checklist, GHL checklist, registration-flows-and-ops.
- **Review:** Security (truncate GHL error logs), pattern (dual-write order), simplicity (doc "create" not "create/find").
- **Applied:** GHL error logging truncated to 100 chars; comments/docs updated for "create" behavior.
