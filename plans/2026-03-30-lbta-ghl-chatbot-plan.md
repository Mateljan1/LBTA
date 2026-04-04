# LBTA GHL Chatbot Implementation Plan

## Overview

Deploy a production-ready GHL Conversation AI chatbot that speaks in Andrew Mateljan's verified voice, handles all inbound channels (SMS, Instagram DM, Facebook Messenger, web chat), and powers 17 proactive automation workflows covering the full parent lifecycle from Lead to Advocate.

## Problem Statement

LBTA has zero live chatbot answering leads. Robert handles all inbound messages manually. Peak volume hits 3-5 PM when parents text about same-day logistics. 541 GHL contacts have never been messaged. 334 thank-you messages went unanswered. Average first-response time is measured in hours, not minutes. Every delay costs conversions.

The academy already has:
- A battle-tested voice profile (21,428 real texts + 4,141 voice transcripts analyzed)
- A complete deployment package: system prompt, v3 master playbook, v3.1 patch, automation playbook, and Tier 1+2 expansion
- GHL as the CRM with existing API integration (`lib/gohighlevel.ts`)
- An active website chat widget integration (`components/ChatWidget.tsx`, deferred by `components/layout/ChatWidgetDeferred.tsx`)
- An existing chatbot integration plan (`LBTA_CHATBOT_INTEGRATION_PLAN.md`) that evaluated 4 platforms and chose GHL Conversation AI

**Why now:** Spring 2026 session starts April 6. Every day without the chatbot is leads lost.

## Proposed Solution

**Platform: GHL Conversation AI (native)** -- not n8n, not Lindy, not Poppy. (Source: LBTA_CHATBOT_INTEGRATION_PLAN.md evaluation of all 4 options.)

GHL Conversation AI was chosen because it operates natively on every channel LBTA uses, integrates with the CRM without middleware, supports document upload for knowledge bases, and costs approximately $16-30/month. Zero external infrastructure required for the core chatbot.

The solution has three layers:

1. **The Brain** -- System prompt + knowledge base documents uploaded to GHL Conversation AI. This is what the bot knows and how it sounds.
2. **The Engine** -- 17 GHL workflow automations covering Lead > Trial > Enroll > Onboard > Retain > Cross-Sell > Re-Enroll > Refer > Win-Back. This is what happens proactively without anyone touching anything.
3. **The Bridge** -- Website chatbot widget integration. Replace the current placeholder `Chatbot.tsx` with GHL's native web chat widget embed, or connect the existing UI to GHL via the Conversation AI API.

(Source: LBTA_GHL_Automation_Playbook.docx architecture -- "The chatbot handles REACTIVE. The automation playbook handles PROACTIVE. Together they cover the full parent lifecycle.")

## Implementation Steps

### Phase 1: GHL Knowledge Base & System Prompt (Day 1)

- [ ] 1.1: Upload `GHL_System_Prompt.md` into GHL > Conversation AI > System Prompt field. This is the v3 voice-corrected system prompt with Andrew's exact texting rules, banned words, escalation matrix, and quality check protocol
- [ ] 1.2: Upload `LBTA_GHL_Chatbot_FINAL_v3.docx` as Custom Data in GHL Conversation AI. Contains 30+ scenario responses, all program pricing (Spring 2026), coach reference, player progression path, escalation matrix, and the 10-point voice quality check
- [ ] 1.3: Upload `LBTA_GHL_Chatbot_v3.1_PATCH.docx` as Custom Data alongside v3. Contains website URL routing (14 URLs), 30-day money-back guarantee handling, emotional/sensitive scenarios, Racquet Rescue service details, summer camp responses, and after-hours behavior rules
- [ ] 1.4: Create 10 explicit FAQ Q&A pairs in GHL Custom Bot Responses for the top questions identified from SMS analysis (weather, payment, makeup, pricing, age groups, trials, signup, discounts, locations, staff)
- [ ] 1.5: Add LBTA website URLs to GHL Web Crawler for supplementary knowledge: `lagunabeachtennisacademy.com` (full site crawl) plus individual program pages, one-pager assets on GitHub Pages

