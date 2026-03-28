# Lighthouse baseline JSON files

Committed snapshots for **before/after** performance work (regenerate when you want a new baseline).

| File | Notes |
|------|--------|
| `lighthouse-homepage-prod.json` | Mobile emulation; `fetchTime` inside JSON (e.g. 2026-03-26). |
| `lighthouse-homepage-prod-desktop.json` | Desktop run against production homepage. |

To capture a new prod run: `npx lighthouse https://lagunabeachtennisacademy.com/ --output=json --output-path=./docs/lighthouse-homepage-prod.json` (adjust URL/output as needed). Local dev: `npm run lighthouse` writes HTML to `docs/lighthouse-report.html`.
