# Homepage Image Usage — Design Review

**Status:** Review complete. Placement/sizing issues identified; `objectPosition` recommendations applied in code.

---

## 1. Design review status

| Section       | Images | Container aspect | Source aspect | objectPosition (before) | Semantic match |
|---------------|--------|------------------|---------------|-------------------------|----------------|
| Philosophy    | 3      | square           | 800×800       | none (center)           | Yes            |
| Programs      | 3      | 4/3              | 2× 800×800, 1× 1920×1080 | none           | Yes            |
| Why Choose    | 2      | 4/3              | 2× 1920×1080  | none                    | Yes            |
| Community     | 6      | 4/3              | (see note)    | 50% 55%                 | N/A            |

**Community assets:** Page references `/images/community/community-1.webp` … `community-6.webp`. No files found under `public/images/community/` in repo; section may 404 or be filled by deployment assets. Review assumes 4/3 usage with existing `objectPosition: 50% 55%`.

---

## 2. Correctly implemented

- **Semantics:** All current image-to-slot assignments are appropriate:
  - Philosophy: movement (lunge drill), discipline (coach overhead = Craft), belonging (group portrait = Community).
  - Programs: juniors (junior backhand), adults (adult forehand), private (coaching drill).
  - Why Choose: coaching on court; facility/overview.
- **Community:** Already uses `objectPosition: 50% 55%` to favor faces.
- **Aspect:** Philosophy uses aspect-square with square sources — no aspect mismatch (only centering/crop risk).

---

## 3. Placement / sizing issues

### Philosophy (3 images, aspect-square, object-cover)

- **Issue:** Default `object-position: center` can crop heads when people are in upper half of the square.
- **Impact:** Medium (depends on composition of 16, 02, 11).
- **Fix:** Set `objectPosition` to favor upper frame (e.g. `50% 25%` or `50% 30%`) so faces stay visible.

### Programs (3 images, aspect-[4/3], object-cover)

- **Juniors / Adults:** Source 800×800 (square) in 4/3 container → object-cover crops **sides** of the square. Center default may cut through subject; vertical position matters if face is high in frame.
- **Private lessons:** Source 1920×1080 (16:9) in 4/3 → crops **top/bottom**. People/coach often in lower half; center can cut heads or leave too much sky.
- **Impact:** Medium (cropping can remove faces or key action).
- **Fix:** Add `objectPosition`: juniors/adults `50% 35%` or `50% 40%` to favor upper body/face; private `50% 55%` or `50% 60%` to keep people in frame when cropping top/bottom.

### Why Choose (2 images, aspect-[4/3], object-cover)

- **Issue:** 16:9 sources in 4/3 container → top/bottom cropped. No `objectPosition`; WhyChooseImage does not set one.
- **Image 1 (coaching):** People in frame → prefer lower focus (e.g. `50% 55%` or `50% 60%`).
- **Image 2 (facility overview):** Horizon/sky important → prefer upper focus (e.g. `50% 30%` or `50% 40%`) or keep `50% 50%` for balanced crop.
- **Impact:** Medium.
- **Fix:** Pass `style={{ objectPosition: '…' }}` into WhyChooseImage per slot (see recommendations below).

### Community (6 images)

- **Status:** Already uses `50% 55%`. If community assets are portrait or people-heavy, consider per-image positions later; no code change required for this review.

---

## 4. Semantic check (no wrong image for slot)

- **Philosophy:** Movement = lunge drill ✓; Craft = coach overhead ✓; Community = group portrait ✓.
- **Programs:** Juniors = junior backhand ✓; Adults = adult forehand ✓; Private = coaching lesson ✓.
- **Why Choose:** Coach/players on court ✓; Facility/community ✓.

No image is used in a semantically wrong slot.

---

## 5. Recommendations summary

| Section     | Current objectPosition | Recommended objectPosition | Notes |
|------------|------------------------|----------------------------|--------|
| Philosophy | (none → center)        | `50% 30%`                  | Prioritize upper frame to avoid cutting heads in square crops. |
| Programs — Juniors | (none)          | `50% 38%`                 | Square→4/3; keep face/upper body visible. |
| Programs — Adults  | (none)          | `50% 38%`                 | Same. |
| Programs — Private | (none)          | `50% 55%`                 | 16:9→4/3; keep coach/player in frame when cropping top/bottom. |
| Why Choose 1       | (none)          | `50% 55%`                 | Coaching shot; favor people. |
| Why Choose 2       | (none)          | `50% 35%`                 | Facility overview; favor horizon/sky. |
| Community          | `50% 55%`       | (unchanged)               | Already face-favoring. |

---

## 6. Aspect recommendations (optional)

- **Philosophy:** Keep aspect-square; sources are square. Only positioning needed.
- **Programs:** Keeping 4/3 is fine for layout consistency. If design allows, consider aspect-[3/4] for juniors/adults (portrait) to reduce crop; would require layout tweak.
- **Why Choose:** 4/3 is acceptable; 16:9→4/3 crop is manageable with the objectPosition values above.

---

*Review completed; code updates applied in `app/page.tsx` and `components/ui/WhyChooseImage.tsx` (style prop passed through).*
