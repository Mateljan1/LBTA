# Playbypoint visual settings - polished final pack

Objective: ship one cohesive, premium-looking LBTA brand set across all Playbypoint "Visual Customizations" slots.

This is the final upload guide for:
- System Colors
- Images
- Home Images
- Email

---

## 1) Brand direction for Playbypoint

- Calm, premium, movement-first (not loud promo).
- Deep navy foundation with clean, bright neutrals.
- Logos stay crisp and simple; photos carry energy.
- No baked text in utility images (app overlays should stay readable).

Primary palette:
- Default color: `#1B3A5C` (Pacific Dusk)
- Dark color: `#0F2237` (Deep Water)
- Email header color: `#FAF8F4` (Morning Light)

---

## 2) Final slot-by-slot mapping (upload this set)

### System Colors

- Default color: `#1B3A5C`
- Dark color: `#0F2237`

### Images

- Signup photo -> `06-signup-photo.jpg`
  - Cloudinary: `https://res.cloudinary.com/dv033eo0x/image/upload/c_fill,g_auto,w_1200,h_851/f_jpg/q_auto:eco/v1776164749/Karue_FH_hero_2_cnd53p.jpg`
- White logo -> `01-white-logo.png`
  - Cloudinary: `https://res.cloudinary.com/dv033eo0x/image/upload/c_pad,w_1200,h_384,b_transparent,e_colorize:100,co_white/f_png/v1774908286/LBTA_Logo_-_Horizontal_pkmav6.png`
- Colored logo -> `02-colored-logo.png`
  - Cloudinary: `https://res.cloudinary.com/dv033eo0x/image/upload/c_pad,w_1200,h_384,b_transparent/f_png/v1774908286/LBTA_Logo_-_Horizontal_pkmav6.png`
- Icon logo -> `03-icon-logo.png`
  - Cloudinary: `https://res.cloudinary.com/dv033eo0x/image/upload/c_pad,w_500,h_500,b_rgb:0F2237/f_png/v1774908285/Blank_x9ugu0.png`
- Logo for TV screen -> `04-tv-logo.png`
  - Cloudinary: `https://res.cloudinary.com/dv033eo0x/image/upload/c_pad,w_1920,h_1080,b_rgb:0F2237/f_png/v1774908286/LBTA_Logo_-_Horizontal_pkmav6.png`

### Home Images

- Programs logo -> `09-home-programs-logo.jpg`
  - Cloudinary: `https://res.cloudinary.com/dv033eo0x/image/upload/c_fill,g_auto,w_500,h_500/f_jpg/q_auto:good/v1776035010/9D30C663-85F2-48B0-B34C-87D340674789_1_105_c_tahv0a.jpg`
- Pros logo -> `10-home-pros-logo.jpg`
  - Cloudinary: `https://res.cloudinary.com/dv033eo0x/image/upload/c_fill,g_auto,w_500,h_500/f_jpg/q_auto:good/v1776164749/Ryan_Seggerman__Serve_Hero_srkabk.jpg`
- Default banner image -> `08-home-default-banner.jpg`
  - Cloudinary: `https://res.cloudinary.com/dv033eo0x/image/upload/c_fill,g_auto,w_1920,h_1080/f_jpg/q_auto:good/v1776164749/Karue_FH_hero_2_cnd53p.jpg`

### Email

- Email logo -> `05-email-logo.png`
  - Cloudinary: `https://res.cloudinary.com/dv033eo0x/image/upload/c_pad,w_600,h_200,b_transparent/f_png/v1774908286/LBTA_Logo_-_Horizontal_pkmav6.png`
- Color for email header -> `#FAF8F4`

---

## 3) Optional but recommended additional uploads

If these slots are visible in your account:

- Facility cover photo -> `07-facility-cover.jpg`
  - Cloudinary: `https://res.cloudinary.com/dv033eo0x/image/upload/c_fill,g_auto:subject,w_1242,h_520/f_jpg/q_auto:good/v1775666357/7048DEF2-DE28-42AC-A598-788BA3C3730F_1_105_c_wohq2f.jpg`
- Active promo banners (keep only 3-6 live at once):
  - `11-banner-junior.jpg`
  - `12-banner-adult.jpg`
  - `13-banner-camps.jpg`
  - `14-banner-events.jpg`

---

## 4) Quality bar (what "polished" means)

Before saving settings, verify:

- Logos are crisp at 100% zoom and centered with breathing room.
- White logo reads clearly on dark UI blocks.
- Icon logo has a solid dark background (not transparent artifacts).
- Programs and Pros tiles feel balanced as a pair (no clashing crops).
- Banner focal subject remains centered on mobile widths.
- No image has text baked in that conflicts with app overlays.
- Colors are consistent with website tone (deep blue + warm neutral).

---

## 5) Upload order (fastest path)

1. Set System Colors (`#1B3A5C`, `#0F2237`).
2. Upload all five files in Images.
3. Upload Home Images (Programs, Pros, Default Banner).
4. Upload Email logo and set header color (`#FAF8F4`).
5. Save, refresh app, and run mobile QA at 320, 375, 390, 428 widths.

---

## 6) Fallbacks (if Playbypoint rejects files)

- If transparent PNG fails, swap `b_transparent` to `b_rgb:FAF8F4`.
- If file is too large, append `q_auto:eco` (JPG) or `fl_lossy` (PNG).
- If white logo appears gray, use local fallback: `public/logos/LBTA-horizontal-white.png`.

---

## 7) Source references

- Core cohesive pack: `plans/2026-04-19-app-cohesive-asset-pack.md`
- Program/home visual production: `plans/2026-04-19-playbypoint-home-page-assets.md`
