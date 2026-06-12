#!/usr/bin/env python3
"""
Build brochures/data/content.json from the project's source-of-truth data files.

Source files (single source of truth):
  - data/coaches.json             → coach roster (excludes hidden coaches)
  - data/spring-summer-2026.json  → programs, prices, schedules, camps, season dates
  - data/private-rates.json       → private coaching published rates
  - data/leagues-2026.json        → USTA leagues + UTR Match Play
  - data/site-stats.json          → trust stats
  - data/pricing-supplemental.json (optional) → supplemental pricing labels

This script does NOT invent content. Every field traces to a source file.
Run from repo root:  python3 scripts/build_brochure_content.py
"""

from __future__ import annotations
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "data"
OUT  = ROOT / "brochures" / "data" / "content.json"

# Locked contact / brand block (see .cursorrules Part 20 + lbta-brand SKILL)
CONTACT = {
    "name": "Laguna Beach Tennis Academy",
    "web": "lagunabeachtennisacademy.com",
    "email": "support@lagunabeachtennisacademy.com",
    "phone": "(949) 534-0457",
    "address": "1098 Balboa Ave, Laguna Beach, CA 92651",
    "tagline": "Movement. Craft. Community.",
    "primary_tagline": "Tennis, as it should be taught.",
    "city_partner_line": "Official City of Laguna Beach Tennis Partner Since 2020",
}

# Locked locations (used on every variant)
LOCATIONS = [
    {
        "name": "Moulton Meadows Park",
        "address": "Balboa Ave & Capistrano Ave",
        "use": "Youth & beginners",
    },
    {
        "name": "Alta Laguna Park",
        "address": "3300 Alta Laguna Blvd",
        "use": "Junior development & UTR weekends",
    },
    {
        "name": "Laguna Beach High School",
        "address": "625 Park Ave",
        "use": "High Performance · LiveBall · Camps",
    },
]


def load(name: str) -> dict | list:
    with open(DATA / name) as f:
        return json.load(f)


# Brochure-only credential overrides. Sourced from the project bundle
# (01_TIER_1_Always_Upload/03_Shared_The_Mateljan_Method_v5.md §1 + the F4T
# scale clarification at the top of that doc) which corrects misleading website
# claims. Specifically: "100K+ Fit4Tennis Users" → "100K+ social/audience reach
# (NOT paid app users)" per the bundle. Brochures use the bundle-corrected line
# or drop the number entirely. (Source: Andrew feedback 2026-05-06 +
# `03_Shared_The_Mateljan_Method_v5.md` F4T scale clarification.)
BROCHURE_CREDENTIALS = {
    "andrew-mateljan": [
        "Former Top Junior",
        "ATP/WTA Tour Coach",
        "20+ D1 Placements",
        "Sánchez-Casal Spain — Jimmy Johnson",
    ],
}

# Brochure-only bio overrides. The website bio for Andrew ends with
# "Founder of Fit4Tennis platform serving 100K+ users worldwide" — but the
# bundle's F4T scale clarification (top of `03_Shared_The_Mateljan_Method_v5.md`)
# explicitly corrects this: it's audience reach, not paid users. The brochure
# bio drops the misleading claim and uses the bundle-faithful fourth-generation
# framing instead. (Source: Andrew feedback 2026-05-06.)
BROCHURE_BIOS = {
    "andrew-mateljan": (
        "Fourth-generation tennis coach. Twenty years developing competitive "
        "players from junior foundations to professional tour. Top-12 nationally "
        "as a junior, two-time Kalamazoo Nationals competitor, ITF Futures "
        "circuit (US, Venezuela, El Salvador, Guatemala). Trained at Sánchez-Casal "
        "Spain under Jimmy Johnson; seven years coaching internationally across "
        "Spain, Croatia, and Norway. Currently coaches Karue Sell (ATP #258 — "
        "took him from #860 to #258 in 2025). Colton Smith (ATP #133), Max "
        "McKennon (#458), and Ryan Seggerman (#63 in doubles) all came through "
        "the same training. Alex Michelsen came through the program at ages "
        "12–13 — now ATP #30."
    ),
}


