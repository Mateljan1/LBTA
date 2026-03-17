# LBTA Spring 2026 Email — ActiveCampaign Setup Plan

## Overview

Get the **LBTA Spring 2026** HTML email into ActiveCampaign and send it to the full list (everyone). This plan uses the compound-engineering workflow: one source of truth for the email in the repo, then either the existing script or manual AC steps to create and send the campaign.

## Problem Statement

- You have a complete, on-brand HTML email for Spring 2026 (schedule by location, free trial banner, coach tip, pricing, private coaching, USTA/UTR, registration instructions).
- It needs to be sent to everyone in ActiveCampaign (LBTA master list = List ID **4**).
- The email is currently only in this conversation; it should be stored in the repo and then pushed into AC so you can send (or schedule) from one place.

## Proposed Solution

1. **Store the email in the repo** — Save the HTML as a versioned asset and fix one footer typo.
2. **Create the campaign in ActiveCampaign** — Either run the existing `create_campaign.py` script (creates draft in AC) or create the campaign manually in the AC UI and paste the HTML.
3. **Set subject, from, and list** — Use a clear subject line and send to the list that corresponds to List 4 (LBTA master list).
4. **Test then send** — Send a test email, then schedule or send to the full list.

---

## Implementation Steps

### Phase 1: Asset and copy cleanup

- [ ] **1.1** Create `assets/emails/` (if it doesn’t exist) and save the Spring 2026 HTML as `assets/emails/lbta-spring-2026.html`.
- [ ] **1.2** Fix the footer line: remove the stray “&nbsp;& now” and the phrase “/compound-engineering plan this so you can set this all up for us to send to everyone in active campaign” so the unsubscribe line is only:  
  `Unsubscribe` (link with `%UNSUBSCRIBELINK%`).
- [ ] **1.3** Confirm all links in the HTML are correct (schedules, rec1.com, app store, contact, unsubscribe). No code changes required if links are already correct.

### Phase 2: ActiveCampaign campaign creation

**Option A — Script (recommended if you have API access)**

- [ ] **2A.1** Ensure `ACTIVECAMPAIGN_URL` and `ACTIVECAMPAIGN_API_KEY` are set (e.g. in `.env` or shell).
- [ ] **2A.2** Confirm the **list name** in ActiveCampaign for List ID 4 (e.g. “LBTA”, “LBTA Master”, “Laguna Beach Tennis Academy”). The script uses list **name**, not ID. If the name differs, update the `--list` argument below.
- [ ] **2A.3** Run:
  ```bash
  python skills/activecampaign-email-marketing/scripts/create_campaign.py \
    --name "LBTA Spring 2026" \
    --subject "Your Week at LBTA — Spring 2026 Schedule & Registration" \
    --template assets/emails/lbta-spring-2026.html \
    --list "LBTA"
  ```
  (Replace `"LBTA"` with the exact list name from AC if different.)
- [ ] **2A.4** Do **not** use `--send-now` on first run; create a **draft**, then in AC: add preview text, send test, then schedule or send.

**Option B — Manual in ActiveCampaign**

- [ ] **2B.1** In ActiveCampaign: **Campaigns** → **Create** → **Standard campaign** (or “Email”).
- [ ] **2B.2** Set **From name**: “Laguna Beach Tennis Academy”; **From email**: e.g. `support@lagunabeachtennisacademy.com`; **Reply-to**: same.
- [ ] **2B.3** Set **Subject**: e.g. “Your Week at LBTA — Spring 2026 Schedule & Registration”.
- [ ] **2B.4** Switch to **HTML** / **Source** and paste the full contents of `assets/emails/lbta-spring-2026.html`.
- [ ] **2B.5** Set **Preview text** (optional): e.g. “April 6 – June 13 · 3 locations · Free trial on all group classes.”
- [ ] **2B.6** Choose **List**: the list that is your “everyone” list (List ID 4 in your setup — e.g. “LBTA” or “LBTA Master”).
- [ ] **2B.7** Save as draft; send a test to yourself; then schedule or send.

### Phase 3: Test and send

- [ ] **3.1** Send a **test email** to yourself (and optionally another inbox) and check: rendering (Gmail, Apple Mail, Outlook), images (AC-hosted URLs), all CTAs and links.
- [ ] **3.2** Confirm **Unsubscribe** link works (AC will replace `%UNSUBSCRIBELINK%` when sending).
- [ ] **3.3** When satisfied: **Schedule** or **Send** to the selected list (everyone on List 4).

---

## Files to Create/Modify

| File | Action | Purpose |
|------|--------|--------|
| `assets/emails/lbta-spring-2026.html` | Create | Single source of truth for Spring 2026 email HTML (footer fixed). |
| `plans/lbta-spring-2026-email-activecampaign-plan.md` | Create | This plan. |

No changes to `lib/activecampaign.ts` or API routes are required; this is a one-off campaign, not an automation.

---

## Success Criteria

- [ ] Spring 2026 HTML lives in `assets/emails/lbta-spring-2026.html` with corrected footer.
- [ ] A campaign exists in ActiveCampaign (draft or sent) with that HTML, correct subject/from/list.
- [ ] Test email received and rendering/links verified.
- [ ] Campaign sent (or scheduled) to “everyone” (List 4 / LBTA master list).

---

## Research Sources

- In-repo: `lib/activecampaign.ts` (List ID 4, no campaign API).
- In-repo: `skills/activecampaign-email-marketing/scripts/create_campaign.py` (creates message + campaign via AC API v3).
- In-repo: `docs/activecampaign-setup-checklist.md` (automations; list/tag IDs).
- External: [ActiveCampaign API – Create message](https://developers.activecampaign.com/reference/create-a-new-message), [Create campaign](https://developers.activecampaign.com/reference/create-campaign).

---

## Relevant Learnings

- **Single source of truth:** Email HTML in repo; AC holds the sent campaign. Edits to the email should be made in `assets/emails/lbta-spring-2026.html` and re-pasted or re-run via script if you need to resend or clone.
- **List name vs ID:** `create_campaign.py` uses list **name**; your code uses List ID **4**. Confirm the list name in AC (Settings → Lists) and use that exact name in `--list`.
- **Unsubscribe:** AC expects `%UNSUBSCRIBELINK%` in the HTML; it is replaced on send. Do not remove it.

---

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| List name in AC doesn’t match script | Check AC → Lists for the name of list ID 4; use that in `--list` or extend script to accept `--list-id 4`. |
| Images 404 (hosted on AC) | Your HTML already uses `tennisbeast.activehosted.com` URLs; ensure those assets remain in AC media library. |
| Send to wrong list | In AC, double-check the list selected for the campaign (should be “everyone” / List 4). |

---

## Next Step

Run **Phase 1** (save HTML + fix footer), then **Phase 2** (Option A or B), then **Phase 3** (test and send). If you want the script to support list ID as well as name, that can be added in a small follow-up.

---

## Footer fix (one-time)

Before creating the campaign, ensure the unsubscribe line in the HTML contains only the link—no extra text. **Find and replace** in your HTML:

- **Find:** `Unsubscribe</a> &nbsp;& now /compound-engineering plan this so you can set this all up for us to send to everyone in active campaign`
- **Replace with:** `Unsubscribe</a>`

So the paragraph reads: `<a href="%UNSUBSCRIBELINK%" ...>Unsubscribe</a>` and nothing else after it in that paragraph.
