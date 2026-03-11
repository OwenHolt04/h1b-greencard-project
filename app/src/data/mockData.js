// ============================================================================
// CaseBridge — Seeded Mock Data
// One flagship case: Prajwal Kulkarni → HPE → Immigration Attorney
// All data deterministic and presentation-ready
// ============================================================================

export const applicant = {
  fullName: 'Prajwal Kulkarni',
  preferredName: 'Prajwal',
  countryOfBirth: 'India',
  nationality: 'Indian',
  currentCity: 'San Jose, CA',
  currentStatus: 'H-1B',
  statusExpirationDate: '2026-06-15',
  educationLevel: 'MBA',
  degreeField: 'Management',
  university: 'UC Davis Graduate School of Management',
  graduationYear: '2024',
  startDateInUS: '2022-08-20',
  dependents: [],
  priorityDate: '2022-03-15',
  aNumber: 'A-XXX-XXX-847',
  dateOfBirth: 'August 22, 1997',
  passportNumber: 'P XXXXXXX',
  passportExpiry: '2031-04-10',
};

export const employer = {
  legalName: 'Hewlett Packard Enterprise',
  legalNameIncorrect: 'Hewlett-Packard Enterprise',
  displayName: 'HPE',
  fein: 'XX-XXXXXXX',
  industry: 'Enterprise IT Infrastructure',
  headquarters: 'Spring, TX',
  workLocation: 'San Jose, CA',
  employeeCount: '~62,000',
  hrOwner: 'Rachel Torres',
  hrOwnerTitle: 'Senior HR Manager, Immigration',
  sponsorshipPolicy: 'Approved',
  extensionPolicy: 'Auto-initiate at 90 days before expiry',
  costCenter: 'Product Management',
  internalApprovalState: 'Approved',
};

export const attorney = {
  lawFirm: 'Immigration Attorney',
  attorneyName: 'Maya Chen',
  contactEmail: 'maya.chen@chenpatel.law',
  barNumber: 'CA-XXXXXX',
  reviewStatus: 'Pending Review',
  itemsPendingReview: 3,
  caseStrategyNote: 'EB-2 classification via MBA + specialty role. Priority date recently became current for India (Feb 2026 Visa Bulletin advancement). Concurrent filing window open — time-sensitive.',
};

export const job = {
  title: 'Senior Product Manager',
  socCode: '15-1299.08',
  socTitle: 'Computer Information Technology Managers',
  department: 'Hybrid Cloud Product Management',
  jobLocation: 'San Jose, CA',
  salary: '$155,000',
  salaryNumeric: 155000,
  wageLevel: 'Level 3',
  prevailingWage: '$142,000',
  wageSource: 'OFLC Online Wage Library',
  wageSurveyPeriod: 'Q4 2023',
  wageSurveyPeriodIncorrect: 'Q2 2023',
  jobDutiesSummary: 'Define product strategy and roadmap for enterprise hybrid cloud infrastructure serving Fortune 500 customers.',
  specialtyOccupationConfidence: 'High',
  mobilityRisk: 'Low',
};

export const caseRecord = {
  caseId: 'CB-2022-003291',
  caseName: 'Kulkarni, Prajwal — EB-2 Green Card',
  currentStage: 'i485-prep',
  pathwayType: 'EB-2',
  priorityDate: 'March 15, 2022',
  nextFiling: 'I-485 Package',
  caseHealth: 'Needs Review',
  createdAt: 'March 1, 2022',
  updatedAt: 'March 6, 2026',
};

export const stages = [
  { id: 'eligibility', label: 'Eligibility', status: 'complete', agency: 'Internal', date: 'Mar 2022' },
  { id: 'pwd', label: 'PWD', status: 'complete', agency: 'DOL', date: 'Jun 2022' },
  { id: 'perm', label: 'PERM', status: 'complete', agency: 'DOL', date: 'Feb 2023' },
  { id: 'i140', label: 'I-140', status: 'complete', agency: 'USCIS', date: 'Sep 2023' },
  { id: 'visa-bulletin', label: 'Visa Bulletin', status: 'complete', agency: 'DOS', date: 'Feb 2026' },
  { id: 'i485', label: 'I-485 Prep', status: 'active', agency: 'USCIS', date: 'In Progress' },
  { id: 'biometrics', label: 'Biometrics', status: 'upcoming', agency: 'USCIS', date: '' },
  { id: 'approval', label: 'Approval', status: 'upcoming', agency: 'USCIS', date: '' },
];

