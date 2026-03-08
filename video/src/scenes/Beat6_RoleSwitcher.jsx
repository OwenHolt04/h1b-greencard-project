import React from 'react';
import {
  useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill,
} from 'remotion';
import { C, CAPTIONS, cardStyle } from '../lib/constants';
import { FONT_SANS } from '../lib/fonts';
import { MinimalFrame } from '../components/MinimalFrame';
import { Caption } from '../components/Caption';
import { ReadinessScore } from '../components/ReadinessScore';

const ROLES = [
  { id: 'applicant', label: 'Applicant', accent: C.blue500 },
  { id: 'employer', label: 'Employer / HR', accent: C.amber500 },
  { id: 'attorney', label: 'Attorney', accent: C.green500 },
];

const ROLE_DURATION = 240; // 8s per role
const SLIDE_FRAMES = 12;

// ── Applicant Layout ────────────────────────────────
const ApplicantContent = ({ progress }) => (
  <div style={{ padding: '48px 80px', opacity: progress }}>
    <div style={{ borderLeft: `4px solid ${C.blue500}`, paddingLeft: 24, marginBottom: 40 }}>
      <div style={{ fontSize: 28, fontWeight: 700, color: C.slate800 }}>
        Your case is on track.
      </div>
    </div>
    <div style={{ fontSize: 20, color: C.slate600, lineHeight: 1.6, marginBottom: 44, maxWidth: 700 }}>
      Your I-485 package is being prepared. No action needed today.
    </div>
    <div style={{ ...cardStyle, padding: '28px 32px', marginBottom: 44, maxWidth: 700 }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: C.slate400, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
        Next Step
      </div>
      <div style={{ fontSize: 18, color: C.slate700, lineHeight: 1.5 }}>
        Wait for attorney to confirm job duties wording.
      </div>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {[
        { color: C.green500, text: 'I-485 package: 82% complete' },
        { color: C.blue500, text: 'Priority date: current for EB-2' },
      ].map((item, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 12, height: 12, borderRadius: 6, background: item.color }} />
          <div style={{ fontSize: 16, color: C.slate600 }}>{item.text}</div>
        </div>
      ))}
    </div>
  </div>
);

