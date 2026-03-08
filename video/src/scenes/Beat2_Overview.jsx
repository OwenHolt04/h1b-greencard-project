import React from 'react';
import {
  useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill,
} from 'remotion';
import { C, CAPTIONS, cardStyle } from '../lib/constants';
import { FONT_SANS, FONT_SERIF } from '../lib/fonts';
import { AppFrame } from '../components/AppFrame';
import { Caption } from '../components/Caption';

const CAPABILITY_CARDS = [
  {
    icon: '📋',
    title: 'Smart Intake',
    desc: 'Enter shared data once. Auto-populate across 6+ forms.',
    metric: '~90% less re-keying',
    color: C.blue500,
  },
  {
    icon: '🛡',
    title: 'Validation Engine',
    desc: 'Pre-submission checks catch contradictions before filing.',
    metric: 'RFE rate: 25% → <5%',
    color: C.green500,
  },
  {
    icon: '📊',
    title: 'Unified Dashboard',
    desc: 'One view across DOL, USCIS, and DOS. Replace 4 portals.',
    metric: '−60% status calls',
    color: C.accent,
  },
  {
    icon: '👥',
    title: 'Role-Based Views',
    desc: 'Same case, different priorities for each stakeholder.',
    metric: '3 aligned perspectives',
    color: C.navy600,
  },
];

/**
 * Beat 2 — CaseBridge Overview (12s)
 * Hero section + 4 capability cards stagger in.
 */
export const Beat2_Overview = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const heroEnter = spring({ frame, fps, config: { damping: 200 }, delay: 5 });

  return (
    <AbsoluteFill>
      <AppFrame activeScreen="Overview">
        {/* Hero Section */}
        <div
          style={{
            background: `linear-gradient(135deg, ${C.navy900} 0%, ${C.navy700} 100%)`,
            padding: '56px 64px',
            borderRadius: 16,
            margin: '24px 32px',
            position: 'relative',
            overflow: 'hidden',
            opacity: interpolate(heroEnter, [0, 1], [0, 1]),
            transform: `translateY(${interpolate(heroEnter, [0, 1], [20, 0])}px)`,
          }}
        >
          {/* Decorative accent line */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 3,
              background: `linear-gradient(90deg, ${C.accent}, ${C.accentLight}, transparent)`,
            }}
          />

          <div
            style={{
              fontSize: 38,
              fontWeight: 700,
              fontFamily: FONT_SERIF,
              color: C.white,
              lineHeight: 1.2,
              letterSpacing: '-0.02em',
              maxWidth: 800,
            }}
          >
            One shared case record for the
            <br />
            <span style={{ color: C.accent }}>H-1B to green card journey</span>
          </div>

          <div
            style={{
              fontSize: 17,
              color: 'rgba(255,255,255,0.6)',
              marginTop: 14,
              maxWidth: 650,
              lineHeight: 1.5,
            }}
          >
            Reduce rework, simplify handoffs, and make status visible across
            applicant, employer, attorney, and agencies.
          </div>

          {/* CTA buttons */}
          <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
            <div
              style={{
                background: C.accent,
                color: C.navy900,
                padding: '10px 22px',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              View Demo Case
            </div>
            <div
              style={{
                background: 'rgba(255,255,255,0.1)',
                color: C.white,
                padding: '10px 22px',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 500,
                border: '1px solid rgba(255,255,255,0.15)',
              }}
            >
              See What Portal Solves
            </div>
          </div>
        </div>

        {/* Capability Cards */}
        <div
          style={{
            display: 'flex',
            gap: 20,
            padding: '0 32px',
            marginTop: 8,
          }}
        >
          {CAPABILITY_CARDS.map((card, i) => {
            const cardEnter = spring({
              frame,
              fps,
              config: { damping: 200 },
              delay: Math.round(1.2 * fps) + i * 6,
            });

            return (
              <div
                key={i}
                style={{
                  ...cardStyle,
                  flex: 1,
                  padding: '24px 20px',
                  opacity: interpolate(cardEnter, [0, 1], [0, 1]),
                  transform: `translateY(${interpolate(cardEnter, [0, 1], [16, 0])}px)`,
                }}
              >
                <div style={{ fontSize: 28, marginBottom: 10 }}>{card.icon}</div>
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: C.slate800,
                    marginBottom: 6,
                  }}
                >
                  {card.title}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: C.slate500,
                    lineHeight: 1.4,
                    marginBottom: 12,
                  }}
                >
                  {card.desc}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: card.color,
                    background: `${card.color}12`,
                    padding: '4px 10px',
                    borderRadius: 6,
                    display: 'inline-block',
                  }}
                >
                  {card.metric}
                </div>
              </div>
            );
          })}
        </div>
      </AppFrame>

      {/* Caption */}
      <Caption
        text={CAPTIONS.beat2.main}
        subtext={CAPTIONS.beat2.sub}
        delay={Math.round(2.5 * fps)}
      />
    </AbsoluteFill>
  );
};
