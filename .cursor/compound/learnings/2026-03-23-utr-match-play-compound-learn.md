# Compound Learn — UTR Match Play Standalone Page (2026-03-23)

**Source:** UTR Match Play implementation + deploy  
**Workspace:** LBTA_WEBSITE_DRAFT_3:5:26

## Summary

- lib/utr-match-play.ts as single source for season, divisions, modal payload from leagues-2026.json
- LuxuryYearModal wired as primary CTA (replaces mailto)
- form-config duration derived via getUtrCircuitFormDuration()
- AC division tags use data.division; getUtrDivisionTag normalizes en-dash
- Leagues schema extended with ntrpToUtr
- Karue Sell asset in Grand Finals section

## Corrections

| Original | Correction |
|----------|------------|
| AC division tag lookup using data.program | Use data.division \|\| data.program for getUtrDivisionTag |
| Division labels with en-dash failing slug lookup | Normalize .replace(/[\u2013\u2014\u2212]/g, '-') |
| form-config duration hardcoded | Derive via getUtrCircuitFormDuration() from JSON |
| Leagues schema omitted ntrpToUtr | Add to schema so parse preserves it |
| mailto primary when modal exists | Wire LuxuryYearModal as primary CTA |

## Patterns

- **program-landing-single-source-from-json** — lib facade over JSON; page, modal, form-config import
- **form-prefill-duration-from-data** — Helper reads seasonLabel; test asserts duration matches

## Anti-patterns

- form-config-duration-hardcoded
- ac-division-tag-use-program
- slug-lookup-unicode-dash
- mailto-primary-when-modal-exists
