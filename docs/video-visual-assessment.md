# CaseBridge Demo Video -- Visual Quality Assessment

## Executive Summary

The current implementation is structurally sound: the 8-beat narrative arc is clear, the state machine logic works, and the Remotion patterns are correct (no CSS transitions, frame-driven animations throughout). However, the video currently reads more like **an animated screenshot tour** than a compelling demo film. The three core issues are:

1. **Wasted frame real estate** -- App-chrome scenes embed a 1920x1080 UI inside the 1920x1080 video frame at 1:1 scale, leaving the nav bar, padding, and whitespace to consume ~40% of pixels with no storytelling value.
2. **Monotonous animation vocabulary** -- Every element uses the same `{damping: 200}` spring with a gentle `translateY(20 -> 0)` fade-up. Nothing surprises or directs the eye.
3. **No visual focal narration** -- The video shows entire screens but never tells the viewer *where to look*. There are no zoom-ins, spotlight overlays, magnified callouts, or scale shifts to create a sense of a guided tour.

Below is a scene-by-scene audit, followed by cross-cutting improvements and a priority-ordered action list.

---

## 1. Scene-by-Scene Visual Audit

### Beat 1 -- Current-State Tension (12s)

**What works:** Dark background, staggered text reveals, gold accent on "0 dashboards." The emotional intent is correct.

**Issues:**
- **Empty center.** Three text lines + one subline occupy roughly 300px of vertical height in a 1080px frame. The remaining 780px is blank navy gradient. At projection distance this reads as a slide with a few words floating in a void.
- **Identical animation curve on all 3 lines.** Each line does the same `damping:200` fade-up. This creates a metronomic cadence rather than building tension. The third line ("0 dashboards") should feel heavier, more impactful -- perhaps a larger scale entrance or a brief flash/pulse.
- **Divider is too subtle.** 200px-wide, 1px-tall gradient line is invisible at projection distance.
- **Subline opacity 0.5** is too faint for projection.
- **No exit animation.** The scene holds static for several seconds after all text appears.

**Recommended fixes:**
- Increase font sizes: stat lines to 80-96px, "0 dashboards" to 110px+. Scale to fill 60-70% of the frame width.
- Use different spring configs per line: line1 smooth, line2 snappier (`{damping:20, stiffness:200}`), line3 heavy with slight bounce (`{damping:15, stiffness:80, mass:2}`).
- Add a subtle animated counter for the numbers (count up from 0 to 3, 0 to 4, hold on 0) to create visual dynamism.
- Make divider 3px tall, 400px wide, with a glow (`box-shadow`).
- Raise subline opacity to 0.7.
- Add a subtle radial vignette or animated gradient shift in the background to prevent the frame from feeling dead.

### Beat 2 -- CaseBridge Overview (12s)

**What works:** Hero section with accent line, capability cards stagger in.

**Issues:**
- **1:1 scale app screenshot problem.** The entire AppFrame is rendered at native resolution. The nav bar (56px tall) is too small to read. The hero text (38px) is small for a video headline. The capability cards' 13px body text is illegible at projection.
- **Bottom ~30% is dead space** below the capability cards.
- **Caption overlaps with card area** -- the gradient overlay partially covers the capability cards.
- **All 4 cards enter identically** with only a 6-frame stagger. Feels flat.

**Recommended fixes:**
- Remove AppFrame from this beat entirely, or scale the content area to 110-120% and crop the nav bar. Better: render a "zoomed-in" hero + cards layout that fills the full 1920x1080 without the nav chrome.
- Increase hero headline to 56-64px, card titles to 22-24px, card metrics to 18px.
- Stagger cards more aggressively (10-12 frames apart) and use a snappier spring for the metric badges (a quick scale-up from 0.8 to 1.0).
- Add a subtle animated accent line that grows from left to right across the hero section.
- Consider a gentle parallax: hero background shifts 20px while cards slide up, creating depth.

### Beat 3 -- Smart Intake + Form Sync (12s)

