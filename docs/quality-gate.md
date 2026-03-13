# LBTA Site — Quality Gate

**Purpose:** Single place to record verification results from .cursorrules Part 16 and design-alignment checks. Run periodically and before major releases.

**Target:** Lighthouse ≥90 (Performance, Accessibility, Best Practices, SEO); no horizontal scroll at required breakpoints; no forbidden copy in user-facing strings; build and lint pass.

---

## 1. Lighthouse

Run on **homepage**, **schedules**, and **one program page** (e.g. `/programs/junior`).

```bash
# Homepage only (dev server must be running: npm run dev)
npm run lighthouse

# Full run (home + schedules + one program) — run dev server first
npx lighthouse http://localhost:3000 --only-categories=performance,accessibility,best-practices,seo --output=json --output-path=./docs/lighthouse-home.json --chrome-flags="--headless --no-sandbox"
npx lighthouse http://localhost:3000/schedules --only-categories=performance,accessibility,best-practices,seo --output=json --output-path=./docs/lighthouse-schedules.json --chrome-flags="--headless --no-sandbox"
npx lighthouse http://localhost:3000/programs/junior --only-categories=performance,accessibility,best-practices,seo --output=json --output-path=./docs/lighthouse-programs.json --chrome-flags="--headless --no-sandbox"

# Or with --view and HTML for human reading
npx lighthouse http://localhost:3000 --view --output=html --output-path=./docs/lighthouse-home.html
```

| Page        | Performance | Accessibility | Best Practices | SEO  | Date       |
|-------------|-------------|---------------|----------------|------|------------|
| Home        | 72          | 94            | 65             | 100  | 2026-03-13 |
| Schedules   | —           | —             | —              | —    | _pending_  |
| Programs    | —           | —             | —              | —    | _pending_  |

**Baseline (last run):** Home run 2026-03-13 (localhost). Performance and Best Practices below 90 (typical for dev; production often scores higher). Fix any score &lt; 90 if feasible (e.g. image `sizes`, LCP, minify). Full report from `npm run lighthouse`: `docs/lighthouse-report.html`. For JSON or multiple pages, use the manual commands above.

---

## 2. Responsive

Test at **320px**, **375px**, **768px**, **1024px**, **1440px** on:

- `/` (homepage)
- `/schedules`
- `/contact`
- `/book`

**Check:** No horizontal scroll or overflow; text readable without zoom.

| Breakpoint | Home | Schedules | Contact | Book | Date       |
|------------|------|-----------|---------|------|------------|
| 320px      | —    | —         | —       | —   | _pending_  |
| 375px      | —    | —         | —       | —   | _pending_  |
| 768px      | —    | —         | —       | —   | _pending_  |
| 1024px     | —    | —         | —       | —   | _pending_  |
| 1440px     | —    | —         | —       | —   | _pending_  |

**Responsive check passed:** _Yes/No (date)_

---

## 3. Forbidden copy

Grep for forbidden words/phrases in **user-facing** code and data (`app/`, `components/`, `data/`):

- maximize, boost, elite, world-class, mastery  
- "Sign up now!", "Don't miss out!"

**Forbidden copy pass:** **Clean** (2026-03-13) — No matches in `app/`, `components/`, or `data/*.json`.  
_(Docs/plans may use words in context; only user-facing copy is in scope.)_

---

## 4. Accessibility

Spot-check:

- **7:1 contrast** — Footer and dark sections use `text-white/50` or higher (WCAG 7:1).
- **Hero CTA** — Solid background (e.g. `bg-white`) on dark hero, not text-only.
- **Keyboard** — All interactive elements reachable; focus order logical.
- **Focus states** — Visible 2px ring (e.g. `focus-visible:ring-2`).
- **Touch targets** — Minimum 48×48px on mobile.

Optionally run Lighthouse Accessibility or axe.

**A11y note:** Lighthouse a11y score 94 (home 2026-03-13). Spot-check (7:1 contrast, hero CTA, keyboard, focus, 48px) can be run when doing the full responsive pass; optional until then.

---

## 5. Build and lint

```bash
npm run build
npm run lint
```

**Build:** **Pass** (2026-03-13)  
**Lint:** **Pass** (2026-03-13)

---

## Every PR / periodic

- **Every PR:** `npm run build` and `npm run lint` must pass.
- **Periodically:** Run Lighthouse (§1), responsive (§2), and forbidden-copy (§3) and update this doc.

See [Site polish and upgrades plan](../plans/site-polish-and-upgrades-plan.md) Track 1 for full checklist.
