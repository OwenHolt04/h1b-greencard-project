import { useState, useEffect } from 'react';
import { useDemo } from '../context/DemoContext';
import { motion, AnimatePresence } from 'framer-motion';
import ReadinessScore from '../components/ReadinessScore';
import { intakeSections, formPackage, validationIssues, documentChecklist, caseAssessment, triageComparison, evidenceObjects } from '../data/mockData';
import {
  Search, CheckCircle, AlertTriangle, AlertCircle, Info,
  ArrowRight, RefreshCw, Loader2, Link2, ChevronRight, Zap,
  FileCheck, Clock, Sparkles, CircleDot, Circle, Flag, Minus,
  XCircle, Eye
} from 'lucide-react';

const severityConfig = {
  high: { label: 'High', color: 'bg-red-100 text-red-700 border-red-200', border: 'border-l-red-500', icon: AlertTriangle, iconColor: 'text-red-500' },
  medium: { label: 'Medium', color: 'bg-amber-100 text-amber-700 border-amber-200', border: 'border-l-amber-500', icon: AlertCircle, iconColor: 'text-amber-500' },
  low: { label: 'Low', color: 'bg-blue-100 text-blue-700 border-blue-200', border: 'border-l-blue-500', icon: Info, iconColor: 'text-blue-500' },
};

