import { motion } from 'framer-motion';
import { useDemo } from '../context/DemoContext';
import { solvesDirect, requiresReform, metrics, scopeNote } from '../data/mockData';
import {
  CheckCircle, XCircle, ArrowRight, TrendingDown, Info,
  Shield, BarChart3, Lightbulb
} from 'lucide-react';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function Impact() {
  const { navigate } = useDemo();
  const metricEntries = Object.values(metrics);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="max-w-6xl mx-auto px-6 py-6"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 mb-2">
          System Impact + Scope
        </h1>
        <p className="text-slate-500 text-base max-w-2xl mx-auto">
          What this platform changes directly — and what still requires broader reform.
        </p>
      </div>

      {/* Metrics Strip */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8"
      >
        {metricEntries.map((m) => (
          <motion.div
            key={m.label}
            variants={item}
            className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-4 text-center"
          >
            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">{m.label}</p>
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <span className="text-sm text-slate-400 line-through">{m.before}</span>
              <ArrowRight className="w-3 h-3 text-slate-300" />
              <span className="text-xl font-bold text-green-700">{m.after}</span>
            </div>
            <span className="text-xs font-semibold text-green-600">{m.change}</span>
          </motion.div>
        ))}
      </motion.div>

      {/* Two-column comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* What Portal Solves */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="bg-white rounded-xl border border-green-200/60 shadow-sm overflow-hidden"
        >
          <div className="px-5 py-4 bg-green-50/50 border-b border-green-100 flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-600" />
            <h2 className="text-lg font-semibold text-green-900">What CaseBridge Solves</h2>
          </div>
          <div className="p-5 space-y-4">
            {solvesDirect.map((s, i) => (
              <motion.div key={i} variants={item} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-slate-900">{s.title}</p>
                  <p className="text-sm text-slate-500 leading-relaxed">{s.detail}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* What Requires Reform */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden"
        >
          <div className="px-5 py-4 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-slate-500" />
            <h2 className="text-lg font-semibold text-slate-700">Requires Broader Reform</h2>
          </div>
          <div className="p-5 space-y-4">
            {requiresReform.map((r, i) => (
              <motion.div key={i} variants={item} className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-slate-300 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-slate-600">{r.title}</p>
                  <p className="text-sm text-slate-400 leading-relaxed">{r.detail}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Scope Statement */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        className="bg-navy-900 rounded-xl p-8 text-center mb-8"
      >
        <Lightbulb className="w-6 h-6 text-accent mx-auto mb-3 drop-shadow-sm" />
        <p className="font-serif text-2xl md:text-3xl text-white font-semibold leading-relaxed max-w-3xl mx-auto mb-3">
          "A better process, even before broader reform."
        </p>
        <p className="text-slate-300 text-base max-w-2xl mx-auto leading-relaxed mb-4">
          {scopeNote}
        </p>
        <p className="text-accent text-sm font-medium">
          For Krishna: no missed extension, no RFE from a hyphen, full case visibility after years of waiting.
        </p>
      </motion.div>

      {/* How It Works Summary */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-6"
      >
        <h3 className="text-base font-semibold text-slate-900 mb-4 text-center">The CaseBridge Approach</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-2 text-sm font-bold">1</div>
            <p className="text-sm font-semibold text-slate-800 mb-1">Enter Once</p>
            <p className="text-sm text-slate-500">Shared intake populates 6+ forms automatically, eliminating re-keying errors.</p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-2 text-sm font-bold">2</div>
            <p className="text-sm font-semibold text-slate-800 mb-1">Validate Early</p>
            <p className="text-sm text-slate-500">Pre-submission checks catch contradictions that would surface months later as RFEs.</p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center mx-auto mb-2 text-sm font-bold">3</div>
            <p className="text-sm font-semibold text-slate-800 mb-1">Stay Aligned</p>
            <p className="text-sm text-slate-500">Every stakeholder sees the same case from their perspective — no separate truths.</p>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 text-center">
          <button
            onClick={() => navigate('overview')}
            className="text-sm font-semibold text-navy-900 hover:text-navy-700 transition-colors cursor-pointer inline-flex items-center gap-1"
          >
            Back to Overview <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
