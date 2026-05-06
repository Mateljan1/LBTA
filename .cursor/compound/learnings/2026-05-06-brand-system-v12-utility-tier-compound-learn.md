# Brand System v1.2 — Utility Tier + Page Audit + Pattern Lockdown

**Date:** 2026-05-06
**Predecessor:** `2026-05-06-brand-system-lockdown-compound-learn.md` (v1.1)
**Commit:** `bd702bf`
**Trigger:** User asked "is our website following this? all our website?" — sharp follow-up that revealed v1.1 was incomplete in claim, not in foundation.

## What this captured

v1.1 locked the foundation (zero hard violations, CI-enforced). v1.2 went deeper:
- **A.** Formalized the 4 allowed `lbta-*` utility classes (slate, stone, red, black) as a separate semantic tier from brand identity colors. Migrated `lbta-secondary` → `lbta-slate` (43 instances). Expanded checker's deprecation list 4 → 11 names.
- **B.** Added pattern-lockdown scans (hand-rolled eyebrows, hand-rolled section padding) as **information-only**, never blocking CI.
- **C.** First-ever page-by-page audit — 39 routes, scored against drift baseline, written to `docs/brand-page-audit-2026-05-06.md`.

## Patterns to repeat

### 1. The "is the website following this?" follow-up question deserves data, not reassurance

User's question was sharper than the answer the v1.1 commit message implied. Real answer required running:
- `npm run tokens:check -- --all` (current state)
- HTTP audit of all 39 routes
- Per-file hand-rolled-pattern count from the auto-generated audit report

The data revealed: foundation is locked (0 violations) but consistency is partial (202 informational hand-rolled patterns). **Be honest about the gap between "passes the checker" and "fully on-system."**

**Pattern:** When the user asks a follow-up that suggests skepticism, don't restate confidence. Run the actual data and show both the green and the gray-zone numbers.

### 2. Two-tier color namespace (brand identity vs system utility)

