# Compound Learn — Validation 89→100 & Session Learnings (2026-03-14)

**Source:** Compound validate run + push to 100/100.  
**Scope:** Chatbot/ChatWidget a11y, siteCopy centralization, LeaguesData/Year2026 single type, pricing-supplemental Zod, form-config test, docs, next.config Turbopack.

---

## Corrections captured

| Original | Correction |
|----------|------------|
| ChatWidget Send button 44px, no focus ring | Use min-w-[48px] min-h-[48px] and focus-visible:ring-2 focus-visible:ring-brand-sunset-cliff focus-visible:ring-offset-2 (WCAG touch target + focus). |
| Chatbot quick-reply/Send only py-2 | Add min-h-[48px] so touch target ≥48px. |
| StickyCTA, beginner-program, camps each import pricing-supplemental + type assertion for siteCopy | Centralize: lib/site-copy.ts with getters (getStickyCtaSchedules, getBeginnerProgramCohort, getCampsHeading); lib/pricing-supplemental.ts single Zod parse; consumers use getters only. |
| LeaguesData in client, server cast as unknown as LeaguesData | Single type: export LeaguesData from lib/schedule-schemas.ts (alias of LeaguesDataValidated); client imports from schema; remove cast on schedules page. |
| Year2026Sections in client, server cast as unknown as Year2026Sections | Same pattern: export Year2026Sections from schedule-schemas; client uses that type; remove cast. |
| Form-config program IDs vs registrationModalPricing unchecked | Add lib/form-config.test.ts: every getAllConfiguredPrograms() ID must be in Object.keys(registrationModalPricing). |
| Chat success response field undocumented | Document in docs/api-notes.md: success uses `reply`, not `message`. |
| Turbopack workspace-root warning (multiple lockfiles) | Set turbopack.root in next.config (e.g. __dirname) so build uses project as root. |

---

## Patterns reinforced

| Pattern | When | Example |
|---------|------|---------|
| **Single type from Zod schema** | Data passed server→client with runtime validation | LeaguesData, Year2026Sections: export type from schedule-schemas (z.infer or alias); parse on server; client imports type; no cast. |
| **Site copy / modal pricing from one loader** | Multiple components need same JSON slice | lib/pricing-supplemental.ts parses once with Zod; form-config uses registrationModalPricing; site-copy.ts uses siteCopy; getters with fallbacks. |
| **Touch target + focus ring for all interactive buttons** | Any button (especially in chat/widget) | min-h-[48px] (or 48×48); focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-sunset-cliff focus-visible:ring-offset-2. |
| **Data integrity test for config vs data** | Form/config keys must match a data source | Test: getAllConfiguredPrograms() ⊆ Object.keys(registrationModalPricing). |

---

## Quality bars updated

- **A11y:** All icon/primary buttons: 48×48 min touch target + visible focus-visible ring (brand-sunset-cliff or equivalent).
- **Data:** Schedule/shared JSON types: single source in lib (Zod schema); export type; no `as unknown as T` at boundary.
- **API docs:** Document success/error response shape (e.g. chat uses `reply`); document body content-type (JSON) where required.

---

## 100/100 fixes applied this session

1. Chatbot.tsx: min-h-[48px] on quick-reply and Send buttons.
2. next.config.js: top-level `turbopack: { root: __dirname }` (Next.js 16; do not use experimental.turbo).
3. docs/api-notes.md: Note that register-program and register-year expect application/json.
4. schedule-schemas.ts: export type Year2026Sections = Year2026SectionsValidated; SchedulesPageClient imports and re-exports; schedules page removes cast.
