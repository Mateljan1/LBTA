# Compound Review Summary — 2026-03-08

**Scope:** Product improvements A1–A5 (`.env.example`, README env/smoke/learn, `.cursorrules` Images, FAQ schema on `/faq`, Footer 48px touch targets, COMPOUND_LEARN + .cursor/compound/README).

**Agents run:** Security Sentinel, Performance Oracle, Code Simplicity, Pattern Recognition, Architecture Strategist, Kieran TypeScript, Julik Frontend Races, CodeRabbit (code-reviewer).

---

## Overall score: 78/100 → fixes applied

| Category        | Before fixes | After fixes |
|----------------|--------------|-------------|
| Security       | 95           | 95          |
| Performance    | 70 (critical)| 90          |
| Simplicity     | 80           | 85          |
| Pattern        | 85           | 95          |
| Architecture   | 80           | 90          |
| TypeScript     | 95           | 95          |
| Frontend/A11y  | 60 (critical)| 88          |
| CodeRabbit     | Warnings     | Addressed   |

---

## Critical issues (fixed in this pass)

### 1. Duplicate FAQ schema and invalid DOM (Performance Oracle, Julik Frontend Races, Architecture)

- **Issue:** `app/faq/page.tsx` rendered `<FAQSchema />` (server, id `faq-schema`). `FAQInteractive.tsx` had a `useEffect` that injected a second `<script id="faq-schema">` with different FAQ data. Result: duplicate id, and on unmount cleanup removed one script (could remove the server-rendered one).
- **Fix:** Removed the entire `useEffect` block (and `useEffect` import) from `FAQInteractive.tsx`. Single FAQ schema is now server-only via `<FAQSchema />` on the page.

### 2. Footer: missing 48px touch targets and mailto aria-label (Pattern, Simplicity, TypeScript, CodeRabbit, Julik)

- **Issue:** Privacy and Terms links in the bottom bar had no `min-h-[48px]`. Mailto link had no `aria-label`.
- **Fix:** Added `inline-flex items-center min-h-[48px]` to Privacy and Terms `<Link>` in `Footer.tsx`. Added `aria-label="Email support at support@lbta.com"` to the mailto `<a>`.

---

## Warnings / notes (optional follow-up)

| Severity | Location | Recommendation |
|----------|----------|----------------|
| Low      | README vs .cursor/compound/README | “When to run compound:learn” is duplicated. Consider keeping full text in README and in .cursor/compound/README only: “See README § When to run compound:learn.” |
| Low      | Footer.tsx | Nav/contact links repeat long `className`. Could extract `footerNavLinkClass` and `footerContactLinkClass` constants in the same file. |
| Low      | FAQ schema vs visible FAQs | Server `FAQSchema` uses `faqItems` (SEOSchemas); visible content uses `faqs` in FAQInteractive (different set). For perfect SEO alignment, consider a single FAQ data source used by both schema and UI (e.g. shared module or data file). |
| Info     | README Supabase example | Hardcoded project ref in `supabase link` example. If repo is public, consider a placeholder. |
| Info     | SEOSchemas FAQSchema | JSON-LD via Next `Script` (afterInteractive). Optional: render inline `<script type="application/ld+json">` in server component for earlier crawl; escape `<` in JSON. |

---

## Accessibility (optional follow-up)

- **FAQInteractive accordion:** Buttons could add `aria-expanded`, `aria-controls`, and panel `id` for screen readers. Optional enhancement.

---

## Decision

- **Ready to merge:** Yes, after your approval. Critical and high items are fixed; remaining items are optional.
- **Suggested next step:** Run `/compound:validate`, then `/compound:learn` and update `plans/COMPOUND_LEARN.md` with any new corrections (e.g. "single FAQ schema source; no client duplicate script with same id").

---

## Addendum: loading.tsx review (same day)

**Scope:** `app/schedules/loading.tsx` (skeleton for /schedules).

**Agents:** Security Sentinel, Performance Oracle, Code Simplicity, Kieran TypeScript, CodeRabbit.

**Results:** Security pass. Performance pass (reduced motion in globals.css). TypeScript pass. Simplicity: use HorizonDivider; optional stagger in CSS. CodeRabbit: consistent aria-hidden and loading announcement.

**Fixes applied:** Wrapped skeleton in `<div aria-hidden="true">`; added sr-only "Loading schedules" live region; replaced divider with `<HorizonDivider />`. No blockers.