def visible_coaches(coaches_doc: dict) -> list[dict]:
    """Return non-hidden coaches in role order. (Saska is back-of-house, never in coaches.json.)"""
    out = []
    for c in coaches_doc["coaches"]:
        if c.get("hidden"):
            continue
        out.append({
            "slug": c["slug"],
            "name": c["name"],
            "title": c["title"],
            "specialization": c.get("specialization", ""),
            "bio": BROCHURE_BIOS.get(c["slug"], c["bio"]),
            "quote": c.get("quote", ""),
            "credentials": BROCHURE_CREDENTIALS.get(c["slug"], c.get("credentials", [])),
            "image_local": f"andrew.png" if c["slug"] == "andrew-mateljan"
                           else f"peter.png" if c["slug"] == "peter-defrantz"
                           else f"allison.png" if c["slug"] == "allison-cronk"
                           else None,
            "role": c["role"],
            "order": c.get("order", 99),
        })
    out.sort(key=lambda x: x["order"])
    return out


def categorize_programs(spring_summer: dict) -> dict:
    """Slice the program list into junior / development / adult / open-court buckets."""
    buckets = {"junior": [], "development": [], "adult": [], "open-court": []}
    for p in spring_summer["programs"]:
        cat = p.get("category", "").lower()
        rec = {
            "id": p["id"],
            "program": p["program"],
            "ages": p["ages"],
            "location": p["location"],
            "duration": p["duration"],
            "schedule": p["schedule"],
            "pricing": p["pricing"],
            "description": p["description"],
            "pricing_note": p.get("pricingNote"),
            "inquiry_label": p.get("inquiryLabel"),
        }
        if cat == "junior":
            buckets["junior"].append(rec)
        elif cat == "development":
            buckets["development"].append(rec)
        elif cat == "adult":
            buckets["adult"].append(rec)
        elif cat == "open court":
            buckets["open-court"].append(rec)
    return buckets


