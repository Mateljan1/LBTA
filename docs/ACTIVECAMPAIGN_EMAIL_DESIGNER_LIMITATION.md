# ActiveCampaign Email Designer API Limitation

## API template messages: use `html`, not `htmlcontent`

For **template** messages created via `POST /api/3/messages`, the body must be sent in the **`html`** field. Sending only **`htmlcontent`** may return success but leaves **`html` empty** — no preview in the campaign list and nothing to send. All LBTA scripts use **`html`** for creates/updates.

## Legacy `message_edit` (editor mode + list)

After v3 create/update, run **legacy** `message_edit` with **`htmlconstructor=editor`**, full **`html`**, MIME **`text`**, and **`p[listId]`** (see `scripts/ac-legacy-message-edit.js` and `skills/activecampaign-email-marketing/scripts/ac_legacy_message.py`). Without this, the **Email Designer** can open **empty** even though `GET /messages` shows HTML.

**Repair an existing message:**

```bash
node scripts/sync-ac-message-html.js <messageId> assets/emails/.../your.html
```

## Send test email via API (reliable)

`POST /api/3/campaigns/{id}/test` often returns **405 Method Not Allowed**. Use the **legacy** endpoint instead ([ActiveCampaign `campaign_send`](https://www.activecampaign.com/api/example.php?call=campaign_send)):

- **GET** `{base}/admin/api.php?api_action=campaign_send&api_output=json&email=...&campaignid=...&messageid=...&type=mime&action=test`
- **Headers:** `Api-Token: {your API key}`
- Resolve **`messageid`** from `GET /api/3/campaigns/{id}/campaignMessages` (first row’s `messageid`).

Or run:

```bash
export ACTIVECAMPAIGN_API_KEY="your-key"
export ACTIVECAMPAIGN_URL="https://tennisbeast.api-us1.com"
python3 skills/activecampaign-email-marketing/scripts/send_test.py \
  --campaign-id 85 \
  --email andrew@lagunabeachtennisacademy.com
```

## In the ActiveCampaign UI

- **Campaign list thumbnail:** Drafts often show **“No Preview Available”** until you **send a test**, **schedule**, or **send** — sent campaigns get a generated screenshot. That does **not** mean the HTML is missing (verify with **Send test**).
- **Empty designer when you click Edit:** Use **Custom HTML** where the product offers it ([Help Center](https://help.activecampaign.com/hc/en-us/articles/115001398790-Use-the-Custom-HTML-campaign-builder)), or run **`sync-ac-message-html.js`** so content is registered as **editor** HTML.

## Issue

**Email Designer campaigns** (created in ActiveCampaign's visual email designer) store HTML content in a proprietary format that the API cannot update.

When you try to update `htmlcontent` via the API:
- The request succeeds (200/201)
- But the HTML content is **not saved**
- The `htmlcontent` field remains empty when retrieved

## Why This Happens

Email Designer campaigns have:
- `ed_instanceid` - Email Designer instance ID
- `ed_version` - Designer version
- HTML stored in ActiveCampaign's internal format (not raw HTML)

The API's `htmlcontent` field is **read-only** for Email Designer messages.

## Solutions

### Option 1: Manual Copy-Paste (Recommended)

1. **HTML is already in your clipboard** (from `./scripts/copy-email-html.sh`)
2. Open your campaign in ActiveCampaign (e.g. https://tennisbeast.activehosted.com/app/campaigns/)
3. Click **"Continue"** or **"Edit"**
4. Click the **HTML/code view icon** (`</>` or "Source" button)
5. **Select all** (Cmd+A / Ctrl+A)
6. **Paste** (Cmd+V / Ctrl+V) - your HTML is already in clipboard
7. **Save**

### Option 2: Create New API-Based Campaign

If you need API automation, create campaigns via API (not Email Designer):

```bash
python3 skills/activecampaign-email-marketing/scripts/create_campaign.py \
  --name "Spring 2026 Schedule - API" \
  --subject "Your Week at LBTA — Spring 2026 Full Schedule" \
  --template assets/emails/spring-2026/prospects/LBTA_Spring2026_Schedule_REFINED.html \
  --list "Laguna Beach Tennis Academy"
```

API-created campaigns can be updated via API.

### Option 3: Use Copy Script

```bash
./scripts/copy-email-html.sh assets/emails/spring-2026/prospects/LBTA_Spring2026_Schedule_REFINED.html
```

This copies the HTML to your clipboard for easy pasting.

## Visible `]]>` on Mobile

If `]]>` appears between header and hero (or elsewhere) in the rendered email, it comes from **AC's campaign template** wrapping content in CDATA. Fix:

1. Create a **new campaign** with **HTML builder** (not Email Designer): Campaigns → Create → Design: choose "HTML builder" → Start from Scratch → paste full HTML.
2. Or **manual paste** into the existing campaign's HTML/code view (replace all).
3. The sync script (`sync-ac-message-html.js`) applies prep: strips BOM, removes `]]>`, moves `<style>` into `<body>`. Use `LBTA_Spring2026_Schedule_SEND_READY.html` for manual paste.

See `docs/AC_SPRING2026_SEND_CHECKLIST.md` for the full checklist.

## Detection

The `update_campaign.py` script now detects Email Designer campaigns and provides clear error messages with manual steps.
