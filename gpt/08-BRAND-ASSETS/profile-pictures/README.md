# Profile Pictures — LBTA Custom GPTs

> Each of the 6 GPTs needs a 512×512 PNG profile picture. They share a base mark; coach GPTs add a subtle accent band. This file has the spec + a generation prompt Andrew can paste into the Founder GPT (which has Image Generation ON).

---

## Files we need

| File | GPT | Accent |
|---|---|---|
| `founder.png` | LBTA Founder | None — base mark |
| `front-desk.png` | LBTA Front Desk | None — identical to Founder (signals "official LBTA voice") |
| `adult-coach.png` | LBTA Adult Coach (Allison) | Sage Hill `#3A8B6E` border, 8px |
| `junior-coach.png` | LBTA Junior Coach (Saska) | Sunset Cliff `#E8834A` border, 8px |

## Spec

- **Format:** PNG, 512×512px, square.
- **Background:** Solid Deep Water `#0F2237`.
- **Mark:** "LBTA" in Cormorant Bold, Salt Air `#FFFFFF`, centered, ~50% of canvas height.
- **No drop shadow, no gradient, no texture.**
- **Coach accent:** 8px solid border in the role color, full perimeter, square corners.
- **Founder + Front Desk:** no border. Pure mark on solid Deep Water.

## Generation prompt (paste into Founder GPT — Image Gen)

> *"Create a 512×512 square PNG for use as a Custom GPT profile picture. Solid background color: hex `#0F2237` (deep navy). In the center, the letters 'LBTA' in Cormorant serif Bold, color `#FFFFFF` (white), about 50% the height of the canvas. No drop shadow. No gradient. No texture. No other elements. Pure, centered, calm. The aesthetic is luxury hospitality (Aman, Four Seasons), not athletic/sports."*

For coach variants, append:

> *"Add a solid 8px border around the entire perimeter, square corners, color [HEX]. The interior remains pure deep navy with the white LBTA mark."*

Where `[HEX]` is:
- Adult Coach: `#3A8B6E`
- Junior Coach: `#E8834A`

## Manual creation (if not using AI)

If Andrew prefers to design these manually in Figma or Photoshop:

1. 512×512 canvas.
2. Fill: `#0F2237`.
3. Text "LBTA" — Cormorant Bold, ~280px, color `#FFFFFF`.
4. Center horizontally and vertically.
5. For coach variants: 8px solid border in role color.
6. Export as PNG.

## QA

Before saving the final files here:
- [ ] Open at small size (32px) — the LBTA mark is still readable.
- [ ] Open at large size (1024px) — no pixelation visible.
- [ ] Background is true Deep Water, not black, not navy-blue.
- [ ] Mark is true white, not off-white.
- [ ] Border (where applicable) is the correct accent hex.

## Where these get used

After saving:
1. ChatGPT → My GPTs → [GPT name] → Configure → click profile picture → Upload Image → select the PNG → Save.
2. Verify in chat that the new image renders correctly in the chat header.
3. Commit the PNG to git in this folder.

## Why no other elements

The brand is restraint. Tennis ball icons, racquet silhouettes, swooshes, and "modern" graphics break the Aman/Four Seasons aesthetic. The mark alone is the brand. **Resist the urge to add a tennis element.** The brand is luxury hospitality first, tennis second.
