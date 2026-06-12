# LBTA app — cohesive asset pack (production spec)

**Objective:** Ship one polished, coherent visual system for the third-party club app that matches LBTA's live brand voice: calm, clear, and premium.

**Source of truth:** This file is the final upload specification for app assets.  
**Cloud name:** `dv033eo0x`  
**Desktop destination:** `~/Desktop/LBTA-App-Assets/final-upload/`

---

## Brand direction for this pack

- **Tone:** Movement. Craft. Community. No loud promo aesthetics.
- **Visual posture:** clean crops, no baked-in text on utility images, strong blue foundation.
- **Color anchors:** Pacific Dusk `#1B3A5C`, Deep Water `#0F2237`, Morning Light `#FAF8F4`.
- **Selection rule:** choose one best image per slot and keep it stable (consistency over frequent swaps).

### Website-match visual profile (Cloudinary)

Use this when generating replacements so app visuals stay aligned with the live LBTA site style.

- **Website assets:** prefer `f_auto,q_auto` for web surfaces.
- **Email-only assets:** force `f_jpg` for compatibility.
- **Core crop default:** `c_fill,g_auto`.
- **Mobile-safe crop fallback:** `c_fill,g_auto:subject` for critical banners/covers.
- **Do not over-style:** avoid heavy vignette or extreme saturation shifts.

Recommended context grade presets:

- **DAYTIME:** `e_brightness:5/e_contrast:-10/e_saturation:-10/e_vibrance:15/e_tint:8/e_sharpen:60`
- **GROUP / COMMUNITY:** `e_brightness:5/e_contrast:-10/e_saturation:-8/e_vibrance:15/e_tint:10/e_sharpen:50`

---

## Final production set (use this)

