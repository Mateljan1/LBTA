# 08 — Brand Assets

> Everything visual the GPTs need to be on-brand: profile pictures, logo references, color tokens, typography rules. The GPTs do not invent visual identity — they consume what's here.

---

## Files & folders

```
08-BRAND-ASSETS/
├── README.md                         ← This file
├── brand-token-reference.md          ← Colors + typography (canonical)
├── profile-pictures/
│   ├── README.md                     ← How to generate the 6 GPT profile pics
│   ├── founder.png                   ← TBD: 512×512 LBTA monogram, deep-water bg
│   ├── adult-coach.png               ← TBD: monogram with sage-hill (#3A8B6E) accent
│   ├── junior-coach.png              ← TBD: monogram with sunset-cliff (#E8834A) accent
│   └── front-desk.png                ← TBD: identical to founder (official LBTA voice)
└── generated/                        ← Drop zone for AI-generated brand assets
    └── README.md                     ← What goes here, what doesn't
```

## Canonical brand source of truth

The actual canonical brand kit lives in two places in the repo:

- **`/.cursorrules` Part 7 (Color Tokens)** — the 11-color palette.
- **`/.cursorrules` Part 8 (Typography System)** — Cormorant + DM Sans, scale, eyebrow rules.
- **`/docs` and existing brand guides** — e.g. `docs/brand-system-decisions.md` if present.

This folder is a **GPT-facing summary**, not a re-source-of-truth. When `.cursorrules` updates, update `brand-token-reference.md` here.

## Profile picture spec (all 6 GPTs)

- **Format:** PNG, 512×512px, square.
- **Background:** Deep Water `#0F2237`.
- **Monogram:** "LBTA" in Salt Air `#FFFFFF`, Cormorant Bold, centered.
- **Accents (for coach GPTs only):** A small sub-mark or border in the role-specific accent color.
  - Founder + Front Desk: no accent (pure brand mark — speaks as "LBTA").
  - Adult Coach: Sage Hill `#3A8B6E` accent line (calm, secondary green).
  - Junior Coach: Sunset Cliff `#E8834A` accent line (warmth, energy).

See `profile-pictures/README.md` for a generation prompt.

## Voice samples

Voice samples live in `03-KNOWLEDGE-BRAIN/voice-samples/`, not here. They are anonymized text, not visual assets, and they're consumed by coach GPTs to anchor voice — see `coach-consent-form.md` in `07-LEGAL-PRIVACY/`.

## What does NOT go in this folder

- Photographs of real coaches or players (those live in `/public/images/` in the repo).
- Member or family-facing materials (those live in `/public/` or are produced ad-hoc).
- Marketing assets currently in production for the website (use `/assets/` and `/generated/` at repo root).

## Owner

Andrew. Visuals follow the brand kit; deviations get reviewed before they ship.
