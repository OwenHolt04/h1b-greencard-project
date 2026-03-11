import { motion, AnimatePresence } from 'framer-motion';
import { Search, CheckCircle, AlertTriangle, AlertCircle, Info, Loader2, Zap, ClipboardCheck, Circle } from 'lucide-react';
import { useDemo } from '../context/DemoContext';
import ReadinessScore from '../components/ReadinessScore';
import { SceneShell, MaskedHeading, FocalCard } from './motion';
import { validationIssues, documentChecklist } from '../data/mockData';

const severityConfig = {
  high: { label: 'High', color: 'bg-red-100 text-red-700', icon: AlertTriangle, iconColor: 'text-red-500' },
  medium: { label: 'Medium', color: 'bg-amber-100 text-amber-700', icon: AlertCircle, iconColor: 'text-amber-500' },
  low: { label: 'Low', color: 'bg-blue-100 text-blue-700', icon: Info, iconColor: 'text-blue-500' },
};

// Pre-compute I-485 checklist counts from mock data
const i485Stage = documentChecklist.find((s) => s.stageNumber === 4);
const i485Docs = i485Stage?.documents || [];
const doneCount = i485Docs.filter((d) => d.status === 'done').length;
const flaggedCount = i485Docs.filter((d) => d.status === 'flagged').length;
const missingCount = i485Docs.filter((d) => d.status === 'missing').length;
const pendingCount = i485Docs.filter((d) => d.status === 'pending').length;
const totalCount = i485Docs.length;

const actionItems = i485Docs.filter((d) => d.status !== 'done' && d.status !== 'na');

// Stage summary for all 4 stages
const stageSummary = documentChecklist.map((stage) => {
  const total = stage.documents.filter((d) => d.status !== 'na').length;
  const done = stage.documents.filter((d) => d.status === 'done').length;
  return {
    label: stage.stage.split('—')[0].trim(),
    done,
    total,
    complete: stage.complete,
    active: !stage.complete,
  };
});

