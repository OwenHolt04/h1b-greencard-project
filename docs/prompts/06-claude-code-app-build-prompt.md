# Claude Code App-Build Prompt

Use these skills in this session:
- /web-design-guidelines
- /frontend-design
- /it-management-expert
- /ui-ux-pro-max

I am building a **presentation-first website prototype** for an MGT 120 final presentation about the H-1B to employment-based green card process.

## Source of Truth

Treat the attached markdown specs as the **primary source of truth**:
1. `01-product-vision-demo-goals.md` — What the product proves, which capabilities it demonstrates, Kano ordering
2. `02-ux-information-architecture-screen-specs.md` — Exact screens, content, interactions, acceptance criteria
3. `03-data-model-mock-logic-interaction-states.md` — Seeded case data, validation issues, role transforms, state machine
4. `04-visual-system-presentation-build-constraints.md` — Design language, layout rules, motion, technical stack
5. `05-demo-narrative-shot-plan.md` — Demo sequence, pacing, what each beat must prove

**Critical context:** These specs are grounded in a real student team's research. The capabilities, metrics, pain points, and measures are not hypothetical — they come from the team's Pain Points & Capabilities inventory with specific Kano classifications (Basic/Performance/Delighter), leading/lagging indicators, and PPT domain markings. Every number in the prototype should trace to this research.

## Bounded Discretion

The specs are detailed but may not perfectly encode every nuance of optimal visual/UX expression. You should follow them closely while also using strong judgment about:

- Presentation effectiveness and legibility
- Frontend hierarchy and composition
- Screen-recording friendliness
- Stronger visual translation of project insights into interface
- Demo storytelling quality

If you are **highly confident** that a revision to screen structure, module hierarchy, microcopy, layout, or implementation approach would produce a meaningfully stronger result while honoring the same thesis and capabilities, you may make that revision.

### You May Refine
- Visual hierarchy, layout composition, and spacing
- Navigation labels and ordering
- Microcopy for clarity and credibility
- Component design for stronger presentation impact
- Screen structure if it creates a tighter, more legible experience
- The translation of project metrics into visual elements

### You Must Preserve
1. One flagship fictional case (Yuto Sato, Helix Systems, Immigration Attorney)
2. A single shared case record as the conceptual center
3. Role-based views for applicant, employer/HR, and attorney
4. Smart intake + form sync + validation as a major demo moment with the specific issues from Spec 3 (employer name mismatch, SOC/wage mismatch, travel history gap)
5. Unified cross-agency dashboard (DOL/USCIS/DOS) as a major demo moment
6. Deadline/extension visibility (H-1B expires in 102 days, auto-trigger at 90)
7. Plain-language guidance throughout
8. A compact scope-clarity section distinguishing what the portal solves from what requires broader reform
9. The prototype must remain presentation-first and Remotion-friendly
10. Every metric must trace to the team's actual research (numbers from Spec 1 capability tables)

## What to Build

A polished, modern, highly visual front-end prototype designed for:
- A live class presentation (projected on screen)
- A later Remotion demo video capture
- Believable deterministic interactions around one case
- A "single source of truth" thesis

This is **not** a sprawling SaaS product. It is a compact, coherent, cinematic demo environment with 5 screens.

## Product Concept

A shared case platform aligning applicant, employer/HR, and attorney around one record. It reduces avoidable friction by:
- Entering shared data once and syncing across 6+ forms (ETA-9089, I-140, I-485, I-765, I-131, G-28)
- Catching contradictions before filing (RFE rate target: ~25% → <5%)
- Showing cross-agency status in one place (status inquiry calls target: -60%)
- Translating complexity into plain language (attorney basic-eligibility hours: ~8 → ~3)
- Making deadline risk visible (auto-trigger extensions 90 days before expiry)

It explicitly communicates that the portal improves process quality **without claiming to solve structural constraints like visa caps or retrogression.**

## Information Architecture: 5 Screens

