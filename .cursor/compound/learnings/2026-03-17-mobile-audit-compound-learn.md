# Compound Learn — Mobile Phase 1 Audit (2026-03-17)

**Source:** Mobile experience improvement plan Phase 1 (audit baseline).  
**Deliverable:** `plans/mobile-audit-phase1-checklist.md`  
**Scope:** Horizontal scroll, touch targets (48px), input font size (16px+), scroll-anchor, modals at 320/375px.

---

## What was done

- Phase 1 audit executed: viewport checks (320/375px), touch targets, input font size, Schedules scroll-anchor, modal behavior.
- Code review + live browser check (Home, Schedules, Contact) at 320px.
- Checklist created with pass/fail and issues to fix in Phase 2/3.

---

## CORRECTIONS (added to corrections.jsonl)

| Original | Correction |
|----------|------------|
| Submit/CTA with min-width larger than smallest viewport (e.g. min-w-[300px] at 320px) | Use w-full and optional max-w-[300px], or min-w-0 in flex; audit at 320px. |
| Form inputs with font-size below 16px on mobile | Use text-[16px] or text-base for inputs to avoid iOS zoom; Contact and LuxuryRegistrationModal were 15px. |

---

## PATTERNS (added to patterns.json)

- **mobile-audit-baseline:** When implementing or auditing mobile: test at 320/375/768px; no horizontal scroll; primary actions 48×48px; form inputs 16px+; scroll-mt on anchor sections; modals max-h-[90vh] with internal overflow-y-auto. Ref: `plans/mobile-audit-phase1-checklist.md`.

---

## QUALITY BARS (added to quality-bars.json)

- **mobileChecklist:** Before shipping mobile changes: test at 320/375/768px; no horizontal scroll; primary actions ≥48×48px; anchor sections have scroll-mt when sticky nav present. (should)
- **formInput16pxMobile:** Form inputs must use 16px on mobile to avoid iOS zoom. (should)

---

## ANTI-PATTERNS (added to anti-patterns.json)

- **button-min-width-overflow:** CTA/submit with min-width larger than viewport (e.g. min-w-[300px] at 320px) → use w-full max-w-[300px] or min-w-0 in flex.
- **form-input-font-below-16-mobile:** Inputs at 15px or 14px on mobile → use text-base or text-[16px].

---

## Files updated

- `.cursor/compound/learnings/corrections.jsonl` — 2 new lines
- `.cursor/compound/learnings/patterns.json` — 1 new pattern, updated metadata
- `.cursor/compound/learnings/quality-bars.json` — 2 new bars, updated metadata
- `.cursor/compound/learnings/anti-patterns.json` — 2 new anti-patterns, updated metadata
- `.cursor/compound/learnings/LEARNINGS.md` — Recent entry (see below)

---

## Next steps (from audit)

- **Phase 2:** Fix Apply Scholarship button (min-w-[300px] → w-full max-w-[300px]); verify scroll-mt if needed.
- **Phase 3:** Contact form and LuxuryRegistrationModal inputs → 16px.
- Re-run audit at 320/375/768px after Phase 2/3.
