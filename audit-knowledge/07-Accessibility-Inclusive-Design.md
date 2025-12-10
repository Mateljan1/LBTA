# 07 - ACCESSIBILITY & INCLUSIVE DESIGN (WCAG 2.1 AAA)

## WCAG 2.1 AAA Standards (Highest Level)

Accessibility isn't optional—it's both a legal requirement and good design.

---

## COLOR CONTRAST REQUIREMENTS

### Text Contrast Standards
- **Normal text (14px+):** 7:1 ratio minimum
- **Large text (18px+ or 14px bold):** 4.5:1 ratio minimum
- **Graphics/UI components:** 3:1 ratio minimum

### Testing
- Use WebAIM Contrast Checker
- Test with Lighthouse (DevTools)
- Manual check: Print page in grayscale, text still visible?

### Implementation
```
PASS (7:1 ratio):
- Black #000000 on white #FFFFFF (21:1 ratio)
- Charcoal #134252 on cream #FCFCF9 (9:1 ratio)

FAIL (low contrast):
- Gray #A7A9A9 on white (4:1 ratio - below 7:1)
- Light blue #B4D7FF on white (2:1 ratio - fails)
```

### Color-Blind Safe Palette
- Don't rely on red/green alone to convey information
- Use text labels in addition to color
- Test palette with color-blind simulator

---

## KEYBOARD NAVIGATION

### Requirement: All interactive elements accessible via Tab

**Keyboard navigation order:**
- Natural reading order: Top to bottom, left to right
- Tab key: Move forward
- Shift+Tab: Move backward
- Enter/Space: Activate buttons, submit forms
- Arrow keys: Navigate dropdowns, carousels

