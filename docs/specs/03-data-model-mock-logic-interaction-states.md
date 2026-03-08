# 03 Data Model + Mock Logic + Interaction States

## Philosophy
The prototype should behave like a believable system without requiring full back-end realism. Use **seeded mock data**, **derived state**, and **deterministic interaction logic**.

The goal is not completeness. The goal is believable causality.

## Data model overview
Use one canonical case object and a handful of supporting objects.

## Core entities

### 1. Case
Fields:
- caseId
- caseName
- applicantId
- employerId
- attorneyId
- currentStage
- pathwayType
- caseHealth
- readinessScore
- createdAt
- updatedAt
- targetDemoScenario
- scopeNote

### 2. Applicant
Fields:
- fullName
- preferredName
- countryOfBirth
- currentCity
- currentStatus
- statusExpirationDate
- educationLevel
- degreeField
- startDateInUS
- dependents
- priorityDate
- aNumber
- passportSummary

### 3. Employer
Fields:
- legalName
- displayName
- fein
- industry
- headquarters
- hrOwner
- sponsorshipPolicy
- extensionPolicy
- costCenter
- internalApprovalState

### 4. Attorney / Counsel
Fields:
- lawFirm
- attorneyName
- contactEmail
- reviewStatus
- legalNotes
- caseStrategyNote

### 5. Job / Role
Fields:
- title
- socCode
- department
- jobLocation
- salary
- wageSource
- jobDutiesSummary
- specialtyOccupationConfidence
- mobilityRisk

### 6. Case timeline item
Fields:
- id
- stage
- agency
- title
- status
- lastUpdated
- dueDate
- explanationPlainLanguage
- explanationTechnical
- isBlocking
- isUserActionRequired

### 7. Validation issue
Fields:
- id
- severity
- category
- title
- description
- affectedForms
- affectedFields
- recommendedFix
- isResolved
- resolvedAt

### 8. Shared intake field
Fields:
- key
- label
- section
- value
- sourceOfTruth
- syncTargets
- lastEditedBy
- confidence
- changeHistory

### 9. Form package item
Fields:
- formCode
- displayName
- status
- completionPercent
- requiredFieldsComplete
- flaggedIssuesCount
- syncedFromSharedRecord
- ownerRole

### 10. Notification / alert
Fields:
- id
- type
- title
- body
- severity
- audience
- actionLabel
- actionTarget
- timestamp

## Canonical demo case
Use one fictional case only.

### Suggested case profile
- applicant: Yuto Sato
- employer: Helix Systems
- attorney: Maya Chen, Chen & Patel Immigration
- stage: I-485 package preparation with earlier PERM / I-140 history visible
- H-1B expiration within ~90 to 120 days
- one small but believable cross-form inconsistency
- one upcoming employer deadline
- one plain-language applicant concern
- one attorney review action pending

You can rename the case, but keep one flagship storyline.

## Derived state
These values should be calculated from mock data rather than hardcoded independently.

### Readiness score
Computed from:
- required fields completion
- number and severity of validation issues
- attorney review status
- support document completeness

Suggested simple formula:
- start at 100
- subtract issue penalties
- subtract missing-section penalties
- add bonus if attorney review complete
- clamp 0 to 100

### Case health
Human-readable status:
- On Track
- Needs Review
- At Risk
- Blocked

Derived from:
- unresolved critical issues
- deadline proximity
- missing required documents
- current stage blockers

### Milestone state
Each stage in the journey should resolve to:
- complete
- active
- upcoming
- blocked

### Role-specific priority queue
Each role sees different “top actions” based on the same underlying data.

## Required deterministic interactions

### Interaction 1: Run validation
User presses a button:
- show loading / analyzing state
- reveal issue count
- display top issues
- lower or confirm readiness score
- highlight affected fields / forms

### Interaction 2: Fix issue
User edits one or two shared fields:
- issue changes from open to resolved
- form package updates
- readiness score rises
- attorney or HR alert changes state

