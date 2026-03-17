# ActiveCampaign Spring 2026 Drip Campaigns — Implementation Plan

**Compound-engineering plan:** Build the LBTA Prospect (P1–P8) and Returning Client (R1–R8) email sequences fully in ActiveCampaign: 16 messages, 2 automations (drip sequences), segments, and phased rollout.

**Source assets:**
- **Prospects:** `/Users/andrew-mac-studio/Downloads/LBTA_Campaign_Prospects/` — 8 HTML files (P1–P8), README.md with subject/preview/dates
- **Returning:** `/Users/andrew-mac-studio/Downloads/LBTA_Campaign_Returning/` — 8 HTML files (R1–R8), README.md with subject/preview/dates

**Cadence:** Sun/Wed, March 16 – April 9, 2026. From: Andrew Mateljan · support@lagunabeachtennisacademy.com.

---

## 1. Overview

Two 8-email drip sequences run in parallel in ActiveCampaign:

| Sequence | Audience | Trigger | Dates |
|----------|----------|---------|--------|
| **Prospects** | Everyone who expressed interest but never paid for a class | Contact enters segment "Prospects" | P1 Sun Mar 16 → P8 Wed Apr 9 |
| **Returning** | Everyone who has ever paid for a class (juniors + adults) | Contact enters segment "Returning Clients" | R1 Sun Mar 16 → R8 Wed Apr 9 |

Each sequence is one **Automation** in AC. Each email is one **Message** (template) in AC. Segments define who enters which automation. Waits between emails follow Sun/Wed (wait until next Wednesday or next Sunday).

---

## 2. Problem Statement

- The 16 send-ready HTML emails and two READMEs exist locally but are not yet in ActiveCampaign.
- Without a clear plan, building 16 messages and 2 multi-step automations manually is error-prone and hard to hand off.
- Segments "Prospects" vs "Returning Clients" must be defined in AC (by tag, list, or segment rules) so the right contacts enter the right sequence.
- Prospects README specifies a phased rollout (warm first, then Silver/Gold/PlayByPoint/referrals, then cold FB leads if opens > 25%); this needs to be executable in AC.

---

## 3. Proposed Solution

### 3.1 Messages (16 total)

Create 16 **Messages** in ActiveCampaign (Campaigns → Messages or via API):

- **Type:** Template (reusable in automations).
- **From name:** Andrew Mateljan  
- **From email:** support@lagunabeachtennisacademy.com  
- **Reply-to:** support@lagunabeachtennisacademy.com  
- **Body:** HTML from the corresponding _SEND_READY.html file (already contains %FIRSTNAME%, %UNSUBSCRIBELINK%, %MANAGEPREFERENCES%; images are AC-hosted).
- **Subject** and **Preview text** per the tables below (from READMEs).

Prospects messages:

