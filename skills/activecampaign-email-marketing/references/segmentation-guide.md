# Segmentation Guide

Strategic audience segmentation for LBTA email campaigns.

## Core Segments

### By Program Type

#### Junior Parents (Ages 3-17)
**Size:** ~60% of database
**Interests:** Red Ball, Orange Ball, Green Dot, Youth Development
**Messaging:** Focus on development, fun, community, safety
**Key CTAs:** "Book Trial", "View Junior Programs"

**Sub-segments:**
- **Little Stars (Ages 3-4)**: Play-based introduction
- **Red/Orange Ball (Ages 5-8)**: Fundamentals + fun
- **Green Dot (Ages 9-11)**: Transition to full court
- **Youth Development (Ages 11-15)**: Competitive training
- **High Performance (Ages 12-17)**: Tournament/college prep

#### Adult Players
**Size:** ~35% of database
**Interests:** Beginner, Intermediate, Advanced, Cardio Tennis
**Messaging:** Focus on fitness, social, skill improvement
**Key CTAs:** "Join a Class", "Book Adult Trial"

**Sub-segments:**
- **Beginner (NTRP 1.0-2.0)**: New to tennis or returning
- **Intermediate (NTRP 3.0-3.5)**: Regular players improving
- **Advanced (NTRP 4.0+)**: Competitive players
- **Fitness-Focused**: Cardio Tennis, LiveBall

#### High Performance
**Size:** ~5% of database
**Interests:** Tournament prep, college recruiting, private coaching
**Messaging:** Focus on results, rankings, college placement
**Key CTAs:** "Schedule Consultation", "Join HP Program"

---

### By Engagement Level

#### Hot Leads (Last 7 days)
**Behavior:** Opened recent email, visited website, booked trial
**Strategy:** Strike while iron is hot
**Frequency:** Daily if needed
**Content:** Direct CTAs, limited-time offers, immediate value

#### Warm Leads (8-30 days)
**Behavior:** Some engagement, exploring options
**Strategy:** Nurture with value content
**Frequency:** 2-3x per week
**Content:** Educational, testimonials, program details

#### Cold Leads (31-90 days)
**Behavior:** Minimal engagement, considering options
**Strategy:** Stay top-of-mind
**Frequency:** 1x per week
**Content:** Newsletters, success stories, seasonal updates

#### Inactive (90+ days)
**Behavior:** No opens, clicks, or website visits
**Strategy:** Re-engagement or sunset
**Frequency:** 1x per month
**Content:** "We miss you", special offers, unsubscribe option

---

### By Customer Journey Stage

#### Awareness Stage
**Definition:** Just discovered LBTA
**Content Needs:** What is LBTA? What makes it different?
**Email Types:** Welcome series, academy overview, philosophy
**Goal:** Build trust and credibility

#### Consideration Stage
**Definition:** Evaluating LBTA vs. alternatives
**Content Needs:** Programs, pricing, coaches, testimonials
**Email Types:** Program spotlights, coach profiles, success stories
**Goal:** Demonstrate value and differentiation

#### Decision Stage
**Definition:** Ready to book trial or register
**Content Needs:** Clear next steps, easy registration, urgency
**Email Types:** Trial booking, early bird reminders, limited spots
**Goal:** Remove friction and drive conversion

#### Retention Stage
**Definition:** Current student
**Content Needs:** Engagement, community, additional offerings
**Email Types:** Newsletters, event invitations, referral requests
**Goal:** Maximize lifetime value and referrals

---

### By Geographic Location

#### Laguna Beach (Primary)
**Size:** ~70% of database
**Strategy:** Emphasize local community, convenience
**Messaging:** "Your neighborhood tennis academy"

#### Nearby Cities (Secondary)
**Cities:** Irvine, Newport Beach, Mission Viejo, Dana Point
**Size:** ~25% of database
**Strategy:** Emphasize worth the drive, unique offering
**Messaging:** "Worth the 15-minute drive"

#### Out of Area (Tertiary)
**Size:** ~5% of database
**Strategy:** Camps, intensives, private coaching only
**Messaging:** "Destination training"

---

### By Season/Program Interest

#### Winter 2026 Leads
**Timeframe:** December 2025 - January 2026
**Focus:** Winter program registration
**Urgency:** Early bird deadline December 20th

#### Spring JTT Leads
**Timeframe:** December 2025 - January 2026
**Focus:** Junior Team Tennis registration
**Urgency:** Team registration deadline January 16th

#### Summer Camp Leads
**Timeframe:** March - May 2026
**Focus:** Summer camp registration
**Urgency:** Early bird pricing, popular weeks fill fast

#### Year-Round Leads
**Timeframe:** Ongoing
**Focus:** Private lessons, drop-in classes
**Urgency:** Limited coach availability

---

### By Custom Fields

#### Child Age (for Junior Parents)
**Field:** `child_age`
**Use:** Auto-recommend age-appropriate programs
**Example:** If child_age = 7, recommend Orange Ball

#### Skill Level (for Adults)
**Field:** `ntrp_level`
**Use:** Auto-recommend skill-appropriate programs
**Example:** If ntrp_level = 3.0, recommend Intermediate

#### Program Interest
**Field:** `program_interest`
**Options:** Junior, Adult, High Performance, Camps, Private
**Use:** Send targeted campaign content

#### Last Program Attended
**Field:** `last_program`
**Use:** Personalize re-engagement, suggest next program
**Example:** If last_program = "Orange Ball Fall 2025", suggest "Orange Ball Winter 2026"

