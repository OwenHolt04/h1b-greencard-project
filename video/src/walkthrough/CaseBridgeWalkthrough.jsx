import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { WK_FRAMES, WK_TR, WK_TOTAL_FRAMES } from './shared';
import { C } from '../lib/constants';

import { WK1_SharedRecord } from './WK1_SharedRecord';
import { WK2_SmartIntake } from './WK2_SmartIntake';
import { WK3_ValidationQuick } from './WK3_ValidationQuick';
import { WK4_RolePerspectivesClose } from './WK4_RolePerspectivesClose';

/**
 * CaseBridge Walkthrough — Single continuous script-aligned video
 *
 * 4 segments (~1:38 total):
 *   WK1 (14s): Shared case record overview — SingleSource screen
 *   WK2 (18s): Smart Intake — form + sync
 *   WK3  (7s): Validation quick beat — scan + issues + RFE
 *   WK4 (60s): Role perspectives (Applicant→Employer→Attorney) + Close
 */
export const CaseBridgeWalkthrough = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ background: C.navy900 }}>
      <TransitionSeries>
        {/* WK1 — Shared Case Record */}
        <TransitionSeries.Sequence durationInFrames={WK_FRAMES.sharedRecord}>
          <WK1_SharedRecord />
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

        {/* WK3 — Validation Quick Beat */}
        <TransitionSeries.Sequence durationInFrames={WK_FRAMES.validationQuick}>
          <WK3_ValidationQuick />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: WK_TR['3_4'] })}
        />

        {/* WK4 — Role Perspectives + Close */}
        <TransitionSeries.Sequence durationInFrames={WK_FRAMES.rolePerspectives}>
          <WK4_RolePerspectivesClose />
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
