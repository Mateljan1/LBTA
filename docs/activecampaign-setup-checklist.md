# ActiveCampaign Setup — One Automation Only (Website Signup Confirmation)

**Purpose:** Only one automation in ActiveCampaign: when someone **signs up on the website** (trial, newsletter, program, JTT, scholarship, year registration), they get the right **confirmation email** and you get an **internal notification**. No other automations. Contacts you add or tag from elsewhere (e.g. sync from receipts/sheets) must **not** trigger any automation.

**Reference:** List and tag IDs are in `lib/activecampaign.ts`. The site uses an optional **Website Signups** list so the automation triggers only for website submissions.

---

## 1. Remove all automations except the one confirmation

- In ActiveCampaign: **Automations** → open each automation.
- **Turn off or delete** every automation except the single one that sends the website signup confirmation (client email + internal email).
- Do **not** use triggers like “Contact receives tag” or “Contact added to List 4” for that automation (see below). Otherwise, when you tag or add contacts from sync/import, they would get confirmation emails too.

---

## 2. One list used only by the website (recommended)

So that **only** website signups trigger the confirmation automation:

1. In AC, create a new list, e.g. **“LBTA Website Signups”**.
2. Note its **List ID** (e.g. 5 or whatever AC assigns).
3. In **Vercel** → Project → **Settings → Environment Variables**, add:
   - **Name:** `ACTIVECAMPAIGN_WEBSITE_SIGNUPS_LIST_ID`
   - **Value:** that List ID (e.g. `5`)
   - **Environment:** Production (and Preview if you test there).
4. Redeploy so the env var is applied.

The website (book, newsletter, register-program, register-year, JTT, scholarship) will:
- Add the contact to **List 4** (LBTA Master) and, when this env var is set, also to **LBTA Website Signups**.
- Apply tags as before (trial, newsletter, JTT, scholarship, program tags).

**If you do not set this env var:** The site only adds contacts to List 4 and applies tags. In that case, your single automation would have to trigger on “Contact added to List 4” (or tags), and **you must not add contacts to List 4 or apply those tags from any other source** (sync, import, etc.), or they will get confirmation emails too.

---

## 3. Single automation: “LBTA Confirmations” (website signup only)

Build **one** automation that runs **only** when someone signs up on the website.

### Trigger (use only this)

- **Contact is added to list [LBTA Website Signups]**  
  Use the list you created in step 2. Do **not** add triggers for List 4 or for tags 82, 33, 107, 108. That way, only website form submissions (which add to the Website Signups list) trigger the automation.

### Step 1 — Client email (conditional)

Send the right confirmation **to the contact** based on how they signed up:

- **If** contact has tag **82** (Trial Request) → Send **Trial confirmation** email.
- **Else if** contact has tag **107** (JTT Spring 2026) → Send **JTT confirmation** email.
- **Else if** contact has tag **108** (Scholarship) → Send **Scholarship received** email.
- **Else** → Send **Welcome / Newsletter** email (e.g. newsletter or general website signup).

Use AC’s condition node to check contact tags, then send the matching email.

### Step 2 — Internal notification

- **Send email** to your internal address (e.g. `support@lagunabeachtennisacademy.com`).
- **Subject:** e.g. “New LBTA signup: {{contact.email}}”.
- **Body:** Short summary (email, first name, last name, signup type) using AC merge tags.

Save and turn the automation **on**.

---

## 4. IDs (from code — do not change)

| Item | ID | Notes |
|------|-----|--------|
| **LBTA Master List** | **4** | All contacts (website + any sync) go here for segmentation. |
| **LBTA Website Signups list** | Set in env | Optional; when set, only website adds to this list → only they get the confirmation automation. |
| **Tag: Trial Request** | **82** | Trial / book requests. |
| **Tag: Website/Newsletter** | **33** | Newsletter, general website signup. |
| **Tag: JTT Spring 2026** | **107** | JTT registrations. |
| **Tag: Scholarship** | **108** | Scholarship applications. |

---

## 5. Checklist — In ActiveCampaign

- [ ] **Turn off or delete** every automation except the one confirmation automation.
- [ ] Create list **“LBTA Website Signups”** and note its ID.
- [ ] Set **ACTIVECAMPAIGN_WEBSITE_SIGNUPS_LIST_ID** in Vercel to that ID; redeploy.
- [ ] In the **one** automation (“LBTA Confirmations”):
  - [ ] **Trigger:** Contact added to **LBTA Website Signups** list only (no List 4, no tag triggers).
  - [ ] **Step 1:** Conditional send to contact (trial / JTT / scholarship / welcome by tag).
  - [ ] **Step 2:** Send internal notification email to your team.
- [ ] Create the four client emails in AC if needed (trial, JTT, scholarship, welcome).
- [ ] Save and turn the automation **on**.

---

## 6. After setup

- Only **website** form submissions add contacts to the Website Signups list → only they trigger the confirmation automation.
- When you add or tag contacts from **other sources** (sync, import, receipts, sheets): add them only to **List 4** and apply program/source tags. Do **not** add them to the Website Signups list. They will **not** receive the signup confirmation or trigger that automation.