export const validationIssues = [
  {
    id: 'soc-wage',
    severity: 'high',
    category: 'Classification Risk',
    title: 'SOC Code / Wage Survey Mismatch',
    description: 'SOC 15-1299.08 wage data references Q4 2023 OFLC survey, but the prevailing wage determination used Q2 2023 data. Discrepancy may trigger DOL audit or USCIS RFE.',
    plainDescription: "The salary reference data doesn't match across forms. This needs attorney review to align before filing.",
    affectedForms: ['ETA-9089', 'I-140'],
    affectedFields: ['job.wageSource', 'job.prevailingWage'],
    recommendedFix: 'Attorney to confirm correct wage survey period and update prevailing wage reference',
    penalty: 10,
  },
  {
    id: 'employer-name',
    severity: 'medium',
    category: 'Data Consistency',
    title: 'Employer Name Format Mismatch',
    description: 'Legal name appears as "Hewlett-Packard Enterprise" (with hyphen) in intake but "Hewlett Packard Enterprise" in I-140 and ETA-9089. Inconsistency may trigger an RFE.',
    plainDescription: 'The company name is written differently across forms. The hyphen and missing "Company" need to be standardized.',
    affectedForms: ['I-140', 'I-485', 'ETA-9089'],
    affectedFields: ['employer.legalName'],
    recommendedFix: 'Standardize to "Hewlett Packard Enterprise" across all records',
    currentValue: 'Hewlett-Packard Enterprise',
    correctedValue: 'Hewlett Packard Enterprise',
    penalty: 8,
    fixable: true,
  },
  {
    id: 'travel-history',
    severity: 'low',
    category: 'Completeness',
    title: 'Travel History Gap',
    description: 'I-485 requires complete travel history for the last 5 years. Records show a 3-week gap in December 2023 without a corresponding entry.',
    plainDescription: "There's a gap in your travel records from December 2023. Adding this trip prevents delays.",
    affectedForms: ['I-485'],
    affectedFields: ['applicant.travelHistory'],
    recommendedFix: 'Confirm travel dates for December 2023 and add entry',
    penalty: 5,
  },
];

export const alerts = [
  {
    id: 'h1b-expiry',
    type: 'deadline',
    title: 'H-1B Extension Due',
    body: 'Status expires June 15, 2026 — 102 days remaining. Auto-trigger set at 90 days.',
    severity: 'warning',
    daysRemaining: 102,
    autoTriggerDays: 90,
    icon: 'clock',
  },
  {
    id: 'attorney-review',
    type: 'action',
    title: 'Attorney Review Pending',
    body: 'Maya Chen has 3 items pending review before I-485 package can be finalized.',
    severity: 'info',
    icon: 'user-check',
  },
  {
    id: 'soc-flag',
    type: 'validation',
    title: 'SOC Classification Risk',
    body: 'SOC 15-1299.08 wage data inconsistency. Requires attorney resolution before filing.',
    severity: 'error',
    icon: 'alert-triangle',
  },
  {
    id: 'priority-date',
    type: 'info',
    title: 'Priority Date Now Current',
    body: 'EB-2 India: date advanced to April 2022 in Feb 2026 bulletin. Your March 2022 date is now current.',
    severity: 'success',
    icon: 'check-circle',
  },
];

export const formPackage = [
  {
    formCode: 'ETA-9089',
    displayName: 'PERM Application',
    status: 'certified',
    completionPercent: 100,
    flaggedIssuesCount: 1,
    syncedFields: 12,
    ownerRole: 'attorney',
  },
  {
    formCode: 'I-140',
    displayName: 'Immigrant Petition',
    status: 'approved',
    completionPercent: 100,
    flaggedIssuesCount: 1,
    syncedFields: 18,
    ownerRole: 'attorney',
  },
  {
    formCode: 'I-485',
    displayName: 'Adjustment of Status',
    status: 'in-progress',
    completionPercent: 82,
    flaggedIssuesCount: 2,
    syncedFields: 24,
    ownerRole: 'attorney',
  },
  {
    formCode: 'I-765',
    displayName: 'Employment Auth (EAD)',
    status: 'in-progress',
    completionPercent: 90,
    flaggedIssuesCount: 0,
    syncedFields: 14,
    ownerRole: 'applicant',
  },
  {
    formCode: 'I-131',
    displayName: 'Advance Parole',
    status: 'in-progress',
    completionPercent: 88,
    flaggedIssuesCount: 0,
    syncedFields: 10,
    ownerRole: 'applicant',
  },
  {
    formCode: 'G-28',
    displayName: 'Attorney Representation',
    status: 'complete',
    completionPercent: 100,
    flaggedIssuesCount: 0,
    syncedFields: 8,
    ownerRole: 'attorney',
  },
];

export const agencyStatus = [
  {
    agency: 'DOL',
    fullName: 'Department of Labor',
    status: 'PERM Certified',
    statusColor: 'green',
    lastUpdated: 'Feb 15, 2023',
    explanation: 'Labor certification approved. No further DOL action required.',
    plainExplanation: 'The Department of Labor confirmed the job offer meets wage requirements.',
  },
  {
    agency: 'USCIS',
    fullName: 'U.S. Citizenship & Immigration Services',
    status: 'I-140 Approved · I-485 Pending',
    statusColor: 'blue',
    lastUpdated: 'Feb 28, 2026',
    explanation: 'I-140 approved Sep 2023. I-485 concurrent filing package in preparation after priority date became current.',
    plainExplanation: "Your employer's petition was approved. The adjustment application is being prepared now that your date is current.",
  },
  {
    agency: 'DOS',
    fullName: 'Department of State',
    status: 'Priority Date Current',
    statusColor: 'green',
    lastUpdated: 'Feb 12, 2026',
    explanation: 'EB-2 India cut-off advanced to April 2022 in February 2026 Visa Bulletin. Applicant priority date (Mar 2022) is current.',
    plainExplanation: "After a long wait, your priority date is finally current — you're eligible to file the I-485.",
  },
];

