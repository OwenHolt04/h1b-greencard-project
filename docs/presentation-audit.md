# Presentation Audit: CaseBridge Prototype
**Date:** March 10, 2026
**Scope:** Full read of all 15 source files in `/app/src/`
**Purpose:** Assess this website as a cinematic demo tool for a sub-3-minute promo video and live classroom presentation

---

## Current Architecture Summary

The prototype is a single-page React application (Vite + React 19 + Tailwind CSS 4 + framer-motion) with **state-based navigation** — no URL routing, no browser history. Five screens are swapped in a single `<main>` container via a reducer in `DemoContext.jsx`.

**Navigation bar:** Fixed 56px navy bar at top. Five tab-style nav links (`Overview`, `Case`, `Intake`, `Roles`, `Impact`) plus a `Reset` button.

**Screen transition:** A 200ms `opacity: 0 → 1` fade via `<AnimatePresence mode="wait">` in `App.jsx`. Functionally invisible at normal presentation speed.

**Layout shell:** `Layout.jsx` wraps all screens with `pt-14` (56px padding) to clear the fixed nav. No side margins are applied at the Layout level — each screen manages its own `max-w-*` container.

**State machine:** `DemoContext.jsx` drives all interactive moments: `runValidation()` (1200ms async), `resolveIssue()` (triggers sync pulse + form card flash), `advanceStage()`, `setOverviewMode()`, role switching, and `openForm()` modal. URL params allow direct deep-linking for Remotion (`?screen=intake&validated=true&fixed=employer-name`).

**Color palette:** Surface cream `#fbfdeb`, deep navy `#162768` / `#1c3180`, accent yellow `#f8f2b6`. The Space Mono body font and Roca Two serif display font create a distinctive identity.

---

## Screen-by-Screen Content Density Analysis

All estimates assume a 1440×900 laptop viewport with 56px nav subtracted (usable height ~844px).

### Screen 1: Overview (`Overview.jsx`)
**States:** "Today" (current state) | "With CaseBridge" (future state, default)

**Future state layout stack:**
- Hero section (navy gradient background): approx. 340px — toggle buttons + headline + body copy + CTA
- 4-card capability grid: approx. 280px
- Case Preview card (with compact timeline): approx. 280px
- Scope Note footer: approx. 80px
- **Total scrollable height: ~980px → requires ~136px of scrolling**

**Current state layout stack:**
- Hero section: approx. 340px
- 6-problem-card grid (3 cols): approx. 380px
- "What one case looks like today" portal grid: approx. 160px
- **Total scrollable height: ~880px → minimal scrolling but tight**

**Key observation:** The hero + toggle is above the fold. The capability cards and Case Preview fall partially below the fold. The scope note is always offscreen without scrolling.

### Screen 2: Dashboard (`Dashboard.jsx`)
**Default state (no `?alert=deadline`):**
- Case header bar: approx. 110px
- Case Journey timeline card: approx. 160px
- Main 3-col grid:
  - Left 2-col: Agency Status + "What's Happening Now" + Case Team = approx. 520px combined
  - Right 1-col: Alerts card + H-1B deadline card = approx. 420px combined
- **Total scrollable height: ~950px → requires ~106px of scrolling**

**With `?alert=deadline`:** The large deadline protection panel (~220px) is inserted between the timeline and the main grid, pushing total height to ~1170px. This screen overflows by ~326px — the Alerts column and Case Team are fully below the fold.

**Key observation:** This is the most content-dense screen. The readiness score (56px ring) in the case header is tiny. The "102 days" deadline figure and the cross-agency status panel — two of the strongest visual proof moments — are mid-page and require scrolling on a standard laptop.

### Screen 3: Intake (`Intake.jsx`)
**Pre-validation state:**
- Screen header (title + score ring): approx. 80px
- Three-panel grid (Shared Data | Filing Package | Validation):
  - Left panel: 6 intake sections with ~18 fields total ≈ approx. 680px
  - Center panel: 6 form cards in 2-col grid ≈ approx. 380px
  - Right panel (pre-validation): Score placeholder + "Run Pre-Flight" button ≈ approx. 240px
- **Total page height (pre-validation): ~760px → fits above the fold**