**What works:** Three-column concept is correct. Sync pulse indicator is a good idea.

**Issues:**
- **Most egregious empty-space problem.** Three columns of 12-13px text in cards fill maybe 60% of the content area vertically, leaving the bottom third empty. The whole scene reads like a zoomed-out admin panel.
- **Sync pulse is nearly invisible.** A 6x6px green dot pulsing between opacity 0.4-1.0 cannot communicate "data flowing between systems" at projection distance.
- **No visual connection between left panel and center panel.** The narrative is "data flows from shared intake to forms," but there is no visual representation of this flow -- no arrows, no animated lines, no highlight cascade.
- **ReadinessScore at 100px diameter with 11px labels** is too small.
- **Progress bars at 4px height** are invisible.

**Recommended fixes:**
- Scale up the entire layout or remove the AppFrame.
- Add animated connection lines (SVG paths with `strokeDashoffset` animation) flowing from the left panel to specific form cards, timed to the sync pulse. This is the single highest-impact improvement for this beat.
- Increase ReadinessScore to 160-180px.
- Make progress bars 8-10px tall.
- Increase all font sizes by 30-40%.
- Add a "data flow" animation: when sync triggers, briefly highlight the source field on the left, animate a colored dot or line traveling right, then highlight the target form card.

### Beat 4 -- Validation (18s, Hero Beat)

**What works:** The phased timing (button highlight, loading, issue reveal) is well-structured. SOC highlight with pulsing border is conceptually right. This beat has the most animation variety.

**Issues:**
- **Two-column layout wastes the left 320px on a compact field list** that is difficult to read. At this moment, the viewer should be focused entirely on the validation results.
- **Issue cards enter with `translateX(24)` fade-in** -- too subtle for the dramatic "issues found!" moment. Should feel more like cards slamming in or dropping from above.
- **Loading spinner at 16x16px** is comically small for a 1920x1080 frame.
- **Button pulse effect** (`Math.sin() * 0.5`) is too gentle to read as an interactive moment.
- **No visual contrast between the "before" (clean) and "after" (issues found) states.** The background stays the same warm white throughout -- there is no tonal shift when issues are discovered.
- **Score display is static at 72** during this entire beat.

**Recommended fixes:**
- When validation fires, add a brief tonal overlay (a subtle red/amber wash that fades) to signal "issues detected."
- Use a zoomed-in layout: after loading completes, zoom the viewport to focus 70% of the frame on the issue cards, pushing the left panel to a smaller sidebar or off-screen entirely.
- Loading state: use a larger (60-80px) circular progress indicator in the center of the right panel, with animated scanning lines or a radial sweep.
- Issue card entrance: use `{damping:12, stiffness:200}` for a snappier, more attention-grabbing entrance. Add a brief scale from 0.95 to 1.0 alongside the translateX.
- Make severity badges larger (16-18px font) with more padding.
- Add an animated counter on the header: "0 issues found" counts up to "3 issues found" as cards appear.
- SOC highlight: instead of just a pulsing border, add a spotlight/magnifier overlay -- a translucent dark overlay with the SOC card "cut out" and slightly scaled up.

### Beat 5 -- Fix + Score Improvement (12s)

**What works:** The fix-then-sync-then-score-rise sequence is narratively satisfying.

**Issues:**
- **Same layout as beats 3-4** with no visual differentiation. The viewer has been looking at 3 columns of small cards for 42 seconds straight.
- **The "fix" moment is underwhelming.** The employer name simply changes from one string to another. No visual celebration, no emphasis on the correction.
- **Score animation (72 to 80) over 1.5 seconds** is good timing but the score display at 100px diameter is too small to notice the change.
- **Form sync glow** (`syncGlow` fading from 1 to 0 over 2 seconds) is very subtle and easy to miss.
- **No before/after comparison** to make the improvement tangible.

