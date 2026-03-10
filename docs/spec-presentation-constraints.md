# Spec Presentation Constraints — Extracted Reference

Sources: specs 02, 04, 05. Read-only extraction — do not modify the source specs.

---

## 1. Presentation Flow (from spec 02 + 05)

### Default demo path (spec 02)
1. Overview
2. Case Workspace
3. Smart Intake + Validation
4. Role Views
5. System Impact + Scope

### Recommended shot order (spec 05, 14 beats)
1. Current-state chaos framing
2. Overview / hero
3. Case workspace
4. Timeline focus
5. Intake sync
6. Validation issue appears
7. Field corrected
8. Readiness score improves
9. Role switcher: applicant
10. Role switcher: employer
11. Role switcher: attorney
12. Deadline alert / extension protection
13. Scope clarity / broader reform layer
14. Final impact close

### Story arc structure (spec 05, 8 beats)
- Beat 1: current-state tension — fragmentation and opacity
- Beat 2: introduce the platform — shared case record as centerpiece
- Beat 3: shared case workspace — single source of truth embodied
- Beat 4: smart intake and validation — catch contradictions before filing
- Beat 5: role switcher — same case, different stakeholder priorities
- Beat 6: deadline protection — extension risk made visible earlier
- Beat 7: scope clarity — honest about what the portal does not solve
- Beat 8: close on impact — metrics and a single strong closing line

### Visual pacing (spec 05)
- First 10-15 seconds: fast tension and framing (current-state chaos)
- Middle: slower, more legible product proof
- End: crisp synthesis and close

### Target length
- 75 to 120 seconds total
- Hard cap: do not exceed 2 minutes

---

## 2. Visual Composition Requirements (from spec 04)

### Emotional tone
- Trust, clarity, control, seriousness, reduced chaos
- NOT: flashy startup energy, consumer app playfulness, cluttered enterprise admin, hacker dashboard

### Visual keywords
- calm, institutional, premium, clear, structured, elegant, restrained, cinematic enough for a demo video

### Color palette
- Deep navy / slate — credibility
- Warm off-white / stone — backgrounds
- Muted gold or amber — premium accent
- Green — resolved / healthy / ready
- Amber — caution
- Red (sparingly) — blockers
- Cool blue — informational system status
- Saturation: moderate; nothing neon

### Typography hierarchy
- Hero headline: large, confident, 1-2 lines max
- Screen title: clear and sober
- Section headers: compact but strong
- Labels: crisp; uppercase/small-caps only when useful
- Body copy: short, readable, never dense

### Layout principles
- Generous whitespace
- Clear card hierarchy
- Strong alignment
- Shallow visual nesting (no more than 2 depth levels)
- Avoid walls of small text
- Favor 2-column layouts for complex screens
- Prioritize focal hierarchy over data density

### Per-screen composition rules
- **Home**: one dominant headline, one supporting paragraph, one visual case/system summary, one compact metrics row, no more than four capability blocks
- **Case**: hero area for case header; timeline high in the layout; alerts visible without scrolling; next step clearly visible; supporting details below
- **Intake**: shared record and form sync immediately legible; issues panel visually distinct; changes easy to notice
- **Roles**: role switcher prominent; layout visibly adapts per role; change must not feel superficial
- **Impact/Scope**: feels like a strong closing argument; concise comparative blocks; explicitly separates direct portal value from broader reform needs

### Motion principles
- Good: fades, small slides, progress fill, highlight transitions, score changes, role switch transitions, issue resolution animations
- Bad: bouncy transitions, excessive parallax, distracting entrance choreography, long cinematic sequences inside the app

### UI components required
- Hero header
- Journey / stage bar
- KPI chips or summary cards
- Alert rail
- Segmented control for role switcher
- Document stack or synced form cards
- Issue list / validation cards
- Plain-language guidance card
- Scope / system impact block

### UI components to avoid
- Heavy tables (unless tightly scoped)
- Giant accordions
- Excessive tabs
- Tiny pills everywhere
- Full-screen modals that cover the experience
- Overly detailed fake government forms

---

## 3. Demo Narrative Sequence (ordered)

### Core narrative statement (spec 05)
"Today's H-1B to green card process is fragmented and opaque. A shared case system can reduce avoidable friction, catch issues earlier, and align applicant, employer, and attorney around one source of truth. It improves the process without pretending to solve structural scarcity."

