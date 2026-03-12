# Compound Review Summary — AC/GHL Integration (2026-03-10)

## Question
Are ActiveCampaign and GoHighLevel working?

---

## 1. Operational status (env)

**Local (`npm run lead`):**
- **ActiveCampaign:** `ACTIVECAMPAIGN_URL` missing, `ACTIVECAMPAIGN_API_KEY` set → AC block is **skipped** locally (hasEnvVar gates prevent calls).
- **GoHighLevel:** `GHL_API_KEY` and `GHL_LOCATION_ID` set, `GHL_WORKFLOW_ID` missing → **GHL is not configured** locally (`isGHLConfigured()` requires all three).

**Production (Vercel):**  
For AC and GHL to work in production you must set in Vercel:

- **ActiveCampaign (required for lead flow):** `ACTIVECAMPAIGN_URL`, `ACTIVECAMPAIGN_API_KEY`
- **GoHighLevel (optional):** `GHL_API_KEY`, `GHL_LOCATION_ID`, `GHL_WORKFLOW_ID` (all three for contact + workflow)

If these are set on Vercel, the code will use them. To confirm: run `npm run lead` in a context where Vercel env is available, or check Vercel → Project → Settings → Environment Variables.

---

## 2. Code review synthesis

### Overall: **PASS with minor warnings**

| Agent              | Status   | Notes |
|--------------------|----------|--------|
| Security Sentinel  | WARNINGS | Two low items: AC error logging (fixed by pattern agent); webhook logs program/level field values (optional: redact in prod). |
| Pattern Recognizer | PASS     | optional-dual-write, env gates, external-api-error-log-safe (AC aligned with GHL), webhook ID + timing-safe secret. **Change applied:** `lib/activecampaign.ts` — production logs status only; non-prod logs status + body truncated to 100 chars. |
| Simplicity         | WARNINGS | Duplicate tag definitions (book PROGRAM_TAGS vs lib CLASS_TAGS; private-lessons 80 vs 48). Unused `category` / `getProgramCategory` in book/route. |

### Critical issues (must fix)
- None.

### Warnings (should fix)
1. **lib/activecampaign.ts** — Already updated: production logs only status; dev logs status + truncated body (100 chars). No further change required for this finding.
2. **book/route.ts** — Remove unused `category` and `getProgramCategory(body.program)`; consider single source for trial/program tag IDs (e.g. from lib/activecampaign) so PROGRAM_TAGS and CLASS_TAGS don’t diverge (e.g. private-lessons 80 vs 48).
3. **activecampaign-webhook** — Optionally avoid logging program/level field values in production; log only tag IDs if desired.

### Patterns confirmed
- AC only when `ACTIVECAMPAIGN_URL` and `ACTIVECAMPAIGN_API_KEY` are set.
- GHL only when all of `GHL_API_KEY`, `GHL_LOCATION_ID`, `GHL_WORKFLOW_ID` are set.
- AC failures don’t change API response; GHL and storeLead are fire-and-forget.
- Webhook: contactId validated as positive integer; secret compared with `crypto.timingSafeEqual`.

---

## 3. Are AC and GHL “working”?

- **Code:** Yes. Env gates, error handling, and optional dual-write are correct. Webhook auth and ID validation are in place. AC error logging now matches the safe-logging pattern.
- **Locally:** AC and GHL are effectively off (missing `ACTIVECAMPAIGN_URL` and `GHL_WORKFLOW_ID`), by design.
- **Production:** They work if and only if the required env vars are set in Vercel. Use Vercel env settings (or a script that has access to them) and `npm run lead` to verify.

---

## 4. Recommended next steps

1. **Production:** Ensure Vercel has `ACTIVECAMPAIGN_URL` and `ACTIVECAMPAIGN_API_KEY`; optionally all three GHL vars if you want SMS workflow.
2. **Cleanup:** Remove unused `category` / `getProgramCategory` from `app/api/book/route.ts`; consider unifying trial/program tag IDs in `lib/activecampaign.ts` and using them in book (and optionally register-year) to avoid drift.