| # | App Slot | Spec | Final File Name | Final Cloudinary URL |
|---|---|---|---|---|
| 1 | System color - default | Hex | n/a | `#1B3A5C` |
| 2 | System color - dark | Hex | n/a | `#0F2237` |
| 3 | Signup photo | 1200x851 JPG | `06-signup-photo.jpg` | `https://res.cloudinary.com/dv033eo0x/image/upload/c_fill,g_auto,w_1200,h_851/f_jpg/q_auto:eco/v1776164749/Karue_FH_hero_2_cnd53p.jpg` |
| 4 | White logo | 1200x384 PNG, transparent | `01-white-logo.png` | `https://res.cloudinary.com/dv033eo0x/image/upload/c_pad,w_1200,h_384,b_transparent,e_colorize:100,co_white/f_png/v1774908286/LBTA_Logo_-_Horizontal_pkmav6.png` |
| 5 | Colored logo | 1200x384 PNG, transparent | `02-colored-logo.png` | `https://res.cloudinary.com/dv033eo0x/image/upload/c_pad,w_1200,h_384,b_transparent/f_png/v1774908286/LBTA_Logo_-_Horizontal_pkmav6.png` |
| 6 | Icon logo | 500x500 PNG, solid bg | `03-icon-logo.png` | `https://res.cloudinary.com/dv033eo0x/image/upload/c_pad,w_500,h_500,b_rgb:0F2237/f_png/v1774908285/Blank_x9ugu0.png` |
| 7 | TV logo | 1920x1080 PNG | `04-tv-logo.png` | `https://res.cloudinary.com/dv033eo0x/image/upload/c_pad,w_1920,h_1080,b_rgb:0F2237/f_png/v1774908286/LBTA_Logo_-_Horizontal_pkmav6.png` |
| 8 | Home - Programs tile | 500x500 JPG | `09-home-programs-logo.jpg` | `https://res.cloudinary.com/dv033eo0x/image/upload/c_fill,g_auto,w_500,h_500/f_jpg/q_auto:good/v1776035010/9D30C663-85F2-48B0-B34C-87D340674789_1_105_c_tahv0a.jpg` |
| 9 | Home - Pros tile | 500x500 JPG | `10-home-pros-logo.jpg` | `https://res.cloudinary.com/dv033eo0x/image/upload/c_fill,g_auto,w_500,h_500/f_jpg/q_auto:good/v1776164749/Ryan_Seggerman__Serve_Hero_srkabk.jpg` |
| 10 | Home - default banner | 1920x1080 JPG | `08-home-default-banner.jpg` | `https://res.cloudinary.com/dv033eo0x/image/upload/c_fill,g_auto,w_1920,h_1080/f_jpg/q_auto:good/v1776164749/Karue_FH_hero_2_cnd53p.jpg` |
| 11 | Facility cover photo | 1242x520 JPG | `07-facility-cover.jpg` | `https://res.cloudinary.com/dv033eo0x/image/upload/c_fill,g_auto:subject,w_1242,h_520/f_jpg/q_auto:good/v1775666357/7048DEF2-DE28-42AC-A598-788BA3C3730F_1_105_c_wohq2f.jpg` |
| 12 | Email logo | 600x200 PNG, transparent | `05-email-logo.png` | `https://res.cloudinary.com/dv033eo0x/image/upload/c_pad,w_600,h_200,b_transparent/f_png/v1774908286/LBTA_Logo_-_Horizontal_pkmav6.png` |
| 13 | Email header color | Hex | n/a | `#FAF8F4` |
| 14 | Banner ad - junior | 710x300 JPG | `11-banner-junior.jpg` | `https://res.cloudinary.com/dv033eo0x/image/upload/c_fill,g_auto,w_710,h_300/f_jpg/q_auto:good/v1776164749/Henry_mateljan_4.6_UTR_9yrs_old_backhand_roqsfu.jpg` |
| 15 | Banner ad - adult | 710x300 JPG | `12-banner-adult.jpg` | `https://res.cloudinary.com/dv033eo0x/image/upload/c_fill,g_auto,w_710,h_300/f_jpg/q_auto:good/v1776164927/Olov_fh_hero_qgzara.jpg` |
| 16 | Banner ad - camps | 710x300 JPG | `13-banner-camps.jpg` | `https://res.cloudinary.com/dv033eo0x/image/upload/c_fill,g_auto,w_710,h_300/f_jpg/q_auto:good/v1775614949/Summer-Tennis-Camps-Program-Photo-1200x851-2_ry29pi.jpg` |
| 17 | Banner ad - events | 710x300 JPG | `14-banner-events.jpg` | `https://res.cloudinary.com/dv033eo0x/image/upload/c_fill,g_auto,w_710,h_300/f_jpg/q_auto:good/v1776187663/andrew_ladies_usta_team_t1yjnq.jpg` |

**Not in scope here:** Program photo batch (18 images, 1200x851). Keep using `plans/2026-04-14-playbypoint-program-photos-plan.md`.

---

## Mobile experience spec (final polish)

This app is consumed heavily on phone. These rules protect quality across narrow viewports.

### Subject-safe framing rules

- Keep faces/players inside the **center 60 percent width** of every hero/banner crop.
- Avoid placing heads near top 10 percent; mobile UI bars may cut them off.
- Keep horizon lines in upper-middle third (not at the very top edge).
- Avoid text baked into imagery; mobile overlays need clean background.

### Mobile QA breakpoints (required)

Validate uploaded assets at:

- `320x568` (small phone)
- `375x812` (standard iPhone)
- `390x844` (modern iPhone)
- `428x926` (large phone)

### Mobile-pass acceptance

- No face or racquet is clipped awkwardly in banners.
- Home Programs/Pros tiles remain legible at card-thumbnail size.
- Facility cover still communicates place/context on narrow screens.
- Banner overlays (title/CTA) maintain readable contrast.

---

## Why this set is the strongest

- **Immediate LBTA identity:** deep blue system colors + disciplined logo usage.
- **Human, athletic, premium:** hero and tiles mirror live-site imagery style.
- **Operationally simple:** one canonical set, no upload ambiguity.
- **Safe in app UI:** utility images are text-free; app overlays remain legible.

