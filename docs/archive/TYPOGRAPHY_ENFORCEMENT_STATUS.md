# Typography Enforcement Status

**Date:** December 8, 2025  
**Goal:** Enforce Blueprint typography system across all 27 pages

---

## The Problem

**185 instances** of inconsistent typography across **21 files** using:
- Tailwind defaults (`text-xl`, `text-4xl`, etc.)
- Inline styles (`fontSize`, custom values)
- Arbitrary values (`text-[22px]`)

**Instead of our Blueprint system:**
- `display` (84px → 48px responsive)
- `headline` (64px → 40px responsive)
- `headline-sm` (48px → 32px responsive)
- `subhead` (32px → 28px responsive)
- `subhead-sm` (28px → 24px responsive)
- `body-lg` (20px)
- `body` (18px)
- `body-sm` (16px)
- `eyebrow` (11px uppercase, 2px tracking)

---

## Progress Today

### ✅ Fixed (2 files):
1. `app/about/page.tsx` - All typography enforced
2. `app/philosophy/page.tsx` - All typography enforced

### 🔄 Remaining (19 files):
1. app/beginner-program/page.tsx (landing page - separate system OK)
2. app/fitness/page.tsx
3. app/adult-trial/page.tsx
4. app/page.tsx (HOMEPAGE - HIGH PRIORITY)
5. app/junior-trial/page.tsx
6. app/success-stories/page.tsx
7. app/camps/page.tsx
8. app/coaches/page.tsx
9. app/programs/junior/page.tsx
10. app/faq/FAQInteractive.tsx
11. app/coaches/andrew-mateljan/page.tsx
12. app/book/page.tsx
13. app/match-play/page.tsx
14. app/apply-scholarship/page.tsx
15. app/pathway-planner/page.tsx
16. app/contact/page.tsx
17. app/thank-you/page.tsx
18. app/terms/page.tsx
19. app/privacy/page.tsx

---

## Blueprint Typography Classes Reference

### Headings:
```
H1: display (main page title)
H2: headline or headline-sm (section headers)
H3: subhead or subhead-sm (subsection headers)
```

### Body:
```
Large intro text: body-lg (20px)
Standard copy: body (18px)
Small text: body-sm (16px)
```

### Labels:
```
Eyebrows/overlines: eyebrow (11px uppercase, 2px tracking)
```

### Font Families:
```
Display/Headlines: font-serif (Cormorant)
Body: font-sans (Inter) - default, usually omit
Eyebrows: Already includes font-accent (DM Sans)
```

---

## Quick Reference: What to Replace

```
text-7xl → display
text-6xl → display or headline
text-5xl → headline
text-4xl → headline or headline-sm
text-3xl → headline-sm or subhead
text-2xl → subhead or subhead-sm
text-xl → body-lg or subhead-sm
text-lg → body-lg
text-base → body
text-sm → body-sm
text-xs → body-sm or leave as-is (captions)

text-overline → eyebrow + style={{color: '#E8956F'}}
```

### Also Remove:
- `font-light`, `font-medium` (already in class definitions)
- `leading-relaxed` (already in class)
- Custom letter-spacing (already defined)

---

## Estimated Time Remaining

- 2-3 files per commit (test, verify)
- ~7-8 commits needed
- ~30-45 minutes total

---

## Benefits Once Complete

1. **Visual Cohesion** - All pages feel like one site
2. **Responsive Scaling** - Typography adapts mobile→desktop perfectly
3. **Brand Consistency** - Professional execution throughout
4. **Easy Maintenance** - Update typography globally via tailwind.config
5. **Design System Integrity** - Blueprint standard enforced

---

## Status: 10% Complete

**Next priority:** Homepage, then high-traffic pages (coaches, programs, schedules)

