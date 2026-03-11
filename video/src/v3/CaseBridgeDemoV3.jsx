import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { V3_FRAMES, V3_TR, V3_TOTAL_FRAMES, T } from './theme';

import { V3S1_Dashboard } from './V3S1_Dashboard';
import { V3S2_EnterOnce } from './V3S2_EnterOnce';
import { V3S3_PlainLanguage } from './V3S3_PlainLanguage';
import { V3S4_StakeholderViews } from './V3S4_StakeholderViews';
import { V3S5_DeadlineAlert } from './V3S5_DeadlineAlert';
import { V3S6_Close } from './V3S6_Close';

/**
 * CaseBridge Demo V3 — Script-Aligned, Website-Themed
 *
 * 6 scenes following the presentation script (docs/script.md):
 *   S1: Dashboard (14s) — "One unified dashboard"
 *   S2: Enter Once (16s) — "Enter data once, sync across 6 forms"
 *   S3: Plain Language (16s) — "Plain-language guidance + chatbot"
 *   S4: Stakeholder Views (18s) — "Employer deadlines, Attorney blockers"
 *   S5: Deadline Alert (12s) — "90 days out"
 *   S6: Close (14s) — "Avoidable errors → better coordination"
 *
 * Total: ~1:27 at 30fps (cream/blue website theme)
 */
export const CaseBridgeDemoV3 = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ background: T.bg }}>
      <TransitionSeries>
        {/* S1 — Dashboard */}
        <TransitionSeries.Sequence durationInFrames={V3_FRAMES.dashboard}>
          <V3S1_Dashboard />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: V3_TR['1_2'] })}
        />

        {/* S2 — Enter Once */}
        <TransitionSeries.Sequence durationInFrames={V3_FRAMES.enterOnce}>
          <V3S2_EnterOnce />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: V3_TR['2_3'] })}
        />

        {/* S3 — Plain Language */}
        <TransitionSeries.Sequence durationInFrames={V3_FRAMES.plainLanguage}>
          <V3S3_PlainLanguage />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: V3_TR['3_4'] })}
        />

        {/* S4 — Stakeholder Views */}
        <TransitionSeries.Sequence durationInFrames={V3_FRAMES.stakeholders}>
          <V3S4_StakeholderViews />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: V3_TR['4_5'] })}
        />

        {/* S5 — Deadline Alert */}
        <TransitionSeries.Sequence durationInFrames={V3_FRAMES.deadline}>
          <V3S5_DeadlineAlert />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: V3_TR['5_6'] })}
        />

        {/* S6 — Close */}
        <TransitionSeries.Sequence durationInFrames={V3_FRAMES.close}>
          <V3S6_Close />
        </TransitionSeries.Sequence>
      </TransitionSeries>

      {/* Subtle progress bar */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0,
        width: `${(frame / V3_TOTAL_FRAMES) * 100}%`,
        height: 3, background: T.navy, opacity: 0.15, zIndex: 100,
      }} />
    </AbsoluteFill>
  );
};
