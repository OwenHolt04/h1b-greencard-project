import { useEffect, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useDemo } from '../context/DemoContext';
import SceneCurrentState from './SceneCurrentState';
import SceneSingleSource from './SceneSingleSource';
import SceneSmartIntake from './SceneSmartIntake';
import ScenePreSubmission from './ScenePreSubmission';
import SceneImpact from './SceneImpact';

const scenes = [
  { component: SceneCurrentState, label: 'Today' },
  { component: SceneSingleSource, label: 'Case Record' },
  { component: SceneSmartIntake, label: 'Smart Intake' },
  { component: ScenePreSubmission, label: 'Validation' },
  { component: SceneImpact, label: 'Impact' },
];

const variants = {
  enter: (dir) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir > 0 ? -80 : 80, opacity: 0 }),
};

export default function PresentationShell() {
  const { currentScene, nextScene, prevScene, goToScene, setPresentationMode, resetDemo } = useDemo();
  const [direction, setDirection] = useState(0);

  const handleNext = useCallback(() => {
    setDirection(1);
    nextScene();
  }, [nextScene]);

  const handlePrev = useCallback(() => {
    setDirection(-1);
    prevScene();
  }, [prevScene]);

  const handleGoTo = useCallback((i) => {
    setDirection(i > currentScene ? 1 : -1);
    goToScene(i);
  }, [currentScene, goToScene]);

  const handleExit = useCallback(() => {
    setPresentationMode(false);
  }, [setPresentationMode]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e) => {
      // Don't intercept keys when user is typing in an input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
        if (e.target.tagName === 'BUTTON') return;
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'Escape') {
        handleExit();
      } else if (e.key >= '1' && e.key <= String(scenes.length)) {
        setDirection(parseInt(e.key) - 1 > currentScene ? 1 : -1);
        goToScene(parseInt(e.key) - 1);
      } else if (e.key === 'r' || e.key === 'R') {
        resetDemo();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleNext, handlePrev, handleExit, goToScene, currentScene, resetDemo]);

  const Scene = scenes[currentScene].component;

  return (
    <div className="h-screen w-screen overflow-hidden relative">
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentScene}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
          className="h-screen w-screen"
        >
          <Scene />
        </motion.div>
      </AnimatePresence>

      {/* Bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3 pointer-events-none bg-gradient-to-t from-white/60 to-transparent">
        <button
          onClick={handleExit}
          className="flex items-center gap-1.5 pointer-events-auto opacity-40 hover:opacity-70 transition-opacity cursor-pointer"
          title="Exit presentation (Esc)"
        >
          <div className="w-5 h-5 rounded bg-navy-900 flex items-center justify-center">
            <span className="text-white font-bold text-[9px]">CB</span>
          </div>
          <span className="text-navy-900 text-[11px] font-medium">CaseBridge</span>
        </button>

        <div className="flex items-center gap-2 pointer-events-auto">
          {scenes.map((s, i) => (
            <button
              key={i}
              onClick={() => handleGoTo(i)}
              className={`rounded-full transition-all duration-300 cursor-pointer ${
                i === currentScene
                  ? 'w-6 h-2 bg-navy-900'
                  : i < currentScene
                  ? 'w-2 h-2 bg-navy-900/40'
                  : 'w-2 h-2 bg-slate-300'
              }`}
              title={s.label}
            />
          ))}
        </div>

        <span className="text-[11px] text-slate-400 font-medium tabular-nums">
          {currentScene + 1} / {scenes.length}
        </span>
      </div>

      {currentScene === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          className="fixed bottom-12 left-1/2 -translate-x-1/2 text-[11px] text-slate-400 pointer-events-none"
        >
          Arrow keys or click dots to navigate &middot; Esc to exit
        </motion.div>
      )}
    </div>
  );
}
