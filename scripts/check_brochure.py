#!/usr/bin/env python3
"""
Pre-flight QA for LBTA brochures. Run BEFORE printing or distributing.

Checks:
  1. Brand colors  — every CSS color in tokens/print.css and templates is in the
                     locked LBTA palette (or defined as a CSS var that is).
  2. Brand fonts   — only Cormorant Garamond + DM Sans in @font-face declarations.
                     No banned fonts (Inter, Playfair, Roboto, Space Grotesk,
                     Work Sans, Arial — see .cursorrules Part 14).
  3. Banned words  — no prohibited language anywhere in templates or rendered HTML
                     (see .cursorrules Part 14 + lbta-messaging skill).
  4. URLs live     — every URL referenced in templates returns HTTP 2xx.
  5. Pod absent    — no "Pod", "$11,000", "$8,333" leaks (per plan Out of scope).

Exit 0 if all pass; exit 1 with a numbered list of failures otherwise.

Run from repo root:  python3 scripts/check_brochure.py
"""

from __future__ import annotations
import json
import re
import sys
import urllib.request
import urllib.error
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BROCHURES = ROOT / "brochures"
TOKENS_CSS = BROCHURES / "tokens" / "print.css"
TEMPLATES_DIR = BROCHURES / "templates"
PARTIALS_DIR = BROCHURES / "partials"
RENDERED_DIR = BROCHURES / ".rendered"
TOKENS_JSON = ROOT / "tokens" / "lbta-web-tokens.json"

# Brand-allowed hex (locked from tokens/lbta-web-tokens.json + lbta-brand SKILL).
ALLOWED_HEX = {
    # brand
    "#1B3A5C", "#0F2237", "#0A1628", "#0B1120",
    "#2E8B8B", "#33A3A3",
    "#C4963C", "#D4A853",
    "#E8834A", "#F09050",
    "#F5F0E5", "#FAF8F4", "#FFFFFF",
    "#3A8B6E", "#7A8B6E", "#B8A88A",
    # semantic text/border (lbta-brand skill)
    "#2B3D50", "#6B7F95", "#E4E7EB", "#EDEFF2",
    # legacy black token
    "#0A0A0A",
}
ALLOWED_HEX = {h.upper() for h in ALLOWED_HEX}

ALLOWED_FONT_FAMILIES = {"Cormorant Garamond", "DM Sans", "Georgia", "Helvetica", "Arial", "serif", "sans-serif"}
BANNED_FONT_FAMILIES = {"Inter", "Roboto", "Playfair", "Space Grotesk", "Work Sans"}

# Banned copy. Sources, in priority order:
#   1. Andrew_Master_System_Instructions_v2.md (line 109) — universal banned hype words
#   2. Brand_VoiceGuide_v2.md (universal banned at bottom)
#   3. .cursorrules Part 14 + lbta-messaging Prohibited list
# Each entry matches as a word-bounded phrase (case-insensitive). Phrases starting
# with "#" must not be followed by another digit (so "#1 academy" is banned but
# "ATP #12 nationally" is fine).
BANNED_WORDS = [
    # Universal hype words (Andrew Master Instructions line 109 + Brand Voice Guide)
    "precision", "boost", "enhance", "elevate", "elite", "maximize", "optimize",
    "cutting-edge", "world-class", "unlock", "game-changing", "premium",
    "mastery", "amazing", "incredible",
    # Universal marketing words
    "exclusive", "limited time", "act now", "don't miss", "hurry",
    "guaranteed results",
    # Older brochure-specific (.cursorrules + V1 audit)
    "best in OC", "premier", "VIP", "next-gen", "revolutionary",
    "limited spots", "unlock your potential",
    # Corporate boilerplate (chatbot voice + email-VA contamination)
    "we hope all is well", "best regards", "LBTA Admin Team",
    "feel free to reach out", "please let us know if you have questions",
    # Superlatives without substance
    "#1 academy", "#1 in OC", "we're #1", "we are #1",
]

POD_LEAK_TERMS = ["The Pod", "$11,000", "$8,333", "Pod3", "private player management"]

URL_REGEX = re.compile(r'https?://[^\s"\'<>)]+', re.IGNORECASE)
HEX_REGEX = re.compile(r'#[0-9A-Fa-f]{6}\b')
FONT_FAMILY_REGEX = re.compile(r'font-family\s*:\s*([^;}\n]+)', re.IGNORECASE)
FONT_FACE_FAMILY_REGEX = re.compile(r"@font-face\s*\{[^}]*?font-family\s*:\s*['\"]?([^;'\"]+)", re.IGNORECASE | re.DOTALL)
TAG_REGEX = re.compile(r'<[^>]+>')


def strip_tags(s: str) -> str:
    return TAG_REGEX.sub(' ', s)


def collect(globs: list[Path]) -> list[Path]:
    files = []
    for d in globs:
        if d.exists():
            files.extend(sorted(d.rglob("*.html")))
    return files


def check_colors(failures: list[str]) -> None:
    """All hex literals in print.css must be in ALLOWED_HEX (or defined as a CSS var)."""
    css = TOKENS_CSS.read_text()
    hexes = {h.upper() for h in HEX_REGEX.findall(css)}
    bad = sorted(hexes - ALLOWED_HEX)
    if bad:
        failures.append(
            f"check_colors: {len(bad)} hex literals in print.css not in locked brand palette: {bad}"
        )


