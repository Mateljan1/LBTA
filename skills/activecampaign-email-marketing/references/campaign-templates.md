# Campaign Templates

Pre-built campaign structures for common LBTA email marketing needs.

## Season Launch Campaign

**Use when:** Announcing Winter/Spring/Summer/Fall registration

**Timeline:** 4-6 weeks before season start

**Template:** `assets/templates/season-launch.html`

### Email Structure
1. **Hero**: Season name + start date + hero image
2. **Overview**: What's new this season (2-3 paragraphs)
3. **Programs Grid**: Visual cards for Junior/Adult/High Performance
4. **Pricing Table**: From `/data/*.json` - NEVER hardcode
5. **Early Bird CTA**: Deadline + discount amount
6. **Schedule Preview**: Link to full schedule page
7. **Footer**: Contact + social + unsubscribe

### Subject Line Examples
- "Winter Classes Start January 5th"
- "Spring 2026 Registration Now Open"
- "Summer Tennis Returns June 15th"

### Segmentation
- **All Contacts** - Full announcement
- **Past Students** - "Welcome back" personalization
- **Trial Leads** - Emphasis on trial-to-registration path

---

## JTT Announcement Campaign

**Use when:** Opening Junior Team Tennis registration

**Timeline:** 6 weeks before season start

**Template:** `assets/templates/jtt-announcement.html`

### Email Structure
1. **Hero**: "Spring JTT Registration Open" + team photo
2. **What is JTT**: Brief explanation for new families
3. **Key Dates**: Practices start, matches begin, playoffs
4. **Divisions**: 10U, 12U, 14U, 18U with descriptions
5. **Pricing**: $2,800/season, pay-in-full discount
6. **What's Included**: 3x/week practice, weekend matches, uniform
7. **Registration CTA**: Primary button
8. **FAQ Section**: Common questions answered
9. **Footer**: Standard

### Subject Line Examples
- "Spring JTT Registration Open — Join the Team"
- "Junior Team Tennis: 15 Weeks of Competition"
- "Build Your Game Through Team Tennis"

### Segmentation
- **Junior Parents (Ages 7-17)** - Primary audience
- **Past JTT Players** - "Register for another season"
- **Tournament Players** - Emphasize competitive development

---

## Camp Promotion Campaign

**Use when:** Promoting Ski Week, Spring Break, Summer camps

**Timeline:** 8-12 weeks before camp dates

**Template:** `assets/templates/camp-promotion.html`

### Email Structure
1. **Hero**: Camp name + dates + action photo
2. **Camp Overview**: What to expect (2 paragraphs)
3. **Daily Schedule**: Sample day breakdown
4. **What's Included**: Lunch, activities, coaching
5. **Pricing**: Per week + per day options
6. **Age Groups**: Which ages each camp serves
7. **Registration CTA**: "Reserve Your Spot"
8. **Safety Note**: (For Swim & Tennis: swimming requirement)
9. **Footer**: Standard

### Subject Line Examples
- "Summer Camps: 9 Weeks of Tennis + Swimming"
- "Ski Week Camp — February 16-20"
- "Spring Break Tennis Camp Registration Open"

### Segmentation
- **Junior Parents** - Primary audience
- **Past Camp Attendees** - "Join us again this year"
- **New Families** - Emphasize trial/intro options

---

## Monthly Newsletter

**Use when:** Monthly community update (first Tuesday of month)

**Timeline:** Monthly recurring

**Template:** `assets/templates/newsletter.html`

### Email Structure
1. **Hero**: Monthly greeting + seasonal image
2. **Academy Update**: What's happening this month
3. **Tennis News**: Pro tour insights (like Alcaraz-Ferrero story)
4. **Student Spotlight**: Success story or achievement
5. **Upcoming Events**: Next month's camps/clinics
6. **Community Section**: Local tennis news
7. **Quick Links**: Schedule, contact, social
8. **Footer**: Standard

