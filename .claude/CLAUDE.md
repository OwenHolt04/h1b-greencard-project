# H-1B → Green Card System Redesign — MGT 120 Final Project

## What This Is

Team project analyzing the U.S. employment-based immigration pathway (H-1B → PERM → I-140 → I-485) and proposing future-state capabilities. Final deliverable: 20-minute presentation + demo website + Remotion video.

## Core Thesis

A single-source-of-truth coordination platform reduces avoidable friction across the H-1B to green card journey by validating data early, unifying case visibility across stakeholders, and making status understandable. It does NOT fix structural visa scarcity, caps, or retrogression — and the project is explicit about this boundary.

## Key Stakeholders

- Immigrant worker (applicant)
- Employer / HR
- Immigration attorney
- USCIS, DOL, State Department (DOS)

## Highest-Value Capabilities (Demo Priority)

These are the top-5 from the team's full Pain Points & Capabilities inventory (see `docs/Pain_Points_Capabilities.xlsx`). The spreadsheet contains 40+ capabilities across 5 domains (Backlogs/Delays, Employers, US Labor Force, STEM OPT Pipeline) with Kano classifications and lead/lag measures.

Demo priority order follows Kano:

**Basic (must demonstrate first):**
1. **Pre-submission validation** — cross-form consistency checks catching 90%+ RFE triggers before filing (RFE rate: ~25% → <5%)
2. **Single intake / smart form** — enter data once, auto-populate across ETA-9089, I-140, I-485, I-765, I-131, G-28 (eliminate re-keying contradictions across 6+ forms)
3. **Handoff-stage validation** — required-field checks at each stage (PWD → PERM → I-140 → I-485) preventing incomplete submissions from advancing
4. **Pre-validated SOC/wage data** — reduce PWD revision cycles from ~15% to <3%

**Performance (demonstrate second):**
5. **Unified cross-agency dashboard** — one view across DOL, USCIS, DOS replacing 4 portals + 1 mailbox + 0 dashboards (status inquiry calls: -60%)
6. **Auto-triggered extension management** — fire 90 days before H-1B expiry, protect against deadline risk (per-extension cost: -50%)
7. **Case coordinator SLAs** — named owners and response-time SLAs at every handoff (idle time: weeks → <5 business days)

**Delighter (demonstrate for emotional impact):**
8. **Plain-language wizard** — translate eligibility criteria from 20+ page manuals into guided yes/no checks (attorney basic-eligibility hours: ~8 → ~3)
9. **Proactive milestone notifications** — plain-language status at each milestone (applicant status calls: -70%)

## Demo Website Strategy

The website is NOT a full SaaS mock. It is a **presentation-optimized, scenario-driven prototype** anchored on:

- One flagship case: Yuto Sato (applicant) → Helix Systems (employer) → Maya Chen, Chen & Patel Immigration (attorney)
- One shared data model with deterministic mock state
- **5 core screens**: Overview → Smart Intake + Validation → Case Dashboard → Stakeholder Views → Impact + Scope
- Designed for Remotion capture (deterministic, visually legible, stateful interactions)
- Kano-ordered demo flow: Basics (validation, intake) → Performance (dashboard, extensions) → Delighters (wizard, notifications)

## Build Specs

The website prototype is defined by 5 spec documents. **Read these before building anything:**

| File | Contains |
|------|----------|
| `docs/specs/01-product-vision-demo-goals.md` | What the product proves, capabilities with Kano tiers and measures, success criteria |
| `docs/specs/02-ux-information-architecture-screen-specs.md` | Exact screens, content, interactions, acceptance checklist |
| `docs/specs/03-data-model-mock-logic-interaction-states.md` | Seeded case data (JSON), validation issues, role transforms, state machine |
| `docs/specs/04-visual-system-presentation-build-constraints.md` | Design language, color, typography, layout, motion, technical stack |
| `docs/specs/05-demo-narrative-shot-plan.md` | Demo sequence, pacing, shot list, captions, Q&A defense mapping |

The specs are grounded in the team's actual Pain Points & Capabilities spreadsheet. Every metric in the prototype should trace to that research.

## What the Portal Does NOT Solve

- Visa caps and per-country limits (statutory; requires congressional action)
- USCIS adjudication backlogs (agency capacity; requires appropriations)
- Full retrogression / priority date wait times (legislative)
- Policy-level reform: OPT alignment, staffing increases, education pipeline, employer standardization

These are argued for separately in the presentation as complementary system levers. The portal is the technology centerpiece of a broader multi-lever future-state argument.

## Presentation Context

The team's presentation flow (from OH planning):
1. **Intro** — American Dream framing, personal stories, statistics
2. **Current State** (5-7 min) — Applicant perspective → Backlogs/process → Employer → US Education
3. **Future State** — Backlogs/process capabilities → Employer capabilities → Education capabilities → **Technological solutions (portal demo lives here)**
4. **Execution** — Stakeholder alignment, implementation approach
5. **Q&A defense** — prepared for: cost, agencies, bottlenecks, opposition, caps vs. process

## Framework Sequence (MGT 120)

Problem Statement → Scope → RCA → SIPOC → Customer Journey → IT Stack → System Maps → Capabilities → Metrics

## Quality Standards

All analytical output should pass the professor.md self-audit:
- Problem statements: English + Math + Impact
- RCA domains: configured with case-specific names (not generic "People, Process, Tech")
- Insights: diagnose WHY, not just describe WHAT
- Capabilities: testable, traceable to pain points, Kano-classified
- Data: specific numbers with context, not vague sentiments

## Skills & Agents

- `/immigration-system-analysis` — diagnostic frameworks for the immigration process
- `/capability-design` — pain point → capability → demo feature translation
- `immigration-systems-expert` agent — spawned for process/org diagnosis and design

## Tech Stack (for demo build)

- React (Vite or Next.js) with Tailwind CSS
- Local seeded mock data, deterministic state machine
- React context or Zustand for state management
- No backend, no external APIs, no auth
- Remotion for video capture (later phase)
- URL params or state toggles for screen/role/validation state
