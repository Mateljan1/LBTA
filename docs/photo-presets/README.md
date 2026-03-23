# LBTA cohesive photo presets

Use these three looks so every LBTA image feels like **one editorial series**: warm California light, natural courts, calm color (no HDR, no neon blues).

**Files here**

| File | Purpose |
|------|---------|
| `lbta-cohesive-looks.json` | Machine-readable presets (Lightroom-style fields + Canva hints) |
| `README.md` | How to apply in Lightroom, Camera Raw, and Canva |

**Which preset when**

| Preset | When to use |
|--------|-------------|
| **Daylight Court** | Sunny daytime, coaching, juniors/adults on court |
| **Golden Hour** | Late sun, long shadows, sunset sky, wide facility shots |
| **Night Under Lights** | Evening training under court lights |

---

## 1) Adobe Lightroom Classic / Camera Raw

1. Pick a **hero reference** image you love; apply the preset; tweak **Temperature** ±100K until skin looks natural.
2. **Sync** (or Copy/Paste settings) to other photos from the **same lighting condition** first; then repeat for other conditions.
3. Export **WebP** from Lightroom if available, or **JPEG 100%** → convert with `cwebp` / Squoosh.

### LBTA — Daylight Court

| Control | Value (start) |
|---------|----------------|
| Temp | +180 |
| Tint | +4 |
| Exposure | +0.15 |
| Contrast | +12 |
| Highlights | −32 |
| Shadows | +22 |
| Whites | −8 |
| Blacks | −6 |
| Texture | +6 |
| Clarity | +10 |
| Dehaze | +3 |
| Vibrance | +4 |
| Saturation | −6 |

### LBTA — Golden Hour

| Control | Value (start) |
|---------|----------------|
| Temp | +320 |
| Tint | +6 |
| Exposure | +0.08 |
| Contrast | +10 |
| Highlights | −40 |
| Shadows | +28 |
| Whites | −12 |
| Blacks | −4 |
| Texture | +4 |
| Clarity | +8 |
| Dehaze | +2 |
| Vibrance | +2 |
| Saturation | −8 |

### LBTA — Night Under Lights

| Control | Value (start) |
|---------|----------------|
| Temp | +40 |
| Tint | +2 |
| Exposure | +0.35 |
| Contrast | +8 |
| Highlights | −25 |
| Shadows | +35 |
| Whites | −15 |
| Blacks | −8 |
| Texture | +4 |
| Clarity | +6 |
| Dehaze | +4 |
| Vibrance | −2 |
| Saturation | −5 |

**Night only:** Luminance noise reduction **15–25**, Detail **~40** if the file is noisy.

---

## 2) Canva (quick match)

Canva sliders vary by device; use **relative** moves:

- **Daylight:** warmth +5–10%, contrast +10–15%, saturation −8–12%, lift shadows, recover highlights.
- **Golden:** warmth +12–18%, saturation −10–14%, more highlight recovery than Daylight.
- **Night:** brightness +10–18%, lift shadows heavily, soften highlights, keep saturation slightly down.

Always **compare** to a finished LBTA web section in another tab so contrast doesn’t exceed the site’s calm look.

---

## 3) Quality gate before upload

- Same **three** presets only (plus small per-image fixes).
- Export dimensions per `plans/image-spec-best-in-class.md` (e.g. **1920×1080** for full-bleed).
- WebP **≤ ~350 KB** heroes, **≤ ~200 KB** cards when possible.

---

*Preset pack version 1.0 — March 2026.*