export default function Intake() {
  const {
    validationRun, validationRunning, issues, syncing,
    employerNameFixed, readinessScore, runValidation,
    resolveIssue, unresolvedCount, documentChecks, toggleDocument, openForm
  } = useDemo();

  const [syncingFormIds, setSyncingFormIds] = useState(new Set());
  const [syncFlashFormIds, setSyncFlashFormIds] = useState(new Set());

  // Trigger sync animation + "updated" flash on form cards when employer name is fixed
  useEffect(() => {
    if (syncing) {
      const affectedForms = new Set(['I-140', 'I-485', 'ETA-9089']);
      setSyncingFormIds(affectedForms);
      setSyncFlashFormIds(affectedForms);
      const syncTimer = setTimeout(() => setSyncingFormIds(new Set()), 1200);
      const flashTimer = setTimeout(() => setSyncFlashFormIds(new Set()), 3000);
      return () => { clearTimeout(syncTimer); clearTimeout(flashTimer); };
    }
  }, [syncing]);

  const getEmployerNameValue = () => employerNameFixed ? 'Hewlett Packard Enterprise' : 'Hewlett-Packard Enterprise';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="max-w-7xl mx-auto px-6 py-6"
    >
      {/* Screen header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">Smart Intake + Validation</h1>
          <p className="text-sm text-slate-500">Enter once. Sync across forms. Catch issues before filing.</p>
        </div>
        <div className="flex items-center gap-3">
          {validationRun && (
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
              unresolvedCount === 0
                ? 'bg-green-50 text-green-700'
                : 'bg-amber-50 text-amber-700'
            }`}>
              {unresolvedCount === 0 ? 'All issues resolved' : `${unresolvedCount} issue${unresolvedCount > 1 ? 's' : ''} remaining`}
            </span>
          )}
          {validationRun ? (
            <ReadinessScore score={readinessScore} size={52} strokeWidth={5} showLabel={false} />
          ) : (
            <div className="w-[52px] h-[52px] rounded-full border-[5px] border-slate-200 flex items-center justify-center">
              <span className="text-[13px] font-bold text-slate-300">—</span>
            </div>
          )}
        </div>
      </div>

      {/* Three-panel layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left panel: Shared Intake Data */}
        <div className="lg:col-span-4 space-y-3">
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-900">Shared Case Data</h2>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">Source of Truth</span>
            </div>

            <div className="divide-y divide-slate-100">
              {intakeSections.map((section) => (
                <div key={section.id} className="px-4 py-3">
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-2">{section.label}</p>
                  <div className="space-y-2">
                    {section.fields.map((field) => {
                      const isMismatchField = field.key === 'employerLegalName';
                      const showMismatch = isMismatchField && !employerNameFixed && validationRun;
                      const wasFixed = isMismatchField && employerNameFixed;
                      const displayValue = isMismatchField ? getEmployerNameValue() : field.value;
                      const isGapField = field.hasGap && validationRun && !issues['travel-history'];

                      return (
                        <div
                          key={field.key}
                          className={`flex items-start justify-between gap-2 py-1 px-2 rounded transition-all duration-500 ${
                            showMismatch
                              ? 'bg-amber-50 ring-1 ring-amber-200'
                              : wasFixed
                              ? 'bg-green-50 ring-1 ring-green-200'
                              : isGapField
                              ? 'bg-blue-50 ring-1 ring-blue-200'
                              : ''
                          }`}
                        >
                          <div className="min-w-0">
                            <p className="text-[11px] text-slate-400">{field.label}</p>
                            <p className={`text-[13px] font-medium ${
                              showMismatch ? 'text-amber-700' : wasFixed ? 'text-green-700' : 'text-slate-800'
                            }`}>
                              {displayValue}
                            </p>
                          </div>
                          <div className="flex items-center gap-1 flex-shrink-0 mt-1">
                            <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">
                              → {field.syncTargets.length} forms
                            </span>
                            {wasFixed && <CheckCircle className="w-3.5 h-3.5 text-green-500 ml-1" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Evidence Vault — shows one-source-many-forms reuse */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-900">Evidence Vault</h2>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">Reused across forms</span>
            </div>
            <div className="px-4 py-2 space-y-1.5">
              {evidenceObjects.map((ev, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-2 py-1.5 px-2 rounded text-[11px] ${
                    ev.status === 'missing' ? 'bg-red-50' :
                    ev.status === 'flagged' ? 'bg-amber-50' : ''
                  }`}
                >
                  {ev.status === 'collected' ? (
                    <CheckCircle className="w-3.5 h-3.5 text-green-500 mt-0.5 flex-shrink-0" />
                  ) : ev.status === 'flagged' ? (
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500 mt-0.5 flex-shrink-0" />
                  ) : (
                    <Circle className="w-3.5 h-3.5 text-red-400 mt-0.5 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className={`leading-tight ${
                      ev.status === 'collected' ? 'text-slate-600' :
                      ev.status === 'missing' ? 'text-red-700' : 'text-amber-700'
                    }`}>
                      {ev.name}
                    </p>
                    <div className="flex items-center gap-1 mt-0.5 flex-wrap">
                      <span className="text-[9px] text-slate-400">→</span>
                      {ev.reusedIn.map((form) => (
                        <span key={form} className="text-[8px] text-slate-400 bg-slate-100 px-1 py-0.5 rounded font-medium">
                          {form}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center panel: Form Package */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-900">Filing Package</h2>
              <div className="flex items-center gap-1 text-[11px] text-navy-900 font-medium">
                <Link2 className="w-3 h-3" />
                Synced from shared record
              </div>
            </div>

            <div className="p-4 grid grid-cols-2 gap-3">
              {formPackage.map((form) => {
                const isSyncing = syncingFormIds.has(form.formCode);
                const statusColor =
                  form.status === 'complete' || form.status === 'certified' || form.status === 'approved'
                    ? 'text-green-600'
                    : 'text-navy-900';
                const issueCount = validationRun
                  ? (form.formCode === 'I-485' ? (issues['employer-name'] ? 1 : 2) - (issues['travel-history'] ? 1 : 0)
                    : form.formCode === 'I-140' || form.formCode === 'ETA-9089'
                    ? (issues['employer-name'] ? 0 : 1) + (form.formCode === 'ETA-9089' && !issues['soc-wage'] ? 1 : 0)
                    : 0)
                  : 0;

                return (
                  <button
                    key={form.formCode}
                    onClick={() => openForm(form.formCode)}
                    className={`border rounded-lg p-3 transition-all duration-300 cursor-pointer hover:border-navy-900/40 hover:shadow-sm group text-left ${
                      isSyncing ? 'animate-form-sync border-accent' : 'border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[13px] font-bold text-slate-900">{form.formCode}</span>
                        <Eye className="w-3 h-3 text-slate-300 group-hover:text-navy-900 transition-colors" />
                      </div>
                      {issueCount > 0 && (
                        <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full">
                          {issueCount}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 mb-2">{form.displayName}</p>

                    {/* Completion bar */}
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full rounded-full ${
                            form.completionPercent === 100 ? 'bg-green-500' : 'bg-navy-900'
                          }`}
                          initial={{ width: 0 }}
                          animate={{ width: `${form.completionPercent}%` }}
                          transition={{ duration: 0.6, delay: 0.2 }}
                        />
                      </div>
                      <span className={`text-[11px] font-semibold ${statusColor}`}>
                        {form.completionPercent}%
                      </span>
                    </div>

                    {/* Sync indicator */}
                    <div className="mt-2 flex items-center gap-1">
                      <Link2 className={`w-2.5 h-2.5 ${isSyncing ? 'text-navy-900' : 'text-slate-300'}`} />
                      <span className="text-[11px] text-slate-400">{form.syncedFields} fields synced</span>
                    </div>

                    {/* "Updated" flash after employer name fix */}
                    {syncFlashFormIds.has(form.formCode) && (
                      <motion.div
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-1.5 flex items-center gap-1 text-[10px] font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded"
                      >
                        <CheckCircle className="w-3 h-3" />
                        Employer name updated
                      </motion.div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right panel: Validation */}
        <div className="lg:col-span-4 space-y-4">
          {/* Readiness + Validation button */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-slate-900">Filing Readiness</h2>
            </div>

            <div className="flex justify-center mb-5">
              {validationRun || validationRunning ? (
                <ReadinessScore score={readinessScore} size={110} strokeWidth={7} />
              ) : (
                <div className="flex flex-col items-center gap-1.5">
                  <svg width={110} height={110}>
                    <circle cx={55} cy={55} r={48} fill="none" stroke="#e2e8f0" strokeWidth={7} />
                    <text x={55} y={53} textAnchor="middle" dominantBaseline="central" style={{ fontSize: 30, fill: '#cbd5e1' }} className="font-sans font-bold">?</text>
                    <text x={55} y={73} textAnchor="middle" dominantBaseline="central" style={{ fontSize: 12, fill: '#94a3b8' }} className="font-sans">/ 100</text>
                  </svg>
                  <span className="text-xs font-semibold tracking-wide uppercase text-slate-400">Pending</span>
                </div>
              )}
            </div>

            {!validationRun && !validationRunning && (
              <button
                onClick={runValidation}
                className="w-full flex items-center justify-center gap-2 bg-navy-900 hover:bg-navy-800 text-white font-semibold py-3 rounded-lg transition-colors cursor-pointer"
              >
                <Search className="w-4 h-4" />
                Run Pre-Flight Validation
              </button>
            )}

            {validationRunning && (
              <div className="w-full flex items-center justify-center gap-2 bg-slate-100 text-slate-500 font-medium py-3 rounded-lg">
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing cross-form consistency...
              </div>
            )}

            {validationRun && !validationRunning && (
              <div className={`flex items-center justify-center gap-2 py-3 rounded-lg font-semibold text-sm ${
                unresolvedCount === 0
                  ? 'bg-green-50 text-green-700'
                  : 'bg-amber-50 text-amber-700'
              }`}>
                {unresolvedCount === 0 ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Ready for attorney review
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4" />
                    {unresolvedCount} issue{unresolvedCount > 1 ? 's' : ''} to resolve
                  </>
                )}
              </div>
            )}
          </div>

          {/* Validation Issues */}
          <AnimatePresence>
            {validationRun && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-3"
              >
                {validationIssues.map((issue, index) => {
                  const isResolved = issues[issue.id];
                  const config = severityConfig[issue.severity];
                  const Icon = config.icon;

                  return (
                    <motion.div
                      key={issue.id}
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.15, duration: 0.3 }}
                      className={`bg-white rounded-xl border shadow-sm overflow-hidden transition-all duration-500 ${
                        isResolved ? 'border-green-200 opacity-70' : 'border-slate-200/80'
                      }`}
                    >
                      <div className={`border-l-4 ${isResolved ? 'border-l-green-500' : config.border} p-4`}>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            {isResolved ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : (
                              <Icon className={`w-4 h-4 ${config.iconColor}`} />
                            )}
                            <h3 className={`text-[13px] font-semibold ${isResolved ? 'text-green-700 line-through' : 'text-slate-900'}`}>
                              {issue.title}
                            </h3>
                          </div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isResolved ? 'bg-green-100 text-green-700' : config.color
                          }`}>
                            {isResolved ? 'Resolved' : config.label}
                          </span>
                        </div>

                        <p className="text-[12px] text-slate-500 leading-relaxed mb-2">{issue.plainDescription}</p>

                        {/* Affected forms */}
                        <div className="flex items-center gap-1.5 mb-2">
                          <span className="text-[10px] text-slate-400">Affects:</span>
                          {issue.affectedForms.map((form) => (
                            <span key={form} className="text-[10px] font-medium text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                              {form}
                            </span>
                          ))}
                        </div>

                        {/* Fix button for employer name */}
                        {issue.fixable && !isResolved && (
                          <button
                            onClick={() => resolveIssue(issue.id)}
                            className="mt-1 flex items-center gap-1.5 text-[12px] font-semibold text-navy-900 hover:text-navy-700 transition-colors cursor-pointer"
                          >
                            <Zap className="w-3.5 h-3.5" />
                            Fix: Standardize to "{issue.correctedValue}"
                          </button>
                        )}

                        {!issue.fixable && !isResolved && (
                          <p className="text-[11px] text-slate-400 italic mt-1">
                            {issue.recommendedFix}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>

          {/* AI Triage — visual before/after comparison */}
          <AnimatePresence>
            {validationRun && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.3 }}
                className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden"
              >
                <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-navy-900" />
                  <h3 className="text-sm font-semibold text-slate-900">AI Triage</h3>
                  <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                    {caseAssessment.timeSensitivity} Priority
                  </span>
                </div>

                {/* Risk items: without vs with */}
                <div className="px-4 py-3 space-y-2">
                  {triageComparison.riskItems.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-[11px]">
                      <XCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                      <span className="flex-1 text-slate-600 truncate">{item.label}</span>
                      <ArrowRight className="w-3 h-3 text-slate-300 flex-shrink-0" />
                      <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                      <span className="text-green-700 font-medium whitespace-nowrap">{item.with}</span>
                    </div>
                  ))}
                </div>

                {/* Timeline comparison */}
                <div className="px-4 py-3 border-t border-slate-100 grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-wider text-red-400 mb-1.5">Without CaseBridge</p>
                    <div className="space-y-1">
                      {triageComparison.without.slice(0, 4).map((step, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-[10px]">
                          <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                            step.status === 'error' ? 'bg-red-400' : step.status === 'warning' ? 'bg-amber-400' : 'bg-slate-300'
                          }`} />
                          <span className="text-slate-500"><span className="font-semibold">{step.time}</span> {step.event}</span>
                        </div>
                      ))}
                      <p className="text-[10px] font-semibold text-red-500 mt-1">→ Decision at month 14</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-wider text-green-600 mb-1.5">With CaseBridge</p>
                    <div className="space-y-1">
                      {triageComparison.with.slice(0, 4).map((step, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-[10px]">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
                          <span className="text-slate-500"><span className="font-semibold">{step.time}</span> {step.event}</span>
                        </div>
                      ))}
                      <p className="text-[10px] font-semibold text-green-600 mt-1">→ Decision at month 8</p>
                    </div>
                  </div>
                </div>

                {/* Priority actions */}
                <div className="px-4 py-3 border-t border-slate-100 bg-slate-50/50">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Priority Resolution Order</p>
                  <div className="space-y-1.5">
                    {caseAssessment.recommendations.map((rec) => (
                      <div key={rec.priority} className="flex items-center gap-2 text-[11px]">
                        <span className="w-4 h-4 rounded-full bg-navy-900 text-white flex items-center justify-center flex-shrink-0 text-[9px] font-bold">
                          {rec.priority}
                        </span>
                        <span className="font-medium text-slate-700">{rec.action}</span>
                        <span className="text-slate-400 ml-auto text-[10px]">{rec.timeEstimate}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Document Checklist — full width below panels, always visible */}
      <AnimatePresence>
        {validationRun && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.4 }}
            className="mt-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <FileCheck className="w-5 h-5 text-navy-900" />
              <h2 className="text-base font-semibold text-slate-900">Document Checklist & Filing Validation</h2>
              <span className="text-[12px] text-slate-400 ml-2">Pre-flight checklist for each handoff stage — validated submissions only advance to the next phase</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {documentChecklist.map((stage) => {
                // Compute checked state: use override from context, else fall back to original status
                const resolvedDocs = stage.documents.map((doc, i) => {
                  const key = `${stage.stageNumber}-${i}`;
                  const override = documentChecks[key];
                  const isChecked = override !== undefined ? override : (doc.status === 'done');
                  return { ...doc, isChecked, key };
                });
                const checkedCount = resolvedDocs.filter((d) => d.isChecked && d.required).length;
                const totalRequired = resolvedDocs.filter((d) => d.required).length;
                const hasFlags = resolvedDocs.some((d) => !d.isChecked && (d.status === 'flagged' || d.status === 'missing'));

                return (
                  <div
                    key={stage.stageNumber}
                    className={`bg-white rounded-xl border shadow-sm overflow-hidden ${
                      checkedCount === totalRequired ? 'border-green-200/80' : stage.complete ? 'border-slate-200/80' : 'border-amber-200/80'
                    }`}
                  >
                    {/* Stage header */}
                    <div className="bg-navy-900 text-white px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${
                          checkedCount === totalRequired ? 'bg-green-500' : 'bg-accent text-navy-900'
                        }`}>
                          {stage.stageNumber}
                        </span>
                        <div className="flex-1">
                          <p className="text-[13px] font-semibold">{stage.stage}</p>
                          <p className="text-[10px] text-white/60">{stage.agency}</p>
                        </div>
                        <span className="text-[10px] font-bold text-white/80">{checkedCount}/{totalRequired}</span>
                      </div>
                    </div>

                    {/* Document list — interactive checkboxes */}
                    <div className="px-3 py-2 space-y-1">
                      {resolvedDocs.map((doc) => {
                        const isNa = doc.status === 'na';
                        return (
                          <button
                            key={doc.key}
                            onClick={() => !isNa && toggleDocument(doc.key, doc.isChecked)}
                            disabled={isNa}
                            className={`w-full flex items-start gap-2 py-1.5 px-2 rounded text-[11px] text-left transition-colors ${
                              !doc.isChecked && doc.status === 'flagged' ? 'bg-amber-50 hover:bg-amber-100/60' :
                              !doc.isChecked && doc.status === 'missing' ? 'bg-red-50 hover:bg-red-100/60' :
                              isNa ? '' :
                              'hover:bg-slate-50'
                            } ${isNa ? '' : 'cursor-pointer'}`}
                          >
                            {doc.isChecked ? (
                              <CheckCircle className="w-3.5 h-3.5 text-green-500 mt-0.5 flex-shrink-0" />
                            ) : doc.status === 'flagged' ? (
                              <AlertTriangle className="w-3.5 h-3.5 text-amber-500 mt-0.5 flex-shrink-0" />
                            ) : doc.status === 'missing' ? (
                              <Circle className="w-3.5 h-3.5 text-red-400 mt-0.5 flex-shrink-0" />
                            ) : isNa ? (
                              <Minus className="w-3.5 h-3.5 text-slate-300 mt-0.5 flex-shrink-0" />
                            ) : (
                              <Circle className="w-3.5 h-3.5 text-slate-300 mt-0.5 flex-shrink-0" />
                            )}
                            <span className={`flex-1 leading-tight transition-all ${
                              doc.isChecked ? 'text-slate-400 line-through' :
                              doc.status === 'flagged' ? 'text-amber-700' :
                              doc.status === 'missing' ? 'text-red-700' :
                              isNa ? 'text-slate-400' :
                              'text-slate-700'
                            }`}>
                              {!doc.isChecked && doc.status === 'flagged' && '⚠ '}{doc.name}
                            </span>
                            <span className={`text-[9px] font-bold flex-shrink-0 ${
                              !doc.required ? 'text-slate-400' :
                              !doc.isChecked && doc.status === 'missing' ? 'text-red-600' :
                              'text-slate-400'
                            }`}>
                              {doc.required ? 'REQ' : 'OPT'}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Stage footer */}
                    {hasFlags && (
                      <div className="px-3 py-2 border-t border-slate-100 bg-slate-50">
                        <p className="text-[10px] text-amber-600 font-medium">
                          {resolvedDocs.filter(d => d.flag && !d.isChecked).map(d => d.flag).join(' · ')}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
