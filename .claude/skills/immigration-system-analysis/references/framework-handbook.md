# Framework Handbook — Immigration System Application

Reference document for applying MGT 120 frameworks to the H-1B → Green Card system.

## Table of Contents

1. Problem Statement Templates
2. Scope Definition
3. Root Cause Analysis (RCA) Domains
4. SIPOC Models
5. Customer Journey Templates
6. People-Process-Technology (PPT)
7. Bullseye Framework
8. Capability Design Rules
9. Metrics & Measurement
10. Storytelling for Presentations

---

## 1. Problem Statement Templates

### Formula
**{Who}** experiences **{what problem}** when **{context/trigger}**, resulting in **{quantified impact}**. An effective solution must **{requirements}**.

### Immigration Examples

**Applicant pain:**
Immigrant workers experience prolonged uncertainty and fear when navigating the H-1B to green card pathway, resulting in 3-7+ year wait times with no unified view of their case status across USCIS, DOL, and DOS systems. An effective solution must provide real-time, plain-language status visibility without requiring attorney intermediation for basic questions.

**Employer pain:**
Employers sponsoring H-1B workers experience unpredictable costs and compliance risk when managing immigration cases, resulting in an estimated $10K-$30K+ per case in legal fees, filing fees, and HR time with no standardized way to forecast total sponsorship cost. H-1B extensions every 1-3 years at $4K-$10K each with no automated tracking. An effective solution must provide cost transparency and automated deadline protection.

**System pain:**
USCIS experiences a ~25% RFE rate on employment-based petitions due to inconsistent data across forms filed by different preparers at different times, resulting in adjudication delays, rework for all parties, and disproportionate officer time on deficient cases. PWD revision cycles affect ~15% of submissions, and PERM filings face ~30% RFE/audit rates. An effective solution must validate cross-form consistency before submission.

---

## 2. Scope Definition

### Immigration System Scope Map

| Dimension | In Scope | Out of Scope |
|-----------|----------|-------------|
| Pathway | H-1B → EB-2/EB-3 green card | Family-based, EB-1, EB-5, asylum |
| Stages | H-1B petition through I-485 | Pre-H-1B (OPT, student visa) except as pipeline context |
| Stakeholders | Applicant, employer/HR, attorney | Congressional actors, advocacy orgs (acknowledged as system levers) |
| Agencies | USCIS, DOL, DOS | CBP, ICE, EOIR |
| Solutions | Process/technology improvements (the portal) | Legislative reform (argued for separately in presentation) |
| Geography | U.S.-based adjustment of status | Consular processing abroad |
| Pain point domains | Backlogs/delays, employers, US education/STEM OPT | Full policy redesign |

---

## 3. Root Cause Analysis Domains

### CRITICAL: Configure Domain Names

Never use generic labels like "People," "Process," "Technology." Configure domain names from case facts.

**Good domain names for immigration RCA:**
- "The Handoff Maze" — 10+ handoffs with no coordinator, each one a failure point
- "The Black Box" — fear and information vacuum amplify perceived complexity
- "Filing Without a Net" — system evaluates compliance only after queue entry
- "The Re-Keying Tax" — 12+ shared fields entered across 6+ forms with no sync
- "4 Portals and 0 Dashboards" — DOL iCERT + myUSCIS + CEAC + mail, no unified view
- "The Extension Spiral" — backlog creates recurring $4K-$10K extension loops with deadline risk
- "The SOC Code Trap" — PWD/PERM classification errors enter at step 1, surface at step 7

### Applied to Immigration Filing Errors

**"Filing Without a Net" (Process):** I-129 (H-1B), ETA-9089 (PERM), and I-140 are filed months or years apart. Job title, duties, wage, and SOC code may drift between filings. No automated check compares them before submission. System evaluates compliance only after queue entry — meaning errors that enter at intake don't surface until adjudication, 3-6 months later.

**"4 Portals and 0 Dashboards" (Technology):** Each form lives in a different agency system (USCIS ELIS, DOL FLAG, DOS CEAC, plus physical mail). No cross-system data model exists. No shared case identifier across agencies. Attorney case management tools vary widely and don't enforce cross-form consistency.

**"The Handoff Maze" (People/Coordination):** Paralegals manually assemble filings. Different team members may handle different stages of the same case. Employer HR provides updated information that may not match earlier filings. No single entity owns the end-to-end process — the applicant → attorney → employer → DOL → USCIS → DOS chain has 10+ handoffs with no coordinator role.

**Key Insight:** RFEs are a symptom of a system with no single source of truth for case data. The fix is not "better form-filling" — it's a canonical data record that all forms draw from, validated before submission, visible across stakeholders.

---

## 4. SIPOC Models