Trying to migrate every `lbta-*` to `brand-*` would have either:
- Expanded the brand to 16 colors (violates the 11-color rule), OR
- Forced renaming utility colors with brand-style names (Pacific Dusk for a generic gray text doesn't make sense)

The right answer is to **acknowledge two tiers**:
- `brand.*` for identity (12 colors, Pacific palette)
- `lbta.*` for utility/semantic roles (4 colors: slate, stone, red, black)

Document the tier split clearly. Deprecate everything else in the lbta namespace. This preserves brand purity without forcing fake brand-name expansion.

**Pattern:** When a single namespace is straining to do two jobs, formalize the split rather than collapsing one into the other.

### 3. Information-only checker scans for migration-friendly drift

Hand-rolled eyebrow patterns aren't bugs — they render correctly. Forcing strict-mode failures on 202 instances would block all unrelated PRs. Shipping them as **information-only** (excluded from strict-mode totals, but printed in the audit report) creates gentle visibility without breaking work.

**Pattern:** When a guardrail finds drift that's "should-fix not must-fix," ship it as info-only and document the migration priority. Strict-mode promotion happens later, in a coordinated cleanup.

### 4. Eat your own dog food — `/brand` showcase uses what it teaches

When the new utility-colors section was added to `/brand`, my first version hardcoded the 4 hex values (#6B6B6B etc.) — and the strict checker caught it immediately ("4 raw hex literals in app/brand/page.tsx"). Fix: import `LBTA` from `lib/brand-tokens.ts` and use `LBTA.slate` etc.

**Pattern:** The showcase page is the highest-stakes example of using the system. If it can't follow its own rules, the rules aren't usable. The strict checker enforcing this on the showcase itself is a feature, not friction.

## Anti-patterns to avoid

### A. Restating v1.1 success when v1.2 work is needed

When the user pushed back ("is our website following this?"), the wrong answer would have been to recap v1.1 numbers. The right answer was to find the gaps the v1.1 audit didn't surface — legacy `lbta-*` namespace cluttering, hand-rolled patterns no checker catches, 42 of 47 pages never visually verified. **Be additive, not defensive, when challenged.**

### B. Migrating just because you can

I almost expanded `brand.*` to 16 colors to support the lbta utility colors as "brand". That would have violated the 11-color rule and diluted the brand identity. The right move was to **stop, acknowledge two tiers, document the split** — not to force consistency at the cost of meaning.

### C. Strict-mode-blocking too aggressively

The temptation with the new hand-rolled-eyebrow scan was to flip it to error. 202 instances would have broken every PR until cleaned up. The right move was **info-only** — surface the drift, document the cleanup priority, let it happen as files are touched.

## Corrections (for `corrections.jsonl`)

```jsonl
{"timestamp": "2026-05-06T20:30:00Z", "original": "Mass-migrating lbta-* utility classes to brand-* by inventing new brand color names", "correction": "Acknowledge a two-tier system: brand.* for identity (locked at 11+1 colors), lbta.* for 4 utility colors (slate/stone/red/black). Deprecate every other lbta-* name. Document the split.", "keywords": ["brand", "tokens", "namespace", "utility"], "project": "lbta-website"}
{"timestamp": "2026-05-06T20:30:00Z", "original": "Hardcoding hex values in the brand showcase page itself", "correction": "Even the showcase uses BRAND/LBTA constants from lib/brand-tokens.ts. The strict checker catches this and that's a feature.", "keywords": ["brand", "showcase", "tokens"], "project": "lbta-website"}
{"timestamp": "2026-05-06T20:30:00Z", "original": "Flipping a new code-quality scan to strict mode immediately, blocking unrelated work", "correction": "New checker scans ship as info-only first, with documented migration priority. Promote to strict only after a coordinated cleanup.", "keywords": ["ci", "guardrails", "process"], "project": "lbta-website"}
```

## Patterns (for `patterns.json`)

- **two-tier-namespace** — When a token namespace serves two jobs (e.g. brand identity + system utility), formalize the split with documented rules per tier rather than collapsing one into the other or forcing fake naming.
- **info-only-then-strict** — Ship new code-quality scans as information-only first; surface drift in audit reports without blocking CI. Promote to strict mode later, after coordinated cleanup. Avoids "new linter blocks every PR" failure mode.
- **showcase-eats-own-dogfood** — The brand/system-showcase route should be subject to the same strict checks as the rest of the codebase. If it can't pass, the system isn't usable as designed.
- **page-audit-from-checker-data** — A page-by-page audit doesn't need manual visual inspection of every page; it can be derived from per-file checker output (HTTP-200 status + hand-rolled-pattern count + violation count). Cheap, repeatable, real data.

## Standards (for `quality-bars.json`)

- **Hand-rolled eyebrow patterns:** Surface as informational warnings; do not block builds. Document baseline count in `docs/brand-audit-YYYY-MM-DD.md`. Migrate opportunistically when files are touched. Promote to strict only after coordinated cleanup.
- **Page audit cadence:** After any system-wide brand/CSS change, generate a page-by-page audit doc with HTTP status, drift score, and per-file pattern counts. Date-stamped: `docs/brand-page-audit-YYYY-MM-DD.md`.
- **Two-namespace discipline:** `brand.*` is brand identity (max 12 colors). `lbta.*` is utility/system (4 colors: slate, stone, red, black). All other lbta-* names are deprecated and forbidden in new code.

## What's next (queued, not done)

- **Mobile sweep** (`plans/2026-05-06-mobile-responsive-sweep-plan.md`) — verify all 47 routes at 320/375/768/1024/1440
- **Email brand audit** (`plans/2026-05-06-transaction-email-brand-audit-plan.md`)
- **SEO audit** (`plans/2026-05-06-seo-schema-audit-plan.md`)
- **Hand-rolled eyebrow cleanup** — top 5 leverage targets per `docs/brand-page-audit-2026-05-06.md`: LuxuryYearModal, camps/page, LuxuryRegistrationModal, SchedulesPageClient, UtrWeekAtGlanceBanner

The hand-rolled cleanup is the next /compound:plan candidate if the user wants to keep going. ~1 day for the top 5, would drop the 202 count by ~60.
