import { motion } from 'framer-motion';
import { CheckCircle, XCircle, ArrowRight, Shield, BarChart3 } from 'lucide-react';
import { SceneShell, MaskedHeading, StaggerGroup, StaggerItem } from './motion';
import { metrics, solvesDirect, requiresReform, scopeNote } from '../data/mockData';

export default function SceneImpact() {
  const metricEntries = Object.values(metrics);

  return (
    <div className="h-screen w-full bg-gradient-to-b from-surface to-white flex flex-col items-center px-10 overflow-y-auto">
      <SceneShell maxWidth="max-w-4xl">
        {/* Scene heading */}
        <MaskedHeading className="text-center mb-4">
          <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">Measurable Impact</p>
          <h2 className="font-serif text-3xl font-bold text-navy-900">Process Improvement, Not Policy Reform</h2>
        </MaskedHeading>

        {/* Metrics strip */}
        <StaggerGroup className="grid grid-cols-6 gap-2 mb-4" stagger={0.06} delay={0.15}>
          {metricEntries.map((m) => (
            <StaggerItem key={m.label}>
              <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-2.5 text-center">
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-1">{m.label}</p>
                <div className="flex items-center justify-center gap-1 mb-0.5">
                  <span className="text-[11px] text-slate-400 line-through">{m.before}</span>
                  <ArrowRight className="w-2.5 h-2.5 text-slate-300" />
                  <span className="text-lg font-bold text-green-700">{m.after}</span>
                </div>
                <span className="text-[11px] font-semibold text-green-600">{m.change}</span>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>

        {/* Two-column comparison */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {/* What Portal Solves */}
          <StaggerGroup className="bg-white rounded-xl border border-green-200/60 shadow-sm overflow-hidden" stagger={0.05} delay={0.3}>
            <div className="px-4 py-2.5 bg-green-50/50 border-b border-green-100 flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-600" />
              <h3 className="text-sm font-semibold text-green-900">What CaseBridge Solves</h3>
            </div>
            <div className="p-3.5 space-y-2">
              {solvesDirect.map((s, i) => (
                <StaggerItem key={i}>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-navy-900">{s.title}</p>
                      <p className="text-[11px] text-slate-500">{s.detail}</p>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </div>
          </StaggerGroup>

          {/* What Requires Reform */}
          <StaggerGroup className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden" stagger={0.05} delay={0.4}>
            <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-slate-500" />
              <h3 className="text-sm font-semibold text-navy-900">Requires Broader Reform</h3>
            </div>
            <div className="p-3.5 space-y-2">
              {requiresReform.map((r, i) => (
                <StaggerItem key={i}>
                  <div className="flex items-start gap-2">
                    <XCircle className="w-3.5 h-3.5 text-slate-300 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-slate-600">{r.title}</p>
                      <p className="text-[11px] text-slate-400">{r.detail}</p>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </div>
          </StaggerGroup>
        </div>

        {/* Closing block */}
        <motion.div
          initial={{ opacity: 0, y: 12, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className="bg-navy-900 rounded-xl p-5 text-center"
        >
          <p className="font-serif text-xl text-white font-semibold leading-relaxed mb-1.5">
            &ldquo;A better process, even before broader reform.&rdquo;
          </p>
          <p className="text-slate-400 text-[11px] max-w-lg mx-auto leading-relaxed mb-1.5">
            {scopeNote}
          </p>
          <p className="text-accent text-xs font-medium">
            For Krishna: no missed extension, no RFE from a hyphen, full case visibility after years of waiting.
          </p>
        </motion.div>
      </SceneShell>
    </div>
  );
}
