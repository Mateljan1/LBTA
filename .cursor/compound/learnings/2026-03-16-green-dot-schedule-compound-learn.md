# Compound Learn — Green Dot Schedule (2026-03-16)

**Source:** Code review (6 agents) + work-phase fixes for UTR Green Dot — Competitive schedule/location updates in `data/winter2026.json`, `data/spring-summer-2026.json`, `data/fall2026.json`, and `lib/form-config.ts`.

---

## CORRECTIONS (what was wrong → what to do instead)

| Original | Correction |
|----------|------------|
| Schedule slot note "LBHS" while other slot-level venue text uses "LB High School" | Use "LB High School" in slot note for consistency (Pattern Recognizer). |
| form-config Youth Development `location: 'Alta Laguna Park'` while season JSON uses "Laguna Beach High School" | Align form-config location with data; update when editing that program in season files. |
| Program description repeating venue/location already in `location` and slot `note` | Keep description lean; let location + per-slot note carry where/when. |
| Program description "starting April" (date-coupled) | Use location/season context only; avoid calendar dates unless time-bound and documented for update. |

---

## PATTERNS ADDED

- **schedule-slot-venue-consistent** — When editing schedule slot note in season JSON, use same venue wording as rest of file (e.g. "LB High School" not "LBHS").
- **form-config-location-matches-data** — When a program exists in form-config and in data/*.json, keep prePopulateData.location aligned with the program location in season data.
- **program-description-lean** — When location and slot notes already carry venue info, description should not repeat it; use for positioning and pricing only.

---

## ANTI-PATTERNS ADDED

- **schedule-slot-venue-inconsistent** — Slot note abbreviation or different wording than other slot-level venue text in the same file.
- **form-config-location-out-of-sync** — form-config location for a program differs from season JSON location.
- **program-description-date-coupled** — Program description includes date-specific text (e.g. "starting April") that will age.

---

## QUALITY BARS ADDED

- **formConfigLocationMatchesData** — form-config prePopulateData.location must match program location in season JSON (should).
- **scheduleSlotVenueConsistent** — Schedule slot note/venue wording consistent within file (should).

---

## FILES UPDATED

- `.cursor/compound/learnings/corrections.jsonl` — 4 new corrections.
- `.cursor/compound/learnings/anti-patterns.json` — 3 new anti-patterns; updated date.
- `.cursor/compound/learnings/patterns.json` — 3 new patterns; updated date and lastLearnRun.
- `.cursor/compound/learnings/quality-bars.json` — 2 new quality bars; updated date.
