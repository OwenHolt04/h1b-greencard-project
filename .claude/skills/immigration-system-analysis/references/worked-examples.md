# Worked Examples — Immigration System Project

Concrete diagnostic and design examples tied to project pain points.

## Table of Contents

1. Diagnosing the Current State: RFE Root Cause
2. Designing the Future State: Unified Dashboard
3. Auditing the Existing HTML Mock
4. Capability Design: Smart Intake Form
5. Demo Flow Alignment with Presentation

---

## 1. Diagnosing the Current State: Why Are RFE Rates ~25%?

### Problem Statement
USCIS issues Requests for Evidence on approximately 25% of employment-based petitions, causing 2-4 month delays per case, additional legal fees of $2K-$5K, and significant stress for applicants and employers. PWD revision cycles affect ~15% of submissions, adding 3-6 months. PERM filings face ~30% RFE/audit rates. The primary driver is data inconsistency across forms filed at different times by different preparers — errors that enter at step 1 don't surface until step 7.

### RCA (configured domains)

**"Filing Without a Net" (Process):** I-129 (H-1B), ETA-9089 (PERM), and I-140 are filed months or years apart. Job title, duties, wage, and SOC code may drift between filings. No automated check compares them before submission. The system evaluates compliance only after queue entry.

**"4 Portals and 0 Dashboards" (Technology):** Each form lives in a different agency system (USCIS ELIS, DOL FLAG). No cross-system data model exists. Attorney case management tools vary widely and don't enforce cross-form consistency.

**"The Handoff Maze" (People/Coordination):** Paralegals manually assemble filings. Different team members may handle different stages of the same case. Employer HR provides updated information that may not match earlier filings. No single entity owns the end-to-end case.

**"The Re-Keying Tax" (Data/Integration):** Same 12+ data fields (employer name, FEIN, beneficiary name, A-number, SOC code, job duties, wage, LCA number, passport info) exist on 6+ forms but with different labels, formats, and validation rules. No canonical data model. No sync mechanism.

**Key Insight:** RFEs are a symptom of a system with no single source of truth for case data. The fix is not "better form-filling" — it's a canonical data record that all forms draw from, validated before submission.

### Capability That Addresses This
**Ability for immigration attorneys to run automated cross-form consistency checks at filing time, flagging 90%+ of terminology/data mismatches that currently trigger RFEs (reducing RFE rate from ~25% to <5%).**

Kano: Basic. This is fix-first-or-nothing-works.

### Demo Feature
Pre-flight validation screen (Intake + Validation screen in the prototype):
- Shared intake record populated with Yuto Sato's case data
- Form sync cards showing 6 forms connected to shared fields
- Click "Check Filing Readiness"
- System highlights 3 issues: employer name mismatch (medium), SOC/wage data mismatch (high), travel history gap (low)
- User fixes employer name in shared record → form cards update → issue resolves → readiness score rises from 72 to 80
- Green = "Ready for Attorney Review"

---

## 2. Designing the Future State: Unified Dashboard

### Current Pain
An applicant checking their case status must:
1. Log into myUSCIS for I-140/I-485 status
2. Check DOL FLAG for PERM status
3. Check DOS visa bulletin for priority date
4. Call or email attorney for interpretation
5. Check physical mail for notices

Result: hours of effort, high anxiety, and frequent calls to attorney for status updates. Fear and information vacuum amplify perceived complexity beyond actual complexity.

### Future State Design (Dashboard screen in prototype)

**Unified Timeline View** showing Yuto Sato's case across all agencies:

```
[H-1B Approved ✓] → [PWD Complete ✓] → [PERM Certified ✓] → [I-140 Approved ✓] → [Priority Date Current ●] → [I-485 In Progress ◐] → [Biometrics ○] → [Approval ○]
```

**Role-based views of the same data:**

