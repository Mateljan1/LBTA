# Retire Postmark + Notion → consolidate on GHL + Airtable
**Date:** 2026-05-14
**Author:** Andrew + AI agent
**Trigger:** Andrew's directive after the 2026-05-13 lead-pipeline incident — "what if we are not going to use postmark anymore? can we send this out via ghl? … connect to our airtable instead of notion as a backup."

## Overview
Eliminate two integrations (Postmark, Notion) by consolidating their roles onto two integrations we already pay for and operate (GHL, Airtable). Net result: fewer credentials to rotate, fewer canary paths, one workspace for the team to look at, and Andrew can edit notification recipients/templates in the GHL UI without a deploy.

## Problem Statement
Today the lead pipeline has **five** outbound integrations per submission: Supabase (lead store), ActiveCampaign (CRM segmentation), GHL (SMS workflow), Notion (lead-database backup), Postmark (transactional email — internal notifications + customer confirmations). The 2026-05-13 incident demonstrated that the more credentialed integrations we have on the critical path, the more silent-failure surfaces we own. Two of these are duplicative:

- **Postmark for internal notifications** duplicates what GHL workflow can already do (it currently sends SMS — adding "Send Internal Notification" + "Send Email" actions is a UI change, not a code change).
- **Notion as a "lead backup"** duplicates Supabase + the Airtable workspace Andrew already runs for receipts/students. Two team-facing stores split context.

Removing Postmark also resolves the open Postmark token rotation blocker from the prior incident — if we don't use Postmark, the token is moot.

## Proposed Solution
Two phases, in order of safety:

### Phase A — Notion → Airtable (low-risk, additive)
1. Add `lib/airtable-leads.ts::writeAirtableLead` mirroring the shape of `lib/notion-leads.ts::writeNotionLead`. Uses the Airtable REST API directly (no SDK; same pattern as `lib/email.ts`'s direct Postmark fetch). Optional via env vars — no-op when unset.
2. Replace every `writeNotionLead(...)` call in `app/api/{book,register,register-program,register-year,scholarship,newsletter,jtt-registration}/route.ts` and the chat handler with `writeAirtableLead(...)`.
3. Delete `lib/notion-leads.ts` and remove the `@notionhq/client` dependency from `package.json` (saves ~200KB cold-start).
4. Add the new env vars to `lib/env.ts::ENV_VARS` (`AIRTABLE_API_KEY`, `AIRTABLE_BASE_ID`, `AIRTABLE_LEADS_TABLE_NAME`).
5. Add an Airtable canary step to `lib/leads-canary.ts` (`GET https://api.airtable.com/v0/meta/bases/{baseId}/tables` returns 200 if the API key + base are valid).
6. Update `.cursor/compound/learnings/anti-patterns.json` and `quality-bars.json` to reference Airtable instead of Notion.

### Phase B — Postmark → GHL workflow (touches conversion path)
Two GHL workflow actions handle what `lib/email.ts` did:
1. **"Send Internal Notification"** — GHL action sends to staff (configured in GHL UI: `andrew@tennisbeast.com`, `support@…`, etc.). Replaces every `notifyTrialRequest`, `notifyPrivateLesson`, `notifyRegistration`, `notifyScholarship`, `notifyNewsletter`, `notifyContactForm`, `notifyChatWidget`.
2. **"Send Email"** action with a contact-templated branded HTML — sends to `{{contact.email}}`. Replaces every `sendTrialConfirmationEmail`, `sendPrivateLessonConfirmationEmail`, `sendContactFormConfirmationEmail`, `sendRegistrationConfirmation` (if any), etc.

GHL workflow paths are decided by tags. We already pass `tags: ['Trial Request']`, `tags: ['Private Lesson']`, etc. via `sendToGHL()` — the workflow's "If/Else" action routes by tag to the appropriate email template. **This is a UI configuration job in GHL, not code.**

Code changes:
1. Delete `lib/email.ts` (or stub it to a no-op for backwards compat during rollout).
2. Remove `notify*` / `send*Email` imports + calls from every API route.
3. Remove the `POSTMARK_SERVER_TOKEN`, `POSTMARK_FROM_EMAIL`, `NOTIFICATION_EMAILS` references from `lib/env.ts`.
4. Remove the `postmark-token` step from `lib/leads-canary.ts`.
5. Update `.cursor/compound/learnings/quality-bars.json::externalIntegrationMustHaveCanary` to reference GHL instead of Postmark.
6. Remove `POSTMARK_SERVER_TOKEN` from Vercel env (Production + Preview).

The GHL canary step we **add**: `GET https://services.leadconnectorhq.com/locations/{locationId}` with `Authorization: Bearer ${GHL_API_KEY}` and `Version: 2021-07-28` — returns 200 if the API key is valid for that location. Same shape as the Postmark `/server` ping.

## Implementation Steps

### Phase A — Airtable
- [ ] A1.1: Andrew confirms the Airtable base ID + leads table name (or creates a new base if needed). Defines columns matching what `writeNotionLead` currently writes (parentName, email, phone, program, category, notes, source, createdAt).
- [ ] A1.2: Andrew generates a personal access token in Airtable scoped to that base, adds it to Vercel as `AIRTABLE_API_KEY` (Production + Preview + Development).
- [ ] A1.3: Add `AIRTABLE_API_KEY`, `AIRTABLE_BASE_ID`, `AIRTABLE_LEADS_TABLE_NAME` to `lib/env.ts::ENV_VARS`.
- [ ] A1.4: Create `lib/airtable-leads.ts::writeAirtableLead(params: AirtableLeadParams)` — POSTs to `https://api.airtable.com/v0/{baseId}/{tableName}` with bearer auth. Schema-shape: `{ fields: { Name, Email, Phone, Program, Category, Notes, Source, CreatedAt } }`. Field-name mapping documented in a comment.
- [ ] A1.5: Add `lib/airtable-leads.test.ts` — unit-tests the no-op behavior when env unset, the URL/header construction (mocked fetch), and field mapping.
- [ ] A1.6: Replace `writeNotionLead(...)` with `writeAirtableLead(...)` in every API route that calls it (grep for `writeNotionLead`).
- [ ] A1.7: Add Airtable step to `lib/leads-canary.ts::runLeadCanary` — `airtable-meta` step pings the base meta endpoint to verify auth.
- [ ] A1.8: Delete `lib/notion-leads.ts`. Remove `@notionhq/client` from `package.json` dependencies. Run `npm install` to regenerate `package-lock.json`.
- [ ] A1.9: Test locally: `npm run smoke:lead-canary` shows new `airtable-meta` step ✓; manually POST `/api/book` and verify a row lands in Airtable.
- [ ] A1.10: Quality gate, commit, push, run `health:prod` + manual canary probe.

### Phase B — GHL takes over email
- [ ] B2.1: **Andrew configures the GHL workflow** (in GHL UI):
  - Add "Send Internal Notification" action to the workflow with appropriate recipients.
  - Add "Send Email" action with branded customer-confirmation template (rebuild the Postmark HTML in GHL's email editor, or use a simpler text template to start).
  - Use If/Else branches keyed on the contact tag (Trial Request, Private Lesson, Newsletter, Scholarship, Registration) to route to the right email template per submission type.
  - Test by manually adding a test contact to the workflow with each tag set.
- [ ] B2.2: Code change — remove all `notify*` and `send*Email` imports + calls from API routes. Replace with comments pointing at the GHL workflow as source of truth.
- [ ] B2.3: Delete `lib/email.ts`. Remove `assets/emails/lbta-spring-2026.html` references if any in code (the file itself stays as a Postmark/AC asset history).
- [ ] B2.4: Remove `POSTMARK_SERVER_TOKEN`, `POSTMARK_FROM_EMAIL`, `NOTIFICATION_EMAILS` from `lib/env.ts::ENV_VARS`.
- [ ] B2.5: Remove the `postmark-token` step from `lib/leads-canary.ts`. Add `ghl-auth` step that pings `GET /locations/{locationId}` with the API key.
- [ ] B2.6: Update `.cursorrules` Part 5 (Tech Stack) to reflect GHL as the email path instead of Postmark.
- [ ] B2.7: Update `.cursor/compound/learnings/quality-bars.json::externalIntegrationMustHaveCanary` reference.
- [ ] B2.8: Test locally — submit a form, confirm GHL workflow fires both notifications.
- [ ] B2.9: Quality gate, commit, push, `health:prod`, canary probe.
- [ ] B2.10: Andrew removes `POSTMARK_SERVER_TOKEN` and `POSTMARK_FROM_EMAIL` from Vercel env (Production + Preview).
- [ ] B2.11: Wait 24h for the GHL workflow to handle real traffic. Verify in Vercel logs that no `[email]` errors appear and that GHL contact creates + workflow enrolls succeed at the prior rate.

## Files to Create/Modify
| File | Action | Purpose |
|---|---|---|
| `lib/airtable-leads.ts` | Create | Airtable POST client; replaces Notion |
| `lib/airtable-leads.test.ts` | Create | Unit tests |
| `lib/notion-leads.ts` | Delete | Replaced by Airtable |
| `lib/email.ts` | Delete | Replaced by GHL workflow |
| `lib/leads-canary.ts` | Modify | Drop Postmark step; add Airtable + GHL steps |
| `lib/env.ts` | Modify | Add Airtable env; remove Postmark |
| `app/api/book/route.ts` | Modify | Replace writeNotionLead + notify* calls |
| `app/api/register/route.ts` | Modify | Same |
| `app/api/register-program/route.ts` | Modify | Same |
| `app/api/register-year/route.ts` | Modify | Same |
| `app/api/scholarship/route.ts` | Modify | Same |
| `app/api/newsletter/route.ts` | Modify | Same |
| `app/api/jtt-registration/route.ts` | Modify | Same |
| `app/api/chat/route.ts` | Modify | Same |
| `package.json` | Modify | Drop @notionhq/client; bump scripts if needed |
| `.cursorrules` | Modify | Update Part 5 (Tech Stack) and Part 14 (Forbidden Patterns) |
| `.cursor/compound/learnings/quality-bars.json` | Modify | Update integration references |

## Out of scope (this plan)
- Migrating historical Notion leads into Airtable (separate one-shot script, optional)
- Rebuilding the full branded HTML email templates in GHL (Andrew's UI work — this plan only ensures the *code* path is correct; the *content* is configured separately)
- Replacing GHL itself (we're consolidating on GHL, not away from it)
- Touching ActiveCampaign segmentation — AC stays as the CRM source of truth
- Migrating `assets/emails/*.html` (those are AC campaign assets, separate from transactional email)

## Success Criteria
- [ ] Form submissions write to Airtable (visible in the base) instead of Notion.
- [ ] Form submissions trigger GHL workflow → Andrew receives both an internal notification (email or SMS, his choice) and the lead receives a customer confirmation email — both via GHL.
- [ ] `npm run smoke:lead-canary` runs ✓ across all steps including new `airtable-meta` and `ghl-auth` steps; no `postmark-token` step.
- [ ] Lead pipeline canary green within 6h of deploy.
- [ ] No `[email]` errors in Vercel logs over a 24h window after Phase B ships.
- [ ] `POSTMARK_SERVER_TOKEN` removed from Vercel env (Production + Preview).
- [ ] `@notionhq/client` removed from `package.json` and not in `node_modules`.

## Acceptance checklist
| # | Acceptance item | Verification |
|---|---|---|
| A1 | Form submission lands in Airtable | submit /book test form, look in Airtable base → see new row within 5s |
| A2 | Form submission still creates AC contact + GHL contact + Supabase row | submit, check `/coach-hub/leads` + AC list 4 + GHL contacts |
| A3 | GHL workflow sends internal notification | Andrew receives email or SMS within 60s of submission |
| A4 | GHL workflow sends customer confirmation | submit with a real test inbox, receive confirmation within 60s |
| A5 | Lead canary green | `curl ... /api/cron/leads-canary` returns 200 with all steps ok:true |
| A6 | No Postmark references in code | `rg -i postmark lib/ app/api/ scripts/` returns 0 matches in non-deleted code |
| A7 | No Notion references in code | `rg -i 'writeNotionLead\|notion-leads' lib/ app/api/` returns 0 matches |

## Research Sources / Citations
- `lib/email.ts` — current Postmark integration shape; lines 67-105 (sendEmail), 187-637 (notify functions).
- `lib/notion-leads.ts` — current Notion integration shape; the writeNotionLead signature is what `writeAirtableLead` mirrors.
- `lib/gohighlevel.ts:6` — GHL workflow currently described as "SMS workflow"; the comment is accurate today, will be updated when workflow gains email actions.
- Airtable Web API docs: https://airtable.com/developers/web/api — `POST /v0/{baseId}/{tableName}` with `Authorization: Bearer {token}` and a `{ fields: {...} }` body.
- GHL workflow actions: "Send Internal Notification" + "Send Email" are first-class actions in any GHL workflow editor — no API needed beyond the existing `addContactToWorkflow()`.
- `.cursor/compound/learnings/2026-05-13-lead-pipeline-resilience-compound-learn.md` — established the canary pattern + quality bars this plan extends.

## Relevant Learnings
- **Pattern: `lead-pipeline-canary-cron`** — extend the existing canary with new steps for Airtable + GHL; same exit-code semantics. (Source: this repo's patterns.json.)
- **Anti-pattern: `silent-failure-on-credentialed-integration`** — every new credentialed integration we add MUST come with a canary step. Both Airtable and GHL get canary steps in this plan to honor that rule.
- **Quality bar: `externalIntegrationMustHaveCanary` (must)** — enforcement here: A5 in the acceptance checklist.

## Research conflicts & resolution
- **Open question:** does the existing GHL workflow already have email actions? Andrew's check (Phase B prerequisite). If yes, code change is even smaller — just remove the Postmark calls; workflow already does the right thing. If no, Andrew configures actions in GHL UI before B2.2.
- **Open question:** should we keep Notion as a *third-tier* archival store (write to Supabase + Airtable + Notion) or full removal? Plan defaults to full removal per Andrew's "instead of notion" wording. If Notion has dependencies elsewhere (e.g. the Coach Hub or a manual workflow), call out before we delete.

## Confidence & uncertainty
**Plan confidence:** Medium-high.

**Uncertainty:**
- Branded HTML fidelity in GHL email editor — GHL's editor is less flexible than handcrafted HTML. Customer confirmations may look noticeably different. Mitigation: Andrew reviews the GHL email preview before B2.2.
- Phase B requires Andrew to do GHL UI configuration before code goes out. If he doesn't, leads fall on the floor (no email anywhere) for the period between Postmark removal and GHL workflow update. Mitigation: gate Phase B's deploy on Andrew confirming GHL workflow is configured AND tested.
- Airtable rate limits (5 req/sec per base on the standard plan). At LBTA's ~3 leads/day this is irrelevant, but the canary at every-6h adds 4/day — total still trivial. No mitigation needed.

## Risks & Mitigations
| Risk | Mitigation |
|---|---|
| Phase B ships before GHL workflow is configured → leads silent | Hard gate: Andrew confirms in writing (or via test submission to dev) that the GHL workflow sends both notifications BEFORE we deploy Phase B. The canary will catch a misconfigured workflow within 6h. |
| GHL email deliverability worse than Postmark | Postmark is purpose-built for transactional; GHL is general. For internal notifications this doesn't matter (Andrew sees them in his inbox or doesn't). For customer confirmations, deliverability matters more — recommend a 1-week monitoring window after B ships, with fallback option to revert just the customer-confirmation path back to a transactional service (or use a dedicated transactional sender configured in GHL). |
| Airtable schema drift if columns change names | Keep the column-mapping in one place (`lib/airtable-leads.ts`); columns are referenced by name. If Andrew renames a column in Airtable UI, code breaks at write-time → canary catches in 6h. |
| Removing `lib/email.ts` breaks something I missed | Phase B is one PR, full quality-gate, full canary verification before merge. Stage as feature-flag-able if Andrew prefers extra safety. |
| Notion lead history loss | Phase A is additive at first if needed (write to both for one week), then delete Notion. Default plan is straight swap; Andrew can request the safety variant. |

## Step dependencies
- Phase A (A1.1 → A1.10) is fully independent of Phase B. Can ship first as its own PR.
- Phase A depends on Andrew creating the Airtable base + token (A1.1, A1.2) — no other code work blocked.
- Phase B depends on Andrew configuring GHL workflow email actions (B2.1) — no code change blocked, but the deploy gate requires it tested.
- B2.10 (removing Postmark env) can happen any time after B2.9 ships — independent step.

## Gate before Deploy
- All Acceptance items A1–A7 verified.
- `npm run quality-gate` exits 0.
- `npm run smoke:lead-canary` exits 0 against local + against prod URL post-deploy.
- For Phase B specifically: Andrew has confirmed GHL workflow sends both notifications via a manual test submission.