**Recommended fixes:**
- Split this beat into two visual phases: (1) a close-up of the field being corrected (field zoomed to fill 40% of screen), then (2) a wide shot showing the cascade effect across forms with the score rising.
- When the fix applies, add a brief "flash" on the corrected field (white overlay fading to green).
- Scale up ReadinessScore to 200px+ for this beat and center it more prominently.
- Add an animated counter that ticks from 72 to 80 with the number scaling up briefly (1.0 to 1.15 to 1.0) at the moment it changes.
- Show a brief "checkmark burst" animation when the issue resolves.
- Add a before/after split: show the old value crossed out on the left, new value on the right, with an arrow.

### Beat 6 -- Role Switcher (22s)

**What works:** Three-role structure is clear. Alert sidebar with colored borders is well-differentiated. Segmented control is a nice touch.

**Issues:**
- **Longest beat (22s) with the least visual variety.** All three role views use the same layout with different text content. At second 14 the viewer has seen this layout three times.
- **Role transitions are invisible.** When the role changes, the content simply snaps to new values. There is no slide, wipe, or visual signal that a perspective shift is happening.
- **Timeline component at bottom with 9px labels** is unreadable.
- **The case timeline dots have no connecting lines** (the connector `div` is empty -- `style={{position:'absolute'}}` with no actual rendering).
- **Actions buttons are static and decorative.** They add visual noise without contributing to the narrative.
- **Alert cards at 13px font** are too small.

**Recommended fixes:**
- Add a slide transition between role views. When switching from Applicant to Employer, the entire content area should slide left while the new content slides in from the right (using `interpolate` on `translateX`). This visually communicates "same case, different perspective."
- Add a brief color/accent flash on the segmented control when the active role changes.
- Scale up the layout -- remove or shrink the timeline component and use that space for larger alert cards and greeting text.
- Increase all font sizes: greeting to 28px, summary to 18px, alert text to 16px.
- Remove the timeline from this beat (it is redundant with beat 3) and use the freed space for a larger, more impactful alert panel.
- Consider showing just the top two cards per role rather than the full layout, making each card larger and more legible.
- Add a brief indicator showing which role is active with a colored accent bar at the top of the content area (blue for applicant, amber for employer, green for attorney).

### Beat 7 -- Scope Clarity (12s)

**What works:** Two-column solve vs. reform structure is the right concept. Scope statement at bottom adds credibility.

**Issues:**
- **Checklist items at 14px font with 20px icons** are too small for projection.
- **Both columns look too similar** despite having opposite messages. The "Requires Reform" column should feel distinctly different -- more muted, grayed out, or visually receding.
- **Scope statement bar at bottom is small** (15px font) for such an important closing argument.
- **AppFrame chrome** is unnecessary here and wastes 56px of vertical space.

**Recommended fixes:**
- Remove AppFrame. Use a full-frame dark/light split layout: left side with a slightly lighter background for "Solves," right side distinctly grayed/muted for "Reform."
- Increase checklist font to 20px, icons to 28px.
- Add animated checkmarks (draw-in effect using SVG `strokeDashoffset`) for the "Solves" items as they appear.
- Scale up scope statement to 24px and give it more visual prominence -- perhaps full-width with a gold accent border.
- Add a visual comparison: before/after metrics as a compact bar chart beside each "Solves" item (e.g., "RFE Rate: 25% -> <5%" as an animated shrinking bar).

### Beat 8 -- Close (8s)

**What works:** Metrics strip is a good way to summarize impact. The dark background and fade-out are appropriate for a closing.

**Issues:**
- **Metrics strip is cramped.** Six metrics at 130px wide in a horizontal row means each metric block is small with tiny text (11px labels, 14-16px values).
- **Product logo at 28px** is underwhelming for the final brand moment.
- **Closing statement at 36px** is reasonable but competing with the metrics strip above for attention.
- **Three-line summary at 15px opacity 0.45** is nearly invisible.
- **Order feels inverted:** the metrics (data) appear before the emotional close (statement). This ends the video on data rather than feeling.

