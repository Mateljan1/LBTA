#!/usr/bin/env python3
"""
Generate mobile-safe assets for the PlayByPoint Customizations panel.

Outputs:
  ~/Desktop/LBTA-Customizations-Panel-Pack/
"""

from __future__ import annotations

import csv
import os
from pathlib import Path
from urllib.request import Request, urlopen

from PIL import Image, ImageFilter, ImageOps


OUT = Path.home() / "Desktop" / "LBTA-Customizations-Panel-Pack"
SRC = OUT / "_sources"
COVER_DIR = OUT / "cover-photo-1242x520"
HOME_DIR = OUT / "home-photo-1436x1748"
GALLERY_DIR = OUT / "gallery-photos-1200x851"
LOGO_DIR = OUT / "logos-admin"

MORNING_LIGHT = (250, 248, 244)
DEEP_WATER = (15, 34, 55)

# Cloudinary sources aligned with live LBTA style.
SOURCES = {
    "karue": "https://res.cloudinary.com/dv033eo0x/image/upload/c_fill,g_auto,w_2200,h_1400/f_jpg/q_auto:good/v1776164749/Karue_FH_hero_2_cnd53p.jpg",
    "junior": "https://res.cloudinary.com/dv033eo0x/image/upload/c_fill,g_auto,w_2200,h_1400/f_jpg/q_auto:good/v1776164749/Henry_mateljan_4.6_UTR_9yrs_old_backhand_roqsfu.jpg",
    "adult": "https://res.cloudinary.com/dv033eo0x/image/upload/c_fill,g_auto,w_2200,h_1400/f_jpg/q_auto:good/v1776164927/Olov_fh_hero_qgzara.jpg",
    "camps": "https://res.cloudinary.com/dv033eo0x/image/upload/c_fill,g_auto,w_2200,h_1400/f_jpg/q_auto:good/v1775614949/Summer-Tennis-Camps-Program-Photo-1200x851-2_ry29pi.jpg",
    "events": "https://res.cloudinary.com/dv033eo0x/image/upload/c_fill,g_auto,w_2200,h_1400/f_jpg/q_auto:good/v1776187663/andrew_ladies_usta_team_t1yjnq.jpg",
    "liveball": "https://res.cloudinary.com/dv033eo0x/image/upload/c_fill,g_auto,w_2200,h_1400/f_jpg/q_auto:good/v1774485572/Advanced_liveball_iyooh6.jpg",
    "facility": "https://res.cloudinary.com/dv033eo0x/image/upload/c_fill,g_auto:subject,w_2200,h_1400/f_jpg/q_auto:good/v1775666357/7048DEF2-DE28-42AC-A598-788BA3C3730F_1_105_c_wohq2f.jpg",
    "programs": "https://res.cloudinary.com/dv033eo0x/image/upload/c_fill,g_auto,w_2200,h_1400/f_jpg/q_auto:good/v1776035010/9D30C663-85F2-48B0-B34C-87D340674789_1_105_c_tahv0a.jpg",
    "pros": "https://res.cloudinary.com/dv033eo0x/image/upload/c_fill,g_auto,w_2200,h_1400/f_jpg/q_auto:good/v1776164749/Ryan_Seggerman__Serve_Hero_srkabk.jpg",
    "logo_colored": "https://res.cloudinary.com/dv033eo0x/image/upload/c_pad,w_1600,h_500,b_transparent/f_png/v1774908286/LBTA_Logo_-_Horizontal_pkmav6.png",
    "logo_white": "https://res.cloudinary.com/dv033eo0x/image/upload/c_pad,w_1600,h_500,b_transparent,e_colorize:100,co_white/f_png/v1774908286/LBTA_Logo_-_Horizontal_pkmav6.png",
    "logo_icon": "https://res.cloudinary.com/dv033eo0x/image/upload/c_pad,w_800,h_800,b_rgb:0F2237/f_png/v1774908285/Blank_x9ugu0.png",
}


def ensure_dirs() -> None:
    for d in [OUT, SRC, COVER_DIR, HOME_DIR, GALLERY_DIR, LOGO_DIR]:
        d.mkdir(parents=True, exist_ok=True)


def download(url: str, path: Path) -> None:
    req = Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urlopen(req) as resp:
        path.write_bytes(resp.read())


def load(name: str) -> Image.Image:
    ext = ".png" if "logo" in name else ".jpg"
    return Image.open(SRC / f"{name}{ext}").convert("RGBA")


def save_jpg(img: Image.Image, path: Path, quality: int = 88) -> None:
    img.convert("RGB").save(path, format="JPEG", quality=quality, optimize=True, progressive=True)


def save_png(img: Image.Image, path: Path) -> None:
    img.save(path, format="PNG", optimize=True)


def cover_fit(img: Image.Image, size: tuple[int, int], y_center: float = 0.45) -> Image.Image:
    return ImageOps.fit(img, size, method=Image.Resampling.LANCZOS, centering=(0.5, y_center))