### Implementation Checklist
- [ ] All buttons clickable with Tab + Enter
- [ ] All links navigable with Tab + Enter
- [ ] Form fields tab in logical order
- [ ] Focus indicator visible (outline, highlight, underline)
- [ ] No keyboard trap (user can't get stuck)
- [ ] Skip to main content link included

### Focus Indicator Standards
- Minimum 2px width/height
- High contrast with background
- Visible on all interactive elements
- Never removed (visibility: hidden)

Example (Good):
```css
:focus {
  outline: 2px solid #2180; /* Teal outline */
  outline-offset: 2px;
}
```

---

## SEMANTIC HTML

### Use Proper Tags
- `<button>` for buttons (NOT `<div onclick>`)
- `<a href>` for links (NOT `<button>` that navigates)
- `<nav>` for navigation
- `<header>`, `<main>`, `<section>`, `<article>` for structure
- `<form>`, `<label>`, `<input>` for forms
- `<label for="id">` with matching input id

### Screen Reader Support
- Semantic HTML automatically provides accessibility
- Screen readers understand structure
- Users can navigate by heading, section, form field

### Example (Bad)
```html
❌ <div class="button" onclick="submit()">Submit</div>
❌ <div class="form-group">Email: <div class="input"></div></div>
❌ <div class="navigation">Link 1 | Link 2</div>
```

### Example (Good)
```html
✅ <button type="submit">Submit</button>
✅ <label for="email">Email:</label> <input id="email" type="email">
✅ <nav><a href="">Link 1</a></nav>
```

---

## ALT TEXT FOR IMAGES

### Standard
- Descriptive alt text for all content images
- Short alt text (< 125 characters)
- Specific, not generic ("Tennis court in Miami" not "Image of court")
- Functional description ("Menu button" not "three horizontal lines")

### Decorative Images
- Empty alt="" (skip in screen reader)
- Usually background images or icons with visible labels

### Example (Good)
```html
✅ <img src="coach.jpg" alt="Mike Chen, USTA-certified coach with 15 years experience">
✅ <img src="menu.svg" alt="Menu">
✅ <img src="decoration.svg" alt="">
```

### Example (Bad)
```html
❌ <img src="coach.jpg" alt="Photo">
❌ <img src="coach.jpg" alt="Man">
❌ <img src="chart.png" alt="Chart"> (no data description)
```

---

## FORM ACCESSIBILITY

### Label Association
- Every form input needs a `<label>`
- Label must have `for` attribute matching input `id`
- OR wrap input in label

### Example
```html
✅ <label for="email">Email:</label>
   <input id="email" type="email" required>

✅ <label>
     Email:
     <input type="email" required>
   </label>

❌ Email: <input type="email" required> (no label)
❌ <label>Email</label><input> (no association)
```

### Error Messages
- Error message associated with input (aria-describedby)
- Clear, specific ("Enter a valid email" not "Invalid")
- Color alone doesn't convey error (use icon + text)

### Required Fields
- Indicate required with text ("Required") not just asterisk
- OR use aria-required="true"

---

## WCAG ARIA ATTRIBUTES

### aria-label
Use when element has no visible text:
```html
<button aria-label="Close menu">✕</button>
```

### aria-describedby
Link element to detailed description:
```html
<input id="password" type="password" aria-describedby="pwd-hint">
<p id="pwd-hint">Minimum 8 characters, 1 number, 1 symbol</p>
```

### aria-live
Announce dynamic content changes:
```html
<div aria-live="polite" aria-atomic="true" id="messages">
  5 items in cart
</div>
<!-- When updated, screen readers announce change -->
```

### aria-expanded
Indicate if collapsed/expanded:
```html
<button aria-expanded="false" aria-controls="menu">
  Menu
</button>
<nav id="menu" hidden>...</nav>
```

---

## TEXT & TYPOGRAPHY ACCESSIBILITY

### Font Choices
- **Typeface:** Sans-serif preferred (easier to read)
- **Fonts to avoid:** Script, decorative fonts for body text
- **Examples (Good):** Inter, Geist, Apple SF Pro, Arial
- **Examples (Bad):** Script, Papyrus, decorative fonts

### Size & Spacing
- **Minimum font size:** 14px body text
- **Line height:** 1.5 minimum (1.5x font size)
- **Letter spacing:** 0.12em (12% of font size)
- **Paragraph width:** 70-80 characters max (readability)

### Readability
- Avoid: All caps, italicized body text, justified text
- Use: Sentence case, left-aligned, bold for emphasis
- Line breaks: Prefer real line breaks to soft hyphenation

---

## VIDEO & AUDIO ACCESSIBILITY

### Video Requirements
- **Captions:** Synchronized with audio
- **Audio description:** Separate track describing visual content
- **Transcript:** Full text of all dialog and important sounds
- **No auto-play:** User controls when video plays

### Audio Requirements
- **Transcript:** Full text of all spoken content
- **Captions:** If video contains audio
- **Controls:** User can pause, volume, playback speed

---

## MOBILE ACCESSIBILITY

### Touch Targets
- Minimum size: 44×44px (physical size, not just visual)
- Spacing: 8px minimum between targets
- Thumb-friendly locations (bottom half of screen preferred)

### Screen Reader Compatibility
- Mobile screen readers: VoiceOver (iOS), TalkBack (Android)
- Test with actual screen reader, not just ARIA
- Announce important state changes
- Provide context for links ("Learn more about pricing" not just "Learn more")

### Responsive Design
- Same experience on mobile as desktop (not reduced)
- Zoom accessible (pinch zoom, not disabled)
- Orientation change handled (portrait + landscape)

---

## ACCESSIBILITY AUDIT CHECKLIST

### Automated Testing
- [ ] Run Lighthouse accessibility audit
- [ ] Test with axe DevTools
- [ ] Check WebAIM contrast
- [ ] Validate HTML with W3C

### Manual Testing
- [ ] Navigate entire site with keyboard only
- [ ] Test with screen reader (NVDA, JAWS, VoiceOver)
- [ ] Check alt text on all images
- [ ] Verify form labels present
- [ ] Check focus indicators visible
- [ ] Test color-blind palette
- [ ] Test with mobile screen reader
- [ ] Print page in grayscale, still readable?

### Browser/Device Testing
- [ ] Test across browsers (Chrome, Firefox, Safari, Edge)
- [ ] Test on mobile (iOS Safari, Android Chrome)
- [ ] Test with magnifier tool (200% zoom)

---

## WCAG 2.1 AAA QUICK REFERENCE

| Criterion | Standard | Implementation |
|-----------|----------|-----------------|
| Color contrast | 7:1 text, 3:1 UI | Use contrast checker |
| Text sizing | 14px minimum | Set base font size |
| Keyboard nav | All elements accessible | Tab order logical, focus visible |
| Semantic HTML | Proper tags used | Use <button>, <nav>, <label> |
| Alt text | All images | Descriptive, < 125 chars |
| Form labels | Every input labeled | <label for="id"> association |
| Error messages | Clear, specific | Not color alone |
| Video captions | Synchronized | SRT or native captions |
| Mobile touch | 44×44px minimum | Touch-friendly sizing |
| Focus indicator | Visible, 2px+ | Outline or highlight |

---

## IMPLEMENTATION ROADMAP

### Week 1: Audit
- Run accessibility audit tools
- Manual keyboard navigation test
- Document current gaps

### Week 2: Fix Critical Issues
- Increase color contrast to 7:1
- Add focus indicators
- Fix form labels

### Week 3: Medium Issues
- Add alt text to images
- Improve heading structure
- Keyboard navigation polish

### Week 4: Testing & Refinement
- Test with screen reader
- Mobile accessibility testing
- Final audit verification

---

## LEGAL & BUSINESS IMPACT

- **Legal:** ADA compliance required (US), similar laws globally
- **Business:** 15% of population has accessibility needs
- **Ethical:** Inclusive design serves everyone better
- **SEO:** Accessibility signals improve search rankings