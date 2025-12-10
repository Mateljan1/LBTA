# 12 - DEVELOPER INTEGRATION: CURSOR RULES, CLAUDE PROMPTS & CONTEXT 7

## CURSOR RULES (.cursorules file)

Copy this entire section into `.cursorules` file in your project root. Cursor will automatically apply these rules to all coding tasks.

```
# Research Engine Omega: Production Standards

## PROJECT CONTEXT
This project uses Research Engine Omega audit framework for website optimization.
All development must follow these standards for consistency.

## CORE PRINCIPLES
1. Responsive first: Mobile 320px, Tablet 768px, Desktop 1024px
2. Accessibility WCAG 2.1 AAA: 7:1 contrast, keyboard nav, semantic HTML
3. Performance: LCP < 2.5s, CLS < 0.1, no browser storage
4. Design system: Max 11 colors, 2 fonts, 40%+ white space
5. Zero placeholders: Every text, image, form is production-ready

## CODE STANDARDS

### HTML
- Semantic tags: <button>, <nav>, <header>, <main>, <section>
- Every <input> has associated <label for="id">
- All images have alt text (descriptive, < 125 chars)
- No inline event handlers (use event listeners)
- Form labels required, not placeholder-only

### CSS
- CSS variables for all colors (from design system)
- Mobile-first approach: base styles, then media queries
- Box-sizing: border-box on all elements
- No magic numbers: use spacing scale (8px base unit)
- Max specificity: classes over IDs
- Focus indicators visible (outline: 2px)

### JavaScript
- ES6+ syntax: const/let, arrow functions, template literals
- Input validation before submission
- Prevent default on form submission
- No localStorage, sessionStorage (security sandbox)
- Debounce expensive operations (scroll, resize)
- Error handling: try/catch, user-friendly messages

### Responsive Design
- Media queries: @media (min-width: 768px), @media (min-width: 1024px)
- Touch targets: 44×44px minimum (mobile)
- Fonts: 14px minimum (body text)
- No horizontal scroll (ever)
- Flexible units: %, em, rem (not hard px)

### Accessibility
- Color contrast: 7:1 for body text
- Keyboard navigation: Tab order logical
- Focus states: Always visible
- ARIA: Use aria-label, aria-describedby where needed
- Test with: Lighthouse, axe DevTools, screen reader

### Performance
- Images: Compress, use WebP format
- JavaScript: Minimize, defer non-critical, no blocking
- CSS: Minify, critical CSS inline
- Fonts: System fonts or web-safe only (avoid slow CDN)
- No auto-play media (video, audio)

## DESIGN SYSTEM APPLICATION
- Color palette: Teal (#2180), Charcoal (#134252), Cream (#FCFCF9)
- Fonts: Serif (headlines), Sans-serif (body)
- Spacing: 8px increments (8, 16, 24, 32, 48, 64px)
- Typography: H1 48px, H2 36px, H3 24px, Body 16px
- Borders: 4px (small), 8px (medium), 12px (large)

## DEPLOYMENT CHECKLIST
- [ ] All pages responsive (320px, 768px, 1024px tested)
- [ ] Lighthouse score 90+ (Performance, Accessibility, Best Practices, SEO)
- [ ] Contrast 7:1 verified (WebAIM Contrast Checker)
- [ ] Keyboard navigation tested (Tab through entire site)
- [ ] Form validation present
- [ ] No console errors
- [ ] Images optimized (< 500KB)
- [ ] No autofocus (accessibility)
- [ ] Skip-to-main link included

## AUDIT COMPLIANCE
When building for audit:
- Every change tied to audit recommendation
- Document which dimension improved
- Track revenue impact metric
- A/B test where specified
- Measure baseline before → after changes
```

---

## CLAUDE PROMPT FOR WEBSITE AUDITS

Copy this prompt when asking Claude to analyze or audit a website:

```
You are Research Engine Omega, an expert website audit system.

TASK: Audit [WEBSITE URL] across 12 dimensions and provide specific, revenue-focused recommendations.

AUDIT FRAMEWORK (Score each 0-100):

1. NARRATIVE ALIGNMENT - Does homepage match paid ads? Is founder story visible? Brand promise consistent?

2. LUXURY PERCEPTION - White space 40%+? Colors < 11? Serif + sans-serif fonts? Every element earns place?

3. CONVERSION FUNNEL (MECLABS) - Motivation clear? Value specific? Incentive real? Friction minimized? Anxiety addressed?

4. UX FLOW & JOURNEY - Architecture intuitive? Forms optimized? Mobile excellent?

5. PAGE-LEVEL CRO - Homepage strategic? Landing pages relevant? Pricing psychological? Checkout optimized?

6. CORE WEB VITALS - LCP < 2.5s? CLS < 0.1? Mobile performance good?

7. SEO AUTHORITY - Keywords owned/achievable? E-E-A-T signals? Content fresh? Backlinks present?

8. MESSAGING & COPY - Value proposition specific? Audience segmented? Copy scannable? Objections addressed?

9. TRUST & SOCIAL PROOF - Credibility hierarchy? Testimonials specific? Guarantees clear?

10. MOBILE EXPERIENCE - Responsive design? Touch targets 44×44px? Text readable? No horizontal scroll?

11. ACCESSIBILITY (WCAG) - Contrast 7:1? Keyboard nav complete? Semantic HTML? Alt text present?

12. A/B TEST OPPORTUNITIES - What should be tested first? Sample size calculated? Expected lift?

FOR EACH DIMENSION:
- Score 0-100 with evidence
- Identify the specific problem
- Provide exact recommendation (not vague advice)
- Estimate revenue impact: "$X/month from Y% lift"
- Confidence level: CERTAIN / PROBABLE / HYPOTHESIS

COMPETITIVE BENCHMARKING:
- Identify 5-7 direct competitors
- Score each dimension (quick scores okay)
- Create competitive matrix
- Show where we're strongest/weakest
- Identify positioning gaps

PRIORITIZATION:
- Rank by impact × effort
- Quick wins (< 1 week, high impact)
- Medium effort (2-4 weeks, strategic)
- Long-term (complex, very high impact)

OUTPUT FORMAT:
## EXECUTIVE SUMMARY
[Overall score, top 3 opportunities, total revenue opportunity]

## DIMENSION SCORES
[All 12 dimensions with evidence and specific recommendations]

## COMPETITIVE MATRIX
[Table showing us vs 5-7 competitors]

## IMPLEMENTATION ROADMAP
[Week 1-4 specific actions, responsible party, expected impact]

## REVENUE IMPACT
[Total monthly opportunity, timeline, confidence level]
```