### Phase 2: Bot Configuration (Day 1-2)

- [ ] 2.1: Create primary bot "LBTA Tennis Assistant" in GHL with intent = General Q&A, attach knowledge base from Phase 1
- [ ] 2.2: Create booking bot "LBTA Enrollment" with intake form collecting: parent name, email, phone, child name/age, program interest, preferred days, season. On completion: trigger GHL workflow to create/update contact, SMS Robert, email support@, tag "Enrollment Request" + "Bot Collected", move to pipeline stage
- [ ] 2.3: Enable both bots on all channels: SMS (GHL phone number), Instagram DMs, Facebook Messenger, Web Chat widget
- [ ] 2.4: Set operating mode to **Suggestive** for first 2 weeks (bot drafts, Robert reviews). After accuracy verified, switch to Auto-Pilot with max 8 messages before human handoff and escalation triggers routing to Robert's queue

### Phase 3: Website Chat Widget Integration (Day 2-3)

- [ ] 3.1: Decide integration approach: (A) Replace current placeholder `Chatbot.tsx` with GHL native web chat widget embed script, or (B) Connect existing custom UI to GHL Conversation AI API. **Recommendation: Option A** -- GHL widget handles all channel state, conversation threading, and CRM logging natively. Custom UI adds maintenance burden without functional benefit
- [ ] 3.2: If Option A: Add GHL web chat widget script to the Next.js layout. Keep or tune the current `components/ChatWidget.tsx` + `components/layout/ChatWidgetDeferred.tsx` integration. The GHL widget auto-handles the floating button, conversation UI, and CRM logging
- [ ] 3.3: If Option B: Wire `Chatbot.tsx` to GHL Conversation AI REST API. Send user messages to GHL, receive bot responses, render in the existing UI. Requires GHL API authentication and conversation session management. More work, more control over look-and-feel
- [ ] 3.4: Update `StickyCTA.tsx` to not conflict with the chat widget position (both currently anchor to bottom-right)

### Phase 4: Day-1 Automation Workflows (Day 2-4) -- Deploy Priority RED

Build these 8 workflows in GHL first. They cover the highest-impact automations that should be live before or on April 6 (Spring session start).

- [ ] 4.1: **Workflow 1 -- New Lead Pipeline.** Trigger: Contact Created + Tag "New Lead". Steps: (a) First touch SMS within 5 min using child-name-first template, (b) 48hr follow-up if no reply, (c) tag "Cold Lead" after 7 days no response. ONE follow-up only, then stop
- [ ] 4.2: **Workflow 2 -- Onboarding (90-Day).** Trigger: Contact tagged "Enrolled". Steps: Welcome message (Day 0), post-first-session check-in (Day 1, 4hr after), Week 2 check-in (Day 10), Week 4 band explanation (Day 28), Week 6 satisfaction pulse (Day 42), Week 12 milestone + progress preview (Day 84). Six touchpoints that currently happen manually or not at all
- [ ] 4.3: **Workflow 3 -- Retention.** (a) Absence detection: Tag "Enrolled" + Last Session Date > 14 days > caring check-in SMS. (b) Monthly satisfaction pulse (skip first 90 days). (c) Referral ask after Week 8 for positive-response families only
- [ ] 4.4: **Workflow 5 -- Lead Scoring Tags.** Auto-tag based on behavior: Hot Lead (asked pricing/trial/scheduling), Warm Lead (general inquiry), Cold Lead (no response after follow-up), Trial Scheduled, Trial Completed, Enrolled, At Risk, Payment Overdue, Re-Engagement, Churned, Advocate
- [ ] 4.5: **Workflow 7 -- Google Review Generation.** Trigger: positive sentiment detected in parent message + "Enrolled" tag. Wait 24hrs. Send review ask with direct Google Review link. Tag "Review Asked". Max 1 per family per season. Email version for 2+ season families at Week 10
- [ ] 4.6: **Workflow 8 -- Abandoned Form Recovery.** Trigger: Partial form submission on /book, not completed within 30 min. SMS recovery with link + offer to set up manually. Email at 48hrs if no SMS response. Tag "Abandoned Form"
- [ ] 4.7: **Workflow 11 -- Internal Alert System.** Five internal SMS alerts (NOT parent-facing): (a) Complaint alert to Andrew (949) 241-0847, (b) Refund request to Andrew + Saska, (c) Speed-to-lead failsafe to Robert if 10min with no response, (d) Payment 3rd strike to Andrew (phone call needed), (e) At-risk family to Andrew
- [ ] 4.8: **Workflow 16 -- Payment Confirmation.** Trigger: Tag "Payment Confirmed" added by Robert. Send confirmation SMS with session details. Start Onboarding Workflow (Workflow 2)