**Recommended fixes:**
- Reorder: Statement first (large, emotional), then metrics strip (supporting evidence), then logo (final brand stamp).
- Or better: show metrics as animated counters/bars that resolve into the statement.
- Scale up product logo to 48-56px for the final frame.
- Make the closing statement 48-56px.
- Increase three-line summary to 20px, opacity 0.6.
- Add a subtle animated gold accent line that expands horizontally below the logo.
- Consider showing metrics as a brief 2x3 grid rather than a horizontal strip, giving each metric more breathing room.

---

## 2. Empty Space Analysis

### Root Cause
The primary cause of empty space is **rendering the full AppFrame (nav + content padding) at 1:1 scale inside the video frame.** The nav bar consumes 56px, padding adds 40-60px on each side, and content is sized for interactive desktop use rather than video legibility.

### Where Space Is Wasted (by beat)

| Beat | Wasted Area | % of Frame | Fix |
|------|------------|------------|-----|
| 1 | Above and below centered text | ~55% | Scale up text, add background motion |
| 2 | Below capability cards, nav bar area | ~35% | Remove AppFrame, zoom content |
| 3 | Below three columns, nav bar | ~35% | Remove AppFrame, larger components |
| 4 | Left sidebar (compact data), nav bar | ~30% | Zoom into validation results |
| 5 | Below columns, nav bar | ~35% | Remove AppFrame, zoom to fix moment |
| 6 | Below content, nav bar, timeline | ~30% | Remove timeline, enlarge alerts |
| 7 | Below scope statement, nav bar | ~25% | Remove AppFrame, full-bleed layout |
| 8 | Above and beside metrics | ~40% | Reorder layout, scale up elements |

### Recommended Global Fix
Create a **ZoomedAppFrame** variant that renders content at 115-130% scale with the nav bar either removed or rendered as a minimal 36px bar. For hero moments (validation results, fix cascade, score change), use a "focus mode" that zooms the camera to a specific region of the app, filling 80%+ of the 1920x1080 frame with the relevant content.

Implement this with a wrapper component:

```jsx
// Concept: zoomed viewport
const ZoomedView = ({ scale = 1.2, offsetX = 0, offsetY = -40, children }) => {
  return (
    <div style={{
      transform: `scale(${scale}) translate(${offsetX}px, ${offsetY}px)`,
      transformOrigin: 'center top',
      width: 1920,
      height: 1080,
    }}>
      {children}
    </div>
  );
};
```

Or better, animate the scale and offset using `interpolate()` to create dynamic "camera" movements within a scene.

---

## 3. Animation Improvements

### Current Problem: Monoculture
Every single animation in the entire video uses the same pattern:
```js
const enter = spring({ frame, fps, config: { damping: 200 }, delay: X });
const opacity = interpolate(enter, [0, 1], [0, 1]);
const translateY = interpolate(enter, [0, 1], [Y, 0]);
```

This creates a uniform, predictable, and ultimately boring visual rhythm. The viewer's brain stops registering the animations after beat 2.

### Recommended Animation Vocabulary

**1. Gentle reveal (keep for background elements):**
```js
config: { damping: 200 }
// translateY: 12-16px
```

**2. Snappy entrance (for key reveals like issue cards, score changes):**
```js
config: { damping: 20, stiffness: 200 }
// scale: 0.92 -> 1.0 + translateX: 30 -> 0
```

**3. Heavy drop (for dramatic moments like "0 dashboards"):**
```js
config: { damping: 15, stiffness: 80, mass: 2 }
// translateY: 40 -> 0 with slight overshoot
```

**4. Counter tick (for animated numbers):**
```js
// Use interpolate over 30-45 frames with Easing.out(Easing.quad)
const count = interpolate(frame - delay, [0, 45], [startVal, endVal], {
  easing: Easing.out(Easing.quad),
  extrapolateLeft: 'clamp',
  extrapolateRight: 'clamp',
});
```

**5. Draw-in (for checkmarks, progress arcs, connection lines):**
```js
// SVG strokeDashoffset animation
const drawProgress = spring({ frame, fps, config: { damping: 200 }, delay });
const offset = interpolate(drawProgress, [0, 1], [totalLength, 0]);
```

