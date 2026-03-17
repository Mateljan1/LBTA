# LBTA Website Image Assets

This folder is organized for developer handoff.

Each collection contains:
- `source-png/` for original master PNG files
- `webp/` for lossless production-ready fallback assets
- `avif/` for premium high-quality primary assets
- `asset-manifest.csv` for filename and alt-text mapping

Recommended implementation order:
- Use `avif` first
- Fallback to `webp`
- Keep `source-png` as source/master only

Current encoding profile:
- `webp/` was regenerated in lossless mode for maximum fidelity
- `avif/` was regenerated with the highest-fidelity settings available in the local encoder

Collections:
- `LBTA-Coastal-Courts-1920x1080/`
- `LBTA-Philosophy-Pillars-800x800/`
