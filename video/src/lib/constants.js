// ============================================================
// CaseBridge Demo Video — Micro-Scene Architecture (V2)
// 10 micro-scenes, capability-first grammar
// Target runtime: ~2:37 (under 3:00)
// ============================================================

export const FPS = 30;

// --- V2 Micro-Scene Durations (in seconds) ---
export const MS_SECONDS = {
  problemIntro: 14,     // 1A: Prajwal + fragment chaos (trimmed from 16)
  problemScale: 14,     // 1B: 3 agencies / 6 forms / 165 pages
  problemPain: 10,      // 1C: Contradiction pair — why it matters
  platformReveal: 14,   // 2A: Convergence → one shared record (trimmed from 16)
  capIntake: 18,        // 3A: Enter once, sync 6 forms (trimmed from 20)
  capValidation: 26,    // 3B: HERO — scan, issues, fix, score
  capWizard: 14,        // 3B2: Plain-language wizard + checklist
  capRoles: 16,         // 3C: 3 stakeholder views
  capDeadline: 12,      // 3D: 102 days → managed
  impactResults: 16,    // 4A: 4 metrics with capability callbacks
  scopeClose: 16,       // 4B: Scope limits + closing
};

export const MS_FRAMES = Object.fromEntries(
  Object.entries(MS_SECONDS).map(([k, v]) => [k, v * FPS])
);

// --- V2 Transitions (frames) ---
export const MS_TR = {
  '1A_1B': 20,   // fade
  '1B_1C': 15,   // fade
  '1C_2A': 25,   // fade (big emotional shift)
  '2A_3A': 18,   // fade
  '3A_3B': 15,   // fade
  '3B_W':  15,   // fade (validation → wizard)
  'W_3C':  15,   // fade (wizard → roles)
  '3C_3D': 15,   // fade
  '3D_4A': 18,   // fade
  '4A_4B': 20,   // fade
};

const MS_TOTAL_GROSS = Object.values(MS_FRAMES).reduce((a, b) => a + b, 0);
const MS_TOTAL_OVERLAP = Object.values(MS_TR).reduce((a, b) => a + b, 0);
export const MS_TOTAL_FRAMES = MS_TOTAL_GROSS - MS_TOTAL_OVERLAP;
// 5100 - 176 = 4924 frames = 164.1s = 2:44

// --- Legacy V1 Scene Durations (kept for old scene imports) ---
export const SCENE_SECONDS = {
  currentStateChaos: 22, platformReveal: 12, caseWorkspace: 18,
  intakeSync: 20, validationMoment: 25, roleSwitch: 25,
  deadlineProtection: 15, scopeClarification: 12, finalImpact: 14,
};
export const SCENE_FRAMES = Object.fromEntries(
  Object.entries(SCENE_SECONDS).map(([k, v]) => [k, v * FPS])
);
export const TR_1_2 = 25; export const TR_2_3 = 20; export const TR_3_4 = 18;
export const TR_4_5 = 15; export const TR_5_6 = 20; export const TR_6_7 = 18;
export const TR_7_8 = 18; export const TR_8_9 = 25;
const V1_OVERLAP = TR_1_2 + TR_2_3 + TR_3_4 + TR_4_5 + TR_5_6 + TR_6_7 + TR_7_8 + TR_8_9;
export const TOTAL_FRAMES = Object.values(SCENE_FRAMES).reduce((a, b) => a + b, 0) - V1_OVERLAP;
export const BEAT_FRAMES = SCENE_FRAMES;
export const BEAT_SECONDS = SCENE_SECONDS;

// --- Prajwal's Case Data ---
export const CASE = {
  applicant: {
    name: 'Prajwal Kulkarni',
    country: 'India',
    degree: 'MBA, UC Davis GSM 2024',
    title: 'Senior Product Manager',
    soc: '15-1299.08',
    salary: '$155,000',
    h1bExpiry: 'June 15, 2026',
    h1bDaysLeft: 102,
    category: 'EB-2',
    priorityDate: 'March 15, 2022',
  },
  employer: {
    name: 'Hewlett Packard Enterprise Company',
    shortName: 'HPE',
    wrongName: 'Hewlett-Packard Enterprise',
    fein: '47-3298674',
    location: 'Spring, TX / San Jose, CA',
    employees: '~62,000 US',
  },
  attorney: {
    name: 'Maya Chen',
    firm: 'Immigration Attorney',
    pending: 3,
  },
  stage: 'I-485 Preparation',
  caseId: 'CB-2024-0847',
};