**6. Pulse/glow (for attention direction, use sparingly):**
```js
// Stronger than current: 0 -> 8px box-shadow radius
const pulse = spring({ frame, fps, config: { damping: 8 }, delay });
const glow = interpolate(pulse, [0, 1], [0, 12]);
```

**7. Scale pop (for score changes, resolved badges):**
```js
const pop = spring({ frame, fps, config: { damping: 12, stiffness: 200 }, delay });
const scale = interpolate(pop, [0, 1], [0.8, 1.0]);
```

---

## 4. Layout Restructuring Recommendations

### Strategy: "Editorial Layout" vs. "App Screenshot"

The current approach renders the app at native resolution and hopes the video captures it well. The better approach is to treat each beat as an **editorial composition** where the app content is excerpted, scaled, and arranged for maximum visual impact within the 1920x1080 frame.

### Beat-by-Beat Layout Recommendations

**Beats 1, 8 (Full-frame dark):** Already correct -- no app chrome. Just scale up text.

**Beat 2 (Overview):** Remove AppFrame. Use a split layout:
- Left 55%: hero headline + description + CTA (scaled to 120%)
- Right 45%: 2x2 grid of capability cards (scaled to 115%)

**Beats 3-5 (Intake/Validation/Fix):** These should be the most dynamically composed beats. Instead of showing the full app at 1:1, use a "camera" approach:
- Beat 3: Start with a zoomed view of the shared data panel, then pull back to show all three columns with animated flow lines.
- Beat 4: Start wide, then zoom into the validation results area when issues appear, pushing the left panel off-screen.
- Beat 5: Start zoomed on the field being fixed, then pull back to show the cascade, then zoom to the score.

**Beat 6 (Roles):** Use a centered card layout rather than the full app. Show just the role switcher control, the greeting card, and the alert panel, each scaled up 130%.

**Beat 7 (Scope):** Full-frame, no app chrome. Two-column with generous sizing.

---

## 5. Focus & Callout Strategy

### Current Problem
No scene has a directed focal point. The viewer must scan the full 1920x1080 frame to find what matters.

### Recommended Techniques

**1. Spotlight overlay.** A semi-transparent dark overlay (opacity 0.5-0.7) that covers the entire frame except for a "window" around the focal element. The window has rounded corners and a subtle glow border.

```jsx
// Concept
<div style={{
  position: 'absolute', inset: 0,
  background: 'rgba(0,0,0,0.5)',
  clipPath: `polygon(
    0% 0%, 100% 0%, 100% 100%, 0% 100%,
    0% ${top}px, ${left}px ${top}px,
    ${left}px ${bottom}px, ${right}px ${bottom}px,
    ${right}px ${top}px, 0% ${top}px
  )`,
}} />
```

**2. Animated callout arrow.** A simple line + arrowhead that draws in (SVG `strokeDashoffset` animation) pointing from the caption area to the relevant UI element.

**3. Scale emphasis.** When drawing attention to an element, scale it to 105-110% with a brief spring while slightly dimming surrounding elements.

**4. Where to use each:**
- Beat 3: Spotlight on sync indicators + flow lines
- Beat 4: Spotlight on the "Run Validation" button, then on each issue card as it appears
- Beat 5: Spotlight on the employer name field, then on the score
- Beat 6: Brief spotlight on the role switcher control as it changes
- Beat 7: No spotlight needed (the two-column layout is self-explanatory)

---

## 6. Transition Improvements

### Current State
All transitions are `fade()` with either `linearTiming({durationInFrames: 18})` (standard) or `linearTiming({durationInFrames: 6})` (quick). Every scene boundary looks the same.

### Recommended Changes

