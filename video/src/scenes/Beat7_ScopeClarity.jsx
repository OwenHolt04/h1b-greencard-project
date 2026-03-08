import React from 'react';
import {
  useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill,
} from 'remotion';
import { C, CAPTIONS, cardStyle } from '../lib/constants';
import { FONT_SANS, FONT_SERIF } from '../lib/fonts';
import { AppFrame } from '../components/AppFrame';
import { Caption } from '../components/Caption';

const SOLVES = [
  'Cross-form data inconsistency',
  'Fragmented status visibility across 4 portals',
  'Missed deadlines and extension risk',
  'Legal language opacity for applicants',
  'Dropped handoffs between stakeholders',
  'Redundant data entry across 6+ forms',
];

const REFORM = [
  'Visa caps and per-country limits',
  'Priority date retrogression',
  'USCIS staffing and processing capacity',
  'Political and legislative volatility',
  'OPT-to-H-1B pipeline alignment',
];

/**
 * Beat 7 — Scope Clarity (12s)
 * Two-column: What CaseBridge solves vs. What requires broader reform.
 * Keeps the argument honest and credible.
 */
export const Beat7_ScopeClarity = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerEnter = spring({ frame, fps, config: { damping: 200 }, delay: 8 });
  const leftEnter = spring({ frame, fps, config: { damping: 200 }, delay: Math.round(0.6 * fps) });
  const rightEnter = spring({ frame, fps, config: { damping: 200 }, delay: Math.round(1.2 * fps) });
  const scopeEnter = spring({ frame, fps, config: { damping: 200 }, delay: Math.round(2.5 * fps) });

  return (
    <AbsoluteFill>
      <AppFrame activeScreen="Impact">
        <div style={{ padding: '28px 40px', height: '100%' }}>
          {/* Header */}
          <div
            style={{
              marginBottom: 28,
              opacity: interpolate(headerEnter, [0, 1], [0, 1]),
              transform: `translateY(${interpolate(headerEnter, [0, 1], [12, 0])}px)`,
            }}
          >
            <div style={{ fontSize: 24, fontWeight: 700, color: C.slate800, fontFamily: FONT_SERIF }}>
              System Impact &amp; Scope
            </div>
            <div style={{ fontSize: 14, color: C.slate500, marginTop: 4 }}>
              What this platform changes directly — and what requires broader reform.
            </div>
          </div>

          {/* Two-Column Grid */}
          <div style={{ display: 'flex', gap: 24 }}>
            {/* LEFT — Solves Directly */}
            <div
              style={{
                flex: 1,
                opacity: interpolate(leftEnter, [0, 1], [0, 1]),
                transform: `translateX(${interpolate(leftEnter, [0, 1], [-16, 0])}px)`,
              }}
            >
              <div
                style={{
                  ...cardStyle,
                  padding: '24px',
                  borderColor: C.green500,
                  borderWidth: 1,
                  borderLeft: `4px solid ${C.green500}`,
                }}
              >
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: C.green700,
                    marginBottom: 18,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <span style={{ fontSize: 20 }}>✓</span>
                  What CaseBridge Solves Directly
                </div>

                {SOLVES.map((item, i) => {
                  const itemEnter = spring({
                    frame,
                    fps,
                    config: { damping: 200 },
                    delay: Math.round(1.2 * fps) + i * 5,
                  });

                  return (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        padding: '10px 0',
                        borderBottom: i < SOLVES.length - 1 ? `1px solid ${C.slate100}` : 'none',
                        opacity: interpolate(itemEnter, [0, 1], [0, 1]),
                        transform: `translateX(${interpolate(itemEnter, [0, 1], [8, 0])}px)`,
                      }}
                    >
                      <div
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: 10,
                          background: C.green50,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 11,
                          color: C.green600,
                          fontWeight: 700,
                          flexShrink: 0,
                        }}
                      >
                        ✓
                      </div>
                      <span style={{ fontSize: 14, color: C.slate700, lineHeight: 1.4 }}>
                        {item}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* RIGHT — Requires Reform */}
            <div
              style={{
                flex: 1,
                opacity: interpolate(rightEnter, [0, 1], [0, 1]),
                transform: `translateX(${interpolate(rightEnter, [0, 1], [16, 0])}px)`,
              }}
            >
              <div
                style={{
                  ...cardStyle,
                  padding: '24px',
                  borderColor: C.slate300,
                  borderWidth: 1,
                  borderLeft: `4px solid ${C.slate400}`,
                }}
              >
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: C.slate600,
                    marginBottom: 18,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <span style={{ fontSize: 20, color: C.slate400 }}>○</span>
                  Requires Broader Reform
                </div>

                {REFORM.map((item, i) => {
                  const itemEnter = spring({
                    frame,
                    fps,
                    config: { damping: 200 },
                    delay: Math.round(1.8 * fps) + i * 5,
                  });

                  return (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        padding: '10px 0',
                        borderBottom: i < REFORM.length - 1 ? `1px solid ${C.slate100}` : 'none',
                        opacity: interpolate(itemEnter, [0, 1], [0, 1]),
                        transform: `translateX(${interpolate(itemEnter, [0, 1], [8, 0])}px)`,
                      }}
                    >
                      <div
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: 10,
                          background: C.slate100,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 11,
                          color: C.slate400,
                          fontWeight: 700,
                          flexShrink: 0,
                        }}
                      >
                        ✕
                      </div>
                      <span style={{ fontSize: 14, color: C.slate500, lineHeight: 1.4 }}>
                        {item}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Scope Statement */}
          <div
            style={{
              marginTop: 24,
              background: C.navy900,
              borderRadius: 12,
              padding: '22px 32px',
              opacity: interpolate(scopeEnter, [0, 1], [0, 1]),
              transform: `translateY(${interpolate(scopeEnter, [0, 1], [12, 0])}px)`,
            }}
          >
            <div style={{ fontSize: 15, color: C.white, fontFamily: FONT_SERIF, lineHeight: 1.5 }}>
              &ldquo;This platform reduces avoidable process friction, rework, and uncertainty.
              It does not eliminate statutory caps, retrogression, or all legal complexity.&rdquo;
            </div>
          </div>
        </div>
      </AppFrame>

      <Caption
        text={CAPTIONS.beat7.main}
        subtext={CAPTIONS.beat7.sub}
        delay={Math.round(3.0 * fps)}
      />
    </AbsoluteFill>
  );
};