### PERM Labor Certification (ETA-9089)

| Element | Details |
|---------|---------|
| **Suppliers** | Employer (job details, recruitment docs), Attorney (legal strategy), DOL (prevailing wage) |
| **Inputs** | Job description, SOC code, prevailing wage determination, recruitment evidence, beneficiary qualifications |
| **Process** | 1. Obtain PWD (6-9 mo) → 2. Conduct recruitment → 3. Document results → 4. Prepare ETA-9089 → 5. File with DOL → 6. Await certification or audit |
| **Outputs** | Approved labor certification (or denial/audit). ~30% face RFE or audit. |
| **Customers** | Employer (to file I-140), Beneficiary (pathway continues), Attorney (case progression) |

### I-140 Immigrant Petition

| Element | Details |
|---------|---------|
| **Suppliers** | Attorney (petition prep), Employer (supporting evidence, financial docs), USCIS (adjudication) |
| **Inputs** | Approved PERM, employer financial docs, beneficiary credentials, job offer letter |
| **Process** | 1. Assemble petition → 2. File I-140 with USCIS → 3. Await adjudication → 4. Respond to RFE (if issued, ~25% rate) → 5. Receive approval/denial |
| **Outputs** | Approved I-140, established priority date |
| **Customers** | Beneficiary (priority date secured), Employer (sponsorship commitment met), DOS (visa bulletin queue) |

---

## 5. Customer Journey Templates

### Applicant Journey: Yuto Sato (H-1B → Green Card)

| Phase | Actions | Feelings | Pain Points | Touchpoints |
|-------|---------|----------|-------------|-------------|
| **Awareness** | Learn about green card option from employer/peers | Hopeful but confused | No plain-language overview; eligibility in 20+ page manuals | Attorney consult, employer HR, online forums |
| **PERM** | Provide documents, wait for employer recruitment | Anxious, passive | No visibility into employer's recruitment process; 6-9 month PWD + 12-18 month PERM | Attorney emails, occasional updates |
| **I-140** | Submit additional docs if requested | Nervous about RFE | ~25% RFE rate; can't see case status without calling attorney | myUSCIS (limited), attorney |
| **Waiting** | Monitor visa bulletin monthly | Frustrated, powerless | Multi-year wait with no control; employer dependency | DOS visa bulletin, immigration forums |
| **I-485** | File adjustment, biometrics, interview prep | Anxious but hopeful | Complex document assembly across 6+ forms; fear of contradictions | USCIS office, attorney, EAD/AP tracking |
| **Completion** | Receive green card | Relief | Anti-climactic after years of stress | USPS mail |

**Moments of Truth:**
- First attorney meeting (sets expectations — moment to provide plain-language guidance)
- RFE receipt (fear spike — moment where pre-validation would have prevented this)
- Priority date becoming current (hope spike — moment for visa bulletin alerts)
- H-1B extension deadline (risk spike — moment for auto-trigger protection)
- I-485 approval (resolution)

---

## 6. People-Process-Technology (PPT)

### Current State PPT

| Dimension | State | Gap |
|-----------|-------|-----|
| **People** | Attorneys carry coordination burden; employers delegate and forget; applicants are passive recipients with no feedback signals | No self-service for applicants; employer engagement drops after initial filing; 30-50% lower misconduct reporting among temp workers due to fear |
| **Process** | Sequential, multi-agency, 10+ handoffs over years; each stage restarts data collection; errors at step 1 surface at step 7 | No end-to-end process owner; no cross-stage data persistence; no pre-submission validation |
| **Technology** | 4 government portals, none integrated; attorney case management varies; $14.7M annual paper processing at USCIS | No unified dashboard; no cross-form validation; no automated deadline management |

**PPT Reaction (not parallel summary):**
People constraints → Process: Attorneys carry the coordination burden BECAUSE no system enforces cross-form consistency, so every filing requires manual reconciliation. Process fragmentation → Technology: Forms are re-keyed manually across portals BECAUSE no API or shared data model connects the 4 agency systems. Technology gaps → People: Applicants experience fear and opacity BECAUSE no technology provides plain-language status or progress indicators, forcing them to call attorneys for basic status questions.

### Future State PPT (proposed)

| Dimension | State | Enabler |
|-----------|-------|---------|
| **People** | Applicants self-serve for status; employers see cost/timeline; attorneys focus on strategy not data entry | Plain-language wizard, role-based views, self-service intake |
| **Process** | Single intake populates all forms; validation before submission; auto-triggered extensions; SLAs at handoffs | Smart form, pre-flight checks, deadline engine, case coordinator |
| **Technology** | Unified dashboard aggregating status across agencies; shared case record; form sync from single data entry | Single source of truth platform (CaseBridge) |