**Post-validation state (after `runValidation()`):**
- Right panel expands: large 110px score ring + 3 validation issue cards with fix buttons ≈ approx. 640px
- Left panel highlights mismatch fields in amber/green
- **Total page height (post-validation): ~1060px → requires ~216px of scrolling**

**Key observation:** The most important interaction — clicking "Fix: Standardize to Hewlett Packard Enterprise" and watching the score animate from 72 → 80 — is **below the fold** on the right panel after validation runs. A viewer watching the promo video at standard size may never see the fix button unless the demo is scrolled.

### Screen 4: Roles (`Roles.jsx`)
**Applicant role (default, most content):**
- Header + role switcher: approx. 130px
- Greeting/status card with compact timeline: approx. 260px
- Left 2-col:
  - Next Step card: approx. 190px
  - Available Actions card: approx. 200px
  - Eligibility Wizard (8 items): approx. 520px
- Right 1-col: 3 alert cards ≈ approx. 300px
- **Total scrollable height: ~1360px → requires ~516px of scrolling**

**Attorney role:**
- Eligibility wizard is hidden; 4 action items instead of 3; sponsorship table absent
- Total height similar to applicant minus wizard: ~840px → just fits

**Key observation:** The Roles screen is **the scrolliest screen in the prototype**. The Eligibility Wizard (strongest "delighter" moment, 8 items) starts at approximately y=780px — entirely below the fold. A live demo presenter must scroll to reveal it, breaking visual flow.

### Screen 5: Impact (`Impact.jsx`)
- Header: approx. 100px
- 6-metric strip (2 rows): approx. 200px
- "Solves / Requires Reform" 2-col comparison: approx. 520px
- Navy quote block: approx. 200px
- "CaseBridge Approach" 3-step card: approx. 240px
- Back button: approx. 60px
- **Total scrollable height: ~1320px → requires ~476px of scrolling**

**Key observation:** The "A better process, even before broader reform" navy quote block — which is the strongest rhetorical moment in the prototype — is at approximately y=920px, far below the fold. The 6-metric strip is above the fold and is this screen's strongest above-fold element.

---

## Navigation & Transition Model

**Model:** State-based tab navigation. Clicking a nav item triggers a React state dispatch (`NAVIGATE`), which causes `<AnimatePresence>` to unmount the old screen and mount the new one.

**Transition:** `opacity 0 → 1` over 200ms. No directional motion, no scale, no slide. The transition is functionally invisible — on a 24" presentation display it will look like an instant cut.

**What this means for presentation:**
- Tab navigation looks like a developer tool, not a product. The nav bar labels (`Overview`, `Case`, `Intake`, `Roles`, `Impact`) are internal navigation names, not user-facing value propositions.
- There is no "next screen" button on any screen except the CTA buttons on Overview and Impact. The presenter must click the nav bar, which draws the audience's eye to the top of the screen.
- There is no pagination indicator, progress bar, or "step X of 5" context. An audience member who has not seen the prototype before has no sense of where in the demo they are.
- **Reset button** is exposed in the nav at all times. This is a developer utility that looks out of place in a polished demo.

**Screen-to-screen links:**
- Overview "View Demo Case" → Dashboard (good, one intentional journey)
- Dashboard "Open Validation Review" → Intake (good)
- Dashboard "Switch Role View" → Roles (good)
- Intake has no outbound CTA — dead end
- Roles has no outbound CTA — dead end
- Impact "Back to Overview" → Overview (closes the loop)

The gaps (Intake → nowhere, Roles → nowhere) mean a live presenter must reach for the nav bar twice during the demo.

---

## Strongest Compositions (What Works Well for Presentation)

**1. ReadinessScore circular ring — all screens**
The animated SVG ring (`ReadinessScore.jsx`) is the single best visual in the prototype. The counter-clockwise fill animation on score change, the color transition (amber → green at 90+), and the score-glow CSS animation combine into a clear, numerically grounded "proof moment." At 110px in the Intake right panel it reads well on screen. At 52–56px in the nav headers it is too small to be a focal point.

**2. Intake three-panel layout — pre/post validation contrast**
The three-column layout (Shared Data | Filing Package | Validation) is the strongest structural composition. The color-state change when validation runs — amber highlight on employer name field, form cards flashing with "Employer name updated" badges, score ring animating from 72 to 80 — is a coherent visual narrative that demonstrates the core capability. This is the best interactive proof moment in the entire prototype.

