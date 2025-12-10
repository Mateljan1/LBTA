# 05 - DESIGN SYSTEMS & ATOMIC COMPONENTS LIBRARY

## Atomic Design Hierarchy

**Atoms → Molecules → Organisms → Templates → Pages**

---

## ATOMS (Base Building Blocks)

### Colors
- **Primary:** #2180 (Teal)
- **Secondary:** #5E5240 (Brown)
- **Text:** #134252 (Charcoal)
- **Background:** #FCFCF9 (Cream)
- **Accent:** #FF5459 (Red for alerts)

### Typography
- **Serif Headlines:** Playfair Display (premium positioning)
- **Sans-serif Body:** Inter or Geist (readable, modern)
- **Monospace Code:** Berkeley Mono (technical content)

**Hierarchy:**
- H1: 48px, Bold, Serif (primary message)
- H2: 36px, Bold, Serif (section heading)
- H3: 24px, Semibold, Serif (subsection)
- Body: 16px, Regular, Sans-serif
- Small: 14px, Regular, Sans-serif

### Spacing
- Base unit: 8px
- Spacing scale: 8px, 16px, 24px, 32px, 48px, 64px

### Borders & Shadows
- Border radius: 4px (small), 8px (medium), 12px (large)
- Shadows: Subtle (light), Medium (cards), Large (modals)

---

## MOLECULES (Simple Components)

### Button
```html
<button class="btn btn--primary">
  Get Started
</button>

<button class="btn btn--secondary">
  Learn More
</button>

<button class="btn btn--outline">
  Optional Action
</button>
```

**Styles:**
- Primary: Teal background, white text, 12px padding, 8px border-radius
- Secondary: Transparent, teal text, teal border
- Hover: Slightly darker, 2px box-shadow
- Active: Even darker background

### Input Field
```html
<label>Email Address</label>
<input type="email" placeholder="you@example.com">
```

**Styles:**
- Light background, subtle border
- Focus: Teal border, shadow on focus
- Error: Red border, red text below input
- Success: Green checkmark, green text

### Card
```html
<div class="card">
  <h3 class="card__title">Title</h3>
  <p class="card__body">Content here</p>
</div>
```

**Styles:**
- White background, subtle shadow, border-radius: 12px
- Padding: 24px
- Hover: Shadow expands slightly (2px lift)

---

## ORGANISMS (Complex Components)

### Navigation Bar
- Logo/brand name (left)
- Navigation links (center): Home, About, Services, Blog
- CTA button (right): "Get Started" or "Sign In"
- Sticky on scroll
- Mobile: Hamburger menu collapses to drawer

### Hero Section
- Large image/video background
- H1 headline (centered, white text on dark overlay)
- Subheading (supporting text)
- Primary CTA button (prominent, high contrast)
- Optional: Secondary CTA below

### Feature Grid
- 3-column grid on desktop, 1-column on mobile
- Each card has: Icon, Heading, Description, CTA link
- Cards are interactive (hover: shadow lifts, color shift)

### Testimonial Carousel
- Quote text (italic, serif)
- Author name (bold, sans-serif)
- Author photo (circular, 80px)
- 3-4 testimonials visible
- Auto-rotate every 5 seconds
- Manual navigation dots below

### Pricing Table
- 3 tiers: Basic, Pro (highlighted), Premium
- Tier name, price, description, features list
- CTA button per tier
- Features comparison (checkmarks for included)

---

## TEMPLATES

### Landing Page Template
1. **Navigation** (sticky)
2. **Hero Section** (headline + CTA)
3. **Problem Statement** (why this matters)
4. **Solution Introduction** (what you offer)
5. **Feature Grid** (key benefits)
6. **Social Proof Section** (testimonials)
7. **Objection Handling** (FAQ)
8. **Pricing Table** (three tiers)
9. **Final CTA** (call-to-action)
10. **Footer** (links, legal, contact)

### Product Page Template
1. **Navigation**
2. **Hero** (product name + image)
3. **Key Features** (3-4 main benefits)
4. **How It Works** (step-by-step)
5. **Pricing Plans**
6. **Customer Reviews**
7. **FAQ**
8. **Final CTA**
9. **Footer**

### Blog Post Template
1. **Hero** (title + meta info)
2. **Table of Contents** (if long)
3. **Body Content** (H2/H3 hierarchy)
4. **Author Bio** (with photo, credibility)
5. **Related Posts** (3 recommendations)
6. **CTA** (subscribe, share, etc.)
7. **Footer**

---