### Interaction 3: Switch role
Changing roles should:
- reorder cards
- change labels and tone
- change available actions
- reveal/hide certain internal details

### Interaction 4: Advance stage preview
A controlled interaction may show “what happens next”:
- PERM complete
- I-140 approved
- priority date tracked
- I-485 package ready

This can be simulated with a small timeline state change.

### Interaction 5: Trigger deadline / extension protection
A visible alert should show:
- approaching expiration
- system-generated reminder or auto-trigger state
- reduced missed-deadline risk

## Mock logic rules

### Validation logic
Use a lightweight rules engine with hardcoded demo rules.

Example rules:
- if employer legal name differs across intake and form package, create medium issue
- if job title differs between role and evidence summary, create medium issue
- if address history has a gap, create low issue
- if required support document missing, create high issue
- if H-1B expiry within threshold and extension not initiated, create high alert

### Sync logic
When a shared field changes:
- all mapped form summaries update instantly
- any dependent issue should re-evaluate
- last-updated metadata should reflect the edit

### Role logic
Use the same data with different presentation transforms.

Applicant sees:
- plain-language summaries
- fewer legal details
- only self-service tasks

Employer / HR sees:
- deadlines
- sponsor costs
- internal action items
- risk summary

Attorney sees:
- issues by severity
- filing package state
- legal notes
- submission readiness

## Suggested seeded issues
Use 2 to 3 issues total. More than that becomes noisy.

### Issue A: Employer name mismatch
Example:
- “Helix Systems Inc.” vs “Helix Systems, Inc”

Severity: medium  
Why useful: easy to understand and fix visually.

### Issue B: Job duties wording / SOC mismatch risk
Severity: high  
Why useful: shows a more substantive legal/compliance risk.

### Issue C: Missing travel history entry
Severity: low  
Why useful: shows the system also handles routine completeness.

## Suggested seeded alerts
- H-1B expires in 102 days
- Attorney review pending
- Priority date watch enabled
- 1 validation blocker remains
- Evidence packet missing one support item

## Plain-language translation layer
The system should support paired fields:
- technical explanation
- plain-language explanation

Example:

Technical:  
“Cross-form inconsistency detected in employer legal name. This may create downstream adjudication risk.”

Plain-language:  
“The company name is written two different ways. Fixing it now reduces the chance of delays later.”

## State machine
Keep the product internally simple with a finite state structure.

### Suggested top-level UI states
- overview
- caseWorkspace
- intakeReview
- validationResults
- roleApplicant
- roleEmployer
- roleAttorney
- impactScope

### Suggested validation sub-states
- idle
- analyzing
- resultsWithIssues
- issueResolved
- readyForReview

### Suggested demo stage sub-states
- currentStateFraming
- futureStateActive
- issueFound
- issueResolved
- roleSwitched
- scopeClarified

## Data realism notes
- Do not use obviously fake lorem ipsum data
- Use consistent names, dates, form codes, and stage terminology
- Avoid inventing fine-grained legal claims beyond what the prototype needs
- Keep numbers rounded and presentation-friendly

## Persistence expectations
Full persistence is optional. For demo readiness, it is enough to:
- seed a known initial state
- mutate local UI state
- support reset to demo baseline

## Reset behavior
Provide a simple reset action for repeat demos:
- Reset demo state
- Restore seeded case
- Clear resolved issue changes
- Return readiness score to default demo baseline

## Required technical convenience
The build should expose enough structure for later Remotion control:
- route or screen state can be set directly
- role can be set directly
- validation status can be toggled directly
- issue resolution state can be toggled directly
- timeline stage can be advanced directly

## Acceptance checklist
The data / logic layer succeeds if:
- one field change visibly affects multiple UI surfaces
- one issue resolution visibly improves system readiness
- one role switch visibly changes priorities
- one deadline alert visibly proves business value
- everything remains stable across repeated recordings