**3. Hero toggle on Overview — "Today" vs "With CaseBridge"**
The `AnimatePresence`-driven toggle between current and future state is clean and fast. The red/amber "Today" state vs. the yellow accent "With CaseBridge" state creates a strong visual contrast. The headline typography at `text-5xl/6xl` with Roca Two serif is the highest-impact text in the prototype.

**4. Cross-Agency Status on Dashboard**
The three-row agency status list (DOL green / USCIS blue / DOS green) with plain-English explanations is visually legible and directly demonstrates the "unified dashboard" capability. It reads clearly without scrolling.

**5. Impact metrics strip**
The 6-metric before/after strip (`~25%` → `<5%`, `4 portals` → `1 view`, etc.) is punchy and grid-aligned. It fits above the fold and communicates measurable value in a single glance.

---

## Weakest Compositions (What Hurts Presentation Clarity)

**1. Fixed 56px nav bar with tab labels that say nothing**
At presentation scale, the nav bar (`Overview | Case | Intake | Roles | Impact`) consumes 56px of vertical space and signals "developer navigation" rather than "product." The label "Case" means nothing to an audience member unfamiliar with the prototype. The `Reset` button is visually distracting and explains nothing. The nav bar does not disappear during demo flow, so it always competes with the screen content.

**2. Dashboard information overload — too many panels, no visual hierarchy**
Dashboard is the "Command Center" screen but has no dominant visual element. Six content regions compete equally: Case Header, Journey Timeline, Agency Status, "What's Happening Now," Case Team, and Alerts. There is no single number, no single color block, no single element that a viewer's eye rests on. The H-1B "102 days" countdown is in the right-sidebar compact card (text-4xl) — powerful data, but positioned at ~y=720px requiring scrolling, and dwarfed by the Alerts card above it.

**3. Intake scrolls to its own best moment**
After clicking "Run Pre-Flight Validation," the score ring animates and three issue cards appear in the right panel. The most interactive moment — clicking "Fix: Standardize to Hewlett Packard Enterprise" — is at approximately y=900px in the right panel. A viewer watching from a projector may miss the form-card flash entirely because the presenter would need to scroll right as the animation plays. The three panels are equal-height which means the left panel (18 fields) forces the right panel to be taller than the scroll area.

**4. Roles screen is impossible to present without scrolling**
The Eligibility Wizard (the "delighter" capability) is one of the best content pieces in the prototype — 8 plain-language yes/no checks. But it appears only in the Applicant view and starts at y~780px. To show it live, the presenter must scroll past the greeting card, past the timeline, past the Next Step card, past the Actions card. By the time the wizard is visible, the role switcher (which context-frames the whole demo moment) is off the top of the screen.

**5. Tiny role switcher doesn't read on a projector**
The three-tab role switcher in `Roles.jsx` (`Applicant | Employer / HR | Attorney`) uses `px-6 py-3 text-base`. On a standard projector resolution, this reads as normal-sized interactive tabs. But the role-switch is a key demo beat — it should feel cinematic, not like clicking a navigation tab. The visual weight of the active tab (dark navy background, white text) is fine, but the overall switcher looks like a pill inside a form, not like a demonstration of a core product differentiator.

**6. Screen headings are plain utility labels**
`"Smart Intake + Validation"`, `"Stakeholder Views"`, `"System Impact + Scope"` are accurate functional labels but lack presentational energy. The Overview screen uses Roca Two serif at 60px for the hero headline — every other screen defaults to 20–21px semibold sans for its h1. The visual register drops dramatically when navigating away from Overview.

**7. FormExplorer modal is a buried feature**
The `FormExplorer.jsx` modal (which translates government form language to plain English) is one of the most compelling demonstrations in the prototype. It is accessible only by clicking a small form card in the Filing Package panel of the Intake screen — but with no explicit instruction or arrow pointing to it. The "plain language wizard" capability is hidden inside a two-click interaction path.

---

## Scrolling Problem Areas

