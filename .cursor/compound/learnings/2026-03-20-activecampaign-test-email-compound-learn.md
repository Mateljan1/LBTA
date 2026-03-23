# Compound learn: ActiveCampaign test email fix (2026-03-20)

**Context:** Week 3 email added to ActiveCampaign; send test was failing. v3 `POST /api/3/campaigns/{id}/test` returned 405. Switched to legacy `campaign_send` API and updated `send_test.py` and docs.

## What was done

- **Root cause:** ActiveCampaign v3 endpoint `POST /campaigns/{id}/test` returns 405 on many accounts (unreliable).
- **Solution:** Use legacy admin API: `GET /admin/api.php?api_action=campaign_send` with `campaignid`, `messageid`, `action=test`, `email`, `type=mime`.
- **Implementation:** `send_test.py` now resolves `messageid` from `GET /api/3/campaigns/{id}/campaignMessages`, then calls legacy `campaign_send`. Supports both `ACTIVECAMPAIGN_*` and `AC_*` env vars.
- **Docs:** `docs/ACTIVECAMPAIGN_EMAIL_DESIGNER_LIMITATION.md` updated with section on sending test emails via legacy API.

## Corrections (extracted)

1. **Using POST /api/3/campaigns/{id}/test for ActiveCampaign test emails**  
   → Use legacy GET `/admin/api.php?api_action=campaign_send` with `campaignid`, `messageid` (from `campaignMessages`), `action=test`, `email`, `type=mime`. v3 endpoint returns 405 on many accounts.

## Patterns (extracted)

1. **ActiveCampaign legacy API fallback**  
   **When:** AC v3 API returns 405 or fails for campaign operations (e.g. send test).  
   **Example:** Use legacy admin API; resolve `messageid` from `GET /api/3/campaigns/{id}/campaignMessages`. See `send_test.py` and `docs/ACTIVECAMPAIGN_EMAIL_DESIGNER_LIMITATION.md`.

## Prevention

- Future AC integrations: check legacy API docs (e.g. [campaign_send](https://www.activecampaign.com/api/example.php?call=campaign_send)) when v3 fails.
- `send_test.py` documents the flow; scripts and docs are canonical for sending test emails.

## Files touched

| File | Change |
|------|--------|
| `skills/activecampaign-email-marketing/scripts/send_test.py` | Legacy `campaign_send`, resolve `messageid` from `campaignMessages` |
| `docs/ACTIVECAMPAIGN_EMAIL_DESIGNER_LIMITATION.md` | Section on test email via legacy API |
| `.cursor/compound/learnings/corrections.jsonl` | +1 correction |
| `.cursor/compound/learnings/patterns.json` | +1 pattern |