| Transition | Current | Recommended | Rationale |
|-----------|---------|-------------|-----------|
| Beat 1 -> 2 | fade 18f | `slide({direction:'from-right'})` 24f with `springTiming` | Moving from problem to solution = forward motion |
| Beat 2 -> 3 | fade 18f | `wipe({direction:'from-left'})` 20f | "Diving into" the product |
| Beat 3 -> 4 | fade 6f | Keep quick fade 8f | Same screen, state change (good) |
| Beat 4 -> 5 | fade 6f | Keep quick fade 8f | Same screen, state change (good) |
| Beat 5 -> 6 | fade 18f | `slide({direction:'from-right'})` 20f | New section = forward motion |
| Beat 6 -> 7 | fade 18f | fade 24f with slight zoom out | "Zooming out" to see the big picture |
| Beat 7 -> 8 | fade 18f | fade 30f | Slow, deliberate close |

Also increase TRANSITION_QUICK from 6 to 10 frames. 6 frames (0.2s) is too fast to register as a transition; it looks like a glitch.

---

## 7. Typography & Readability Fixes

### Minimum Font Sizes for Projection
Based on the 1920x1080 frame viewed on a classroom projector:

| Element | Current Size | Minimum for Projection | Recommended |
|---------|-------------|----------------------|-------------|
| Beat 1 stat lines | 60-72px | 80px | 80-110px |
| Hero headline | 38px | 48px | 56-64px |
| Card titles | 16px | 20px | 22-24px |
| Card body text | 13px | 16px | 18px |
| Metric badges | 12px | 14px | 16-18px |
| NavBar items | 13px | n/a (remove from video) | n/a |
| Caption main text | 26px | 32px | 36-40px |
| Caption subtext | 16px | 20px | 22-24px |
| Section headers | 14-18px | 22px | 24-28px |
| Data labels | 11-12px | 14px | 16px |

### Font Weight
Current body text uses `fontWeight: 400-500` which can appear thin at projection. Increase body text to `fontWeight: 500` minimum, labels to `fontWeight: 600`.

### Caption Improvements
- Increase main caption text from 26px to 40px.
- Increase subtext from 16px to 24px.
- Make the gradient backdrop more opaque: change `rgba(10, 22, 40, 0.88)` to `rgba(10, 22, 40, 0.92)`.
- Add a subtle bottom padding (40px instead of 28px) to lift text away from the frame edge.
- Add a thin gold accent line above the caption text.

---

## 8. Production Polish Additions

### 1. Animated Background Patterns (Subtle)
Add a very subtle animated grid or dot pattern to the dark backgrounds (beats 1, 8). This prevents the frame from feeling dead.

```jsx
// Subtle animated grid (concept)
const gridOffset = interpolate(frame, [0, 300], [0, 20], {
  extrapolateRight: 'extend',
});
// Render with a repeating SVG pattern at very low opacity (0.03-0.05)
```

### 2. Progress Indicator
Add a thin progress bar at the very bottom of the frame (2-3px) that fills from left to right across the full video duration. Uses the gold accent color. Gives the viewer a sense of pacing.

```jsx
const progress = frame / totalFrames;
<div style={{
  position: 'absolute', bottom: 0, left: 0,
  width: `${progress * 100}%`, height: 3,
  background: C.accent,
}} />
```

### 3. Beat Number/Label Indicator
A small, elegant indicator in the top-right corner showing the current section (e.g., "1/8 -- Current State" or just a subtle dot indicator). Fades in with each beat.

### 4. Animated Accent Lines
Throughout the video, use animated gold lines (2-3px, drawn from left to right using SVG `strokeDashoffset`) as section dividers and visual rhythm markers.

### 5. Micro-interactions on State Changes
When data changes state (issue found, fix applied, score changes), add brief particle-like effects: a small burst of 3-4 tiny dots that fade out. Keep these very restrained.

### 6. Consistent "CaseBridge" Watermark
A subtle, semi-transparent (opacity 0.15) "CaseBridge" watermark in the bottom-right corner during app-chrome beats. Reinforces brand without cluttering.

---

## 9. Priority-Ordered Action List