export const intakeSections = [
  {
    id: 'identity',
    label: 'Identity',
    fields: [
      { key: 'fullName', label: 'Full Legal Name', value: 'Prajwal Kulkarni', syncTargets: ['I-129', 'I-140', 'I-485', 'I-765', 'I-131', 'G-28'] },
      { key: 'dateOfBirth', label: 'Date of Birth', value: 'August 22, 1997', syncTargets: ['I-129', 'I-485', 'I-765'] },
      { key: 'countryOfBirth', label: 'Country of Birth', value: 'India', syncTargets: ['I-129', 'I-140', 'I-485', 'I-765'] },
    ],
  },
  {
    id: 'identifiers',
    label: 'Identifiers',
    fields: [
      { key: 'aNumber', label: 'A-Number', value: 'A-XXX-XXX-847', syncTargets: ['I-129', 'I-140', 'I-485', 'I-765', 'I-131'] },
      { key: 'passportNumber', label: 'Passport Number', value: 'P XXXXXXX · India · Exp 04/2031', syncTargets: ['I-129', 'I-140', 'I-485', 'I-131', 'I-765'] },
      { key: 'i94Number', label: 'I-94 Record', value: 'I-94 #XXXXXXXXXXX · H-1B · 01/2025', syncTargets: ['I-129', 'I-140', 'I-485', 'I-131', 'I-765'] },
    ],
  },
  {
    id: 'immigration',
    label: 'Immigration History',
    fields: [
      { key: 'currentStatus', label: 'Current Status', value: 'H-1B', syncTargets: ['I-129', 'I-485', 'I-765'] },
      { key: 'statusExpiry', label: 'Status Expiration', value: 'June 15, 2026', syncTargets: ['I-129', 'I-485', 'I-765'] },
      { key: 'lastArrival', label: 'Last U.S. Arrival', value: 'SFO · Jan 12, 2025 · H-1B', syncTargets: ['I-485', 'I-131'] },
      { key: 'priorityDate', label: 'Priority Date', value: 'March 15, 2022', syncTargets: ['I-140', 'I-485'] },
      { key: 'classification', label: 'Classification', value: 'EB-2', syncTargets: ['I-140', 'I-485'] },
    ],
  },
  {
    id: 'employer',
    label: 'Employer',
    fields: [
      { key: 'employerLegalName', label: 'Employer Legal Name', value: 'Hewlett-Packard Enterprise', syncTargets: ['I-129', 'I-140', 'I-485', 'ETA-9089'], hasMismatch: true },
      { key: 'fein', label: 'FEIN', value: 'XX-XXXXXXX', syncTargets: ['I-129', 'I-140', 'ETA-9089'] },
      { key: 'workLocation', label: 'Work Location', value: 'San Jose, CA', syncTargets: ['I-129', 'I-140', 'ETA-9089'] },
    ],
  },
  {
    id: 'job',
    label: 'Job / Worksite',
    fields: [
      { key: 'jobTitle', label: 'Job Title', value: 'Senior Product Manager', syncTargets: ['I-129', 'I-140', 'I-485', 'ETA-9089'] },
      { key: 'socCode', label: 'SOC Code', value: '15-1299.08', syncTargets: ['I-129', 'ETA-9089', 'I-140'] },
      { key: 'salary', label: 'Annual Salary', value: '$155,000', syncTargets: ['I-129', 'I-140', 'ETA-9089'] },
      { key: 'wageLevel', label: 'Wage Level', value: 'Level 3', syncTargets: ['ETA-9089'] },
    ],
  },
  {
    id: 'address',
    label: 'Address / Travel',
    fields: [
      { key: 'currentAddress', label: 'Current Address', value: '2180 The Alameda, San Jose, CA 95126', syncTargets: ['I-129', 'I-485', 'I-765', 'I-131'] },
      { key: 'travelHistory', label: 'Travel History (5 yr)', value: '12 trips recorded — 1 gap identified', syncTargets: ['I-485'], hasGap: true },
    ],
  },
];