### Phase 5: Week-2 Automation Workflows (Week 2)

- [ ] 5.1: **Workflow 4 -- Re-Enrollment Engine.** 5-step sequence starting 6 weeks before season end: Progress preview email (Week -6), next season announcement + early bird (Week -4), gentle SMS reminder (Week -3), social proof (Week -2, only if factually true), final warm nudge (Week -1). Non-renewal follow-up at deadline +3 days
- [ ] 5.2: **Workflow 6 -- Seasonal Transition Checklist.** OPS workflow: 2 weeks before new season, update knowledge base (session dates, pricing, coach assignments, camp schedule, UTR, discounts, locations), reset previous-season tags, test chatbot with 5 sample messages
- [ ] 5.3: **Workflow 9 -- Cross-Sell Sequences.** Three sequences, max ONE per family per season: (a) Junior family > adult programs (4+ weeks enrolled), (b) Weekly program > LiveBall (6+ weeks), (c) Enrolled family > upcoming camp (4 weeks before camp)
- [ ] 5.4: **Workflow 10 -- Win-Back (Churned Families).** (a) Season-start win-back: 1 week after new season starts, for "Churned" contacts. ONE message, reference the child not the program. (b) Annual win-back: 1 year after last enrollment ended. After 2 years no response > archive

### Phase 6: Month-1 Automation Workflows (Weeks 3-4)

- [ ] 6.1: **Workflow 12 -- Birthday Messages.** Trigger: Custom field "Child DOB" matches today. Send at 8am. Annual recurrence. Requires capturing DOB during enrollment or onboarding
- [ ] 6.2: **Workflow 13 -- Coach Post-Session Reports.** Internal: 15 min after each scheduled session ends, auto-text the assigned coach for 3-line report (PUNCHES, STICKER, FLAG)
- [ ] 6.3: **Workflow 14 -- Weather Auto-Cancel.** Manual trigger: Andrew/Robert tags "Weather Cancel [Date]". Blast SMS to all enrolled families in that day's programs. Templates for rain and heat/AQI
- [ ] 6.4: **Workflow 15 -- Waitlist Notification.** Trigger: Contact removed from full program. SMS first on waitlist. Wait 24hrs for response. If none, notify next
- [ ] 6.5: **Workflow 17 -- Stale Lead Quarterly Sweep.** Every 90 days: re-engage "Cold Lead" contacts not enrolled. One warm message. After 3 sweeps with no response > tag "Archived"

### Phase 7: Testing & Launch (Day 3-5)

- [ ] 7.1: Test 10+ message scenarios against the bot: child inquiry (various ages), adult inquiry, pricing question, trial booking, private lesson request (should escalate), refund request (should escalate), complaint (should escalate), thank-you, makeup request, unknown identity
- [ ] 7.2: Verify all escalation triggers: Robert receives SMS within 2 min, conversation moves to human queue, bot stops auto-responding on that thread
- [ ] 7.3: Test each Day-1 workflow with test contacts: lead pipeline fires on new contact, onboarding fires on "Enrolled" tag, internal alerts reach correct phones
- [ ] 7.4: Verify website chat widget renders correctly, does not conflict with StickyCTA, works on mobile, and conversations log to GHL contact records
- [ ] 7.5: Go live in Suggestive mode (Week 1-2). Switch to Auto-Pilot after 90%+ accuracy confirmed (Week 3+). Ongoing: weekly spot-check of 10 conversations

