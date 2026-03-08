---
name: capability-design
description: >
  Translates diagnosed pain points into future-state capabilities and
  demoable product features. Use when converting RCA findings into
  "Ability to" statements, designing demo feature specs, mapping
  capabilities to stakeholders, or creating the bridge between
  analysis and prototype. Follows MGT 120 capability design rules.
---

# Capability Design Skill

Converts root-cause findings into structured capabilities and maps them to demoable features for the H-1B → Green Card platform prototype (CaseBridge).

## When to Use

- After completing an RCA or diagnosis
- When defining what the future-state system should be able to do
- When specifying demo features for the prototype website
- When mapping capabilities to stakeholder needs
- When prioritizing what to build vs what to acknowledge as out of scope

## Capability Format

Every capability MUST follow this structure:

**Ability to** + **verb** + **noun** + **measurable outcome**

Examples:
- Ability for immigration attorneys to run automated cross-form consistency checks at filing time, flagging 90%+ of terminology/data mismatches that currently trigger RFEs (reducing RFE rate from ~25% to <5%)
- Ability for applicants and attorneys to view end-to-end case status across DOL/USCIS/DOS in a single unified dashboard with next-step guidance, reducing status inquiry calls by 60%
- Ability for the filing system to auto-populate shared fields (name, DOB, A-number, employer EIN) across all concurrent forms from a single data entry, eliminating re-keying contradictions across 6+ forms
- Ability for employer HR systems to auto-trigger H-1B extension filings 90 days before expiration with pre-populated forms, eliminating missed-deadline risk
- Ability for applicants to complete a plain-language eligibility wizard that translates statutory criteria into guided yes/no checks, reducing attorney hours on basic eligibility from ~8 to ~3 hours per case

## Capability Card Template

For each capability, produce:

```markdown
### Capability: {Ability to + verb + noun + outcome}

**Problem Solved:** {1-2 sentences from the pain point, with a number}

**Kano Tier:** {Basic / Performance / Delighter}

**Stakeholders Served:** {who benefits and how}

**PPT Domains:** {which of People / Process / Technology / Culture this spans — mark with X}

**Demo Feature:** {what this looks like in the prototype}

**Key Interaction:** {the specific user action that demonstrates the capability}

**Metrics:**
- Leading: {controllable behavior that predicts the outcome}
  - Current: {baseline}
  - Target: {goal}
- Lagging: {after-the-fact result}
  - Current: {baseline}
  - Target: {goal}

**Scope Boundary:** {what this capability does NOT cover}
```

## Priority Framework: Kano-First

Capabilities MUST be classified and ordered using the Kano model:

### 1. Basic (Must-Have) — Build First
Absence causes filing failures, trust collapse, or process breakdown. Invisible when present, catastrophic when absent.

**Test:** "If this capability is missing, does the filing fail or does the user lose trust?"

Examples from team research:
- Cross-form consistency checks (B1)
- Required-field validation at handoff stages (B2)
- Auto-populated shared fields across 6+ forms (B3)
- Pre-flight validation checking top 20 RFE triggers (B4)
- Pre-validated SOC/wage data for PWD (B5)

### 2. Performance — Build Second
Satisfaction scales linearly with investment. The more you invest, the more users are satisfied.

**Test:** "Does doing this faster/better directly increase user satisfaction?"

Examples from team research:
- Unified cross-agency dashboard (P1)
- Auto-triggered H-1B extensions (P2)
- Self-service wizard for basic form sections (P3)
- Visa bulletin movement alerts (P4)
- Case coordinator with SLAs at every handoff (P5)

### 3. Delighter — Build Last
Unexpected. Disproportionate satisfaction. Often low cost.

**Test:** "Would users be surprised and delighted by this? Would they not miss it if it wasn't there?"

Examples from team research:
- Plain-language eligibility wizard (D1)
- Proactive milestone notifications with plain-language next steps (D2)

### Why Kano Order Matters for the Demo

The prototype demonstrates capabilities in Kano order because the course teaches that Basics must be eliminated before investing in Performance or Delighters. Showing validation (Basic) before the dashboard (Performance) before the wizard (Delighter) proves the team understands prioritization, not just feature breadth.

## Metrics Rule

Every capability MUST have both a leading and lagging indicator:

- **Leading indicator:** A forward-looking, controllable behavior that predicts the outcome. Example: "% filings passing cross-form consistency check before submission"
- **Lagging indicator:** An after-the-fact result. Example: "RFE rate"

This distinction matters because the course explicitly teaches it and because the team's spreadsheet already classifies all measures this way.

## Capability-to-Demo Mapping

When designing demo features, follow these rules:

1. **One capability = one demo moment** — don't combine capabilities into a single screen
2. **Show the before/after** — every demo moment should imply what the current state looks like
3. **Use the same case data** — all capabilities demonstrated through the flagship case (Yuto Sato → Helix Systems → Chen & Patel Immigration)
4. **Make state changes visible** — validation scores, progress bars, status changes should animate
5. **Design for capture** — every interaction should be scriptable for Remotion
6. **Follow Kano order** — demonstrate Basics first (intake, validation), then Performance (dashboard, extensions), then Delighters (wizard, notifications)

### Demo Feature Map (from team research)

| ID | Capability | Kano | Demo Feature | Key Interaction |
|----|-----------|------|-------------|----------------|
| B1 | Cross-form consistency checks | Basic | Validation panel with issue cards | "Check Filing Readiness" → issues appear |
| B3 | Auto-populate shared fields | Basic | Intake form with synced form cards | Enter field → 6 form cards update |
| B4 | Pre-flight validation engine | Basic | Readiness score + issue severity | Fix issue → score improves |
| P1 | Unified cross-agency dashboard | Performance | Timeline with DOL/USCIS/DOS stages | View case across all agencies |
| P2 | Auto-triggered extensions | Performance | Deadline alert with auto-trigger indicator | H-1B 102 days → auto-trigger at 90 |
| D1 | Plain-language wizard | Delighter | Applicant view with guided next steps | Role switch to applicant → plain language |
| D2 | Milestone notifications | Delighter | Status notification cards | Proactive "your I-140 was approved" |

## Scope Discipline

### What capabilities should cover (avoidable friction):
- Data quality and consistency
- Status visibility and transparency
- Deadline management and automation
- Plain-language communication
- Cross-stakeholder coordination
- Handoff ownership and SLAs

### What capabilities should NOT try to cover (structural constraints):
- Visa cap limits
- Per-country backlogs / retrogression
- USCIS adjudication speed
- Legislative reform
- Agency staffing levels
- OPT pipeline governance

When a capability bumps against a structural constraint, acknowledge it explicitly:

> "This capability reduces avoidable filing delays but does not affect the structural visa backlog. The applicant's priority date wait is determined by per-country caps, which require legislative action."

## Output

Write capability definitions to the specified file path. Return a summary:

```
Wrote capability definitions to: {path}
- Capabilities defined: {count}
- Top priority (Basic): {highest-impact Basic capability}
- Kano distribution: {X Basic, Y Performance, Z Delighter}
- Structural constraints acknowledged: {count}
```