| View | What's Emphasized | What's De-emphasized |
|------|------------------|---------------------|
| Applicant | "Your case is on track. Complete your medical exam." | Legal citations, filing details, cost |
| Employer/HR | "Extension due in 102 days. Budget: $8,500 allocated." | Legal strategy, beneficiary personal docs |
| Attorney | "1 high-severity issue. 2 evidence gaps. Review SOC classification." | Simplified language (they don't need it) |

### Capability
**Ability for applicants and attorneys to view end-to-end case status across DOL/USCIS/DOS in a single unified dashboard with next-step guidance, reducing status inquiry calls by 60%.**

Kano: Performance.

---

## 3. Auditing the Existing HTML Mock

### What the original mock (h1b-greencard-platform_1.html) does well:
- Covers all major stakeholder views (applicant, employer, attorney)
- Includes smart form concept with form-sync indicators
- Has case dashboard with KPI cards
- Professional visual styling

### What needed to change for the final presentation:
- **Too many equal-weight tabs** — 8+ sections create a "startup homepage" feel, not a focused demo
- **No narrative thread** — sections exist independently; no single case flows through all views
- **Policy/Reform section mixed in** — policy content belongs in the presentation slides, not the app
- **No deterministic demo flow** — can't easily script a Remotion capture because interactions aren't sequenced
- **No "what this doesn't solve" acknowledgment** — needs explicit scope boundary
- **Capabilities not Kano-ordered** — showed features in arbitrary order rather than Basic → Performance → Delighter

### Revised Architecture (defined in `docs/specs/`)

The revised prototype follows a 5-screen architecture:
1. **Overview** — thesis, 4 capability cards with metrics, case CTA
2. **Intake + Validation** — shared data, form sync, validation issues, readiness score (Basic capabilities)
3. **Dashboard** — cross-agency timeline, alerts, plain-language next steps, metrics (Performance capabilities)
4. **Stakeholder Views** — role switcher: applicant / employer-HR / attorney (all tiers)
5. **Impact + Scope** — what portal changes (with research metrics) / what requires broader reform

One case (Yuto Sato). One shared record. Kano-ordered demo flow. Deterministic interactions for Remotion.

---

## 4. Capability Design: Smart Intake Form

### Pain Point
The same data (employer name, FEIN, beneficiary name, A-number, SOC code, job duties, prevailing wage, passport info) must be entered on 6+ forms: ETA-9089, I-140, I-485, I-765, I-131, G-28. Currently entered manually each time, often months apart, by different people. Applicants must cross-reference definitions across multiple forms, increasing inconsistencies discovered months later during adjudicator review.

### Capability
**Ability for the filing system to auto-populate shared fields (name, DOB, A-number, employer EIN) across all concurrent forms from a single data entry, eliminating re-keying contradictions across 6+ forms.**

Kano: Basic.

### Demo Feature Spec (Intake screen in prototype)

**Shared intake organized by section:**

| Section | Fields | Forms Populated |
|---------|--------|----------------|
| Identity | Full name, DOB, country of birth, A-number, passport | All 6 forms |
| Employer | Legal name, FEIN, industry, headquarters, HR owner | ETA-9089, I-140, G-28 |
| Role | Job title, SOC code, department, location, salary, wage source, duties | ETA-9089, I-140, I-485 |
| Immigration | Current status, expiration, priority date, education | I-485, I-765, I-131 |
| History | Address history, travel history, employment history | I-485 |
| Documents | Support evidence checklist | All forms as applicable |

**Form sync visualization:**
Each form shown as a stylized card with completion percentage, synced field count, and flagged issues. Not literal government PDFs — clean, readable document cards.

**Key interaction:**
1. User enters/reviews shared data for Yuto Sato
2. Fields visibly sync into 6 form cards
3. "Check Filing Readiness" runs validation
4. 3 issues appear (employer name mismatch, SOC/wage mismatch, travel gap)
5. Fix employer name → form cards update → issue resolves → score 72 → 80
6. Filing status: "1 issue remaining — attorney review required for SOC classification"

---

## 5. Demo Flow Alignment with Presentation

### Presentation Flow (from OH notes):

1. Intro / emotional hook (American Dream framing, personal stories, statistics)
2. Current-state pain — multi-stakeholder (applicant, backlogs/process, employer, education)
3. Future-state capabilities → **technological solutions (demo lives here)**
4. Execution / stakeholder alignment
5. Q&A

### Demo Sequence (75-120 seconds within future-state section):

| Beat | Screen | What Happens | Capability Shown | Kano |
|------|--------|-------------|-----------------|------|
| 1 | Overview | Hero + 4 capability cards with metrics | Thesis framing | — |
| 2 | Intake | Shared fields populated for Yuto Sato | Single source of truth | Basic |
| 3 | Intake | Form sync cards show 6 forms connected | Auto-populate | Basic |
| 4 | Intake | "Check Readiness" → 3 issues appear, SOC mismatch HIGH | Pre-submission validation | Basic |
| 5 | Intake | Fix employer name → score 72→80 | Cross-form consistency | Basic |
| 6 | Dashboard | Yuto's case across DOL/USCIS/DOS | Unified dashboard | Performance |
| 7 | Dashboard | Alert: "H-1B extension due in 102 days, auto-trigger at 90" | Auto-extension | Performance |
| 8 | Stakeholders → Applicant | "Your case is on track. Complete your medical exam." | Plain-language wizard | Delighter |
| 9 | Stakeholders → HR | "Extension due in 102 days. Budget: $8,500." | Employer transparency | Performance |
| 10 | Stakeholders → Attorney | "1 high-severity issue. Review SOC classification." | Attorney efficiency | Performance |
| 11 | Impact | Solves directly (with metrics) vs. requires broader reform | Scope clarity | — |

### Remotion-Friendly Design Notes:
- Each beat = one scene in Remotion
- Transitions: smooth fades or slides
- Mock data: seeded, deterministic, resettable
- Interactions: triggerable via URL params or state toggles
- Color: premium legal-tech (navy, slate, off-white, muted gold accent, green for success)
- Kano order preserved: Basics → Performance → Delighters
