// ============================================================================
// CaseBridge — Seeded Mock Data
// One flagship case: Yuto Sato → Helix Systems → Chen & Patel Immigration
// All data deterministic and presentation-ready
// ============================================================================

export const applicant = {
  fullName: 'Yuto Sato',
  preferredName: 'Yuto',
  countryOfBirth: 'Japan',
  nationality: 'Japanese',
  currentCity: 'San Jose, CA',
  currentStatus: 'H-1B',
  statusExpirationDate: '2026-06-15',
  educationLevel: 'Master of Science',
  degreeField: 'Computer Science',
  university: 'Stanford University',
  graduationYear: '2019',
  startDateInUS: '2019-08-15',
  dependents: [{ name: 'Aiko Sato', relationship: 'Spouse', status: 'H-4' }],
  priorityDate: '2024-03-12',
  aNumber: 'A-XXX-XXX-123',
  dateOfBirth: 'March 14, 1992',
  passportNumber: 'TK XXXXXXX',
  passportExpiry: '2029-11-20',
};

export const employer = {
  legalName: 'Helix Systems, Inc.',
  legalNameIncorrect: 'Helix Systems Inc.',
  displayName: 'Helix Systems',
  fein: 'XX-XXXXXXX',
  industry: 'Enterprise Software',
  headquarters: 'San Jose, CA',
  employeeCount: '~2,400',
  hrOwner: 'Rachel Torres',
  hrOwnerTitle: 'Senior HR Manager',
  sponsorshipPolicy: 'Approved',
  extensionPolicy: 'Auto-initiate at 90 days before expiry',
  costCenter: 'Engineering',
  internalApprovalState: 'Approved',
};

export const attorney = {
  lawFirm: 'Chen & Patel Immigration',
  attorneyName: 'Maya Chen',
  contactEmail: 'maya.chen@chenpatel.law',
  barNumber: 'CA-XXXXXX',
  reviewStatus: 'Pending Review',
  itemsPendingReview: 3,
  caseStrategyNote: 'EB-2 classification, concurrent filing eligible. Priority date is current for Japan-born applicants.',
};

export const job = {
  title: 'Senior Software Engineer',
  socCode: '15-1256.00',
  socTitle: 'Software Developers',
  department: 'Platform Engineering',
  jobLocation: 'San Jose, CA',
  salary: '$165,000',
  salaryNumeric: 165000,
  wageLevel: 'Level 3',
  prevailingWage: '$155,000',
  wageSource: 'OFLC Online Wage Library',
  wageSurveyPeriod: 'Q4 2023',
  wageSurveyPeriodIncorrect: 'Q2 2023',
  jobDutiesSummary: 'Design, develop, and maintain enterprise software platforms serving 500K+ users.',
  specialtyOccupationConfidence: 'High',
  mobilityRisk: 'Low',
};

export const caseRecord = {
  caseId: 'CB-2024-001847',
  caseName: 'Sato, Yuto — EB-2 Green Card',
  currentStage: 'i485-prep',
  pathwayType: 'EB-2',
  priorityDate: 'March 12, 2024',
  nextFiling: 'I-485 Package',
  caseHealth: 'Needs Review',
  createdAt: 'January 15, 2024',
  updatedAt: 'March 6, 2026',
};