// Evidence objects — one source document satisfying multiple form requirements
export const evidenceObjects = [
  { name: 'Passport (bio page + visa stamps)', reusedIn: ['I-129', 'I-140', 'I-485', 'I-131', 'I-765', 'I-9'], status: 'collected' },
  { name: 'I-94 Arrival/Departure Record', reusedIn: ['I-129', 'I-140', 'I-485', 'I-131', 'I-765'], status: 'collected' },
  { name: 'I-797 Approval Notices (H-1B)', reusedIn: ['I-485', 'I-765', 'I-131'], status: 'collected' },
  { name: 'Employment Verification Letter', reusedIn: ['I-140', 'I-485'], status: 'missing', flag: 'Request from HPE HR' },
  { name: 'Wage / PERM Package (LCA + ETA-9089)', reusedIn: ['I-129', 'I-140', 'ETA-9089'], status: 'flagged', flag: 'Survey period mismatch' },
  { name: 'Degree + Credential Evaluation', reusedIn: ['I-140', 'I-485'], status: 'collected' },
];

export const roleContent = {
  applicant: {
    greeting: 'Your case is on track.',
    statusSummary: "Your priority date just became current after a multi-year wait. Your I-485 adjustment of status package is now being prepared — this is the filing window you've been waiting for.",
    nextStep: "No action needed today. Your attorney is reviewing the filing package and will notify you when your confirmation is needed. This is time-sensitive — file while your date remains current.",
    timeline: 'Your green card process started in March 2022. Five of eight major milestones are complete. After years of waiting for your EB-2 India priority date, the filing window is now open.',
    alerts: [
      { title: 'Work Authorization', body: 'Your H-1B is valid through June 15, 2026. HPE will handle the extension.', type: 'info' },
      { title: 'Priority Date Current', body: "After years of waiting, your EB-2 India priority date is finally current. This is your filing window.", type: 'success' },
      { title: 'Travel Advisory', body: 'Discuss any international travel plans with your attorney first. Advance Parole may be required.', type: 'warning' },
    ],
    actions: ['Review personal information', 'Confirm travel dates', 'Upload supporting documents'],
  },
  employer: {
    greeting: 'Case active — deadlines approaching.',
    statusSummary: "Prajwal Kulkarni's I-485 filing is in preparation after his EB-2 India priority date became current. H-1B extension will need initiation within 90 days. All internal approvals are current.",
    nextStep: 'Extension filing auto-triggers at 90 days before expiry (March 17, 2026). Estimated extension cost: $2,500–4,000 including legal fees.',
    timeline: 'Sponsorship initiated March 2022. PERM certified, I-140 approved. Priority date became current Feb 2026 after multi-year wait. I-485 filing window now open. Extension approaching.',
    alerts: [
      { title: 'H-1B Extension: 102 Days', body: 'Extension window approaching. Auto-trigger at 90 days. Budget approval may be needed.', type: 'warning' },
      { title: 'Sponsorship Cost This Cycle', body: 'Estimated total: $15,000–22,000. Spent to date: $6,800.', type: 'info' },
      { title: 'Workforce Continuity', body: 'No gap expected if extension filed on time. EAD provides backup authorization.', type: 'success' },
    ],
    actions: ['Review extension timeline', 'Approve budget allocation', 'Confirm HR attestations'],
  },
  attorney: {
    greeting: 'Filing package: 3 items to resolve.',
    statusSummary: 'I-485 concurrent filing package at 82% readiness. 3 validation issues: 1 high (SOC/wage), 1 medium (employer name), 1 low (travel gap). Time-sensitive — EB-2 India date may retrogress.',
    nextStep: 'Resolve SOC wage survey discrepancy (Q4 vs Q2 2023). Standardize employer legal name to "Hewlett Packard Enterprise." Request missing December 2023 travel dates from applicant.',
    timeline: 'Case initiated March 2022. All prerequisite filings approved. Priority date became current Feb 2026. I-485 package blocked by 3 validation items. Estimated filing-ready: 5–7 business days after resolution.',
    alerts: [
      { title: 'SOC 15-1299.08 Classification Risk', body: 'Wage survey period mismatch between ETA-9089 and I-140. Risk of DOL audit or RFE.', type: 'error' },
      { title: 'Employer Name Standardization', body: '"Hewlett-Packard Enterprise" vs "Hewlett Packard Enterprise" — inconsistency across 3 forms.', type: 'warning' },
      { title: 'Evidence Bundle: 21 of 23', body: 'Missing: employment verification letter, December 2023 travel records.', type: 'info' },
    ],
    actions: ['Resolve SOC/wage discrepancy', 'Standardize employer name', 'Request missing evidence', 'Finalize filing package'],
  },
};

export const metrics = {
  rfeRate: { before: '~25%', after: '<5%', label: 'RFE Rate', change: '-80%', description: 'Pre-submission validation catches contradictions before filing' },
  statusCalls: { before: '4 portals', after: '1 view', label: 'Status Inquiries', change: '-60%', description: 'Unified cross-agency dashboard replaces fragmented tracking' },
  attorneyHours: { before: '~8 hrs', after: '~3 hrs', label: 'Eligibility Review', change: '-62%', description: 'Plain-language wizard reduces intake and basic-eligibility overhead' },
  extensionCost: { before: '$5,000+', after: '~$2,500', label: 'Extension Cost', change: '-50%', description: 'Auto-triggered reminders prevent emergency filings and rush fees' },
  handoffIdle: { before: 'Weeks', after: '<5 days', label: 'Handoff Time', change: '-75%', description: 'Named case coordinators with response-time SLAs' },
  pwdRevisions: { before: '~15%', after: '<3%', label: 'PWD Revisions', change: '-80%', description: 'Pre-validated SOC/wage data reduces revision cycles' },
};

