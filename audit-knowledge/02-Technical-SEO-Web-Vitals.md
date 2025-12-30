# 02 - TECHNICAL SEO & WEB VITALS AUTHORITY

## Core Web Vitals (Google's Ranking Signals)

### LCP: Largest Contentful Paint (< 2.5 seconds)
**What it measures:** Time until the largest visible element loads

**Optimization:**
- Server response time < 200ms
- Minimize main thread work (JavaScript)
- Lazy load below-fold images
- Use CDN for static assets
- Optimize images (WebP format, compression)
- Preload critical resources

**Testing:**
- Google PageSpeed Insights
- WebPageTest
- Lighthouse in DevTools

---

### FID/INP: Interaction to Next Paint (< 100ms)
**What it measures:** Delay between user input and response

**Optimization:**
- Break up long JavaScript tasks (> 50ms)
- Defer non-critical JavaScript
- Use Web Workers for heavy computation
- Prioritize main thread for user interactions
- Minimize CSS parsing time

---

### CLS: Cumulative Layout Shift (< 0.1)
**What it measures:** Unexpected layout changes during page load

**Optimization:**
- Reserve space for images/videos (aspect ratio)
- Avoid inserting content above existing content
- Use transform animations (not top/left changes)
- Keep font fallbacks similar size
- Batch DOM writes

---

## E-E-A-T Signals (Google Ranking Factors)

**Experience:** Has the creator personal experience with the topic?
- Founder background visible
- Years of experience stated
- Real results from real people

**Expertise:** Is the creator knowledgeable?
- Certifications displayed
- Educational background shown
- Third-party credentials verified

**Authority:** Is the site recognized as authoritative?
- Backlinks from reputable sources
- Mentioned in industry publications
- Partnership with recognized brands

**Trustworthiness:** Can visitors trust the information?
- Contact information visible
- Author credentials clear
- "About Us" section comprehensive
- Privacy policy present

---

## On-Page SEO Fundamentals

### Title Tag (50-60 characters)
- Keyword first (primary keyword)
- Brand name last
- Benefit-driven, not keyword-stuffed
- Example: "Tennis Training for Adults 30+ | Join 2,400+ Students"

### Meta Description (150-160 characters)
- Include primary keyword
- Call-to-action
- Specific benefit statement
- Example: "Improve your tennis game with expert coaching. Join 2,400+ adults in our structured 12-week program. Start today."

### H1 Heading (One per page)
- Matches title tag generally
- Not keyword-stuffed
- User benefit focused

### H2/H3 Hierarchy
- Logical structure (H1 → H2 → H3)
- Keyword inclusion (natural, not forced)
- Scannable content architecture

### Keyword Targeting Strategy
- Primary keyword: 1-2% density (natural)
- LSI keywords: Semantically related terms
- User intent matching: What problem does this solve?

### Content Quality Standards
- Minimum 1,500 words for pillar pages
- Original research preferred
- Regular updates (freshness signals)
- Multimedia (images, videos, infographics)

---

## Technical SEO Checklist

### Core Architecture
- [ ] XML sitemap submitted to Google Search Console
- [ ] Robots.txt properly configured
- [ ] Canonical tags implemented (self-referential on unique pages)
- [ ] URL structure logical (readable, keyword-included)
- [ ] HTTPS enforced (no mixed content)
- [ ] Mobile-first indexing configured

### Internal Linking
- [ ] Navigation logical and intuitive
- [ ] 3-4 internal links per page (contextual)
- [ ] Anchor text descriptive (not "click here")
- [ ] Orphan pages linked (not isolated)

### Speed Optimization
- [ ] Minified CSS/JavaScript
- [ ] Image optimization (format, size)
- [ ] Caching enabled (browser, server)
- [ ] CDN implemented
- [ ] Code splitting for JavaScript bundles

### Mobile Optimization
- [ ] Responsive design (not mobile separate)
- [ ] Touch targets 44×44px minimum
- [ ] Text readable without zoom
- [ ] No horizontal scroll
- [ ] Viewport meta tag correct

### Structured Data (Schema Markup)
- [ ] Organization schema (company details)
- [ ] LocalBusiness schema (address, phone, hours)
- [ ] Product/Service schema (for e-commerce)
- [ ] Review/Rating schema (testimonials)
- [ ] FAQ schema (rich snippets)

---

## Backlink Strategy

### Quality Over Quantity
- One backlink from authority site (DA 50+) > 10 from low-quality sites
- Relevance matters: Link from tennis site > random directory

### Link Building Tactics
1. **Relationship-based:** Industry partnerships, blogger outreach
2. **Content-based:** Create valuable content worth linking to
3. **Broken link:** Find broken links to competitor, replace with your resource
4. **HARO:** Help A Reporter Out (answer expert requests)

### Backlink Quality Signals
- Editorial link (not paid)
- From topically relevant site
- Anchor text relevant (not branded)
- Link in content body (not sidebar)
- From established site (2+ years old)

---

## Local SEO (If Applicable)

### Google Business Profile
- [ ] Claim and verify your listing
- [ ] Accurate name, address, phone
- [ ] Business description (200 characters)
- [ ] Service areas defined
- [ ] Hours updated
- [ ] Photos uploaded (10+ minimum)
- [ ] Posts/updates regular

### Local Signals
- [ ] Local backlinks (chamber of commerce, local directories)
- [ ] Local reviews (Google, Yelp)
- [ ] Local citations (name, address, phone consistent)
- [ ] NAP consistency (exact match across web)

---

## Competitor SEO Analysis

### Traffic Estimation
- Use SEMrush/Ahrefs to estimate competitor organic traffic
- Identify top-performing pages
- Analyze keyword rankings

### Content Gap Analysis
1. List competitor's top 20 ranking keywords
2. Check if you rank for each
3. Identify gaps (keywords they rank for, you don't)
4. Create content for gaps

### Backlink Profile
- Identify competitor's backlink sources
- Find high-authority links
- Pitch for your own links (similar sites)

---

## Ongoing Optimization

### Monthly Tasks
- [ ] Monitor Core Web Vitals (PageSpeed Insights)
- [ ] Check ranking positions (15 target keywords)
- [ ] Review Google Search Console (impressions, clicks, CTR)
- [ ] Analyze traffic sources (organic, paid, direct)

### Quarterly Tasks
- [ ] Update top 5 performing pages (add new data, refresh)
- [ ] Competitive analysis (re-check top 5 competitors)
- [ ] Backlink analysis (new links gained/lost)
- [ ] Content audit (identify underperforming pages)

### Annual Tasks
- [ ] Complete technical audit
- [ ] Content strategy review
- [ ] Backlink strategy evaluation
- [ ] E-E-A-T assessment

---

## Implementation Checklist

- [ ] Core Web Vitals optimized (LCP, FID/INP, CLS)
- [ ] E-E-A-T signals prominent (credentials, authority, trust)
- [ ] Title tags optimized (keyword-first, benefit-driven)
- [ ] Meta descriptions present and compelling
- [ ] H1 hierarchy correct (one H1, logical H2/H3)
- [ ] Internal linking strategy implemented (3-4 links/page)
- [ ] Mobile experience fully optimized
- [ ] Schema markup implemented (organization, local, product)
- [ ] Backlink profile reviewed
- [ ] Competitor keyword gaps identified