# 06 Intake Redundancy Matrix

## Purpose
This document translates the form review in `docs/forms` into a practical matrix for revising the `Smart Intake + Validation` section of the CaseBridge website.

The goal is to identify:
- which data is asked for repeatedly across forms and checklist materials
- which evidence is uploaded or referenced repeatedly
- which items should become shared intake fields and reusable document objects
- which items should remain modular because they are bespoke legal, sponsor, or medical workflows

This matrix is intentionally biased toward the core employment-based journey:
- `I-129`
- `M-735` checklist for `I-129 H-1B`
- `I-140`
- `I-485`
- `I-131`
- `I-765`
- `I-693`

It also includes conditional forms that matter when intake branches into exception handling:
- `I-212`
- `I-601`
- `I-612`
- `I-508`
- `I-864`
- `I-865`

## Capability Anchors
These are the future-state capabilities this matrix should support.

- `B1` Ability for immigration attorneys to run automated cross-form consistency checks at filing time, flagging 90%+ of terminology and data mismatches that currently trigger RFEs, reducing RFE rate from about 25% to below 5%.
- `B3` Ability for the filing system to auto-populate shared fields across 6+ forms from a single intake record, eliminating re-keying contradictions.
- `B4` Ability for the system to run pre-flight package checks for missing evidence, history gaps, and trigger conditions before attorney review.
- `P3` Ability for applicants and legal teams to complete standard sections through a self-service intake flow, reducing manual attorney hours on repeatable intake work.

## How To Use This Matrix
- Treat each row as a candidate `shared intake field group` or `shared evidence object`.
- Store the value once in the canonical case record.
- Sync the value into form summaries and downstream checklists.
- Attach rule logic to the row so the system can detect conflicts, omissions, or branch conditions.
- Keep bespoke legal narratives, sponsor obligations, and civil-surgeon medical findings outside the shared core.

