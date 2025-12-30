# 7-Day Nurture Sequence

Professional email sequence for converting leads into enrolled students at LBTA.

## Sequence Overview

| Day | Email | Subject | Goal |
|-----|-------|---------|------|
| 1 | Reconnection | Quick note from LBTA | Re-engage and set expectations |
| 2 | What Session Looks Like | What training at LBTA actually looks like | Show structure and value |
| 3 | Placement | How we match players with the right program | Address fit concerns |
| 4 | LBTA Difference | What makes LBTA different | Differentiate from competitors |
| 5 | Junior Team Tennis | For juniors who want to compete as a team | Introduce JTT option |
| 6 | Final Week Reminder | Final week before Winter Session begins | Create urgency |
| 7 | Session Start | Winter programs begin tomorrow | Final call to action |

---

## Merge Tags for GoHighLevel

Replace these placeholders in your GHL automation:

### Standard Merge Tags
- `%FIRSTNAME%` → `{{contact.first_name}}`
- `%LASTNAME%` → `{{contact.last_name}}`
- `%EMAIL%` → `{{contact.email}}`
- `%PHONE%` → `{{contact.phone}}`
- `%UNSUBSCRIBE%` → `{{unsubscribe_link}}`

### Custom Fields
- `%PROGRAM_INTEREST%` → `{{contact.program_interest}}`
  - Values: "junior tennis training for your child", "adult tennis lessons", "training"
- `%CHILD_NAME%` → `{{contact.child_name}}`
- `%CHILD_AGE%` → `{{contact.child_age}}`
- `%TRIAL_DATE%` → `{{contact.trial_date}}`

---

## Conditional Content (Email 1)

In GoHighLevel, use conditional logic:

```liquid
{% if contact.program_interest == "Junior" %}
You reached out about junior tennis training for your child not long ago.
{% elseif contact.program_interest == "Adult" %}
You reached out about adult tennis lessons not long ago.
{% else %}
You reached out about training at Laguna Beach Tennis Academy not long ago.
{% endif %}
```

---

## Setup in GoHighLevel

### Step 1: Upload HTML Templates

1. Go to **Marketing → Templates → Email Templates**
2. Click **Create Template**
3. Name: "LBTA Nurture - Day 1 - Reconnection"
4. Paste HTML from `01-reconnection.html`
5. Replace `%FIRSTNAME%` with `{{contact.first_name}}`
6. Replace `%PROGRAM_INTEREST%` with conditional logic (see above)
7. Save template
8. Repeat for all 7 emails

### Step 2: Create Automation Workflow

1. Go to **Automation → Workflows**
2. Click **Create Workflow**
3. Name: "LBTA 7-Day Nurture Sequence"
4. **Trigger**: Contact added to list "Nurture Sequence"
5. Add 7 email steps:

**Email 1 (Day 1 - Immediate)**
- Action: Send Email
- Template: "LBTA Nurture - Day 1 - Reconnection"
- Delay: None

**Email 2 (Day 2)**
- Action: Wait
- Duration: 1 day
- Then: Send Email
- Template: "LBTA Nurture - Day 2 - What Session Looks Like"

**Email 3 (Day 3)**
- Action: Wait
- Duration: 1 day
- Then: Send Email
- Template: "LBTA Nurture - Day 3 - Placement"

**Email 4 (Day 4)**
- Action: Wait
- Duration: 1 day
- Then: Send Email
- Template: "LBTA Nurture - Day 4 - LBTA Difference"

**Email 5 (Day 5)**
- Action: Wait
- Duration: 1 day
- Then: Send Email
- Template: "LBTA Nurture - Day 5 - Junior Team Tennis"

**Email 6 (Day 6)**
- Action: Wait
- Duration: 1 day
- Then: Send Email
- Template: "LBTA Nurture - Day 6 - Final Week Reminder"

**Email 7 (Day 7)**
- Action: Wait
- Duration: 1 day
- Then: Send Email
- Template: "LBTA Nurture - Day 7 - Session Start"

### Step 3: Set Exit Conditions

Add these conditions to stop the sequence:

- **Contact registers** (tag: "Registered Student")
- **Contact books trial** (tag: "Trial Booked")
- **Contact unsubscribes**
- **Contact replies** (optional - move to manual follow-up)

---

## Personalization Tips

### Email 1 - Reconnection
- Use `{{contact.program_interest}}` to customize opening
- Reference specific inquiry date if available

### Email 5 - Junior Team Tennis
- Only send to contacts with `{{contact.child_age}}` between 10-18
- Skip for adult-only contacts

### Email 6-7 - Urgency
- Update "Winter Session" to current season
- Update start date dynamically

---

## Performance Benchmarks

### Expected Metrics
- **Open Rate**: 35-45% (higher than cold emails due to prior engagement)
- **Click Rate**: 5-8%
- **Reply Rate**: 8-12%
- **Conversion Rate**: 15-25% (trial booking or registration)

### Optimization
- **Low Opens**: Test subject lines, send time
- **Low Clicks**: Make CTAs more prominent
- **Low Replies**: Simplify ask, reduce friction
- **Low Conversions**: Follow up with phone call after Day 4

---

## A/B Testing Ideas

### Subject Lines
- **Email 1**: "Quick note from LBTA" vs. "Following up on your inquiry"
- **Email 2**: "What training looks like" vs. "Inside an LBTA session"
- **Email 6**: "Final week" vs. "Last chance to join Winter Session"

### Send Time
- **Morning**: 9:00 AM PST
- **Afternoon**: 2:00 PM PST
- **Evening**: 6:00 PM PST

### Content Length
- **Short**: Remove insight boxes, keep core message
- **Long**: Add testimonials, more detail

---

## Brand Compliance

All emails follow LBTA brand guidelines:

✅ **Typography**: Playfair Display (headlines) + Work Sans (body)
✅ **Colors**: Black/white primary, beige (#F8E6BB) accents
✅ **Tone**: Calm, confident, authentic - never salesy
✅ **Copy**: No "maximize", "elite", "world-class" language
✅ **Mobile**: Responsive at 320px, 375px, 768px
✅ **Accessibility**: 7:1 contrast ratio, alt text on images

---

## Files

- `01-reconnection.html` - Day 1: Re-engage and set expectations
- `02-what-session-looks-like.html` - Day 2: Show structure and value
- `03-placement.html` - Day 3: Address fit concerns
- `04-lbta-difference.html` - Day 4: Differentiate from competitors
- `05-junior-team-tennis.html` - Day 5: Introduce JTT option
- `06-final-week-reminder.html` - Day 6: Create urgency
- `07-session-start.html` - Day 7: Final call to action

---

## Support

**Questions?** Contact support@lagunabeachtennisacademy.com

**Created**: December 28, 2025
**Status**: ✅ Ready for GHL upload