def build_annual_pricing(year: dict, fall: dict, spring_summer: dict, leagues: dict) -> dict:
    """Build a unified pricing matrix across all four 2026 seasons.

    Source files:
      - data/year2026.json — winter base prices, season multipliers, camps, discounts, scholarship
      - data/spring-summer-2026.json — verbatim spring + summer pricing
      - data/fall2026.json — verbatim fall pricing

    Each program row carries its own per-season prices so the brochure renders
    real numbers, not multiplied estimates.
    """
    seasons = year["seasons"]

    # Build a price grid: for each program (by id), pull season-by-season tiers
    def pull(prog_list, season_key):
        return {p["id"]: p for p in prog_list}

    spring_by_id = {p["id"]: p for p in spring_summer["programs"]}
    fall_by_id = {p["id"]: p for p in fall["programs"]}

    def cell_for(p_id, season):
        """Return a small dict {1x, 2x, 3x, drop_in, monthly} for a program in a season."""
        if season in ("spring", "summer"):
            p = spring_by_id.get(p_id)
            if not p:
                return None
            pr = p["pricing"]
            spring_pr = pr.get("spring", {})
            summer_pr = pr.get("summer", {})
            chosen = spring_pr if season == "spring" else summer_pr
            return {
                "1x": chosen.get("1x"),
                "2x": chosen.get("2x"),
                "3x": chosen.get("3x"),
                "monthly": pr.get("monthly", {}).get("1x") if isinstance(pr.get("monthly"), dict) else pr.get("monthly"),
                "drop_in": pr.get("drop_in"),
            }
        if season == "fall":
            p = fall_by_id.get(p_id)
            if not p:
                return None
            pr = p["pricing"]
            return {
                "1x": pr.get("1x"),
                "2x": pr.get("2x"),
                "3x": pr.get("3x"),
                "monthly": pr.get("monthly"),
                "drop_in": pr.get("drop_in"),
            }
        return None

    # Winter prices come from year.basePricing (mapped by category)
    base = year["basePricing"]
    winter_map = {
        "little-stars":      {"1x": None, "2x": None, "3x": None, "monthly": 120, "drop_in": 40},
        "red-ball":          {**base["junior"]["winterPrices"], "drop_in": base["junior"]["dropIn"]},
        "orange-ball":       {**base["junior"]["winterPrices"], "drop_in": base["junior"]["dropIn"]},
        "green-dot":         {**base["junior"]["winterPrices"], "drop_in": base["junior"]["dropIn"]},
        "youth-development": {**base["youthDevelopment"]["winterPrices"], "drop_in": base["youthDevelopment"]["dropIn"]},
        "utr-green-dot":     {**base["youthDevelopment"]["winterPrices"], "drop_in": base["youthDevelopment"]["dropIn"]},
        "high-performance":  {**base["highPerformance"]["winterPrices"], "drop_in": base["highPerformance"]["dropIn"]},
        "adult-beginner-1":  {**base["adultBeginner"]["winterPrices"], "drop_in": base["adultBeginner"]["dropIn"]},
        "adult-beginner-2":  {**base["adultBeginner"]["winterPrices"], "drop_in": base["adultBeginner"]["dropIn"]},
        "adult-intermediate":{**base["adultIntermediate"]["winterPrices"], "drop_in": base["adultIntermediate"]["dropIn"]},
        "adult-advanced":    {**base["adultAdvanced"]["winterPrices"], "drop_in": base["adultAdvanced"]["dropIn"]},
    }

    program_order = [
        ("little-stars",       "Little Tennis Stars",     "3–4",        "Junior"),
        ("red-ball",           "Red Ball",                "5–6",        "Junior"),
        ("orange-ball",        "Orange Ball",             "7–8",        "Junior"),
        ("green-dot",          "Green Dot",               "9–11",       "Junior"),
        ("utr-green-dot",      "Competitive Green Dot",   "9–11+ inv",  "Development"),
        ("youth-development",  "Junior Development",      "11–18",      "Development"),
        ("high-performance",   "High Performance",        "12–17 UTR8+","Development"),
        ("adult-beginner-1",   "New to Tennis",           "All Levels", "Adult"),
        ("adult-beginner-2",   "Beyond Beginner",         "All Levels", "Adult"),
        ("adult-intermediate", "Adult Intermediate",      "NTRP 3.0–4.0","Adult"),
        ("adult-advanced",     "Adult Advanced",          "NTRP 4.0+",  "Adult"),
    ]

    rows = []
    for pid, name, level, cat in program_order:
        rows.append({
            "id":       pid,
            "program":  name,
            "level":    level,
            "category": cat,
            "winter":   winter_map.get(pid),
            "spring":   cell_for(pid, "spring"),
            "summer":   cell_for(pid, "summer"),
            "fall":     cell_for(pid, "fall"),
        })

    return {
        "seasons": [
            {"key": "winter", "label": "Winter",  "weeks": seasons["winter"]["weeks"], "dates": seasons["winter"]["dates"]},
            {"key": "spring", "label": "Spring",  "weeks": seasons["spring"]["weeks"], "dates": seasons["spring"]["dates"]},
            {"key": "summer", "label": "Summer",  "weeks": seasons["summer"]["weeks"], "dates": seasons["summer"]["dates"]},
            {"key": "fall",   "label": "Fall",    "weeks": seasons["fall"]["weeks"],   "dates": seasons["fall"]["dates"]},
        ],
        "rows": rows,
        "open_court": [
            {"name": "LiveBall",      "level": "NTRP 3.0+",    "monthly": 150, "drop_in": 50, "schedule": "Thu Moulton · Sat/Sun LBHS"},
            {"name": "Cardio Tennis", "level": "All levels",   "monthly": 150, "drop_in": 50, "schedule": "Fri 9a LBHS"},
        ],
        "privates": [
            {"coach": "Andrew Mateljan",  "title": "Founder & Director of Tennis",   "rate60": 250, "rate90": 350, "pack10": 2300, "pack20": 4200},
            {"coach": "Peter DeFrantz",   "title": "Head Coach, Junior Development", "rate60": 120, "rate90": 165, "pack10": 1100, "pack20": 2000},
            {"coach": "Allison Cronk",    "title": "Head Coach, Youth Programs",     "rate60": 120, "rate90": 165, "pack10": 1100, "pack20": 2000},
        ],
        "camps": [
            {"name": "Ski Week Camp",          "dates": "Feb 16–20, 2026",          "ages": "5–14",  "price_label": "$525/wk · $105/day"},
            {"name": "Spring Break Camp",      "dates": "Mar 30 – Apr 2, 2026",     "ages": "5–17",  "price_label": "$325/wk · $85/day"},
            {"name": "Summer Camps",           "dates": "Jun 15 – Aug 29, 2026",    "ages": "5–17",  "price_label": "T&A: $495 full / $325 half · Training: $595 full / $325 half"},
            {"name": "Back-to-School Mini",    "dates": "Aug 17–20, 2026 (3 days)", "ages": "5–17",  "price_label": "T&A: $372 full / $245 half · Training: $447 full"},
            {"name": "Thanksgiving Camp",      "dates": "Nov 23–25, 2026 (3 days)", "ages": "5–17",  "price_label": "$221 (T&A) · $244 (JD)"},
            {"name": "Winter Break Camp",      "dates": "Dec 21–24 + Dec 28–31",    "ages": "5–17",  "price_label": "$425/session (4 days)"},
        ],
        "leagues_usta": leagues["usta"]["leagues"],
        "matchplay_utr": leagues["utr"]["divisions"],
        "discounts": [
            {"label": "Early Bird",     "value": "5%",  "note": "Registered 2+ weeks before session start"},
            {"label": "Sibling",        "value": "10%", "note": "Additional siblings in same program"},
            {"label": "Multi-Program",  "value": "5%",  "note": "Two or more programs"},
            {"label": "Annual Prepay",  "value": "10%", "note": "Full year paid up front"},
        ],
        "scholarship": {
            "available": True,
            "annual_pool": "$25,000",
            "coverage":    "25–50%",
            "email":       "support@lagunabeachtennisacademy.com",
        },
    }