| Screen | Primary Job | Kano Tier |
|--------|------------|-----------|
| **Overview** | Introduce thesis, show 4 capability cards with metrics, CTA to case | Framing |
| **Intake + Validation** | Enter once → sync → validate → catch issues → fix → readiness improves | Basic (B1-B5) |
| **Dashboard** | Cross-agency timeline, alerts, plain-language next steps, metrics | Performance (P1-P5) |
| **Stakeholder Views** | Same case, 3 roles, different priorities/tone/actions | All tiers |
| **Impact** | What portal changes (with team's actual metrics) vs. what requires broader reform | Synthesis |

You may adjust labels or navigation details, but keep it to ≤5 core screens. No tab sprawl.

## Design Direction

Premium legal-tech / gov-tech: calm, institutional, restrained, elegant, highly legible at projection distance.

Palette: deep navy/slate, warm off-white background, muted gold accent, green for resolved, amber for caution, red sparingly for blockers.

Avoid: flashy startup energy, cartoonish colors, dense admin clutter, gimmicky animations, consumer playfulness.

## Required Interactions

All deterministic and repeatable:
1. **Run validation** → show 3 issues (employer name mismatch [medium], SOC/wage mismatch [high], travel history gap [low])
2. **Fix employer name** → field updates in intake, form cards pulse/sync, issue resolves, readiness rises 72→80
3. **Switch roles** → applicant (plain language, reassurance) / employer (deadlines, cost, continuity) / attorney (issues, evidence gaps, filing controls)
4. **Deadline alert visible** → H-1B expiry 102 days, auto-trigger at 90
5. **Reset demo** → restore all issues, reset score to 72, return to Overview

## Technical Stack

- React (Vite or Next.js)
- Tailwind CSS or clean CSS approach
- Local seeded mock data (all data from Spec 3)
- React context or Zustand for state
- No backend, no external APIs, no auth
- URL params or state toggles for screen/role/validation state (Remotion-friendliness)

## Seeded Data

Use the exact fictional case from Spec 3:
- **Applicant:** Yuto Sato, Japanese national, MS CS Stanford, H-1B since 2019, priority date March 2024
- **Employer:** Helix Systems, Inc., enterprise software, San Jose, HR owner Rachel Torres
- **Attorney:** Maya Chen, Immigration Attorney
- **Stage:** I-485 package preparation
- **H-1B expiry:** June 15, 2026 (102 days)
- **Issues:** employer name format mismatch (medium), SOC/wage survey mismatch (high), travel history gap (low)
- **Readiness:** 72 baseline → 80 after employer name fix → 95 after all fixes

Do NOT use lorem ipsum anywhere. All names, dates, form codes, and metrics must be realistic and consistent.

## Content Guidance

- Concise, credible microcopy readable from a projector distance
- Plain-language for applicant-facing content ("Your case is on track")
- Operational language for employer-facing content ("Extension due in 102 days")
- Technical precision for attorney-facing content ("SOC 15-1256 classification risk")
- Every metric card should show a number from the team's research

## Motion Guidance

Restrained only: smooth fades, subtle slides, score count-up, form sync pulse, role switch crossfade, issue resolution animation. No bounce, no parallax, no confetti.

## Deliverables

1. **Build the app** — all 5 screens functional with demo interactions
2. **Polish to presentation quality** — legible at projection distance, clean at 16:9
3. **Ensure screen-recordable** — stable layouts, deterministic state, no jitter
4. **Summarize after building:**
   - File structure
   - Component structure
   - State model
   - How to trigger the optimal demo flow
   - What's mocked vs. stateful

## Required Post-Build Reflection

After building, include a **Design/Plan Refinements** section explaining:
- What you changed from the specs, if anything
- Why the change better serves the presentation or UX
- Which changes were layout-level vs. conceptual
- Which team research metrics are visible on each screen

## Execution Style

Do not broaden the concept. Do not add extra product areas. Do not turn this into a generic portal or a startup landing page. Make it feel intentional, cinematic, presentation-optimized, and grounded in the team's actual research — every number should be defensible, every capability traceable, every screen earning its existence.
