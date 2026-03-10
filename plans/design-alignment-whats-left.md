# Design alignment — what’s actually left

**Purpose:** Single list of what’s still open from **lbta-design-alignment-plan.md** and **homepage-overhaul-plan.md**, with current status and a suggested order. Use this to finish “full” design alignment without re-reading both plans.

---

## Already done (no action)

| Item | Plan | Status |
|------|------|--------|
| “The Academy” wordmark next to logo | Design alignment 1.3 | ✅ In Header |
| Logo local path `/logos/LBTAblktext.png` | Design alignment 1.3, 4.1 | ✅ Header + Footer |
| HOME + CAMP in nav | Design alignment 1.4 | ✅ Home, Schedule, Coaches, About, Contact, Camp |
| CTA color documented (black/white) | Design alignment 1.1 | ✅ In .cursorrules |
| Single source for homepage copy | Homepage 2.1 | ✅ `data/homepage-copy.json` used everywhere |
| Hero: tagline, subline, “Book a Trial” | Homepage 2.2 | ✅ From JSON |
| Founder section from JSON; results “ATP Tour” | Homepage 2.3, 2.4 | ✅ |
| Exit intent never on first paint | Homepage 1.2 | ✅ Guard: scroll threshold + exit intent only |
| Footer logo path and invert | Design alignment 3.3 | ✅ |
| PartnershipSection logos from `/logos/` | Design alignment 4.2 | ✅ Paths and alt in code |
| Media brief for imagery | Homepage 3.1, 3.2 | ✅ `plans/homepage-media-brief.md` |

---

## Left to do (in order)

### 1. Copy tweaks (fast) — ✅ Done

| Task | Where | Change |
|------|--------|--------|
| **Program card labels** | `data/homepage-copy.json` → `programs.items` | Use design wording: **“Junior Programs”**, **“Adult Programs”**, **“Private Coaching”** (currently “Junior Pathway”, “Adult Training”, “Private Coaching”). |
| **Optional: Dark band** | `app/page.tsx` or JSON | Design alignment 2.2: add a thin dark band with “MORE → LESSONS, CAMPS & CLINICS” (e.g. between hero and founder) only if you want that exact line; otherwise skip. |

### 2. Footer: “JOIN OUR COMMUNITY” (one change) — ✅ Done

| Task | Where | Change |
|------|--------|--------|
| **Add heading above footer main block** | `components/layout/Footer.tsx` | Insert a heading (e.g. `<h2>JOIN OUR COMMUNITY</h2>`) above the main footer grid (the one with logo + tagline + social and nav links). Style to match footer (e.g. eyebrow or small headline, `text-white/80`). Newsletter strip can stay above this as-is. |

### 3. “Why Choose” section (new section + copy) — ✅ Done

| Task | Where | Change |
|------|--------|--------|
| **Add “Why Choose Laguna Beach Tennis Academy”** | `app/page.tsx` + optional component | New section with headline, short body, and **two images** (paths in data or env). Either inline in `page.tsx` or a small `WhyChooseSection.tsx` that reads copy from `homepage-copy.json`. You supply the two images; we wire paths (see image spec). |

### 4. Optional: Logo audit doc

| Task | Where | Change |
|------|--------|--------|
| **List logo paths and alt** | Design alignment 1.2 | One-time: document in a short checklist or in this plan: Header, Footer, PartnershipSection (each partner), trial pages, chatbot — path + alt. No code change unless something is wrong. |

### 5. Verification (both plans)

| Task | Source | Action |
|------|--------|--------|
| **Responsive check** | Design alignment 4.3 | Test 320, 375, 768, 1024, 1440; fix overflow/horizontal scroll. |
| **Forbidden copy pass** | Design alignment 4.4, Homepage 2.7 | Grep or manual pass: no “maximize,” “elite,” “world-class,” “Sign up now!,” etc. |
| **Lighthouse** | Design alignment 5.1 | Homepage ≥90 all categories; LCP &lt; 2.5s, CLS &lt; 0.1. |
| **Accessibility** | Design alignment 5.2, Homepage 4.1–4.3 | 7:1 contrast, 48px touch targets, focus rings, `prefers-reduced-motion`. |
| **Forms** | Design alignment 5.4 | HomeCTAForm + NewsletterForm: validation, success/error, no layout shift. |
| **Build + lint** | Design alignment 5.6 | `npm run build` and `npm run lint` clean. |

---

## Not needed / deferred

- **Design alignment 2.2 (dark band)** — Only if you want “MORE → LESSONS, CAMPS & CLINICS”; otherwise skip.
- **Design alignment 3.2 (Newsletter name field)** — Plan says “if design specifies”; current is email-only; leave unless you want name.
- **Homepage 3.3 (asset checklist)** — Optional; image spec + Canva doc already give you the list.
- **Homepage 3.4 (image alt/sizes)** — Already required by .cursorrules; spot-check key images.

---

## Suggested order of work

1. **Copy:** Update program labels in `homepage-copy.json` (Junior Programs, Adult Programs, Private Coaching).
2. **Footer:** Add “JOIN OUR COMMUNITY” above the main footer block in `Footer.tsx`.
3. **Why Choose:** Add section + copy; add two image slots to image spec; you add assets later.
4. **Optional:** Dark band only if you want that exact line.
5. **Verification:** Responsive, forbidden copy, Lighthouse, a11y, forms, build/lint.

That’s the full design alignment minus imagery (which you’re handling via Canva + image spec).