def safe_margin_comp(img: Image.Image, size: tuple[int, int], inner_scale: float = 0.9) -> Image.Image:
    w, h = size
    bg = cover_fit(img, size, y_center=0.45).filter(ImageFilter.GaussianBlur(radius=16))
    overlay = Image.new("RGBA", size, (10, 16, 24, 54))
    bg.alpha_composite(overlay, (0, 0))

    iw, ih = int(w * inner_scale), int(h * inner_scale)
    inner = cover_fit(img, (iw, ih), y_center=0.43)
    x, y = (w - iw) // 2, (h - ih) // 2
    bg.alpha_composite(inner, (x, y))
    return bg


def trim_alpha(img: Image.Image) -> Image.Image:
    bbox = img.getbbox()
    return img.crop(bbox) if bbox else img


def generate_logos() -> None:
    colored = trim_alpha(load("logo_colored"))
    white = trim_alpha(load("logo_white"))
    icon = load("logo_icon")

    # Tight logos for admin header (fixes "looks off"/too much whitespace).
    save_png(cover_fit(colored, (1200, 300), y_center=0.5), LOGO_DIR / "admin-logo-colored-tight-1200x300.png")
    save_png(cover_fit(white, (1200, 300), y_center=0.5), LOGO_DIR / "admin-logo-white-tight-1200x300.png")

    # Light and dark bg compatibility options.
    light_bg = Image.new("RGBA", (1200, 300), MORNING_LIGHT + (255,))
    light_bg.alpha_composite(cover_fit(colored, (1030, 250), y_center=0.5), (85, 25))
    save_png(light_bg, LOGO_DIR / "admin-logo-colored-on-light-1200x300.png")

    dark_bg = Image.new("RGBA", (1200, 300), DEEP_WATER + (255,))
    dark_bg.alpha_composite(cover_fit(white, (1030, 250), y_center=0.5), (85, 25))
    save_png(dark_bg, LOGO_DIR / "admin-logo-white-on-dark-1200x300.png")

    save_png(cover_fit(icon, (500, 500), y_center=0.5), LOGO_DIR / "admin-logo-icon-500x500.png")


def generate_photos() -> None:
    pool = [
        load("facility"),
        load("karue"),
        load("junior"),
        load("adult"),
        load("camps"),
        load("events"),
        load("liveball"),
        load("programs"),
        load("pros"),
    ]

    # Cover options: 1242x520
    for i, img in enumerate(pool[:6], start=1):
        out = safe_margin_comp(img, (1242, 520), inner_scale=0.94)
        save_jpg(out, COVER_DIR / f"cover-option-{i:02d}-1242x520.jpg")

    # Home portrait options: 1436x1748
    for i, img in enumerate(pool, start=1):
        out = safe_margin_comp(img, (1436, 1748), inner_scale=0.88)
        save_jpg(out, HOME_DIR / f"home-option-{i:02d}-1436x1748.jpg")

    # Gallery options: 1200x851 (more choices for operators)
    for i in range(1, 19):
        img = pool[(i - 1) % len(pool)]
        # Alternate between tighter and roomier compositions.
        scale = 0.9 if i % 2 else 0.94
        out = safe_margin_comp(img, (1200, 851), inner_scale=scale)
        save_jpg(out, GALLERY_DIR / f"gallery-option-{i:02d}-1200x851.jpg")


def build_index() -> None:
    rows: list[list[str]] = []
    for folder, slot in [
        (COVER_DIR, "Cover Photo (1242x520)"),
        (HOME_DIR, "Home Photo (1436x1748)"),
        (GALLERY_DIR, "Gallery Photo (1200x851)"),
        (LOGO_DIR, "Logo variants (admin)"),
    ]:
        for file in sorted(folder.iterdir()):
            if not file.is_file():
                continue
            w = h = ""
            fmt = file.suffix.lower().lstrip(".")
            if fmt in {"jpg", "jpeg", "png"}:
                with Image.open(file) as im:
                    w, h = str(im.width), str(im.height)
            size_kb = f"{file.stat().st_size / 1024:.1f}"
            rows.append([slot, file.name, w, h, fmt, size_kb])

    with (OUT / "index.csv").open("w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["slot", "file", "width", "height", "format", "size_kb"])
        writer.writerows(rows)

    (OUT / "README.txt").write_text(
        "LBTA Customizations Panel Pack\n\n"
        "Upload guidance:\n"
        "1) Cover Photo -> folder cover-photo-1242x520\n"
        "2) Home Photo -> folder home-photo-1436x1748\n"
        "3) Photos gallery -> folder gallery-photos-1200x851\n"
        "4) Logo fixes -> folder logos-admin\n\n"
        "All files were exported in sRGB-compatible RGB and optimized to remain well under ~2 MB.\n",
        encoding="utf-8",
    )


def validate_under_2mb() -> None:
    violations = []
    for folder in [COVER_DIR, HOME_DIR, GALLERY_DIR, LOGO_DIR]:
        for f in folder.iterdir():
            if f.is_file() and f.stat().st_size > 2 * 1024 * 1024:
                violations.append(f)
    if violations:
        raise RuntimeError(f"Some files exceed 2 MB: {violations}")


def main() -> None:
    ensure_dirs()
    for name, url in SOURCES.items():
        ext = ".png" if "logo" in name else ".jpg"
        out = SRC / f"{name}{ext}"
        if not out.exists():
            download(url, out)

    generate_logos()
    generate_photos()
    validate_under_2mb()
    build_index()
    print(f"Generated pack: {OUT}")


if __name__ == "__main__":
    main()
