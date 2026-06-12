#!/usr/bin/env python3
"""
Generate LBTA full asset pack (mobile-first) from Cloudinary/web assets.
"""

from __future__ import annotations

import csv
import io
import os
from pathlib import Path
from typing import Iterable
from urllib.request import Request, urlopen

from PIL import Image, ImageDraw, ImageFont, ImageOps


DESKTOP = Path.home() / "Desktop"
OUT_DIR = DESKTOP / "LBTA-Full-Asset-Pack"

APP_STORE = OUT_DIR / "App Store"
PBP = OUT_DIR / "PBP"
PWA = OUT_DIR / "PWA"
IN_APP = OUT_DIR / "In-App UI"
SOURCES = OUT_DIR / "_sources"


URLS = {
    "logo_white": "https://res.cloudinary.com/dv033eo0x/image/upload/c_pad,w_1200,h_384,b_transparent,e_colorize:100,co_white/f_png/v1774908286/LBTA_Logo_-_Horizontal_pkmav6.png",
    "logo_colored": "https://res.cloudinary.com/dv033eo0x/image/upload/c_pad,w_1200,h_384,b_transparent/f_png/v1774908286/LBTA_Logo_-_Horizontal_pkmav6.png",
    "logo_icon": "https://res.cloudinary.com/dv033eo0x/image/upload/c_pad,w_1024,h_1024,b_rgb:0F2237/f_png/v1774908285/Blank_x9ugu0.png",
    "hero_karue": "https://res.cloudinary.com/dv033eo0x/image/upload/c_fill,g_auto,w_1920,h_1080/f_jpg/q_auto:good/v1776164749/Karue_FH_hero_2_cnd53p.jpg",
    "hero_junior": "https://res.cloudinary.com/dv033eo0x/image/upload/c_fill,g_auto,w_1920,h_1080/f_jpg/q_auto:good/v1776164749/Henry_mateljan_4.6_UTR_9yrs_old_backhand_roqsfu.jpg",
    "hero_adult": "https://res.cloudinary.com/dv033eo0x/image/upload/c_fill,g_auto,w_1920,h_1080/f_jpg/q_auto:good/v1776164927/Olov_fh_hero_qgzara.jpg",
    "hero_camps": "https://res.cloudinary.com/dv033eo0x/image/upload/c_fill,g_auto,w_1920,h_1080/f_jpg/q_auto:good/v1775614949/Summer-Tennis-Camps-Program-Photo-1200x851-2_ry29pi.jpg",
    "hero_events": "https://res.cloudinary.com/dv033eo0x/image/upload/c_fill,g_auto,w_1920,h_1080/f_jpg/q_auto:good/v1776187663/andrew_ladies_usta_team_t1yjnq.jpg",
    "hero_liveball": "https://res.cloudinary.com/dv033eo0x/image/upload/c_fill,g_auto,w_1920,h_1080/f_jpg/q_auto:good/v1774485572/Advanced_liveball_iyooh6.jpg",
    "facility": "https://res.cloudinary.com/dv033eo0x/image/upload/c_fill,g_auto:subject,w_1920,h_1080/f_jpg/q_auto:good/v1775666357/7048DEF2-DE28-42AC-A598-788BA3C3730F_1_105_c_wohq2f.jpg",
    "programs_tile": "https://res.cloudinary.com/dv033eo0x/image/upload/c_fill,g_auto,w_1200,h_851/f_jpg/q_auto:good/v1776035010/9D30C663-85F2-48B0-B34C-87D340674789_1_105_c_tahv0a.jpg",
    "pros_tile": "https://res.cloudinary.com/dv033eo0x/image/upload/c_fill,g_auto,w_1200,h_851/f_jpg/q_auto:good/v1776164749/Ryan_Seggerman__Serve_Hero_srkabk.jpg",
}


PROGRAM_NAMES = [
    "Little Tennis Stars",
    "Orange Ball Development",
    "Green Ball Performance",
    "Junior Academy",
    "High Performance",
    "Adult Fundamentals",
    "Adult Intermediate",
    "Private Coaching",
    "LiveBall",
    "UTR Match Play",
    "USTA Team Training",
    "Seasonal Camps",
    "Fitness and Movement",
]


