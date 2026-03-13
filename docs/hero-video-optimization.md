# Hero Video Optimization — LBTA

The homepage hero uses a **video** (not a static image). This doc covers how we keep it **fast** (good LCP) and **high quality** (clear, polished playback).

---

## How we optimize for speed

1. **Poster image = LCP**  
   The hero `<video>` uses a `poster` image. The browser paints the poster immediately, so **LCP is the poster**, not the video. That keeps LCP under 2.5s even on slow connections.

2. **Preload the poster**  
   In `app/layout.tsx` we preload the poster with `fetchPriority="high"` so the browser requests it early and LCP is as fast as possible.

3. **`preload="metadata"` on the video**  
   We do **not** use `preload="auto"` on the hero video. With `preload="metadata"`, the browser loads only metadata (and maybe a tiny amount of data). The poster stays visible while the video buffers in the background, then playback starts when enough data is ready. That avoids blocking LCP on the full video file.

4. **Source order**  
   We list **WebM first**, then **MP4**. Browsers that support WebM (Chrome, Firefox, Edge) use the smaller WebM; Safari uses MP4. That keeps file size and bandwidth lower where possible.

---

## Delivering high-quality video

- **WebM (VP9)**  
  Used by Chrome, Firefox, Edge. Typically smaller at the same visual quality than H.264.

- **MP4 (H.264)**  
  Required for **Safari** (desktop and iOS). Without an MP4, Safari users get no video or a broken experience.

**Required files in `public/videos/`:**

| File | Purpose |
|------|--------|
| `LBTA-Home-Hero.webm` | Primary (Chrome, Firefox, Edge). VP9, no audio. |
| `LBTA-Home-Hero.mp4` | Fallback for Safari. H.264, no audio. |

Use a single high-quality **master** (e.g. ProRes, or a high-bitrate H.264/MP4), then generate both WebM and MP4 from it so they stay in sync and look the same.

---

## FFmpeg: high-quality encodes

Install [FFmpeg](https://ffmpeg.org/) if needed (`brew install ffmpeg` on macOS).

Assume your master file is `LBTA-Home-Hero-MASTER.mov` (or `.mp4`). Run from the repo root or put outputs into `public/videos/` when done.

### 1. WebM (VP9) — high quality, no audio

Removing the audio track saves ~20% and is correct for a muted hero.

**Two-pass (best quality/size):**

```bash
# Pass 1
ffmpeg -i LBTA-Home-Hero-MASTER.mov -c:v libvpx-vp9 -b:v 0 -crf 28 -an -pass 1 -f webm -y /dev/null

# Pass 2 (output)
ffmpeg -i LBTA-Home-Hero-MASTER.mov -c:v libvpx-vp9 -b:v 0 -crf 28 -an -pass 2 -f webm -y public/videos/LBTA-Home-Hero.webm
```

**Single-pass (faster, still very good):**

```bash
ffmpeg -i LBTA-Home-Hero-MASTER.mov -c:v libvpx-vp9 -crf 28 -an -row-mt 1 -f webm -y public/videos/LBTA-Home-Hero.webm
```

- **`-crf 28`** — Slightly smaller files; use **24–26** if you want a bit more clarity and larger size.
- **`-an`** — No audio (required for muted autoplay and saves bandwidth).
- **`-row-mt 1`** — Multi-threading for VP9 (single-pass).

### 2. MP4 (H.264) — for Safari, high quality, no audio

```bash
ffmpeg -i LBTA-Home-Hero-MASTER.mov -c:v libx264 -crf 20 -preset slow -profile:v high -an -movflags +faststart -y public/videos/LBTA-Home-Hero.mp4
```

- **`-crf 20`** — High quality; use **18** for a bit more clarity, **22** for smaller files.
- **`-preset slow`** — Better compression; use `medium` if encodes are too slow.
- **`-movflags +faststart`** — Puts metadata at the start so playback can begin before the file is fully downloaded.
- **`-an`** — No audio.

---

## Optional: responsive (mobile) variant

For slower networks or small screens you can serve a 720p version and keep 1080p for desktop. That requires:

1. **Generate a 720p WebM and 720p MP4** (e.g. `LBTA-Home-Hero-720.webm` and `LBTA-Home-Hero-720.mp4`).
2. **Use `<source media="(max-width: 768px)" …>`** for the 720p files and the current sources without `media` for desktop.

**Example FFmpeg for 720p:**

```bash
# WebM 720p
ffmpeg -i LBTA-Home-Hero-MASTER.mov -vf scale=-2:720 -c:v libvpx-vp9 -crf 28 -an -row-mt 1 -f webm -y public/videos/LBTA-Home-Hero-720.webm

# MP4 720p
ffmpeg -i LBTA-Home-Hero-MASTER.mov -vf scale=-2:720 -c:v libx264 -crf 20 -preset slow -profile:v high -an -movflags +faststart -y public/videos/LBTA-Home-Hero-720.mp4
```

Then in `HomeHero.tsx` you’d add sources with `media="(max-width: 768px)"` pointing at the 720p files, and keep the current sources for default (desktop).

---

## Poster image

- **Path:** `public/images/hero/hero-poster.webp` (LCP; keep &lt; 200KB). Full hero: `laguna-horizon.webp`. Run `node scripts/generate-hero-poster.js` after changing hero.
- Use the **same aspect ratio** as the video (e.g. 16:9) to avoid layout shift when the video replaces the poster.
- Keep the file small (e.g. WebP, &lt; 100KB) so the preloaded poster doesn’t compete with other critical resources.

---

## Checklist

- [ ] Poster is in place and preloaded (layout + HomeHero).
- [ ] `LBTA-Home-Hero.webm` (VP9, no audio) in `public/videos/`.
- [ ] `LBTA-Home-Hero.mp4` (H.264, no audio, faststart) in `public/videos/` for Safari.
- [ ] Re-encode from a high-quality master when you want to refresh quality or trim; then replace both files and re-test on Chrome and Safari.