---

## CONTEXT 7 INTEGRATION

If using Context 7 for semantic search and knowledge retrieval:

### Step 1: Create `.context7` file in project root

```json
{
  "name": "Research Engine Omega",
  "version": "2.0",
  "description": "Universal website audit system for any brand, any industry",
  "knowledge_files": [
    {
      "file": "01-UX-CRO-Conversion-Framework.md",
      "category": "conversion",
      "priority": "high"
    },
    {
      "file": "02-Technical-SEO-Web-Vitals.md",
      "category": "technical",
      "priority": "high"
    },
    {
      "file": "03-Service-Blueprint-Journey-Mapping.md",
      "category": "ux",
      "priority": "high"
    },
    {
      "file": "04-Behavioral-Economics-Applied.md",
      "category": "psychology",
      "priority": "high"
    },
    {
      "file": "05-Design-Systems-Components.md",
      "category": "design",
      "priority": "high"
    },
    {
      "file": "06-Luxury-Perception-Architecture.md",
      "category": "design",
      "priority": "high"
    },
    {
      "file": "07-Accessibility-Inclusive-Design.md",
      "category": "accessibility",
      "priority": "high"
    },
    {
      "file": "08-AB-Testing-Statistical-Rigor.md",
      "category": "testing",
      "priority": "high"
    },
    {
      "file": "09-Website-Audit-Engine-Master.md",
      "category": "framework",
      "priority": "critical"
    },
    {
      "file": "10-Brand-Narrative-Messaging-Alignment.md",
      "category": "messaging",
      "priority": "high"
    },
    {
      "file": "11-Paid-Ads-Website-Continuity.md",
      "category": "marketing",
      "priority": "high"
    },
    {
      "file": "12-Developer-Integration.md",
      "category": "development",
      "priority": "high"
    }
  ],
  "search_queries": [
    "conversion rate optimization",
    "website audit",
    "A/B testing",
    "mobile optimization",
    "accessibility WCAG",
    "luxury design",
    "UX flow",
    "messaging",
    "paid ads",
    "revenue impact",
    "persona",
    "behavioral economics",
    "form optimization",
    "trustworthiness signals",
    "SEO authority"
  ]
}
```

### Step 2: Use Context 7 in Development

**Example Query:** "How should we optimize this form?"
Context 7 automatically pulls relevant sections from knowledge files.

**Example Query:** "What's the luxury design standard for white space?"
Returns File 06 sections on luxury perception.

**Example Query:** "How do we calculate revenue impact?"
Returns formula from File 09 audit framework.

---

## CLAUDE PROMPT FOR CODE REVIEW

```
Review this code against Research Engine Omega standards:

CHECKLIST:
- [ ] Mobile-first responsive (320px, 768px, 1024px)
- [ ] Accessibility WCAG 2.1 AAA (7:1 contrast, keyboard nav, semantic HTML)
- [ ] Performance optimized (LCP < 2.5s, no layout shifts)
- [ ] Design system applied (colors, spacing, typography)
- [ ] Forms fully validated
- [ ] No browser storage (localStorage/sessionStorage)
- [ ] Semantic HTML tags used (<button>, <nav>, <label>)
- [ ] Alt text on all images
- [ ] Error handling present
- [ ] User-friendly error messages
- [ ] Focus indicators visible
- [ ] Touch targets 44×44px minimum

PROVIDE:
1. Compliance score (0-100)
2. Critical issues (must fix)
3. Recommendations (should improve)
4. Accessibility gaps
5. Performance optimizations
6. Design system violations
```

---

## IMPLEMENTATION CHECKLIST

- [ ] .cursorules file created in project root
- [ ] Cursor rules reviewed and customized for brand
- [ ] Claude audit prompt saved and bookmarked
- [ ] Context 7 .context7 file created
- [ ] Team trained on Cursor rules
- [ ] Code review process includes Research Engine Omega check
- [ ] Design system constants defined in CSS variables
- [ ] Responsive breakpoints set (320, 768, 1024)
- [ ] Accessibility testing tools installed (axe, Lighthouse, WAVE)
- [ ] Audit framework integrated into project workflow
- [ ] Revenue tracking setup (conversion metrics)
- [ ] A/B testing tool configured