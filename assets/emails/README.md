# LBTA Email Assets

One-off and seasonal campaign HTML lives here. Single source of truth before pushing to ActiveCampaign.

## Spring 2026

- **File:** `lbta-spring-2026.html`
- **Plan:** [plans/lbta-spring-2026-email-activecampaign-plan.md](../plans/lbta-spring-2026-email-activecampaign-plan.md)
- **Send to:** List 4 (LBTA master list) in ActiveCampaign

### Create the campaign in ActiveCampaign (using your API connection)

1. **Set credentials** (one of):
   - Create `.env.local` in the project root with:
     ```
     ACTIVECAMPAIGN_URL=https://tennisbeast.api-us1.com
     ACTIVECAMPAIGN_API_KEY=your_api_key
     ```
   - Or export in the shell: `export ACTIVECAMPAIGN_URL=... ACTIVECAMPAIGN_API_KEY=...`

2. **Put your full Spring 2026 HTML** in `lbta-spring-2026.html` (replace the placeholder). Fix the footer: remove any stray text after the Unsubscribe link so the line is just `<a href="%UNSUBSCRIBELINK%">Unsubscribe</a>`.

3. **Run:**
   ```bash
   npm run create:spring-campaign
   ```
   Or: `node scripts/create-ac-campaign.js assets/emails/lbta-spring-2026.html`

4. The script creates a **draft** campaign in ActiveCampaign linked to list 4. It runs **legacy `message_edit`** so the HTML opens in the designer (not an empty canvas). Open the campaign URL it prints, then review, send a test, and send or schedule.

   **If an older campaign still shows a blank designer or “No Preview” in the list**, re-sync HTML to the message ID:

   ```bash
   node scripts/sync-ac-message-html.js <messageId> assets/emails/spring-2026/prospects/LBTA_Spring2026_Schedule_REFINED.html
   ```

   See `docs/ACTIVECAMPAIGN_EMAIL_DESIGNER_LIMITATION.md` for why list thumbnails may stay generic until send.

### Update an existing campaign’s HTML (API)

Use when the campaign already exists (e.g. built in the email designer) and you only need to replace the HTML body. The API persists **`html`** (not `htmlcontent`) for template messages.

1. Same `.env.local` as above (`ACTIVECAMPAIGN_URL`, `ACTIVECAMPAIGN_API_KEY`).
2. Run (example — **Spring 2026 full schedule** draft):
   ```bash
   python3 skills/activecampaign-email-marketing/scripts/update_campaign.py \
     --campaign-id 79 \
     --template assets/emails/spring-2026/prospects/LBTA_Spring2026_Schedule_REFINED.html
   ```
   Or match by **exact** campaign name (watch em-dash `—` vs hyphen `-`):
   ```bash
   python3 skills/activecampaign-email-marketing/scripts/update_campaign.py \
     --campaign-name "Spring 2026 — Full Schedule (Updated)" \
     --template assets/emails/spring-2026/prospects/LBTA_Spring2026_Schedule_REFINED.html
   ```

## Unsubscribe link

Use `%UNSUBSCRIBELINK%` or `%UNSUBSCRIBE%` in the HTML; ActiveCampaign replaces it when sending.