| # | AC Message Name | Subject | Preview Text |
|---|------------------|--------|--------------|
| P1 | LBTA P1 Welcome | A quick intro from the guy who runs this place | A framework you can use this weekend — from the LBTA coaching team. |
| P2 | LBTA P2 How We Teach | We don't tell kids where to hit (here's why) | Most tennis lessons look the same. Ours don't. |
| P3 | LBTA P3 Right Age | "Is my kid the right age to start tennis?" | The honest answer — plus a quick guide by age. |
| P4 | LBTA P4 Inside a Session | Here's what happens in 60 minutes (minute by minute) | The thing that keeps most families from trying is not knowing what to expect. |
| P5 | LBTA P5 Why Tennis | 3 things tennis teaches that no classroom can | Decision-making under pressure. Emotional regulation. Competitive grace. |
| P6 | LBTA P6 Meet Coaches | 4 coaches, 50+ years of experience | Who's on the court — and how they actually coach. |
| P7 | LBTA P7 Spring Started | Spring started today — your free trial is ready | New faces are expected. You won't be the only one. |
| P8 | LBTA P8 For Adults | "I'm too old to start." (No, you're not.) | Half our students are adults. Here's what it actually looks like. |

Returning messages:

| # | AC Message Name | Subject | Preview Text |
|---|------------------|--------|--------------|
| R1 | LBTA R1 Traffic Light | The decision framework that changes how you play | Every ball is red, yellow, or green. A framework you can use this weekend. |
| R2 | LBTA R2 First 4 Shots | 1–3 spots left on our USTA 3.5 team | 70% of points end by shot 4. The stat that should change how you practice. |
| R3 | LBTA R3 70 Percent Rule | What 12 hours does that 1 hour can't | If you're hitting every ball in during practice, you're not improving. |
| R4 | LBTA R4 Earn the Line | The shot selection mistake I see every week | It's not your forehand. It's when you choose to go down the line. |
| R5 | LBTA R5 Attack Space | Camp starts tomorrow. Spring starts Monday. | Why swinging harder on a short ball is almost always wrong. |
| R6 | LBTA R6 Defense Height | The shot that improves every other shot | When you're stretched and off-balance, hit it HIGH. Here's why. |
| R7 | LBTA R7 Summer Plan | The best summer plan isn't "sign up for everything" | Camp weeks for breakthroughs. Weekly classes for consistency. |
| R8 | LBTA R8 One Cue Word | One word before every point | The difference between focused and scattered isn't talent. |

(Preview text in AC may be set in the message or in the automation send step; document where it lives in your AC version.)

### 3.2 Segments

Define in ActiveCampaign (Contacts → Segments):

- **Prospects**  
  - Definition: Contacts who have **never paid** for a class.  
  - Implementation options:  
    - **Tag-based:** e.g. "Prospect" tag and no "Returning" (or "Paid") tag. You add "Prospect" when you add them to the prospect list; do not add "Returning".  
    - **Segment rules:** e.g. "Tag contains Prospect" AND "Tag does not contain Returning" (or "Has not been on list X" if you use a "Paid" list).  
  - Who gets added: Per README, phased — Week 1: warm only (replied, inquired, booked trial); Week 2: Silver/Gold, PlayByPoint, referrals; Week 3: cold FB leads only if open rates > 25%.

- **Returning Clients**  
  - Definition: Contacts who have **ever paid** for a class (juniors + adults).  
  - Implementation: e.g. tag "Returning" or "Paid" or segment rule "Tag contains Returning" / "Has been on list [Paid list]".  
  - Add contacts to this segment (or apply tag) from your source of truth (e.g. People_Master, receipts, Airtable).

Ensure a contact cannot be in both segments (Prospects = never paid; Returning = ever paid). If you use tags, apply one or the other, not both.

### 3.3 Automations (2)

Build in ActiveCampaign: **Automations** → Create automation.

**Automation 1: "LBTA Prospects Spring 2026"**

- **Trigger:** Contact enters segment **Prospects** (or: Contact receives tag "Prospect", if you use tag-based entry).
- **Steps:**
  1. Send email → **LBTA P1 Welcome** (use message created above).
  2. Wait → **Until next Wednesday** (e.g. 9:00 AM local).
  3. Send email → **LBTA P2 How We Teach**.
  4. Wait → **Until next Sunday** (e.g. 9:00 AM).
  5. Send email → **LBTA P3 Right Age**.
  6. Wait → **Until next Wednesday**.
  7. Send email → **LBTA P4 Inside a Session**.
  8. Wait → **Until next Sunday**.
  9. Send email → **LBTA P5 Why Tennis**.
  10. Wait → **Until next Wednesday**.
  11. Send email → **LBTA P6 Meet Coaches**.
  12. Wait → **Until next Sunday**.
  13. Send email → **LBTA P7 Spring Started**.
  14. Wait → **Until next Wednesday**.
  15. Send email → **LBTA P8 For Adults**.
  16. End.

**Automation 2: "LBTA Returning Spring 2026"**

- **Trigger:** Contact enters segment **Returning Clients** (or: Contact receives tag "Returning").
- **Steps:** Same pattern — Send R1 → Wait until Wed → Send R2 → Wait until Sun → … → Send R8 → End.

**Wait behavior:** Use AC’s “Wait until date/time” or “Wait until day of week” so the next email goes on the next Wednesday or Sunday (not a fixed number of days). Exact option names depend on your AC plan (e.g. “Wait until next Wednesday 9am”).

### 3.4 Phased rollout (Prospects only)

- **Week 1:** Add only “warm” prospects to the Prospects segment (replied, inquired, booked trial). Do not add cold leads yet.
- **Week 2:** Add Silver/Gold profiles, PlayByPoint, referrals to the Prospects segment.
- **Week 3:** If open rates for P1–P2 (or first sends) are > 25%, add cold FB leads to the Prospects segment; otherwise skip or delay.

Implement by **when** you add contacts to the segment (or when you apply the “Prospect” tag), not by changing the automation. The automation is the same; you control who enters and when.

### 3.5 No conflict with website confirmation automation

Per your setup, the **only** automation that sends the website signup confirmation is triggered by **Contact added to list [LBTA Website Signups]**. These two new automations are triggered by **segment entry** (Prospects / Returning Clients). So:

- Website signups → confirmation automation only (unchanged).
- Contacts added to Prospects or Returning Clients segments → enter the new drip automations only.

Do not use “Contact added to list 4” or “Contact receives tag 82/33/107/108” as triggers for the drip sequences.

---

## 4. Implementation Steps

### Phase 1: Copy assets into repo (optional but recommended)

| Step | Task | Notes |
|------|------|--------|
| 1.1 | Create `assets/emails/spring-2026/prospects/` and `assets/emails/spring-2026/returning/` in the repo. | Keeps HTML under version control. |
| 1.2 | Copy the 16 _SEND_READY.html files into those folders (or symlink from Downloads). | Use the same filenames or a manifest so the script can find them. |
| 1.3 | Copy or summarize the two READMEs into `docs/emails-spring-2026-prospects.md` and `docs/emails-spring-2026-returning.md` (or one doc with both tables). | Single place for subject/preview/dates. |

### Phase 2: Create 16 messages in ActiveCampaign

| Step | Task | Notes |
|------|------|--------|
| 2.1 | **Option A — Script:** Add a script (e.g. `scripts/create-ac-drip-messages.js`) that reads a manifest (CSV or JSON) of message name, subject, preview, HTML path and calls `POST /api/3/messages` for each. Run once to create all 16; capture message IDs. | Manifest columns: name, subject, previewText, htmlPath. From name/email/reply2 fixed. |
| 2.2 | **Option B — Manual:** In AC, Campaigns → Messages → Create message for each of the 16; paste HTML from each file; set subject and from name/email. Name them exactly as in the tables above so automations are easy to build. | Slower but no script. |
| 2.3 | Record the **Message ID** for each (P1–P8, R1–R8) in a small doc or spreadsheet so you can wire the automation steps correctly if needed. | AC UI usually lets you pick by message name. |

### Phase 3: Define segments in AC

| Step | Task | Notes |
|------|------|--------|
| 3.1 | Create segment **Prospects**: e.g. Tag "Prospect" OR segment rule “Tag is Prospect” (and “Tag is not Returning”). | Depends on how you tag contacts elsewhere. |
| 3.2 | Create segment **Returning Clients**: e.g. Tag "Returning" OR “Has tag Returning”. | Same. |
| 3.3 | Document how you will add contacts to each segment (e.g. from People_Master, Airtable, or a CSV import with tags). | So ops can add people in phases. |

### Phase 4: Build the two automations in AC UI

| Step | Task | Notes |
|------|------|--------|
| 4.1 | Create automation **"LBTA Prospects Spring 2026"**. Trigger: Contact enters segment **Prospects**. | |
| 4.2 | Add 15 steps: Send P1 → Wait (until next Wed) → Send P2 → Wait (until next Sun) → … → Send P8. Then End. | Use “Wait until day of week” (or equivalent) so sends land on Sun/Wed. |
| 4.3 | Create automation **"LBTA Returning Spring 2026"**. Trigger: Contact enters segment **Returning Clients**. | |
| 4.4 | Add 15 steps: Send R1 → Wait (until next Wed) → Send R2 → … → Send R8 → End. | Same wait pattern. |
| 4.5 | Turn automations **on** only when you’re ready to start (e.g. March 16). | First sends: P1 and R1 on Sun Mar 16. |

### Phase 5: Phased rollout and go-live

| Step | Task | Notes |
|------|------|--------|
| 5.1 | Week 1: Add only warm prospects to the Prospects segment (or apply Prospect tag to that subset). | Replied, inquired, booked trial. |
| 5.2 | Week 2: Add Silver/Gold, PlayByPoint, referrals to Prospects. | |
| 5.3 | Week 3: If open rates > 25%, add cold FB leads to Prospects; else skip. | |
| 5.4 | Returning: Add all “ever paid” contacts to Returning Clients segment (or apply tag) before or at go-live. | One-time or ongoing from your CRM/source of truth. |

---

## 5. Files to Create / Modify

| File | Action | Purpose |
|------|--------|---------|
| `assets/emails/spring-2026/prospects/` | Create dir | Hold P1–P8 HTML (or symlinks). |
| `assets/emails/spring-2026/returning/` | Create dir | Hold R1–R8 HTML. |
| `assets/emails/spring-2026/manifest.json` or `manifest.csv` | Create | Message name, subject, preview, htmlPath for script. |
| `scripts/create-ac-drip-messages.js` | Create (optional) | Batch-create 16 messages via AC API; output message IDs. |
| `docs/emails-spring-2026-campaigns.md` | Create | Summary of the two sequences, segment definitions, and automation steps; link to READMEs. |

No changes to `lib/activecampaign.ts` or to the website confirmation automation are required for this plan.

---

## 6. Success Criteria

- [ ] All 16 messages exist in ActiveCampaign with correct subject, from name/email, and HTML body (with %FIRSTNAME%, %UNSUBSCRIBELINK%, %MANAGEPREFERENCES%).
- [ ] Two segments exist: **Prospects**, **Returning Clients** (or equivalent tag-based entry).
- [ ] Two automations exist: **LBTA Prospects Spring 2026**, **LBTA Returning Spring 2026**, each with trigger (segment entry) and 8 sends with Sun/Wed waits.
- [ ] First sends (P1 and R1) can go on Sun Mar 16; subsequent sends land on Wed/Sun as per README.
- [ ] Phased rollout for Prospects is documented and executable (who to add in Week 1, 2, 3).
- [ ] No trigger overlap with the website signup confirmation automation (confirmation = Website Signups list only; drips = segment entry only).

---

## 7. Research Sources

- **Prospects README:** `/Users/andrew-mac-studio/Downloads/LBTA_Campaign_Prospects/README.md`
- **Returning README:** `/Users/andrew-mac-studio/Downloads/LBTA_Campaign_Returning/README.md`
- **AC API Messages:** `POST /api/3/messages` (create message); existing pattern in `scripts/create-ac-campaign.js`
- **AC API Contact automations:** `POST /api/3/contactAutomations` to add a contact to an automation (automation must already exist in UI)
- **AC setup:** `docs/activecampaign-setup-checklist.md`, `lib/activecampaign.ts` (list/tag IDs; no change needed for drips)

---

## 8. Risks and Mitigations

| Risk | Mitigation |
|------|------------|
| Wrong segment → contact gets both sequences | Define segments so mutually exclusive (e.g. Prospect = never paid, Returning = ever paid; one tag per contact). |
| Wait “until Wednesday” not available in AC | Use “Wait X days” to approximate (e.g. 3 days after Sun = Wed) or upgrade/use “Schedule for next Wednesday” if your plan has it. |
| First send date wrong | Set automation live only when ready; or use “Start date” on automation so first wait ends on Mar 16. |
| HTML breaks in AC | Paste HTML into AC message editor; send test to yourself; fix any stripped or broken markup. |
| Images 404 | README says “All logos AC-hosted”; confirm image URLs in HTML point to tennisbeast.activehosted.com and are accessible. |

---

## 9. Next Steps

1. **Approve plan** — Confirm segment definitions (tags vs segment rules) and who will add contacts (you vs script vs Airtable).
2. **Phase 1** — Copy HTML and README content into repo (optional).
3. **Phase 2** — Create 16 messages (script or manual); record message IDs/names.
4. **Phase 3** — Create segments Prospects and Returning Clients in AC.
5. **Phase 4** — Build the two automations in AC UI; leave off until go-live.
6. **Phase 5** — Add contacts to segments per phased rollout; turn automations on for March 16.

If you want the script in Phase 2, the next step is to add `scripts/create-ac-drip-messages.js` and a manifest (e.g. `assets/emails/spring-2026/manifest.json`) so one command creates all 16 messages and prints a mapping of name → message ID for reference when building the automations.
