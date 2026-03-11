import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { WK_FRAMES, WK_TR, WK_TOTAL_FRAMES } from './shared';
import { C } from '../lib/constants';

import { WK1_DashboardReveal } from './WK1_DashboardReveal';
import { WK2_SmartIntake } from './WK2_SmartIntake';
import { WK3_ValidationFix } from './WK3_ValidationFix';
import { WK6_ImpactClose } from './WK6_ImpactClose';

/**
 * CaseBridge Walkthrough — Website-Driven Presentation
 *
 * 4 segments mapping to presentation screens:
 *   WK1 (24s): Case Record / Single Source of Truth (with role tabs)
 *   WK2 (22s): Smart Intake + Form Sync
 *   WK3 (24s): Pre-Submission Validation + RFE Prevention + Fix
 *   WK4 (24s): Impact + Scope + Close
 */
export const CaseBridgeWalkthrough = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ background: C.navy900 }}>
      <TransitionSeries>
        {/* WK1 — Case Record / Single Source of Truth */}
        <TransitionSeries.Sequence durationInFrames={WK_FRAMES.dashboardReveal}>
          <WK1_DashboardReveal />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: WK_TR['1_2'] })}
        />

        {/* WK2 — Smart Intake */}
        <TransitionSeries.Sequence durationInFrames={WK_FRAMES.smartIntake}>
          <WK2_SmartIntake />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: WK_TR['2_3'] })}
        />

        {/* WK3 — Pre-Submission Validation + Fix */}
        <TransitionSeries.Sequence durationInFrames={WK_FRAMES.validationFix}>
          <WK3_ValidationFix />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: WK_TR['3_4'] })}
        />

        {/* WK4 — Impact + Scope + Close */}
        <TransitionSeries.Sequence durationInFrames={WK_FRAMES.impactClose}>
          <WK6_ImpactClose />
        </TransitionSeries.Sequence>
      </TransitionSeries>

      {/* Global progress bar */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0,
        width: `${(frame / WK_TOTAL_FRAMES) * 100}%`,
        height: 3, background: C.accent, zIndex: 100,
      }} />
    </AbsoluteFill>
  );
};
