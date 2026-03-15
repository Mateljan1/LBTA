# FAQ Simplify — Reduce Long Scrolling

## Overview

Shorten the FAQ experience so the homepage and /faq page don’t feel like endless scrolling. Use a featured subset on the homepage and category tabs on /faq so only one category is visible at a time.

## Problem Statement

- **Homepage:** FAQSection shows all 19 FAQs in one accordion; the section is very long.
- **/faq page:** 8 category blocks are stacked (each with 1–5 Q&As), so users scroll through many sections. Hero + 8 blocks + CTA makes the page feel long.
- **Goal:** Less scroll, same content; users who want depth can still get it (tabs or “View all”).

## Proposed Solution

1. **Homepage — featured subset**
   - Add optional `featured: true` to `data/faq.json` for 5–6 “common” questions.
   - FAQSection shows only `featured === true`; if none, fall back to first 6.
   - Add a “View all FAQs” link to `/faq` under the accordion.
   - Schema: keep all 19 in FAQPage schema (still on homepage or in layout) for SEO, or limit to featured; recommend keeping all for SEO.

2. **/faq page — category tabs**
   - One category visible at a time (tab strip: Getting Started, Programs, Policies, etc.).
   - Selecting a tab shows only that category’s Q&As (accordion within the tab).
   - No stacked blocks; scroll is limited to one category (max 5 items in “Getting Started”).
   - Preserve existing content and a11y (accordion, aria-expanded, focus).

3. **Optional polish**
   - Slightly reduce /faq hero padding (e.g. `py-32` → `py-20` or `py-24`) and section spacing to save vertical space.
   - Ensure tab panel is the only scrollable FAQ content (no extra “mb-16” between categories).

## Implementation Steps

### Phase 1: Data and homepage

- [x] **1.1** In `data/faq.json`, add `"featured": true` to 5–6 items (e.g. get-started, ages, equipment, location, philosophy, cancellation). Leave the rest without `featured` or `"featured": false`.
- [x] **1.2** In `components/FAQSection.tsx`, filter to `faqs.filter(f => f.featured !== false)` or use “first 6” if no `featured` keys exist yet; add type for optional `featured?: boolean`.
- [ ] **1.3** In FAQSection, add a “View all FAQs” link (e.g. under the list) to `/faq`.
- [x] **1.4** FAQ schema: keep using full `faqsData` for `mainEntity` (all 19) so SEO still sees full FAQ page content; no change if schema is already built from full list.

### Phase 2: /faq category tabs

- [x] **2.1** In `app/faq/FAQInteractive.tsx`, add state for selected category (e.g. `categories[0]` by default).
- [x] **2.2** Render a tab list (horizontal, accessible: role="tablist", aria-selected, keyboard arrows). One tab per category; active tab shows that category’s name.
- [ ] **2.3** Render only the active category’s Q&As below (same accordion pattern as now). No `categories.map` that stacks all 8 blocks.
- [x] **2.4** Ensure tab panel has correct `role="tabpanel"` and `aria-labelledby` for a11y.

### Phase 3: Polish and validation

- [x] **3.1** Optionally reduce /faq hero padding and/or section spacing (e.g. `section-spacing` or `mb-16` → smaller values) so the page feels shorter.
- [x] **3.2** Run lint and build; quick manual check: homepage FAQ shows ~6 items + “View all”; /faq shows tabs and one category at a time.
- [x] **3.3** Verify schema still has all FAQs (if schema is on homepage or /faq, confirm `mainEntity` count).

## Files to Create/Modify

| File | Action | Purpose |
|------|--------|---------|
| `data/faq.json` | Modify | Add `featured: true` to 5–6 items. |
| `components/FAQSection.tsx` | Modify | Filter to featured (or first 6); add “View all FAQs” link; type for `featured`. |
| `app/faq/FAQInteractive.tsx` | Modify | Replace stacked categories with category tabs; single visible category accordion. |
| `components/SEOSchemas.tsx` or FAQ schema source | Check only | Ensure FAQPage schema still includes all questions (or document if limited). |

## Success Criteria

- [ ] Homepage FAQ shows 5–6 items and a “View all FAQs” link to /faq.
- [ ] /faq page shows category tabs; only one category’s Q&As are visible at a time; no long stacked scroll.
- [ ] All 19 FAQs remain in data and accessible (no content removed).
- [ ] Build and lint pass; a11y preserved (tabs + accordion keyboard and ARIA).
- [ ] Optional: Reduced hero/section spacing on /faq.

## Relevant Learnings

- Single source of truth: `data/faq.json` (see compound-validation follow-ups). Adding `featured` is an optional field; FAQSection and schema can filter or use full list.
- Accessibility: .cursorrules require 48px touch targets, focus states, keyboard nav; tab list must be focusable and arrow-key navigable.

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Schema might drop FAQs if we filter in schema script | Keep schema built from full `faq.json` (e.g. in FAQSection or layout); only the *display* on homepage is filtered. |
| Tabs add complexity | Use a simple state (selected category index); no extra dependency. Pattern: tablist + tabpanels, one panel visible. |
| “Featured” missing on old entries | Type as `featured?: boolean`; filter “show if featured === true, else show first 6” so old data still works. |
