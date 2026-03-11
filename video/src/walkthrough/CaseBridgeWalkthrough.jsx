import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { WK_FRAMES, WK_TR, WK_TOTAL_FRAMES } from './shared';
import { C } from '../lib/constants';

import { WK1_DashboardReveal } from './WK1_DashboardReveal';
import { WK2_SmartIntake } from './WK2_SmartIntake';
import { WK3_ValidationFix } from './WK3_ValidationFix';
import { WK4_PlainLanguage } from './WK4_PlainLanguage';
import { WK5_StakeholderDeadline } from './WK5_StakeholderDeadline';
import { WK6_ImpactClose } from './WK6_ImpactClose';

/**
 * CaseBridge Walkthrough — Website-Driven Branch
 *
 * Alternate composition: polished guided website walkthrough
 * with cursor choreography, camera zooming, and script-synced beats.
 *
 * 6 scenes, ~2:12 at 30fps
 *
 * Scene map:
 *   WK1 (24s): Current State → Dashboard Reveal
 *   WK2 (22s): Smart Intake + Sync + Checklist
 *   WK3 (24s): Validation + Fix + Propagation
 *   WK4 (20s): Plain Language + Chatbot
 *   WK5 (22s): Employer + Attorney Views + Deadline
 *   WK6 (24s): Impact + Scope + Close
 */
export const CaseBridgeWalkthrough = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ background: C.navy900 }}>
      <TransitionSeries>
        {/* WK1 — Dashboard Reveal */}
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

        {/* WK3 — Validation + Fix */}
        <TransitionSeries.Sequence durationInFrames={WK_FRAMES.validationFix}>
          <WK3_ValidationFix />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: WK_TR['3_4'] })}
        />

        {/* WK4 — Plain Language */}
        <TransitionSeries.Sequence durationInFrames={WK_FRAMES.plainLanguage}>
          <WK4_PlainLanguage />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: WK_TR['4_5'] })}
        />

        {/* WK5 — Stakeholder Views + Deadline */}
        <TransitionSeries.Sequence durationInFrames={WK_FRAMES.stakeholderDeadline}>
          <WK5_StakeholderDeadline />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: WK_TR['5_6'] })}
        />

        {/* WK6 — Impact + Scope + Close */}
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