## Matrix A: Shared Data Intake
| Shared intake domain | Repeated data points | Forms that request it | Redundancy pattern | CaseBridge source of truth | Sync targets in prototype | Validation / trigger rules | Priority |
|---|---|---|---|---|---|---|---|
| Identity and legal names | Legal name, other names used, aliases, maiden names, nicknames | `I-129`, `I-140`, `I-485`, `I-131`, `I-765`, `I-212`, `I-601`, `I-612` | Same person identity re-entered in nearly every packet | `Applicant.identity` | Intake cards, form package cards, role views | Flag name-format mismatch, missing alias history, inconsistent Romanization or punctuation | Basic |
| Core identifiers | `A-Number`, USCIS Online Account Number, SSN, DOS case number where relevant | `I-129`, `I-140`, `I-485`, `I-131`, `I-765`, `I-212`, `I-601`, `I-612`, `I-508`, `I-864`, `I-865`, `I-9` | Same identifiers are retyped across applicant, sponsor, and compliance forms | `Applicant.identifiers`, `Case.externalRefs` | Case header, intake sections, form metadata | Flag missing identifier where previously known, conflicting A-Number, receipt-number mismatch | Basic |
| Birth and citizenship profile | DOB, city of birth, province/state of birth, country of birth, country of citizenship or nationality | `I-129`, `I-140`, `I-485`, `I-131`, `I-765`, `I-212`, `I-601`, `I-612`, `I-864` | Same biographic facts appear in both the form body and supporting evidence requirements | `Applicant.birthAndCitizenship` | Intake, applicant role view, form package summaries | Flag conflicts with passport, DS-2019, birth certificate, or prior filings | Basic |
| Contact and address history | Mailing address, physical address, prior address history, most recent foreign address, safe address | `I-129`, `I-140`, `I-485`, `I-131`, `I-765`, `I-212`, `I-601`, `I-612`, `I-508`, `I-864`, `I-865`, `I-9` | Address data is repeatedly recollected, then checked again when history matters | `Applicant.addresses` and `Sponsor.addresses` | Intake section, role views, case summary | Flag address gaps, invalid U.S. mailing logic, mismatch between safe and physical address, stale sponsor address | Basic |
| Passport and travel document profile | Passport number, travel document number, issuing country, issue date, expiration date | `I-129`, `I-140`, `I-485`, `I-131`, `I-765`, `I-612` instructions, `I-9` as evidence context | Same document identity is used for arrival history, travel authorization, and work authorization | `Applicant.passportSummary` | Intake, evidence bundle, travel cards | Flag expired passport where active travel filing depends on it, mismatch with last-arrival record | Basic |
| U.S. entry and status history | Date of last arrival, place of last arrival, class of admission, current status, status expiration, `I-94` number, prior periods of stay | `I-129`, `I-140`, `I-485`, `I-131`, `I-765`, `I-601`, `I-612` instructions | Same status chronology is re-entered across employment, adjustment, waiver, and travel forms | `Applicant.immigrationHistory[]` | Intake timeline, form cards, case workspace | Flag missing arrival periods, impossible status overlap, inconsistent `I-94` or class-of-admission values | Basic |
| J-1 / exchange visitor history | Prior J-1 or J-2 status, DS-2019 or IAP-66 history, section 212(e) exposure | `I-129`, `I-485` instructions, `I-612`, `I-612` instructions | J-history is a classic branch point that gets rediscovered late | `Applicant.exchangeVisitorHistory` | Intake branch panel, risk flags | Trigger `I-612` branch, surface DS-2019 requirement, warn when adjustment path needs waiver evidence | Basic |
| Removal / unlawful presence / inadmissibility history | Removal dates, removal locations, unlawful presence periods, prior `I-212` or `I-601`, criminal/inadmissibility grounds | `I-212`, `I-601`, `I-485` instructions | Same legal history is re-collected across waiver and adjustment contexts | `Applicant.inadmissibilityHistory` | Conditional intake branch, attorney risk view | Trigger waiver branch logic, block "ready" state until required waiver track is acknowledged | Basic |
| Employer profile | Employer legal name, display name, FEIN/EIN, business type, employee count, nonprofit status, income or sponsor-related business relationship | `I-129`, `I-140`, `I-485` employment-based section, `I-864` in limited related-worker cases | Employer identity is repeatedly reused and small formatting differences create avoidable downstream risk | `Employer.profile` | Intake, case header, form package cards | Flag legal-name formatting mismatch, FEIN mismatch, small-employer/nonprofit inconsistency | Basic |
| Job and worksite profile | Job title, SOC or occupation logic, wage, worksite, dates of intended employment, hours, third-party site, job duties | `I-129`, `M-735`, `I-140`, `I-485` employment-based context | Same job facts drive H-1B, labor certification, I-140, and downstream adjustment support | `Job.role` | Intake section, form stack, validation panel | Flag title mismatch, worksite mismatch, wage/SOC mismatch risk, missing third-party worksite details | Basic |
| Underlying petition and stage linkage | Prior receipt numbers, concurrent filing linkage, principal vs derivative linkage, priority date, related `I-140` and `I-485` references | `I-129`, `I-140`, `I-485`, `I-131`, `I-765`, `I-212`, `I-601` | Same case references are manually copied between connected forms | `Case.externalRefs`, `Case.timeline` | Case workspace, form cards, alerts | Flag missing underlying petition, invalid concurrent-filing state, mismatched priority date or principal record | Basic |
| Dependents and family relationships | Spouse and child names, DOBs, relationship type, derivative linkage | `I-129`, `I-140`, `I-485`, `I-612`, `I-864`, `I-865` | Relationship data is reused across dependent filings, waiver context, and sponsorship forms | `Applicant.relationships[]` | Intake, role views, downstream checklist logic | Flag missing derivative info, spouse/child mismatch across forms, inconsistent dependency counts | Performance |
| Sponsor profile and support obligations | Sponsor identity, domicile, immigration status, sponsored immigrant list, household size, income, address changes | `I-864`, `I-865`, `I-485` instructions | Sponsorship has repeatable structure but belongs to a separate module | `Sponsor.profile`, `Sponsor.household` | Conditional sponsor module | Trigger `I-864` requirement, `I-865` maintenance obligation, household-size completeness checks | Performance |
| Preparer / interpreter / representation | `G-28` attachment, interpreter info, preparer info, attorney details | Many forms in folder including `I-129`, `I-140`, `I-485`, `I-131`, `I-765`, `I-212`, `I-601`, `I-612`, `I-508`, `I-864` | The same law-firm and preparer details are repeatedly re-entered | `Attorney.profile`, `Case.representation` | Intake metadata, form stack | Flag missing preparer signature fields or inconsistent counsel info across forms | Performance |
| Biographic / physical descriptors | Sex, ethnicity, race, height, weight, hair color, eye color | `I-131`, `I-601`, parts of other biometrics-related flows | Repeated only in selected forms, but still useful as structured profile data | `Applicant.biographicProfile` | Intake branch or biometrics subpanel | Flag incomplete biometrics profile when required by target form | Performance |
| Medical and vaccination metadata | Need for `I-693`, date signed by civil surgeon, vaccination dependency | `I-485`, `I-693`, `I-693` instructions | Medical info is partially shared, but substantive findings are external | `Medical.examStatus` | Checklist and readiness panel only | Trigger `I-693` requirement, seal-status reminder, expiration logic | Performance |

