import { useState, useEffect, useRef } from 'react';
import { useDemo } from '../context/DemoContext';
import { motion, AnimatePresence } from 'framer-motion';
import ReadinessScore from '../components/ReadinessScore';
import { intakeSections, formPackage, validationIssues, documentChecklist } from '../data/mockData';
import {
  Search, CheckCircle, AlertTriangle, AlertCircle, Info,
  ArrowRight, Loader2, Link2, Zap, Eye, Pencil, ClipboardCheck, Circle,
} from 'lucide-react';

const severityConfig = {
  high: { label: 'High', color: 'bg-red-100 text-red-700 border-red-200', border: 'border-l-red-500', icon: AlertTriangle, iconColor: 'text-red-500' },
  medium: { label: 'Medium', color: 'bg-amber-100 text-amber-700 border-amber-200', border: 'border-l-amber-500', icon: AlertCircle, iconColor: 'text-amber-500' },
  low: { label: 'Low', color: 'bg-blue-100 text-blue-700 border-blue-200', border: 'border-l-blue-500', icon: Info, iconColor: 'text-blue-500' },
};

// I-485 checklist data
const i485Stage = documentChecklist.find((s) => s.stageNumber === 4);
const i485Docs = i485Stage?.documents || [];
const checklistCounts = {
  done: i485Docs.filter((d) => d.status === 'done').length,
  flagged: i485Docs.filter((d) => d.status === 'flagged').length,
  missing: i485Docs.filter((d) => d.status === 'missing').length,
  pending: i485Docs.filter((d) => d.status === 'pending').length,
  total: i485Docs.length,
};

