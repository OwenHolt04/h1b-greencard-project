import React from 'react';
import {
  useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill,
} from 'remotion';
import { C, CAPTIONS, CASE } from '../lib/constants';
import { FONT_SANS, FONT_DISPLAY } from '../lib/fonts';
import { Caption } from '../components/Caption';
import { ReadinessScore } from '../components/ReadinessScore';

const ROLES = [
  { id: 'applicant', label: 'Applicant', accent: C.blue500 },
  { id: 'employer', label: 'Employer / HR', accent: C.amber500 },
  { id: 'attorney', label: 'Attorney', accent: C.green500 },
];

const ROLE_DURATION = 250; // ~8.3s per role
const TRANSITION_FRAMES = 18;

/** Glass card */
const Module = ({ children, style = {}, accent = null }) => (
  <div style={{
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 14,
    ...(accent ? { borderLeft: `4px solid ${accent}` } : {}),
    ...style,
  }}>
    {children}
  </div>
);

/**
 * Scene 6 — Same Case, Three Stakeholders (25s / 750 frames)
 *
 * Centered composition. Case anchor stays fixed at top-center.
 * One dominant role card below, supporting modules cluster tight.
 */
export const Scene6_RoleSwitch = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  let activeIdx = 0;
  if (frame >= ROLE_DURATION * 2) activeIdx = 2;
  else if (frame >= ROLE_DURATION) activeIdx = 1;

  const activeRole = ROLES[activeIdx];
  const localFrame = frame - activeIdx * ROLE_DURATION;

  const moduleEnter = spring({
    frame: localFrame, fps,
    config: { damping: 18, stiffness: 120 },
    delay: TRANSITION_FRAMES,
  });

  const labelEnter = spring({
    frame: localFrame, fps,
    config: { damping: 20, stiffness: 200 },
    delay: 5,
  });

  const isLastRole = activeIdx === 2;
  const scatterProgress = !isLastRole
    ? interpolate(localFrame, [ROLE_DURATION - TRANSITION_FRAMES, ROLE_DURATION], [0, 1], {
        extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
      })
    : 0;

  const kineticText = activeIdx === 0 ? 'Same case.' : activeIdx === 1 ? 'Different needs.' : 'One source of truth.';
  const kineticEnter = spring({ frame: localFrame, fps, config: { damping: 20, stiffness: 200 }, delay: TRANSITION_FRAMES + 10 });
  const kineticExit = interpolate(localFrame, [80, 100], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  const captionData = CAPTIONS.scene6.captions[activeRole.id];

  /* Layout: centered */
  const CX = 960;
  const anchorW = 720;
  const anchorLeft = CX - anchorW / 2;
  const moduleW = 620;
  const moduleLeft = CX - moduleW / 2;

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(160deg, #0e1a4a 0%, ${C.navy900} 40%, ${C.navy800} 100%)`,
        fontFamily: FONT_SANS, overflow: 'hidden',
      }}
    >
      {/* ── Accent glow ── */}
      <div style={{
        position: 'absolute', top: 300, left: '50%', transform: 'translateX(-50%)',
        width: 800, height: 500, borderRadius: '50%',
        background: `radial-gradient(circle, ${activeRole.accent} 0%, transparent 70%)`,
        opacity: 0.05, pointerEvents: 'none',
      }} />

      {/* ═══════ CASE ANCHOR — Centered ═══════ */}
      <div style={{
        position: 'absolute', top: 60, left: anchorLeft, width: anchorW,
        zIndex: 10,
      }}>
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderTop: `3px solid ${activeRole.accent}`,
          borderRadius: 14, padding: '20px 32px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', fontWeight: 600, letterSpacing: '0.08em' }}>
              CASE {CASE.caseId}
            </div>
            <div style={{ fontSize: 24, fontWeight: 700, color: C.white, marginTop: 4 }}>
              {CASE.applicant.name}
            </div>
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>
              {CASE.applicant.title} {'\u2022'} {CASE.employer.shortName} {'\u2022'} {CASE.stage}
            </div>
          </div>

          {/* Role pills */}
          <div style={{ display: 'flex', gap: 0, background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: 3 }}>
            {ROLES.map((role, i) => {
              const isActive = i === activeIdx;
              return (
                <div key={role.id} style={{
                  padding: '10px 22px', borderRadius: 8,
                  fontSize: 13, fontWeight: isActive ? 700 : 500,
                  color: isActive ? C.white : 'rgba(255,255,255,0.35)',
                  background: isActive ? role.accent : 'transparent',
                }}>
                  {role.label}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ═══════ ROLE-SPECIFIC MODULES — Centered below anchor ═══════ */}
      <div style={{
        opacity: interpolate(scatterProgress, [0, 1], [1, 0]),
        transform: `scale(${interpolate(scatterProgress, [0, 1], [1, 0.95])})`,
      }}>
        {/* ─── APPLICANT ─── */}
        {activeIdx === 0 && (
          <>
            {/* Primary: reassurance — centered below anchor */}
            <div style={{
              position: 'absolute', left: moduleLeft, top: 230, width: moduleW,
              opacity: interpolate(moduleEnter, [0, 1], [0, 1]),
              transform: `scale(${interpolate(moduleEnter, [0, 1], [0.92, 1])}) translateY(${interpolate(moduleEnter, [0, 1], [16, 0])}px)`,
            }}>
              <Module accent={C.blue500} style={{ padding: '28px 32px' }}>
                <div style={{ fontSize: 26, fontWeight: 700, color: C.white, fontFamily: FONT_DISPLAY, marginBottom: 12 }}>
                  Your case is on track, {CASE.applicant.name.split(' ')[0]}.
                </div>
                <div style={{ fontSize: 16, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6 }}>
                  Your I-485 package is being prepared. Your priority date is now current.
                  No action needed from you today.
                </div>
              </Module>
            </div>

            {/* Next step — centered below primary */}
            <div style={{
              position: 'absolute', left: moduleLeft, top: 440, width: moduleW,
              opacity: interpolate(moduleEnter, [0, 1], [0, 1]),
              transform: `translateY(${interpolate(moduleEnter, [0, 1], [12, 0])}px)`,
            }}>
              <Module style={{ padding: '18px 28px' }}>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', fontWeight: 600, letterSpacing: '0.06em', marginBottom: 8 }}>
                  NEXT STEP
                </div>
                <div style={{ fontSize: 16, color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>
                  Wait for attorney to confirm job duties wording for I-485 filing.
                </div>
              </Module>
            </div>

            {/* Status indicators — compact row below */}
            <div style={{
              position: 'absolute', left: moduleLeft, top: 560, width: moduleW,
              display: 'flex', gap: 12,
              opacity: interpolate(moduleEnter, [0, 1], [0, 1]),
              transform: `translateY(${interpolate(moduleEnter, [0, 1], [12, 0])}px)`,
            }}>
              {[
                { color: C.green500, text: 'I-485: 82% complete' },
                { color: C.blue500, text: `Priority: current` },
                { color: C.amber500, text: `H-1B: ${CASE.applicant.h1bDaysLeft} days` },
              ].map((item, i) => (
                <Module key={i} style={{ padding: '12px 16px', flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: 4, background: item.color, flexShrink: 0 }} />
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>{item.text}</div>
                  </div>
                </Module>
              ))}
            </div>
          </>
        )}

        {/* ─── EMPLOYER ─── */}
        {activeIdx === 1 && (
          <>
            {/* Primary: Countdown — centered hero */}
            <div style={{
              position: 'absolute', left: moduleLeft, top: 230, width: moduleW,
              opacity: interpolate(moduleEnter, [0, 1], [0, 1]),
              transform: `scale(${interpolate(moduleEnter, [0, 1], [0.92, 1])}) translateY(${interpolate(moduleEnter, [0, 1], [16, 0])}px)`,
            }}>
              <Module accent={C.amber500} style={{ padding: '28px 32px' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
                  <div style={{ fontSize: 72, fontWeight: 700, fontFamily: FONT_DISPLAY, color: C.amber500, lineHeight: 1 }}>
                    {CASE.applicant.h1bDaysLeft}
                  </div>
                  <div style={{ fontSize: 20, color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>days until H-1B expiry</div>
                </div>
              </Module>
            </div>

            {/* Cost + Auto-trigger — side by side centered */}
            <div style={{
              position: 'absolute', left: moduleLeft, top: 420, width: moduleW,
              display: 'flex', gap: 14,
              opacity: interpolate(moduleEnter, [0, 1], [0, 1]),
              transform: `translateY(${interpolate(moduleEnter, [0, 1], [12, 0])}px)`,
            }}>
              <Module style={{ padding: '20px 24px', flex: 1 }}>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontWeight: 600, letterSpacing: '0.06em', marginBottom: 8 }}>EXTENSION COST</div>
                <div style={{ fontSize: 30, fontWeight: 700, color: C.white }}>~$2,500</div>
              </Module>
              <Module style={{ padding: '20px 24px', flex: 1 }}>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontWeight: 600, letterSpacing: '0.06em', marginBottom: 8 }}>AUTO-TRIGGER</div>
                <div style={{
                  padding: '5px 14px', borderRadius: 9999,
                  background: 'rgba(245,158,11,0.12)', color: C.amber500,
                  fontSize: 15, fontWeight: 600, display: 'inline-block',
                }}>
                  At 90 days
                </div>
              </Module>
            </div>

            {/* Action needed */}
            <div style={{
              position: 'absolute', left: moduleLeft, top: 560, width: moduleW,
              opacity: interpolate(moduleEnter, [0, 1], [0, 1]),
              transform: `translateY(${interpolate(moduleEnter, [0, 1], [12, 0])}px)`,
            }}>
              <Module accent={C.amber500} style={{ padding: '18px 24px' }}>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', fontWeight: 600, letterSpacing: '0.06em', marginBottom: 8 }}>ACTION NEEDED</div>
                <div style={{ fontSize: 16, color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>
                  Approve budget + confirm job duties letter for {CASE.applicant.name}.
                </div>
              </Module>
            </div>
          </>
        )}

        {/* ─── ATTORNEY ─── */}
        {activeIdx === 2 && (
          <>
            {/* Primary: Issues */}
            <div style={{
              position: 'absolute', left: moduleLeft, top: 230, width: moduleW,
              opacity: interpolate(moduleEnter, [0, 1], [0, 1]),
              transform: `scale(${interpolate(moduleEnter, [0, 1], [0.92, 1])}) translateY(${interpolate(moduleEnter, [0, 1], [16, 0])}px)`,
            }}>
              <Module accent={C.green500} style={{ padding: '24px 28px' }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: C.white, marginBottom: 16 }}>
                  2 Issues Remaining
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <Module style={{ padding: '12px 16px', borderLeft: `3px solid ${C.red500}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <div style={{ width: 8, height: 8, borderRadius: 4, background: C.red500 }} />
                      <span style={{ fontSize: 12, fontWeight: 700, color: C.red500 }}>HIGH</span>
                    </div>
                    <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.65)' }}>SOC / Wage Mismatch {'\u2014'} review required</div>
                  </Module>
                  <Module style={{ padding: '12px 16px', borderLeft: `3px solid ${C.blue500}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <div style={{ width: 8, height: 8, borderRadius: 4, background: C.blue500 }} />
                      <span style={{ fontSize: 12, fontWeight: 700, color: C.blue500 }}>LOW</span>
                    </div>
                    <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.65)' }}>Travel history gap {'\u2014'} applicant confirmation</div>
                  </Module>
                </div>
              </Module>
            </div>

            {/* Evidence + Score — side by side */}
            <div style={{
              position: 'absolute', left: moduleLeft, top: 520, width: moduleW,
              display: 'flex', gap: 14,
              opacity: interpolate(moduleEnter, [0, 1], [0, 1]),
              transform: `translateY(${interpolate(moduleEnter, [0, 1], [12, 0])}px)`,
            }}>
              <Module style={{ padding: '18px 22px', flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 4, background: C.amber500 }} />
                  <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.6)' }}>Evidence: 4/5 documents</div>
                </div>
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)' }}>
                  Review SOC {'\u2192'} submit filing package
                </div>
              </Module>
              <div style={{
                opacity: interpolate(moduleEnter, [0, 1], [0, 1]),
                transform: `scale(${interpolate(moduleEnter, [0, 1], [0.85, 1])})`,
              }}>
                <Module style={{ padding: '18px 28px', textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontWeight: 600, letterSpacing: '0.06em', marginBottom: 10 }}>
                    READINESS
                  </div>
                  <ReadinessScore fromScore={80} toScore={80} size={90} label="" />
                </Module>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ═══════ Role transition kinetic label ═══════ */}
      {localFrame > TRANSITION_FRAMES && localFrame < 100 && (
        <div style={{
          position: 'absolute', bottom: 180, left: '50%',
          transform: `translateX(-50%) scale(${interpolate(kineticEnter, [0, 1], [0.9, 1])})`,
          zIndex: 30, pointerEvents: 'none',
          opacity: interpolate(kineticEnter, [0, 1], [0, 1]) * kineticExit,
        }}>
          <div style={{
            fontSize: 44, fontWeight: 700, fontFamily: FONT_DISPLAY, color: activeRole.accent,
            textShadow: '0 0 60px rgba(14,26,74,0.95), 0 0 120px rgba(14,26,74,0.8)',
          }}>
            {kineticText}
          </div>
        </div>
      )}

      <Caption
        text={captionData.main}
        subtext={captionData.sub}
        delay={TRANSITION_FRAMES + 15}
      />
    </AbsoluteFill>
  );
};
