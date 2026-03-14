# Extraction: Lead + Vercel CLI (2026-03-10)

## Source
- Lead CLI: `npm run lead` → `scripts/lead.js` (AC/GHL env check, "where leads go", doc link; exit 1 when AC not set).
- Vercel CLI: `npm run check:vercel` → `npx vercel whoami && npx vercel list --yes`.

## Extracted

### Pattern
- **ops-cli-entry-points**: When a key ops flow (leads, deploy platform) has a check or status command, expose it as a named npm script. Script: small Node script (e.g. lead.js) or direct CLI chain (check:vercel). Never print secrets; point to setup docs when relevant.

### Quality bar
- **opsCliForKeyFlows**: Key ops flows (lead pipeline, deploy platform) have a CLI entry point (e.g. npm run lead, npm run check:vercel) so status can be checked from the terminal without reading code. Enforcement: should.

## Files updated
- `.cursor/compound/learnings/patterns.json` — +ops-cli-entry-points
- `.cursor/compound/learnings/quality-bars.json` — +opsCliForKeyFlows
- `plans/COMPOUND_LEARN.md` — log entry