def ensure_dirs() -> None:
    for d in [OUT_DIR, APP_STORE, PBP, PWA, IN_APP, SOURCES]:
        d.mkdir(parents=True, exist_ok=True)


def fetch_image(url: str, dest: Path) -> None:
    req = Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urlopen(req) as r:
        data = r.read()
    dest.write_bytes(data)


def open_img(path: Path) -> Image.Image:
    return Image.open(path).convert("RGBA")


def cover_resize(img: Image.Image, width: int, height: int) -> Image.Image:
    return ImageOps.fit(img, (width, height), method=Image.Resampling.LANCZOS, centering=(0.5, 0.45))


def save_jpg(img: Image.Image, path: Path, quality: int = 92) -> None:
    img.convert("RGB").save(path, format="JPEG", quality=quality, optimize=True)


def save_png(img: Image.Image, path: Path) -> None:
    img.save(path, format="PNG")


def get_font(size: int) -> ImageFont.ImageFont:
    candidates = [
        "/System/Library/Fonts/Supplemental/Arial.ttf",
        "/System/Library/Fonts/Supplemental/Helvetica.ttc",
    ]
    for p in candidates:
        if os.path.exists(p):
            return ImageFont.truetype(p, size)
    return ImageFont.load_default()


def overlay_brand_text(img: Image.Image, title: str, subtitle: str) -> Image.Image:
    draw = ImageDraw.Draw(img)
    w, h = img.size
    grad_h = int(h * 0.34)
    overlay = Image.new("RGBA", (w, grad_h), (15, 34, 55, 210))
    img.alpha_composite(overlay, (0, h - grad_h))

    title_font = get_font(max(26, int(h * 0.045)))
    sub_font = get_font(max(16, int(h * 0.026)))

    x = int(w * 0.06)
    y = h - grad_h + int(grad_h * 0.18)
    draw.text((x, y), title, fill=(250, 248, 244, 255), font=title_font)
    draw.text((x, y + int(grad_h * 0.38)), subtitle, fill=(230, 235, 240, 255), font=sub_font)
    return img


def render_store_screenshot(base: Image.Image, size: tuple[int, int], title: str, subtitle: str) -> Image.Image:
    canvas = cover_resize(base, size[0], size[1]).convert("RGBA")
    # Simulated app card on mobile
    d = ImageDraw.Draw(canvas)
    w, h = canvas.size
    card_w = int(w * 0.82)
    card_h = int(h * 0.24)
    card_x = (w - card_w) // 2
    card_y = int(h * 0.13)
    d.rounded_rectangle([card_x, card_y, card_x + card_w, card_y + card_h], radius=int(min(w, h) * 0.02), fill=(250, 248, 244, 238))
    title_font = get_font(max(22, int(h * 0.036)))
    body_font = get_font(max(14, int(h * 0.024)))
    d.text((card_x + int(card_w * 0.06), card_y + int(card_h * 0.2)), "LBTA", fill=(27, 58, 92, 255), font=title_font)
    d.text((card_x + int(card_w * 0.06), card_y + int(card_h * 0.53)), "Tennis, as it should be taught.", fill=(15, 34, 55, 255), font=body_font)

    return overlay_brand_text(canvas, title, subtitle)


def create_icons(src_icon: Image.Image) -> None:
    # App icons
    save_png(cover_resize(src_icon, 1024, 1024), APP_STORE / "01-app-icon-ios-1024.png")
    save_png(cover_resize(src_icon, 512, 512), APP_STORE / "02-app-icon-android-512.png")

    # Adaptive icon foreground/background
    fg = cover_resize(src_icon, 432, 432).copy()
    pad = int(432 * 0.16)
    fg_inner = fg.resize((432 - 2 * pad, 432 - 2 * pad), Image.Resampling.LANCZOS)
    fg_canvas = Image.new("RGBA", (432, 432), (0, 0, 0, 0))
    fg_canvas.alpha_composite(fg_inner, (pad, pad))
    save_png(fg_canvas, APP_STORE / "03-android-adaptive-foreground-432.png")

    bg = Image.new("RGBA", (432, 432), (15, 34, 55, 255))
    save_png(bg, APP_STORE / "04-android-adaptive-background-432.png")


