# Laguna Beach Tennis Academy — Cinematic Homepage Build
**Final Canvas Plan for Cursor**

---

## 🎬 Creative Direction Manifest

### Objective
A founder-led, cinematic homepage that feels like a **short film about discipline and belonging**, not a marketing page.

### Creative DNA
> "Tennis, as it should be taught."
> Movement. Discipline. Belonging.

### Design Essence

- **Luxury restraint:** 40%+ white space, slow transitions, quiet confidence
- **Laguna palette:** warm daylight (#F8A121 / #F8E6BB)
- **Typography:** Playfair Display + Work Sans
- **Tone:** calm, authentic, handcrafted
- **Motion rhythm:** slow (200–300ms fades) → cinematic pacing
- **No clichés:** never "maximize," "boost," "elite," or salesy CTAs
- **Mood references:** Mouratoglou Academy / Aman / Four Seasons digital presence

---

## 🪴 Scene-by-Scene Build Map

| Scene | Asset(s) | Crop | Copy | Motion / Overlay |
|-------|----------|------|------|------------------|
| **1. Hero – "The Standard"** | `LBTA-Home-Hero.webm` | 16:9 (1920×1080) | "Tennis, as it should be taught." ↵ "Movement. Discipline. Belonging." | Fade-in stagger 200ms / Text-shadow rgba(0,0,0,0.35) / Scroll cue "Explore ↓" orange #F8A121 |
| **2. Founder – "The Vision"** | `andrew-portrait.webp` | 3:4 (1200×1600) | Headline + bio + quote + CTA | Split fade (L→R) / Background #F8E6BB / Quote orange italic |
| **3. Results – "Results in Motion"** | `karue-training.webp` | 16:9 | "#858 → #258 ATP Guided by structure, repetition, and trust." | Overlay LHS text white / slow pan (5%) / CTA underline orange |
| **4. Philosophy – "Our System"** | `movement-1` / `discipline-1` / `belonging-4.webp` | 1:1 (1000×1000) | 3 pillars with 1-line copy | Card hover scale 1.02 / shadow rgba(0,0,0,0.05) |
| **5. Programs – "Pathways"** | `programs-juniors` / `adults` / `private_lessons-2.webp` | 3:2 (1600×1067) | "From red ball to college prep." etc. | Horizontal scroll / CTA below |
| **6. Destination – "Laguna Advantage"** | `laguna-horizon.webp` | 21:9 (2560×1097) | "Train where focus meets horizon." ↵ "Laguna Beach — where performance meets perspective." | Parallax 0.7× speed / fade-in |
| **7. Community – "Players Who Train Our Way"** | `community 1-6.webp` + `belonging-3.webp` | mixed (1200×900) | "From junior pathways to ATP courts…" | Masonry grid / auto-mute video testimonials inline |
| **8. CTA – "The Invitation"** | `cta-laguna-sunset.webp` | 21:9 (2560×1440) | "Start training with purpose." | 25% black overlay bottom→top / parallax 0.6× / button white on #F04E23 |
| **Footer** | `LBTA-logo-mono.svg` | — | nav links + contact | static fade-in |

---

## 📐 Crop & Export Reference

| Device | Landscape | Square | Portrait |
|--------|-----------|--------|----------|
| Desktop | 1920 × 1080 | 1000 × 1000 | 1200 × 1600 |
| Tablet | 1280 × 720 | 800 × 800 | 900 × 1200 |
| Mobile | 800 × 450 | 600 × 600 | 600 × 800 |

**Format:** WebP 75% quality • ≤350KB per image • Hero MP4/WebM ≤8MB

---

## 🎨 Color & Type Tokens (Tailwind)

```typescript
colors: {
  lbta: {
    orange: '#F8A121',
    red: '#F04E23',
    beige: '#F8E6BB',
    text: '#000000',
    white: '#FFFFFF'
  }
}

fontFamily: {
  serif: ['Playfair Display', 'serif'],
  sans: ['Work Sans', 'sans-serif']
}
```

---

## ⚙️ Motion & Interaction

| Feature | Implementation |
|---------|----------------|
| Fade-in | opacity 0 → 1 + translateY 30 → 0 / 600ms ease-out / 200ms stagger |
| Parallax | Destination 0.7× / CTA 0.6× (scroll-timeline or Framer Motion) |
| Hover cards | scale 1.02 / shadow rgba(0,0,0,0.05) |
| Button hover | gradient orange→red 150ms ease-in |
| Scroll cue | fade in/out on enter and exit viewport |

---

## ♿ Accessibility & Performance

- Lazy-load all images below fold
- Preload hero poster frame
- `aria-label` every `<video>` / `<img>`
- Focus ring visible on all CTAs
- Contrast ≥ 7:1
- LCP < 2.5s • CLS < 0.1
- Use `loading="lazy"` + `decoding="async"`

---

## 🖊️ Cursor Build Prompt

**Using the LBTA_CINEMATIC_HOMEPAGE_CANVAS_PLAN_FINAL spec, rebuild the homepage in Next.js (app/page.tsx).**

- Replace all 575 existing lines with new 8-scene layout
- Use Tailwind for spacing and color tokens (provided)
- Integrate hero video (`LBTA-Home-Hero.webm`) autoplay muted loop
- Load responsive WebP images per scene (see directory)
- Apply fade-in + parallax animations as specified
- Ensure full accessibility compliance and performance targets (LCP < 2.5s / CLS < 0.1)
- Typography: Playfair Display (serif) for headlines, Work Sans (sans-serif) for body
- Maintain luxury spacing (120px rhythm desktop)
- No generic UI; preserve cinematic pacing and brand warmth

### Deliverables:

1. `app/page.tsx` rebuilt (~800 lines)
2. Updated `tailwind.config.ts` (color tokens)
3. Optimized WebP images in `public/images/...`
4. Verified motion + accessibility via Lighthouse

---

## 📋 Implementation Checklist

- [ ] Update `tailwind.config.ts` with LBTA color tokens and fonts
- [ ] Create 8-scene layout structure in `app/page.tsx`
- [ ] Integrate hero video with autoplay/muted/loop
- [ ] Optimize and convert all images to WebP format (≤350KB each)
- [ ] Implement fade-in animations with 200ms stagger
- [ ] Add parallax effects to Destination and CTA scenes
- [ ] Configure lazy loading for below-fold images
- [ ] Add aria-labels to all media elements
- [ ] Ensure 7:1 color contrast ratio
- [ ] Test Core Web Vitals (LCP < 2.5s, CLS < 0.1)
- [ ] Verify 120px vertical rhythm on desktop
- [ ] Test responsive behavior (desktop/tablet/mobile)
- [ ] Run Lighthouse audit for accessibility and performance

---

## 🎯 Key Design Principles

1. **Cinematic Pacing:** Slow, intentional transitions (200-300ms)
2. **Luxury Restraint:** 40%+ white space, minimal elements
3. **Authentic Voice:** Founder-led narrative, no marketing speak
4. **Performance First:** LCP < 2.5s, optimized images, lazy loading
5. **Accessibility:** WCAG AAA compliance (7:1 contrast)
6. **Brand Warmth:** Laguna palette (warm daylight tones)
7. **Purposeful Motion:** Every animation serves the narrative
8. **Mobile Excellence:** Responsive down to 600px width

---

**Last Updated:** December 10, 2025
**For:** LBTA Cinematic Homepage Rebuild
**Framework:** Next.js 14 App Router + Tailwind CSS + Framer Motion