// ── Employer Layout ─────────────────────────────────
const EmployerContent = ({ progress }) => (
  <div style={{ padding: '48px 80px', opacity: progress }}>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 44 }}>
      <div style={{ fontSize: 80, fontWeight: 700, color: C.amber500, lineHeight: 1 }}>102</div>
      <div style={{ fontSize: 20, color: C.slate600, fontWeight: 500 }}>days until H-1B expiry</div>
    </div>
    <div style={{ display: 'flex', gap: 24, marginBottom: 44 }}>
      <div style={{ ...cardStyle, padding: '24px 28px', borderLeft: `4px solid ${C.amber500}`, flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: C.slate400, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Extension Filing</div>
        <div style={{ fontSize: 28, fontWeight: 700, color: C.slate800 }}>~$2,500 est.</div>
      </div>
      <div style={{ ...cardStyle, padding: '24px 28px', flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: C.slate400, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Risk Indicator</div>
        <div style={{ padding: '5px 14px', borderRadius: 9999, background: C.amber100, color: C.amber600, fontSize: 14, fontWeight: 600, display: 'inline-block' }}>
          Auto-trigger at 90 days
        </div>
      </div>
    </div>
    <div style={{ ...cardStyle, padding: '24px 28px', maxWidth: 700 }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: C.slate400, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Action Needed</div>
      <div style={{ fontSize: 18, color: C.slate700, lineHeight: 1.5 }}>Approve budget allocation + confirm job duties letter.</div>
    </div>
  </div>
);

// ── Attorney Layout ─────────────────────────────────
const AttorneyContent = ({ progress }) => (
  <div style={{ padding: '48px 80px', opacity: progress }}>
    <div style={{ display: 'flex', gap: 56 }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 24, fontWeight: 700, color: C.slate800, marginBottom: 28 }}>2 Issues Remaining</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 36 }}>
          <div style={{ ...cardStyle, padding: '20px 24px', borderLeft: `4px solid ${C.red500}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <div style={{ width: 10, height: 10, borderRadius: 5, background: C.red500 }} />
              <div style={{ fontSize: 13, fontWeight: 700, color: C.red600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>High</div>
            </div>
            <div style={{ fontSize: 18, color: C.slate700, lineHeight: 1.4 }}>SOC / Wage Mismatch — review required</div>
          </div>
          <div style={{ ...cardStyle, padding: '20px 24px', borderLeft: `4px solid ${C.blue500}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <div style={{ width: 10, height: 10, borderRadius: 5, background: C.blue500 }} />
              <div style={{ fontSize: 13, fontWeight: 700, color: C.blue600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Low</div>
            </div>
            <div style={{ fontSize: 18, color: C.slate700, lineHeight: 1.4 }}>Travel history gap — applicant confirmation pending</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
          <div style={{ width: 10, height: 10, borderRadius: 5, background: C.amber500 }} />
          <div style={{ fontSize: 16, color: C.slate600 }}>Evidence bundle: 4/5 documents</div>
        </div>
        <div style={{ ...cardStyle, padding: '20px 24px' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.slate400, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Action</div>
          <div style={{ fontSize: 18, color: C.slate700, lineHeight: 1.5 }}>Review SOC mapping → submit filing package</div>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingRight: 40 }}>
        <ReadinessScore fromScore={80} toScore={80} size={140} label="Filing Readiness" />
      </div>
    </div>
  </div>
);

const ROLE_VIEWS = [ApplicantContent, EmployerContent, AttorneyContent];

/**
 * Beat 6 — Role Switcher (24s = 720 frames)
 * Three role views with slide transitions.
 * No Sequence — uses frame-based conditional rendering.
 */
export const Beat6_RoleSwitcher = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Determine active role
  let activeRoleIdx = 0;
  if (frame >= ROLE_DURATION * 2) activeRoleIdx = 2;
  else if (frame >= ROLE_DURATION) activeRoleIdx = 1;

  const activeRole = ROLES[activeRoleIdx];
  const localFrame = frame - activeRoleIdx * ROLE_DURATION;

  // Slide in/out for content
  const slideIn = interpolate(localFrame, [0, SLIDE_FRAMES], [300, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const fadeIn = interpolate(localFrame, [0, SLIDE_FRAMES], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Content enter animation (staggered after slide)
  const contentEnter = spring({
    frame: localFrame,
    fps,
    config: { damping: 200 },
    delay: 8,
  });

  const captionData = CAPTIONS.beat6.captions[activeRole.id];
  const ActiveView = ROLE_VIEWS[activeRoleIdx];

  return (
    <AbsoluteFill>
      <MinimalFrame activeScreen="Roles">
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* Accent band */}
          <div style={{ height: 5, background: activeRole.accent, flexShrink: 0 }} />

          {/* Role Switcher Control */}
          <div style={{ display: 'flex', justifyContent: 'center', padding: '20px 0 0', flexShrink: 0 }}>
            <div style={{ display: 'flex', gap: 0, background: C.slate100, borderRadius: 12, padding: 4 }}>
              {ROLES.map((role, i) => {
                const isActive = i === activeRoleIdx;
                return (
                  <div
                    key={role.id}
                    style={{
                      padding: '14px 36px',
                      borderRadius: 10,
                      fontSize: 18,
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? C.white : C.slate500,
                      background: isActive ? role.accent : 'transparent',
                      fontFamily: FONT_SANS,
                    }}
                  >
                    {role.label}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Role content — frame-based rendering */}
          <div
            style={{
              flex: 1,
              overflow: 'hidden',
              transform: `translateX(${activeRoleIdx === 0 ? 0 : slideIn}px)`,
              opacity: activeRoleIdx === 0 ? 1 : fadeIn,
            }}
          >
            <ActiveView progress={interpolate(contentEnter, [0, 1], [0, 1])} />
          </div>
        </div>
      </MinimalFrame>

      <Caption
        text={captionData.main}
        subtext={captionData.sub}
        delay={activeRoleIdx === 0 ? 20 : 8}
      />
    </AbsoluteFill>
  );
};