### Phase 8: GHL Custom Fields & Pipeline Setup (Prerequisite, Day 1)

- [ ] 8.1: Create or verify GHL custom fields: `enrollment_date` (date), `trial_date` (date), `trial_time` (text), `trial_location` (text), `trial_coach` (text), `child_name` (text), `child_age` (number), `child_dob` (date), `program_interest` (text), `city_payment_amount` (number), `city_payment_date` (date)
- [ ] 8.2: Create or verify GHL pipeline stages: New Lead > Hot Lead > Trial Scheduled > Trial Completed > Enrollment Request > Enrolled > Active > At Risk > Churned. Add "Needs Human Response" stage for bot escalations
- [ ] 8.3: Verify GHL tags exist for all automation triggers: `new-lead`, `hot-lead`, `warm-lead`, `cold-lead`, `trial-scheduled`, `trial-completed`, `enrolled`, `at-risk`, `payment-overdue`, `payment-3`, `churned`, `win-back-sent`, `review-asked`, `review-posted`, `advocate`, `abandoned-form`, `cross-sell-adult`, `cross-sell-liveball`, `cross-sell-camp`, `absence-check`, `do-not-contact`, `archived`

## Files to Create/Modify

| File | Action | Purpose |
|------|--------|---------|
| `components/ChatWidget.tsx` | Modify | Configure the active GHL web widget mount and brand tokens |
| `components/layout/ChatWidgetDeferred.tsx` | Modify | Control defer strategy (timing/scroll reveal) for the active GHL widget |
| `app/layout.tsx` | Modify | Add GHL web chat widget script tag (if using native embed approach) |
| `components/StickyCTA.tsx` | Modify | Adjust positioning to not conflict with chat widget |
| `GHL_System_Prompt.md` (in GHL) | Upload | System prompt for Conversation AI -- already written, file at `/Users/andrew-mac-studio/Downloads/GHL_System_Prompt.md` |
| `LBTA_GHL_Chatbot_FINAL_v3.docx` (in GHL) | Upload | Core knowledge base -- file at `/Users/andrew-mac-studio/Downloads/LBTA_GHL_Chatbot_FINAL_v3.docx` |
| `LBTA_GHL_Chatbot_v3.1_PATCH.docx` (in GHL) | Upload | Edge cases + extensions -- file at `/Users/andrew-mac-studio/Downloads/LBTA_GHL_Chatbot_v3.1_PATCH.docx` |

```yaml
# files (for tooling; do not edit by hand)
modify: [components/ChatWidget.tsx, components/layout/ChatWidgetDeferred.tsx, app/layout.tsx, components/StickyCTA.tsx]
upload_to_ghl: [GHL_System_Prompt.md, LBTA_GHL_Chatbot_FINAL_v3.docx, LBTA_GHL_Chatbot_v3.1_PATCH.docx]
```

## Out of Scope (this plan)

- **n8n advanced automations** (lead enrichment, batch outreach, LiveBall invitations) -- these are Phase 5 in the chatbot integration plan, to be built after GHL native chatbot is live and proven
- **Facebook Lead > GHL import automation (AUTO-01)** -- covered in Automation Playbook v2, separate from chatbot deployment
- **PlayByPoint webhook integration (AUTO-03)** -- requires PBP webhook payload testing first
- **City payment email parsing (AUTO-04)** -- requires sample email analysis
- **Stripe payment failure handling (AUTO-05)** -- covered separately in Automation Playbook v2
- **Compliance expiry alerts (AUTO-06)** -- separate operational automation
- **Weather API auto-detection** -- Phase 6 includes manual-trigger weather cancel; API-based auto-detection is a future n8n upgrade
- **AI progress reports (AUTO-19)** -- Year 2 capability, requires curriculum framework that does not exist yet
- **Custom AI model training** -- GHL uses GPT/Claude/Gemini natively; no custom model needed
- **Lindy AI chatbot deployment** -- eliminated in platform evaluation. Keep existing billing agent as-is
- **Poppy AI chatbot deployment** -- eliminated. Content strategy tool, not a chatbot platform