export const scopeNote = 'This platform reduces avoidable process friction, rework, and uncertainty. It does not eliminate statutory caps, retrogression, or all legal complexity.';

export const solvesDirect = [
  { title: 'Cross-form data inconsistency', detail: 'Single intake syncs across 6+ forms. RFE rate target: 25% → <5%' },
  { title: 'Fragmented status visibility', detail: 'One dashboard replaces 4 portals + 1 mailbox. Status inquiry calls: -60%' },
  { title: 'Missed extension deadlines', detail: 'Auto-triggered reminders at 90 days. Per-extension cost: -50%' },
  { title: 'Legal language opacity', detail: 'Plain-language wizard for eligibility. Attorney basic hours: 8 → 3' },
  { title: 'Dropped handoffs between stakeholders', detail: 'Named coordinators with SLAs. Idle time: weeks → <5 business days' },
  { title: 'PWD / wage data revision cycles', detail: 'Pre-validated SOC/wage data. Revision rate: 15% → <3%' },
];

// ============================================================================
// Document Checklist — stage-gated pre-flight requirements
// ============================================================================

export const documentChecklist = [
  {
    stage: 'PWD — Prevailing Wage',
    agency: 'DOL iCERT Submission',
    stageNumber: 1,
    complete: true,
    documents: [
      { name: 'ETA-9141 Form — complete all fields', status: 'done', required: true },
      { name: 'SOC code selection with job duties narrative', status: 'done', required: true },
      { name: 'Employer wage rate documentation', status: 'done', required: true },
      { name: 'OFLC wage survey data (if applicable)', status: 'done', required: false },
      { name: 'iCERT account access verified', status: 'done', required: true },
    ],
  },
  {
    stage: 'PERM — Labor Certification',
    agency: 'DOL ETA-9089',
    stageNumber: 2,
    complete: true,
    documents: [
      { name: 'Prevailing Wage Determination (valid)', status: 'done', required: true },
      { name: 'Supervised recruitment record (30 days)', status: 'done', required: true },
      { name: 'Job description consistency check', status: 'flagged', required: true, flag: 'SOC wage survey period mismatch' },
      { name: 'Sunday newspaper ad (2 separate Sundays)', status: 'done', required: true },
      { name: 'Notice of Filing (posted 30 days)', status: 'done', required: true },
      { name: 'U.S. worker rejection documentation', status: 'done', required: true },
    ],
  },
  {
    stage: 'I-140 — Immigrant Petition',
    agency: 'USCIS Filing',
    stageNumber: 3,
    complete: true,
    documents: [
      { name: 'Approved PERM certification (ETA-9089)', status: 'done', required: true },
      { name: 'Evidence of ability to pay (tax returns / audited financials)', status: 'done', required: true },
      { name: 'Beneficiary degree credential (NACES eval)', status: 'done', required: true },
      { name: 'Expert opinion letter (if EB-2 NIW)', status: 'na', required: false },
      { name: 'Filing fee ($715 standard / $2,805 premium)', status: 'done', required: true },
    ],
  },
  {
    stage: 'I-485 — Adjustment of Status',
    agency: 'USCIS Concurrent Filing',
    stageNumber: 4,
    complete: false,
    documents: [
      { name: 'Form I-485 (signed, dated)', status: 'done', required: true },
      { name: 'Form I-765 (EAD application)', status: 'done', required: true },
      { name: 'Form I-131 (Advance Parole)', status: 'done', required: true },
      { name: 'Form G-28 (Attorney representation)', status: 'done', required: true },
      { name: 'Birth certificate (translated, certified)', status: 'done', required: true },
      { name: 'Passport biographical pages (copies)', status: 'done', required: true },
      { name: 'I-94 arrival/departure record', status: 'done', required: true },
      { name: 'Employment verification letter from HPE', status: 'missing', required: true, flag: 'Request from Rachel Torres, HPE HR' },
      { name: 'Educational credentials (NACES evaluation)', status: 'done', required: true },
      { name: 'Medical examination (Form I-693)', status: 'done', required: true },
      { name: 'Passport-style photos (2)', status: 'done', required: true },
      { name: 'Complete travel history (5 years)', status: 'flagged', required: true, flag: 'December 2023 gap — confirm dates' },
      { name: 'Tax returns (3 years)', status: 'done', required: true },
      { name: 'Previous H-1B approval notices', status: 'done', required: true },
      { name: 'Filing fee ($1,440 + $85 biometrics)', status: 'pending', required: true },
    ],
  },
];

