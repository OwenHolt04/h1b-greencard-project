---
name: immigration-system-analysis
description: >
  Diagnostic frameworks for the H-1B to Green Card immigration system.
  Use when analyzing immigration process failures, mapping stakeholder
  pain points, performing RCA on filing errors or delays, building SIPOC
  models for visa workflows, or creating customer journey maps for
  applicants/employers/attorneys. Covers the full pathway: H-1B, PWD,
  PERM, I-140, priority date, I-485.
---

# Immigration System Analysis Skill

Use this skill when diagnosing the H-1B → Green Card employment-based immigration process.

## When to Use

- Analyzing why RFE rates are high
- Mapping handoffs across USCIS, DOL, DOS
- Understanding document rework loops
- Identifying where stakeholders lack visibility
- Diagnosing process delays (avoidable vs structural)
- Building current-state or future-state system maps
- Prioritizing capabilities for the demo prototype

## System Overview

### Stakeholders

| Actor | Role | Primary System |
|-------|------|---------------|
| Immigrant worker | Beneficiary / applicant | USCIS online account, attorney portal |
| Employer | Petitioner / sponsor | HRIS, attorney coordination, DOL iCERT |
| Immigration attorney | Legal representative | Case management software, all agency portals |
| USCIS | Adjudicator (H-1B, I-140, I-485) | USCIS ELIS, myUSCIS |
| DOL | Labor certification (PERM, PWD) | FLAG/iCERT system |
| DOS (State Dept) | Visa bulletin, consular processing | CEAC |

### Key Stages

1. **H-1B** — Specialty occupation petition (lottery + approval)
2. **PWD** — Prevailing Wage Determination from DOL (6-9 months, ~15% revision rate)
3. **PERM** — Labor certification (ETA-9089), recruitment, DOL audit risk (~30% RFE/audit rate)
4. **I-140** — Immigrant petition (employer-sponsored)
5. **Priority Date** — Queue position; subject to visa bulletin and per-country caps
6. **I-485** — Adjustment of status (final green card step)

### Critical Pain Points (from project research)

1. **No cross-form validation** — Same data re-entered across 6+ forms with no consistency checks → minor terminology inconsistencies trigger RFEs that reset adjudication clocks
2. **Fragmented status visibility** — 4 agency portals + 1 mailbox + 0 unified dashboards; no single actor sees the full case
3. **No plain-language guidance** — Eligibility criteria exist in 20+ page policy manuals rather than interactive checks; legal jargon creates fear
4. **Extension loops** — Every month of processing delay triggers mandatory H-1B extensions at $2K-$5K+ per filing; most employer HR lacks proactive tracking
5. **Employer cost opacity** — Total sponsorship cost ($10K-$30K+) invisible at job offer stage; budget surprises trigger informal hiring bans
6. **Attorney coordination overhead** — Manual document assembly, no shared case record; errors entering at step 1 surface at step 7
7. **PERM vulnerability** — ~30% of filings hit RFE/audit, often due to job description inconsistencies or missing recruitment docs that pre-submission review would catch
8. **No single process owner** — 10+ handoffs across applicant → attorney → employer → DOL → USCIS → DOS with no coordinator role; each handoff is a failure point
9. **Fear and information vacuum** — Applicants describe the process as more opaque and risky than it technically is because they have no feedback signals, no progress indicators, and no way to distinguish normal wait from a problem

### Structural vs Avoidable Problems

**Structural (cannot be solved by software alone):**
- Annual visa caps (85K H-1B, ~140K EB green cards)
- Per-country limits causing multi-year backlogs (India EB-2/3 especially)
- Congressional/legislative constraints
- USCIS staffing and adjudication capacity (fee-funded, 50% backlog increase)
- Retrogression / priority date wait times

**Avoidable (addressable by process/technology improvements):**
- Data re-entry and cross-form inconsistencies (6+ forms, same fields)
- Lack of unified case tracking (4 portals, 0 dashboards)
- Missed extension deadlines (no auto-triggers)
- Opaque status and legal language (no plain-language layer)
- Manual document assembly and review
- No pre-submission validation (system catches errors at adjudication, not intake)
- Handoff coordination failures (no SLAs, no named owners)

## Diagnostic Framework Sequence

Apply in this order (skip where not relevant):

### 1. Problem Statement
- What's broken? (specific, measurable)
- Who's affected?
- What's the impact? (English + Math — at least one number)
- What would "good" look like?

