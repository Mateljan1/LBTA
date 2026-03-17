# ActiveCampaign Contacts Organization — Implementation Plan

**Compound-engineering plan:** Organize ActiveCampaign contacts so they align with City receipt history, Google Sheets program signups, and the LBTA Unified Ops Master (Airtable-integrated), with a clear list/tag taxonomy and a single source of truth.

**Created:** 2026-03-15  
**Data sources reviewed:**  
- `city_class_summary_full_history.csv`, `city_class_breakdown_who_took_what_full_history.csv`  
- LBTA_from_google_sheets/*.csv (Adult Beginner, Adult Advanced, Adult Intermediate, Cardio Tennis, Live Ball Advance/Intermediate/Drop-In, Youth Development, Jr. Champions, Summer Camp)  
- `LBTA_Unified_Ops_Master_v1_1_airtable_integrated_20260221_140554.xlsx` (People_Master, Raw_Receipts_All, People_Master_V1, Tag_Discrepancy_V1, etc.)

---

## 1. Overview

Today, AC has one master list (ID 4) and tags for program (CLASS_TAGS), campaign (CAMPAIGN_TAGS), and lead source (SOURCE_TAGS). Contact data lives in multiple places: City receipts (participant + account/family), Google Sheets per program (mixed participant/parent, “CLB Website” / “Unbounce Lead”), website forms (upsert → list 4 + tags), and the Unified Ops Master xlsx with People_Master and Airtable sync (at_ac_contact_ids, at_tags). There is no single source of truth, no mapping from receipt/sheet program names to AC tags, and duplicate/family-vs-participant ambiguity. This plan defines a target AC structure, contact model, program-name normalization, and sync strategy so contacts are organized and usable for segmentation and campaigns.

---

## 2. Problem Statement

- **Single list:** Everyone is on list 4; no segmentation by program, lifecycle, or source for campaigns.
- **Multiple sources:** City receipts (participant_name, account_name, signed_up_for, dates, spend), Google Sheets (Name, Email, Phone, Class Name, Additional Tagging), website forms, and Unified Ops (People_Master with person_id, segment_primary, player_status, class_interest_primary, classes_all, at_ac_contact_ids). No canonical “who is in AC and with which tags.”
- **Program naming mismatch:** Receipts use long names (e.g. “LBTA Tennis and Swim Camp Week 5”, “LBTA Adult Lessons SP22 - Intermediate - 1x a week”). Code maps site program names to CLASS_TAGS via `getClassTagFromProgram()`; receipt/sheet names are not normalized to that taxonomy.
- **Duplicate risk:** Same person as participant in one source and account/payer in another; parent vs child email. Need rules for who is the “contact” in AC (e.g. household/payer vs player).
- **Tag taxonomy:** Only program + campaign + source tags. No lifecycle (lead / active player / alumni) or “source system” (website / Unbounce / City receipt / sheet) consistently applied. Tag_Discrepancy_V1 in the xlsx shows Airtable vs registry tag issues.
- **Sync direction unclear:** Should AC be fed from Unified Ops (People_Master + deltas), from receipts + sheets directly, or stay website-first with “organize existing AC” only?

---

## 3. Proposed Solution

### 3.1 Contact model (who is the “contact” in AC)

- **Recommendation:** Treat **one contact = one person/household identity** (email-centric). Prefer **payer/parent email** as the primary contact when both participant and account exist (e.g. City receipts: account_name → contact; sheets: use “Email” as contact, Name can be participant or parent). Document the rule: “AC contact = person who receives email; for minors, use parent/guardian email.”
- **Unified Ops as reference:** People_Master (person_id, full_name, email, phone, segment_primary, player_status, class_interest_primary, classes_all, source_contact_ids, at_ac_contact_ids) is the best single view of “person.” Use it to resolve duplicates and to drive AC contact ID mapping where Airtable sync exists (People_Master_V1.at_ac_contact_ids).

### 3.2 List and tag taxonomy (target state)

- **Lists:**  
  - **Keep list 4** as the main “LBTA Master” list for all marketing/ops (no change to existing automations).  
  - **Optional later:** Add segment lists (e.g. “Adult Programs”, “Junior Programs”, “Leads Only”) only if you need list-based automations; otherwise rely on **tags** for segmentation so one contact stays on one list.
- **Tags (extend current; single source of truth in `lib/activecampaign.ts`):**  
  - **Program (CLASS_TAGS):** Keep and extend mapping so receipt/sheet program names resolve to these (see 3.3).  
  - **Campaign (CAMPAIGN_TAGS):** Keep (trial_request, website_registration, jtt_spring_2026, scholarship, etc.).  
  - **Source (SOURCE_TAGS):** Keep; add or map “Unbounce Lead”, “CLB Website” from sheets’ “Additional Tagging” to existing or new source tags.  
  - **Lifecycle (new):** Add tags for Lead / Active Player / Alumni (or use one “Player” tag + “Lead” tag) if you want lifecycle-based segments; optional Phase 2.  
  - **Data source (new, optional):** e.g. “Imported from City Receipts”, “Imported from Sheet – Adult Beginner” for audit; optional Phase 2.

### 3.3 Program name normalization (receipts + sheets → AC tags)

- **Build a mapping layer:** Receipt and sheet “program”/“Class Name”/“signed_up_for” values must map to `CLASS_TAGS` (and optionally to a human-readable segment: Junior / Youth / Adult / Fitness).  
- **Approach:**  
  - **Option A (recommended):** Add a **data file** (e.g. `data/activecampaign-program-mapping.json` or `data/ac-program-name-to-tag.json`) that lists normalized program keys and their AC tag IDs. Populate it from: (1) existing `getClassTagFromProgram()` logic (invert to “these strings → tag”), (2) City receipt `signed_up_for` distinct values, (3) Sheet “Class Name” distinct values. Use a single **normalizeProgramToTag(programName: string): number | null** that: (a) normalizes string (lowercase, trim), (b) matches against patterns or key list in the mapping file, (c) returns CLASS_TAG id.  
  - **Option B:** Extend `getClassTagFromProgram()` in `lib/activecampaign.ts` to accept the long receipt/sheet names and add branches for “tennis and swim camp”, “adult lessons … intermediate”, “live ball … drop-in”, etc. Option A is more maintainable and keeps mapping data-driven.  
- **Deliverable:** One mapping file + one function used by any script or MCP that “tags by program” from receipts or sheets; `lib/activecampaign.ts` can re-export the function and tag IDs.

### 3.4 Dedupe and merge strategy

- **By email:** Before creating a new AC contact, check if contact exists by email (AC API or People_Master.at_ac_contact_ids). If exists: update fields if needed, add to list 4 if not already, apply tags. If not exists: create contact, add to list 4, apply tags.  
- **Household vs player:** Do not create separate AC contacts for each child if the same parent email is used; one contact per email. Store “participant names” or “classes taken” in custom fields if needed (optional Phase 2).  
- **Unified Ops:** Where People_Master has at_ac_contact_ids, use that as the canonical link. When syncing from receipts or sheets, try to match by email to People_Master first; if matched, use that person’s at_ac_contact_id for AC updates.

### 3.5 Sync / source-of-truth workflow

- **Phase 1 (this plan):**  
  - **Website forms:** Remain the primary live source; no change to form APIs (still upsert → list 4 + tags).  
  - **Organize existing AC:** (1) Audit current AC contacts and tags via MCP or API. (2) Document current list/tag state and gaps. (3) Add program-name mapping (data file + normalizeProgramToTag). (4) Do **not** bulk overwrite AC from receipts/sheets until Phase 2; instead, produce a **report** of “contacts in receipts/sheets not in AC” and “AC contacts not in People_Master” for manual or scripted review.  
- **Phase 2 (follow-up):**  
  - **One-way sync into AC:** From Unified Ops (People_Master) or from a consolidated “contact list” derived from receipts + sheets + People_Master, run a script (or MCP-driven job) that: creates/updates AC contacts, adds to list 4, applies tags by normalized program and source. Schedule or run on-demand.  
  - **Airtable:** If Airtable remains the ops hub, keep Airtable ↔ People_Master as master; treat “sync to AC” as an export from that master (so AC is a downstream copy for email marketing).

### 3.6 What “organized” means (success criteria)

- One **documented** list/tag taxonomy (list 4 + CLASS_TAGS + CAMPAIGN_TAGS + SOURCE_TAGS; optional lifecycle/source tags).  
- A **program-name → tag** mapping (file + function) covering receipt and sheet program names.  
- **No duplicate AC contacts** for the same email; merge/dedupe rules documented.  
- **Segmentation ready:** Can build AC segments (or automations) by “program = Adult Beginner”, “source = Unbounce”, “has tag Trial Request”, etc.  
- **Alignment with Unified Ops:** Where People_Master has at_ac_contact_ids, those IDs match AC; report of “in AC but not in People_Master” and “in People_Master but not in AC” available for cleanup.  
- **Existing automations preserved:** List 4 and tags 82, 33, 107, 108 continue to trigger “LBTA Confirmations” automation; no breaking changes.

---

## 4. Implementation Steps

### Phase 1: Audit and taxonomy (no bulk writes to AC)

| Step | Task | Owner / Notes |
|------|------|----------------|
| 1.1 | **Audit AC state** — Use AC MCP or API to list contacts (sample), lists, and tags. Document current tag IDs and names in AC UI vs `lib/activecampaign.ts`. | Script or MCP |
| 1.2 | **Extract distinct program names** — From `city_class_breakdown_who_took_what_full_history.csv` (signed_up_for) and from each Google Sheet CSV (Class Name). Produce a single list of distinct program names. | Script (Node or Python) |
| 1.3 | **Define mapping file** — Create `data/ac-program-name-to-tag.json` (or equivalent) with structure e.g. `{ "patterns": [ { "pattern": "adult beginner", "tagId": 17 }, ... ], "exact": { "LBTA Adult Beginners Tennis SP24 Drop-in June": 17 } }`. Populate from getClassTagFromProgram logic and from step 1.2. | Manual + code |
| 1.4 | **Implement normalizeProgramToTag()** — In `lib/activecampaign.ts` or a small `lib/ac-program-mapping.ts`, read mapping and expose `normalizeProgramToTag(programName: string): number | null`. Use for any future sync from receipts/sheets. | Code |
| 1.5 | **Document taxonomy** — Update `docs/activecampaign-setup-checklist.md` (or create `docs/activecampaign-contacts-taxonomy.md`) with: list 4, all tag IDs (CLASS_TAGS, CAMPAIGN_TAGS, SOURCE_TAGS), rule “one contact = one email / household rep”, and where the program mapping file lives. | Docs |
| 1.6 | **Report: contacts in data not in AC** — For each sheet and receipt breakdown, take distinct emails; compare to AC contact list (by email). Output: “Emails in receipts/sheets with no AC contact” and “Emails in AC not found in People_Master” (if People_Master available). No writes; report only. | Script |

### Phase 2: Optional lifecycle/source tags and sync

| Step | Task | Owner / Notes |
|------|------|----------------|
| 2.1 | **Add lifecycle/source tags in AC** (optional) — Create tags in AC UI for Lead, Active Player, etc., and for “Imported from City Receipts”, “Imported from Sheet – …”. Add IDs to `lib/activecampaign.ts` if used by code. | Manual + code |
| 2.2 | **Sync script design** — Design a script or MCP-driven flow: input = People_Master (or consolidated CSV), output = create/update AC contact, add to list 4, apply tags (program + source). Use normalizeProgramToTag and dedupe by email. | Design |
| 2.3 | **Run sync (dry-run then live)** — Dry-run: log what would be created/updated. Then run for a small batch; verify in AC. Then run for full set. | Script + manual |
| 2.4 | **Reconcile with Airtable** — If Airtable has at_ac_contact_ids, ensure sync script updates Airtable with AC contact ID when creating new AC contacts, or document that Airtable is updated separately. | Optional |

### Phase 3: Google Sheets “Additional Tagging” → AC source tags

| Step | Task | Owner / Notes |
|------|------|----------------|
| 3.1 | **Map sheet source values to SOURCE_TAGS** — “CLB Website” → existing website/source tag; “Unbounce Lead” → create or map to a source tag. Document in taxonomy. | Docs + AC UI |
| 3.2 | **When syncing from sheets** — Apply both program tag (from Class Name via normalizeProgramToTag) and source tag (from Additional Tagging). | Sync script |

---

## 5. Files to Create / Modify

| File | Action | Purpose |
|------|--------|---------|
| `data/ac-program-name-to-tag.json` | Create | Mapping from receipt/sheet program names to AC CLASS_TAG ids. |
| `lib/ac-program-mapping.ts` (or extend `lib/activecampaign.ts`) | Create / Modify | `normalizeProgramToTag(programName)`, read from data file. |
| `docs/activecampaign-contacts-taxonomy.md` | Create | List/tag taxonomy, contact model, dedupe rules, mapping file location. |
| `docs/activecampaign-setup-checklist.md` | Modify | Add link to taxonomy doc; note program mapping. |
| `scripts/audit-ac-contacts.js` or `.mjs` | Create | Optional; list AC contacts (paginated), tags, lists; output summary. |
| `scripts/report-contacts-not-in-ac.js` | Create | Optional; distinct emails from receipts + sheets; compare to AC; output report. |
| `lib/activecampaign.ts` | Modify | Only if new tags (lifecycle/source) added; export new tag IDs and keep CLASS_TAGS/CAMPAIGN_TAGS/SOURCE_TAGS as single source of truth. |

---

## 6. Success Criteria

- [ ] Program-name → tag mapping file exists and is used by a single function.  
- [ ] Taxonomy doc exists (list 4, all tags, contact model, dedupe rule).  
- [ ] At least one “report” run: emails in receipts/sheets not in AC (or vice versa).  
- [ ] Existing automations (List 4, tags 82, 33, 107, 108) unchanged and still firing.  
- [ ] No bulk delete or overwrite of AC contacts without explicit approval.  
- [ ] (Phase 2) Optional: sync script runs successfully for a batch and AC segments by program/source are usable.

---

## 7. Research Sources

- **Codebase:** `lib/activecampaign.ts` (LBTA_LIST_ID, CLASS_TAGS, CAMPAIGN_TAGS, SOURCE_TAGS, getClassTagFromProgram).  
- **Docs:** `docs/activecampaign-setup-checklist.md`, `docs/activecampaign-mcp-setup.md`, `plans/activecampaign-ghl-connect-plan.md`.  
- **Data:** City receipt CSVs (summary + breakdown), LBTA_from_google_sheets/*.csv, LBTA_Unified_Ops_Master xlsx (People_Master, People_Master_V1, Raw_Receipts_All, Tag_Discrepancy_V1).

---

## 8. Relevant Learnings

- **Single source of truth:** List and tag IDs must live in `lib/activecampaign.ts`; any new tag used by the site or scripts should be added there and documented.  
- **No hardcoded IDs in components:** Program/tag mapping belongs in lib or data, not in UI.  
- **Compound:** After implementing Phase 1, run `/compound:learn` to capture any new patterns (e.g. “program name normalization pattern”) or anti-patterns (e.g. “don’t bulk-update AC without dry-run”).

---

## 9. Risks and Mitigations

| Risk | Mitigation |
|------|-------------|
| Bulk sync creates duplicates | Dedupe by email before create; always “find by email” then update or create. |
| Bulk sync overwrites existing tags | Logic: “add tag if not present” rather than “set tags to exactly X”. |
| Breaking “LBTA Confirmations” automation | Do not remove or rename list 4 or tags 82, 33, 107, 108; only add new tags. |
| Receipt/sheet program names change over time | Mapping file is data; add new entries when new program names appear; consider periodic re-extraction of distinct names (step 1.2). |
| People_Master and AC diverge | Phase 1 report highlights “in AC not in People_Master”; Phase 2 sync can be run periodically to align AC to People_Master (or document manual process). |

---

## 10. Next Steps

1. **Approve this plan** (adjust scope if needed: e.g. Phase 1 only vs Phase 2 sync).  
2. **Execute Phase 1** — Steps 1.1–1.6 (audit, mapping file, normalizeProgramToTag, docs, report).  
3. **Review report** — Decide whether to run Phase 2 sync and how often.  
4. **Optional:** Use AC MCP (ac_list_contacts, ac_list_tags, ac_add_tag_to_contact, etc.) to automate audit or small batch tag updates during testing.
