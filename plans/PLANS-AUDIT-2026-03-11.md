# Plans audit — 2026-03-11

**Purpose:** Confirm which plans are finished and updated, and what (if anything) is missing.

---

## ✅ Confirmed finished and updated

| Plan | Status | Notes |
|------|--------|--------|
| **schedules-page-ux-overhaul-plan.md** | **Done (core)** | Phases 1–3 all [x]. Phase 4 (active section highlighting) is optional and left [ ]. Success criteria in plan are not ticked; behavior is implemented (see plan-implementation-status-2026-03-11.md). |
| **apply-brand-guide-to-website-plan.md** | **Done** | All implementation steps and success criteria [x]. Compound loop (completed) section present. |
| **canva-image-setup.md** | **Done (reference)** | Process doc only; no code to implement. Use when creating/exporting images. |
| **coaches-page-overhaul-plan.md** | **Done** | All phases [x] including 5.1 (View full bio: focus ring, 48px, aria-hidden). Michelle removed in separate change; data/coaches.json and layout polish align with plan. |

---

## 📋 Optional / not yet done

| Item | Plan | Status |
|------|------|--------|
| **Active section highlighting** | schedules-page-ux-overhaul-plan Phase 4 | Optional. IntersectionObserver + aria-current in SchedulesAnchorNav. Can do later if desired. |
| **Success criteria checkboxes** | schedules-page-ux-overhaul-plan | Plan’s “Success Criteria” section still has [ ]. Behavior is implemented; you can tick them for accuracy. |
| **Homepage full overhaul** | homepage-overhaul-plan.md | Not fully executed. Many steps still [ ]. Some pieces exist (e.g. homepage-copy.json, hero). Treat as future/optional unless you want to run it next. |

---

## 🔍 Other plans (summaries / historical)

These are review summaries, code-review reports, or past compound runs—not “implementation plans” to complete:

- compound-review-summary-*, compound-validation-full-*, compound-validate-deploy-*
- plan-implementation-status-2026-03-11.md (audit of the three main plans)
- COMPOUND_LEARN.md, COMPOUND_LEARNINGS*.md (learnings log)
- homepage-media-brief.md, homepage-overhaul-review-summary.md (supporting docs)
- design-alignment-*, lbta-design-alignment-plan.md, design-alignment-whats-left.md
- coaches-deploy-summary, coaches-validation-summary, coaches-page-fix-checklist, etc.
- CODE_REVIEW_*, VALIDATE_*, DEPLOY_*, etc.

No action needed unless you are continuing a specific initiative (e.g. design alignment, homepage overhaul).

---

## Summary: are we missing anything?

- **Schedules UX, Brand guide, Canva, Coaches:** All confirmed finished and updated (coaches 5.1 marked [x]).
- **Optional:** Schedules Phase 4 (active section); optionally tick schedules success criteria; homepage overhaul is future work.
- **Nothing critical missing.** Site is in a good state: data single source, brand guide applied, schedules navigable, coaches polished, hero clearance and a11y fixes deployed. Next steps are either optional polish (e.g. Phase 4) or new initiatives (e.g. homepage overhaul, design alignment).