## Success Criteria

- [ ] Bot answers program questions accurately using LBTA knowledge base (90%+ accuracy on spot-check)
- [ ] Bot correctly recommends programs based on age and level
- [ ] Bot quotes correct Spring 2026 pricing for all programs
- [ ] Bot collects enrollment details and notifies Robert within 2 minutes
- [ ] Bot escalates complaints, refunds, private lessons to Robert (never auto-responds to these)
- [ ] Bot operates on SMS, Instagram DMs, Facebook Messenger, and web chat
- [ ] Bot sounds like Andrew -- passes 10-point voice quality check on every response
- [ ] New leads receive first response within 5 minutes, 24/7
- [ ] Follow-up sequence fires at 48 hours for unresponsive leads
- [ ] 17 workflow automations are built and tested in GHL
- [ ] Internal alerts reach Andrew, Saska, and Robert at correct phone numbers
- [ ] All conversations log to GHL contact records
- [ ] Website chat widget is live and does not conflict with StickyCTA

## Acceptance Checklist

- [ ] [Accuracy] Send 10 test messages covering all program types, ages, and price points. Bot returns correct info for 9+ of 10
- [ ] [Voice] Review 5 bot responses against the 10-point quality check in v3 Section 13. All pass: no periods, child name used, one CTA, no banned words, short enough, within boundaries
- [ ] [Escalation] Send messages containing "refund", "complaint", "private lesson with Andrew", "switch coaches". All 4 route to human queue within 2 min. Bot sends holding response and stops
- [ ] [Channels] Verify bot responds on: SMS, Instagram DM, Facebook Messenger, web chat. All 4 active
- [ ] [Workflows] Test Workflow 1 (lead pipeline): create new contact > verify first-touch SMS fires within 5 min > verify 48hr follow-up fires if no reply
- [ ] [Workflows] Test Workflow 2 (onboarding): tag contact "Enrolled" > verify welcome message fires within 2 hours
- [ ] [Workflows] Test Workflow 11 (internal alerts): trigger complaint keyword > verify Andrew receives SMS at (949) 241-0847 within 2 min
- [ ] [Website] Load lagunabeachtennisacademy.com > verify chat widget renders > send test message > verify response appears and logs to GHL
- [ ] [Pipeline] Verify GHL pipeline stages exist and contacts move correctly through: New Lead > Trial Scheduled > Enrolled
- [ ] [Tags] Verify auto-tagging: new lead gets "new-lead" tag, no-response after 7 days gets "cold-lead", enrollment gets "enrolled"

## Research Sources

