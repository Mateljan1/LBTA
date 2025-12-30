# Real-World Campaign Examples

Practical examples of creating email campaigns for LBTA using this skill.

---

## Example 1: Winter 2026 Registration Launch

**Scenario:** It's December 1st, 2025. Winter classes start January 5th. Early bird deadline is December 20th.

### Step 1: Create the Campaign

```bash
cd "/Users/andrew-mac-studio/LBTA Build 12:16/LBTA/skills/activecampaign-email-marketing"

python scripts/create_campaign.py \
  --name "Winter 2026 Registration Open" \
  --subject "Winter Classes Start January 5th — Save $50 by Dec 20th" \
  --template "assets/templates/season-launch.html" \
  --list "All Contacts"
```

### Step 2: Customize the Template

Before sending, edit `assets/templates/season-launch.html`:

1. **Update hero headline:**
   ```html
   <h1>Winter 2026<br>Classes Start January 5th</h1>
   ```

2. **Update early bird section:**
   ```html
   <p>Register by <strong>December 20th</strong> and receive $50 off...</p>
   ```

3. **Pull pricing from data:**
   ```javascript
   // Reference: /data/winter2026.json
   // Junior 1x/week: $546
   // Junior 2x/week: $1,092
   // Adult Intermediate 2x/week: $1,437
   ```

### Step 3: Send Test & Review

```bash
python scripts/send_test.py \
  --campaign-id 456 \
  --email andrew@lagunabeachtennisacademy.com
```

### Step 4: Schedule Send

**Best time:** Tuesday, December 3rd at 9:00 AM PST
**Why:** Tuesday has highest open rates, morning catches inbox before work

---

## Example 2: Spring JTT Registration

**Scenario:** It's December 15th. Spring JTT starts January 12th. Team registration deadline is January 16th.

### Step 1: Create Campaign

```bash
python scripts/create_campaign.py \
  --name "Spring 2026 JTT Registration" \
  --subject "Junior Team Tennis — 15 Weeks of Competition" \
  --template "assets/templates/jtt-announcement.html" \
  --list "Junior Parents"
```

### Step 2: Segment Your Audience

Only send to parents with kids ages 7-17:

```bash
# First, create a segment in ActiveCampaign:
# - Contact has custom field "child_age" between 7 and 17
# - OR Contact has tag "Junior Programs"
# - AND Contact opened email in last 90 days

# Then use that segment:
python scripts/create_campaign.py \
  --name "Spring 2026 JTT Registration" \
  --subject "Junior Team Tennis — Join the Team" \
  --template "assets/templates/jtt-announcement.html" \
  --list "Junior Parents (Ages 7-17)"
```

### Step 3: Personalize by Division

**In ActiveCampaign, create conditional content:**

```html
<!-- For ages 7-10 -->
%IF CHILD_AGE <= 10%
  <p>Your child is eligible for our 10 & Under division...</p>
%ENDIF%

<!-- For ages 11-12 -->
%IF CHILD_AGE >= 11 AND CHILD_AGE <= 12%
  <p>Your child is eligible for our 12U division...</p>
%ENDIF%
```

### Step 4: Schedule Send

**Best time:** Thursday, December 19th at 10:00 AM PST
**Follow-up:** Reminder email on January 10th (6 days before deadline)

---

## Example 3: Monthly Newsletter (January 2026)

**Scenario:** It's the first Tuesday of January. Time for the monthly newsletter.

### Step 1: Create Newsletter

```bash
python scripts/create_campaign.py \
  --name "January 2026 Newsletter" \
  --subject "January Newsletter: Winter Classes + Australian Open Preview" \
  --template "assets/templates/newsletter.html" \
  --list "All Contacts"
```

### Step 2: Customize Content Sections

Edit `assets/templates/newsletter.html`:

1. **Hero greeting:**
   ```html
   <h1>Happy New Year from<br>Our Family to Yours</h1>
   ```

2. **Academy update:**
   - Winter classes started January 5th
   - 150+ students enrolled
   - New coach spotlight: [Name]

3. **Tennis news:**
   - Australian Open preview (January 12-26)
   - Sinner vs. Alcaraz predictions
   - Key matches to watch

4. **Student spotlight:**
   - Feature a recent success story
   - Include photo and quote

5. **Upcoming events:**
   - Spring JTT registration (deadline Jan 16)
   - Presidents' Week camp (Feb 16-20)
   - Parent night: College recruiting (Feb 28)

### Step 3: Schedule Send

**Best time:** Tuesday, January 7th at 9:00 AM PST
**Frequency:** Monthly, first Tuesday

---

## Example 4: Trial Follow-up Sequence

**Scenario:** Parent books a trial lesson. Trigger automated follow-up sequence.

### Set Up Automation in ActiveCampaign

**Trigger:** Contact submits trial booking form