const statusIcon = {
  done: { icon: CheckCircle, color: 'text-green-500', bg: '' },
  flagged: { icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-50' },
  missing: { icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-50' },
  pending: { icon: Circle, color: 'text-slate-400', bg: '' },
  na: { icon: Circle, color: 'text-slate-200', bg: '' },
};

export default function Intake() {
  const {
    validationRun, validationRunning, issues, syncing,
    employerNameFixed, readinessScore, runValidation,
    resolveIssue, unresolvedCount, openForm
  } = useDemo();

  const [syncingFormIds, setSyncingFormIds] = useState(new Set());
  const [syncFlashFormIds, setSyncFlashFormIds] = useState(new Set());
  const [editingField, setEditingField] = useState(null);
  const [editValue, setEditValue] = useState('');
  const editInputRef = useRef(null);

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

  // Start inline editing a field
  const startEditing = (field) => {
    const currentValue = field.key === 'employerLegalName' ? getEmployerNameValue() : field.value;
    setEditingField(field.key);
    setEditValue(currentValue);
    setTimeout(() => editInputRef.current?.focus(), 30);
  };

  // Finish editing
  const finishEditing = () => {
    if (editingField === 'employerLegalName' && editValue === 'Hewlett Packard Enterprise' && !employerNameFixed) {
      resolveIssue('employer-name');
    }
    setEditingField(null);
    setEditValue('');
  };

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
          <h1 className="text-xl font-semibold text-slate-900">Smart Intake + Validation</h1>
          <p className="text-base text-slate-500">Enter once. Sync across forms. Catch issues before filing.</p>
        </div>
        <div className="flex items-center gap-3">
          {validationRun && (
            <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
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
              <span className="text-sm font-bold text-slate-300">&mdash;</span>
            </div>
          )}
        </div>
      </div>

      {/* Three-panel layout — data → forms → validation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left panel: Shared Intake Data */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-900">Shared Case Data</h2>
              <span className="text-xs text-slate-400 uppercase tracking-wider font-medium">Source of Truth</span>
            </div>

            <div className="divide-y divide-slate-100">
              {intakeSections.map((section) => (
                <div key={section.id} className="px-4 py-3">
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-2">{section.label}</p>
                  <div className="space-y-2">
                    {section.fields.map((field) => {
                      const isMismatchField = field.key === 'employerLegalName';
                      const showMismatch = isMismatchField && !employerNameFixed && validationRun;
                      const wasFixed = isMismatchField && employerNameFixed;
                      const displayValue = isMismatchField ? getEmployerNameValue() : field.value;
                      const isGapField = field.hasGap && validationRun && !issues['travel-history'];
                      const isCurrentlyEditing = editingField === field.key;
                      const isEditable = isMismatchField;

                      return (
                        <div
                          key={field.key}
                          className={`flex items-start justify-between gap-2 py-1.5 px-2 rounded transition-all duration-500 ${
                            showMismatch
                              ? 'bg-amber-50 ring-1 ring-amber-200'
                              : wasFixed
                              ? 'bg-green-50 ring-1 ring-green-200'
                              : isGapField
                              ? 'bg-blue-50 ring-1 ring-blue-200'
                              : ''
                          }`}
                        >
                          <div className="min-w-0 flex-1">
                            <p className="text-xs text-slate-400">{field.label}</p>
                            {isCurrentlyEditing ? (
                              <input
                                ref={editInputRef}
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                onBlur={finishEditing}
                                onKeyDown={(e) => e.key === 'Enter' && e.target.blur()}
                                className="text-sm font-medium text-navy-900 bg-accent/10 border border-accent/40 focus:border-accent rounded px-1.5 py-0.5 w-full outline-none transition-colors mt-0.5"
                              />
                            ) : isEditable ? (
                              <button
                                onClick={() => startEditing(field)}
                                className="flex items-center gap-1 cursor-pointer group text-left mt-0.5"
                              >
                                <span className={`text-sm font-medium border-b border-dashed transition-colors ${
                                  showMismatch ? 'text-amber-700 border-amber-400' : wasFixed ? 'text-green-700 border-green-300' : 'text-slate-800 border-slate-300'
                                }`}>
                                  {displayValue}
                                </span>
                                <Pencil className="w-3 h-3 text-slate-300 group-hover:text-navy-900 transition-colors flex-shrink-0" />
                              </button>
                            ) : (
                              <p className={`text-sm font-medium ${
                                showMismatch ? 'text-amber-700' : wasFixed ? 'text-green-700' : 'text-slate-800'
                              }`}>
                                {displayValue}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-1 flex-shrink-0 mt-1">
                            <span className="text-xs text-slate-400 font-medium whitespace-nowrap">
                              &rarr; {field.syncTargets.length} forms
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
        </div>

        {/* Center panel: Form Package */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-900">Filing Package</h2>
              <div className="flex items-center gap-1 text-xs text-navy-900 font-medium">
                <Link2 className="w-3.5 h-3.5" />
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
                        <span className="text-sm font-bold text-slate-900">{form.formCode}</span>
                        <Eye className="w-3.5 h-3.5 text-slate-300 group-hover:text-navy-900 transition-colors" />
                      </div>
                      {issueCount > 0 && (
                        <span className="text-xs font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full">
                          {issueCount}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mb-2">{form.displayName}</p>

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
                      <span className={`text-xs font-semibold ${statusColor}`}>
                        {form.completionPercent}%
                      </span>
                    </div>

                    {/* Sync indicator */}
                    <div className="mt-2 flex items-center gap-1">
                      <Link2 className={`w-3 h-3 ${isSyncing ? 'text-navy-900' : 'text-slate-300'}`} />
                      <span className="text-xs text-slate-400">{form.syncedFields} fields synced</span>
                    </div>

                    {/* "Updated" flash after employer name fix */}
                    {syncFlashFormIds.has(form.formCode) && (
                      <motion.div
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-1.5 flex items-center gap-1 text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded"
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

        {/* Right panel: Validation + Checklist */}
        <div className="lg:col-span-4 space-y-4">
          {/* Readiness + Validation button */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-slate-900">Filing Readiness</h2>
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

            {/* Document readiness summary — shown after validation */}
            {validationRun && !validationRunning && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className="mb-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-700">I-485 Documents</span>
                  <span className="text-xs font-bold text-navy-900">{checklistCounts.done}/{checklistCounts.total} ready</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden flex">
                  <div className="bg-green-500 h-full" style={{ width: `${(checklistCounts.done / checklistCounts.total) * 100}%` }} />
                  <div className="bg-amber-500 h-full" style={{ width: `${(checklistCounts.flagged / checklistCounts.total) * 100}%` }} />
                  <div className="bg-red-500 h-full" style={{ width: `${(checklistCounts.missing / checklistCounts.total) * 100}%` }} />
                  <div className="bg-slate-300 h-full" style={{ width: `${(checklistCounts.pending / checklistCounts.total) * 100}%` }} />
                </div>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="flex items-center gap-1 text-[10px] text-slate-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />{checklistCounts.done} done
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-slate-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />{checklistCounts.flagged} flagged
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-slate-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" />{checklistCounts.missing} missing
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-slate-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />{checklistCounts.pending} pending
                  </span>
                </div>
              </motion.div>
            )}

            {!validationRun && !validationRunning && (
              <button
                onClick={runValidation}
                className="w-full flex items-center justify-center gap-2 bg-navy-900 hover:bg-navy-800 text-white font-semibold py-3 rounded-lg transition-colors cursor-pointer text-base"
              >
                <Search className="w-4 h-4" />
                Run Pre-Flight Validation
              </button>
            )}

            {validationRunning && (
              <div className="w-full flex items-center justify-center gap-2 bg-slate-100 text-slate-500 font-medium py-3 rounded-lg text-base">
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing cross-form consistency...
              </div>
            )}

            {validationRun && !validationRunning && (
              <div className={`flex items-center justify-center gap-2 py-3 rounded-lg font-semibold text-base ${
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
                            <h3 className={`text-sm font-semibold ${isResolved ? 'text-green-700 line-through' : 'text-slate-900'}`}>
                              {issue.title}
                            </h3>
                          </div>
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                            isResolved ? 'bg-green-100 text-green-700' : config.color
                          }`}>
                            {isResolved ? 'Resolved' : config.label}
                          </span>
                        </div>

                        <p className="text-sm text-slate-500 leading-relaxed mb-2">{issue.plainDescription}</p>

                        {/* Affected forms */}
                        <div className="flex items-center gap-1.5 mb-2">
                          <span className="text-xs text-slate-400">Affects:</span>
                          {issue.affectedForms.map((form) => (
                            <span key={form} className="text-xs font-medium text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                              {form}
                            </span>
                          ))}
                        </div>

                        {/* Fix button for employer name */}
                        {issue.fixable && !isResolved && (
                          <button
                            onClick={() => resolveIssue(issue.id)}
                            className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-navy-900 hover:text-navy-700 transition-colors cursor-pointer"
                          >
                            <Zap className="w-3.5 h-3.5" />
                            Fix: Standardize to &ldquo;{issue.correctedValue}&rdquo;
                          </button>
                        )}

                        {!issue.fixable && !isResolved && (
                          <p className="text-xs text-slate-400 italic mt-1">
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
        </div>
      </div>

      {/* Filing Checklist — full width below panels */}
      {validationRun && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.3 }}
          className="mt-6"
        >
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ClipboardCheck className="w-4 h-4 text-navy-900" />
                <h2 className="text-base font-semibold text-slate-900">I-485 Filing Checklist</h2>
                <span className="text-[10px] font-semibold text-navy-900 bg-accent/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Basic
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  {checklistCounts.done} complete
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  {checklistCounts.flagged} flagged
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  {checklistCounts.missing} missing
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-slate-300" />
                  {checklistCounts.pending} pending
                </span>
              </div>
            </div>

            <div className="p-5">
              {/* Progress bar */}
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden flex mb-4">
                <div className="bg-green-500 h-full" style={{ width: `${(checklistCounts.done / checklistCounts.total) * 100}%` }} />
                <div className="bg-amber-500 h-full" style={{ width: `${(checklistCounts.flagged / checklistCounts.total) * 100}%` }} />
                <div className="bg-red-500 h-full" style={{ width: `${(checklistCounts.missing / checklistCounts.total) * 100}%` }} />
                <div className="bg-slate-300 h-full" style={{ width: `${(checklistCounts.pending / checklistCounts.total) * 100}%` }} />
              </div>

              {/* Document grid */}
              <div className="grid grid-cols-3 gap-x-6 gap-y-1.5">
                {i485Docs.map((doc, i) => {
                  const sc = statusIcon[doc.status] || statusIcon.pending;
                  const Icon = sc.icon;
                  return (
                    <div
                      key={i}
                      className={`flex items-start gap-2 py-1.5 px-2 rounded ${sc.bg}`}
                    >
                      <Icon className={`w-3.5 h-3.5 ${sc.color} flex-shrink-0 mt-0.5`} />
                      <div className="min-w-0">
                        <p className={`text-xs ${doc.status === 'done' ? 'text-slate-500' : 'text-slate-800 font-medium'} leading-snug`}>
                          {doc.name}
                        </p>
                        {doc.flag && (
                          <p className="text-[10px] text-amber-600 font-medium mt-0.5">{doc.flag}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