export const stages = [
  { id: 'eligibility', label: 'Eligibility', status: 'complete', agency: 'Internal', date: 'Jan 2024' },
  { id: 'pwd', label: 'PWD', status: 'complete', agency: 'DOL', date: 'Mar 2024' },
  { id: 'perm', label: 'PERM', status: 'complete', agency: 'DOL', date: 'Aug 2024' },
  { id: 'i140', label: 'I-140', status: 'complete', agency: 'USCIS', date: 'Feb 2025' },
  { id: 'visa-bulletin', label: 'Visa Bulletin', status: 'complete', agency: 'DOS', date: 'Current' },
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
    description: 'SOC 15-1256 wage data references Q4 2023 OFLC survey, but the prevailing wage determination used Q2 2023 data. Discrepancy may trigger DOL audit or USCIS RFE.',
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
    description: 'Legal name appears as "Helix Systems Inc." in intake but "Helix Systems, Inc." in I-140 and ETA-9089. Inconsistency may trigger an RFE.',
    plainDescription: 'The company name is written two different ways. Fixing it now reduces the chance of delays later.',
    affectedForms: ['I-140', 'I-485', 'ETA-9089'],
    affectedFields: ['employer.legalName'],
    recommendedFix: 'Standardize to "Helix Systems, Inc." across all records',
    currentValue: 'Helix Systems Inc.',
    correctedValue: 'Helix Systems, Inc.',
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
    body: 'SOC 15-1256 wage data inconsistency. Requires attorney resolution before filing.',
    severity: 'error',
    icon: 'alert-triangle',
  },
  {
    id: 'priority-date',
    type: 'info',
    title: 'Priority Date Current',
    body: 'EB-2 chargeability for Japan: Current. Eligible to proceed with I-485 filing.',
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
    lastUpdated: 'Aug 20, 2024',
    explanation: 'Labor certification approved. No further DOL action required.',
    plainExplanation: 'The Department of Labor confirmed the job offer meets wage requirements.',
  },
  {
    agency: 'USCIS',
    fullName: 'U.S. Citizenship & Immigration Services',
    status: 'I-140 Approved · I-485 Pending',
    statusColor: 'blue',
    lastUpdated: 'Feb 28, 2026',
    explanation: 'I-140 approved. I-485 concurrent filing package in preparation.',
    plainExplanation: "Your employer's petition was approved. The adjustment application is being prepared.",
  },
  {
    agency: 'DOS',
    fullName: 'Department of State',
    status: 'Priority Date Current',
    statusColor: 'green',
    lastUpdated: 'Mar 1, 2026',
    explanation: 'EB-2 All Chargeability: Current. Japan not subject to per-country backlog.',
    plainExplanation: "Your priority date is current — you're eligible to proceed with filing.",
  },
];

export const intakeSections = [
  {
    id: 'identity',
    label: 'Identity',
    fields: [
      { key: 'fullName', label: 'Full Legal Name', value: 'Yuto Sato', syncTargets: ['I-485', 'I-765', 'I-131', 'G-28'] },
      { key: 'dateOfBirth', label: 'Date of Birth', value: 'March 14, 1992', syncTargets: ['I-485', 'I-765'] },
      { key: 'countryOfBirth', label: 'Country of Birth', value: 'Japan', syncTargets: ['I-485', 'I-140'] },
      { key: 'aNumber', label: 'A-Number', value: 'A-XXX-XXX-123', syncTargets: ['I-485', 'I-765', 'I-131'] },
    ],
  },
  {
    id: 'employer',
    label: 'Employer',
    fields: [
      { key: 'employerLegalName', label: 'Employer Legal Name', value: 'Helix Systems Inc.', syncTargets: ['I-140', 'I-485', 'ETA-9089'], hasMismatch: true },
      { key: 'fein', label: 'FEIN', value: 'XX-XXXXXXX', syncTargets: ['I-140', 'ETA-9089'] },
      { key: 'headquarters', label: 'Headquarters', value: 'San Jose, CA', syncTargets: ['I-140', 'ETA-9089'] },
    ],
  },
  {
    id: 'role',
    label: 'Role / Job',
    fields: [
      { key: 'jobTitle', label: 'Job Title', value: 'Senior Software Engineer', syncTargets: ['I-140', 'I-485', 'ETA-9089'] },
      { key: 'socCode', label: 'SOC Code', value: '15-1256.00', syncTargets: ['ETA-9089', 'I-140'] },
      { key: 'salary', label: 'Annual Salary', value: '$165,000', syncTargets: ['I-140', 'ETA-9089'] },
      { key: 'wageLevel', label: 'Wage Level', value: 'Level 3', syncTargets: ['ETA-9089'] },
    ],
  },
  {
    id: 'immigration',
    label: 'Immigration',
    fields: [
      { key: 'currentStatus', label: 'Current Status', value: 'H-1B', syncTargets: ['I-485'] },
      { key: 'statusExpiry', label: 'Status Expiration', value: 'June 15, 2026', syncTargets: ['I-485', 'I-765'] },
      { key: 'priorityDate', label: 'Priority Date', value: 'March 12, 2024', syncTargets: ['I-485'] },
      { key: 'classification', label: 'Classification', value: 'EB-2', syncTargets: ['I-140', 'I-485'] },
    ],
  },
  {
    id: 'travel',
    label: 'Address / Travel',
    fields: [
      { key: 'currentAddress', label: 'Current Address', value: '4521 Stevens Creek Blvd, San Jose, CA 95129', syncTargets: ['I-485', 'I-765', 'I-131'] },
      { key: 'travelHistory', label: 'Travel History (5 yr)', value: '14 trips recorded — 1 gap identified', syncTargets: ['I-485'], hasGap: true },
    ],
  },
];

