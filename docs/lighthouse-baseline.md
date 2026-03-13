# Performance & SEO Baseline (Track 4)

**Purpose:** Record performance and SEO setup: hero video formats, Lighthouse runs, and meta audit. Detailed Lighthouse scores and responsive/quality checks live in [quality-gate.md](./quality-gate.md).

---

## Hero video

- **WebM:** `/videos/LBTA-Home-Hero.webm` — primary (all modern browsers).
- **MP4 (optional):** `/videos/LBTA-Home-Hero.mp4` — Safari fallback. Wired in `HomeHero.tsx`; add the file to `public/videos/` when available. Until then, Safari may use poster or WebM where supported.

**Status:** WebM only by default; MP4 path ready for when you supply the file.

---

## Lighthouse

Run via npm (dev server must be running on port 3000):

```bash
npm run dev   # in one terminal
npm run lighthouse   # in another
```

Report is written to `docs/lighthouse-report.html`. For full checklist and baseline table (home, schedules, programs), see [quality-gate.md](./quality-gate.md) §1.

**Last run:** _Record date and scores in quality-gate.md after each run._

---

## Meta audit

Key pages audited for unique `title` and `description` (and OpenGraph where present):

| Page       | Route            | Status   |
|------------|------------------|----------|
| Home       | `/`              | Unique   |
| Schedules  | `/schedules`    | Unique   |
| Programs   | `/programs`      | Unique   |
| About      | `/about`         | Unique   |
| Contact    | `/contact`       | Unique   |
| Book       | `/book`          | Unique   |
| Coaches    | `/coaches`       | Unique   |
| Camps      | `/camps`         | Unique   |
| FAQ        | `/faq`           | Unique   |

**Meta audit:** **Complete** (2026-03-13). No missing or duplicate page titles/descriptions; root layout provides default, each key page overrides with distinct meta.