// ============================================================================
// Plain-Language Eligibility Wizard — guided yes/no for applicant
// ============================================================================

export const eligibilityChecks = [
  {
    id: 'specialty',
    question: 'Do you hold a specialty occupation?',
    answer: true,
    detail: 'Senior Product Manager at HPE qualifies under SOC 15-1299.08',
    plain: 'Your job requires specialized knowledge — it qualifies.',
    category: 'Job',
  },
  {
    id: 'education',
    question: 'Do you meet the education requirement?',
    answer: true,
    detail: 'MBA from UC Davis GSM satisfies EB-2 advanced degree requirement',
    plain: 'Your MBA meets the education bar for EB-2.',
    category: 'Education',
  },
  {
    id: 'sponsor',
    question: 'Has your employer committed to sponsorship?',
    answer: true,
    detail: 'HPE internal approval granted. PERM certified Feb 2023, I-140 approved Sep 2023.',
    plain: 'HPE has already completed the sponsorship steps.',
    category: 'Employer',
  },
  {
    id: 'priority',
    question: 'Is your priority date current?',
    answer: true,
    detail: 'EB-2 India cut-off advanced to April 2022 in Feb 2026 bulletin. Your March 2022 date is current.',
    plain: 'After years of waiting, your date is finally current. This is your window.',
    category: 'Visa Bulletin',
  },
  {
    id: 'status',
    question: 'Are you in valid immigration status?',
    answer: true,
    detail: 'H-1B valid through June 15, 2026 (102 days remaining). Extension auto-triggered at 90 days.',
    plain: 'Your H-1B is still valid. Extension will be filed before it expires.',
    category: 'Status',
  },
  {
    id: 'admissibility',
    question: 'Any criminal or immigration issues?',
    answer: true,
    detail: 'No adverse findings, no prior violations, no grounds of inadmissibility identified.',
    plain: "No issues found — you're clear on this requirement.",
    category: 'Background',
  },
  {
    id: 'medical',
    question: 'Is your medical examination complete?',
    answer: true,
    detail: 'Form I-693 completed and valid. Vaccination record up to date.',
    plain: 'Your medical exam is done and current.',
    category: 'Medical',
  },
  {
    id: 'documents',
    question: 'Are all required documents collected?',
    answer: false,
    detail: '21 of 23 documents collected. Missing: employment verification letter from HPE, December 2023 travel records.',
    plain: 'Almost there — 2 documents still needed before filing.',
    category: 'Documents',
  },
];

// ============================================================================
// AI Case Assessment — triage + prioritized recommendations
// ============================================================================

export const caseAssessment = {
  riskLevel: 'Medium',
  timeSensitivity: 'High',
  filingWindow: 'March 15 – March 30, 2026',
  summary: 'EB-2 India date is current but may retrogress in the April bulletin. File within the window.',
  recommendations: [
    { priority: 1, action: 'Resolve SOC/wage survey mismatch', reason: 'Highest RFE trigger — DOL audit risk', timeEstimate: '1–2 days', owner: 'Attorney' },
    { priority: 2, action: 'Obtain employment verification letter', reason: 'Required I-485 document missing', timeEstimate: '2–3 days', owner: 'HR (Rachel Torres)' },
    { priority: 3, action: 'Confirm December 2023 travel dates', reason: 'I-485 completeness requirement', timeEstimate: '1 day', owner: 'Applicant' },
    { priority: 4, action: 'Standardize employer legal name', reason: 'Cross-form inconsistency — quick fix', timeEstimate: '< 1 hour', owner: 'Attorney' },
  ],
  predictedTimeline: 'All items resolvable by March 15. File March 17–20 while date remains current.',
  filingStrategy: 'Concurrent filing (I-485 + I-765 + I-131) recommended to maximize protection during pendency.',
};

// ============================================================================
// Form Field Translations — gov language → plain language (from actual PDFs)
// ============================================================================