## Matrix B: Shared Evidence and Checklist Objects
| Evidence object | Common contents | Forms / checklists that rely on it | Reuse opportunity | Suggested document-vault tags | Intake / UX implication | Priority |
|---|---|---|---|---|---|---|
| Passport and identity document set | Passport bio page, visa page, entry stamps, travel document | `I-129`, `M-735`, `I-140`, `I-485`, `I-131`, `I-765`, `I-612` instructions, `I-9` | One upload can satisfy identity, arrival, and travel proof across multiple steps | `passport`, `visa`, `entry-stamp`, `travel-document` | Upload once, preview where reused, warn if expired | Basic |
| `I-94` and status history set | Current and prior `I-94`s, CBP printouts, class-of-admission evidence | `I-129`, `I-140`, `I-485`, `I-131`, `I-765`, `I-612`, `I-601` | Strong candidate for a reusable evidence group tied to immigration-history entries | `i94`, `status-record`, `arrival-record` | System should attach evidence to each stay period, not just to the case broadly | Basic |
| `I-797` / approval notice set | Extensions, changes of status, approvals, receipt notices | `I-485` instructions, `I-765` employment-based categories, broader status proof | Same status-maintenance proof is relevant to multiple downstream packets | `i797`, `approval-notice`, `receipt-notice` | Show status chain continuity and missing segments | Basic |
| J-1 evidence set | `DS-2019`, `IAP-66`, J visa pages, J-entry stamps | `I-129`, `I-485` instructions, `I-612` | Same J-history evidence drives both waiver logic and later adjustment eligibility analysis | `ds2019`, `iap66`, `j1`, `j2` | Add branch card that appears only when J-history exists | Basic |
| Employment authorization evidence set | EAD card, employment-based category support, last-arrival evidence | `I-765`, `I-9`, related `I-485`/`I-131` context | Reusable in work-authorization and employer-verification storytelling | `ead`, `work-auth`, `i766` | Useful for applicant and employer views, but separate from petition core | Performance |
| Employer support packet | FEIN evidence, business records, organizational docs, tax or payroll indicators | `I-129`, `I-140`, `I-864` related-worker edge cases | Employer packet should be reusable across filings instead of rebuilt each time | `employer-identity`, `fein`, `business-records` | Create employer document drawer separate from applicant uploads | Basic |
| Wage and labor package | LCA, wage-level basis, OEWS / prevailing wage logic, ETA-9089 or labor cert support | `M-735`, `I-129`, `I-140` | High-value reuse and validation target across H-1B and employment-based green card steps | `lca`, `perm`, `eta9089`, `wage`, `soc` | Must support conflict detection between wage, SOC, job title, and worksite | Basic |
| Qualification evidence set | Degree records, transcripts, licenses, certifications, experience letters, achievement evidence | `I-140` and some employment-related downstream contexts | Same qualification packet underlies more than one adjudication step | `degree`, `transcript`, `license`, `experience-letter`, `achievement` | Intake should collect by evidence type, not by form | Performance |
| Relationship evidence set | Birth certificate, marriage certificate, proof of family relationship, termination of prior marriages | `I-485` family/derivative logic, `I-612`, `I-864` | Reused across derivative, hardship, and sponsorship contexts | `birth-certificate`, `marriage-certificate`, `relationship-proof`, `divorce-decree` | Intake should branch when spouse or child data is present | Performance |
| Sponsor financial support set | Proof of sponsor status, tax records, income, household support evidence | `I-864`, `I-485` instructions | Distinct reusable sponsor module rather than general applicant intake | `sponsor-status`, `tax-return`, `income-proof`, `household` | Keep separate from employment intake, but connect through checklist engine | Performance |
| Criminal and court record set | Arrest reports, charging documents, court dispositions, rehabilitation evidence | `I-485` instructions, `I-601`, sometimes `I-765` category-specific questions | Shared legal-risk packet that can be referenced in multiple waiver or admissibility contexts | `court-record`, `arrest-record`, `disposition`, `rehabilitation` | Sensitive module; attorney-facing first, limited applicant view | Performance |
| Waiver narrative packet | Hardship statement, persecution statement, unlawful presence explanation, removal explanation | `I-212`, `I-601`, `I-612` | Some facts can be shared, but narratives remain bespoke legal work | `hardship-statement`, `persecution-statement`, `inadmissibility-explanation` | Should be a guided legal narrative module, not generic intake | Performance |
| Medical packet | Vaccination records, civil-surgeon-sealed `I-693`, exam completion metadata | `I-485`, `I-693` | Only metadata should be centralized; substantive results stay external | `medical`, `vaccination`, `i693` | Track requirement and status, but do not pretend the website generates medical findings | Performance |
| Signature / filing-completeness packet | Signatures, `G-28`, fee readiness, payment routing, filing-address confirmation | `M-735`, many USCIS instructions | Shared checklist logic, not shared substantive evidence | `signature`, `g28`, `fee-check`, `filing-readiness` | Best represented as a pre-flight checklist engine | Basic |