Ranked by **impact / effort** ratio. Items at the top deliver the most visual improvement for the least code change.

### Tier 1: High Impact, Moderate Effort

**1. Scale up all font sizes by 40-60% across beats 2-7.**
- Impact: Immediately solves readability and reduces perceived empty space.
- Effort: Change numeric values in each scene file.
- Files: All 8 scene files, Caption.jsx, ReadinessScore.jsx.

**2. Remove AppFrame from beats 3-5 or replace with a minimal 36px chrome bar.**
- Impact: Reclaims 56px of vertical space + reduces margins. Content fills more of the frame.
- Effort: Create a `MinimalFrame` component or remove the frame wrapper and add a minimal nav indicator.
- Files: Beat3, Beat4, Beat5 (and optionally Beat2, Beat6, Beat7).

**3. Enlarge the ReadinessScore component to 180-220px in beats where the score changes (Beat 5).**
- Impact: The score change is the climactic payoff moment. Making it larger makes it unmissable.
- Effort: Change `size` prop and adjust surrounding layout.
- Files: Beat5_Fix.jsx, ReadinessScore.jsx.

**4. Add varied spring configs (snappy, heavy, bouncy) instead of uniform `{damping:200}` everywhere.**
- Impact: Creates visual variety and directs attention. Key reveals feel more impactful.
- Effort: Change config objects in spring() calls. No structural changes.
- Files: Beat1 (heavy for "0 dashboards"), Beat4 (snappy for issue cards), Beat5 (bouncy for score), Beat8 (snappy for metrics).

**5. Increase caption font sizes (40px main, 24px sub) and gradient opacity.**
- Impact: Captions become readable at projection distance. Currently too small and faint.
- Effort: Two number changes in Caption.jsx.
- Files: Caption.jsx.

### Tier 2: High Impact, Higher Effort

**6. Add animated flow lines (SVG) between shared data and form cards in Beat 3.**
- Impact: Transforms the beat from "three columns of data" to "visible data flow," which is the entire point of the smart intake concept.
- Effort: Create SVG paths with `strokeDashoffset` animation. Moderate complexity.
- Files: Beat3_SmartIntake.jsx (new SVG overlay component).

**7. Add a spotlight/dimming overlay for key moments in Beat 4.**
- Impact: Directs viewer attention to the validation button, then to each issue card. Adds cinematic quality.
- Effort: Create a reusable Spotlight component with animated clip-path or overlay.
- Files: New component + Beat4_Validation.jsx.

**8. Add slide transitions between role views in Beat 6.**
- Impact: Currently roles just swap content. A slide transition visually communicates "different perspective on the same data."
- Effort: Implement `translateX` animation on role change. Moderate complexity with local frame math.
- Files: Beat6_RoleSwitcher.jsx.

### Tier 3: Polish, Lower Priority

**9. Vary transition types between beats (slide for 1-2, wipe for 2-3, keep fade for related beats).**
- Impact: Adds visual variety to the overall pacing. Each section boundary feels intentional.
- Effort: Import additional transition types, change transition definitions.
- Files: CaseBridgeDemo.jsx.

**10. Add a thin gold progress bar at the bottom of the entire composition.**
- Impact: Gives the viewer a sense of pacing and position. Professional touch.
- Effort: One additional `<Sequence>` with a simple interpolation.
- Files: CaseBridgeDemo.jsx (add as an overlay above the TransitionSeries).

---

## Appendix: Things That Are Already Good

- Correct use of `useCurrentFrame()` and `spring()` throughout -- no CSS transitions.
- Deterministic state machine with clear phase timing in Beat 4.
- Color palette is consistent and tasteful.
- Font choices (Inter + Source Serif 4) are appropriate for the institutional tone.
- Beat structure follows the spec's narrative arc.
- Caption content is well-written and concise.
- TransitionSeries with quick crossfades for beats 3-4-5 is the right structural choice.

The foundation is solid. The improvements above are about amplifying what is already there -- making the existing good decisions more visible, more legible, and more emotionally compelling.