// --- Color Palette ---
export const C = {
  navy900: '#162768', navy800: '#1d3080', navy700: '#2a3f96', navy600: '#3954ab',
  accent: '#f8f2b6', accentLight: '#faf5c8', accentMuted: '#e8e2a0',
  accentFaint: 'rgba(248, 242, 182, 0.15)',
  surface: '#fbfdeb', surfaceWarm: '#f3f5de',
  white: '#ffffff',
  slate50: '#f8fafc', slate100: '#f1f5f9', slate200: '#e2e8f0', slate300: '#cbd5e1',
  slate400: '#94a3b8', slate500: '#64748b', slate600: '#475569', slate700: '#334155',
  slate800: '#1e293b', slate900: '#0f172a',
  green50: '#f0fdf4', green100: '#dcfce7', green500: '#22c55e', green600: '#16a34a', green700: '#15803d',
  amber50: '#fffbeb', amber100: '#fef3c7', amber500: '#f59e0b', amber600: '#d97706',
  red50: '#fef2f2', red100: '#fee2e2', red500: '#ef4444', red600: '#dc2626',
  blue50: '#eff6ff', blue100: '#dbeafe', blue500: '#3b82f6', blue600: '#2563eb',
};

// --- V2 On-Screen Labels (short, complementary to VO) ---
export const LABELS = {
  ms1a: { name: 'Prajwal Kulkarni', sub: 'Sr. Product Manager \u2022 H-1B \u2022 EB-2 India' },
  ms1b: { lines: ['3 agencies.', '6 forms.', '165+ pages.', '0 dashboards.'] },
  ms2a: { title: 'CaseBridge', sub: 'One shared case record' },
  ms3a: { label: 'Enter once.' },
  ms3b: { label: 'Caught before filing.', metric: '~25% \u2192 <5%' },
  msW: { label: 'Plain language. Zero jargon.', metric: '~8 \u2192 ~3 hrs' },
  ms3c: { synthesis: 'Same case. Different priorities.' },
  ms3d: { label: '90 days out', transition: 'At Risk \u2192 Managed' },
  ms4a: { question: 'What changes?' },
  ms4b: { scope: 'Process help, not magic.' },
};

// --- Legacy ---
export const CAPTIONS = {
  scene1: { intro: 'Prajwal Kulkarni', introSub: 'Senior Product Manager. H-1B holder. EB-2 India candidate.', line1: '3 agencies.', line2: '6 forms.', line3: '0 dashboards.', sub: 'One inconsistency can reset months of progress.' },
  scene2: { main: 'One shared case record', sub: 'Prajwal\u2019s case \u2014 one record, three stakeholders, all aligned.' },
  scene3: { main: 'A single workspace for the entire case', sub: 'Timeline, agency status, and next steps \u2014 all in one view.' },
  scene4: { main: 'Enter once. Sync across 6 forms.', sub: 'One source of truth \u2014 no re-keying, no contradictions.' },
  scene5: { main: 'Catch errors before filing', sub: 'Today: ~25% of filings trigger RFEs. Target: <5%.' },
  scene6: { captions: { applicant: { main: 'Plain-language guidance.', sub: 'No legal jargon \u2014 just what to do next.' }, employer: { main: 'Deadline visibility, not surprises.', sub: '102 days. Auto-trigger at 90. Cost: ~$2,500.' }, attorney: { main: 'Filing blockers, not noise.', sub: 'Severity-ranked issues. No manual reconciliation.' } } },
  scene7: { main: 'Deadlines protected automatically', sub: 'Auto-triggered 90 days before expiry. Employer and attorney both see the task.' },
  scene8: { main: 'Process help, not magic.', sub: '' },
  scene9: { closing: 'A better process starts with better coordination.' },
};

export const cardStyle = { background: C.white, borderRadius: 12, border: `1px solid ${C.slate200}`, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' };

// Website-inspired card styles for Remotion (dark bg context)
export const CARD = {
  focal: { background: C.surface, borderRadius: 16, border: `1px solid rgba(248,242,182,0.25)`, boxShadow: '0 4px 24px rgba(0,0,0,0.15)' },
  supporting: { background: 'rgba(251,253,235,0.06)', borderRadius: 12, border: `1px solid rgba(248,242,182,0.12)` },
  glass: { background: 'rgba(255,255,255,0.05)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)' },
  proof: { background: 'rgba(248,242,182,0.08)', borderRadius: 10, border: `1px solid rgba(248,242,182,0.2)`, padding: '8px 20px' },
};
export const badgeStyle = (bg, color, large = false) => ({ display: 'inline-flex', alignItems: 'center', padding: large ? '4px 14px' : '2px 10px', borderRadius: 9999, fontSize: large ? 16 : 14, fontWeight: 600, background: bg, color });

// --- Form data for fragments ---
export const FORM_FIELDS = {
  'ETA-9089': { title: 'Application for Permanent Employment Certification', section: 'Section H', field: 'Employer Name' },
  'I-140': { title: 'Immigrant Petition for Alien Workers', section: 'Part 1, Item 2', field: 'Company or Organization Name' },
  'I-485': { title: 'Application to Register Permanent Residence', section: 'Part 3, Item 1', field: 'Employer Name' },
  'I-765': { title: 'Application for Employment Authorization', section: 'Part 2', field: 'Employer Information' },
  'I-131': { title: 'Application for Travel Document', section: 'Part 1', field: 'Applicant Information' },
  'G-28': { title: 'Notice of Entry of Appearance as Attorney', section: 'Part 2', field: 'Attorney Information' },
};