export default function SceneValidation() {
  const {
    validationRun, validationRunning, issues,
    employerNameFixed, readinessScore, runValidation,
    resolveIssue, unresolvedCount,
  } = useDemo();

  const heroIssue = validationIssues.find((i) => i.id === 'employer-name');
  const heroResolved = issues['employer-name'];
  const secondaryIssues = validationIssues.filter((i) => i.id !== 'employer-name');

  return (
    <div className="h-screen w-full bg-surface flex flex-col items-center px-12 overflow-y-auto">
      <SceneShell maxWidth="max-w-3xl">
        {/* Scene heading */}
        <MaskedHeading className="text-center mb-4">
          <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">Validation Engine</p>
          <h2 className="font-serif text-3xl font-bold text-navy-900">Catch Issues Before Filing</h2>
          <p className="text-sm text-slate-500 mt-1">Pre-submission checks catch contradictions before they become RFEs.</p>
        </MaskedHeading>

        {/* Hero cluster: Score + Validation trigger */}
        <FocalCard className="p-5 mb-3" delay={0.1}>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-navy-900 mb-1">Filing Readiness</h3>
              {!validationRun && !validationRunning && (
                <>
                  <p className="text-xs text-slate-500 mb-3">Run pre-flight validation to check cross-form consistency.</p>
                  <button
                    onClick={runValidation}
                    className="flex items-center gap-2 bg-navy-900 hover:bg-navy-800 text-white font-semibold py-2.5 px-5 rounded-lg transition-colors cursor-pointer text-sm"
                  >
                    <Search className="w-4 h-4" />
                    Run Pre-Flight Validation
                  </button>
                </>
              )}
              {validationRunning && (
                <div className="inline-flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Analyzing cross-form consistency...
                </div>
              )}
              {validationRun && !validationRunning && (
                <div className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
                  unresolvedCount === 0 ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
                }`}>
                  {unresolvedCount === 0 ? (
                    <><CheckCircle className="w-3 h-3" /> Ready for attorney review</>
                  ) : (
                    <><AlertTriangle className="w-3 h-3" /> {unresolvedCount} issue{unresolvedCount > 1 ? 's' : ''} found</>
                  )}
                </div>
              )}
            </div>
            <div className="ml-6">
              {validationRun || validationRunning ? (
                <ReadinessScore score={readinessScore} size={88} strokeWidth={6} />
              ) : (
                <svg width={88} height={88}>
                  <circle cx={44} cy={44} r={38} fill="none" stroke="#e2e8f0" strokeWidth={6} />
                  <text x={44} y={42} textAnchor="middle" dominantBaseline="central" style={{ fontSize: 24, fill: '#cbd5e1' }} className="font-sans font-bold">?</text>
                  <text x={44} y={60} textAnchor="middle" dominantBaseline="central" style={{ fontSize: 10, fill: '#94a3b8' }} className="font-sans">/ 100</text>
                </svg>
              )}
            </div>
          </div>
        </FocalCard>

        {/* Issues — revealed after validation */}
        <AnimatePresence>
          {validationRun && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
              className="space-y-3"
            >
              {/* Hero Issue: Employer Name — Before/After swap */}
              <div className={`rounded-2xl border-2 p-4 transition-all duration-500 ${
                heroResolved
                  ? 'bg-green-50/50 border-green-300'
                  : 'bg-amber-50/50 border-amber-300'
              }`}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {heroResolved ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-amber-500" />
                    )}
                    <h4 className={`text-base font-semibold ${heroResolved ? 'text-green-800 line-through' : 'text-navy-900'}`}>
                      {heroIssue.title}
                    </h4>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    heroResolved ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {heroResolved ? 'Fixed' : 'Medium'}
                  </span>
                </div>

                {/* Before/After value display */}
                <div className="flex items-center gap-3 mb-3">
                  <div className={`flex-1 rounded-lg px-3 py-2 text-sm font-mono ${
                    heroResolved ? 'bg-white/60 text-slate-400 line-through' : 'bg-white text-amber-800'
                  }`}>
                    &ldquo;{heroIssue.currentValue}&rdquo;
                  </div>
                  <motion.span
                    className="text-slate-400 text-lg"
                    animate={{ x: heroResolved ? 0 : [0, 3, 0] }}
                    transition={{ repeat: heroResolved ? 0 : Infinity, duration: 1.5 }}
                  >
                    &rarr;
                  </motion.span>
                  <div className={`flex-1 rounded-lg px-3 py-2 text-sm font-mono ${
                    heroResolved ? 'bg-green-100 text-green-800 font-semibold' : 'bg-slate-50 text-slate-400'
                  }`}>
                    &ldquo;{heroIssue.correctedValue}&rdquo;
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-slate-400">Affects:</span>
                    {heroIssue.affectedForms.map((f) => (
                      <span key={f} className="text-[10px] font-medium text-slate-600 bg-white/80 px-1.5 py-0.5 rounded">{f}</span>
                    ))}
                  </div>
                  {!heroResolved && (
                    <button
                      onClick={() => resolveIssue('employer-name')}
                      className="flex items-center gap-1.5 bg-navy-900 hover:bg-navy-800 text-white font-semibold py-1.5 px-4 rounded-lg transition-colors cursor-pointer text-sm"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      Fix: Standardize
                    </button>
                  )}
                </div>
              </div>

              {/* Secondary issues + Filing Checklist — 3-column row */}
              <div className="grid grid-cols-3 gap-2.5">
                {secondaryIssues.map((issue) => {
                  const isResolved = issues[issue.id];
                  const config = severityConfig[issue.severity];
                  const Icon = config.icon;
                  return (
                    <div
                      key={issue.id}
                      className={`bg-white rounded-xl border p-3 transition-all duration-300 ${
                        isResolved ? 'border-green-200 opacity-50' : 'border-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        {isResolved ? (
                          <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                        ) : (
                          <Icon className={`w-3.5 h-3.5 ${config.iconColor}`} />
                        )}
                        <span className={`text-xs font-semibold ${isResolved ? 'text-green-700 line-through' : 'text-navy-900'}`}>
                          {issue.title}
                        </span>
                      </div>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                        isResolved ? 'bg-green-100 text-green-700' : config.color
                      }`}>
                        {isResolved ? 'Fixed' : config.label}
                      </span>
                      <p className="text-[10px] text-slate-500 leading-relaxed mt-1.5">{issue.plainDescription}</p>
                    </div>
                  );
                })}

                {/* Filing Checklist — compact inline */}
                <div className="bg-white rounded-xl border border-navy-900/20 p-3">
                  <div className="flex items-center gap-1.5 mb-2">
                    <ClipboardCheck className="w-3.5 h-3.5 text-navy-900" />
                    <span className="text-xs font-semibold text-navy-900">Filing Checklist</span>
                  </div>
                  <p className="text-lg font-bold text-navy-900 mb-1">{doneCount} / {totalCount}</p>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden flex mb-2">
                    <div className="bg-green-500 h-full rounded-l-full" style={{ width: `${(doneCount / totalCount) * 100}%` }} />
                    <div className="bg-amber-500 h-full" style={{ width: `${(flaggedCount / totalCount) * 100}%` }} />
                    <div className="bg-red-500 h-full" style={{ width: `${(missingCount / totalCount) * 100}%` }} />
                    <div className="bg-slate-300 h-full rounded-r-full" style={{ width: `${(pendingCount / totalCount) * 100}%` }} />
                  </div>
                  <div className="space-y-1">
                    {actionItems.map((doc, i) => {
                      const sc = {
                        flagged: { color: 'bg-amber-500', label: 'Flagged' },
                        missing: { color: 'bg-red-500', label: 'Missing' },
                        pending: { color: 'bg-slate-300', label: 'Pending' },
                      }[doc.status] || { color: 'bg-slate-300', label: '—' };
                      return (
                        <div key={i} className="flex items-center gap-1.5 text-[10px]">
                          <span className={`w-1.5 h-1.5 rounded-full ${sc.color} flex-shrink-0`} />
                          <span className="text-slate-600 truncate">{doc.name.length > 28 ? doc.name.slice(0, 28) + '…' : doc.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </SceneShell>
    </div>
  );
}
