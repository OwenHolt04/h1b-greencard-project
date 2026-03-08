// ============================================================
// CaseBridge Demo Video — Timing, Design Tokens, Captions
// Presentation theme: navy #162768, cream #fbfdeb, accent #f8f2b6
// Fonts: Roca Two Bold (display), Space Mono (body)
// ============================================================

export const FPS = 30;

// --- Beat Durations (in seconds) ---
export const BEAT_SECONDS = {
  currentState: 10,
  overview: 10,
  smartIntake: 12,
  validation: 16,
  fix: 10,
  roleSwitcher: 24,
  scopeClarity: 14,
  close: 12,
};

// Convert to frames
export const BEAT_FRAMES = Object.fromEntries(
  Object.entries(BEAT_SECONDS).map(([k, v]) => [k, v * FPS])
);

// --- Per-transition durations (frames) ---
export const TR_1_2 = 24;
export const TR_2_3 = 20;
export const TR_3_4 = 10;
export const TR_4_5 = 10;
export const TR_5_6 = 20;
export const TR_6_7 = 24;
export const TR_7_8 = 30;

const TOTAL_SCENE_FRAMES = Object.values(BEAT_FRAMES).reduce((a, b) => a + b, 0);
const TOTAL_TRANSITION_OVERLAP = TR_1_2 + TR_2_3 + TR_3_4 + TR_4_5 + TR_5_6 + TR_6_7 + TR_7_8;
export const TOTAL_FRAMES = TOTAL_SCENE_FRAMES - TOTAL_TRANSITION_OVERLAP;

// --- Color Palette (presentation theme) ---
export const C = {
  // Navy family — primary #162768
  navy900: '#162768',
  navy800: '#1d3080',
  navy700: '#2a3f96',
  navy600: '#3954ab',

  // Accent — warm cream-yellow #f8f2b6
  accent: '#f8f2b6',
  accentLight: '#faf5c8',
  accentMuted: '#e8e2a0',
  accentFaint: 'rgba(248, 242, 182, 0.15)',

  // Surface — warm off-white #fbfdeb
  surface: '#fbfdeb',
  surfaceWarm: '#f3f5de',

  // Neutrals
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

  // Semantic status
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
export const CAPTIONS = {
  beat1: {
    line1: '3 agencies.',
    line2: '4 portals.',
    line3: '0 dashboards.',
    sub: 'One inconsistency can reset months of work.',
  },
  beat2: {
    main: 'One shared case record',
    sub: "Yuto Sato\u2019s case \u2014 one record, three stakeholders, all aligned.",
  },
  beat3: {
    main: 'Enter once. Sync across 6 forms.',
    sub: 'One source of truth \u2014 no re-keying, no contradictions.',
  },
  beat4: {
    main: 'Catch errors before filing',
    sub: 'Today: ~25% of filings trigger RFEs. Target: <5%.',
  },
  beat5: {
    main: 'Fix once. Three forms update automatically.',
    sub: 'Score 72 \u2192 80. Two issues remain for attorney review.',
  },
  beat6: {
    captions: {
      applicant: {
        main: 'Plain-language guidance.',
        sub: 'No legal jargon \u2014 just what to do next.',
      },
      employer: {
        main: 'Deadline visibility, not surprises.',
        sub: '102 days. Auto-trigger at 90. Cost: ~$2,500.',
      },
      attorney: {
        main: 'Filing blockers, not noise.',
        sub: 'Severity-ranked issues. No manual reconciliation.',
      },
    },
  },
  beat7: {
    main: 'What the portal changes. What still requires legislation.',
    sub: '',
  },
  beat8: {
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

export const badgeStyle = (bg, color, large = false) => ({
  display: 'inline-flex',
  alignItems: 'center',
  padding: large ? '4px 14px' : '2px 10px',
  borderRadius: 9999,
  fontSize: large ? 16 : 14,
  fontWeight: 600,
  background: bg,
  color: color,
});
