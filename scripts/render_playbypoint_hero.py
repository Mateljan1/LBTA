#!/usr/bin/env python3
"""LBTA Play By Point hero — canonical Cloudinary BG + strong scrim + copy (crisp per export size)."""

from __future__ import annotations

import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont

# Brand (generated/tokens.tailwind.json)
DEEP_WATER = np.array([15, 34, 55], dtype=np.float32)
DEEP_WATER_SHADOW = (12, 22, 38)
THOUSAND_STEPS = (196, 150, 60)
VICTORIA_COVE = (46, 139, 139)
WHITE = (255, 255, 255)
SOFT_WHITE = (245, 245, 250)

# Reference width for scaling typography / margins
REF_W = 2560


def load_font(path: str, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(path, size)


def add_bottom_scrim(rgb: Image.Image) -> Image.Image:
    """Heavy lower scrim: early fade + steep curve + extra darken in bottom ~38%."""
    arr = np.array(rgb).astype(np.float32)
    h, w = arr.shape[0], arr.shape[1]
    y0 = int(h * 0.22)
    for y in range(y0, h):
        rel = (y - y0) / max(1.0, (h - y0))
        # Steep: full deep-water feel by mid–lower frame
        t = rel**0.52
        arr[y, :, :] = arr[y, :, :] * (1.0 - t) + DEEP_WATER * t

    # Second pass: crush shadows in bottom band so type never sits on busy court lines
    y1 = int(h * 0.52)
    for y in range(y1, h):
        u = (y - y1) / max(1.0, (h - y1))
        factor = 1.0 - (0.22 * (u**1.1))
        arr[y, :, :] *= factor

    return Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8))


def draw_text_stack(
    draw: ImageDraw.ImageDraw,
    *,
    w: int,
    h: int,
    margin_x: int,
    margin_bottom: int,
    scale: float,
    fonts: dict[str, ImageFont.FreeTypeFont],
) -> None:
    """Left-anchored stack with bottom safe inset (avoids crop/clipping in PBP)."""
    eyebrow = "LAGUNA BEACH, CALIFORNIA"
    line1 = "Tennis, as it should"
    line2 = "be taught."
    pillars = "Movement. Craft. Community."
    util = "Book sessions · Track progress · Manage your schedule"

    gap_sm = int(max(12, 16 * scale))
    gap_md = int(max(18, 24 * scale))
    gap_lg = int(max(22, 30 * scale))

    def shadowed_text(
        xy: tuple[int, int],
        text: str,
        font: ImageFont.FreeTypeFont,
        fill: tuple[int, ...],
    ) -> None:
        x, y = xy
        off = max(2, int(3 * scale))
        for dx, dy, c in (
            (-off, 0, DEEP_WATER_SHADOW),
            (off, 0, DEEP_WATER_SHADOW),
            (0, -off, DEEP_WATER_SHADOW),
            (0, off, DEEP_WATER_SHADOW),
            (-off, -off, DEEP_WATER_SHADOW),
        ):
            draw.text((x + dx, y + dy), text, font=font, fill=c)
        draw.text(xy, text, font=font, fill=fill)

    util_bbox = draw.textbbox((0, 0), util, font=fonts["util"])
    util_h = util_bbox[3] - util_bbox[1]
    pillars_bbox = draw.textbbox((0, 0), pillars, font=fonts["pillars"])
    pillars_h = pillars_bbox[3] - pillars_bbox[1]
    l2_bbox = draw.textbbox((0, 0), line2, font=fonts["head"])
    l2_h = l2_bbox[3] - l2_bbox[1]
    l1_bbox = draw.textbbox((0, 0), line1, font=fonts["head"])
    l1_h = l1_bbox[3] - l1_bbox[1]
    ey_bbox = draw.textbbox((0, 0), eyebrow, font=fonts["eyebrow"])
    ey_h = ey_bbox[3] - ey_bbox[1]

    total_h = ey_h + gap_sm + l1_h + gap_sm + l2_h + gap_md + pillars_h + gap_lg + util_h
    bottom_inset = 20
    y = h - margin_bottom - total_h
    # Keep stack in lower ~60% (strong scrim zone); don't start too high in bright sky
    y = max(y, int(h * 0.40))
    # Never clip at bottom edge
    if y + total_h > h - bottom_inset:
        y = h - bottom_inset - total_h

    shadowed_text((margin_x, y), eyebrow, fonts["eyebrow"], THOUSAND_STEPS)
    y += ey_h + gap_sm
    shadowed_text((margin_x, y), line1, fonts["head"], WHITE)
    y += l1_h + gap_sm
    shadowed_text((margin_x, y), line2, fonts["head"], WHITE)
    y += l2_h + gap_md
    shadowed_text((margin_x, y), pillars, fonts["pillars"], SOFT_WHITE)
    y += pillars_h + gap_lg
    shadowed_text((margin_x, y), util, fonts["util"], VICTORIA_COVE)


def render_size(
    src: Path,
    out_path: Path,
    width: int,
    height: int,
    quality: int,
) -> None:
    scale = width / REF_W
    serif = "/System/Library/Fonts/Supplemental/Georgia.ttf"
    sans = "/System/Library/Fonts/Supplemental/Arial.ttf"

    base = Image.open(src).convert("RGB")
    base = base.resize((width, height), Image.Resampling.LANCZOS)
    base = add_bottom_scrim(base)

    margin_x = int(max(56, 96 * scale))
    margin_bottom = int(max(100, 140 * scale))

    fonts = {
        "eyebrow": load_font(sans, max(18, int(24 * scale))),
        "head": load_font(serif, max(52, int(88 * scale))),
        "pillars": load_font(sans, max(26, int(36 * scale))),
        "util": load_font(sans, max(20, int(28 * scale))),
    }

    draw = ImageDraw.Draw(base)
    draw_text_stack(
        draw,
        w=width,
        h=height,
        margin_x=margin_x,
        margin_bottom=margin_bottom,
        scale=scale,
        fonts=fonts,
    )

    base.save(out_path, format="JPEG", quality=quality, optimize=True, subsampling=1)


def main() -> int:
    src = Path(sys.argv[1]) if len(sys.argv) > 1 else Path("/tmp/lbta-cta-bg.webp")
    out_dir = Path(sys.argv[2]) if len(sys.argv) > 2 else Path("assets/playbypoint")
    out_dir.mkdir(parents=True, exist_ok=True)

    if not src.is_file():
        print(f"Missing source image: {src}", file=sys.stderr)
        return 1

    render_size(src, out_dir / "lbta-playbypoint-hero-2560x1440.jpg", 2560, 1440, 92)
    render_size(src, out_dir / "lbta-playbypoint-hero-1920x1080.jpg", 1920, 1080, 92)

    for name in (
        "lbta-playbypoint-hero-2560x1440.jpg",
        "lbta-playbypoint-hero-1920x1080.jpg",
    ):
        p = out_dir / name
        mb = p.stat().st_size / (1024 * 1024)
        print(f"Wrote {p} ({mb:.2f} MB)")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