**Email 1: Pre-Trial (Immediate)**
```bash
Subject: Your Trial Lesson Confirmation — What to Expect
Template: Custom (see below)
Delay: Send immediately
```

**Email 2: Post-Trial Thank You (Day 1)**
```bash
Subject: Thank You for Trying LBTA — How Was Your Experience?
Template: Custom (see below)
Delay: 24 hours after trial date
```

**Email 3: Program Recommendations (Day 5)**
```bash
Subject: Recommended Programs Based on Your Trial
Template: Custom (see below)
Delay: 5 days after trial
```

**Email 4: Final Reminder (Day 10)**
```bash
Subject: Spots Filling Up — Register Before [Deadline]
Template: Custom (see below)
Delay: 10 days after trial
Stop: If contact registers
```

### Email 1 Template (Pre-Trial)

```html
<h1>Your Trial Lesson<br>Confirmation</h1>

<div class="details-box">
  <p><strong>Date:</strong> %TRIAL_DATE%</p>
  <p><strong>Time:</strong> %TRIAL_TIME%</p>
  <p><strong>Location:</strong> %TRIAL_LOCATION%</p>
  <p><strong>Coach:</strong> %TRIAL_COACH%</p>
</div>

<h2>What to Bring</h2>
<ul>
  <li>Tennis racquet (we have loaners if needed)</li>
  <li>Water bottle</li>
  <li>Athletic clothes and court shoes</li>
</ul>

<h2>What to Expect</h2>
<p>Your 30-minute trial lesson will include:</p>
<ul>
  <li>Assessment of current skill level</li>
  <li>Introduction to our coaching philosophy</li>
  <li>Personalized program recommendations</li>
</ul>

<a href="tel:9494646645" class="btn-primary">Questions? Call Us</a>
```

---

## Example 5: Re-engagement Campaign

**Scenario:** Contact hasn't opened an email in 90+ days. Time to win them back.

### Step 1: Create Segment

In ActiveCampaign:
- Contact has NOT opened email in last 90 days
- AND Contact was previously engaged (opened 3+ emails)
- Exclude: Current registered students

### Step 2: Email 1 - "We Miss You" (Day 0)

```bash
python scripts/create_campaign.py \
  --name "Re-engagement: We Miss You" \
  --subject "We'd Love to See You Back on the Courts" \
  --template "assets/templates/reengagement.html" \
  --list "Inactive 90+ Days"
```

**Content:**
- Personal message from Andrew
- What's new since they left
- Special comeback offer (10% off)
- Easy re-registration link

### Step 3: Email 2 - Success Stories (Day 14)

```bash
Subject: See What Our Students Are Achieving
```

**Content:**
- 2-3 recent success stories
- Program improvements
- New coaches or facilities
- Soft CTA: "Explore Programs"

### Step 4: Email 3 - Final Offer (Day 30)

```bash
Subject: Last Chance: 15% Off for Returning Students
```

**Content:**
- Exclusive discount (15% off)
- Deadline: 7 days
- Simple registration process
- Alternative: Book free consultation
- Clear unsubscribe option

---

## Example 6: Abandoned Registration Recovery

**Scenario:** Contact starts registration but doesn't complete. Recover the sale.

### Set Up Automation

**Trigger:** Contact visits `/schedules` page AND clicks "Register" but doesn't submit form

**Email 1: Reminder (1 hour)**
```bash
Subject: Complete Your Registration — Your Spot is Waiting
Delay: 1 hour after abandonment
```

**Email 2: Testimonial (24 hours)**
```bash
Subject: See Why Families Choose LBTA
Delay: 24 hours
```

**Email 3: Scholarship Info (3 days)**
```bash
Subject: Financial Assistance Available — Don't Let Cost Be a Barrier
Delay: 3 days
Stop: If contact completes registration
```

### Email 1 Template

```html
<h1>Complete Your<br>Registration</h1>

<p>We noticed you started registering for %PROGRAM_NAME% but didn't finish. Your spot is still available!</p>

<div class="program-summary">
  <h3>%PROGRAM_NAME%</h3>
  <p>%PROGRAM_DAYS% · %PROGRAM_TIME%</p>
  <p><strong>%PROGRAM_PRICE%</strong></p>
</div>

<a href="%REGISTRATION_LINK%" class="btn-primary">Complete Registration</a>

<p style="margin-top: 32px;">
  <strong>Need help?</strong><br>
  Call us at (949) 464-6645 or reply to this email.
</p>
```

---

## Example 7: Camp Promotion (Summer Camps)

**Scenario:** It's March 15th. Summer camps start June 15th. Promote early bird registration.

### Step 1: Create Campaign

```bash
python scripts/create_campaign.py \
  --name "Summer 2026 Camps Registration" \
  --subject "Summer Camps: 9 Weeks of Tennis + Swimming" \
  --template "assets/templates/camp-promotion.html" \
  --list "Junior Parents"
```

