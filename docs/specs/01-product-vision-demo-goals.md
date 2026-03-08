# 01 Product Vision + Demo Goals

## Working title
**CaseBridge**  
Presentation-first prototype for the H-1B to employment-based green card journey.

## Purpose
This prototype exists to help an MGT 120 final presentation **show** a believable future state, not to simulate every workflow in a production immigration platform.

The site should make the audience understand, quickly and visually:

1. the current process is fragmented, opaque, and expensive to navigate
2. no single actor owns the end-to-end case
3. one shared system of record can reduce rework, uncertainty, and deadline risk
4. software improves process quality and coordination, but does not eliminate structural scarcity such as visa caps and retrogression

## Core thesis
The product demonstrates a **single source of truth coordination layer** across applicant, employer/HR, and attorney roles. It reduces avoidable friction by:
- collecting shared information once
- validating it before filing
- syncing it across forms and stages
- showing the same case across agencies in one unified timeline
- translating legal and process complexity into plain language

## What the prototype is
A **presentation-first, scenario-driven, semi-functional web prototype** that:
- is optimized for a live class presentation and a later Remotion demo video
- uses seeded mock data and deterministic interactions
- focuses on one flagship case journey
- includes role-based views for applicant, employer/HR, and attorney
- emphasizes the highest-value capabilities surfaced by project research

## What the prototype is not
This is **not**:
- a full enterprise SaaS admin suite
- a broad policy website with equal attention to every reform idea
- a realistic end-to-end system with full authentication, persistence, uploads, or agency integrations
- a claim that software alone solves visa cap scarcity, retrogression, or political volatility

## Success criteria
The prototype succeeds if a viewer can watch it for 60 to 150 seconds and clearly understand:
- what is broken today
- what the new system changes
- how the same case looks different to each stakeholder
- why the proposed portal is worth building even if broader structural reforms are still needed

## Primary audience
For the presentation:
- professor, TA, panelists, classmates

For the product framing inside the story:
- employer/HR teams
- immigration attorneys
- applicants / sponsored employees

## Presentation jobs to be done
The site must help the team:
1. move from current-state pain to future-state capability without a long verbal explanation
2. demonstrate one cohesive technology response rather than many disconnected ideas
3. answer likely Q&A on scope, realism, stakeholders, and tradeoffs
4. support a polished Remotion walkthrough later

## Product principles

### 1. Demo-first over feature breadth
Build only what improves clarity in the presentation or later video.

### 2. One case is better than many cases
A single flagship case with believable data is more persuasive than a broad but shallow multi-case interface.

### 3. Role-based lenses, shared truth
Applicant, employer/HR, and attorney should view the same underlying case record through different emphasis and permissions.

### 4. Clean and institutional, not startup-flashy
The visual language should feel like premium legal-tech / gov-tech: calm, credible, polished, restrained.

### 5. Interaction should be deterministic
Every major click, transition, and visible state change should be predictable enough to capture cleanly in Remotion.

### 6. Honest scope
The product should explicitly distinguish:
- what the portal solves directly
- what complementary reforms are still needed
- what remains structurally constrained

## High-priority capabilities to demonstrate
These are the capabilities the prototype must foreground.

### A. Smart intake / one source of truth
A shared intake layer where core identity, employer, job, immigration, and document data is entered once and reused across downstream forms and views.

### B. Cross-form validation
A pre-flight review that flags contradictions, omissions, and risk triggers before filing.

### C. Unified dashboard
A single case dashboard that brings together DOL, USCIS, DOS, deadlines, alerts, milestones, and plain-language next steps.

### D. Role switching
The same case should be understandable from:
- applicant view
- employer/HR view
- attorney view

### E. Plain-language guidance
The product should simplify legal/process language into readable guidance and show “what’s next” in human terms.

### F. Deadline / extension protection
Show proactive reminders or auto-trigger support for H-1B extension or time-sensitive filing moments.

## Secondary capabilities
These are worth including only if they stay lightweight and visually clear.

- sponsorship cost calculator
- document complexity statistics
- backlog / wait-time visibility
- legal language translator / AI explainer
- case coordinator handoff tracker
- visa bulletin movement alerting

## Non-product system levers
The overall presentation can still advocate broader reforms, but the site should treat these as surrounding levers, not equal-weight app modules:
- staffing / adjudication capacity
- OPT / talent-pipeline alignment
- employer-side standardization
- U.S. education / domestic pipeline support
- structural constraints such as caps and retrogression

## Narrative position in the presentation
Recommended role in the final presentation:
1. current-state pain framing
2. portal as the flagship future-state technology response
3. broader reform ecosystem around the portal
4. execution and stakeholder alignment

## Demo scenario
Use **one flagship fictional case**:
- international applicant already in the U.S.
- employer willing to sponsor
- attorney involved
- case somewhere between PERM / I-140 / I-485 complexity
- enough detail to show forms, deadlines, handoffs, and risk flags

## Required product statement
Somewhere in the product, clearly communicate:
> This platform reduces avoidable process friction, rework, and uncertainty. It does not eliminate statutory caps, retrogression, or all legal complexity.

## Deliverable quality bar
The final prototype should feel:
- crisp enough to screen-record
- coherent enough to explain in one sentence
- realistic enough to survive Q&A
- simple enough that every major screen earns its existence