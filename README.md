# Laguna Beach Tennis Academy

**Movement. Craft. Community.** — A premium tennis academy website built with Next.js 16, TypeScript, and Tailwind CSS.

Combining luxury restraint with California warmth and founder-led excellence.

## Brand Essence

### Positioning
- **NOT** a quiet spa experience
- **YES** ATP/WTA-level training with sophisticated presentation
- Small by design. Results-driven. Honest communication.

### Key Differentiators
- ATP/WTA coaching (currently coaching ATP #262 Karue Sell)
- 20+ D1 college placements since 2020
- Official City of Laguna Beach tennis partner since 2020
- Fit4Tennis platform: 100K+ users worldwide

## Site Architecture

### Core Pages
```
/                        → Home (video hero)
/about                   → About the academy
/coaches                 → Coach profiles
/coaches/andrew-mateljan → Founder profile
/schedules               → Programs, pricing, schedule (single source of truth)
/programs                → Program overview
/programs/junior         → Junior pathway
/programs/adult          → Adult training
/programs/high-performance → High performance
/programs/leagues        → League play
/camps                   → Camp information
/fitness                 → Fitness & community programs
/high-performance-pathway → High Performance Pathway landing
/racquet-rescue          → Racquet stringing services
/book                    → Trial booking
/contact                 → Contact form
/success-stories         → Player success stories
/philosophy              → Coaching philosophy
/faq                     → Frequently asked questions
/privacy                 → Privacy policy
/terms                   → Terms of service
```

### Campaign Landing Pages
```
/junior-trial            → Junior winter registration
/adult-trial             → Adult trial landing
/beginner-program        → Beginner program landing
/match-play              → Match play landing
/pathway-planner         → Program recommendation tool
/apply-scholarship       → Scholarship application
```

**Redirects:** `/schedule` and `/pricing` → `/schedules`.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (custom LBTA brand tokens)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Fonts**: Cormorant (serif display) + DM Sans (body)
- **Deployment**: Vercel
- **CRM**: ActiveCampaign

## Design System

### Colors (Tailwind brand tokens)

- **Text/Headings:** `brand-pacific-dusk` (#1B3A5C)
- **Primary CTA:** `brand-sunset-cliff` (#E8834A)
- **Links/Focus:** `brand-victoria-cove` (#2E8B8B)
- **Success/positive:** `brand-tide-pool` (#3A8B6E)
- **Warm sections:** `brand-sandstone` (#F5F0E5)
- **Default background:** `brand-morning-light` (#FAF8F4)
- **Dark sections:** `brand-deep-water` (#0F2237)
- **Prestige accent:** `brand-thousand-steps` (#C4963C) — used sparingly
- See `tailwind.config.ts` and `.cursorrules` Part 7 for the full 11-color palette.

### Typography

- **Headlines:** Cormorant (serif).
- **Body:** DM Sans (sans-serif).
- Never use: Playfair Display, Work Sans, Inter, Roboto, Arial, or Space Grotesk.

### Spacing

```css
Section Spacing: py-20 md:py-32 lg:py-40
Container: max-w-7xl with generous padding
Letter Spacing: 1.5px-3px for elegance
```

## Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Deployment to Vercel

### Quick Deploy

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Via Dashboard
1. Push to GitHub
2. Import to Vercel
3. Deploy automatically

## Content Overview

### Coaching Team
- Andrew Mateljan — Director & Head Coach, ATP/WTA Tour Coach, Founder
- Kevin Jackson — Head Coach & Performance Director, 25+ years, 3,000+ athletes
- Savriyan Danilov — High Performance Coach, ATP Pro #556
- Andy Wu — Program Coach, USPTA Certified, EdD
- Michelle Bevins — Youth Director, Red/Orange Ball Specialist

### Programs
- Junior Pathway (ages 3-17)
- Adult Training
- High Performance (invitation-only)
- Fitness & Community (Cardio Tennis, LiveBall)
- Camps (holiday and summer)
- Private Coaching

Pricing lives in `/data/*.json` files — never hardcode in components.

### Contact
- Phone: (949) 464-6645
- Email: support@lagunabeachtennisacademy.com
- Address: 1098 Balboa Ave, Laguna Beach, CA 92651
- Hours: Mon-Fri 7AM-9PM, Sat-Sun 8AM-6PM

## Accessibility

- Semantic HTML structure
- ARIA labels where needed
- Keyboard navigation
- Focus states on all interactive elements
- WCAG AA color contrast

## Performance

- Next.js Image optimization
- Font optimization via next/font
- Component code splitting
- Minimal JavaScript
- Target: 95+ Lighthouse score

## Conversion Strategy

**Primary CTA:** "Book a Trial" / "Book Free Trial"
- Links to: `/book` (on-site modal)

**Trust Builders:**
- Free trial (zero commitment)
- 30-day money-back guarantee
- Transparent pricing
- Real testimonials and ATP player showcases

## Customization

### Update Content

Page content lives in `app/` route components. Pricing and schedule data lives in `data/*.json` files (single source of truth).

### Update Colors

Edit `tailwind.config.ts` — use `brand-*` tokens for new code:

```typescript
colors: {
  brand: {
    'pacific-dusk': '#1B3A5C',
    'sunset-cliff': '#E8834A',
    'sandstone': '#F5F0E5',
    'morning-light': '#FAF8F4',
    // ... see .cursorrules Part 7 for full palette
  }
}
```

### Update Coaches

Edit coach data in `app/coaches/page.tsx`.

## Support

For questions:
- Email: support@lagunabeachtennisacademy.com
- Phone: (949) 464-6645

## License

© 2026 Laguna Beach Tennis Academy. All rights reserved.

---

**Built with restraint, precision, and commitment to excellence.**