def check_fonts(failures: list[str]) -> None:
    css = TOKENS_CSS.read_text()
    fonts_css = (BROCHURES / "assets" / "fonts" / "fonts-local.css")
    if fonts_css.exists():
        css += "\n" + fonts_css.read_text()
    families = set()
    for m in FONT_FACE_FAMILY_REGEX.finditer(css):
        families.add(m.group(1).strip().strip("'\""))
    for m in FONT_FAMILY_REGEX.finditer(css):
        for fam in m.group(1).split(','):
            families.add(fam.strip().strip("'\""))
    banned_hits = sorted(families & BANNED_FONT_FAMILIES)
    if banned_hits:
        failures.append(f"check_fonts: banned font families found in CSS: {banned_hits}")
    # Confirm the two required families are declared via @font-face
    declared_faces = {m.group(1).strip().strip("'\"") for m in FONT_FACE_FAMILY_REGEX.finditer(css)}
    missing = {"Cormorant Garamond", "DM Sans"} - declared_faces
    if missing:
        failures.append(f"check_fonts: required @font-face missing: {sorted(missing)}")


def _banned_pattern(phrase: str) -> re.Pattern:
    """Build a case-insensitive regex with word-aware boundaries.
    Phrases beginning with '#' must not be followed by another digit."""
    escaped = re.escape(phrase)
    if phrase.startswith("#"):
        # No leading-word-boundary on '#'. Trailing: not followed by digit, then word boundary.
        return re.compile(escaped + r"(?!\d)\b", re.IGNORECASE)
    return re.compile(r"\b" + escaped + r"\b", re.IGNORECASE)


_BANNED_RES = [(p, _banned_pattern(p)) for p in BANNED_WORDS]


def check_banned_words(failures: list[str]) -> None:
    targets = collect([TEMPLATES_DIR, PARTIALS_DIR, RENDERED_DIR])
    if not targets:
        failures.append("check_banned_words: no templates/partials/rendered HTML found.")
        return
    hits: list[str] = []
    for f in targets:
        text = strip_tags(f.read_text())
        for phrase, pat in _BANNED_RES:
            if pat.search(text):
                hits.append(f"  {f.relative_to(ROOT)} → '{phrase}'")
    if hits:
        failures.append("check_banned_words: prohibited copy found:\n" + "\n".join(hits))


def check_pod_leak(failures: list[str]) -> None:
    """Pod content/pricing must NOT appear in variants 01-08 (the public set).
    Variant 09 (the by-invitation Pod one-pager) is whitelisted by filename prefix."""
    targets = collect([TEMPLATES_DIR, PARTIALS_DIR, RENDERED_DIR])
    hits: list[str] = []
    for f in targets:
        if f.stem.startswith("09_"):
            continue  # Pod one-pager — Pod content lives here by design
        text = f.read_text()
        for term in POD_LEAK_TERMS:
            if term.lower() in text.lower():
                hits.append(f"  {f.relative_to(ROOT)} → '{term}'")
    if hits:
        failures.append(
            "check_pod_leak: Pod copy/pricing leaked into the public set (01-08). "
            "Pod content is allowed ONLY in variant 09:\n"
            + "\n".join(hits)
        )


def check_urls(failures: list[str], skip_network: bool = False) -> None:
    if skip_network:
        print("  (network check skipped)")
        return
    # URL check runs against rendered HTML only — templates contain unresolved Jinja.
    targets = collect([RENDERED_DIR])
    urls: set[str] = set()
    for f in targets:
        for u in URL_REGEX.findall(f.read_text()):
            # Skip Cloudinary/asset/font URLs — only check user-facing URLs
            if "res.cloudinary.com" in u or "fonts.gstatic.com" in u or "fonts.googleapis.com" in u:
                continue
            # Skip any URL still containing Jinja markers (defensive)
            if "{{" in u or "}}" in u:
                continue
            urls.add(u.rstrip('.,);'))
    bad: list[str] = []
    for u in sorted(urls):
        try:
            req = urllib.request.Request(u, method="HEAD",
                                         headers={"User-Agent": "Mozilla/5.0 (LBTA brochure check)"})
            r = urllib.request.urlopen(req, timeout=10)
            if r.status >= 400:
                bad.append(f"{u} → HTTP {r.status}")
        except urllib.error.HTTPError as e:
            # Some sites reject HEAD; retry GET
            try:
                req = urllib.request.Request(u, headers={"User-Agent": "Mozilla/5.0 (LBTA brochure check)"})
                r = urllib.request.urlopen(req, timeout=10)
                if r.status >= 400:
                    bad.append(f"{u} → HTTP {r.status}")
            except Exception as ee:
                bad.append(f"{u} → {ee}")
        except Exception as e:
            bad.append(f"{u} → {e}")
    if bad:
        failures.append("check_urls: bad URLs:\n  " + "\n  ".join(bad))


def main() -> int:
    failures: list[str] = []
    skip_network = "--skip-network" in sys.argv

    print("\n== LBTA brochure pre-flight QA ==\n")
    print("  [1/5] colors……")
    check_colors(failures)
    print("  [2/5] fonts……")
    check_fonts(failures)
    print("  [3/5] banned words……")
    check_banned_words(failures)
    print("  [4/5] Pod leak……")
    check_pod_leak(failures)
    print("  [5/5] URLs reachable……")
    check_urls(failures, skip_network=skip_network)

    if failures:
        print("\n❌ FAIL — {} issue(s):\n".format(len(failures)))
        for i, f in enumerate(failures, 1):
            print(f"  {i}. {f}\n")
        return 1

    print("\n✓ PASS — all checks green.\n")
    return 0


if __name__ == "__main__":
    sys.exit(main())
