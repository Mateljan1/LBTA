# GHL lead delivery (email + SMS) — setup

Website forms use **GoHighLevel only** when `GHL_API_KEY` (or `GHL_PIT_TOKEN`), `GHL_LOCATION_ID`, and `GHL_WORKFLOW_ID` are set in Vercel. Postmark staff/customer emails are skipped in that mode.

## 1. Rotate the GHL API key (required if canary shows `Invalid JWT`)

1. Log in to [GoHighLevel](https://app.gohighlevel.com/) → **Settings** → **Private Integrations** (or Location API key).
2. Create a new key with scopes: **contacts**, **workflows**, **locations** (read).
3. Vercel → **`laguna-beach-tennis-academy`** → **Environment Variables** → set **`GHL_API_KEY`** to the **LBTA Private Integration Token** from 1Password (`Gohighlevel · Lbta · GHL_PIT_TOKEN`). Do **not** use the legacy JWT or `rest.gohighlevel.com` key.
4. **Remove** `GHL_API_BASE` if present (must not point at `https://rest.gohighlevel.com/v1` — contacts API uses `services.leadconnectorhq.com` only).
5. **Redeploy** production.
6. Verify: `GET https://lagunabeachtennisacademy.com/api/cron/leads-canary` with `Authorization: Bearer $CRON_SECRET` → `ghl-token` step **ok**.
7. Optional probe: `GET .../api/cron/backfill-ghl?probe=1` (same auth) → `workflowEnrolled: true` for a known contact.

## 2. Workflow must send email + SMS + notify you

Open workflow ID `0a594eb1-742f-4484-b49c-289b907b950d` (or your `GHL_WORKFLOW_ID`) and ensure it is **Published** with:

1. Trigger: **Contact added to workflow**
2. **Send SMS** to contact (thank-you / we’ll call you)
3. **Send Email** to contact (confirmation)
4. **Internal Notification** (or assign to pipeline) so your team gets pinged

## 3. Backfill April–May website leads

After the key works:

```bash
curl -X POST 'https://lagunabeachtennisacademy.com/api/cron/backfill-ghl' \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

Dry run first: add `?dryRun=1`.

Manual fallback: import `docs/ghl-import-apr-may-2026.csv` in GHL → Contacts → Import, then bulk-add tag **Backfill Apr-May 2026** to your workflow.

## 4. New form submissions

Every book/newsletter/register call runs `sendToGHL()` → contact + workflow → GHL sends SMS + email per workflow steps.