### Ordered screen-by-screen story
| Order | Screen | One-sentence job |
|-------|--------|-----------------|
| 1 | Current-state contrast | Emotionally frame the problem before the product appears |
| 2 | Overview | Introduce the platform as the technology centerpiece |
| 3 | Case Workspace | Embody the single source of truth |
| 4 | Smart Intake + Validation | Demonstrate issue prevention — the highest-leverage proof |
| 5 | Role Views | Show stakeholder alignment without duplication of data |
| 6 | (Deadline alert, within Case or Roles) | Prove operational value for employers |
| 7 | System Impact + Scope | Keep the argument honest; separate portal scope from broader reform |
| 8 | Final impact close | End with confidence, metrics, and a memorable closing line |

### On-screen caption vocabulary (spec 05)
- "Fragmented today"
- "One shared record"
- "Catch issues earlier"
- "Same case, different roles"
- "Deadlines made visible"
- "Process help, not magic"
- "Better coordination, fewer surprises"

### Ending frame options (spec 05)
- Option A: "One source of truth for a fragmented journey"
- Option B: "Reduce rework. Clarify status. Align stakeholders."
- Option C: "A better process, even before broader reform."

### Key visual proof moments that must read without audio (spec 05)
1. Multiple forms syncing from one source
2. Validation issue appears
3. Issue resolves
4. Readiness score improves
5. Role change visibly alters the interface
6. One case visible across multiple agencies
7. Scope note appears — prevents overclaiming

---

## 4. Remotion-Specific Requirements (from specs 02 + 04 + 05)

### Hard requirements
- Deterministic state — no random data, no jittery reflow
- Stable layouts — minimal scroll dependence
- Key moments accessible directly (not buried behind many clicks)
- Components can appear "already loaded" for recording if needed
- All state changes must be easy to trigger programmatically

### Strongly recommended
- URL params or debug toggles for screen / role / validation state (e.g., `?screen=intake&validated=true&fixed=employer-name&role=attorney`)
- Ability to trigger transitions programmatically
- "Demo mode" with polished seeded state
- Optional autoplay sequence for key flows
- Reset to initial state option

### Remotion framing
- Design optimized for 16:9 framing
- Desktop browser recording viewport (presentation laptop)
- Avoid interactions that depend on precise cursor work
- Text must read clearly when projected

### Editing principles for the Remotion phase
- Prefer clean hard cuts plus soft motion inside scenes
- Let key interfaces breathe long enough to understand
- Do not stack too many simultaneous callouts
- Each shot should have one takeaway

---

## 5. Constraints That Must Be Preserved in Any Redesign

### Architecture constraints (spec 02)
- Maximum 5 core screens in the main prototype
- Maximum 2 depth levels — no nested tabs inside nested tabs
- No hidden content essential to the demo
- No modal dependencies that are hard to film
- No tab sprawl
- Every screen understandable in under 5 seconds
- Each screen has one dominant message and one primary interaction

### Screen acceptance test (spec 02 checklist, per screen)
- Can it be explained in one sentence?
- Is there a dominant focal point?
- Is the primary action obvious?
- Does it support the story?
- Will it record cleanly in Remotion?

### Content density rules (spec 04)
- Keep paragraphs short
- Break content into meaningful cards
- Do not overload any screen with more than one "story"
- Use numbers only when they reinforce the message
- Never force a viewer to read dense prose to understand the point

### Demo mode requirement (spec 04)
- Seeded fictional case (Prajwal Kulkarni / HPE / Chen & Patel)
- Polished deterministic data
- Known issue set
- Reversible interactions
- Reset option always available

### Copy style rules (spec 04)
- Clear, informed, concise, human
- Avoid: legalese overload, marketing hype, AI buzzword spam, exaggerated product claims
- Applicant copy: simple and reassuring
- Employer copy: operational and risk-aware
- Attorney copy: compliance-focused and precise

### Final aesthetic test (spec 04)
"If someone paused on any major screen, it should look like a real concept product, a polished final-presentation artifact, something worth screen-recording. If it looks like a student dashboard with too many widgets, it is off target."

### Scope boundary that must always appear (specs 01, 02, 05)
The portal must include an explicit statement that it does NOT create new visa supply, does not fix caps, retrogression, or staffing. The scope note increases credibility — it must not be omitted from any demo revision.

---

## Quick Reference: Screen States Required (spec 05)

The app must support these discrete states for filming:
- Clean overview state
- Clean case state
- Validation issue state (issues visible, score low)
- Resolved issue state (issues cleared, score improved)
- Role-specific UI states (applicant / employer / attorney)
- Impact / scope state
- Stable final frame (suitable for a hold / freeze at end of video)
