# Accessibility Checklist - WCAG AA Compliance

**Target:** WCAG 2.1 Level AA
**Scope:** All Senergy platform pages and components
**Last Updated:** October 2025

---

## ✅ Perceivable

### Text Alternatives
- [ ] All images have meaningful alt text
- [ ] Decorative images use `alt=""` or `aria-hidden="true"`
- [ ] Icons paired with text or have `aria-label`
- [ ] Charts have text descriptions or data tables
- [ ] Form inputs have associated labels

### Time-Based Media
- [ ] Videos have captions (if applicable)
- [ ] Audio content has transcripts (if applicable)

### Adaptable
- [ ] Content order is logical without CSS
- [ ] Headings hierarchy is correct (H1 → H2 → H3)
- [ ] Lists use semantic markup (`<ul>`, `<ol>`)
- [ ] Forms use `<fieldset>` and `<legend>` where appropriate
- [ ] Tables use `<th>` with scope attributes

### Distinguishable
- [ ] **Color Contrast:** All text meets 4.5:1 ratio (normal text)
- [ ] **Color Contrast:** Large text meets 3:1 ratio (18pt+)
- [ ] **Color Contrast:** UI components meet 3:1 ratio
- [ ] Information not conveyed by color alone
- [ ] Focus indicators visible (2px outline minimum)
- [ ] Text can be resized to 200% without loss of content
- [ ] Background images don't interfere with text readability

**Automated Tools:**
- Use Chrome DevTools Lighthouse
- Use axe DevTools browser extension
- Use WebAIM Contrast Checker

---

## ✅ Operable

### Keyboard Accessible
- [ ] All interactive elements keyboard accessible
- [ ] Tab order is logical
- [ ] No keyboard traps
- [ ] Skip navigation links provided
- [ ] Keyboard shortcuts don't conflict with screen readers
- [ ] Focus visible on all interactive elements
- [ ] Modal dialogs trap focus appropriately

**Test:** Navigate entire app using only Tab, Shift+Tab, Enter, Space, Escape

### Enough Time
- [ ] No time limits on user actions (or extendable)
- [ ] Auto-refresh can be paused/stopped
- [ ] Timeouts have warnings and can be extended
- [ ] Actions have undo capability (10s window for motor control)

### Seizures and Physical Reactions
- [ ] No flashing content > 3 times per second
- [ ] Animations respect `prefers-reduced-motion`
- [ ] Auto-playing animations can be paused

### Navigable
- [ ] Page titles are descriptive and unique
- [ ] Focus order preserves meaning
- [ ] Link purpose clear from link text
- [ ] Multiple ways to find pages (breadcrumbs, nav, search)
- [ ] Headings and labels descriptive
- [ ] Current location indicated in navigation

### Input Modalities
- [ ] Touch targets minimum 44×44px
- [ ] Gestures have keyboard/mouse alternatives
- [ ] Accidental activation prevented (confirmations)
- [ ] Label in name matches accessible name

**Test:** Use keyboard, touch, mouse, and voice control

---

## ✅ Understandable

### Readable
- [ ] Page language declared (`<html lang="en">`)
- [ ] Language changes marked (`<span lang="sw">`)
- [ ] Abbreviations and jargon explained
- [ ] Reading level appropriate for audience
- [ ] Content in plain language

### Predictable
- [ ] Navigation consistent across pages
- [ ] UI components behave consistently
- [ ] No automatic context changes on focus
- [ ] Forms submit only on explicit action
- [ ] Help is available consistently

### Input Assistance
- [ ] Error messages descriptive and helpful
- [ ] Form validation provides suggestions
- [ ] Labels and instructions provided
- [ ] Error prevention for critical actions (confirmations)
- [ ] Errors identified and described in text

**Error Message Example:**
```
❌ Bad: "Invalid input"
✅ Good: "Email format invalid. Please enter a valid email like user@example.com"
```

---

## ✅ Robust

### Compatible
- [ ] Valid HTML (no errors)
- [ ] ARIA roles used correctly
- [ ] ARIA attributes valid
- [ ] No duplicate IDs
- [ ] Elements have complete start/end tags
- [ ] Status messages use `role="status"` or `aria-live`

**ARIA Landmarks:**
- `<header role="banner">`
- `<nav role="navigation">`
- `<main role="main">`
- `<footer role="contentinfo">`

---

## Component-Specific Checklist

