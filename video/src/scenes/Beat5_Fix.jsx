import React from 'react';
import {
  useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill,
} from 'remotion';
import { C, CAPTIONS, cardStyle, badgeStyle } from '../lib/constants';
import { FONT_SANS } from '../lib/fonts';
import { AppFrame } from '../components/AppFrame';
import { Caption } from '../components/Caption';
import { ReadinessScore } from '../components/ReadinessScore';

const FORMS_WITH_SYNC = [
  { code: 'ETA-9089', syncs: true },
  { code: 'I-140', syncs: true },
  { code: 'I-485', syncs: true },
  { code: 'I-765', syncs: false },
  { code: 'I-131', syncs: false },
  { code: 'G-28', syncs: false },
];

/**
 * Beat 5 — Fix + Score Improvement (12s)
 * Employer name field is fixed → form cards sync → readiness score 72 → 80.
 * This is the payoff of the validation beat.
 */
export const Beat5_Fix = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase timing
  const PHASE = {
    show: 0,
    fieldHighlight: 1.0 * fps,
    fixApplied: 2.5 * fps,
    formSync: 3.5 * fps,
    scoreRise: 4.5 * fps,
    issueResolved: 5.5 * fps,
    caption: 6.0 * fps,
  };

  const screenEnter = spring({ frame, fps, config: { damping: 200 }, delay: 5 });

  // Field highlight → fix
  const fieldHighlight = frame >= PHASE.fieldHighlight && frame < PHASE.fixApplied;
  const fieldFixed = frame >= PHASE.fixApplied;

  // Form sync glow
  const syncActive = frame >= PHASE.formSync;
  const syncPhase = syncActive ? (frame - PHASE.formSync) / 40 : 0;
  const syncGlow = syncActive ? Math.max(0, 1 - (frame - PHASE.formSync) / (2 * fps)) : 0;

  // Issue resolved
  const issueResolved = frame >= PHASE.issueResolved;

  return (
    <AbsoluteFill>
      <AppFrame activeScreen="Intake">
        <div
          style={{
            display: 'flex',
            gap: 20,
            padding: '20px 28px',
            height: '100%',
            opacity: interpolate(screenEnter, [0, 1], [0, 1]),
          }}
        >
          {/* LEFT — Shared Data with fix highlight */}
          <div style={{ width: 360, flexShrink: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.slate800, marginBottom: 10 }}>
              Shared Case Data
            </div>
            <div style={{ ...cardStyle, padding: '12px 14px' }}>
              {[
                { label: 'Full Name', value: 'Yuto Sato', type: null },
                {
                  label: 'Employer Legal Name',
                  value: fieldFixed ? 'Helix Systems, Inc.' : 'Helix Systems Inc.',
                  type: fieldFixed ? 'fixed' : fieldHighlight ? 'highlight' : null,
                },
                { label: 'SOC Code', value: '15-1256.00', type: 'warning' },
                { label: 'Salary', value: '$165,000', type: 'warning' },
                { label: 'H-1B Expires', value: 'Jul 15, 2025', type: null },
                { label: 'Travel Dec 2023', value: 'Incomplete', type: 'info' },
              ].map((f, i) => {
                let bg = 'transparent';
                let borderColor = C.slate100;
                let valueColor = C.slate700;
                let icon = null;

                if (f.type === 'highlight') {
                  bg = C.amber50;
                  borderColor = C.amber500;
                  valueColor = C.amber600;
                } else if (f.type === 'fixed') {
                  bg = C.green50;
                  borderColor = C.green500;
                  valueColor = C.green700;
                  icon = '✓';
                } else if (f.type === 'warning') {
                  bg = C.amber50;
                  valueColor = C.amber600;
                } else if (f.type === 'info') {
                  bg = C.blue50;
                  valueColor = C.blue600;
                }

                return (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '7px 8px',
                      borderBottom: `1px solid ${borderColor}`,
                      background: bg,
                      borderRadius: 4,
                      marginBottom: 2,
                    }}
                  >
                    <span style={{ fontSize: 12, color: C.slate500 }}>{f.label}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: valueColor }}>
                        {f.value}
                      </span>
                      {icon && (
                        <span style={{ fontSize: 14, color: C.green600, fontWeight: 700 }}>{icon}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Fix action */}
            {!fieldFixed && fieldHighlight && (
              <div
                style={{
                  marginTop: 12,
                  ...cardStyle,
                  padding: '10px 14px',
                  background: C.accent,
                  color: C.navy900,
                  fontSize: 13,
                  fontWeight: 600,
                  textAlign: 'center',
                  borderColor: C.accent,
                  boxShadow: `0 0 0 3px ${C.accent}30`,
                }}
              >
                Fix: Standardize to &quot;Helix Systems, Inc.&quot;
              </div>
            )}
            {fieldFixed && (
              <div
                style={{
                  marginTop: 12,
                  ...cardStyle,
                  padding: '10px 14px',
                  background: C.green50,
                  color: C.green700,
                  fontSize: 13,
                  fontWeight: 600,
                  textAlign: 'center',
                  borderColor: C.green500,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                }}
              >
                <span style={{ fontSize: 16 }}>✓</span> Employer name standardized
              </div>
            )}
          </div>

          {/* CENTER — Form Cards with sync effect */}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.slate800, marginBottom: 10 }}>
              Filing Package — Syncing Updates
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {FORMS_WITH_SYNC.map((form, i) => {
                const isSyncing = syncActive && form.syncs;
                const glowIntensity = isSyncing ? syncGlow : 0;

                return (
                  <div
                    key={i}
                    style={{
                      ...cardStyle,
                      padding: '14px 16px',
                      borderColor: isSyncing ? C.accent : C.slate200,
                      borderWidth: isSyncing ? 2 : 1,
                      boxShadow: isSyncing
                        ? `0 0 0 ${glowIntensity * 4}px ${C.accent}20, 0 1px 3px rgba(0,0,0,0.06)`
                        : cardStyle.boxShadow,
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: C.slate800 }}>{form.code}</div>
                      {isSyncing && (
                        <div style={badgeStyle(C.green50, C.green600)}>
                          ✓ Updated
                        </div>
                      )}
                      {!form.syncs && (
                        <span style={{ fontSize: 11, color: C.slate400 }}>No changes</span>
                      )}
                    </div>
                    {isSyncing && (
                      <div style={{ fontSize: 11, color: C.accent, marginTop: 6, fontWeight: 500 }}>
                        Employer name synced from shared record
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT — Readiness Score */}
          <div style={{ width: 220, flexShrink: 0 }}>
            <div style={{ ...cardStyle, padding: '20px', textAlign: 'center' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.slate700, marginBottom: 16 }}>
                Filing Readiness
              </div>
              <ReadinessScore
                fromScore={72}
                toScore={80}
                animDelay={PHASE.scoreRise}
                animDuration={Math.round(1.5 * fps)}
                size={100}
                label=""
              />
              <div
                style={{
                  fontSize: 24,
                  fontWeight: 700,
                  color: C.slate800,
                  marginTop: 8,
                }}
              >
                {Math.round(
                  interpolate(
                    frame - PHASE.scoreRise,
                    [0, 1.5 * fps],
                    [72, 80],
                    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
                  )
                )}
              </div>
              <div style={{ fontSize: 11, color: C.slate400, marginTop: 2 }}>of 100</div>

              <div style={{ marginTop: 16, fontSize: 12, color: C.slate500, lineHeight: 1.4 }}>
                {issueResolved
                  ? '1 issue resolved. 2 remaining.'
                  : '3 issues pending review'}
              </div>

              {/* Issue summary */}
              <div style={{ marginTop: 14, textAlign: 'left' }}>
                {[
                  { label: 'Employer Name', resolved: issueResolved },
                  { label: 'SOC / Wage', resolved: false },
                  { label: 'Travel History', resolved: false },
                ].map((item, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '4px 0',
                      fontSize: 11,
                      color: item.resolved ? C.green600 : C.slate500,
                      textDecoration: item.resolved ? 'line-through' : 'none',
                    }}
                  >
                    <span style={{ fontSize: 10 }}>{item.resolved ? '✓' : '○'}</span>
                    {item.label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </AppFrame>

      <Caption
        text={CAPTIONS.beat5.main}
        subtext={CAPTIONS.beat5.sub}
        delay={PHASE.caption}
      />
    </AbsoluteFill>
  );
};