export const formFieldTranslations = {
  'I-485': {
    formTitle: 'Application to Register Permanent Residence or Adjust Status',
    plainTitle: 'Your Green Card Application',
    pageCount: 24,
    fields: [
      { ref: 'Part 1, Item 1', gov: 'Your Current Legal Name (Do not provide a nickname) — Family Name (Last Name), Given Name (First Name), Middle Name (if applicable)', plain: 'Your full legal name exactly as it appears on your passport. No nicknames.', value: 'Kulkarni, Prajwal', source: 'Auto-filled from shared record' },
      { ref: 'Part 1, Item 3', gov: 'Date of Birth (mm/dd/yyyy)', plain: 'Your birthday in month/day/year format.', value: '08/22/1997', source: 'Auto-filled from shared record' },
      { ref: 'Part 1, Item 7', gov: 'Place of Birth — City or Town of Birth, Country of Birth', plain: 'The city and country where you were born. This determines your "chargeability" — which visa queue you\'re in.', value: 'India', source: 'Auto-filled from shared record' },
      { ref: 'Part 1, Item 10', gov: 'Recent Immigration History — Passport or Travel Document Number Used at Last Arrival, Expiration Date, Country that Issued this Passport, Nonimmigrant Visa Number Used During Most Recent Arrival (if any)', plain: 'Details about the passport you used when you last entered the US. USCIS uses this to verify your legal entry.', value: 'P XXXXXXX · Exp 04/2031 · India', source: 'Auto-filled from shared record' },
      { ref: 'Part 1, Item 11', gov: 'When I last arrived in the United States: I was inspected at a Port of Entry and admitted as (for example, exchange visitor, visitor, temporary worker, student)', plain: 'How you entered the US last time. For H-1B holders, this is "temporary worker." This confirms you were legally admitted.', value: 'Temporary worker (H-1B)', source: 'Auto-filled from shared record' },
      { ref: 'Part 1, Item 14', gov: 'What is your current immigration status (if it has changed since your last arrival)?', plain: 'Your current visa type. If you changed status (e.g., from F-1 student to H-1B worker), note the current one.', value: 'H-1B', source: 'Auto-filled from shared record' },
      { ref: 'Part 1, Item 15', gov: 'Expiration Date of Current Immigration Status (mm/dd/yyyy) or Type "D/S" for Duration of Status', plain: 'When your current H-1B expires. This is why the 102-day extension deadline matters — CaseBridge tracks this for you.', value: '06/15/2026', source: 'Auto-filled · Extension auto-triggered at 90 days' },
      { ref: 'Part 1, Item 18', gov: 'Addresses — Current U.S. Physical Address, Date You First Resided at This Address', plain: 'Where you live now. Must match across all forms — CaseBridge syncs this automatically.', value: '2180 The Alameda, San Jose, CA 95126', source: 'Auto-filled · Synced to I-765, I-131' },
    ],
  },
  'I-140': {
    formTitle: 'Immigrant Petition for Alien Workers',
    plainTitle: 'Your Employer\'s Petition for You',
    pageCount: 8,
    fields: [
      { ref: 'Part 2, Item 1.d', gov: 'This petition is being filed for: A member of the professions holding an advanced degree or an alien of exceptional ability (who is NOT seeking a National Interest Waiver)', plain: 'This is the EB-2 category. It means you have a master\'s degree (your MBA) and the job requires that level of education.', value: 'Selected ✓ (EB-2 Advanced Degree)', source: 'Pre-selected based on classification' },
      { ref: 'Part 1, Item 2', gov: 'Company or Organization Name', plain: 'Your employer\'s exact legal name. Must match EXACTLY across I-140, I-485, and ETA-9089 — this is where the hyphen mismatch was caught.', value: 'Hewlett Packard Enterprise', source: 'Standardized by CaseBridge validation' },
      { ref: 'Part 3, Item 1', gov: 'Information About the Person for Whom You Are Filing — Family Name, Given Name', plain: 'Your name as the beneficiary (the person being sponsored).', value: 'Kulkarni, Prajwal', source: 'Auto-filled from shared record' },
      { ref: 'Part 4, Item 2.a', gov: 'Alien is in the United States and will apply for adjustment of status to that of lawful permanent resident', plain: 'You\'re already in the US on H-1B, so you\'ll adjust status here rather than going to a US consulate abroad.', value: 'Selected ✓', source: 'Auto-selected based on case type' },
      { ref: 'Part 5, Item 2', gov: 'Type of Business', plain: 'What your employer does. USCIS checks that the company is real and operating.', value: 'Enterprise IT Infrastructure', source: 'Auto-filled from employer record' },
      { ref: 'Part 5, Item 4', gov: 'Current Number of U.S. Employees', plain: 'How many people work at HPE in the US. Larger companies face less scrutiny on "ability to pay."', value: '~62,000', source: 'Auto-filled from employer record' },
      { ref: 'Part 5, Item 8', gov: 'Labor Certification DOL Case Number', plain: 'The PERM approval number from the Department of Labor. This proves the labor market test was done.', value: 'A-XXXXX-XXXXX', source: 'Auto-filled from PERM record' },
    ],
  },
  'I-765': {
    formTitle: 'Application for Employment Authorization',
    plainTitle: 'Work Permit (EAD) Application',
    pageCount: 7,
    fields: [
      { ref: 'Purpose', gov: 'Application Type: (c)(9) — Adjustment applicant', plain: 'You\'re applying for a work permit because you have a pending I-485. This gives you backup work authorization while waiting.', value: '(c)(9)', source: 'Auto-selected' },
      { ref: 'Item 1', gov: 'Full Legal Name', plain: 'Your name — same as on all other forms. CaseBridge keeps this consistent.', value: 'Kulkarni, Prajwal', source: 'Auto-filled from shared record' },
      { ref: 'Item 16', gov: 'Have you ever been arrested, cited, charged, or detained by any law enforcement officer?', plain: 'Any interactions with police, even traffic tickets in some cases. Answer honestly — inconsistencies cause delays.', value: 'No', source: 'Auto-filled from intake' },
    ],
  },
  'I-131': {
    formTitle: 'Application for Travel Document (Advance Parole)',
    plainTitle: 'Travel Permission While Waiting',
    pageCount: 6,
    fields: [
      { ref: 'Purpose', gov: 'I am applying for Advance Parole to allow me to return to the United States after temporary foreign travel', plain: 'This lets you travel internationally while your green card is pending. Without it, leaving the US could abandon your application.', value: 'Advance Parole', source: 'Auto-selected' },
      { ref: 'Item 1', gov: 'Full Legal Name', plain: 'Your name — synced from the same shared record as all other forms.', value: 'Kulkarni, Prajwal', source: 'Auto-filled from shared record' },
      { ref: 'Item 3', gov: 'Date and place of last arrival in the United States', plain: 'When and where you last entered the US. Must match your I-94 record.', value: 'San Francisco, CA · 01/2025', source: 'Auto-filled from travel history' },
    ],
  },
  'ETA-9089': {
    formTitle: 'Application for Permanent Employment Certification',
    plainTitle: 'Labor Market Test (PERM)',
    pageCount: 10,
    fields: [
      { ref: 'Section H, Item 4', gov: 'Prevailing Wage — SOC/O*NET Code', plain: 'The government job code that determines your minimum salary. The SOC code must match the actual job duties — this is where the wage survey mismatch was flagged.', value: '15-1299.08', source: 'Pre-validated by CaseBridge' },
      { ref: 'Section H, Item 6', gov: 'Prevailing Wage (per year)', plain: 'The minimum salary the DOL says this job must pay in your area. Your actual salary ($155K) must be at or above this.', value: '$142,000', source: 'Verified against OFLC data' },
      { ref: 'Section F', gov: 'Employer Name — full legal name of the employer', plain: 'Must be the exact legal entity name. "Hewlett-Packard Enterprise" vs "Hewlett Packard Enterprise" — the hyphen matters. CaseBridge caught this.', value: 'Hewlett Packard Enterprise', source: 'Standardized by validation' },
    ],
  },
  'G-28': {
    formTitle: 'Notice of Entry of Appearance as Attorney or Accredited Representative',
    plainTitle: 'Your Attorney Authorization',
    pageCount: 3,
    fields: [
      { ref: 'Part 2', gov: 'I hereby enter my appearance as attorney for and on behalf of the following named person(s)', plain: 'This form officially authorizes Maya Chen to represent you. Without it, USCIS won\'t communicate with your attorney.', value: 'Maya Chen · Immigration Attorney', source: 'Auto-filled from case team' },
    ],
  },
};

