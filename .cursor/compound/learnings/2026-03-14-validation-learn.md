# Compound Learn — After compound:validate (2026-03-14)

**Trigger:** `/compound:learn` after `/compound:validate`  
**Validation scores:** Functional 95, API 92, Data Integrity 72, UI/Visual 92

---

## Extracted

### Blockers (data-integrity)
- **lib/form-config.ts** — `prePopulateData.pricing` holds literal price strings that duplicate `/data/*.json`. Single source of truth violated.

### Warnings
- Chatbot quick-reply buttons use generic emoji (🎾 📅 💰 📞); .cursorrules forbid.
- GET /api/newsletter returns 405 with empty body.
- Fixed date/season strings in LeaguesSection, StickyCTA, beginner-program, camps (could move to /data).

### Corrections added
1. Registration modal pricing duplicated in form-config → derive from programs-data/camps-data/year2026 or single shared config; document sync if display-only.
2. Chatbot emoji → text labels or non-generic icons (e.g. Lucide).

### Pattern added
- **modal-pricing-from-data** — When registration modal shows pricing, load from same /data sources; avoid duplicate strings in form-config.

### Standard added
- Form-config / registration modal pricing must not be sole source; derive from /data or document sync; run data-integrity validation periodically.

### Anti-patterns added
- **form-config-duplicate-pricing** — prePopulateData.pricing duplicates /data; use data-driven pricing or single shared source.
- **generic-emoji-in-ui** — Chatbot or any UI using generic emoji for buttons; use text or non-generic icons.

### Quality bar added
- **formConfigPricingFromData** — Registration modal pricing derived from /data or single shared config (should).

---

## Files updated
- `.cursor/compound/learnings/corrections.jsonl` (+2)
- `.cursor/compound/learnings/anti-patterns.json` (+2)
- `.cursor/compound/learnings/patterns.json` (+1)
- `.cursor/compound/learnings/quality-bars.json` (+1)
- `plans/COMPOUND_LEARN.md` (corrections, patterns, standards, anti-patterns, quality bar, log entry)