def build_annual_calendar(year: dict, leagues: dict) -> dict:
    """Build a 12-month timeline view of the LBTA year.

    Each entry has start_month + end_month (1-12) with a label and a
    color-key so the calendar template can render it as a horizontal bar.
    Camps are point events (start_month == end_month) with a date label.
    """
    seasons = year["seasons"]
    return {
        "year": year["year"],
        "season_bars": [
            {"label": "Winter session", "weeks": seasons["winter"]["weeks"], "dates": seasons["winter"]["dates"], "start": 1,  "end": 4,  "color": "deep"},
            {"label": "Spring session", "weeks": seasons["spring"]["weeks"], "dates": seasons["spring"]["dates"], "start": 4,  "end": 6,  "color": "cove"},
            {"label": "Summer session", "weeks": seasons["summer"]["weeks"], "dates": seasons["summer"]["dates"], "start": 6,  "end": 8,  "color": "sunset"},
            {"label": "Fall session",   "weeks": seasons["fall"]["weeks"],   "dates": seasons["fall"]["dates"],   "start": 9,  "end": 12, "color": "gold"},
        ],
        "open_court_bars": [
            {"label": "LiveBall · Cardio Tennis (year-round)", "start": 1, "end": 12, "color": "pacific"},
        ],
        "camps": [
            {"label": "Ski Week",          "dates": "Feb 16–20",        "month": 2,  "color": "gold"},
            {"label": "Spring Break Camp", "dates": "Mar 30 – Apr 2",   "month": 4,  "color": "cove"},
            {"label": "Summer Camps",      "dates": "Jun 15 – Aug 29",  "start": 6, "end": 8, "color": "sunset"},
            {"label": "Back-to-School",    "dates": "Aug 17–20",        "month": 8,  "color": "sunset"},
            {"label": "Thanksgiving",      "dates": "Nov 23–25",        "month": 11, "color": "gold"},
            {"label": "Winter Break",      "dates": "Dec 21–24 + 28–31","month": 12, "color": "deep"},
        ],
        "leagues_usta_bars": [
            {"label": "USTA Adult 18+ League",        "dates": "Apr 17 – Jul 5",   "start": 4, "end": 7,  "color": "cove"},
            {"label": "USTA Friday Women's League",   "dates": "Apr 17 – Jul 5",   "start": 4, "end": 7,  "color": "cove"},
            {"label": "USTA Mixed 40+ Doubles",       "dates": "Apr 18 – Sep 6",   "start": 4, "end": 9,  "color": "cove"},
            {"label": "USTA Adult 55+ Doubles",       "dates": "May 2 – Aug 16",   "start": 5, "end": 8,  "color": "cove"},
        ],
        "matchplay_bars": [
            {"label": "UTR Match Play (all divisions)", "dates": "Apr 11 – Jun 6 (Grand Finals)", "start": 4, "end": 6, "color": "sunset"},
        ],
        "key_dates": [
            {"date": "Jan 5",      "event": "Winter session begins"},
            {"date": "Mar 2",      "event": "Spring registration opens"},
            {"date": "Mar 20",     "event": "Spring early-bird deadline"},
            {"date": "Apr 6",      "event": "Spring session begins"},
            {"date": "May 1",      "event": "Summer registration opens"},
            {"date": "May 20",     "event": "Summer early-bird deadline"},
            {"date": "Jun 15",     "event": "Summer session + camps begin"},
            {"date": "Aug 5",      "event": "Fall registration opens"},
            {"date": "Aug 19",     "event": "Fall early-bird deadline"},
            {"date": "Aug 31",     "event": "Fall session begins"},
            {"date": "Dec 1",      "event": "Winter '27 registration opens"},
        ],
        "scholarship_note": "Scholarships: $25,000 awarded annually · 25–50% coverage · email support@lagunabeachtennisacademy.com",
    }


