#!/usr/bin/env python3
"""
Render LBTA brochure HTML templates to print-ready PDFs via Playwright.

Loads `brochures/data/content.json` and renders each template in
`brochures/templates/*.html` to `brochures/out/{name}.pdf`.

Each template MAY define a leading HTML comment of the form:
    <!-- @page width="8.5in" height="11in" landscape="true" -->
to override the print page size.

Run from repo root:
    python3 scripts/render_brochure.py            # render all
    python3 scripts/render_brochure.py 04         # render only those starting with "04"
"""

from __future__ import annotations
import json
import re
import sys
from pathlib import Path

from jinja2 import Environment, FileSystemLoader, select_autoescape
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
BROCHURES = ROOT / "brochures"
TEMPLATES = BROCHURES / "templates"
OUT       = BROCHURES / "out"
CONTENT   = BROCHURES / "data" / "content.json"

PAGE_DIRECTIVE_RE = re.compile(
    r'<!--\s*@page\s+(.+?)\s*-->', re.IGNORECASE
)

DEFAULT_PAGE = {"width": "8.5in", "height": "11in", "landscape": False}


def parse_page_directive(html: str) -> dict:
    m = PAGE_DIRECTIVE_RE.search(html)
    if not m:
        return DEFAULT_PAGE
    parts = dict(re.findall(r'(\w+)\s*=\s*"([^"]+)"', m.group(1)))
    return {
        "width":     parts.get("width",     DEFAULT_PAGE["width"]),
        "height":    parts.get("height",    DEFAULT_PAGE["height"]),
        "landscape": (parts.get("landscape", "false").lower() == "true"),
    }


def render_pdf(page, html_path: Path, out_path: Path, page_cfg: dict) -> None:
    page.goto(html_path.absolute().as_uri(), wait_until="networkidle")
    # Wait for fonts to actually load (FontFace API)
    page.evaluate("() => document.fonts.ready")
    page.pdf(
        path=str(out_path),
        width=page_cfg["width"],
        height=page_cfg["height"],
        landscape=page_cfg["landscape"],
        print_background=True,
        prefer_css_page_size=True,
        margin={"top": "0", "right": "0", "bottom": "0", "left": "0"},
    )


def main() -> int:
    if not CONTENT.exists():
        print(f"FATAL: {CONTENT} missing. Run scripts/build_brochure_content.py first.", file=sys.stderr)
        return 1

    content = json.loads(CONTENT.read_text())

    filter_prefix = sys.argv[1] if len(sys.argv) > 1 else None

    env = Environment(
        loader=FileSystemLoader(str(BROCHURES)),
        autoescape=select_autoescape(["html"]),
        trim_blocks=True,
        lstrip_blocks=True,
    )

    OUT.mkdir(parents=True, exist_ok=True)
    rendered_dir = BROCHURES / ".rendered"
    rendered_dir.mkdir(exist_ok=True)

    templates = sorted(TEMPLATES.glob("*.html"))
    if filter_prefix:
        templates = [t for t in templates if t.stem.startswith(filter_prefix)]
    if not templates:
        print(f"No templates matched filter '{filter_prefix}'", file=sys.stderr)
        return 1

    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        for tpl_path in templates:
            template = env.get_template(f"templates/{tpl_path.name}")
            html = template.render(**content)

            page_cfg = parse_page_directive(html)

            # Write rendered HTML next to the templates so relative asset paths
            # (../assets/photos/x.jpg, ../assets/fonts/x.woff2) resolve correctly.
            rendered_html_path = rendered_dir / tpl_path.name
            rendered_html_path.write_text(html)

            out_pdf = OUT / f"{tpl_path.stem}.pdf"
            render_pdf(page, rendered_html_path, out_pdf, page_cfg)
            size_kb = out_pdf.stat().st_size / 1024
            print(f"  ✓ {tpl_path.name:42s} → {out_pdf.relative_to(ROOT)} "
                  f"({page_cfg['width']}×{page_cfg['height']}"
                  f"{', landscape' if page_cfg['landscape'] else ''}, {size_kb:.0f} KB)")

        browser.close()
    return 0


if __name__ == "__main__":
    sys.exit(main())
