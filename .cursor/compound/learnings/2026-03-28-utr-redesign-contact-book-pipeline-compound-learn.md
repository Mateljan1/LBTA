# Compound Learn — UTR page redesign + contact `/api/book` pipeline (2026-03-28)

**Source:** LBTA_UTR_Page_Redesign_FULL spec implementation, contact form audit, Vercel prod deploy  
**Workspace:** LBTA_WEBSITE_DRAFT_3:5:26

## Summary

- **UTR Match Play:** Spec-driven refresh (hero, season strip, week banner, division names/venues, Karuê cutout + ATP #258, FAQ, CTA with UTR club URL + `andrew@`). Data stays in `data/leagues-2026.json` + `lib/utr-match-play.ts`; optional `description` on divisions in schema.
- **Contact form:** Posts to `POST /api/book` with `source: 'contact-page'`. **Bug fixed:** `message` was not on `bookingSchema`, so Zod dropped it before the handler ran. **Behavior fixed:** contact submissions were tagged/treated as trials and received trial confirmation email — now branched: AC `contact`, Notion category Contact, GHL `Contact Form`, `sendContactFormConfirmationEmail`, ops email `intent: 'contact'`.
- **Deploy:** `npm run ship:gate` then `vercel --prod`; re-deploy after commit so production matches pushed SHA when using CLI uploads.
- **Lint:** `UtrDropInSchedule` used `<Link>` without import — replaced with `<a href="#divisions">` (same-page anchor; server component).

## Corrections

| Original | Correction |
|----------|------------|
| Client sends `message` but field absent from Zod `bookingSchema` | Add `message?: string` (max 2000) to schema so validation preserves it |
| `/api/book` treats all non-private POSTs as trials | When `source === 'contact-page'`, branch: tags, field 12, Notion category, confirmation email, notify intent |
| Contact users received “Trial Class Request Is Confirmed” | Send `sendContactFormConfirmationEmail` / `category: 'Contact'` template for contact source only |
| `<Link>` in component without `next/link` import | Use `<a href="#...">` for in-page anchors or add `import Link from 'next/link'` |
| FAQ answers using `&apos;` inside JS string literals | Use double-quoted strings with `'` or escaped `\'` — `&apos;` renders literally in React text nodes |

## Patterns

| Name | When | Example |
|------|------|---------|
| **api-schema-field-parity** | Any form POST to a Zod-validated route | List client JSON keys and ensure schema includes each; strip-unknown behavior drops the rest |
| **booking-route-multi-intent** | One route serves trial + contact (or more) | Use `source` (or `intent`) + early branch for AC tags, emails, and CRM category |
| **spec-global-replace-table** | Large marketing page refresh | Keep a “find → replace” table in the spec; grep the page (or site) before sign-off |
| **ship-gate-before-prod** | Any merge to production branch | `npm run ship:gate` — catches uncommitted tracked files after local fixes |

## Anti-patterns

- **zod-schema-missing-client-fields** — Silent data loss on lead payloads
- **reuse-trial-pipeline-for-contact** — Wrong user-facing confirmation and AC segmentation
- **html-entities-in-js-strings** — `&apos;` in `'...'` strings is not decoded as apostrophe in React `{str}`

## Optional follow-ups

- Refresh `docs/solutions/integration/utr-match-play-division-cards-drop-in-contact-prefill.md` if it still describes contact-form drop-ins where UTR URL is now primary.
- If custom domain production differs from `*.vercel.app`, confirm dashboard Production deployment SHA matches `git rev-parse HEAD` after Git push.