def create_store_text_files() -> None:
    (APP_STORE / "05-app-name-full.txt").write_text("Laguna Beach Tennis Academy\n", encoding="utf-8")
    (APP_STORE / "06-app-short-name.txt").write_text("LBTA\n", encoding="utf-8")
    (APP_STORE / "07-app-color-palette.txt").write_text(
        "Primary: #1B3A5C\nSecondary: #0F2237\nAccent: #E8834A\nBackground: #FAF8F4\n",
        encoding="utf-8",
    )


def create_store_screenshots(images: list[Image.Image]) -> None:
    specs = [
        ("08-iphone-67", (1290, 2796), 5),
        ("09-iphone-65", (1242, 2688), 5),
        ("10-iphone-55", (1242, 2208), 5),
        ("11-ipad-pro-129", (2048, 2732), 5),
        ("12-android-phone", (1080, 1920), 5),
        ("13-android-7-tablet", (1200, 1920), 3),
        ("14-android-10-tablet", (1800, 2560), 3),
    ]
    captions = [
        ("Movement-first coaching", "From first swings to competitive play."),
        ("Pathways for every player", "Junior and adult programs with clear progression."),
        ("Train with purpose", "Structure. Repetition. Trust."),
        ("Community on every court", "Serious work in a supportive environment."),
        ("Book quickly on mobile", "Fast signup and program discovery."),
    ]
    for slug, size, qty in specs:
        for i in range(qty):
            base = images[i % len(images)].copy()
            title, sub = captions[i % len(captions)]
            out = render_store_screenshot(base, size, title, sub)
            save_png(out, APP_STORE / f"{slug}-shot-{i+1}.png")


def create_pbp_assets(images: list[Image.Image]) -> None:
    save_jpg(cover_resize(images[0], 1242, 520), PBP / "16-facility-landing-cover-1242x520.jpg")
    save_jpg(cover_resize(images[0], 1436, 1748), PBP / "17-facility-signup-photo-1436x1748.jpg")

    # 13 program photos
    for i in range(13):
        img = cover_resize(images[i % len(images)], 1200, 851)
        save_jpg(img, PBP / f"18-program-photo-{i+1:02d}-1200x851.jpg")

    # 6 banner promos
    for i in range(6):
        img = cover_resize(images[i % len(images)], 710, 300)
        save_jpg(img, PBP / f"19-banner-ad-{i+1:02d}-710x300.jpg")

    # 14 OG images (default + 13 programs)
    default_og = overlay_brand_text(cover_resize(images[0], 1200, 630), "Laguna Beach Tennis Academy", "Movement. Craft. Community.")
    save_jpg(default_og, PBP / "20-og-default-1200x630.jpg")
    for i, name in enumerate(PROGRAM_NAMES, start=1):
        og = overlay_brand_text(cover_resize(images[i % len(images)], 1200, 630), name, "Train with purpose in Laguna Beach.")
        save_jpg(og, PBP / f"20-og-program-{i:02d}-1200x630.jpg")

    # Page builder
    for i in range(3):
        save_jpg(cover_resize(images[i % len(images)], 1920, 1080), PBP / f"21-pagebuilder-hero-{i+1:02d}-1920x1080.jpg")
    for i in range(4):
        save_jpg(cover_resize(images[(i + 2) % len(images)], 1600, 600), PBP / f"22-pagebuilder-banner-{i+1:02d}-1600x600.jpg")
    for i in range(6):
        save_jpg(cover_resize(images[(i + 1) % len(images)], 1200, 800), PBP / f"23-pagebuilder-imageblock-{i+1:02d}-1200x800.jpg")


