# LBTA Brand Token Reference (GPT-facing)

> Quick-lookup version of the LBTA brand kit. The full source of truth is `.cursorrules` Parts 7–8 in the repo root. When that updates, this updates. GPTs should consult this file before generating any branded copy or asset descriptions.

---

## Color palette (11 colors max)

### Primary

| Token | Hex | Usage |
|---|---|---|
| `pacific-dusk` | `#1B3A5C` | Primary text, headings |
| `deep-water` | `#0F2237` | Dark backgrounds, hero sections |
| `victoria-cove` | `#2E8B8B` | Links, focus states, clarity |
| `salt-air` | `#FFFFFF` | White |

### Surface

| Token | Hex | Usage |
|---|---|---|
| `morning-light` | `#FAF8F4` | Default background |
| `sandstone` | `#F5F0E5` | Warm section background |

### Accent (sparingly)

| Token | Hex | Usage |
|---|---|---|
| `sunset-cliff` | `#E8834A` | Hover/accent ONLY (not primary CTA fill) |
| `thousand-steps` | `#C4963C` | Prestige accent (very sparingly) |

### Secondary

| Token | Hex | Usage |
|---|---|---|
| `tide-pool` | `#3A8B6E` | Success, positive states |
| `sage-hill` | `#7A8B6E` | Secondary green |
| `driftwood` | `#B8A88A` | Neutral accent |

### Color usage rules (for GPTs to follow when describing visuals)

- Never describe a section using more than 3 colors.
- Primary CTA buttons: black (`#0A0A0A`) or white. Never orange/red.
- Don't invent colors. Use the table above.
- Hover/accent: Sunset Cliff `#E8834A` only.
- Focus rings: Victoria Cove `#2E8B8B`.

## Typography

### Fonts

- **Headlines:** Cormorant (serif).
- **Body:** DM Sans (sans-serif).

### Scale (rough; the exact spec is in `.cursorrules` Part 8)

| Tier | Use |
|---|---|
| Display (~84px) | Hero headlines only |
| Headline (~64px) | Section titles |
| Headline-md (~56px) | Subsection titles |
| Headline-sm (~48px) | Card titles |
| Subhead (~32px) | Lead paragraphs |
| Body-lg (20px) | Emphasis body |
| Body (18px) | Standard body |
| Body-sm (16px) | Small text |
| Eyebrow (11px, uppercase, 2px tracking) | Eyebrow labels |

### Forbidden fonts

- **Never use:** Inter, Roboto, Arial, Space Grotesk, Playfair Display, Work Sans.
- If a draft suggests one of these, edit and replace with Cormorant or DM Sans.

## Voice anchors

Three lines that the GPTs should treat as canonical brand voice:

1. **"Tennis, as it should be taught."**
2. **"Movement. Craft. Community."**
3. **"Structure creates confidence. Confidence creates results."**

When in doubt about voice, anchor to one of these three.

## Forbidden words (in any GPT-drafted copy)

`maximize`, `boost`, `elite`, `world-class`, `mastery`, `unleash`, `unlock`, `level up`, `crush`, `dominate`, `revolutionary`, `cutting-edge`, `synergize`, `leverage` (as a verb).

Avoid: exclamation points in headlines, generic marketing speak, fake scarcity ("limited time!"), urgency theater ("act now!").

## Tone

Calm. Specific. Confident. Founder-led, not corporate. The Aman/Four Seasons of tennis — restraint, white space, intentionality. Never salesy.

## Emoji policy

No emojis in customer-final drafts. Internal Slack/text fine. Tennis emoji 🎾 explicitly forbidden in drafts.

## Reference

For full specifications, agents should consult:
- `.cursorrules` Parts 6–8 in the repo root.
- `03-KNOWLEDGE-BRAIN/07-voice-and-brand.md` (voice section).

If those files conflict with this one, those win. This file is a quick-lookup summary.