## Matrix C: Intake Branches That Should Be Triggered, Not Always Shown
| Trigger condition | Branch module to reveal | Why it should not live in baseline intake |
|---|---|---|
| Prior or current J-1 / J-2 history | `Exchange Visitor / I-612` branch | Relevant only for a subset of applicants; too much noise in the default flow |
| Removal, unlawful presence, or inadmissibility issue | `Waiver / I-212 / I-601` branch | High legal complexity; should be surfaced when triggered, not as default intake |
| A, G, E, or NATO diplomatic context | `I-508` branch | Niche eligibility path, not core to employment-based happy path |
| Sponsor required under public-charge or related-worker context | `I-864 / sponsor` branch | Distinct financial-support workflow with different actor and evidence set |
| Adjustment package requires medical | `I-693` branch | Universal enough to track, but completion happens outside the portal |
| Re-parole or travel-document pathway | `I-131` travel branch | Travel questions differ enough from core filing intake that they should appear contextually |
| Work authorization filing needed | `I-765` branch | Tied to category and stage; should reuse shared data, then add category-specific details |

## Recommended Intake Revision for the Website
The intake section should be reorganized around reusable domains, not government form boundaries.

### Recommended intake sections
1. `Identity`
2. `Identifiers`
3. `Address + Contact`
4. `Immigration History`
5. `Employer`
6. `Job + Worksite`
7. `Dependents + Relationships`
8. `Evidence Vault`
9. `Conditional Branches`

### Recommended branch order
- baseline shared intake first
- conditional branch cards second
- form package mapping third
- validation results fourth

### Recommended "show, don't tell" moments
- edit employer legal name once and watch `I-140`, `I-485`, `I-765`, and `I-131` cards sync
- attach one passport document and show it satisfying multiple checklist requirements
- reveal one missing `I-94` period and one employer-name mismatch
- resolve the issue and increase the readiness score

## Recommended Validation Rules for Demo
| Rule | Why it matters | Demo value |
|---|---|---|
| Employer legal name differs across package items | Common real-world contradiction that can trigger delays | Easy to understand visually |
| Job title or duties do not align with SOC / wage logic | Higher-stakes compliance risk | Shows the system is doing more than spellcheck |
| Travel or address history has a gap | Common completeness failure | Demonstrates routine pre-flight validation |
| Required evidence object missing for selected filing package | Core checklist failure | Visibly changes readiness state |
| J-1 history exists but no DS-2019 / waiver path recorded | Hidden downstream blocker | Strong example of branch intelligence |
| Waiver-trigger facts present but no waiver branch acknowledged | Prevents false "ready" state | Shows honest scope and legal caution |

## Data-Model Additions Recommended for `Smart Intake + Validation`
These fields would strengthen the current canonical case model in `docs/specs/03-data-model-mock-logic-interaction-states.md`.

### Add to `Applicant`
- `otherNames[]`
- `identifiers.ssn`
- `identifiers.uscisOnlineAccountNumber`
- `birthAndCitizenship`
- `addresses.currentMailing`
- `addresses.currentPhysical`
- `addresses.history[]`
- `passportSummary`
- `exchangeVisitorHistory`
- `inadmissibilityHistory`

### Add to `Employer`
- `legalNameNormalized`
- `fein`
- `businessType`
- `employeeCountBand`
- `nonprofitOrResearchOrg`

### Add to `Job`
- `intendedEmploymentStart`
- `intendedEmploymentEnd`
- `hoursPerWeek`
- `worksites[]`
- `isThirdPartyPlacement`
- `wageLevelBasis`

### Add new shared objects
- `evidenceObjects[]`
- `checklistRequirements[]`
- `branchTriggers[]`

## Design Boundary: What Should Stay Modular
- `I-693` medical findings should remain external to the portal; track requirement and completion status only.
- `I-212`, `I-601`, and `I-612` should reuse shared intake facts, but their narrative justifications should remain attorney-led modules.
- `I-864` and `I-865` should be modeled as sponsor workflows, not folded into the main applicant intake.
- `I-9` should be treated as an employer compliance sidecar, not as part of the USCIS filing core.

## Bottom Line
The strongest redesign move is not to make the intake form larger. It is to make it more canonical.

CaseBridge should behave like:
- one shared case record
- one evidence vault
- one trigger engine for conditional branches
- one validation layer that checks consistency before filing

That is the clearest way to eliminate the re-keying tax across the forms reviewed in `docs/forms` while keeping honest boundaries around medical, sponsor, and waiver-specific workflows.
