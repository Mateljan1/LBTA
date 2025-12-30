# 08 - A/B TESTING METHODOLOGY & STATISTICAL RIGOR

## A/B Testing Framework

Proper A/B testing requires statistical rigor, not hunches.

---

## SAMPLE SIZE CALCULATOR

### Formula
```
n = (2 × Zα/2 + Zβ)² × (p × (1-p)) / (p₁ - p₂)²

Where:
- Zα/2 = 1.96 (95% confidence interval)
- Zβ = 0.84 (80% statistical power)
- p = baseline conversion rate
- p₁ - p₂ = expected improvement
```

### Quick Reference Table

| Baseline | Expected Lift | Sample Size Per Variant |
|----------|---------------|------------------------|
| 1% | +0.5% | 100,000+ |
| 2% | +20% | 20,000 |
| 5% | +20% | 7,500 |
| 10% | +20% | 3,500 |
| 20% | +20% | 1,700 |
| 30% | +20% | 1,100 |
| 50% | +20% | 700 |

### Example Calculation
**Scenario:** 10% current conversion, targeting +20% lift (12% new rate)

Sample size needed: 3,500 per variant
Total visitors needed: 3,500 × 2 variants = 7,000

At 2,000 visitors/month: 3.5 month test duration (too long)
At 5,000 visitors/month: 1.4 months (acceptable)

---

## TEST DURATION

### Minimum Duration: 2 Weeks
- Week 1: Stabilize traffic patterns
- Week 2: Confirm statistical significance
- Never stop test after 1 week (false positives)

### Avoid Day-of-Week Bias
- Monday visitors ≠ Friday visitors
- Run at least 2 full weeks to capture both
- Capture at least 2 full cycles of weekday + weekend

### Avoid Novelty Effect
- New design gets initial curiosity boost
- Wears off after 1-2 weeks
- Allow 2+ weeks for stabilization

### Maximum Duration
- Don't run indefinitely (analysis paralysis)
- Stopping rule: Hit sample size + 2 weeks minimum
- Then analyze and declare winner/no winner

---

## SUCCESS METRICS

