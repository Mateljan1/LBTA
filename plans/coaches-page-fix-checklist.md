# Coaches Page — Fix Checklist & What to Check

**Live page:** https://lagunabeachtennisacademy.com/coaches

---

## Changes just applied (this session)

1. **Founder section proportions**
   - **Before:** Fixed 380px image column, rest text (~32% / 68% on 1200px).
   - **After:** Proportional grid `lg:grid-cols-[minmax(0,0.42fr)_1fr]` (~42% image / 58% text), image `max-w-[420px]` so the founder photo has more presence and isn’t dwarfed by the text.

2. **Featured coach card (Robert)**
   - **Before:** Fixed 320px image column.
   - **After:** Proportional `lg:grid-cols-[minmax(0,0.38fr)_1fr]`, image `max-w-[360px]` so the card doesn’t look “way out of proportion” on large screens.

3. **Anchor scroll**
   - Founder section now has `scroll-mt-28` so when you click “Leadership” in the nav, the heading isn’t hidden under the sticky header.

---

## If it’s “still not correct” — what to verify

Use this list and tell me **which line(s)** still don’t match what you want (e.g. “A and C” or “the quote is still on the photo”):

| # | Check | What to look at |
|---|--------|------------------|
| **A** | Quote on photo | The quote (“Structure creates confidence…”) should be **only in the text column to the right**, not overlaid on Andrew’s photo. If you still see it on the image, hard-refresh (Cmd+Shift+R / Ctrl+Shift+R) or try an incognito window; the code has no overlay. |
| **B** | Founder image size/crop | Image should feel balanced with the text (we just made it ~42% width). If it still feels too small or too big, say “image bigger” or “image smaller” and we can tweak the fraction (e.g. 0.45fr or 0.5fr). |
| **C** | Founder image brightness/crop | We use `brightness(1.22)` and `objectPosition: 50% 40%`. If the face is too dark or too cropped, we can change the filter or the position (e.g. `50% 35%` to show more head). |
| **D** | Robert (featured) card proportion | The “Director of Tennis Operations” card should have image and text in a reasonable balance (~38% / 62%). If it still looks off, we can change to 50/50 or a different split. |
| **E** | Team grid (Michelle, Peter, Allison) | Three cards in a 2-column grid on tablet+. If you want a different layout (e.g. 3 columns on desktop), we can change it. |
| **F** | Hero (The Coaches) | Title and subtitle at bottom of hero image. If the hero height, overlay, or text position feels wrong, describe what you want (e.g. “taller hero”, “lighter overlay”). |
| **G** | Something else | Describe what’s wrong (e.g. spacing, font size, order of sections, CTA buttons) and we can target it. |

---

## Quick deploy check

After you deploy these changes:

1. Hard-refresh the coaches page (or open in incognito).
2. Confirm quote is only in the right column, not on the photo.
3. Confirm founder and Robert card proportions look better.
4. Click “Leadership” in the top nav and confirm the founder heading isn’t stuck under the header.

If something is still off, reply with the **letter(s)** from the table above (A–G) or a short description, and we can adjust precisely.
