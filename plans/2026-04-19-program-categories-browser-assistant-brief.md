# Browser assistant brief — program categories (short names + colors)

**Purpose:** Configure **Program Categories for Facility LBTA** in the third-party admin so filters, badges, and calendar colors stay **stable for the season**, **short** in the UI, and **on-brand** (LBTA hex palette).

---

## Rule of thumb (how to use categories)

1. **Categories = broad buckets** — set once for the year; they appear as **filter chips**, **badges**, and **headings**. Keep each label **short** (ideally **one word**, two at most).
2. **Programs = specificity** — ages, ball color, schedule, and level belong on **each program’s title/description** (e.g. “Red Ball,” “Green Dot Competitive”), **not** in the category name.
3. **Position** — lower number = shows first. Order by **what members open most often** at LBTA (adjust once; see “Position order” below).
4. **Colors** — one **distinct** hex per category so staff and members can scan the calendar and app quickly. **Do not** reuse the same navy on two different categories (fix the current “Kids” + “Adult” both navy issue).

**Do not** use the word **kids** in a category name. Use **Foundations** for the intro / young-junior bucket.

---

## Preconditions

1. Logged into the correct **facility** for **LBTA**.
2. Open **Facility** → **Program Categories** (or equivalent).
3. Click **Update Facility** (or Save) after edits and confirm success.

---

## What to enter (source of truth)

Use **Title Case** for every category (matches professional UI and fixes inconsistent casing like “Match ladder”).

| Pos | Category | Hex | Brand token (reference) |
|-----|----------|-----|---------------------------|
| 1 | Foundations | `#C4963C` | Thousand Steps |
| 2 | Competitive | `#2E8B8B` | Victoria Cove |
| 3 | Adult | `#1B3A5C` | Pacific Dusk |
| 4 | LiveBall | `#E8834A` | Sunset Cliff |
| 5 | Camps | `#0F2237` | Deep Water |
| 6 | Leagues | `#3A8B6E` | Tide Pool |
| 7 | Ladder | `#7A8B6E` | Sage Hill |
| 8 | Events | `#B8A88A` | Driftwood |
| 9 | Private | `#1B3A5C` | Pacific Dusk |

**Color note:** **Adult** and **Private** share Pacific Dusk (`#1B3A5C`) so both read as “instruction / ongoing.” If you need them to pop differently on calendar views, set **Private** to **`#0F2237` (Deep Water)** and change **Camps** to **`#2E8B8B` (Victoria Cove)** so **Camps** stays visually separate from **Foundations** (`#C4963C`).

---

## Position order (most-used first)

The table uses **Pos 1–9** in a sensible default for a **junior-heavy academy**:

1. Foundations  
2. Competitive  
3. Adult  
4. LiveBall  
5. Camps  
6. Leagues  
7. Ladder  
8. Events  
9. Private  

**If adult enrollment or LiveBall is heavier**, reorder so your top traffic types are **1–3** (e.g. Adult, LiveBall, Foundations). Keep the **set of nine names** the same—only swap **Position** numbers.

---

## Rename map (from current UI)

| Current / old | New category |
|---------------|--------------|
| Kids Programs | **Foundations** |
| Junior Dev & HP | **Competitive** |
| Adult Programs | **Adult** |
| LiveBall & Cardio | **LiveBall** |
| Camps | **Camps** |
| Leagues & Competiti… (truncated) | **Leagues** |
| Match ladder | **Ladder** |
| Events | **Events** |
| Private lessons | **Private** |

---

## What the assistant should do

1. Edit each category row: **Category** = exact name from the table; **Color** = hex; **Position** = Pos.
2. Remove duplicate or obsolete categories if the product allows merging.
3. Do **not** put age ranges or long phrases in category names; those stay on **individual programs**.
4. Click **Update Facility** / save.
5. Spot-check **Find What Fits** (or program grid): badges should show **short** labels and **distinct** colors.

---

## Verification checklist

- [ ] Category names are **short** (no long sentences; no “kids”).
- [ ] **Foundations** replaces the old kids bucket.
- [ ] **Title Case** everywhere (e.g. **Ladder**, not “ladder”).
- [ ] Positions reflect **your** most-used-first order.
- [ ] No two unrelated categories share the **same** color by mistake.
- [ ] Changes saved successfully.

---

## Notes

- **LiveBall** is one word in the UI to keep the chip narrow; full offering is still LiveBall-style cardio in copy elsewhere.
- **Foundations** = intro / young junior track; **Competitive** = development & high-performance junior track—without spelling that out on every filter.
- **Do not** change program pricing, schedules, or unrelated catalogs—only **program categories** (name, color, position) unless asked.
