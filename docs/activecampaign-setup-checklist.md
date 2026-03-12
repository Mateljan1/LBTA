# ActiveCampaign Setup — One Automation (Client + Internal Email)

**Purpose:** One automation in ActiveCampaign that (1) sends the right **client** confirmation email (trial / JTT / scholarship / welcome) and (2) sends an **internal** email to your team so you’re notified on every signup.

**Reference:** List and tag IDs are in `lib/activecampaign.ts`. No code changes needed — only configure this in the AC UI.

---

## IDs (from code — do not change)

| Item | ID | Notes |
|------|-----|--------|
| **LBTA Master List** | **4** | All signups go here. |
| **Tag: Trial Request** | **82** | Trial / book requests. |
| **Tag: Website/Newsletter** | **33** | Newsletter, general website signup. |
| **Tag: JTT Spring 2026** | **107** | JTT registrations. |
| **Tag: Scholarship** | **108** | Scholarship applications. |

---

## One automation: “LBTA Confirmations”

Build **one** automation in ActiveCampaign that handles both client and internal email.

### Triggers (any of these)

- Contact is **added to list ID 4**, or  
- Contact **receives tag 82** (Trial), **107** (JTT), **108** (Scholarship), or **33** (Website/Newsletter).

Add all of the above as triggers so the automation runs for every relevant signup.

### Step 1 — Client email (conditional)

Add a **conditional** action that sends the right email **to the contact**:

- **If** contact has tag **82** → Send **Trial confirmation** email (“We received your trial request…”).
- **Else if** contact has tag **107** → Send **JTT confirmation** email.
- **Else if** contact has tag **108** → Send **Scholarship received** email (“We received your scholarship application…”).
- **Else** → Send **Welcome / Newsletter** email (for list add or tag 33 only).

Use AC’s “If/else” or “Condition” node to check contact tags, then send the matching email.

### Step 2 — Internal notification (email to you)

Right after the client email step, add a second action:

- **Send email** to your internal address (e.g. `support@lagunabeachtennisacademy.com` or a dedicated leads inbox).
- **Subject:** e.g. “New LBTA signup: {{contact.email}}”.
- **Body:** Short summary — contact email, first name, last name, and which type (trial / JTT / scholarship / newsletter) so you can follow up. You can use AC merge tags like `%EMAIL%`, `%FIRSTNAME%`, `%LASTNAME%` and a note like “New trial request” or “New newsletter signup” based on the same tag conditions.

This way you get one internal email per signup without a second automation.

---

## Checklist — In ActiveCampaign

- [ ] Create one automation named **“LBTA Confirmations”**.
- [ ] Add triggers: **List 4** (contact added) and **Tags 82, 107, 108, 33** (contact receives tag).
- [ ] Add **Step 1:** Conditional send to **contact** (trial / JTT / scholarship / welcome by tag).
- [ ] Add **Step 2:** Send email to **internal address** with signup summary.
- [ ] Create the four client emails (trial, JTT, scholarship, welcome) if you haven’t already.
- [ ] Save and turn the automation **on**.

---

## After setup

- Every form submission that adds a contact to List 4 or applies one of these tags will trigger the automation.
- The **client** gets the right confirmation email; **you** get an internal email. No code or ID changes required.

---

## Optional: Four separate automations

If you prefer one automation per trigger (easier to tweak individually), you can still use the same IDs:

1. **List 4** → send welcome email to contact + internal summary to you.
2. **Tag 82** → send trial confirmation to contact + internal.
3. **Tag 107** → send JTT confirmation to contact + internal.
4. **Tag 108** → send scholarship received to contact + internal.

The single-automation approach above is simpler to maintain.
