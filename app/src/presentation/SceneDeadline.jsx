import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, ShieldCheck, AlertTriangle, CheckCircle } from 'lucide-react';
import { SceneShell, MaskedHeading } from './motion';

export default function SceneDeadline() {
  const [managed, setManaged] = useState(false);

  return (
    <div className="h-screen w-full bg-gradient-to-br from-amber-50 to-orange-50 flex flex-col justify-center items-center px-12">
      <SceneShell maxWidth="max-w-2xl">
        {/* Icon + label */}
        <MaskedHeading className="text-center mb-5">
          <div className="flex justify-center mb-3">
            <motion.div
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-500 ${
                managed ? 'bg-green-100' : 'bg-amber-100'
              }`}
              animate={{ scale: managed ? [1, 1.1, 1] : 1 }}
              transition={{ duration: 0.3 }}
            >
              {managed ? (
                <ShieldCheck className="w-6 h-6 text-green-600" />
              ) : (
                <ShieldAlert className="w-6 h-6 text-amber-600" />
              )}
            </motion.div>
          </div>
          <p className={`text-sm font-semibold tracking-wider uppercase transition-colors duration-500 ${
            managed ? 'text-green-600' : 'text-amber-600'
          }`}>
            Deadline Protection
          </p>
        </MaskedHeading>

        {/* Hero number */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
          className="text-center mb-4"
        >
          <span className={`text-8xl md:text-9xl font-bold leading-none tracking-tight transition-colors duration-500 ${
            managed ? 'text-green-700' : 'text-amber-700'
          }`}>
            102
          </span>
          <p className={`text-xl font-medium mt-2 transition-colors duration-500 ${
            managed ? 'text-green-600' : 'text-amber-600'
          }`}>
            days until H-1B status expires
          </p>
        </motion.div>

        {/* Progress bar — tight to hero */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="max-w-sm mx-auto mb-5"
        >
          <div className="flex items-center gap-2.5">
            <span className="text-[10px] text-amber-600 font-medium whitespace-nowrap">Today</span>
            <div className="flex-1 h-2.5 bg-amber-200/50 rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full transition-colors duration-500 ${managed ? 'bg-green-500' : 'bg-amber-500'}`}
                initial={{ width: 0 }}
                animate={{ width: `${((365 - 102) / 365) * 100}%` }}
                transition={{ delay: 0.5, duration: 0.8, ease: 'easeOut' }}
              />
            </div>
            <span className="text-[10px] text-amber-600 font-semibold whitespace-nowrap">Expiry</span>
          </div>
        </motion.div>

        {/* Before/After State Swap */}
        <AnimatePresence mode="wait">
          {!managed ? (
            <motion.div
              key="at-risk"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="text-center mb-5"
            >
              <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 font-semibold text-sm px-4 py-2 rounded-full mb-4">
                <AlertTriangle className="w-4 h-4" />
                Without CaseBridge: Manual tracking, missed deadlines, rush fees
              </div>
              <div className="flex justify-center">
                <button
                  onClick={() => setManaged(true)}
                  className="flex items-center gap-2 bg-navy-900 hover:bg-navy-800 text-white font-semibold py-2.5 px-5 rounded-lg transition-colors cursor-pointer text-sm"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Activate Auto-Extension
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="managed"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="text-center mb-5"
            >
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 font-semibold text-sm px-4 py-2 rounded-full">
                <CheckCircle className="w-4 h-4" />
                Auto-triggered at 90 days. No manual tracking needed.
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Compact stat strip */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="grid grid-cols-3 gap-3"
        >
          {[
            { label: 'Auto-Trigger', value: 'March 17, 2026', detail: '90 days before expiry' },
            { label: 'Proactive Cost', value: '$2,500–4,000', detail: 'vs $5,000+ rush' },
            { label: 'HR Owner', value: 'Rachel Torres', detail: 'Auto-notified by system' },
          ].map((stat) => (
            <div key={stat.label} className={`rounded-xl p-3.5 border transition-colors duration-500 ${
              managed
                ? 'bg-green-50/60 border-green-200'
                : 'bg-white/60 border-amber-200'
            }`}>
              <p className={`text-[10px] font-semibold uppercase tracking-wider mb-0.5 transition-colors duration-500 ${
                managed ? 'text-green-600' : 'text-amber-600'
              }`}>{stat.label}</p>
              <p className={`text-sm font-bold transition-colors duration-500 ${
                managed ? 'text-green-900' : 'text-amber-900'
              }`}>{stat.value}</p>
              <p className={`text-[10px] mt-0.5 transition-colors duration-500 ${
                managed ? 'text-green-700' : 'text-amber-700'
              }`}>{stat.detail}</p>
            </div>
          ))}
        </motion.div>
      </SceneShell>
    </div>
  );
}
