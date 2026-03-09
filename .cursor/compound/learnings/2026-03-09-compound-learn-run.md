# Compound Learn Run — 2026-03-09

**Trigger:** `/compound:learn` after compound work (error text standardization, contrast note, HorizonDivider docs).

---

## Scope of work captured

- Error/required text standardized to `text-lbta-red` in NewsletterForm, TrialBookingModal, LuxuryYearModal.
- Error callouts use `bg-lbta-red/5 border-lbta-red/20` (no raw red-50/red-200).
- WCAG AAA contrast note: lbta-red #F04E23 on morning-light #FAF8F4 may be below 7:1 — verify with WebAIM; add darker semantic error token if needed.
- HorizonDivider: always renders `<hr>`; no `as` prop (YAGNI). Docs updated in COMPOUND_LEARN.md and LEARNINGS.md.

---

## Updates applied

| Artifact | Action |
|----------|--------|
| **corrections.jsonl** | +4 entries: error/required → text-lbta-red; error box tokens; HorizonDivider no as; lbta-red contrast verify |
| **anti-patterns.json** | +2: `error-text-raw-red`, `horizon-divider-as-prop` |
| **quality-bars.json** | Already updated: `errorTextLbtaRed`, `errorTextContrastWcagAaa` |
| **patterns.json** | Already updated: `error-required-text-lbta-red` |
| **plans/COMPOUND_LEARN.md** | Learn run log entry added |
| **.cursor/compound/learnings/LEARNINGS.md** | Already updated (HorizonDivider quality bar) |

---

## CORRECTIONS (this run)

1. Error or required text using raw red (text-red-400/500/800) → use text-lbta-red; error boxes bg-lbta-red/5 border-lbta-red/20.
2. HorizonDivider with optional as prop → component always `<hr>`; use variant and className only.
3. Using lbta-red for error text on light background without verifying WCAG AAA → verify with WebAIM; add darker token if targeting AAA.

---

## ANTI-PATTERNS (this run)

1. **error-text-raw-red** — Form error/required with text-red-* or bg-red-50/border-red-200; use text-lbta-red and bg-lbta-red/5 border-lbta-red/20.
2. **horizon-divider-as-prop** — Passing as prop to HorizonDivider; use variant + className only, no as.

---

## PATTERNS / STANDARDS (already in session)

- Pattern: error-required-text-lbta-red (forms; text-lbta-red, error box tokens, verify contrast).
- Quality bars: errorTextLbtaRed (should), errorTextContrastWcagAaa (should).

---

## Addendum — internal tools lbta-red

**Trigger:** `/compound:learn` after optional fix (AnalyticsDashboard, ComprehensiveFormTester).

**corrections.jsonl:** +1 — Internal/dev tools using raw red for error or destructive UI → use text-lbta-red, bg-lbta-red/5, border-lbta-red/20, bg-lbta-red/10 for brand consistency.