### Button
- [x] Has accessible name (text or aria-label)
- [x] Uses `<button>` element (not `<div>`)
- [x] Has visible focus indicator
- [x] Disabled state prevents interaction
- [x] Loading state announced to screen readers

### Input / Form Fields
- [x] Has associated `<label>`
- [x] Required fields marked with `required` and `aria-required`
- [x] Error messages linked via `aria-describedby`
- [x] Helper text linked via `aria-describedby`
- [x] Invalid state marked with `aria-invalid`

### Modal / Dialog
- [x] Uses `role="dialog"` and `aria-modal="true"`
- [x] Has `aria-labelledby` pointing to title
- [x] Traps focus inside modal
- [x] Returns focus to trigger on close
- [x] Can be closed with Escape key

### Select / Dropdown
- [x] Uses native `<select>` or proper ARIA
- [x] Has accessible label
- [x] Selected value announced
- [x] Keyboard navigable (Arrow keys, Enter, Escape)

### Toggle / Switch
- [x] Has accessible label
- [x] State announced (on/off, checked/unchecked)
- [x] Uses `role="switch"` or native checkbox
- [x] Can be toggled with Space

### Charts
- [ ] Has text description of data
- [ ] Interactive elements keyboard accessible
- [ ] Data available in table format
- [ ] Color not sole means of conveying information

### Toast / Notification
- [x] Uses `role="status"` or `role="alert"`
- [x] Screen reader announces message
- [x] Can be dismissed with keyboard
- [x] Doesn't auto-dismiss critical alerts

---

## Screen Reader Testing

### Test Devices/Software
- **Windows:** NVDA (free) or JAWS
- **macOS:** VoiceOver (built-in)
- **iOS:** VoiceOver (built-in)
- **Android:** TalkBack (built-in)

### Test Scenarios
1. Navigate Dashboard page using only screen reader
2. Fill out and submit onboarding form
3. Adjust motor angle slider
4. Read chart data
5. Dismiss notifications
6. Navigate settings

### Common Issues to Check
- [ ] Unlabeled buttons ("button" announced instead of "Save")
- [ ] Missing landmarks (no main, nav, etc.)
- [ ] Unclear link text ("Click here" instead of "View energy insights")
- [ ] Form errors not announced
- [ ] Dynamic content changes not announced
- [ ] Focus lost after actions

---

## Mobile Accessibility

### Touch Targets
- [ ] Minimum 44×44px for all interactive elements
- [ ] Adequate spacing between targets (8px minimum)
- [ ] Buttons don't overlap or crowd

### Gestures
- [ ] Swipe gestures have alternatives
- [ ] Pinch-zoom not disabled
- [ ] One-handed operation possible for critical tasks

### Mobile Screen Readers
- [ ] VoiceOver (iOS) testing completed
- [ ] TalkBack (Android) testing completed
- [ ] Gestures don't conflict with OS gestures

---

## Testing Tools

### Automated
- **Lighthouse:** Built into Chrome DevTools
- **axe DevTools:** Browser extension
- **WAVE:** Web accessibility evaluation tool
- **Pa11y:** Command-line tool for CI/CD

### Manual
- **Keyboard navigation:** Tab through entire app
- **Screen reader:** NVDA (Windows), VoiceOver (Mac)
- **Color contrast:** WebAIM Contrast Checker
- **Zoom:** Test at 200% zoom
- **Reduced motion:** Enable in OS settings

### CI/CD Integration
```bash
# Run in CI pipeline
npm run check-a11y
```

---

## Acceptance Criteria

Before release, verify:

1. ✅ **Lighthouse Accessibility Score:** > 95
2. ✅ **axe violations:** 0 critical, 0 serious
3. ✅ **Keyboard navigation:** All features accessible
4. ✅ **Screen reader:** Major flows tested
5. ✅ **Color contrast:** All elements pass WCAG AA
6. ✅ **Focus management:** Visible and logical
7. ✅ **Form validation:** Errors clear and helpful
8. ✅ **ARIA:** Used correctly, validated
9. ✅ **Mobile touch targets:** All > 44px
10. ✅ **Reduced motion:** Respected

---

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM Checklist](https://webaim.org/standards/wcag/checklist)
- [A11y Project Checklist](https://www.a11yproject.com/checklist/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [Inclusive Components](https://inclusive-components.design/)

---

**Maintained by:** Frontend Team
**Review Frequency:** Every sprint
**Last Audit:** Sprint 4, Week 1
