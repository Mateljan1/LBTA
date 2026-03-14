# Homepage Media Brief — LBTA

Use this brief to choose or shoot assets for each homepage section. Drop files into `public/images/` or `public/videos/`; we wire paths and alt when you provide new files.

---

## Section-by-section brief

| Section | Purpose | What to show | Aspect | Current path | Alt (example) |
|--------|---------|--------------|--------|--------------|----------------|
| **Hero** | Set tone, Laguna + tennis | Energetic training or play; courts; optional ocean hint | 16:9 or 21:9 | Video + poster | "LBTA training on court at Laguna Beach" |
| **Founder** | Trust, human | Andrew portrait, approachable | 4:5 or 3:4 | `/images/founder/andrew-portrait.webp` | "Andrew Mateljan, founder and head coach" |
| **Results** | Proof | Karue (or one pro) in focused training | 16:9 crop | `/images/results/karue-training.webp` | "ATP player in training session" |
| **Philosophy (×3)** | Movement, Craft, Community | Movement: footwork/drill; Craft: structure/technique; Community: group/team | 1:1 | `/images/philosophy/movement.webp`, `discipline.webp`, `belonging.webp` | "[Pillar name] — [short description]" |
| **Programs (×3)** | Junior, Adult, Private | Juniors: kids + coach or group; Adults: adults in lesson/social; Private: one-on-one focus | 4:3 | `/images/programs/juniors.webp`, `adults.webp`, `private-lessons.webp` | "Junior pathway at LBTA" etc. |
| **Destination** | Place, aspiration | Courts + horizon or Laguna context | 16:9 | `/images/hero/laguna-horizon.webp` | "Laguna Beach tennis courts with ocean view" |
| **Why Choose (×2)** | Trust, differentiation | Coaching on court; facility/community | 4:3 | `/images/why-choose/why-choose-1.webp`, `why-choose-2.webp` | "LBTA coach and players on court" / "Laguna Beach tennis facility and community" |
| **Community** | Belonging | Real players/families, variety of ages | 4:3 | `/images/community/community-1.webp` … `community-6.webp` | "LBTA community member" |
| **Video** | Trust, coach voice | Andrew (or coach) speaking to camera, concise | 16:9 | (VideoTestimonials) | "Andrew Mateljan on LBTA philosophy" |
| **Footer CTA** | Close, action | Courts at sunset or inviting courts | 16:9 | `/images/cta/cta-background.webp` | "Laguna Beach tennis courts at sunset" |

---

## Asset checklist (mark when ready)

| Slot | Path / location | Ready |
|------|-----------------|--------|
| Hero video (WebM) | `/videos/LBTA-Home-Hero.webm` | ☐ |
| Hero video (MP4, optional Safari) | `/videos/LBTA-Home-Hero.mp4` | ☐ |
| Hero poster | `/images/hero/laguna-horizon.webp` | ☐ |
| Founder portrait | `/images/founder/andrew-portrait.webp` | ☐ |
| Results | `/images/results/karue-training.webp` | ☐ |
| Philosophy — Movement | `/images/philosophy/movement.webp` | ☐ |
| Philosophy — Craft | `/images/philosophy/discipline.webp` | ☐ |
| Philosophy — Community | `/images/philosophy/belonging.webp` | ☐ |
| Programs — Juniors | `/images/programs/juniors.webp` | ☐ |
| Programs — Adults | `/images/programs/adults.webp` | ☐ |
| Programs — Private | `/images/programs/private-lessons.webp` | ☐ |
| Why Choose 1 | `/images/why-choose/why-choose-1.webp` | ☐ |
| Why Choose 2 | `/images/why-choose/why-choose-2.webp` | ☐ |
| Destination | `/images/hero/laguna-horizon.webp` | ☐ |
| Community 1–6 | `/images/community/community-1.webp` … `community-6.webp` | ☐ |
| Footer CTA | `/images/cta/cta-background.webp` | ☐ |

---

## Formats and specs

- **Images:** WebP preferred; max ~350KB where possible; provide `alt` text when you hand off (we’ll add to code).
- **Video:** WebM/MP4 as per current hero; keep short and on-brand. For hero encoding (high quality + fast LCP), see [Hero video optimization](../docs/hero-video-optimization.md).
- No stock imagery if avoidable; real courts, players, and coach preferred.

**Why Choose fallback:** If `why-choose-1.webp` or `why-choose-2.webp` are not yet in `public/images/why-choose/`, the site uses fallbacks so the section never breaks: image 1 falls back to `/images/hero/laguna-horizon.webp`, image 2 to `/images/community/community-1.webp`. Add the two WebP files when ready for full design.
