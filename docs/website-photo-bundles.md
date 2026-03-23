# Website photo bundles (`website photos/`)

The repo’s `website photos/` directory is **gitignored** (large binary drops). It is still the **local** place for dated packs such as `LBTA_Website_Ready_2026-03-22/`.

**Those paths are not served by the app.** Copy chosen WebPs into `public/images/` using the mapping in [`photo-map-routing.md`](./photo-map-routing.md). The **source of truth for URLs** is `public/images/` plus `data/*.json` and page components.
