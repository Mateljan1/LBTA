# Where to See ActiveCampaign & GHL Emails (and a Visual Reference)

**Purpose:** The confirmation emails and SMS are built and stored **inside ActiveCampaign and GoHighLevel**, not in this codebase. This doc tells you exactly where to see them and how to preview them. It also points you to a visual reference in the repo.

---

## 1. ActiveCampaign — where to see the emails

The **four client emails** (trial, JTT, scholarship, welcome) and the **internal notification email** live in your **ActiveCampaign account**. The website only adds contacts to List 4 and applies tags; AC sends the emails when you set up the automation.

### Where to see them in AC

1. Log in to **ActiveCampaign** (your account URL is in `ACTIVECAMPAIGN_URL` or your AC invite).
2. Go to **Automations** (or **Automation** in the left menu).
3. Open the automation named **"LBTA Confirmations"** (or whatever you named it).
4. In the automation canvas you’ll see:
   - **Step 1** — Conditional email to the contact (trial / JTT / scholarship / welcome). Click each branch to see or edit that email.
   - **Step 2** — Internal email to your team. Click it to see subject and body.

### How to get a visual preview

- **Per email:** Open the automation → click the **email step** (e.g. “Send Trial confirmation”) → use **Preview** or **Send a test email** to your own address. That’s the only way to see the exact design and branding as recipients see it.
- **From a template:** If you created the emails from AC’s **Campaigns** or **Templates**, open **Email** → **Templates** (or the campaign), open the template, and use **Preview** / **Send test**.

The website **does not** store or send these emails; it only sends contact data to AC. So the only place to see the real visuals is inside ActiveCampaign.

---

## 2. GoHighLevel (GHL) — where to see the SMS (and any email)

The **SMS message** (and any email step in the same workflow) is designed **inside GoHighLevel**.

### Where to see it in GHL

1. Log in to **GoHighLevel** and open the **location** you use for LBTA (`GHL_LOCATION_ID`).
2. Go to **Automations** (or **Workflows** / **Marketing** → **Automations**).
3. Open the workflow you use for the website (e.g. **“LBTA Website – SMS”**).
4. You’ll see:
   - **Trigger:** Contact added to workflow (the site adds contacts here via API).
   - **Step 1:** Usually “Send SMS” (and optionally more steps). Click the SMS step to see the message text and any merge fields.

That’s where you see and edit the exact SMS (and any GHL email in that workflow). There is no copy of this template in the repo.

### How to get a visual / test

- **SMS:** Send a test by adding a test contact to the workflow (or use GHL’s test/send feature for that step). Check your phone to see how it looks.
- **Email in GHL:** If you added an email step in the same workflow, open that step and use GHL’s preview or “Send test” to see the design.

---

## 3. Visual reference in this repo (HTML you can open in a browser)

We **don’t** have the AC confirmation emails or the GHL SMS stored as files. We **do** have a set of **nurture-sequence** HTML emails in the repo that you can open in a browser to see layout and a consistent “LBTA email” look.

### How to see them

1. On your computer, open the project folder:  
   `LBTA_WEBSITE_DRAFT_3:5:26/emails/nurture-sequence/`
2. Double‑click any HTML file (e.g. **`01-reconnection.html`**) to open it in your default browser.  
   Or from Terminal:  
   `open emails/nurture-sequence/01-reconnection.html`
3. You’ll see a full email layout: header (logo), body copy, buttons, footer. Use this as a **style reference** when building or updating the AC and GHL content.

**Note:** Those HTML files use **Playfair Display** and **Work Sans**. The main website uses **Cormorant** and **DM Sans**. If you want the same look everywhere, you can either align the AC/GHL templates with the site (Cormorant + DM Sans) or keep the nurture emails as-is for that sequence only.

### Files you can open

| File | Use as reference for |
|------|----------------------|
| `emails/nurture-sequence/01-reconnection.html` | Layout, header, CTA button, tone |
| `emails/nurture-sequence/04-lbta-difference.html` | “Why LBTA” style block |
| `emails/holiday-2025-newsletter.html` | Newsletter-style layout (if present) |

---

## 4. Suggested copy for AC and GHL (paste into AC/GHL and style there)

Use this as **copy only**. Design and branding (fonts, colors, images) you set in AC and GHL.

### ActiveCampaign — four client emails (suggested body copy)

**Trial confirmation (tag 82)**  
Subject: *We received your trial request*  
Body (short): *Thanks for requesting a trial at Laguna Beach Tennis Academy. We’ll be in touch within 24 hours to confirm your time. — The LBTA Team*

**JTT confirmation (tag 107)**  
Subject: *JTT registration received*  
Body: *We’ve received your Junior Team Tennis registration. We’ll confirm your spot and send next steps shortly. — The LBTA Team*

**Scholarship received (tag 108)**  
Subject: *Scholarship application received*  
Body: *Thank you for submitting your scholarship application. We’ll review it and get back to you soon. — The LBTA Team*

**Welcome / Newsletter (list 4 or tag 33)**  
Subject: *Welcome to Laguna Beach Tennis Academy*  
Body: *Thanks for joining. You’ll hear from us about programs, camps, and news. — The LBTA Team*

Style these in AC (fonts, logo, colors) to match your brand; the checklist is in [activecampaign-setup-checklist.md](./activecampaign-setup-checklist.md).

### GHL — SMS (suggested text)

*Thanks for reaching out to Laguna Beach Tennis Academy. We’ll be in touch within 24 hours.*

Edit this in GHL in the workflow step “Send SMS” (or equivalent). Add merge fields (e.g. first name) if your workflow supports them.

---

## Quick reference

| What you want to see | Where to look |
|----------------------|----------------|
| **AC confirmation emails (design + copy)** | ActiveCampaign → Automations → “LBTA Confirmations” → each email step → Preview / Send test |
| **GHL SMS (and any GHL email)** | GoHighLevel → Automations → “LBTA Website – SMS” (or your workflow) → open SMS/email step |
| **Visual reference (layout/branding)** | Open `emails/nurture-sequence/01-reconnection.html` (or other HTML there) in your browser |

Related: [activecampaign-setup-checklist.md](./activecampaign-setup-checklist.md) | [how-to-get-ghl-workflow-id.md](./how-to-get-ghl-workflow-id.md) | [gohighlevel-setup-checklist.md](./gohighlevel-setup-checklist.md)
