# 02 UX / Information Architecture + Screen Specs

## IA philosophy
The prototype should avoid the feeling of a sprawling website with many unrelated tabs. It should instead feel like **one coherent case environment** with a few focused views.

The best organizing model is:

- one case
- one shared record
- one cross-agency timeline
- one role switcher
- one smart intake / validation flow
- one compact “broader system” section near the end

## Recommended top-level structure
Use **5 main screens** maximum.

1. **Home / Future-State Overview**
2. **Case Workspace**
3. **Smart Intake + Validation**
4. **Role Views**
5. **System Impact + Scope**

Optional sixth screen only if it is elegant and lightweight:
6. **Current-State Contrast**

## Navigation model
Use a restrained top nav or compact left rail. Do not create many equal-weight product areas. Navigation should prioritize the demo sequence, not exploration depth.

Preferred labels:
- Overview
- Case
- Intake
- Roles
- Impact

Alternative labels:
- Future State
- Shared Record
- Validation
- Stakeholders
- Scope

## Global interaction rules
- Every screen should be understandable in under 5 seconds
- Avoid nested tabs inside nested tabs
- Each screen should have one dominant message and one primary interaction
- Major actions should visibly change state
- All state changes should be easy to trigger programmatically later for Remotion

## Screen 1: Home / Future-State Overview

### Job
Introduce the platform as the technology centerpiece of the future state.

### Core content
- strong hero headline
- short subheadline about a single source of truth
- 3 to 4 evidence-backed capability cards
- one visual summary of the case journey
- one disclaimer on scope

### Required hero message
Suggested direction:
**One shared case record for the H-1B to green card journey.**  
Reduce rework, simplify handoffs, and make status visible across applicant, employer, attorney, and agencies.

### Hero CTAs
Primary:
- View Demo Case

Secondary:
- See What the Portal Solves

### Capability cards
Keep to 4 cards max:
1. Smart Intake
2. Validation Engine
3. Unified Dashboard
4. Role-Based Views

### Do not include
- many separate portal entries
- policy cards mixed with product cards
- multiple equal-weight pages for employer, applicant, attorney

## Screen 2: Case Workspace

### Job
Embodies the “single source of truth” concept.

### Core layout
A premium dashboard/workspace for one fictional case:
- header with applicant, employer, attorney, current stage
- cross-agency stage bar
- deadline card(s)
- alert rail or right-side panel
- case summary cards
- recent activity feed
- next step card in plain language

### Required sections
#### A. Case header
Fields:
- applicant name
- employer
- attorney / counsel
- pathway stage
- priority date
- next filing
- case health score or filing readiness score

#### B. Journey / milestone bar
Stages:
- Eligibility
- PWD
- PERM
- I-140
- Visa Bulletin Wait
- I-485 / Concurrent Forms
- Biometrics / Review
- Approval

Use color and state:
- complete
- current
- upcoming
- blocked / at risk

#### C. Alert panel
Examples:
- H-1B extension due in 96 days
- I-485 package missing one dependency
- Priority date alert available
- Attorney review requested
- SOC code mismatch flagged

#### D. Plain-language next step
A readable block for non-experts:

“You are waiting on PERM-related evidence review. No action is needed today, but your attorney still needs confirmation of job duties wording before the next filing package.”

#### E. Cross-agency status module
Visually map:
- DOL
- USCIS
- DOS

Each line should show status, last update, and what it means.

### Primary action
- Open Validation Review
or
- Open Role Switcher

## Screen 3: Smart Intake + Validation

### Job
This is the most important “show, don’t tell” proof of the product.

### Core idea
Enter shared data once, map it across forms, then show pre-flight review catching problems before filing.

### Recommended layout
Two-column or three-panel layout:
- left: shared intake sections
- center: mapped form package / synced fields
- right: validation results / readiness panel

### Flow to support
1. user enters or reviews shared core data
2. fields visibly sync into multiple forms
3. validation check runs
4. one or two issues appear
5. issues are fixed
6. readiness score improves
7. filing package becomes “ready for attorney review”