## RESPONSIVE BREAKPOINTS

**Desktop:** 1024px and above
- Full 3-column layouts
- Sidebar visibility
- Hover states active

**Tablet:** 768px to 1023px
- 2-column layouts where applicable
- Sidebar accessible but collapsible
- Touch-friendly targets (44×44px)

**Mobile:** 320px to 767px
- 1-column layouts
- Large touch targets (44×44px minimum)
- Text readable without zoom
- No horizontal scroll

### Mobile-First CSS Pattern
```css
/* Base: Mobile styles */
.container {
  width: 100%;
  padding: 16px;
}

/* Tablet and up */
@media (min-width: 768px) {
  .container {
    width: 90%;
    margin: 0 auto;
  }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .container {
    width: 80%;
    max-width: 1200px;
  }
}
```

---

## ACCESSIBILITY STANDARDS (WCAG 2.1 AAA)

### Color Contrast
- Body text: 7:1 ratio minimum (black on white)
- Large text: 4.5:1 ratio minimum
- Graphics/UI: 3:1 ratio minimum
- Test with: WebAIM Contrast Checker

### Touch Targets
- Minimum size: 44×44px (physical size)
- Minimum spacing: 8px between targets
- Mobile must accommodate thumb reach

### Keyboard Navigation
- All interactive elements accessible via Tab
- Focus indicators visible (blue outline, minimum 2px)
- Tab order logical (top to bottom, left to right)
- Keyboard shortcuts available for common actions

### Screen Reader Compatibility
- Semantic HTML (`<button>`, `<nav>`, `<header>`, not `<div>`)
- ARIA labels where necessary (`aria-label`, `aria-describedby`)
- Alt text on all images (descriptive, not "image of")
- Form labels associated with inputs (`<label for="id">`)

### Cognitive Accessibility
- Font: Sans-serif, dyslexia-friendly (Geist, Inter, Arial)
- Line height: 1.5 minimum
- Letter spacing: 0.12em
- Avoid: All caps, italic body text, font sizes < 14px
- Content: Short paragraphs (3-4 sentences), simple language

---

## COMPONENT INVENTORY

| Component | Page Sections | Variations | Notes |
|-----------|---------------|-----------|-------|
| Button | CTA, Navigation | Primary, Secondary, Outline, Size (sm/lg) | 44×44px minimum touch target |
| Input | Forms, Search | Text, Email, Password, Select, Checkbox | Focus state required |
| Card | Grid layouts, Testimonials, Products | Hover effect, Badge, Image | Shadow on hover |
| Hero | Landing pages, Product pages | Full-width, Centered, Sidebar | Image or video background |
| Navigation | All pages | Sticky/fixed, Hamburger (mobile) | Responsive collapse |
| Testimonial | Social proof, Case studies | Carousel, Grid, Single | Author photo required |
| Pricing | Pricing pages, Comparisons | Three tiers, Highlight middle | Comparison table |
| Form | Contact, Signup, Checkout | Multi-step, Single-page | Progressive disclosure |

---

## DESIGN SYSTEM DOCUMENTATION

### Using the System
1. **Start with atoms** (colors, typography, spacing)
2. **Build molecules** (individual components)
3. **Combine into organisms** (complex sections)
4. **Use templates** for page layouts
5. **Test responsiveness** at all breakpoints
6. **Verify accessibility** with automated tools + manual testing

### Maintaining Consistency
- Use design tokens (CSS variables) for all colors, spacing
- Never hardcode color hex codes (use variables)
- Update central design system, components auto-update
- Version control (document changes per release)
- Team documentation (Figma, Storybook, or equivalent)

### Browser Support
- Modern evergreen browsers (Chrome, Firefox, Safari, Edge)
- ES6+ JavaScript (not IE11)
- CSS Grid and Flexbox (standard)
- Mobile: iOS 12+, Android 5+

---

## IMPLEMENTATION CHECKLIST

- [ ] Colors defined with accessibility contrast verified
- [ ] Typography hierarchy established with all sizes
- [ ] Spacing system defined (base 8px unit)
- [ ] Responsive breakpoints set (320px, 768px, 1024px)
- [ ] All atoms created and documented
- [ ] Key molecules built (button, input, card)
- [ ] Organisms assembled (nav, hero, grid)
- [ ] Templates created for common page types
- [ ] Accessibility verified (contrast, keyboard, screen reader)
- [ ] Mobile responsiveness tested at all breakpoints
- [ ] Design tokens documented in code
- [ ] Component variations catalogued
- [ ] Browser compatibility verified