### 2. Scope
- In scope / out of scope (with rationale for exclusions)
- System boundaries
- Time horizon
- Assumptions and constraints

### 3. Root Cause Analysis

**CRITICAL RULE: Configure domain names using case facts. Never use generic labels.**

Bad domains: "People," "Process," "Technology," "Data"
Good domains: "The Handoff Maze," "The Black Box," "The Extension Spiral," "Filing Without a Net," "The Re-Keying Tax," "4 Portals and 0 Dashboards"

Analyze by configured domains such as:
- **Regulatory constraints** — statutory limits, INA rules, per-country caps
- **Filing fragmentation** — requirements that force re-entry, sequential forms months apart
- **Coordination vacuum** — who's responsible, handoff failures, no process owner
- **The re-keying tax** — same 12+ fields entered across 6+ forms with no sync
- **Portal archipelago** — 4 agency systems, none integrated, no shared case ID
- **The opacity problem** — legal jargon, no progress indicators, fear amplification

Use 5 Whys logic within each domain. End with 1-3 root drivers. Include at least 1 quantified fact per domain.

### 4. SIPOC
Map for the specific process under analysis.
Focus on: handoffs, missing enablers, undefined outputs.

### 5. Customer Journey
Map for specific persona (applicant, employer/HR, or attorney).
Focus on: awareness, filing, waiting, responding, completion.
Identify: pain points, moments of truth, emotional state.
**Carry the persona through subsequent frameworks** — don't use them once and drop them.

### 6. Optional Frameworks (apply when triggered)

- **People-Process-Technology (PPT)** — when the problem spans all three dimensions. Show REACTIONS between layers, not parallel summaries.
- **Bullseye** — when tracing from intent through policy to technology to culture
- **Value Chain** — when analyzing end-to-end value delivery
- **Capability Mapping** — when translating findings into future-state abilities
- **Kano Model** — when prioritizing capabilities (Basic → Performance → Delighter)
- **System Map** — when identifying drivers, mainstay process, and enablers (especially missing enablers)

## Key Metrics (from team research)

### Capability Metrics (from Pain Points & Capabilities spreadsheet)

| Capability Area | Lead Metric | Lag Metric | Current | Target |
|----------------|------------|------------|---------|--------|
| Cross-form validation | % filings passing consistency check before submission | RFE rate | ~25% | <5% |
| PWD pre-validation | % PWD submissions using pre-validated SOC codes | DOL revision cycle rate | ~15% | <3% |
| PERM intake validation | % PERM filings run through validation before submission | PERM RFE/audit rate | ~30% | <10% |
| Unified dashboard | Dashboard adoption rate (% active users) | Status inquiry call volume | Baseline | -60% |
| Auto-extension triggers | % extensions auto-triggered 90+ days before expiry | Missed deadlines / lapsed statuses | Risk present | 0 missed |
| Plain-language wizard | % applicants completing wizard before attorney consult | Attorney hours on basic eligibility | ~8 hrs/case | ~3 hrs/case |
| Self-service intake | % basic form sections completed via wizard | Attorney cost per standard filing | $5K-$15K | $3K-$8K |
| Case coordinator SLAs | % cases with named owner and SLA assigned | Average idle days between handoffs | Weeks | <5 days |
| Milestone notifications | % notifications sent within 24 hrs of status change | Applicant-initiated status calls | Baseline | -70% |
| Visa bulletin alerts | % applicants enrolled in automated alerts | Self-reported anxiety; unnecessary attorney calls | High | Reduced |

### Kano Classification Guide

When prioritizing capabilities, classify using Kano:

- **Basic** — Absence causes filing failures or trust collapse. Must-have. Demo these first. Examples: cross-form validation, handoff completeness checks, auto-populated shared fields, pre-flight validation engine.
- **Performance** — Satisfaction scales linearly with investment. Keeps you competitive. Examples: unified dashboard, auto-extension triggers, self-service wizard, case coordinator SLAs.
- **Delighter** — Unexpected value, disproportionate satisfaction, often low cost. Examples: plain-language eligibility wizard, proactive milestone notifications, visa bulletin movement alerts.

**Build order: eliminate all Basic gaps first → invest in highest-impact Performance → add Delighters selectively.**

## Reference Files

For detailed framework handbook and application examples, read:
- `references/framework-handbook.md` — full MGT 120 framework toolkit adapted for immigration
- `references/worked-examples.md` — concrete diagnostic and design examples from this project
