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

4. The script creates a **draft** campaign in ActiveCampaign linked to list 4. Open the campaign URL it prints, then review, add preview text, send a test, and send or schedule.

## Unsubscribe link

Use `%UNSUBSCRIBELINK%` or `%UNSUBSCRIBE%` in the HTML; ActiveCampaign replaces it when sending.