| Screen | Problem content below fold | Approximate scroll required |
|--------|---------------------------|----------------------------|
| Overview (future) | Case Preview card, Scope Note | ~136px |
| Dashboard | Alerts column, Case Team, H-1B countdown | ~106px (worse w/ alert panel: ~326px) |
| Intake (post-validation) | "Fix" button on employer-name issue, all 3 issue cards | ~216px |
| Roles (applicant) | Eligibility Wizard, lower alert cards | ~516px |
| Impact | Navy quote block, 3-step summary | ~476px |

**Most problematic for video capture:** Roles and Impact, where the most emotionally resonant content (the eligibility wizard, the quote block) is the farthest below the fold.

**Most problematic for live demo:** Intake, where the core interactive moment (validation → fix → score animate) requires scroll during a time-sensitive animation sequence.

---

## Key Capability Proof Moments and Their Current Visibility

| Capability | Where it lives | Above-fold visibility | Demo clarity |
|------------|---------------|----------------------|--------------|
| Pre-submission validation (Kano: Basic) | Intake right panel, post-run | Score ring: visible. Issue cards + fix button: below fold | Moderate — requires scroll to reach fix action |
| Smart Intake / 1-entry sync (Kano: Basic) | Intake left panel + form cards | Left panel: above fold. Sync flash: center panel | Strong — form-card flash is clear and immediate |
| Unified cross-agency dashboard (Kano: Performance) | Dashboard main grid | Agency Status: above fold after timeline | Strong — reads clearly without scrolling |
| H-1B auto-trigger extension (Kano: Performance) | Dashboard right sidebar compact card | Below fold on standard viewport | Weak — the "102 days" number is compelling but buried |
| Plain-language wizard (Kano: Delighter) | Roles → Applicant → Eligibility Wizard | Well below fold (~y=780px) | Weak — longest scroll in the prototype |
| Role-based views (Kano: Delighter) | Roles screen, role switcher | Switcher above fold, content immediately visible | Moderate — switching is visible but low visual weight |
| Handoff SLAs / Case Team | Dashboard left panel | Below fold | Weak — this is a Performance capability buried at ~y=800px |
| FormExplorer gov-to-plain translation | Intake form card click | Two clicks deep, zero wayfinding | Weak — audience would not discover without guidance |

---

## Overall Assessment: How Presentation-Ready Is This Website?

**Rating: 5/10 — compelling content, app-UI delivery.**

The content and data model are genuinely strong. The mock case (Prajwal Kulkarni / HPE / EB-2 India) is specific and credible. The validation flow, score animation, and form-sync flash are the best interactive proof moments in the prototype and they work. The color palette and typography on the Overview hero are presentation-grade.

The fundamental problem is that the prototype was built as a thorough **application** and not as a **cinematic demo**. Applications optimize for feature completeness and information density. Demo prototypes optimize for a single dominant visual per "beat," zero scrolling, and a guided narrative arc. Right now, every screen except Overview tries to present everything it knows at once.

**Three things most damaging to the promo video:**

1. **Scrolling during animated moments.** On Intake, the best animation (score 72→80 + form card flash) requires the viewer to already be scrolled to the bottom of the right panel. For a Remotion capture, this means either the animation plays off-camera or the camera must pan — neither looks clean.

2. **No screen-level narrative momentum.** Screens 3, 4, and 5 open with plain utility headings (`"Smart Intake + Validation"`, `"Stakeholder Views"`) at 21px font size. There is no architectural signal to a first-time viewer that they are about to see something important.

3. **The Roles screen's best content (Eligibility Wizard) requires ~516px of scrolling.** This is the furthest any key proof moment is from the fold. In a 3-minute promo video, that moment is either cut entirely or it requires a jump-cut that breaks the demo's continuity.

**What is working and should be preserved:**
- The `ReadinessScore` animated ring — do not touch it
- The Overview hero toggle (Today / CaseBridge) — strongest composition in the prototype
- The Intake three-panel layout structure — the concept is right, just needs scroll relief
- The mock data specificity — "hyphen in employer name triggers RFE" is a concrete, memorable story
- The FormExplorer modal — excellent content, just needs better discoverability

**Key opportunity:** The prototype has the right capabilities demonstrated; the problem is viewport management. A targeted intervention — reducing the Intake right panel to a single visible view, giving the Roles screen a full-viewport Eligibility Wizard beat, and adding one directed CTA to FormExplorer — would move this from 5/10 to 8/10 for a live demo without rebuilding anything.