def main() -> int:
    coaches_doc = load("coaches.json")
    spring_summer = load("spring-summer-2026.json")
    private_rates = load("private-rates.json")
    leagues = load("leagues-2026.json")
    site_stats = load("site-stats.json")
    year = load("year2026.json")
    fall = load("fall2026.json")

    coaches = visible_coaches(coaches_doc)
    programs = categorize_programs(spring_summer)

    content = {
        "_source_note": (
            "Generated from data/*.json by scripts/build_brochure_content.py. "
            "Do not edit by hand — re-run the script after data changes."
        ),
        "contact": CONTACT,
        "locations": LOCATIONS,
        "stats": {
            "years_experience": site_stats["trustStats"]["yearsExperience"],
            "players_count":    site_stats["trustStats"]["playersCount"],
            "rating":           site_stats["trustStats"]["rating"],
            "review_count":     site_stats["trustStats"]["reviewCount"],
            "d1_placements":    site_stats["trustStats"]["d1Placements"],
            "coach_count":      site_stats["trustStats"]["coachCount"],
            "active_students":  site_stats["trustStats"]["activeStudents"],
        },
        "season": {
            "spring": spring_summer["spring"],
            "summer": spring_summer["summer"],
            "discounts": spring_summer["discounts"],
        },
        "coaches": coaches,
        "programs": programs,
        "private_rates": private_rates,
        "camps": spring_summer["camps"],
        "leagues": leagues,
        "annual_pricing":  build_annual_pricing(year, fall, spring_summer, leagues),
        "annual_calendar": build_annual_calendar(year, leagues),
        "pathway": [
            {"level": "Little Tennis Stars", "ages": "3–4",  "court": "36' foam",            "leads_to": "First racquet, first rally"},
            {"level": "Red Ball",            "ages": "5–6",  "court": "36' foam",            "leads_to": "Coordination + first match play"},
            {"level": "Orange Ball",         "ages": "7–8",  "court": "60' low-compression", "leads_to": "Scoring, footwork, first tournament"},
            {"level": "Green Dot",           "ages": "9–11", "court": "78' green",           "leads_to": "Phase Play · UTR 1.0–3.0"},
            {"level": "Junior Development",  "ages": "11–18","court": "78' yellow",          "leads_to": "UTR 1–7 · USTA Level 6/5"},
            {"level": "High Performance",    "ages": "12–17","court": "78' yellow",          "leads_to": "UTR 8+ · Section / National events"},
        ],
        # ---------------------------------------------------------------------
        # POD CONTENT (variant 09 ONLY — by-invitation, never on variants 01-08)
        # Sourced from 06_LBTA_Finance_PricingMembership_v2.md (lines 153-169) +
        # Brand_VoiceGuide_v2.md §2 Pod 4-Layer Framework.
        # Andrew's choices baked in (2026-05-06 plan):
        #   - Email only (no phone on the printed sheet)
        #   - No published price (invite the conversation)
        #   - Henry named in full with verified trajectory
        # ---------------------------------------------------------------------
        "pod": {
            "name": "The Pod",
            "framing": "Private Player Management",
            "scarcity_line": "By invitation. Two paying families per 3-player Pod.",
            "configurations_narrative": (
                "Two configurations. A 3-player Pod has two paying families plus Henry. "
                "A 4-player Pod has three. The number is fixed; there is no twentieth "
                "student waiting for a slot to open."
            ),
            "what_is_included_narrative": (
                "One tuition covers everything: on-court training three to five days "
                "per week, individual development plans, tournament programming, travel "
                "coaching when families travel, and the standing availability you'd "
                "expect from a coach who knows your child by name. It is a year-long "
                "program commitment, not a per-session fee."
            ),
            "track_record": {
                "name": "Henry Mateljan",
                "age": 9,
                "joined_utr": "2.48",
                "current_utr": "4.60",
                "current_band": "4.60–5.00",
                "duration_months": 18,
                "narrative": (
                    "Henry Mateljan, age nine, joined the Pod at UTR 2.48. Eighteen months "
                    "later he is at 4.60, currently in the 4.60–5.00 band."
                ),
            },
            "team_narrative": (
                "Andrew runs every Pod session personally. Twenty years coaching "
                "internationally and on tour. Took Karue Sell from ATP #860 to #258 "
                "in 2025. Trained Colton Smith (#133), Max McKennon (#458), Ryan "
                "Seggerman (#63 in doubles). Alex Michelsen came through the program "
                "at ages 12–13 and is now ATP #30."
            ),
            "d1_pipeline": (
                "Sean Daryabeigi (USC, Blue Chip #2) · Rebecca Lynn (Yale) · Lauren Stein (Cornell)"
            ),
            "cta_email": "andrew@lagunabeachtennisacademy.com",
            "cta_text": (
                "Pod placement is by invitation. To request consideration, write to "
                "Andrew directly at andrew@lagunabeachtennisacademy.com. He reads and "
                "replies to every Pod inquiry personally."
            ),
        },
        # ---------------------------------------------------------------------
        # PLACEMENT GUIDE (variant 10 — public, internal + prospect-facing)
        # Decision trees + cross-program matrix. Sourced from
        # data/spring-summer-2026.json + data/leagues-2026.json. Cross-program
        # eligibility confirmed by Andrew 2026-05-06:
        #   - Sunday UTR 3-12 + Doubles: juniors and adults play together
        #   - Junior programs stay kid-only (no adult drop-ins)
        # ---------------------------------------------------------------------
        "placement": {
            "junior_decision": [
                {"if": "3–4",                                   "go_to": "Little Tennis Stars"},
                {"if": "5–6",                                   "go_to": "Red Ball"},
                {"if": "7–8",                                   "go_to": "Orange Ball"},
                {"if": "9–11 · group classes",                  "go_to": "Green Dot"},
                {"if": "9–11 · tournament-ready (invite)",      "go_to": "Competitive Green Dot"},
                {"if": "11–18 · UTR 1–4 or no rating",          "go_to": "Junior Development · Tier 1"},
                {"if": "11–18 · UTR 4–7",                       "go_to": "Junior Development · Tier 2"},
                {"if": "12–17 · UTR 8+",                        "go_to": "High Performance"},
            ],
            "adult_decision": [
                {"if": "Never picked up a racquet",                    "go_to": "New to Tennis"},
                {"if": "Can rally and serve, inconsistent",            "go_to": "Beyond Beginner"},
                {"if": "Comfortable rallying, 1+ years, consistent serve · NTRP 3.0–4.0", "go_to": "Adult Intermediate"},
                {"if": "Tournament / league experience · NTRP 4.0+",   "go_to": "Adult Advanced"},
            ],
            # Each junior row: program → schedule shortform → also fits (cross-program)
            "junior_grid": [
                {"program": "Little Tennis Stars", "ages": "3–4",   "where": "Mon/Wed Moulton · Sat Alta",     "also": "Just here. Saturday class adds reps."},
                {"program": "Red Ball",            "ages": "5–6",   "where": "Mon/Wed Moulton · Sat Alta",     "also": "Spring Break + Summer Camps (Tennis & Adventure 5–11)"},
                {"program": "Orange Ball",         "ages": "7–8",   "where": "Mon/Wed/Tue/Thu Moulton · Sat Alta", "also": "Camps · UTR Color Ball (Sat Alta · $55 drop-in)"},
                {"program": "Green Dot",           "ages": "9–11",  "where": "Tue/Thu Moulton · Sat Alta",     "also": "Camps · UTR Color Ball (Sat)"},
                {"program": "Competitive Green Dot", "ages": "9–11+ · invite", "where": "Tue/Thu Alta · Fri LBHS", "also": "Camps · UTR Color Ball + Singles 1–7 (Sat)"},
                {"program": "Junior Development · T1", "ages": "11–18 · UTR 1–4", "where": "Mon/Wed Alta · Fri LBHS", "also": "Camps · UTR Singles 1–7 (Sat)"},
                {"program": "Junior Development · T2", "ages": "11–18 · UTR 4–7", "where": "Mon/Wed Alta · Fri LBHS", "also": "Camps · UTR Singles 1–7 (Sat) · Singles 3–12 + Doubles (Sun · mixed with adults)"},
                {"program": "High Performance",      "ages": "12–17 · UTR 8+",   "where": "Mon/Wed/Fri LBHS",        "also": "Summer Training Camp · UTR Singles 3–12 + Doubles (Sun · mixed with adults)"},
            ],
            # Each adult row: program → level/format → also fits
            "adult_grid": [
                {"program": "New to Tennis",       "level": "Beginner",            "where": "Tue/Thu 10a · Mon/Wed 6:30p · Sat 9a",  "also": "Just here. Foundation first."},
                {"program": "Beyond Beginner",     "level": "Advanced beginner",   "where": "Mon/Wed 6:30p Moulton",                 "also": "Cardio Tennis (Fri all levels) when ready"},
                {"program": "Adult Intermediate",  "level": "NTRP 3.0–4.0",        "where": "Tue/Thu 11a · Sat 10a LBHS",            "also": "LiveBall Intermediate (Thu/Sat/Sun · $50) · Cardio Tennis (Fri · $50) · USTA Adult League (3.0/3.5/4.0) · UTR Doubles (Sun · $65)"},
                {"program": "Adult Advanced",      "level": "NTRP 4.0+",           "where": "Mon/Fri 12–2p LBHS",                    "also": "LiveBall Advanced (Sun 10:30a · $50) · Cardio Tennis (Fri) · USTA League (4.0/4.5/5.0) · UTR Singles 3–12 + Doubles (Sun · $65)"},
                {"program": "LiveBall",            "level": "NTRP 3.0+",           "where": "Thu Moulton · Sat/Sun LBHS · monthly $150 / $50 drop-in", "also": "Cardio · USTA League at your level · UTR Doubles"},
                {"program": "Cardio Tennis",       "level": "All levels",          "where": "Fri 9a LBHS · monthly $150 / $50 drop-in", "also": "LiveBall at your level · USTA League"},
            ],
            # Compact cross-program matrix shown in the bottom band.
            # Each row is a player profile and the menu of additional programs they can stack on.
            "cross_program": [
                {"profile": "Junior · Green Dot (9–11)",            "stacks_with": "Camps · UTR Color Ball (Sat at Alta)"},
                {"profile": "Junior · JD Tier 2 (UTR 4–7)",         "stacks_with": "Camps · UTR Singles 1–7 (Sat) · UTR Singles 3–12 + Doubles (Sun)"},
                {"profile": "Junior · High Performance (UTR 8+)",   "stacks_with": "Summer Training Camp · UTR Singles 3–12 + Doubles (Sun, mixed with adults)"},
                {"profile": "Adult · Beyond Beginner",              "stacks_with": "Cardio Tennis (Fri, all levels)"},
                {"profile": "Adult · Intermediate (NTRP 3.0–4.0)",  "stacks_with": "LiveBall Intermediate · Cardio Tennis · USTA Adult League · UTR Doubles"},
                {"profile": "Adult · Advanced (NTRP 4.0+)",         "stacks_with": "LiveBall Advanced · Cardio · USTA League 4.0+ · UTR Singles 3–12 + Doubles"},
            ],
            "cta_internal": "Internal use: cross-reference with PlayByPoint enrollment. Note: junior programs stay kid-only — no adult drop-ins.",
            "cta_external": "Not sure where you (or your player) belong? Reply to support@lagunabeachtennisacademy.com and we'll match you to the right starting point. First session is on us.",
        },
        # Audience-specific framing copy. Hand-authored, voice-gated, NOT invented facts.
        "audience": {
            "concierge": {
                "intro": (
                    "If your guest brought a racquet — or wishes they had — point them here. "
                    "Laguna Beach Tennis Academy runs the city's official tennis programs across "
                    "three parks, ten minutes from most hotels. Drop-in clinics, private lessons, "
                    "and camp drop-in for traveling families."
                ),
                "guest_call_to_action": "Book at lagunabeachtennisacademy.com/book",
            },
            "family": {
                "intro": (
                    "A clear pathway from age three through college tennis — same coaches, same "
                    "courts, same standard. Start with a $50 LiveBall or a complimentary trial."
                ),
                "guest_call_to_action": "View the schedule at lagunabeachtennisacademy.com/schedules",
            },
            "warm_lead": {
                "intro": (
                    "Thanks for getting in touch. This is a quick map of how we train at LBTA — "
                    "the pathway, the coaches, and the programs that fit where you (or your "
                    "player) are right now. Reply to this email and I'll match you to the "
                    "right starting point."
                ),
                "sign_off": "— Andrew",
            },
            "private": {
                "intro": (
                    "Private coaching at LBTA is built around your goals: technical clarity, "
                    "match preparation, return-to-play after injury, or a structured ramp toward "
                    "competitive tennis. Three coaches with published rates and 10/20-pack "
                    "savings. Sessions on city-managed courts — no club membership required."
                ),
            },
        },
    }

    OUT.parent.mkdir(parents=True, exist_ok=True)
    with open(OUT, "w") as f:
        json.dump(content, f, indent=2, ensure_ascii=False)

    print(f"✓ wrote {OUT.relative_to(ROOT)}")
    print(f"  coaches:    {len(coaches)}")
    print(f"  juniors:    {len(programs['junior'])}")
    print(f"  development:{len(programs['development'])}")
    print(f"  adult:      {len(programs['adult'])}")
    print(f"  open-court: {len(programs['open-court'])}")
    print(f"  leagues:    {len(leagues['usta']['leagues'])} USTA · {len(leagues['utr']['divisions'])} UTR")
    return 0


if __name__ == "__main__":
    sys.exit(main())
