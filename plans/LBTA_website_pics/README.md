# LBTA_website_pics (archives & working exports)

**Not served by the app.** Browsers never load these URLs directly. Use this tree to hold **masters**, **batch exports**, and **coastal pack** work before copying winners into `public/images/`.

## Typical layout (example: coastal pack)

- `…/LBTA-Coastal-Courts-1920x1080/source-png/` — full-size PNGs for re-crops and print.
- `…/LBTA-Coastal-Courts-1920x1080/webp/` — encoded WebPs for QA; **promote** the chosen files to `public/images/facility/` with the names the site expects (see `docs/photo-map-routing.md`).

## Workflow

1. Edit or export from masters in `source-png/` (or your DAM).
2. Encode WebP into `webp/` (or this folder’s equivalent).
3. Pick final crops and **copy** (don’t symlink in Git unless the team standardizes it) into `public/images/...`.
4. Update `docs/photo-map-routing.md` if the mapping is new.
5. Run `npm run verify:images`.

Keeping heavy archives here avoids bloating **production** `public/` while preserving sources for the next redesign.