---

## 7. Bullseye Framework

| Layer | Immigration Application |
|-------|----------------------|
| **Intent** | Enable skilled immigration to fill labor gaps while protecting domestic workers |
| **Policy** | INA caps, per-country limits, prevailing wage, specialty occupation definition |
| **Business Rules** | PERM recruitment steps, H-1B lottery, I-140 ability-to-pay, I-485 filing eligibility |
| **Process** | Multi-agency sequential filing, extension loops, RFE response cycles, 10+ handoffs |
| **Procedure** | Form completion, document notarization, biometrics scheduling, interview prep |
| **Technology** | myUSCIS, FLAG, CEAC, attorney case management, employer HRIS — none integrated |
| **Culture** | Fear/uncertainty for applicants; cost-avoidance for employers; risk-aversion for attorneys |

---

## 8. Capability Design Rules

### Format
Every capability must follow: **Ability to + verb + noun + measurable outcome**

### Classification
Every capability must have a **Kano tier** (Basic / Performance / Delighter) and be ordered accordingly.

### Mapping Rule
Each capability must trace back to a diagnosed pain point and forward to a demoable feature.

| Pain Point | Capability | Kano | Demo Feature |
|-----------|-----------|------|-------------|
| Cross-form inconsistency → RFEs (~25%) | Ability to validate data consistency across all forms before submission | Basic | Pre-flight validation with mismatch highlighting |
| Fragmented status across 4 portals | Ability to display unified case status across DOL/USCIS/DOS | Performance | Cross-agency timeline dashboard |
| Data re-entry across 6+ forms | Ability to populate all required forms from a single intake record | Basic | Smart form with per-form sync indicators |
| Missed extension deadlines ($4K-$10K per cycle) | Ability to auto-trigger extension filings 90 days before expiry | Performance | Deadline engine with alert cards |
| Legal jargon creates fear (eligibility in 20+ page manuals) | Ability to translate case status into plain-language next steps | Delighter | Plain-language wizard / status explainer |

---

## 9. Metrics & Measurement

### Metric Design Rule
Every metric needs: **What** (measure), **Lead/Lag** (type), **From** (baseline), **To** (target), **How measured**

### Project Metrics

| Capability | Type | Metric | Current | Target |
|-----------|------|--------|---------|--------|
| Cross-form validation | Lead | % filings passing consistency check before submission | 0% (no system) | 95%+ |
| Cross-form validation | Lag | RFE rate | ~25% | <5% |
| Unified dashboard | Lead | Dashboard adoption rate (% active users) | N/A | 80%+ |
| Unified dashboard | Lag | Status inquiry calls to attorney | Baseline | -60% |
| Single intake | Lead | % concurrent forms auto-populated from single entry | 0% | 100% |
| Single intake | Lag | Cross-form contradictions per 100 filings | Frequent | Near-zero |
| Auto-extension | Lead | % extensions auto-triggered 90+ days before expiry | 0% | 100% |
| Auto-extension | Lag | Missed extension deadlines / lapsed statuses | Risk present | 0 |
| Plain-language wizard | Lead | % applicants completing wizard before attorney consult | 0% | 70%+ |
| Plain-language wizard | Lag | Attorney hours on basic eligibility per case | ~8 hrs | ~3 hrs |

---

## 10. Storytelling for Presentations

### MGT 120 Presentation Structure (from OH planning)

1. **Intro** — American Dream framing, personal stories, statistics blending into current state
2. **Current state** (5-7 min) — Applicant perspective → Backlogs/process → Employer → US Education, each with pain points
3. **Future state** — Backlogs/process capabilities → Employer capabilities → Education capabilities → **Technological solutions (portal demo)**
4. **Execution** — Stakeholder alignment, implementation approach
5. **Q&A defense** — Cost, agencies, bottlenecks, opposition, caps vs. process

### Narrative Arc for Demo Video

fragmentation → unified intake → validation catches issue → readiness improves → attorney/HR/applicant align on same record → applicant sees clear next step → dashboard shows reduced uncertainty and deadline risk → scope clarity: process improvement, not magic

### Q&A Defense Points the Demo Supports

| Question | Demo Element |
|----------|-------------|
| "How expensive would this portal be?" | Impact screen shows ROI targets (RFE reduction, attorney hours saved, extension cost reduction) |
| "What agencies participate?" | Dashboard shows DOL/USCIS/DOS explicitly |
| "What's the primary bottleneck?" | Validation screen shows errors-at-intake-surface-at-adjudication |
| "If caps stay the same, would it improve?" | Scope statement: "process improvements reduce friction even when structural caps remain" |
| "Who might oppose?" | Impact screen acknowledges structural constraints requiring broader reform |
