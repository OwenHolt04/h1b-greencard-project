import React from 'react';
import { Composition, Folder } from 'remotion';
import { CaseBridgeDemo } from './CaseBridgeDemo';
import { TOTAL_FRAMES, FPS, SCENE_FRAMES } from './lib/constants';

// --- Individual scene compositions for preview/iteration ---
import { Scene1_CurrentStateChaos } from './scenes/Scene1_CurrentStateChaos';
import { Scene2_PlatformReveal } from './scenes/Scene2_PlatformReveal';
import { Scene3_CaseWorkspace } from './scenes/Scene3_CaseWorkspace';
import { Scene4_IntakeSync } from './scenes/Scene4_IntakeSync';
import { Scene5_ValidationMoment } from './scenes/Scene5_ValidationMoment';
import { Scene6_RoleSwitch } from './scenes/Scene6_RoleSwitch';
import { Scene7_DeadlineProtection } from './scenes/Scene7_DeadlineProtection';
import { Scene8_ScopeClarification } from './scenes/Scene8_ScopeClarification';
import { Scene9_FinalImpact } from './scenes/Scene9_FinalImpact';

export const RemotionRoot = () => {
  return (
    <>
      {/* Main composition — full narrative demo */}
      <Composition
        id="CaseBridgeDemo"
        component={CaseBridgeDemo}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={1920}
        height={1080}
      />

      {/* Individual scenes for preview and iteration */}
      <Folder name="Scenes">
        <Composition id="Scene1-CurrentStateChaos" component={Scene1_CurrentStateChaos} durationInFrames={SCENE_FRAMES.currentStateChaos} fps={FPS} width={1920} height={1080} />
        <Composition id="Scene2-PlatformReveal" component={Scene2_PlatformReveal} durationInFrames={SCENE_FRAMES.platformReveal} fps={FPS} width={1920} height={1080} />
        <Composition id="Scene3-CaseWorkspace" component={Scene3_CaseWorkspace} durationInFrames={SCENE_FRAMES.caseWorkspace} fps={FPS} width={1920} height={1080} />
        <Composition id="Scene4-IntakeSync" component={Scene4_IntakeSync} durationInFrames={SCENE_FRAMES.intakeSync} fps={FPS} width={1920} height={1080} />
        <Composition id="Scene5-ValidationMoment" component={Scene5_ValidationMoment} durationInFrames={SCENE_FRAMES.validationMoment} fps={FPS} width={1920} height={1080} />
        <Composition id="Scene6-RoleSwitch" component={Scene6_RoleSwitch} durationInFrames={SCENE_FRAMES.roleSwitch} fps={FPS} width={1920} height={1080} />
        <Composition id="Scene7-DeadlineProtection" component={Scene7_DeadlineProtection} durationInFrames={SCENE_FRAMES.deadlineProtection} fps={FPS} width={1920} height={1080} />
        <Composition id="Scene8-ScopeClarification" component={Scene8_ScopeClarification} durationInFrames={SCENE_FRAMES.scopeClarification} fps={FPS} width={1920} height={1080} />
        <Composition id="Scene9-FinalImpact" component={Scene9_FinalImpact} durationInFrames={SCENE_FRAMES.finalImpact} fps={FPS} width={1920} height={1080} />
      </Folder>
    </>
  );
};