#### Trial Status
**Field:** `trial_status`
**Options:** Not Booked, Booked, Completed, No Show
**Use:** Trigger appropriate follow-up sequence

#### Registration Status
**Field:** `registration_status`
**Options:** Not Started, In Progress, Completed, Dropped
**Use:** Trigger abandoned cart or confirmation emails

---

## Segmentation Strategies

### 1. Lifecycle Segmentation
Segment by where contact is in customer journey:
- **New Subscriber** → Welcome series
- **Trial Booked** → Trial nurture sequence
- **Trial Completed** → Registration push
- **Registered Student** → Retention content
- **Past Student** → Re-engagement campaign

### 2. Behavioral Segmentation
Segment by actions taken:
- **Email Engagement**: Opens, clicks, forwards
- **Website Behavior**: Pages visited, time on site
- **Purchase History**: Programs registered, camps attended
- **Event Attendance**: Clinics, showcases, parent nights

### 3. Demographic Segmentation
Segment by characteristics:
- **Age of Child**: 3-4, 5-8, 9-11, 12-15, 16-17
- **Adult Age**: 18-30, 31-45, 46-60, 61+
- **Skill Level**: Beginner, Intermediate, Advanced
- **Location**: Laguna Beach, nearby cities, out of area

### 4. Psychographic Segmentation
Segment by motivations:
- **Competitive Players**: Rankings, tournaments, college
- **Recreational Players**: Fitness, social, fun
- **Parent Priorities**: Development, safety, community
- **Luxury Buyers**: Premium services, private coaching

---

## Campaign-Specific Segmentation

### Season Launch Campaign
**Primary Segment:** All active contacts
**Exclude:** Current season registered students (they already know)
**Personalization:**
- Junior parents → Junior program focus
- Adults → Adult program focus
- Past students → "Welcome back" messaging

### JTT Campaign
**Primary Segment:** Junior parents (ages 7-17)
**Exclude:** Non-junior contacts, students too young/old
**Personalization:**
- By age: Recommend appropriate division
- Past JTT players: "Join us again"
- Tournament players: Emphasize competitive development

### Camp Campaign
**Primary Segment:** Junior parents (ages 5-17)
**Secondary Segment:** Out-of-area contacts (destination camps)
**Personalization:**
- By age: Recommend appropriate camp
- By location: Emphasize convenience or destination
- Past campers: "Reserve your spot early"

### Newsletter
**Primary Segment:** All engaged contacts (opened in last 90 days)
**Exclude:** Unsubscribed, hard bounces
**Personalization:**
- Current students: Community updates
- Prospects: Program highlights
- Inactive: Re-engagement angle

---

## Advanced Segmentation Tactics

### Predictive Segmentation
Use past behavior to predict future actions:
- **Likely to Register**: Opened 3+ emails, visited pricing page
- **Likely to Churn**: No engagement in 60 days, missed last season
- **High Lifetime Value**: Registered for multiple programs, referred others

### RFM Segmentation
Segment by Recency, Frequency, Monetary value:
- **Champions**: Recent, frequent, high-value
- **Loyal Customers**: Frequent, high-value, not recent
- **At Risk**: High-value but declining engagement
- **Lost**: No recent activity, previously engaged

### Engagement Scoring
Assign points for actions:
- Email open: +1 point
- Email click: +5 points
- Website visit: +10 points
- Trial booking: +50 points
- Registration: +100 points

**Segment by score:**
- **0-10**: Cold lead
- **11-50**: Warm lead
- **51-100**: Hot lead
- **100+**: Customer

---

## Segmentation Best Practices

### 1. Start Simple, Get Complex
- **Phase 1**: Program type (Junior/Adult/HP)
- **Phase 2**: Add engagement level (Hot/Warm/Cold)
- **Phase 3**: Add lifecycle stage (Awareness/Consideration/Decision)
- **Phase 4**: Add behavioral and predictive segments

### 2. Test Segment Performance
Compare metrics across segments:
- Which segments have highest open rates?
- Which segments convert best?
- Which segments have highest lifetime value?

### 3. Avoid Over-Segmentation
- Don't create segments with <100 contacts
- Combine similar segments to maintain scale
- Focus on segments that drive business results

### 4. Keep Segments Updated
- Review segment criteria quarterly
- Remove outdated segments
- Add new segments based on business needs

### 5. Respect Preferences
- Honor unsubscribe requests immediately
- Allow contacts to choose email frequency
- Provide preference center for topic selection

---

## Segment Maintenance

### Weekly Tasks
- Update engagement scores
- Move contacts between lifecycle stages
- Flag inactive contacts for re-engagement

### Monthly Tasks
- Review segment performance metrics
- Clean bounced/unsubscribed contacts
- Update custom field data

### Quarterly Tasks
- Audit segment criteria
- Remove or combine underperforming segments
- Add new segments based on business strategy

### Annual Tasks
- Complete database hygiene
- Sunset inactive contacts (no engagement in 365+ days)
- Refresh segmentation strategy

---

## Compliance & Privacy

### CAN-SPAM Requirements
- Include physical address in footer
- Provide clear unsubscribe link
- Honor unsubscribe requests within 10 days
- Don't use deceptive subject lines

### GDPR Considerations (if applicable)
- Obtain explicit consent for email marketing
- Provide clear privacy policy
- Allow contacts to access/delete their data
- Document legal basis for processing

### Best Practices
- Only email contacts who opted in
- Clearly explain what they'll receive
- Make unsubscribe easy and obvious
- Respect frequency preferences