### Subject Line Examples
- "January Newsletter: Winter Classes + Australian Open Preview"
- "Tennis News: Alcaraz's New Chapter + LBTA Updates"
- "This Month at LBTA: New Programs + Success Stories"

### Segmentation
- **All Active Contacts** - Full newsletter
- **Inactive Contacts** - Re-engagement version

---

## Trial Follow-up Sequence

**Use when:** Contact books trial lesson

**Timeline:** 4 emails over 14 days

**Template:** `assets/templates/trial-followup.html`

### Email 1: Pre-Trial (Day 0 - Immediate)
**Subject:** "Your Trial Lesson Confirmation — What to Expect"

**Content:**
- Confirmation of date/time/location
- What to bring (racquet, water, athletic clothes)
- Where to park
- Meet your coach (photo + bio)
- What happens during trial
- Contact for questions

### Email 2: Post-Trial Thank You (Day 1)
**Subject:** "Thank You for Trying LBTA — How Was Your Experience?"

**Content:**
- Thank you message
- Feedback request (link to survey)
- Recap of what was covered
- Next steps: program recommendations
- Limited-time offer (if applicable)
- Schedule consultation CTA

### Email 3: Program Recommendations (Day 5)
**Subject:** "Recommended Programs Based on Your Trial"

**Content:**
- Personalized program suggestions
- Pricing for recommended programs
- Success stories from similar students
- Schedule options
- Early bird deadline reminder
- Registration CTA

### Email 4: Final Reminder (Day 10)
**Subject:** "Spots Filling Up — Register Before [Deadline]"

**Content:**
- Urgency: Limited spots remaining
- Early bird deadline approaching
- Scholarship info (if applicable)
- One-click registration link
- Alternative: Book another trial
- Contact for questions

### Segmentation
- Trigger: Contact books trial via `/book` page
- Stop: Contact registers for program

---

## Re-engagement Campaign

**Use when:** Contact inactive for 90+ days

**Timeline:** 3 emails over 30 days

**Template:** `assets/templates/reengagement.html`

### Email 1: "We Miss You" (Day 0)
**Subject:** "We'd Love to See You Back on the Courts"

**Content:**
- Personal message from Andrew
- What's new since they left
- Current program offerings
- Special comeback offer (if applicable)
- Easy re-registration process

### Email 2: Success Stories (Day 14)
**Subject:** "See What Our Students Are Achieving"

**Content:**
- 2-3 student success stories
- Program improvements/additions
- New coaches or facilities
- Community highlights
- Soft CTA: "Explore Programs"

### Email 3: Final Offer (Day 30)
**Subject:** "Last Chance: Special Rate for Returning Students"

**Content:**
- Exclusive discount for returning students
- Deadline for offer
- Simple registration process
- Alternative: Book free consultation
- Unsubscribe option clearly stated

### Segmentation
- **Inactive 90+ days** - Start sequence
- **Inactive 180+ days** - More aggressive discount
- **Stop if:** Contact opens/clicks, or explicitly unsubscribes

---

## Event Invitation Campaign

**Use when:** Hosting clinic, showcase, or special event

**Timeline:** 3-4 weeks before event

**Template:** `assets/templates/event-invitation.html`

### Email Structure
1. **Hero**: Event name + date + compelling image
2. **What**: Event description (2 paragraphs)
3. **When**: Date, time, duration
4. **Where**: Location + parking info
5. **Who**: Target audience (ages, skill levels)
6. **Why**: Benefits of attending
7. **Cost**: Pricing (if applicable)
8. **Registration CTA**: "Reserve Your Spot"
9. **FAQ**: Common questions
10. **Footer**: Standard

### Subject Line Examples
- "You're Invited: High Performance Showcase — March 15th"
- "Free Clinic: Serve Technique Workshop"
- "Parent Night: College Tennis Recruiting 101"

