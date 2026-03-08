// ============================================================
// CaseBridge Demo Video — Timing, Design Tokens, Captions
// ============================================================

export const FPS = 30;

// --- Beat Durations (in seconds) ---
// Adjust these to change pacing. Everything derives from them.
export const BEAT_SECONDS = {
  currentState: 12,
  overview: 12,
  smartIntake: 12,
  validation: 18,
  fix: 12,
  roleSwitcher: 22,
  scopeClarity: 12,
  close: 8,
};

// Convert to frames
export const BEAT_FRAMES = Object.fromEntries(
  Object.entries(BEAT_SECONDS).map(([k, v]) => [k, v * FPS])
);

// Transition durations (frames)
export const TRANSITION_STANDARD = 18; // 0.6s between unrelated scenes
export const TRANSITION_QUICK = 6;     // 0.2s between related scenes (intake→validation→fix)

// Total composition duration (accounting for transition overlaps)
// 5 standard transitions + 2 quick transitions
const TOTAL_SCENE_FRAMES = Object.values(BEAT_FRAMES).reduce((a, b) => a + b, 0);
const TOTAL_TRANSITION_OVERLAP = (5 * TRANSITION_STANDARD) + (2 * TRANSITION_QUICK);
export const TOTAL_FRAMES = TOTAL_SCENE_FRAMES - TOTAL_TRANSITION_OVERLAP;

// --- Color Palette ---
export const C = {
  navy900: '#0a1628',
  navy800: '#0f1d35',
  navy700: '#162a4a',
  navy600: '#1e3a5f',
  accent: '#c6993e',
  accentLight: '#d4a843',
  accentMuted: '#b8963e',
  accentFaint: 'rgba(198, 153, 62, 0.12)',
  surface: '#faf9f7',
  surfaceWarm: '#f5f3ef',
  white: '#ffffff',
  slate50: '#f8fafc',
  slate100: '#f1f5f9',
  slate200: '#e2e8f0',
  slate300: '#cbd5e1',
  slate400: '#94a3b8',
  slate500: '#64748b',
  slate600: '#475569',
  slate700: '#334155',
  slate800: '#1e293b',
  slate900: '#0f172a',
  green50: '#f0fdf4',
  green100: '#dcfce7',
  green500: '#22c55e',
  green600: '#16a34a',
  green700: '#15803d',
  amber50: '#fffbeb',
  amber100: '#fef3c7',
  amber500: '#f59e0b',
  amber600: '#d97706',
  red50: '#fef2f2',
  red100: '#fee2e2',
  red500: '#ef4444',
  red600: '#dc2626',
  blue50: '#eff6ff',
  blue100: '#dbeafe',
  blue500: '#3b82f6',
  blue600: '#2563eb',
};

// --- Captions ---
// Edit these to change on-screen text without touching scene code.
export const CAPTIONS = {
  beat1: {
    line1: '3 agencies.',
    line2: '4 portals.',
    line3: '0 dashboards.',
    sub: 'No one sees the full picture.',
  },
  beat2: {
    main: 'One shared case record',
    sub: 'Connecting applicant, employer, and attorney around the same information.',
  },
  beat3: {
    main: 'Enter once. Sync across 6 forms.',
    sub: 'Shared intake data populates the entire filing package.',
  },
  beat4: {
    main: 'Catch errors before filing',
    sub: 'Pre-submission validation flags contradictions that would otherwise surface months later.',
  },
  beat5: {
    main: 'Fix once. Update everywhere.',
    sub: 'One correction updates the shared record and every downstream form.',
  },
  beat6: {
    main: 'Same case. Different roles.',
    labels: {
      applicant: 'Applicant — plain-language guidance',
      employer: 'Employer / HR — deadlines and continuity',
      attorney: 'Attorney — filing readiness and risk',
    },
  },
  beat7: {
    main: 'Process improvement. Not magic.',
    sub: 'Clarify status. Align stakeholders.',
  },
  beat8: {
    line1: 'Reduce rework.',
    line2: 'Clarify status.',
    line3: 'Align stakeholders.',
    closing: 'A better process starts with better coordination.',
  },
};

// --- Shared Style Helpers ---
export const cardStyle = {
  background: C.white,
  borderRadius: 12,
  border: `1px solid ${C.slate200}`,
  boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
};

export const badgeStyle = (bg, color) => ({
  display: 'inline-flex',
  alignItems: 'center',
  padding: '2px 10px',
  borderRadius: 9999,
  fontSize: 12,
  fontWeight: 600,
  background: bg,
  color: color,
});
