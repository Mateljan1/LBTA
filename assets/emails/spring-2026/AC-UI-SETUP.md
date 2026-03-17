# Spring 2026 Drip — ActiveCampaign UI Setup

**Already in ActiveCampaign (via API):**
- **16 email messages** — P1–P8 (Prospects) and R1–R8 (Returning). Created in AC; IDs in `message-ids.json`.
- **2 tags** — Prospect (165), Returning (166). IDs in `tag-ids.json`.

**Where to see the 16 emails in AC:**  
The screen you’re on (**Campaigns** list) shows **campaigns** (one-time or recurring sends, e.g. “A Tennis Life - Week 1”, “Spring JTT”). The 16 drip emails are **Messages** (reusable email content), not campaigns. To find them: open the **Campaigns** area in the left nav, then go to **Messages** (or **Content → Messages**). You should see “LBTA P1 Welcome”, “LBTA P2 How We Teach”, … “LBTA R8 One Cue Word” there. When you build an automation and add a “Send email” step, you pick one of these messages.

**What the API cannot do:** ActiveCampaign’s REST API does not support creating automation *workflows* (trigger + send email + wait steps). Those must be created once in the AC UI. After you create the two automations below, you can add contacts to them programmatically via the AC MCP (`ac_add_contact_to_automation`) or API.

Do the following in the ActiveCampaign UI to finish setup.

---

## 1. Create two segments

**Contacts → Segments → Create segment**

### Segment 1: Prospects
- **Name:** `Prospects` (or "LBTA Prospects Spring 2026")
- **Condition:** Tag **is** `Prospect` (tag ID 165)
- Optional: add condition Tag **is not** `Returning` so no overlap.

### Segment 2: Returning Clients
- **Name:** `Returning Clients` (or "LBTA Returning Spring 2026")
- **Condition:** Tag **is** `Returning` (tag ID 166)

Save both segments. Note the segment names; you’ll use them as automation triggers.

---

## 2. Automation: LBTA Prospects Spring 2026

**Automations → Create automation**

- **Trigger:** Contact enters segment **Prospects**
- **Steps (16 total):**
  1. **Send email** → choose message **LBTA P1 Welcome** (id 198)
  2. **Wait** → Until next **Wednesday** (e.g. 9:00 AM account time)
  3. **Send email** → **LBTA P2 How We Teach** (199)
  4. **Wait** → Until next **Sunday** (e.g. 9:00 AM)
  5. **Send email** → **LBTA P3 Right Age** (200)
  6. **Wait** → Until next **Wednesday**
  7. **Send email** → **LBTA P4 Inside a Session** (201)
  8. **Wait** → Until next **Sunday**
  9. **Send email** → **LBTA P5 Why Tennis** (202)
  10. **Wait** → Until next **Wednesday**
  11. **Send email** → **LBTA P6 Meet Coaches** (203)
  12. **Wait** → Until next **Sunday**
  13. **Send email** → **LBTA P7 Spring Started** (204)
  14. **Wait** → Until next **Wednesday**
  15. **Send email** → **LBTA P8 For Adults** (205)
  16. **End**

Turn the automation **On** when ready. Cadence: Sun/Wed from start (e.g. Mar 16 → Apr 9).

---

## 3. Automation: LBTA Returning Spring 2026

**Automations → Create automation**

- **Trigger:** Contact enters segment **Returning Clients**
- **Steps (16 total):**
  1. **Send email** → **LBTA R1 Traffic Light** (206)
  2. **Wait** → Until next **Wednesday**
  3. **Send email** → **LBTA R2 First 4 Shots** (207)
  4. **Wait** → Until next **Sunday**
  5. **Send email** → **LBTA R3 70 Percent Rule** (208)
  6. **Wait** → Until next **Wednesday**
  7. **Send email** → **LBTA R4 Earn the Line** (209)
  8. **Wait** → Until next **Sunday**
  9. **Send email** → **LBTA R5 Attack Space** (210)
  10. **Wait** → Until next **Wednesday**
  11. **Send email** → **LBTA R6 Defense Height** (211)
  12. **Wait** → Until next **Sunday**
  13. **Send email** → **LBTA R7 Summer Plan** (212)
  14. **Wait** → Until next **Wednesday**
  15. **Send email** → **LBTA R8 One Cue Word** (213)
  16. **End**

Turn **On** when ready.

---

## 4. Who enters the automations

- **Prospects:** Add contacts to the Prospects segment (or apply tag **Prospect**). Use phased rollout: warm first, then Silver/Gold/referrals, then cold FB if opens > 25%. See `plans/activecampaign-spring-2026-drip-campaigns-plan.md`.
- **Returning:** Add contacts to the Returning Clients segment (or apply tag **Returning**) from your source of truth (e.g. people who have ever paid).

Do **not** use “Contact added to list 4” or existing confirmation tags as triggers for these drips; keep website signup confirmation automation separate.
