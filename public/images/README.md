# Production images (`public/images/`)

**Only paths under this tree are valid for Next.js `<Image src="/images/...">` and CSS `url(/images/...)`**. Everything here ships to Vercel.

## Rules

| Rule | Why |
|------|-----|
| **WebP first** for photos | Smaller payloads; use PNG only for logos, print, or rare exceptions. |
| **Target ≤ ~350 KB** for large heroes when possible | Re-encode from masters in `plans/` if a file is huge; code uses `quality={95}` (standard) or `100` (full-bleed heroes). |
| **Semantic folders** | Put files where the name matches *purpose*, not shoot date—see table below. |
| **No new references to `legacy-working-assets/`** for user-facing photos | Migrate into `/images/` when you replace an asset (see `docs/photo-map-routing.md`). |
| **After adding or renaming files** | Run `npm run verify:images` and update `docs/photo-map-routing.md` if the mapping changed. |

## Folder map (what goes where)

| Folder | Contents |
|--------|----------|
| `hero/` | Site-wide hero stills, video poster (`hero-poster.webp`), horizon shots. |
| `facility/` | Coastal / courts pack (overview, sunset hero, detail courts, coaching drill). |
| `founder/` | Founder on-court and related. |
| `results/` | Player-success band assets that are **not** only success-story portraits (e.g. national event crops). |
| `success-stories/` | Per-player story cards and shared success imagery. |
| `philosophy/` | Three pillars (movement, discipline, …). |
| `homepage/` | Homepage-only crops (e.g. philosophy community) if not shared with philosophy folder. |
| `programs/` | Program cards, pathways, youth/adult/fitness tiles. |
| `community/` | Community masonry and social proof grids. |
| `coaches/` | Coach headshots and coach-page assets. |
| `destination/` | Legacy/alternate destination stills if not using `facility/`. |
| `cta/` | Bottom-of-page CTA backgrounds. |
| `book/`, `camps/`, `schedules/`, `leagues/`, `fitness/`, `about/`, `contact/` | Section-specific heroes and cards. |
| `why-choose/` | Optional legacy; homepage may point at `facility/` instead—check `data/homepage-copy.json`. |
| `print/` | Print/PDF-specific assets. |
| `players/` | Optional per-player subfolders when multiple crops ship; see [`players/README.md`](./players/README.md). |

## Masters and workfiles (not here)

- **Archives & PNG masters:** `plans/LBTA_website_pics/` — see `plans/LBTA_website_pics/README.md`.
- **Dated export bundles:** `website photos/` (local, gitignored) — see [`docs/website-photo-bundles.md`](../docs/website-photo-bundles.md).
- **Full workflow:** `plans/photo-asset-library-and-routing-plan.md`.

## Player photos

- **Index:** [`data/player-media.json`](../data/player-media.json) lists roles (success story card, home carousel, etc.) and paths.
- **Per-player folders:** [`players/`](./players/README.md) — use when you add multiple crops; until then paths stay under `success-stories/` and `results/` as today.
