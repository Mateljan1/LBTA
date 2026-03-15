# ActiveCampaign or GoHighLevel — Simpler Setup Plan

**Purpose:** Make CRM/email setup "even more simple" — either by simplifying how you configure ActiveCampaign, or by adding/supporting GoHighLevel so you have one clear path and fewer manual steps.

---

## Overview

The site currently integrates only with **ActiveCampaign**: forms send contacts to List 4 and apply tags; you create four automations in the AC UI (List 4 welcome, Trial tag, JTT tag, Scholarship tag). **GoHighLevel** appears in legacy email templates and research docs (Airtable + GHL + PlayByPoint) but has **no** API integration in the app. This plan gives two paths: (1) simplify AC setup so it feels like one flow, or (2) add GHL as an alternative or primary so you can choose one platform.

---

## Problem Statement

- **Today:** You follow `docs/activecampaign-setup-checklist.md` and create four separate automations in ActiveCampaign (List 4, tag 82, tag 107, tag 108). That’s four places to configure and keep in sync.
- **Desired:** "Even more simple" — fewer manual steps, one place to look, or the option to use GoHighLevel if that’s already (or will be) your main CRM.

---

## Current State (Reference)

| What | Where |
|------|--------|
| Contact creation + list + tags | `lib/activecampaign.ts`; APIs: book, register-program, register-year, newsletter, scholarship, jtt-registration |
| Webhook (inbound from AC) | `app/api/activecampaign-webhook/route.ts` |
| Setup instructions | `docs/activecampaign-setup-checklist.md`, `docs/registration-flows-and-ops.md` |
| GHL | Email templates in `emails/nurture-sequence/`; no env vars, no API calls in app |

---

## Proposed Solution (Two Paths)

### Path A — Simplify ActiveCampaign (no platform change)

**Idea:** One automation in AC instead of four.

- **Single “LBTA Confirmations” automation:**  
  Trigger: “Contact is added to List 4” **or** “Contact receives any of tags 82, 107, 108.”  
  Inside the automation: **conditions** — if tag 82 → send trial confirmation; if tag 107 → send JTT confirmation; if tag 108 → send scholarship confirmation; else (no tag or just list add) → send general welcome.
- **Result:** You create **one** automation and one email per type (or one email with merge/conditions). Checklist becomes: “Create one automation; add four triggers; add conditional actions.”
- **Optional:** Document “add contact to automation” (AC API `contactAutomations`) so the site could add contacts to a single “LBTA Confirmation” automation by ID; then that automation handles branching. Still requires one automation built in AC UI.

**Deliverables (Path A):**

- Update `docs/activecampaign-setup-checklist.md` to a **single-automation** setup: one workflow, triggers for List 4 + tags 82/107/108, conditional sends. Optional: short “Alternative: four separate automations” for those who prefer that.
- No code changes required (IDs in `lib/activecampaign.ts` stay the same).

---

### Path B — Add or switch to GoHighLevel

**Idea:** Support GHL so you can run on one platform (GHL) or choose between AC and GHL.

- **B.1 — GHL as additional destination (dual-write):**  
  Keep AC; add optional GHL: when `GHL_API_KEY` (and optionally location/pipeline IDs) are set, also create/update contact in GHL and add to a workflow or apply tags. One checklist for GHL (create contact, add tag, add to workflow) mirroring AC.
- **B.2 — GHL as alternative (configurable):**  
  Env decides which CRM to use (e.g. `CRM_PROVIDER=activecampaign` or `gohighlevel`). All form APIs call a small abstraction (e.g. `lib/crm.ts`) that delegates to `lib/activecampaign.ts` or new `lib/gohighlevel.ts`. One checklist per provider.
- **B.3 — Migrate AC → GHL:**  
  Remove AC from code; only GHL. Single checklist, single set of env vars. Best if you are standardizing on GHL and Notion only.

**Deliverables (Path B) — scope depends on B.1 vs B.2 vs B.3:**

- **lib/gohighlevel.ts:** Create contact, add tag(s), optionally add contact to workflow (GHL API: create contact, add tag, add to workflow by ID).
- **Env:** e.g. `GHL_API_KEY`, `GHL_LOCATION_ID` (and optional `GHL_PIPELINE_ID`, `GHL_WORKFLOW_ID` or tag IDs if needed).
- **Integration points:** Either dual-write from existing routes (if B.1) or `lib/crm.ts` + switch in routes (if B.2) or replace AC calls with GHL (if B.3).
- **docs/gohighlevel-setup-checklist.md:** Step-by-step: create workflow(s), create tags, note IDs; optional “one workflow with tag triggers” (same idea as Path A but in GHL).
- **docs/registration-flows-and-ops.md:** Update “Where to look” and flow table to include GHL when in use.

**Risks (Path B):** More code and two possible CRMs to maintain (if B.1/B.2). Migration (B.3) requires removing AC and testing all forms.

---

## Recommendation

