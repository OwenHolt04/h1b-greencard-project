# 04 Visual System + Presentation + Build Constraints

## Design intent
The prototype should look like a polished cross between premium legal-tech, modern gov-tech, and a high-end strategy demo. It should feel credible, restrained, and presentation-ready.

## Emotional tone
The visual system should communicate:
- trust
- clarity
- control
- seriousness
- reduced chaos

It should **not** communicate:
- flashy startup exuberance
- playful consumer app energy
- cluttered enterprise admin sprawl
- “hacker dashboard” vibes

## Visual keywords
- calm
- institutional
- premium
- clear
- structured
- elegant
- restrained
- cinematic enough for a demo video

## Color direction
Recommended palette:
- deep navy / slate for credibility
- warm off-white / stone backgrounds
- muted gold or amber accent for premium emphasis
- green for resolved / healthy / ready
- amber for caution
- red used sparingly for blockers
- cool blue for informational system status

Keep saturation moderate. Nothing neon.

## Typography direction
Use a highly readable sans-serif for body and UI. Use a refined serif or strong display face only for hero moments, section headers, and major figures if needed.

### Suggested hierarchy
- hero headline: large, confident, 1 to 2 lines max
- screen title: clear and sober
- section headers: compact but strong
- labels: crisp, uppercase or small-caps only when useful
- body copy: short, readable, never dense

## Layout principles
- generous whitespace
- clear card hierarchy
- strong alignment
- shallow visual nesting
- avoid walls of small text
- favor 2-column layouts for complex screens
- prioritize focal hierarchy over data density

## UI components to include
- hero header
- journey / stage bar
- KPI chips or summary cards
- alert rail
- segmented control for role switcher
- document stack or synced form cards
- issue list / validation cards
- plain-language guidance card
- scope / system impact block

## UI components to avoid
- heavy tables unless tightly scoped
- giant accordions
- excessive tabs
- tiny pills everywhere
- modals that cover the whole experience
- overly detailed fake government forms

## Iconography
Use icons sparingly and consistently. Prioritize clarity over novelty:
- timeline / milestones
- alerts
- documents
- roles
- validation
- agency connections

## Motion principles
Motion should feel deliberate and calm.

### Good motion
- fades
- small slides
- progress fill
- highlight transitions
- score changes
- role switch transitions
- issue resolution animations

### Bad motion
- bouncy transitions
- excessive parallax
- distracting entrance choreography
- long cinematic sequences inside the app itself

## Presentation constraints
The prototype will be:
- shown live in class
- likely projected
- later turned into a Remotion walkthrough

Therefore, it must:
- read clearly at a distance
- support 16:9 framing
- avoid tiny text
- avoid interactions that depend on precise cursor work
- maintain visual clarity when recorded

## Remotion-friendliness constraints
The product should be easy to film.

### Required characteristics
- deterministic state
- stable layouts
- no random data
- no jittery reflow
- minimal scroll dependence
- key moments accessible directly
- components can appear “already loaded” for recording if needed

### Nice-to-have
- query params or debug toggles for screen/role/state
- ability to trigger transitions programmatically
- “demo mode” with polished seeded state
- optional autoplay sequence for key flows

## Screen composition rules

### Home screen
- one dominant headline
- one supporting paragraph
- one visual case / system summary
- one compact metrics row
- no more than four capability blocks

### Case screen
- hero area for case header
- timeline high in the layout
- alerts visible without scrolling
- next step clearly visible
- supporting details below

### Intake screen
- shared record and form sync must be immediately legible
- issues panel should be visually distinct
- changes should be easy to notice

### Role screen
- role switcher should be prominent
- layout should visibly adapt per role
- avoid making the change feel superficial

### Impact / scope screen
- should feel like a strong closing argument
- use concise comparative blocks
- explicitly separate direct portal value from broader reform needs

## Content density rules
- keep paragraphs short
- break content into meaningful cards
- do not overload any screen with more than one “story”
- use numbers only when they reinforce the message
- never force a viewer to read dense prose to understand the point

## Brand / naming guidance
You can use a polished concept brand like:
- CaseBridge
- PathwayOS
- OpenCase
- BridgePath

The name should feel credible and not gimmicky.

## Accessibility
- WCAG-conscious contrast
- readable font sizes
- clear focus states if interactive
- do not rely on color alone for critical meaning
- keep labels understandable for non-experts

## Technical build constraints

### Preferred stack
A modern React/Next.js-style prototype is ideal, but any clean front-end implementation is acceptable if it is polished, responsive, and easy to capture in Remotion later.

### Build priorities
1. visual polish
2. stateful demo logic
3. Remotion compatibility
4. responsive desktop layout
5. maintainable component structure

### De-prioritize
- auth
- backend integrations
- file upload infrastructure
- real external APIs
- production-grade data persistence

## Component architecture guidance
Build reusable components for:
- stage timeline
- role switcher
- case summary cards
- issue cards
- synced form cards
- alert items
- scope / system levers section

## Demo mode requirement
Include a visible or hidden **demo mode** assumption:
- seeded fictional case
- polished data
- known issue set
- reversible interactions
- reset option

## Copy style
Text should sound:
- clear
- informed
- concise
- human

Avoid:
- legalese overload
- marketing hype
- AI buzzword spam
- exaggerated product claims

## Final aesthetic test
If someone paused on any major screen, it should look like:
- a real concept product
- a polished final-presentation artifact
- something worth screen-recording

If it looks like a student dashboard with too many widgets, it is off target.