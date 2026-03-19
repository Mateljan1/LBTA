# Legacy Working Assets

LBTA website, email, and marketing assets. All files in this folder are served from the site root and can be used across the website, emails, and ads.

## How to reference

**On the website (Next.js):**

- Path from site root: `/legacy-working-assets/...`
- Example hero image: `/legacy-working-assets/hero/hero-poster/hero-poster.webp`
- In React/Next: `src="/legacy-working-assets/hero/laguna-horizon/laguna-horizon.webp"` or use `next/image` with that path.

**In emails (absolute URLs):**

- Use your production domain: `https://lagunabeachtennisacademy.com/legacy-working-assets/...`
- Example: `https://lagunabeachtennisacademy.com/legacy-working-assets/conversion/thank-you-image/thank-you-image.webp`

**In ads / Canva / external tools:**

- Same absolute URL pattern once the site is deployed.

## Folder structure

| Folder | Contents |
|--------|----------|
| `hero/` | Page hero images (home, camps, philosophy, trials, etc.) |
| `coaches/` | Coach headshots (webp + standardized PNGs in `headshots-standardized/`) |
| `founder/` | Andrew portrait |
| `philosophy/` | Movement, discipline, belonging |
| `why-choose/` | Why-choose section images |
| `camps/` | Camp action + red/orange/green ball |
| `programs/` | Program imagery (juniors, adults, cardio, fitness, etc.) |
| `facility/` | Courts (LBHS, Moulton, sunset) |
| `conversion/` | Book/thank-you and trial strip images |
| `cta/` | CTA background |
| `testimonials/` | Testimonial photos |
| `community/` | Community gallery (community-1 … 12) |
| `results/` | Results/success imagery |
| `photos/` | General court/setting photos |
| `videos/` | Hero video (e.g. `LBTA-Home-Hero/LBTA-Home-Hero.mp4`) |
| `_planning-docs/` | Slot summary, specs, source map (reference only) |
| `_canva-inbox/` | Canva workflow notes |
| `canva-api/` | Canva API scripts (local use; `.secrets/` not committed) |

## Notes

- **WebP** images are preferred for web; use them in pages and emails where possible.
- **Headshots:** `coaches/headshots-standardized/cropped-square-800/` and `cropped-portrait-800x1000/` contain consistent PNGs for cards and bios.
- **Hero video:** `/legacy-working-assets/videos/LBTA-Home-Hero/LBTA-Home-Hero.mp4` — use with `<video>` or your hero component.
- Specs and slot status: see `_planning-docs/` for ASSET-SLOT-SUMMARY.md, SPECS-EVERY-SLOT.txt, and CSV maps.

## Wired on site (visual elevation plan)

Heroes and OG images wired from legacy (March 2026):

| Slot | Used on |
|------|--------|
| `hero/camps-hero` | Camps page + OG |
| `hero/philosophy-hero` | Philosophy page + OG |
| `hero/fitness-hero` | Fitness page + OG |
| `hero/success-stories-hero` | Success Stories page + OG, apply-scholarship OG |
| `conversion/book-hero` | Book page + OG |
| `hero/junior-trial-hero` | Junior Trial page + OG |
| `hero/adult-trial-hero` | Adult Trial + Beginner Program hero + OG |
| `hero/match-play-hero` | Match Play page + OG |
| `hero/leagues-hero` | Leagues page + OG, USTA Adult League hero + OG |
| `hero/laguna-horizon` | Racquet Rescue hero + OG |
| `hero/adult-group-hero` | Coaches layout OG |
| `programs/juniors`, `programs/adults`, `programs/high-performance` | Program pages OG |
| `conversion/thank-you-image` | Thank-you page hero + OG |
| `videos/LBTA-Home-Hero/LBTA-Home-Hero.mp4` | HomeHero MP4 fallback |
| `facility/sunset-courts`, `courts-lbhs`, `courts-moulton` | About page “Where We Train” (featured + strip) |
| `conversion/book-expect-1`, `book-expect-2`, `book-expect-3` | Book page conversion strip |
| `founder/andrew-portrait` | About page philosophy quote (pull quote over image) |
| `community/community-1` … `community-10` | Homepage community masonry grid |
| `why-choose/why-choose-1`, `why-choose-2` | Homepage Why Choose (60/40 asymmetric) |
| `programs/juniors`, `adults`, `private-lessons` | Homepage program cards |
| `camps/camp-action-1` … `camp-action-4` | Camps page zigzag “Camp Life” |
| `philosophy/belonging` | Philosophy page bento “What We Believe”; homepage philosophy optional |
| `results/results-player-3`, `testimonials/testimonial-adult-1`, `testimonial-junior-1` | Success Stories cards + hero |

**See also:** [Visual elevation — conversion strip, facility block, quote-over-image](../../../docs/solutions/implementation-patterns/visual-elevation-conversion-strip-facility-quote-pattern.md) (patterns and code snippets for wiring new legacy sections).
