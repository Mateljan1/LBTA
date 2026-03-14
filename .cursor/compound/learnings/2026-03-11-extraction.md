# Compound learn extraction — 2026-03-11

## Source
- Hero clearance fix (Chrome headline clip): top-24 md:top-28, pt-16 md:pt-20
- Plan implementation status review (schedules UX, brand guide, Canva)
- Full validation 100/100; deploy

## Added

### corrections.jsonl
- Hero headline still clipped in some browsers (e.g. Chrome) even with min-h-screen and top-20/24 → use extra top clearance: top-24 md:top-28, pt-16 md:pt-20

### patterns.json
- **hero-cross-browser-headline-clearance:** Hero with fixed header and bottom-pinned headline; content area top-24 md:top-28, pt-16 md:pt-20 so headline visible in all major browsers
- **plan-implementation-status-before-next:** Before executing "next plans," review code against plan checklist; update plan-implementation-status-*.md to avoid redoing work

### quality-bars.json
- **heroHeadlineVisibleAllBrowsers:** Hero headline fully visible on load in major browsers; use extra top clearance if any browser clips (must)

### COMPOUND_LEARN.md
- Log entry for 2026-03-11 learn run
- Correction row added (hero cross-browser clearance)
- **Pattern rows added:** Hero cross-browser headline clearance; Plan implementation status before next (inserted after Anchor section scroll-margin)
- **Standard row added:** Hero headline fully visible on load in major browsers (inserted after Anchor sections scroll-margin-top). All cohesive with JSON files.