### Segmentation
- **By Program Type**: Junior/Adult/High Performance
- **By Skill Level**: Beginner/Intermediate/Advanced
- **By Interest**: Tournament players, college-bound, etc.

---

## Abandoned Registration Campaign

**Use when:** Contact starts but doesn't complete registration

**Timeline:** 3 emails over 3 days

**Template:** `assets/templates/abandoned-registration.html`

### Email 1: Reminder (1 hour after abandonment)
**Subject:** "Complete Your Registration — Your Spot is Waiting"

**Content:**
- Friendly reminder
- One-click return to registration
- Program details recap
- Contact for help

### Email 2: Testimonial (24 hours)
**Subject:** "See Why Families Choose LBTA"

**Content:**
- Parent testimonial
- Student success story
- Program benefits
- Registration CTA
- Offer help: "Questions? Call us"

### Email 3: Scholarship Info (3 days)
**Subject:** "Financial Assistance Available — Don't Let Cost Be a Barrier"

**Content:**
- Scholarship information
- Payment plan options
- Sibling discounts
- Multi-program discounts
- Final CTA: Complete registration
- Alternative: Schedule call to discuss options

### Segmentation
- Trigger: Contact starts registration form but doesn't submit
- Stop: Contact completes registration
- Exclude: Contacts who explicitly closed form

---

## Automation Triggers

### Welcome Series
**Trigger:** Contact subscribes to newsletter
**Emails:** 3 over 7 days
**Goal:** Educate + drive trial booking

### Trial Nurture
**Trigger:** Contact books trial
**Emails:** 4 over 14 days
**Goal:** Convert trial to registration

### Registration Confirmation
**Trigger:** Contact completes registration
**Emails:** 1 immediate
**Goal:** Confirm + provide next steps

### Pre-Season Reminder
**Trigger:** 1 week before season starts
**Emails:** 1
**Goal:** Remind of start date + what to bring

### Birthday Email
**Trigger:** Contact's birthday (or child's birthday)
**Emails:** 1
**Goal:** Personal touch + special offer

---

## A/B Testing Recommendations

### Subject Lines
Test variations of:
- **Question vs. Statement**: "Ready for Winter Tennis?" vs. "Winter Tennis Starts January 5th"
- **Urgency vs. Benefit**: "Last Chance to Register" vs. "Join the Best Tennis Academy"
- **Personalization**: "John, Winter Classes Start Soon" vs. "Winter Classes Start Soon"

### CTAs
Test variations of:
- **Action-oriented**: "Register Now" vs. "Book Your Spot" vs. "Start Training"
- **Color**: Black vs. White background
- **Position**: Above fold vs. below fold
- **Size**: Large prominent vs. subtle inline

### Content Length
Test variations of:
- **Short**: 200-300 words, single CTA
- **Medium**: 400-600 words, multiple CTAs
- **Long**: 800+ words, detailed information

### Send Time
Test variations of:
- **Morning**: 9-11am PST
- **Afternoon**: 2-4pm PST
- **Evening**: 6-8pm PST
- **Day**: Tuesday vs. Thursday vs. Saturday

---

## Performance Benchmarks

### Industry Standards (Tennis/Sports)
- **Open Rate**: 20-25%
- **Click Rate**: 2-4%
- **Unsubscribe Rate**: <0.5%
- **Bounce Rate**: <2%

### LBTA Targets
- **Open Rate**: 25-30% (higher due to engaged community)
- **Click Rate**: 3-5%
- **Conversion Rate**: 5-10% (trial booking or registration)
- **Unsubscribe Rate**: <0.3%

### What to Optimize
- **Low Opens**: Improve subject lines, sender name, send time
- **Low Clicks**: Improve CTA prominence, content relevance, visual hierarchy
- **High Unsubscribes**: Reduce frequency, improve segmentation, check tone
- **Low Conversions**: Simplify registration process, improve offer clarity, add urgency

