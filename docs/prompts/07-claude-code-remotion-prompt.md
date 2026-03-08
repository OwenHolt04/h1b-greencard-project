# Claude Code Remotion Prompt

Use these skills in this session:
- /remotion-best-practices
- /web-design-guidelines
- /frontend-design
- /it-management-expert
- /ui-ux-pro-max

I have a website prototype (CaseBridge) for an MGT 120 final presentation about the H-1B to employment-based green card process. I need a polished **Remotion demo video** from it.

## Source of Truth

Use the attached specs:
1. `01-product-vision-demo-goals.md` — Product thesis, capabilities, Kano ordering
2. `02-ux-information-architecture-screen-specs.md` — Screen content and interactions
3. `03-data-model-mock-logic-interaction-states.md` — Case data, validation logic, role transforms
4. `04-visual-system-presentation-build-constraints.md` — Visual system and motion rules
5. `05-demo-narrative-shot-plan.md` — **Primary guide for the video** — beat structure, timing, shot sequence, captions

Also reference the built app's actual component structure and state model.

## Goal

Create a presentation-ready product walkthrough video that:
- Clearly communicates the future-state concept in 75-120 seconds
- Follows the 8-beat narrative in Spec 5
- Highlights the validation-catches-issue moment as the most memorable beat
- Looks polished enough to play during a 20-minute class presentation
- Feels institutional and credible, not like a startup promo

## Context in the Presentation

This video plays during the "technological solutions" section of the team's future-state argument. The presentation flow is:
1. Intro (American Dream framing, statistics)
2. Current state by stakeholder (applicant, backlogs/process, employer, education)
3. **Future state: capabilities → technological solutions → THIS DEMO**
4. Execution, stakeholder alignment, Q&A

The audience is: professor, TAs, panelists, classmates. They have just seen the team's current-state pain points and capabilities. The demo needs to translate those capabilities into a tangible, visual proof.

## Required Sequence (from Spec 5)

| # | Beat | Duration | What to Show |
|---|------|----------|-------------|
| 1 | Current-state framing | 10-15s | Text overlay: "3 agencies. 4 portals. 0 dashboards." |
| 2 | CaseBridge overview | 10-15s | Hero + capability cards with metrics |
| 3 | Smart intake + form sync | 10-15s | Shared fields → 6 form cards with sync indicators |
| 4 | Validation catches SOC mismatch | 15-20s | "Check Readiness" → issues appear → SOC/wage flagged HIGH |
| 5 | Fix + score improvement | 10-15s | Employer name fixed → cards update → score 72→80 |
| 6 | Role switcher (3 views) | 20-25s | Applicant → Employer/HR → Attorney |
| 7 | Scope clarity | 10-15s | Two-column: solves directly / requires broader reform |
| 8 | Close | 5-10s | Final statement + metrics strip |

Target: 95-140 seconds total.

## On-Screen Captions

Use short, high-signal phrases:
- "3 agencies. 4 portals. 0 dashboards."
- "One shared case record"
- "Enter once. Sync across 6 forms."
- "Catch errors before filing"
- "Fix once. Update everywhere."
- "Same case. Different roles."
- "Process improvement. Not magic."
- "Reduce rework. Clarify status. Align stakeholders."

## Visual Language

Use the website UI as the hero visual. Supplement with:
- Section title cards between beats
- Subtle callout highlights on key elements
- Magnified focus on the validation issue moment
- Smooth transitions between screens
- Role switch transition emphasis

Do NOT bury the product under motion graphics. The app IS the visual.

## Style

Premium, restrained, modern, legible, credible. Match Spec 4's design language.

Avoid: flashy promo energy, excessive motion graphics, marketing hype tone, trailer music bombast.

## Build Approach

- Modular scene components (one per beat)
- Reusable caption/callout components
- Clean timing controls per scene
- Easy text replacement for iteration
- Stable layout framing
- No brittle screenshot-based approach — render the actual app or use high-quality captures

## Audio Direction

If music: ambient, modern, subtle tension-to-clarity arc. No stock corporate music. Keep it low enough that captions are the primary information channel.

If voiceover: use the direction from Spec 5 beats as a script skeleton. Keep it under 120 words total.

## Technical Needs

Structure so I can easily:
- Swap caption text
- Adjust timing per beat
- Replace screen captures if the app changes
- Export at 1920x1080 / 30fps minimum
- Create a short version (60s) and full version (120s) if practical

## Deliverables

1. Remotion scene structure (one component per beat)
2. Implemented composition(s)
3. Timing map showing seconds per beat
4. Caption text (final version)
5. Instructions for updating if the app changes
6. Export guidance (format, resolution, codec)

## Most Important Constraint

This is not a generic product promo. It is a polished future-state demonstration grounded in a team's actual research about immigration process coordination failures. Every number is real. Every capability is traced to a pain point. The video should feel like evidence, not marketing.