### Intake sections
- identity
- employer
- role / job details
- immigration history
- address and travel
- supporting documents

### Form mapping visualization
Do not render literal full government PDFs. Use a stylized document stack or structured cards representing:
- I-140
- I-485
- I-765
- I-131
- G-28
- supporting evidence bundle
- DOL / PERM artifacts as relevant

### Validation issues to demonstrate
Pick 2 or 3 issues max:
- job title mismatch across systems
- inconsistent employer name formatting
- missing travel history field
- missing support document
- wage / SOC mismatch risk
- address gap

### Required visible outputs
- readiness score
- issue count
- severity level
- “ready / not ready” state
- explanation of why this matters downstream

### Key visual moment
The audience should instantly see:

**a contradiction that would normally surface months later is caught now.**

## Screen 4: Role Views

### Job
Show the same case from three stakeholder perspectives without making separate giant portals.

### Recommended interaction
Use a segmented role switcher:
- Applicant
- Employer / HR
- Attorney

When the role changes:
- emphasis shifts
- visible actions shift
- some content blocks reorder
- permissions / editability change

### Applicant view
Prioritize:
- what stage am I in?
- what is happening now?
- what do I need to do?
- what deadlines affect me?
- plain-language explainer
- upload / confirm biographical info

### Employer / HR view
Prioritize:
- deadlines
- extension risk
- sponsorship costs
- internal approvals
- handoffs and dependencies
- workforce continuity

### Attorney view
Prioritize:
- filing readiness
- risk flags
- evidence gaps
- legal notes
- submission controls
- conflict / inconsistency resolution

### Required microcopy difference
Applicant text should be simple and reassuring.  
Employer text should be operational and risk-aware.  
Attorney text should be compliance-focused and precise.

### Optional detail
Show “case coordinator” ownership or assignment in employer/attorney views.

## Screen 5: System Impact + Scope

### Job
Prevent the product from feeling naive. Show broader context without bloating the app.

### Core structure
Two columns or stacked sections:
1. what this portal changes directly
2. what still requires broader reform

### Section A: Solves directly
Examples:
- re-entry and cross-form inconsistency
- fragmented status visibility
- missed deadlines / extension risk
- legal language opacity
- dropped handoffs

### Section B: Requires broader reform
Examples:
- visa caps
- retrogression
- staffing constraints
- political volatility
- domestic pipeline and OPT alignment

### Required statement
Include a concise scope note such as:

“This portal improves coordination and quality inside the process. It does not create new visa supply.”

### Optional metrics strip
Use a compact KPI row such as:
- target RFE rate <5%
- fewer status inquiry calls
- attorney hours reduced on basic tasks
- extension deadlines caught earlier

## Optional Screen 6: Current-State Contrast
Use only if elegantly done and if it improves the demo.

### Good implementation
A simple before/after contrast:
- before: fragmented portals, mail, duplicate entry, no clear next step
- after: one record, one timeline, guided next step, earlier issue detection

### Bad implementation
A giant dense explanation page.

## Design constraints for IA
- no more than 5 core screens in the main prototype
- no more than 2 depth levels
- no hidden content essential to the demo
- no modal dependencies that are hard to film
- no tab sprawl

## Default demo path
1. Overview
2. Case Workspace
3. Smart Intake + Validation
4. Role Views
5. System Impact + Scope

## Mobile responsiveness
Design responsively, but optimize first for:
- presentation laptop viewport
- 16:9 Remotion framing
- desktop browser recording

## Accessibility / clarity
- clear type hierarchy
- high contrast
- generous spacing
- labels that do not require prior immigration expertise
- not too much data on one screen

## Screen acceptance checklist
Each screen should pass:
- can it be explained in one sentence?
- is there a dominant focal point?
- is the primary action obvious?
- does it support the story?
- will it record cleanly in Remotion?