---

## One-command download to final folder

```bash
set -e
DEST="$HOME/Desktop/LBTA-App-Assets/final-upload"
mkdir -p "$DEST"
cd "$DEST"

# Logos
curl -fsSL -o "01-white-logo.png" "https://res.cloudinary.com/dv033eo0x/image/upload/c_pad,w_1200,h_384,b_transparent,e_colorize:100,co_white/f_png/v1774908286/LBTA_Logo_-_Horizontal_pkmav6.png"
curl -fsSL -o "02-colored-logo.png" "https://res.cloudinary.com/dv033eo0x/image/upload/c_pad,w_1200,h_384,b_transparent/f_png/v1774908286/LBTA_Logo_-_Horizontal_pkmav6.png"
curl -fsSL -o "03-icon-logo.png" "https://res.cloudinary.com/dv033eo0x/image/upload/c_pad,w_500,h_500,b_rgb:0F2237/f_png/v1774908285/Blank_x9ugu0.png"
curl -fsSL -o "04-tv-logo.png" "https://res.cloudinary.com/dv033eo0x/image/upload/c_pad,w_1920,h_1080,b_rgb:0F2237/f_png/v1774908286/LBTA_Logo_-_Horizontal_pkmav6.png"
curl -fsSL -o "05-email-logo.png" "https://res.cloudinary.com/dv033eo0x/image/upload/c_pad,w_600,h_200,b_transparent/f_png/v1774908286/LBTA_Logo_-_Horizontal_pkmav6.png"

# Core photos
curl -fsSL -o "06-signup-photo.jpg" "https://res.cloudinary.com/dv033eo0x/image/upload/c_fill,g_auto,w_1200,h_851/f_jpg/q_auto:eco/v1776164749/Karue_FH_hero_2_cnd53p.jpg"
curl -fsSL -o "07-facility-cover.jpg" "https://res.cloudinary.com/dv033eo0x/image/upload/c_fill,g_auto:subject,w_1242,h_520/f_jpg/q_auto:good/v1775666357/7048DEF2-DE28-42AC-A598-788BA3C3730F_1_105_c_wohq2f.jpg"
curl -fsSL -o "08-home-default-banner.jpg" "https://res.cloudinary.com/dv033eo0x/image/upload/c_fill,g_auto,w_1920,h_1080/f_jpg/q_auto:good/v1776164749/Karue_FH_hero_2_cnd53p.jpg"
curl -fsSL -o "09-home-programs-logo.jpg" "https://res.cloudinary.com/dv033eo0x/image/upload/c_fill,g_auto,w_500,h_500/f_jpg/q_auto:good/v1776035010/9D30C663-85F2-48B0-B34C-87D340674789_1_105_c_tahv0a.jpg"
curl -fsSL -o "10-home-pros-logo.jpg" "https://res.cloudinary.com/dv033eo0x/image/upload/c_fill,g_auto,w_500,h_500/f_jpg/q_auto:good/v1776164749/Ryan_Seggerman__Serve_Hero_srkabk.jpg"

# Active banners
curl -fsSL -o "11-banner-junior.jpg" "https://res.cloudinary.com/dv033eo0x/image/upload/c_fill,g_auto,w_710,h_300/f_jpg/q_auto:good/v1776164749/Henry_mateljan_4.6_UTR_9yrs_old_backhand_roqsfu.jpg"
curl -fsSL -o "12-banner-adult.jpg" "https://res.cloudinary.com/dv033eo0x/image/upload/c_fill,g_auto,w_710,h_300/f_jpg/q_auto:good/v1776164927/Olov_fh_hero_qgzara.jpg"
curl -fsSL -o "13-banner-camps.jpg" "https://res.cloudinary.com/dv033eo0x/image/upload/c_fill,g_auto,w_710,h_300/f_jpg/q_auto:good/v1775614949/Summer-Tennis-Camps-Program-Photo-1200x851-2_ry29pi.jpg"
curl -fsSL -o "14-banner-events.jpg" "https://res.cloudinary.com/dv033eo0x/image/upload/c_fill,g_auto,w_710,h_300/f_jpg/q_auto:good/v1776187663/andrew_ladies_usta_team_t1yjnq.jpg"

echo "Downloaded final upload set to: $DEST"
ls -la "$DEST"
```

