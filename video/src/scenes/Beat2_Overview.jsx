import React from 'react';
import {
  useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill,
} from 'remotion';
import { C, CAPTIONS, cardStyle } from '../lib/constants';
import { FONT_SANS, FONT_DISPLAY } from '../lib/fonts';
import { MinimalFrame } from '../components/MinimalFrame';
import { Caption } from '../components/Caption';

/** Simple SVG icon components replacing emoji */
const IconIntake = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={C.blue500} strokeWidth="2" strokeLinecap="round">
    <rect x="3" y="3" width="18" height="18" rx="3" />
    <line x1="7" y1="8" x2="17" y2="8" /><line x1="7" y1="12" x2="14" y2="12" /><line x1="7" y1="16" x2="11" y2="16" />
  </svg>
);
const IconValidation = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={C.green500} strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="10" /><path d="M8 12l3 3 5-5" />
  </svg>
);
const IconDashboard = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="2" strokeLinecap="round">
    <rect x="3" y="3" width="7" height="9" rx="2" /><rect x="14" y="3" width="7" height="5" rx="2" />
    <rect x="3" y="16" width="7" height="5" rx="2" /><rect x="14" y="12" width="7" height="9" rx="2" />
  </svg>
);
const IconRoles = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={C.navy600} strokeWidth="2" strokeLinecap="round">
    <circle cx="8" cy="8" r="4" /><circle cx="16" cy="8" r="4" opacity="0.5" /><circle cx="12" cy="16" r="4" opacity="0.3" />
  </svg>
);

const CAPABILITY_CARDS = [
  { Icon: IconIntake, title: 'Smart Intake', desc: 'Enter shared data once. Auto-populate across 6+ forms.', metric: '~90% less re-keying', color: C.blue500 },
  { Icon: IconValidation, title: 'Validation Engine', desc: 'Pre-submission checks catch contradictions before filing.', metric: 'RFE rate: 25% → <5%', color: C.green500 },
  { Icon: IconDashboard, title: 'Unified Dashboard', desc: 'One view across DOL, USCIS, and DOS. Replace 4 portals.', metric: '−60% status calls', color: C.accent },
  { Icon: IconRoles, title: 'Role-Based Views', desc: 'Same case, different priorities for each stakeholder.', metric: '−70% applicant status calls', color: C.navy600 },
];

/**
 * Beat 2 — CaseBridge Overview (10s)
 * MinimalFrame. Hero + capability cards + Yuto case header bridge.
 */
export const Beat2_Overview = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const heroEnter = spring({ frame, fps, config: { damping: 200 }, delay: 5 });

  return (
    <AbsoluteFill>
      <MinimalFrame activeScreen="Overview">
        {/* Hero Section */}
        <div
          style={{
            background: `linear-gradient(135deg, ${C.navy900} 0%, ${C.navy700} 100%)`,
            padding: '48px 56px',
            borderRadius: 14,
            margin: '20px 28px 0',
            position: 'relative',
            overflow: 'hidden',
            opacity: interpolate(heroEnter, [0, 1], [0, 1]),
            transform: `translateY(${interpolate(heroEnter, [0, 1], [16, 0])}px)`,
          }}
        >
          {/* Accent line */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${C.accent}, ${C.accentLight}, transparent)` }} />

          <div style={{ fontSize: 56, fontWeight: 700, fontFamily: FONT_DISPLAY, color: C.white, lineHeight: 1.15, letterSpacing: '-0.02em', maxWidth: 900 }}>
            One shared case record for the
            <br />
            <span style={{ color: C.accent }}>H-1B to green card journey</span>
          </div>

          <div style={{ fontSize: 20, color: 'rgba(255,255,255,0.6)', marginTop: 14, maxWidth: 700, lineHeight: 1.5 }}>
            Reduce rework, simplify handoffs, and make status visible across
            applicant, employer, attorney, and agencies.
          </div>
        </div>

        {/* Capability Cards */}
        <div style={{ display: 'flex', gap: 18, padding: '16px 28px 0' }}>
          {CAPABILITY_CARDS.map((card, i) => {
            const cardEnter = spring({ frame, fps, config: { damping: 20, stiffness: 200 }, delay: Math.round(1.0 * fps) + i * 10 });
            return (
              <div
                key={i}
                style={{
                  ...cardStyle,
                  flex: 1,
                  padding: '22px 20px',
                  opacity: interpolate(cardEnter, [0, 1], [0, 1]),
                  transform: `translateY(${interpolate(cardEnter, [0, 1], [16, 0])}px)`,
                }}
              >
                <card.Icon />
                <div style={{ fontSize: 22, fontWeight: 700, color: C.slate800, marginTop: 10, marginBottom: 6 }}>{card.title}</div>
                <div style={{ fontSize: 16, color: C.slate500, lineHeight: 1.4, marginBottom: 12 }}>{card.desc}</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: card.color, background: `${card.color}12`, padding: '5px 12px', borderRadius: 6, display: 'inline-block' }}>
                  {card.metric}
                </div>
              </div>
            );
          })}
        </div>

        {/* Yuto Sato Case Header Bridge — appears at end of beat */}
        {(() => {
          const caseEnter = spring({ frame, fps, config: { damping: 20, stiffness: 200 }, delay: Math.round(6.5 * fps) });
          return (
            <div
              style={{
                margin: '16px 28px 0',
                background: C.navy900,
                borderRadius: 12,
                padding: '18px 28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderTop: `3px solid ${C.accent}`,
                opacity: interpolate(caseEnter, [0, 1], [0, 1]),
                transform: `translateY(${interpolate(caseEnter, [0, 1], [16, 0])}px)`,
              }}
            >
              {[
                { label: 'Applicant', value: 'Yuto Sato' },
                { label: 'Employer', value: 'Helix Systems, Inc.' },
                { label: 'Stage', value: 'I-485 Preparation' },
                { label: 'H-1B Expires', value: '102 days remaining' },
              ].map((item, i) => (
                <div key={i} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{item.label}</div>
                  <div style={{ fontSize: 20, color: i === 3 ? C.amber500 : C.white, fontWeight: 600, marginTop: 4 }}>{item.value}</div>
                </div>
              ))}
            </div>
          );
        })()}
      </MinimalFrame>

      <Caption text={CAPTIONS.beat2.main} subtext={CAPTIONS.beat2.sub} delay={Math.round(1.5 * fps)} />
    </AbsoluteFill>
  );
};
