# Spring 2026 Schedule Email — AC Send Checklist

**Subject:** TEST: Your Week at LBTA — Spring 2026 Full Schedule  
**Campaign:** Spring 2026 Schedule (message 256, campaign 85)  
**Source:** `assets/emails/spring-2026/prospects/LBTA_Spring2026_Schedule_REFINED.html`

---

## 1. Sync HTML to ActiveCampaign

```bash
node scripts/sync-ac-message-html.js 256 assets/emails/spring-2026/prospects/LBTA_Spring2026_Schedule_REFINED.html
```

The sync script automatically:
- Strips BOM and any `]]>` sequences
- Moves `<style>` into `<body>` (avoids AC parsing artifacts on mobile)

---

## 2. If `]]>` Still Appears on Mobile

The `]]>` artifact is caused by **ActiveCampaign’s campaign template** wrapping content in CDATA. The fix:

### Option A: Use HTML Builder (new campaign)

1. **Campaigns** → **Create Campaign**
2. Name it (e.g. “Spring 2026 Schedule — HTML”)
3. At **Design**, choose **HTML builder** (not Email Designer)
4. **Start from Scratch**
5. Paste the full HTML from `LBTA_Spring2026_Schedule_SEND_READY.html` (or copy via `./scripts/copy-email-html.sh`)
6. Complete sender details and save

### Option B: Manual paste into existing campaign

1. Run: `./scripts/copy-email-html.sh assets/emails/spring-2026/prospects/LBTA_Spring2026_Schedule_SEND_READY.html`
2. Open the campaign in AC
3. **Edit** → switch to **HTML / code view** (`</>` icon)
4. Select all (Cmd+A) → Paste (Cmd+V) → **Save**

---

## 3. Pre-Send Audit

| Check | Status |
|-------|--------|
| Send test to yourself | |
| Open on **mobile** (iPhone/Android) — no `]]>` visible | |
| Links: schedules, City portal, book, LBTA app | |
| Merge tags: `%UNSUBSCRIBELINK%`, `%MANAGEPREFERENCES%` in footer | |
| Images load (LBTA logo, City logo, footer logo) | |
| Subject line correct | |

---

## 4. Send

- **Send test** first
- Confirm mobile preview is clean
- Schedule or **Send now**

---

## Files

- `LBTA_Spring2026_Schedule_REFINED.html` — source (sync applies prep)
- `LBTA_Spring2026_Schedule_SEND_READY.html` — prepped (style in body, no BOM) — use for manual paste
- `scripts/prep-email-for-ac.js` — standalone prep script
- `scripts/sync-ac-message-html.js` — sync to AC message 256