### Step 2: Highlight Key Details

**From `/data/year2026.json`:**
```json
{
  "id": "swim-tennis",
  "name": "Swim & Tennis Camp",
  "dates": "June 16 – August 14",
  "days": "Weekly (Mon–Thu)",
  "hours": "9:00 AM – 3:00 PM",
  "ages": "5-11",
  "price": 495,
  "includes": [
    "Tennis instruction",
    "Supervised swimming",
    "Team activities",
    "Certified lifeguards"
  ]
}
```

### Step 3: Create Urgency

**Early bird pricing:**
- Register by April 15th: $495/week
- After April 15th: $545/week
- Popular weeks (July 4th week) fill by May 1st

### Step 4: Schedule Send

**Email 1:** March 18th - Initial announcement
**Email 2:** April 1st - Early bird reminder (2 weeks left)
**Email 3:** April 12th - Final early bird reminder (3 days left)
**Email 4:** May 15th - Limited spots remaining

---

## Example 8: Event Invitation (Parent Night)

**Scenario:** Hosting "College Tennis Recruiting 101" parent night on February 28th.

### Step 1: Create Invitation

```bash
python scripts/create_campaign.py \
  --name "Event: College Recruiting Parent Night" \
  --subject "You're Invited: College Tennis Recruiting 101 — Feb 28th" \
  --template "assets/templates/event-invitation.html" \
  --list "High Performance Parents"
```

### Step 2: Event Details

```html
<h1>You're Invited</h1>
<h2>College Tennis Recruiting 101</h2>

<div class="event-details">
  <p><strong>When:</strong> Thursday, February 28th · 6:00-8:00 PM</p>
  <p><strong>Where:</strong> Laguna Beach High School Tennis Courts</p>
  <p><strong>Who:</strong> Parents of tournament players (ages 12-17)</p>
  <p><strong>Cost:</strong> Free (RSVP required)</p>
</div>

<h3>What You'll Learn</h3>
<ul>
  <li>NCAA recruiting timeline and rules</li>
  <li>Building a recruiting profile</li>
  <li>Communicating with college coaches</li>
  <li>Academic requirements and scholarships</li>
  <li>UTR and tournament strategy</li>
</ul>

<h3>Featured Speaker</h3>
<p><strong>Andrew Mateljan</strong> — LBTA Founder, former ATP/WTA coach, 25+ years experience placing players in college programs</p>

<a href="%RSVP_LINK%" class="btn-primary">RSVP Now</a>
```

### Step 3: Follow-up Sequence

**Email 1:** February 1st - Initial invitation
**Email 2:** February 15th - Reminder (2 weeks out)
**Email 3:** February 25th - Final reminder (3 days out)
**Email 4:** March 1st - Thank you + resources

---

## Performance Optimization Tips

### A/B Test Subject Lines

**Test 1: Question vs. Statement**
- A: "Ready for Winter Tennis?" (22% open rate)
- B: "Winter Classes Start January 5th" (28% open rate)
- **Winner:** B (statement with specific date)

**Test 2: Urgency vs. Benefit**
- A: "Last Chance to Register" (24% open rate)
- B: "Join the Best Tennis Academy" (19% open rate)
- **Winner:** A (urgency drives action)

**Test 3: Personalization**
- A: "John, Winter Classes Start Soon" (31% open rate)
- B: "Winter Classes Start Soon" (26% open rate)
- **Winner:** A (personalization increases opens)

### Optimize Send Time

**Test different times:**
- 9:00 AM PST: 28% open rate
- 2:00 PM PST: 22% open rate
- 6:00 PM PST: 25% open rate
- **Winner:** 9:00 AM (catches morning inbox check)

**Test different days:**
- Tuesday: 29% open rate
- Thursday: 27% open rate
- Saturday: 23% open rate
- **Winner:** Tuesday (mid-week engagement)

---

## Campaign Calendar (2026)

### January
- **Week 1:** Winter classes start (Jan 5)
- **Week 2:** Spring JTT registration opens
- **Week 3:** Spring JTT deadline reminder (Jan 16)
- **Week 4:** Monthly newsletter

### February
- **Week 1:** Spring session early bird reminder
- **Week 3:** Presidents' Week camp (Feb 16-20)
- **Week 4:** Parent night: College recruiting (Feb 28)

### March
- **Week 1:** Monthly newsletter
- **Week 2:** Summer camp early bird announcement
- **Week 4:** Spring Break camp (Mar 30 - Apr 3)

### April
- **Week 1:** Summer camp early bird reminder
- **Week 2:** Spring session registration opens
- **Week 3:** JTT playoffs coverage
- **Week 4:** Monthly newsletter

---

**Questions?** Check `QUICK_START.md` for setup instructions or `SKILL.md` for comprehensive documentation.