// ============================================================================
// Triage Before/After Comparison
// ============================================================================

export const triageComparison = {
  without: [
    { time: 'Day 1', event: 'Forms filed with inconsistencies', status: 'error' },
    { time: 'Month 3', event: 'USCIS begins review', status: 'neutral' },
    { time: 'Month 6', event: 'RFE issued — employer name + SOC mismatch', status: 'error' },
    { time: 'Month 8', event: 'RFE response prepared and filed', status: 'warning' },
    { time: 'Month 10', event: 'Re-adjudication queue', status: 'warning' },
    { time: 'Month 14', event: 'Decision (delayed ~6 months by RFE)', status: 'error' },
  ],
  with: [
    { time: 'Day 1', event: 'Pre-flight validation catches 3 issues', status: 'success' },
    { time: 'Day 3', event: 'All issues resolved, package clean', status: 'success' },
    { time: 'Day 5', event: 'Filed — zero known inconsistencies', status: 'success' },
    { time: 'Month 3', event: 'USCIS review — no RFE triggered', status: 'success' },
    { time: 'Month 8', event: 'Decision (on schedule)', status: 'success' },
  ],
  riskItems: [
    { label: 'Employer name mismatch', without: 'RFE at month 6', with: 'Fixed in 1 click' },
    { label: 'SOC/wage discrepancy', without: 'Potential DOL audit', with: 'Flagged for attorney review' },
    { label: 'Travel history gap', without: 'Completeness RFE', with: 'Applicant notified same day' },
    { label: 'H-1B extension deadline', without: 'Status lapse risk', with: 'Auto-triggered at 90 days' },
  ],
};

export const requiresReform = [
  { title: 'Visa caps & per-country limits', detail: 'Statutory constraint requiring congressional action' },
  { title: 'Retrogression / priority date waits', detail: 'Supply-demand imbalance in visa categories' },
  { title: 'USCIS adjudication backlogs', detail: 'Agency capacity requiring appropriations and staffing' },
  { title: 'Political & regulatory volatility', detail: 'Policy shifts affecting program rules and processing' },
  { title: 'Domestic pipeline & OPT alignment', detail: 'Education and workforce pipeline coordination' },
];