- **If the goal is “simpler setup” with no platform change:** Do **Path A** first. One automation in AC with triggers + conditions is the smallest change and makes the checklist much shorter.
- **If you want to use or try GoHighLevel:** Do **Path B.1** (dual-write) or **Path B.2** (configurable) so the site can send to GHL; then use a single GHL workflow + tag triggers (like Path A) in `docs/gohighlevel-setup-checklist.md`. Path B.3 only if you are dropping AC entirely.

---

## Implementation Steps

### Path A — Simplify ActiveCampaign only

- [ ] **A.1** Rewrite `docs/activecampaign-setup-checklist.md` around **one** automation: “LBTA Confirmations.”
- [ ] **A.2** Document triggers: contact added to List 4; contact receives tag 82, 107, or 108. Document conditional actions: by tag, send trial / JTT / scholarship / welcome email. Optional: link to AC help or screenshot.
- [ ] **A.3** Add an “Alternative: four separate automations” section for users who prefer one automation per trigger. Keep list/tag IDs (4, 82, 107, 108) in the doc.
- [ ] **A.4** No code or env changes. Build/lint unchanged.

### Path B — GoHighLevel integration (choose B.1, B.2, or B.3)

- [ ] **B.0** Decide: dual-write (B.1), configurable provider (B.2), or migrate off AC (B.3). Document decision in this plan or a short ADR.
- [ ] **B.1** **GHL API module:** Create `lib/gohighlevel.ts`: get/create contact by email, add tag(s), add contact to workflow (use GHL API docs). Use env `GHL_API_KEY`, `GHL_LOCATION_ID`; optional workflow/tag IDs if fixed.
- [ ] **B.2** **Wire forms:** For B.1: from each form API (book, register-program, register-year, newsletter, scholarship, jtt-registration), if GHL env is set, call GHL after (or instead of) AC. For B.2: introduce `lib/crm.ts` that calls AC or GHL based on `CRM_PROVIDER`. For B.3: remove AC calls and use only GHL.
- [ ] **B.3** **Docs:** Add `docs/gohighlevel-setup-checklist.md` (workflows, tags, IDs). Update `docs/registration-flows-and-ops.md` and `.env.example` (GHL vars). Update README to mention GHL when applicable.
- [ ] **B.4** **Validation:** Build + lint; test form submissions with GHL (and optionally AC) in dev; update smoke test if needed.

---

## Files to Create/Modify

| File | Path A | Path B |
|------|--------|--------|
| `docs/activecampaign-setup-checklist.md` | Modify (one-automation flow) | No change or small note |
| `lib/gohighlevel.ts` | — | Create |
| `lib/crm.ts` | — | Create (if B.2) |
| `app/api/book/route.ts` (and register-program, register-year, newsletter, scholarship, jtt-registration) | — | Modify (call GHL or crm abstraction) |
| `docs/gohighlevel-setup-checklist.md` | — | Create |
| `docs/registration-flows-and-ops.md` | — | Modify (GHL in table + “Where to look”) |
| `.env.example` | — | Add GHL_* |
| `lib/env.ts` | — | Add GHL env helpers if needed |
| `plans/activecampaign-or-ghl-simplify-setup-plan.md` | Tick A.1–A.4 | Tick B.0–B.4 |

---

## Success Criteria

**Path A:**

- [ ] AC setup doc describes one main automation with triggers and conditions; optional “four automations” section remains.
- [ ] No code changes; list/tag IDs (4, 82, 107, 108) still match `lib/activecampaign.ts`.

**Path B:**

- [ ] GHL contact + tag (and optionally workflow) work from at least one form (e.g. book or newsletter); other forms wired per B.1/B.2/B.3.
- [ ] GHL setup checklist exists; registration-flows-and-ops reflects GHL when in use.
- [ ] Build and lint pass; no regressions for existing AC behavior (unless B.3).

---

## Research Sources

- ActiveCampaign: workflows (workflows array), add contact to automation (`contactAutomations`), [developers.activecampaign.com](https://developers.activecampaign.com).
- GoHighLevel: Create Contact, Add Contact to Workflow, tag triggers — [marketplace.gohighlevel.com](https://marketplace.gohighlevel.com/docs).
- In-repo: `lib/activecampaign.ts`, `docs/activecampaign-setup-checklist.md`, `docs/registration-flows-and-ops.md`, `.env.example`.

---

## Relevant Learnings

- **external-system-setup-checklist:** One actionable doc per system (AC or GHL) with IDs from code; cross-reference from registration-flows-and-ops.
- **plan-doc-checkbox-hygiene:** Tick steps when done; keep one source of truth for “what’s configured.”

---

## Next Step

Choose **Path A** (“simplify AC only”), **Path B.1** (“add GHL alongside AC”), **Path B.2** (“choose AC or GHL via env”), or **Path B.3** (“migrate to GHL only”). Then run **Work** on the selected path (e.g. “Execute Path A of activecampaign-or-ghl-simplify-setup-plan” or “Do Path B.1 — add GHL dual-write”).