export const roleContent = {
  applicant: {
    greeting: 'Your case is on track.',
    statusSummary: "Your I-485 adjustment of status package is being prepared. Your priority date is current, which means there's no visa bulletin wait for your category.",
    nextStep: "No action needed today. Your attorney is reviewing the filing package and will notify you when your confirmation is needed.",
    timeline: 'Your green card process started in January 2024. Five of eight major milestones are complete. The next step is filing the I-485 package.',
    alerts: [
      { title: 'Work Authorization', body: 'Your H-1B is valid through June 15, 2026. Your employer will handle the extension.', type: 'info' },
      { title: 'Priority Date Current', body: "Good news — your priority date is current. No backlog wait for your category.", type: 'success' },
      { title: 'Travel Advisory', body: 'Discuss any international travel plans with your attorney first. Advance Parole may be required.', type: 'warning' },
    ],
    actions: ['Review personal information', 'Confirm travel dates', 'Upload supporting documents'],
  },
  employer: {
    greeting: 'Case active — deadlines approaching.',
    statusSummary: "Yuto Sato's I-485 filing is in preparation. H-1B extension will need initiation within 90 days. All internal approvals are current.",
    nextStep: 'Extension filing auto-triggers at 90 days before expiry (March 17, 2026). Estimated extension cost: $2,500–4,000 including legal fees.',
    timeline: 'Sponsorship initiated January 2024. PERM certified, I-140 approved. Currently in I-485 preparation phase. Extension window approaching.',
    alerts: [
      { title: 'H-1B Extension: 102 Days', body: 'Extension window approaching. Auto-trigger at 90 days. Budget approval may be needed.', type: 'warning' },
      { title: 'Sponsorship Cost This Cycle', body: 'Estimated total: $12,000–18,000. Spent to date: $4,200.', type: 'info' },
      { title: 'Workforce Continuity', body: 'No gap expected if extension filed on time. EAD provides backup authorization.', type: 'success' },
    ],
    actions: ['Review extension timeline', 'Approve budget allocation', 'Confirm HR attestations'],
  },
  attorney: {
    greeting: 'Filing package: 3 items to resolve.',
    statusSummary: 'I-485 concurrent filing package at 82% readiness. 3 validation issues: 1 high (SOC/wage), 1 medium (employer name), 1 low (travel gap). Review required before submission.',
    nextStep: 'Resolve SOC wage survey discrepancy (Q4 vs Q2 2023). Standardize employer legal name. Request missing December 2023 travel dates from applicant.',
    timeline: 'Case progressing on schedule. All prerequisite filings approved. I-485 package blocked by 3 validation items. Estimated filing-ready: 5–7 business days after resolution.',
    alerts: [
      { title: 'SOC 15-1256 Classification Risk', body: 'Wage survey period mismatch between ETA-9089 and I-140. Risk of DOL audit or RFE.', type: 'error' },
      { title: 'Employer Name Standardization', body: '"Helix Systems Inc." vs "Helix Systems, Inc." — inconsistency across 3 forms.', type: 'warning' },
      { title: 'Evidence Bundle: 22 of 24', body: 'Missing: employment verification letter, December 2023 travel records.', type: 'info' },
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

export const requiresReform = [
  { title: 'Visa caps & per-country limits', detail: 'Statutory constraint requiring congressional action' },
  { title: 'Retrogression / priority date waits', detail: 'Supply-demand imbalance in visa categories' },
  { title: 'USCIS adjudication backlogs', detail: 'Agency capacity requiring appropriations and staffing' },
  { title: 'Political & regulatory volatility', detail: 'Policy shifts affecting program rules and processing' },
  { title: 'Domestic pipeline & OPT alignment', detail: 'Education and workforce pipeline coordination' },
];
