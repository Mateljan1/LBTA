# Compound Learn Run — 2026-03-14

**Trigger:** `/compound:learn` after compound:work 100/100 (review warnings addressed).

---

## Source

- **Work:** compound:work that fixed all warnings from `plans/compound-full-run-review-summary-2026-03-14.md` (78→100/100).
- **Scope:** Security (webhook rate limit, 401 in prod, logging); Performance (addTags parallel, AnimatedSection consolidation); Simplicity (dead code, analytics doc); Patterns (brand tokens, globals.css, webhook).

---

## Extractions

### Corrections (added to COMPOUND_LEARN + corrections.jsonl)

| Original | Correction |
|----------|------------|
| Webhook without rate limiting | Add `rateLimit('webhook:'+ip, RATE_LIMITS.webhook)` with try/catch; 401 in prod when secret unset; no user-supplied values in prod logs |
| Two implementations of same component (root vs ui/) | Single canonical in ui/; root re-exports so existing imports keep working |
| addTags sequential | Use `Promise.all(tagIds.map(id => addTag(contactId, id)))` |
| Raw hex in globals.css (#27272a) | Use `var(--deep-water)` or design token |
| AnimatedSection delay in seconds on one page | Pass delay in ms (200, 400); component divides by 1000 for Framer |

### Patterns (added to COMPOUND_LEARN + patterns.json)

- **webhook-rate-limit** — Webhook routes: rateLimit with webhook:ip key, try/catch allow on failure; 401 when secret unset in prod; trim prod logs.
- **single-component-re-export** — One canonical implementation; legacy path re-exports for backward compatibility.
- **parallel-add-tags** — Apply multiple AC tags via Promise.all.

### Standards (added to COMPOUND_LEARN)

- Webhook endpoints must have rate limiting (webhook:ip, try/catch).
- Production must return 401 when webhook secret env unset.
- No user-supplied or PII in production webhook logs.
- Consolidate duplicate component implementations; use re-export for backward compatibility.

### Anti-patterns (added to COMPOUND_LEARN + anti-patterns.json)

- Webhook without rate limiting.
- Two implementations of same component (consolidate, re-export).
- Raw hex in globals.css (use design tokens).
- Sequential addTags when multiple tags (use Promise.all).

### Quality bar (added to quality-bars.json)

- **webhookRateLimit** — Webhook routes rate-limited with try/catch; 401 in prod when secret unset; no PII in prod logs.

---

## Files updated

- `plans/COMPOUND_LEARN.md` — Learn run log entry; 5 corrections; 3 patterns; 4 standards; 5 anti-patterns.
- `.cursor/compound/learnings/corrections.jsonl` — 4 new entries.
- `.cursor/compound/learnings/patterns.json` — 3 new patterns; lastLearnRun + updated.
- `.cursor/compound/learnings/anti-patterns.json` — 2 new anti-patterns; updated.
- `.cursor/compound/learnings/quality-bars.json` — webhookRateLimit bar; updated.
- `.cursor/compound/learnings/2026-03-14-compound-learn.md` — this file.

---

## Outcome

Learnings from the 100/100 work phase are now in the project memory. Future agents and compound:review will have:

- Webhook rate limiting and prod 401/trimmed logging as required.
- Single-component re-export as the pattern when consolidating duplicates.
- Parallel addTags and no raw hex in globals as patterns/anti-patterns.