---

## Upload sequence (assistant-ready)

1. **Settings > System colors**
   - Default: `#1B3A5C`
   - Dark: `#0F2237`
2. **Settings > Images**
   - Signup photo: `06-signup-photo.jpg`
   - White logo: `01-white-logo.png`
   - Colored logo: `02-colored-logo.png`
   - Icon logo: `03-icon-logo.png`
   - TV logo: `04-tv-logo.png`
3. **Settings > Home images**
   - Programs logo: `09-home-programs-logo.jpg`
   - Pros logo: `10-home-pros-logo.jpg`
   - Default banner: `08-home-default-banner.jpg`
4. **Settings > Facility cover**
   - `07-facility-cover.jpg`
5. **Settings > Email**
   - Email logo: `05-email-logo.png`
   - Header color: `#FAF8F4`
6. **Banner ads**
   - Upload `11` through `14`
   - Keep only **3 to 6 active** at a time
7. **Program photos**
   - Complete separately from `plans/2026-04-14-playbypoint-program-photos-plan.md`

---

## Recommended in-app copy (voice-matched)

Use these labels/titles to match the website tone.

### Home tile labels

- **Programs:** `Pathways for Every Player`
- **Pros:** `Coach-Led, Movement-First`

### Banner titles (mapped to final files)

- `11-banner-junior.jpg` -> `Junior Development`
- `12-banner-adult.jpg` -> `Adult Programs`
- `13-banner-camps.jpg` -> `Seasonal Camps`
- `14-banner-events.jpg` -> `Leagues and Team Play`

### Banner subtitle pattern

Use one line, calm tone:

- `Structured training for real progress.`
- `Build confidence through movement and repetition.`
- `Train with purpose in a serious community.`

Avoid hype words like "elite", "world-class", "limited-time", and excessive punctuation.

---

## Acceptance checklist (done means all checked)

- [ ] Final folder exists: `~/Desktop/LBTA-App-Assets/final-upload/`
- [ ] All 14 final files present with exact names
- [ ] Logos render crisp at 100 percent zoom
- [ ] Icon logo background is solid Deep Water (not transparent)
- [ ] Signup, facility, and banners are text-free
- [ ] In-app banner count is between 3 and 6
- [ ] Email header is set to `#FAF8F4`
- [ ] Programs and Pros tiles appear visually balanced in app cards
- [ ] Category chips still match `plans/2026-04-19-program-categories-browser-assistant-brief.md`
- [ ] Mobile QA completed at 320, 375, 390, and 428 widths
- [ ] No critical subject clipping in mobile banners/covers

---

## Optional alternates (use only if needed)

Folder: `~/Desktop/LBTA-App-Assets/options/`

- Banners:
  - `15-optional-banner-competitive.jpg`
  - `16-optional-banner-private.jpg`
- Home tiles:
  - `17-optional-home-programs-logo-v3.jpg`
  - `18-optional-home-pros-logo-v3.jpg`

Only swap alternates if readability or relevance is stronger than the default final set.

---

## Risks and quick fixes

- **White logo colorization mismatch:** if colorized white looks off, upload local `public/logos/LBTAwhttext.png`.
- **App rejects transparent background:** switch `b_transparent` to `b_rgb:FAF8F4`.
- **File size cap exceeded:** add `q_auto:eco` to JPG transforms or `fl_lossy` for PNG output.

---

## Related plans

- Category names and colors: `plans/2026-04-19-program-categories-browser-assistant-brief.md`
- Program photos batch: `plans/2026-04-14-playbypoint-program-photos-plan.md`