### Primary Metric (One Only)
- Conversion rate (what we're trying to improve)
- Revenue per visitor (if testing upsell)
- Click-through rate (if testing navigation)
- NOT multiple metrics (avoid false positives)

### Secondary Metrics (Monitor, Don't Declare Winners)
- Bounce rate (did we hurt engagement?)
- Time on site (did we confuse users?)
- Pages per session (did we improve exploration?)
- Customer satisfaction (if surveyable)

### What NOT to Measure
- ❌ Page views (often inversely correlated with conversion)
- ❌ Time on page (longer ≠ better)
- ❌ Engagement metrics alone (must connect to revenue)

---

## STATISTICAL CONFIDENCE

### Confidence Level: 95%
- 95% chance the observed difference is real
- 5% chance it's due to random variation
- Standard in conversion optimization

### Statistical Power: 80%
- 80% chance of detecting real difference if it exists
- 20% false negative rate (miss real winners)
- Acceptable tradeoff between Type I and Type II error

### Interpreting Results

**If p-value < 0.05:**
- Statistically significant at 95% confidence
- Declare winner (if sample size met)
- Implement winning variation

**If p-value > 0.05:**
- No statistical significance
- Not enough data, run longer
- Don't declare winner prematurely

**Beware of False Positives:**
- If you run 20 tests, 1 will likely show false positive (5%)
- Use sequential testing to reduce false positives
- Focus on tests with highest potential impact

---

## A/B TEST PRIORITY FRAMEWORK

### Impact × Effort Matrix

```
HIGH IMPACT, LOW EFFORT (Do First):
- Homepage value proposition rewrite
- CTA button color/copy change
- Form field reduction
- Testimonials addition
- Price anchor adjustment

MEDIUM IMPACT, MEDIUM EFFORT (Do Second):
- Landing page redesign
- Checkout flow optimization
- Email sequence testing
- Ad copy variations
- Navigation reorganization

HIGH IMPACT, HIGH EFFORT (Do Last):
- Complete site redesign
- New product/feature launch
- Pricing model change
- Analytics infrastructure rebuild
```

---

## TEST ANATOMY

### Test Hypothesis
**Format:** "If [change], then [expected result], because [reason]"

**Good:** "If we highlight the guarantee with a badge, then conversion will increase 15%, because people fear purchase risk and the badge removes anxiety."

**Bad:** "Test if color matters" (no specific hypothesis)

### Control vs Variant
- **Control:** Current version (baseline)
- **Variant A:** Single change (isolate variable)
- **Only change ONE thing per test** (if 2+ change, can't determine which caused result)

### Example (Good - One Variable)
```
Control: "Get Started" button (blue)
Variant: "Claim Your Spot" button (green)
Change: Copy + color (okay to change together if they're unified message)
```

### Example (Bad - Multiple Variables)
```
Control: Blue "Get Started" button, small text
Variant: Green "Claim Your Spot" button, large text
Problem: Can't tell if improvement from color, copy, or size
```

---

## SEQUENTIAL TESTING (Optional, Advanced)

Sequential testing allows you to stop early if:
1. Winner is clear (even before 2 weeks)
2. No winner is likely (stop wasting traffic)

**Requires:** Online calculator or statistical software
**Benefit:** Reduce test duration by 30-50%
**Tradeoff:** Slightly higher false positive rate (still < 5%)

---

## COMMON A/B TEST IDEAS

### Homepage Tests
1. **Value proposition rewrite** (specific benefit vs vague)
   - Expected lift: +10-20%
   - Time to implement: 1 day
   - Impact: Very high

2. **Above-the-fold image swap**
   - Expected lift: +5-15%
   - Time: 1 day
   - Impact: Medium

3. **CTA button text**
   - Expected lift: +5-10%
   - Time: 1 day
   - Impact: Medium

### Form Optimization Tests
1. **Reduce form fields** (3 vs 5 fields)
   - Expected lift: +20-40%
   - Time: 1 day
   - Impact: Very high

2. **Single-step vs multi-step form**
   - Expected lift: +10-20%
   - Time: 2-3 days
   - Impact: Very high

3. **Email field first vs name field first**
   - Expected lift: +2-5%
   - Time: 1 day
   - Impact: Low

### Pricing Tests
1. **Pricing page redesign** (add decoy tier)
   - Expected lift: +20-40% (revenue)
   - Time: 2 days
   - Impact: Very high

2. **Annual vs monthly pricing display** (annual first)
   - Expected lift: +15-25%
   - Time: 1 day
   - Impact: High

3. **Add price anchor** ("Was $X, now $Y")
   - Expected lift: +10-15%
   - Time: 1 day
   - Impact: High

### Copy Tests
1. **Benefit-driven headline** vs feature-driven
   - Expected lift: +10-20%
   - Time: 1 day
   - Impact: Very high

2. **Specific testimonial** vs generic
   - Expected lift: +5-15%
   - Time: 1 day
   - Impact: High

3. **Loss aversion** vs gain framing
   - Expected lift: +8-15%
   - Time: 1 day
   - Impact: Medium

---

## 90-DAY A/B TEST ROADMAP

### Months 1: Quick Wins
**Tests 1-5 (5 tests × 2 weeks = 10 weeks, parallelized to month 1)**

High-impact, low-effort tests:
1. Homepage headline rewrite
2. CTA button copy optimization
3. Form field reduction
4. Pricing page decoy addition
5. Testimonial specificity improvement

Expected cumulative lift: +50-100% revenue impact

### Month 2: Medium Difficulty
**Tests 6-10**

Medium-impact, medium-effort tests:
6. Landing page layout redesign
7. Email sequence optimization
8. Guarantee/scarcity messaging
9. Mobile form optimization
10. Add trust signals (guarantees, credentials)

Expected cumulative lift: +20-50% additional impact

### Month 3: Infrastructure & Learning
**Tests 11-15 + Analysis**

11. Checkout flow optimization
12. Product page layout
13. Social proof placement
14. FAQ section effectiveness
15. Ad-to-page messaging match

Analyze cumulative results, document learnings, prioritize next 90 days.

---

## A/B TESTING TOOLS

### Basic (Free/Cheap)
- Google Analytics experiments
- Optimizely free tier
- Convert.com free tier

### Advanced (Paid)
- Optimizely
- VWO (Visual Website Optimizer)
- Convert.com
- Unbounce
- Instapage

### Statistical Analysis
- Sample Size Calculator (online)
- Sequential testing tools
- Stats spreadsheets (template available)

---

## IMPLEMENTATION CHECKLIST

- [ ] Hypothesis clearly stated
- [ ] Sample size calculated (not guessed)
- [ ] Test duration set (minimum 2 weeks)
- [ ] Control and variant clearly defined
- [ ] One variable changed per test
- [ ] Success metric defined
- [ ] Statistical confidence set to 95%
- [ ] Testing tool configured
- [ ] Tracking verified (pixel fires correctly)
- [ ] Test monitoring plan (daily check-ins)
- [ ] Stopping rule defined (sample size + 2 weeks)
- [ ] Winning variant ready to deploy
- [ ] Results documented and learned from