def create_pwa_assets(icon: Image.Image, splash_base: Image.Image) -> None:
    # Favicons/icons
    save_png(cover_resize(icon, 16, 16), PWA / "24-favicon-16.png")
    save_png(cover_resize(icon, 32, 32), PWA / "25-favicon-32.png")
    save_png(cover_resize(icon, 48, 48), PWA / "26-favicon-48.png")
    save_png(cover_resize(icon, 180, 180), PWA / "27-apple-touch-icon-180.png")
    save_png(cover_resize(icon, 192, 192), PWA / "28-android-chrome-192.png")
    save_png(cover_resize(icon, 512, 512), PWA / "29-android-chrome-512.png")

    # Maskable icon with safe zone
    m = Image.new("RGBA", (512, 512), (15, 34, 55, 255))
    inner = cover_resize(icon, 330, 330)
    m.alpha_composite(inner, ((512 - 330) // 2, (512 - 330) // 2))
    save_png(m, PWA / "30-maskable-icon-512.png")

    splash_sizes = [
        (1125, 2436, "31-ios-splash-1125x2436.png"),
        (1242, 2688, "32-ios-splash-1242x2688.png"),
        (1284, 2778, "33-ios-splash-1284x2778.png"),
        (1170, 2532, "34-ios-splash-1170x2532.png"),
        (828, 1792, "35-ios-splash-828x1792.png"),
    ]
    for w, h, name in splash_sizes:
        splash = overlay_brand_text(cover_resize(splash_base.copy(), w, h), "Laguna Beach Tennis Academy", "Movement. Craft. Community.")
        save_png(splash, PWA / name)


def create_in_app_assets(images: list[Image.Image]) -> None:
    save_jpg(cover_resize(images[0], 1600, 900), IN_APP / "36-home-hero-banner-landscape-1600x900.jpg")
    save_jpg(cover_resize(images[0], 1080, 1920), IN_APP / "37-home-hero-banner-mobile-1080x1920.jpg")
    save_jpg(cover_resize(images[1], 1200, 800), IN_APP / "38-featured-program-card-1200x800.jpg")
    save_jpg(cover_resize(images[2], 1080, 1920), IN_APP / "39-welcome-splash-photo-1080x1920.jpg")


def write_manifest() -> None:
    rows = []
    for root, _, files in os.walk(OUT_DIR):
        for file in sorted(files):
            if file.startswith("."):
                continue
            p = Path(root) / file
            if p.suffix.lower() in {".png", ".jpg", ".jpeg"}:
                try:
                    with Image.open(p) as im:
                        rows.append([str(p.relative_to(OUT_DIR)), im.width, im.height, p.suffix.lower().lstrip(".")])
                except Exception:
                    rows.append([str(p.relative_to(OUT_DIR)), "", "", p.suffix.lower().lstrip(".")])
            else:
                rows.append([str(p.relative_to(OUT_DIR)), "", "", p.suffix.lower().lstrip(".")])
    with (OUT_DIR / "asset-manifest.csv").open("w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(["path", "width", "height", "format"])
        w.writerows(rows)


def main() -> None:
    ensure_dirs()

    # Download source images once.
    for name, url in URLS.items():
        ext = ".png" if "logo" in name else ".jpg"
        dest = SOURCES / f"{name}{ext}"
        if not dest.exists():
            fetch_image(url, dest)

    img_order = [
        open_img(SOURCES / "hero_karue.jpg"),
        open_img(SOURCES / "hero_junior.jpg"),
        open_img(SOURCES / "hero_adult.jpg"),
        open_img(SOURCES / "hero_camps.jpg"),
        open_img(SOURCES / "hero_events.jpg"),
        open_img(SOURCES / "hero_liveball.jpg"),
        open_img(SOURCES / "facility.jpg"),
        open_img(SOURCES / "programs_tile.jpg"),
        open_img(SOURCES / "pros_tile.jpg"),
    ]

    icon = open_img(SOURCES / "logo_icon.png")

    create_icons(icon)
    create_store_text_files()
    create_store_screenshots(img_order[:7])
    create_pbp_assets(img_order)
    create_pwa_assets(icon, img_order[0])
    create_in_app_assets(img_order)
    write_manifest()

    (OUT_DIR / "README.txt").write_text(
        "LBTA Full Asset Pack generated.\n"
        "Notes:\n"
        "- App store screenshots are branded marketing templates and should be replaced with true in-app captures before final submission.\n"
        "- Mobile-first crops were used for vertical and banner outputs.\n"
        "- See asset-manifest.csv for dimensions.\n",
        encoding="utf-8",
    )
    print(f"Generated: {OUT_DIR}")


if __name__ == "__main__":
    main()
