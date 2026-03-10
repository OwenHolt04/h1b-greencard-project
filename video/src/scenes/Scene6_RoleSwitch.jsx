import React from 'react';
import {
  useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill, Easing,
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
const TRANSITION_FRAMES = 18; // frames for scatter/recompose

/**
 * Module card — glass on dark with optional accent border.
 */
const Module = ({ children, style = {}, accent = null }) => (
  <div style={{
    background: 'rgba(255,255,255,0.04)',
    border: `1px solid rgba(255,255,255,0.08)`,
    borderRadius: 14,
    ...(accent ? { borderLeft: `4px solid ${accent}` } : {}),
    ...style,
  }}>
    {children}
  </div>
);

/**
 * Animated module with position-based transition.
 * Accepts target position for current role and animates from previous.
 */
const AnimatedModule = ({ children, x, y, width, progress, accent, style = {} }) => (
  <div style={{
    position: 'absolute', left: x, top: y, width,
    opacity: interpolate(progress, [0, 1], [0, 1]),
    transform: `scale(${interpolate(progress, [0, 1], [0.9, 1])})`,
    ...style,
  }}>
    <Module accent={accent}>
      {children}
    </Module>
  </div>
);

/**
 * Scene 6 — Same Case, Three Stakeholders (25s / 750 frames)
 *
 * Central case anchor stays fixed. Surrounding modules physically
 * recompose/reweight per role. The transition itself communicates
 * "same truth, different priorities."
 *
 * Visual arc per role (~8.3s each):
 *   0-1s: Role accent glow shifts, role label appears
 *   1-2s: Modules animate into role-specific positions
 *   2-7s: Content visible, focal module highlighted
 *   7-8.3s: Modules scatter slightly before next role
 */
export const Scene6_RoleSwitch = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Determine active role
  let activeIdx = 0;
  if (frame >= ROLE_DURATION * 2) activeIdx = 2;
  else if (frame >= ROLE_DURATION) activeIdx = 1;

  const activeRole = ROLES[activeIdx];
  const localFrame = frame - activeIdx * ROLE_DURATION;

  // Module entry animation per role
  const moduleEnter = spring({
    frame: localFrame, fps,
    config: { damping: 18, stiffness: 120 },
    delay: TRANSITION_FRAMES,
  });

  // Role label animation
  const labelEnter = spring({
    frame: localFrame, fps,
    config: { damping: 20, stiffness: 200 },
    delay: 5,
  });

  // Scatter out at end of each role (except last)
  const isLastRole = activeIdx === 2;
  const scatterProgress = !isLastRole
    ? interpolate(localFrame, [ROLE_DURATION - TRANSITION_FRAMES, ROLE_DURATION], [0, 1], {
        extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
      })
    : 0;

  // Accent glow position/color
  const glowColor = activeRole.accent;

  // Kinetic caption per role
  const kineticText = activeIdx === 0 ? 'Same case.' : activeIdx === 1 ? 'Different needs.' : 'One source of truth.';
  const kineticEnter = spring({ frame: localFrame, fps, config: { damping: 20, stiffness: 200 }, delay: TRANSITION_FRAMES + 10 });
  const kineticExit = interpolate(localFrame, [80, 100], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  const captionData = CAPTIONS.scene6.captions[activeRole.id];

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(160deg, #0e1a4a 0%, ${C.navy900} 40%, ${C.navy800} 100%)`,
        fontFamily: FONT_SANS, overflow: 'hidden',
      }}
    >
      {/* ── Accent glow ── */}
      <div style={{
        position: 'absolute', top: 200, left: '50%', transform: 'translateX(-50%)',
        width: 900, height: 500, borderRadius: '50%',
        background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
        opacity: 0.06, pointerEvents: 'none',
      }} />

      {/* ═══════ CENTRAL ANCHOR: Case Identity ═══════ */}
      <div style={{
        position: 'absolute', top: 60, left: '50%', transform: 'translateX(-50%)',
        width: 700, zIndex: 10,
      }}>
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          border: `1px solid rgba(255,255,255,0.1)`,
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
            <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>
              {CASE.applicant.title} {'\u2022'} {CASE.employer.shortName} {'\u2022'} {CASE.stage}
            </div>
          </div>

          {/* Role switcher pills */}
          <div style={{ display: 'flex', gap: 0, background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: 3 }}>
            {ROLES.map((role, i) => {
              const isActive = i === activeIdx;
              return (
                <div key={role.id} style={{
                  padding: '10px 24px', borderRadius: 8,
                  fontSize: 14, fontWeight: isActive ? 700 : 500,
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

      {/* ═══════ ROLE-SPECIFIC MODULES ═══════ */}
      <div style={{
        opacity: interpolate(scatterProgress, [0, 1], [1, 0]),
        transform: `scale(${interpolate(scatterProgress, [0, 1], [1, 0.95])})`,
      }}>
        {/* ─── APPLICANT VIEW ─── */}
        {activeIdx === 0 && (
          <>
            {/* Primary: reassurance message */}
            <AnimatedModule x={120} y={230} width={600} progress={moduleEnter} accent={C.blue500}>
              <div style={{ padding: '28px 32px' }}>
                <div style={{ fontSize: 28, fontWeight: 700, color: C.white, fontFamily: FONT_DISPLAY, marginBottom: 12 }}>
                  Your case is on track, {CASE.applicant.name.split(' ')[0]}.
                </div>
                <div style={{ fontSize: 17, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6 }}>
                  Your I-485 package is being prepared. Your priority date is now current.
                  No action needed from you today.
                </div>
              </div>
            </AnimatedModule>

            {/* Next step */}
            <AnimatedModule x={120} y={460} width={600} progress={moduleEnter}>
              <div style={{ padding: '20px 28px' }}>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', fontWeight: 600, letterSpacing: '0.06em', marginBottom: 10 }}>
                  NEXT STEP
                </div>
                <div style={{ fontSize: 17, color: 'rgba(255,255,255,0.65)', lineHeight: 1.5 }}>
                  Wait for attorney to confirm job duties wording for I-485 filing.
                </div>
              </div>
            </AnimatedModule>

            {/* Status indicators */}
            <div style={{
              position: 'absolute', right: 140, top: 240,
              display: 'flex', flexDirection: 'column', gap: 14, width: 400,
              opacity: interpolate(moduleEnter, [0, 1], [0, 1]),
              transform: `translateX(${interpolate(moduleEnter, [0, 1], [20, 0])}px)`,
            }}>
              {[
                { color: C.green500, text: 'I-485 package: 82% complete' },
                { color: C.blue500, text: `Priority date: current for ${CASE.applicant.category}` },
                { color: C.amber500, text: `H-1B: ${CASE.applicant.h1bDaysLeft} days remaining` },
              ].map((item, i) => (
                <Module key={i} style={{ padding: '14px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 10, height: 10, borderRadius: 5, background: item.color, flexShrink: 0 }} />
                    <div style={{ fontSize: 16, color: 'rgba(255,255,255,0.6)' }}>{item.text}</div>
                  </div>
                </Module>
              ))}
            </div>
          </>
        )}

        {/* ─── EMPLOYER VIEW ─── */}
        {activeIdx === 1 && (
          <>
            {/* Primary: Countdown */}
            <AnimatedModule x={120} y={240} width={480} progress={moduleEnter} accent={C.amber500}>
              <div style={{ padding: '28px 32px' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
                  <div style={{ fontSize: 80, fontWeight: 700, fontFamily: FONT_DISPLAY, color: C.amber500, lineHeight: 1 }}>
                    {CASE.applicant.h1bDaysLeft}
                  </div>
                  <div style={{ fontSize: 20, color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>days until H-1B expiry</div>
                </div>
              </div>
            </AnimatedModule>

            {/* Cost card */}
            <AnimatedModule x={660} y={240} width={420} progress={moduleEnter}>
              <div style={{ padding: '24px 28px' }}>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', fontWeight: 600, letterSpacing: '0.06em', marginBottom: 10 }}>
                  EXTENSION FILING
                </div>
                <div style={{ fontSize: 36, fontWeight: 700, color: C.white }}>~$2,500 est.</div>
                <div style={{
                  marginTop: 12, padding: '5px 14px', borderRadius: 9999,
                  background: 'rgba(245,158,11,0.12)', color: C.amber500, fontSize: 14, fontWeight: 600,
                  display: 'inline-block',
                }}>
                  Auto-trigger at 90 days
                </div>
              </div>
            </AnimatedModule>

            {/* Action needed */}
            <AnimatedModule x={120} y={460} width={960} progress={moduleEnter} accent={C.amber500}>
              <div style={{ padding: '22px 28px' }}>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', fontWeight: 600, letterSpacing: '0.06em', marginBottom: 10 }}>
                  ACTION NEEDED
                </div>
                <div style={{ fontSize: 18, color: 'rgba(255,255,255,0.65)', lineHeight: 1.5 }}>
                  Approve budget allocation + confirm job duties letter for {CASE.applicant.name}.
                </div>
              </div>
            </AnimatedModule>
          </>
        )}

        {/* ─── ATTORNEY VIEW ─── */}
        {activeIdx === 2 && (
          <>
            {/* Primary: Issues */}
            <AnimatedModule x={120} y={230} width={620} progress={moduleEnter} accent={C.green500}>
              <div style={{ padding: '24px 28px' }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: C.white, marginBottom: 18 }}>
                  2 Issues Remaining
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <Module style={{ padding: '14px 18px', borderLeft: `3px solid ${C.red500}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <div style={{ width: 8, height: 8, borderRadius: 4, background: C.red500 }} />
                      <span style={{ fontSize: 13, fontWeight: 700, color: C.red500 }}>HIGH</span>
                    </div>
                    <div style={{ fontSize: 16, color: 'rgba(255,255,255,0.7)' }}>SOC / Wage Mismatch {'\u2014'} review required</div>
                  </Module>
                  <Module style={{ padding: '14px 18px', borderLeft: `3px solid ${C.blue500}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <div style={{ width: 8, height: 8, borderRadius: 4, background: C.blue500 }} />
                      <span style={{ fontSize: 13, fontWeight: 700, color: C.blue500 }}>LOW</span>
                    </div>
                    <div style={{ fontSize: 16, color: 'rgba(255,255,255,0.7)' }}>Travel history gap {'\u2014'} applicant confirmation pending</div>
                  </Module>
                </div>
              </div>
            </AnimatedModule>

            {/* Evidence + Action */}
            <AnimatedModule x={120} y={580} width={620} progress={moduleEnter}>
              <div style={{ padding: '18px 24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 4, background: C.amber500 }} />
                  <div style={{ fontSize: 16, color: 'rgba(255,255,255,0.6)' }}>Evidence bundle: 4/5 documents</div>
                </div>
                <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)' }}>
                  Review SOC mapping {'\u2192'} submit {CASE.applicant.name}{'\u2019'}s filing package
                </div>
              </div>
            </AnimatedModule>

            {/* Readiness score */}
            <div style={{
              position: 'absolute', right: 200, top: 280,
              opacity: interpolate(moduleEnter, [0, 1], [0, 1]),
              transform: `scale(${interpolate(moduleEnter, [0, 1], [0.85, 1])})`,
            }}>
              <Module style={{ padding: '28px 36px', textAlign: 'center' }}>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', fontWeight: 600, letterSpacing: '0.06em', marginBottom: 14 }}>
                  FILING READINESS
                </div>
                <ReadinessScore fromScore={80} toScore={80} size={150} label="" />
              </Module>
            </div>
          </>
        )}
      </div>

      {/* ═══════ Role transition kinetic label ═══════ */}
      {localFrame > TRANSITION_FRAMES && localFrame < 100 && (
        <div style={{
          position: 'absolute', bottom: 200, left: '50%',
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
