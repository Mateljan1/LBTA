# `public/images/players/` (optional per-player folders)

Use this tree when a player needs **more than one shipped crop** (card, event, coaching-with-coach, etc.) with stable filenames.

**Today:** Most assets still live under `success-stories/` and `results/`; see [`data/player-media.json`](../../../data/player-media.json) for the current map.

**When you add a folder** (e.g. `players/karue-sell/card.webp`):

1. Copy or export WebPs here; keep names predictable (`card.webp`, `coaching.webp`, …).
2. Update [`data/player-media.json`](../../../data/player-media.json) and the consuming JSON/pages.
3. Run `npm run verify:images` and [`docs/photo-map-routing.md`](../../../docs/photo-map-routing.md).

Avoid duplicating the same shot in multiple folders; one file, many references.
