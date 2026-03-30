# UTR Match Play — Pricing catalog alignment & Stripe payments

## Overview

Reconcile the **authoritative program/pricing matrix** (division names, UTR bands, Color Ball stages, season vs drop-in dollars, times, venues) with what the site renders today, then add **Stripe** so customers can pay for UTR season and/or drop-ins online—while preserving CRM flows (ActiveCampaign / optional Notion / leads store) and LBTA’s “confirm space” rules where still required.

**Live reference:** [UTR Match Play page](https://lagunabeachtennisacademy.com/programs/utr-match-play) (content driven by `data/leagues-2026.json` and `lib/utr-match-play.ts`).

## Problem statement

1. **Catalog drift:** A separate table (pasted matrix) lists **Red / Orange / Green** as distinct season & drop-in rows, **UTR 3.0–6.0** vs **6.0–12.0** singles/doubles, and **“Free”** season pricing in several rows. The production site uses **four** divisions (`Color Ball`, `UTR 2.0–5.0 Singles`, `UTR 3.0–7.0 Singles`, `UTR 3.0–7.0 Doubles`) with **non-zero** season prices ($349–$549) and **$55–$65** drop-in references. **Times/venues** on the site match JSON today; the matrix must be validated as business truth before code changes.

2. **No payment rail:** `package.json` has **no Stripe** dependency. Registration flows use **`/api/register-year`** (Notion, ActiveCampaign, email)—**no card capture**. Drop-ins currently route to **contact + manual confirmation**, by design.

3. **Compound risk:** Adding payments touches **money, refunds, chargebacks, tax, and reconciliation** (e.g. City of Laguna Beach receipts / Airtable per project skills). This must be planned, not rushed.

## Proposed solution

### A. Pricing & catalog (data-first)

1. **Stakeholder lock:** Andrew confirms the **single source of truth** table: division list, UTR band labels, Color Ball (one division vs three SKUs), season price **cents**, drop-in **cents**, times, venues, what “season” includes (8 weekends + finals), and whether any row was **“Free”** as placeholder only.
2. **Update `data/leagues-2026.json`** (and **`lib/schedule-schemas.ts`** / `utrDivisionSchema` if new fields are needed, e.g. `stripe_product_key` or `sku_id` only on server).
3. **Propagate** to:
   - `lib/utr-match-play.ts`, `lib/utr-circuit-modal-pricing.ts`, `lib/form-config.ts` (where applicable),
   - `UTRMatchPlayDivisions`, `UtrDropInSchedule`, `LuxuryYearModal`, `page.tsx` copy only if data-driven.
4. **Tests:** Extend `lib/utr-match-play.test.ts` / `form-config.test.ts` for min/max price bounds if those invariants remain.

### B. Stripe (technical)

**Pattern (recommended for Vercel + Next.js):** [Stripe Checkout](https://stripe.com/docs/payments/checkout) (hosted) for **PCI** scope and speed; optional **Customer Portal** later for refunds managed in Stripe Dashboard.

1. **Stripe Dashboard:** Create **Products/Prices** per payable line item (or dynamic `price_data` with strict server-side allowlist from JSON).
2. **Env:** `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, publishable key for client if needed; document in `lib/env.ts` and Vercel.
3. **API routes (App Router):**
   - `POST /api/checkout/utr` — validates selection (division, season | drop-in, date ISO if drop-in), builds Checkout Session with **metadata** (`division`, `type`, `date`, `source: lbta-web`), `success_url` / `cancel_url` to `/thank-you` or `/programs/utr-match-play`.
   - `POST /api/webhooks/stripe` — verify signature; on `checkout.session.completed`, enqueue: **CRM** (email to ops, or AC update if API supports), **optional** `lib/leads-store` / Supabase row, **receipt** email.
4. **UI:** “Pay” / “Checkout” flows from division cards and/or modal—**replace or complement** “Request drop-in” only where business approves instant payment; keep **contact** path for edge cases.
5. **Idempotency:** Store Stripe `session.id` / `payment_intent` to avoid duplicate CRM writes.

### C. Ops & compliance

- **Refunds:** Policy text on site; Stripe Dashboard workflow; who approves.
- **Tax:** Whether Stripe Tax or manual; California / OC considerations.
- **Receipts:** Align wording with existing finance processes (see `lbta-receipts` / City receipts—**out of scope** for automation in v1 unless explicitly requested).

## Implementation steps

### Phase 1: Catalog & copy (no Stripe)

- [ ] **1.1** Finalize authoritative pricing matrix with Andrew (resolve Red/Orange/Green vs single Color Ball; resolve UTR band splits vs current 3.0–7.0; **eliminate “Free”** unless it is a real promo with dates).
- [ ] **1.2** Update `data/leagues-2026.json` and schema if needed; run `parseLeagues` / build.
- [ ] **1.3** Update UI consumers and tests; deploy to confirm [live page](https://lagunabeachtennisacademy.com/programs/utr-match-play) matches data.

### Phase 2: Stripe foundation

- [ ] **2.1** Add `stripe` (server) dependency; env vars in Vercel + local `.env.example` documentation (no secrets in repo).
- [ ] **2.2** Implement `POST /api/checkout/utr` with Zod validation + allowlist from `leagues-2026.json` prices.
- [ ] **2.3** Implement `POST /api/webhooks/stripe` with `crypto.timingSafeEqual` or Stripe SDK verification; **no** raw trust of client price.
- [ ] **2.4** Wire success/cancel pages and email/CRM hooks.

### Phase 3: UX & safety

- [ ] **3.1** Add checkout CTAs only where product policy allows; keep contact for “confirm space” if required.
- [ ] **3.2** Rate-limit checkout route; log without PII.
- [ ] **3.3** Manual QA: test mode cards, webhook in Stripe CLI, production smoke after deploy.

## Files to create/modify

| File | Action | Purpose |
|------|--------|---------|
| `data/leagues-2026.json` | Modify | Authoritative prices, times, division names |
| `lib/schedule-schemas.ts` | Modify | Zod for new UTR fields if any |
| `lib/utr-match-play.ts` | Modify | Load any new fields |
| `lib/env.ts` | Modify | Stripe env helpers |
| `app/api/checkout/utr/route.ts` | Create | Create Checkout Session |
| `app/api/webhooks/stripe/route.ts` | Create | Stripe webhook handler |
| `package.json` | Modify | `stripe` dependency |
| `app/programs/utr-match-play/*` | Modify | Checkout CTAs as approved |
| `docs/solutions/integration/*` | Optional | Document payment flow |

```yaml
# files (for tooling)
create:
  - app/api/checkout/utr/route.ts
  - app/api/webhooks/stripe/route.ts
modify:
  - data/leagues-2026.json
  - lib/schedule-schemas.ts
  - lib/env.ts
  - package.json
```

## Out of scope (this plan)

- Replacing ActiveCampaign with Stripe as CRM.
- Automatic reconciliation with City of Laguna Beach receipt PDFs (separate pipeline).
- Native in-app card element (use Checkout unless product requires embedded).
- Subscription billing for multi-month autopay.

## Success criteria

- [ ] Published UTR catalog matches **approved** matrix (no “Free” placeholders unless real).
- [ ] `npm run ship:gate` passes.
- [ ] Stripe **test** checkout completes; webhook receives event; internal notification or CRM update fires once.
- [ ] Production deploy verified with **live** keys and dashboard webhook delivery.

## Acceptance checklist

| Criterion | Verification |
|-----------|----------------|
| Data single source | `grep` prices only in `data/leagues-2026.json` (or extended JSON), not duplicated in TSX strings |
| No client-trusted price | Server builds Checkout from validated division + type + JSON |
| Webhook secure | Signature verified; idempotent processing |
| A11y / brand | Checkout links/buttons meet LBTA touch targets and contrast |

## Research sources

- [Stripe Checkout](https://stripe.com/docs/payments/checkout)
- [Stripe webhooks — verify signatures](https://stripe.com/docs/webhooks/signatures)
- Next.js App Router route handlers (existing project pattern)

## Relevant learnings

- `docs/solutions/integration/utr-match-play-division-cards-drop-in-contact-prefill.md` — contact prefill + division-scoped flows.
- `.cursorrules` — webhook secrets: timing-safe compare; **no** trusting client price for charges.

## Research conflicts & resolution

| Conflict | Resolution |
|----------|------------|
| Matrix shows “Free” season vs site shows $349–$549 | **Business approval** before any “fix”; do not push “Free” to production without sign-off |
| Matrix splits Color Ball vs site single card | Either expand JSON to **3** divisions or keep **1** card with **sub-bullets**; product decision |

## Confidence & uncertainty

- **Plan confidence:** Medium until the **matrix is signed off** as authoritative.
- **Uncertainty:** Refund policy, whether drop-ins can be paid online without staff confirmation, and Stripe Tax.

## Risks & mitigations

| Risk | Mitigation |
|------|------------|
| Wrong price shipped | Server allowlist from JSON; integration tests on amounts |
| Webhook replay / duplicate CRM | Idempotency on `session.id` |
| PCI scope creep | Use Stripe Checkout; no raw card data in app |
| Ops overload | Start with **season** payment only; add drop-in later |

---

## Gate

Before Phase 2: **signed pricing matrix** (CSV or Notion) attached to repo or PR description.