- [GHL Conversation AI Bot Explained](https://help.gohighlevel.com/support/solutions/articles/155000001335)
- [GHL Knowledge Sources & Quality Upgrades](https://help.gohighlevel.com/support/solutions/articles/155000006456)
- [GHL Conversation AI Setup Guide](https://help.gohighlevel.com/support/solutions/articles/155000004401)
- [GHL AI Product Pricing Update](https://help.gohighlevel.com/support/solutions/articles/155000006652)
- [GHL Document Support in Knowledge Base](https://help.gohighlevel.com/support/solutions/articles/155000006671)
- `LBTA_CHATBOT_INTEGRATION_PLAN.md` -- full platform evaluation (GHL vs n8n vs Lindy vs Poppy)
- `LBTA_GHL_Chatbot_FINAL_v3.docx` -- 13 sections, 30+ scenarios, voice-corrected
- `LBTA_GHL_Chatbot_v3.1_PATCH.docx` -- 6 sections: URLs, guarantee, emotions, Racquet Rescue, camps, after-hours
- `LBTA_GHL_Automation_Playbook.docx` -- Workflows 1-6 (lead pipeline, onboarding, retention, re-enrollment, scoring, seasonal)
- `LBTA_GHL_Automation_Tier1_Tier2.docx` -- Workflows 7-17 (reviews, form recovery, cross-sell, win-back, alerts, birthday, weather, waitlist, payments, stale leads)
- `GHL_System_Prompt.md` -- voice-calibrated system prompt for GHL Conversation AI
- `LBTA_GHL_System_Prompt_FINAL_v2.txt` -- previous version (Winter 2025, Ben-era). Superseded by v3
- `LBTA_Automation_Playbook_v2.md` -- 20 automation workflows with confidence ratings (separate from chatbot, covers n8n layer)

## Relevant Learnings

- **From existing codebase:** `lib/gohighlevel.ts` already has GHL API integration (contact create + workflow enrollment via Lead Connector API v2). The chatbot deployment does NOT require changes to this file -- GHL Conversation AI is configured inside GHL, not via API code. However, the website form submissions already flow to GHL via this integration, which means form leads will automatically be available for chatbot workflows
- **From existing UI:** `components/ChatWidget.tsx` is the active GHL widget wrapper and is mounted via `components/layout/ChatWidgetDeferred.tsx`. The decision now is tuning/guardrails (env config, defer behavior, placement), not replacing a placeholder component.
- **From Automation Playbook v2:** The playbook rates 20 automations by confidence level. The chatbot-relevant ones (drip sequences, lead responses, trial confirmations) are all rated 90-97% confidence. The lower-confidence items (AI progress reports, social media posting) are explicitly out of scope
- **Voice calibration source:** v3 Master Playbook is calibrated against 21,428 real texts + 4,141 voice transcripts. Key metrics: "No problem" appears 194x, "Thank you" 120x, "Do you want to" 141x, average parent text is 44 chars. These frequencies are baked into the system prompt and knowledge docs -- no additional voice training needed
- **Previous system prompt (v2) is stale:** References Winter 2025 session, Ben (no longer with LBTA), placement-first enrollment model, and $50 early bird discount. The v3 system prompt supersedes this entirely with Spring 2026 data, Robert as ops lead, and current pricing

## Research Conflicts & Resolution

**Conflict 1: Custom chat UI vs GHL native widget**
- The site now uses `components/ChatWidget.tsx` and `components/layout/ChatWidgetDeferred.tsx` for GHL native web chat. Earlier references to `components/ui/Chatbot.tsx` are legacy.
- **Resolution:** Use GHL native widget (Option A). The custom UI adds maintenance burden, requires API session management, and does not provide CRM logging without additional engineering. The GHL widget handles all of this natively. The custom UI can be archived and resurrected later if LBTA wants brand-specific chat design.

**Conflict 2: System prompt v2 vs v3**
- v2 (`LBTA_GHL_System_Prompt_FINAL_v2.txt`) references Winter 2025, Ben, and outdated pricing.
- v3 (`GHL_System_Prompt.md`) is current for Spring 2026 with Robert, correct pricing, and voice-calibrated rules.
- **Resolution:** Deploy v3 only. Do not upload v2. It will confuse the AI with conflicting session dates and staff references.

**Conflict 3: n8n vs GHL-native for chatbot**
- Automation Playbook v2 (the older doc) assumes n8n as the orchestration layer for most automations.
- The chatbot integration plan evaluated all options and concluded GHL native is correct for the chatbot, with n8n reserved for advanced automations GHL cannot do.
- **Resolution:** Follow the chatbot integration plan. Deploy chatbot natively in GHL. n8n automations (FB lead import, PBP webhooks, city payment parsing, etc.) are separate projects and out of scope for this plan.

## Confidence & Uncertainty

**Plan confidence: HIGH**

All reference documents are complete and deployment-ready. The system prompt, knowledge base, and automation workflows have been written, voice-calibrated, and gap-checked. GHL Conversation AI is a mature product with documented setup procedures. The risk is configuration, not engineering.

**Uncertainty:**
- GHL Conversation AI message quality with the v3 system prompt -- mitigated by Suggestive mode for 2 weeks
- Website widget positioning conflict with StickyCTA -- minor CSS adjustment
- Whether GHL's web chat widget meets LBTA's brand standards visually -- can be styled via GHL widget customization options, or fall back to Option B (custom UI) if needed
- GHL tag and pipeline state may have stale data from previous operations -- Phase 8 prerequisite addresses this

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Bot gives wrong program price or schedule | Start in Suggestive mode (2 weeks). Weekly spot-check of 10 conversations. v3 knowledge docs have all current pricing |
| Bot responds when it should escalate | Explicit escalation rules in system prompt (Section 11 of v3). Test all 12 escalation triggers before launch |
| Parents dislike talking to a bot | Bot voice is calibrated from 21,428 real texts -- sounds like Andrew, not a bot. Escalation to Robert is always one message away |
| Knowledge base goes stale next season | Workflow 6 (Seasonal Transition) is a checklist for updating knowledge docs. Run 2 weeks before each new season |
| GHL Conversation AI model quality degrades | GHL supports multiple models (GPT, Claude, Gemini). Switch models if quality drops |
| Website chat widget conflicts with StickyCTA | Adjust positioning in Phase 3 step 3.4. Both anchor bottom-right; one needs to move |
| GHL has stale or duplicate contacts | Phase 8 prerequisite: verify custom fields, pipeline stages, and tags before deploying automations |
| Internal alerts spam Andrew/Robert | Each alert type has specific triggers with threshold conditions. Speed-to-lead alert only fires if NO response in 10 min. Payment alert only at 21+ days. Review alerts only after positive sentiment |

<!-- Gate: If bot accuracy is below 80% after 2-week Suggestive period, pause Auto-Pilot and retrain knowledge base before proceeding -->

---

## Andrew's Action Items (Prerequisites)

These items require Andrew's or the team's direct action. They are ordered by priority and grouped by effort.

### Do Before Day 1 (under 1 hour total)

| # | Action | Time | Unlocks |
|---|--------|------|---------|
| 1 | Verify GHL API key exists and is labeled (Settings > API Keys) | 5 min | Website form > GHL flow already works |
| 2 | Confirm GHL Conversation AI is enabled on your plan | 5 min | All chatbot functionality |
| 3 | Connect LBTA Instagram account in GHL (if not already) | 10 min | Instagram DM channel |
| 4 | Connect LBTA Facebook page in GHL (if not already) | 10 min | Facebook Messenger channel |
| 5 | Get Google Review direct link for LBTA (Google Maps > Share) | 2 min | Workflow 7 (Review Generation) |
| 6 | Store Google Review link as GHL custom value | 5 min | Auto-populate in review ask messages |

### Do During Week 1

| # | Action | Time | Unlocks |
|---|--------|------|---------|
| 7 | Review 16 message templates in v3 playbook for voice accuracy | 1 hr | Confidence that bot sounds right |
| 8 | Confirm Robert's phone (619) 602-9713 is correct for alerts | 2 min | Workflow 11 (Internal Alerts) |
| 9 | Confirm Saska's phone (949) 656-9165 is correct for alerts | 2 min | Workflow 11 |
| 10 | Test 5 messages to chatbot personally and flag any voice issues | 15 min | Quality gate before Auto-Pilot |

### Do Before Month 1

| # | Action | Time | Unlocks |
|---|--------|------|---------|
| 11 | Capture child DOB during enrollment or onboarding conversations | Ongoing | Workflow 12 (Birthday Messages) |
| 12 | Brief coaches on post-session report format (PUNCHES/STICKER/FLAG) | 30 min | Workflow 13 (Coach Reports) |
| 13 | Define which programs have waitlists and create GHL pipeline stage | 30 min | Workflow 15 (Waitlist) |

---

*LBTA GHL Chatbot Implementation Plan v1.0 | March 30, 2026*
*Platform: GHL Conversation AI (native) + 17 automated workflows*
*Timeline: Day 1-5 for chatbot + Day-1 workflows | Weeks 2-4 for remaining workflows*
*Estimated cost: $16-30/month (GHL AI messages) | Zero additional infrastructure*
