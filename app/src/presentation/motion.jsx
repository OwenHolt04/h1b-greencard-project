// ============================================================================
// Presentation-Mode Motion Primitives
// Based on forensic animation audit patterns (Doss discipline + Lovart modularity)
// ============================================================================

import { motion } from 'framer-motion';

const EASE = [0.4, 0, 0.2, 1];

// ─── Pattern 3: Section Shell Expand / Settle ─────────────────────────────────
// Baseline scene-entry language. Content settles onto the stage from a slight
// scale-down + upward drift. Used as the outermost wrapper for every scene.
export function SceneShell({ children, className = '', maxWidth = 'max-w-3xl', delay = 0 }) {
  return (
    <motion.div
      initial={{ scale: 0.985, y: 24, opacity: 0 }}
      animate={{ scale: 1, y: 0, opacity: 1 }}
      transition={{ duration: 0.55, delay, ease: EASE }}
      className={`${maxWidth} w-full mx-auto my-auto py-8 ${className}`}
    >
      {children}
    </motion.div>
  );
}

// ─── Pattern 8: Viewport Stagger System ───────────────────────────────────────
// Low-noise reveal for supporting modules. Children enter with stagger.
export function StaggerGroup({ children, className = '', stagger = 0.08, delay = 0.2 }) {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className = '' }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 16, scale: 0.985 },
        show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35, ease: EASE } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Pattern 2: Masked Heading Reveal ─────────────────────────────────────────
// Overflow-hidden text reveal for chapter titles. Authoritative entry.
export function MaskedHeading({ children, className = '', delay = 0 }) {
  return (
    <div className="overflow-hidden">
      <motion.div
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.55, delay, ease: EASE }}
        className={className}
      >
        {children}
      </motion.div>
    </div>
  );
}

// ─── Focal Card ───────────────────────────────────────────────────────────────
// The dominant card in a scene. Elevated entry with scale + shadow.
export function FocalCard({ children, className = '', delay = 0 }) {
  return (
    <motion.div
      initial={{ scale: 0.96, opacity: 0, y: 12 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: EASE }}
      className={`bg-white rounded-2xl border border-slate-200/80 shadow-lg ${className}`}
    >
      {children}
    </motion.div>
  );
}

// ─── Supporting Module ────────────────────────────────────────────────────────
// Secondary card near the hero. Lighter entry, smaller shadow.
export function SupportingModule({ children, className = '', delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay, ease: EASE }}
      className={`bg-white rounded-xl border border-slate-200/80 shadow-sm ${className}`}
    >
      {children}
    </motion.div>
  );
}
