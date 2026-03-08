import React from 'react';
import { Composition, Folder } from 'remotion';
import { CaseBridgeDemo } from './CaseBridgeDemo';
import { TOTAL_FRAMES, FPS, BEAT_FRAMES, TRANSITION_STANDARD } from './lib/constants';

// --- Individual beat compositions for preview/iteration ---
import { Beat1_CurrentState } from './scenes/Beat1_CurrentState';
import { Beat2_Overview } from './scenes/Beat2_Overview';
import { Beat3_SmartIntake } from './scenes/Beat3_SmartIntake';
import { Beat4_Validation } from './scenes/Beat4_Validation';
import { Beat5_Fix } from './scenes/Beat5_Fix';
import { Beat6_RoleSwitcher } from './scenes/Beat6_RoleSwitcher';
import { Beat7_ScopeClarity } from './scenes/Beat7_ScopeClarity';
import { Beat8_Close } from './scenes/Beat8_Close';

export const RemotionRoot = () => {
  return (
    <>
      {/* Main composition — full demo */}
      <Composition
        id="CaseBridgeDemo"
        component={CaseBridgeDemo}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={1920}
        height={1080}
      />

      {/* Individual beats for preview and iteration */}
      <Folder name="Beats">
        <Composition id="Beat1-CurrentState" component={Beat1_CurrentState} durationInFrames={BEAT_FRAMES.currentState} fps={FPS} width={1920} height={1080} />
        <Composition id="Beat2-Overview" component={Beat2_Overview} durationInFrames={BEAT_FRAMES.overview} fps={FPS} width={1920} height={1080} />
        <Composition id="Beat3-SmartIntake" component={Beat3_SmartIntake} durationInFrames={BEAT_FRAMES.smartIntake} fps={FPS} width={1920} height={1080} />
        <Composition id="Beat4-Validation" component={Beat4_Validation} durationInFrames={BEAT_FRAMES.validation} fps={FPS} width={1920} height={1080} />
        <Composition id="Beat5-Fix" component={Beat5_Fix} durationInFrames={BEAT_FRAMES.fix} fps={FPS} width={1920} height={1080} />
        <Composition id="Beat6-RoleSwitcher" component={Beat6_RoleSwitcher} durationInFrames={BEAT_FRAMES.roleSwitcher} fps={FPS} width={1920} height={1080} />
        <Composition id="Beat7-ScopeClarity" component={Beat7_ScopeClarity} durationInFrames={BEAT_FRAMES.scopeClarity} fps={FPS} width={1920} height={1080} />
        <Composition id="Beat8-Close" component={Beat8_Close} durationInFrames={BEAT_FRAMES.close} fps={FPS} width={1920} height={1080} />
      </Folder>
    </>
  );
};
