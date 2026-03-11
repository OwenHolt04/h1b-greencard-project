// ============================================================
// CaseBridge Demo V3 — Cream/Blue Website-Aligned Theme
// Matches the website's presentation mode color scheme
// ============================================================

import { C, CASE, FORM_FIELDS } from '../lib/constants';

// --- V3 Color Palette (cream backgrounds, navy text) ---
export const T = {
  // Backgrounds
  bg: '#fbfdeb',         // cream surface (website bg)
  bgWarm: '#f4f6de',     // warm cream
  bgGradient: 'linear-gradient(165deg, #fbfdeb 0%, #f4f6de 50%, #eef0d8 100%)',

  // Cards
  card: '#ffffff',
  cardBorder: '#e2e8f0',    // slate-200
  cardShadow: '0 1px 3px rgba(0,0,0,0.06)',
  cardFocal: '0 4px 24px rgba(22,39,104,0.08)',

  // Navy (primary text & emphasis)
  navy: '#162768',          // navy-900
  navyMid: '#1c3180',       // navy-800
  navyLight: '#2a3f96',     // navy-700

  // Text hierarchy
  text: '#162768',           // headings
  textBody: '#334155',       // slate-700
  textSecondary: '#475569',  // slate-600
  textMuted: '#94a3b8',      // slate-400
  textFaint: '#cbd5e1',      // slate-300

  // Accent (use sparingly on light bg)
  accent: '#f8f2b6',
  accentBadge: 'rgba(248,242,182,0.4)',

  // Status colors (same as V2)
  green: C.green500,
  greenBg: '#f0fdf4',
  greenBorder: '#dcfce7',
  amber: C.amber500,
  amberBg: '#fffbeb',
  amberBorder: '#fef3c7',
  red: C.red500,
  redBg: '#fef2f2',
  redBorder: '#fee2e2',
  blue: C.blue500,
  blueBg: '#eff6ff',
  blueBorder: '#dbeafe',
};

// --- V3 Scene Durations (seconds) ---
export const V3_SECONDS = {
  dashboard: 14,        // S1: One unified dashboard
  enterOnce: 16,        // S2: Enter once, sync across 6 forms
  plainLanguage: 16,    // S3: Plain-language guidance + checklist
  stakeholders: 18,     // S4: Employer deadlines + Attorney blockers
  deadline: 12,         // S5: 90-day H-1B alert
  close: 14,            // S6: Avoidable errors → better coordination
};

export const V3_FPS = 30;

export const V3_FRAMES = Object.fromEntries(
  Object.entries(V3_SECONDS).map(([k, v]) => [k, v * V3_FPS])
);

// --- V3 Transitions (frames) ---
export const V3_TR = {
  '1_2': 15,
  '2_3': 15,
  '3_4': 15,
  '4_5': 15,
  '5_6': 18,
};

const V3_TOTAL_GROSS = Object.values(V3_FRAMES).reduce((a, b) => a + b, 0);
const V3_TOTAL_OVERLAP = Object.values(V3_TR).reduce((a, b) => a + b, 0);
export const V3_TOTAL_FRAMES = V3_TOTAL_GROSS - V3_TOTAL_OVERLAP;
// 2700 - 78 = 2622 frames = 87.4s = 1:27

// Re-export case data
export { CASE, FORM_FIELDS };

// --- Card styles for cream bg ---
export const V3_CARD = {
  standard: {
    background: T.card,
    borderRadius: 14,
    border: `1px solid ${T.cardBorder}`,
    boxShadow: T.cardShadow,
  },
  focal: {
    background: T.card,
    borderRadius: 16,
    border: `1px solid ${T.cardBorder}`,
    boxShadow: T.cardFocal,
  },
  navy: {
    background: T.navy,
    borderRadius: 14,
    border: 'none',
    boxShadow: '0 4px 20px rgba(22,39,104,0.2)',
  },
};
