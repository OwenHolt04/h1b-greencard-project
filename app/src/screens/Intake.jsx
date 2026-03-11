import { useState, useEffect, useRef, useMemo } from 'react';
import { useDemo } from '../context/DemoContext';
import { motion, AnimatePresence } from 'framer-motion';
import ReadinessScore from '../components/ReadinessScore';
import { intakeSections, formPackage, validationIssues, documentChecklist } from '../data/mockData';
import {
  Search, CheckCircle, AlertTriangle, AlertCircle, Info,
  Loader2, Link2, Zap, Eye, Pencil, ClipboardCheck, Circle, RefreshCw,
} from 'lucide-react';

const severityConfig = {
  high: { label: 'High', color: 'bg-red-100 text-red-700 border-red-200', border: 'border-l-red-500', icon: AlertTriangle, iconColor: 'text-red-500' },
  medium: { label: 'Medium', color: 'bg-amber-100 text-amber-700 border-amber-200', border: 'border-l-amber-500', icon: AlertCircle, iconColor: 'text-amber-500' },
  low: { label: 'Low', color: 'bg-blue-100 text-blue-700 border-blue-200', border: 'border-l-blue-500', icon: Info, iconColor: 'text-blue-500' },
};

// Field layout: each inner array = one row. 1 item = full width, 2 items = side by side.
const fieldLayout = {
  identity: [['fullName'], ['dateOfBirth', 'countryOfBirth']],
  identifiers: [['aNumber'], ['passportNumber'], ['i94Number']],
  immigration: [['currentStatus', 'statusExpiry'], ['lastArrival'], ['priorityDate', 'classification']],
  employer: [['employerLegalName'], ['fein', 'workLocation']],
  job: [['jobTitle'], ['socCode', 'salary'], ['wageLevel']],
  address: [['currentAddress'], ['travelHistory']],
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
    resolveIssue, unresolvedCount, openForm,
  } = useDemo();

  const [activeSection, setActiveSection] = useState('identity');
  const [syncingFormIds, setSyncingFormIds] = useState(new Set());
  const [syncFlashFormIds, setSyncFlashFormIds] = useState(new Set());
  const [editingField, setEditingField] = useState(null);
  const [editValue, setEditValue] = useState('');
  const editInputRef = useRef(null);

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

  const startEditing = (field) => {
    const currentValue = field.key === 'employerLegalName' ? getEmployerNameValue() : field.value;
    setEditingField(field.key);
    setEditValue(currentValue);
    setTimeout(() => editInputRef.current?.focus(), 30);
  };

  const finishEditing = () => {
    if (editingField === 'employerLegalName' && editValue === 'Hewlett Packard Enterprise' && !employerNameFixed) {
      resolveIssue('employer-name');
    }
    setEditingField(null);
    setEditValue('');
  };

  // Current section data
  const currentSection = intakeSections.find((s) => s.id === activeSection);
  const currentLayout = fieldLayout[activeSection] || [];

  // Downstream forms for current section
  const sectionForms = useMemo(() => {
    if (!currentSection) return [];
    const forms = new Set();
    currentSection.fields.forEach((f) => f.syncTargets.forEach((t) => forms.add(t)));
    return [...forms].sort();
  }, [currentSection]);

  // Which sections have issues
  const sectionHasIssue = (sectionId) => {
    if (!validationRun) return false;
    if (sectionId === 'employer' && !employerNameFixed) return true;
    if (sectionId === 'job' && !issues['soc-wage']) return true;
    if (sectionId === 'address' && !issues['travel-history']) return true;
    return false;
  };

  // Render a form field as an input-styled element
  const renderField = (fieldKey) => {
    const field = currentSection?.fields.find((f) => f.key === fieldKey);
    if (!field) return null;

    const isMismatchField = field.key === 'employerLegalName';
    const showMismatch = isMismatchField && !employerNameFixed && validationRun;
    const wasFixed = isMismatchField && employerNameFixed;
    const displayValue = isMismatchField ? getEmployerNameValue() : field.value;
    const isGapField = field.hasGap && validationRun && !issues['travel-history'];
    const isCurrentlyEditing = editingField === field.key;
    const isEditable = isMismatchField;

    // Input container style
    const inputStyle = showMismatch
      ? 'bg-amber-50 border-2 border-amber-300 text-amber-800'
      : wasFixed
      ? 'bg-green-50 border-2 border-green-300 text-green-700'
      : isGapField
      ? 'bg-blue-50 border-2 border-blue-300 text-blue-700'
      : 'bg-slate-50/80 border border-slate-200 text-slate-800';

    return (
      <div key={fieldKey}>
        {/* Label + sync badge */}
        <div className="flex items-center gap-2 mb-1.5">
          <label className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
            {field.label}
          </label>
          <span className="text-[10px] text-accent font-semibold bg-accent/10 px-1.5 py-0.5 rounded">
            &rarr; {field.syncTargets.length} forms
          </span>
          {wasFixed && <CheckCircle className="w-3 h-3 text-green-500" />}
        </div>

        {/* Input-styled field */}
        {isCurrentlyEditing ? (
          <input
            ref={editInputRef}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={finishEditing}
            onKeyDown={(e) => e.key === 'Enter' && e.target.blur()}
            className="w-full rounded-lg px-3.5 py-2.5 text-sm font-medium text-navy-900 bg-white border-2 border-accent outline-none ring-2 ring-accent/20 transition-all"
          />
        ) : (
          <div
            className={`rounded-lg px-3.5 py-2.5 text-sm font-medium transition-all duration-500 ${inputStyle} ${
              isEditable ? 'cursor-pointer hover:border-navy-900/40 group' : ''
            }`}
            onClick={isEditable ? () => startEditing(field) : undefined}
          >
            <div className="flex items-center justify-between">
              <span>{displayValue}</span>
              {isEditable && (
                <Pencil className="w-3.5 h-3.5 text-slate-300 group-hover:text-navy-900 transition-colors" />
              )}
            </div>
          </div>
        )}
      </div>
    );
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

      {/* Main layout: Form (7 cols) + Filing/Validation (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

        {/* ═══ Smart Form: Sidebar + Fields ═══ */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden flex min-h-[460px]">

            {/* Section sidebar */}
            <div className="w-44 border-r border-slate-100 bg-slate-50/50 py-3 flex flex-col flex-shrink-0">
              <div className="px-3 mb-2">
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Sections</p>
              </div>
              <nav className="flex-1 space-y-0.5 px-2">
                {intakeSections.map((section) => {
                  const isActive = section.id === activeSection;
                  const hasIssue = sectionHasIssue(section.id);
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                        isActive
                          ? 'bg-navy-900 text-white shadow-sm'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                          hasIssue ? 'bg-amber-400' : isActive ? 'bg-white' : 'bg-green-400'
                        }`} />
                        {section.label}
                      </div>
                    </button>
                  );
                })}
              </nav>

              {/* Auto-sync indicator */}
              <div className="mx-2 mt-3 p-2.5 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-[10px] font-bold text-green-700 uppercase tracking-wider flex items-center gap-1">
                  <RefreshCw className="w-3 h-3" />
                  Auto-Sync Active
                </p>
                <p className="text-[10px] text-green-600 mt-0.5 leading-snug">Changes propagate to all 7 forms instantly</p>
              </div>
            </div>

            {/* Form content */}
            <div className="flex-1 p-5 overflow-y-auto">
              {/* Section header + form pills */}
              <div className="flex items-start justify-between mb-5">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">{currentSection?.label}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Fields in this section populate {sectionForms.length} downstream forms
                  </p>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap justify-end">
                  {sectionForms.map((form) => (
                    <span
                      key={form}
                      className="text-[10px] font-semibold text-navy-900 bg-navy-900/8 border border-navy-900/15 px-2 py-0.5 rounded-full"
                    >
                      {form}
                    </span>
                  ))}
                </div>
              </div>

              {/* Form fields — input-styled layout */}
              <div className="space-y-4">
                {currentLayout.map((row, rowIdx) => (
                  <div key={rowIdx} className={row.length === 2 ? 'grid grid-cols-2 gap-4' : ''}>
                    {row.map((fieldKey) => renderField(fieldKey))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ═══ Right panel: Filing Package + Readiness + Validation ═══ */}
        <div className="lg:col-span-5 space-y-4">

          {/* Filing Package — compact */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="px-4 py-2.5 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-900">Filing Package</h2>
              <div className="flex items-center gap-1 text-[10px] text-navy-900 font-medium">
                <Link2 className="w-3 h-3" />
                Synced from source
              </div>
            </div>
            <div className="p-3 grid grid-cols-2 gap-2">
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
                    className={`border rounded-lg p-2.5 transition-all duration-300 cursor-pointer hover:border-navy-900/40 hover:shadow-sm group text-left ${
                      isSyncing ? 'animate-form-sync border-accent' : 'border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-bold text-slate-900">{form.formCode}</span>
                        <Eye className="w-3 h-3 text-slate-300 group-hover:text-navy-900 transition-colors" />
                      </div>
                      {issueCount > 0 && (
                        <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1 py-0.5 rounded-full">
                          {issueCount}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-500 mb-1.5">{form.displayName}</p>
                    <div className="flex items-center gap-1.5">
                      <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full rounded-full ${
                            form.completionPercent === 100 ? 'bg-green-500' : 'bg-navy-900'
                          }`}
                          initial={{ width: 0 }}
                          animate={{ width: `${form.completionPercent}%` }}
                          transition={{ duration: 0.6, delay: 0.2 }}
                        />
                      </div>
                      <span className={`text-[10px] font-semibold ${statusColor}`}>{form.completionPercent}%</span>
                    </div>
                    <div className="mt-1.5 flex items-center gap-1">
                      <Link2 className={`w-2.5 h-2.5 ${isSyncing ? 'text-navy-900' : 'text-slate-300'}`} />
                      <span className="text-[10px] text-slate-400">{form.syncedFields} fields</span>
                    </div>
                    {syncFlashFormIds.has(form.formCode) && (
                      <motion.div
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-1 flex items-center gap-1 text-[10px] font-semibold text-green-600 bg-green-50 px-1.5 py-0.5 rounded"
                      >
                        <CheckCircle className="w-2.5 h-2.5" />
                        Updated
                      </motion.div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Filing Readiness */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-4">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                {validationRun || validationRunning ? (
                  <ReadinessScore score={readinessScore} size={72} strokeWidth={5} />
                ) : (
                  <svg width={72} height={72}>
                    <circle cx={36} cy={36} r={30} fill="none" stroke="#e2e8f0" strokeWidth={5} />
                    <text x={36} y={34} textAnchor="middle" dominantBaseline="central" style={{ fontSize: 20, fill: '#cbd5e1' }} className="font-sans font-bold">?</text>
                    <text x={36} y={50} textAnchor="middle" dominantBaseline="central" style={{ fontSize: 9, fill: '#94a3b8' }} className="font-sans">/ 100</text>
                  </svg>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-sm font-semibold text-slate-900 mb-1">Filing Readiness</h2>

                {/* Document readiness — shown after validation */}
                {validationRun && !validationRunning && (
                  <div className="mb-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] text-slate-500">I-485 Documents</span>
                      <span className="text-[10px] font-bold text-navy-900">{checklistCounts.done}/{checklistCounts.total}</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden flex">
                      <div className="bg-green-500 h-full" style={{ width: `${(checklistCounts.done / checklistCounts.total) * 100}%` }} />
                      <div className="bg-amber-500 h-full" style={{ width: `${(checklistCounts.flagged / checklistCounts.total) * 100}%` }} />
                      <div className="bg-red-500 h-full" style={{ width: `${(checklistCounts.missing / checklistCounts.total) * 100}%` }} />
                      <div className="bg-slate-300 h-full" style={{ width: `${(checklistCounts.pending / checklistCounts.total) * 100}%` }} />
                    </div>
                  </div>
                )}

                {!validationRun && !validationRunning && (
                  <button
                    onClick={runValidation}
                    className="w-full flex items-center justify-center gap-2 bg-navy-900 hover:bg-navy-800 text-white font-semibold py-2 rounded-lg transition-colors cursor-pointer text-sm"
                  >
                    <Search className="w-3.5 h-3.5" />
                    Run Pre-Flight Validation
                  </button>
                )}
                {validationRunning && (
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Analyzing consistency...
                  </div>
                )}
                {validationRun && !validationRunning && (
                  <div className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full w-fit ${
                    unresolvedCount === 0 ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
                  }`}>
                    {unresolvedCount === 0 ? (
                      <><CheckCircle className="w-3 h-3" /> Ready for review</>
                    ) : (
                      <><AlertTriangle className="w-3 h-3" /> {unresolvedCount} issue{unresolvedCount > 1 ? 's' : ''} to resolve</>
                    )}
                  </div>
                )}
              </div>
            </div>
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
                      <div className={`border-l-4 ${isResolved ? 'border-l-green-500' : config.border} p-3.5`}>
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <div className="flex items-center gap-1.5">
                            {isResolved ? (
                              <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                            ) : (
                              <Icon className={`w-3.5 h-3.5 ${config.iconColor}`} />
                            )}
                            <h3 className={`text-sm font-semibold ${isResolved ? 'text-green-700 line-through' : 'text-slate-900'}`}>
                              {issue.title}
                            </h3>
                          </div>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                            isResolved ? 'bg-green-100 text-green-700' : config.color
                          }`}>
                            {isResolved ? 'Resolved' : config.label}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed mb-1.5">{issue.plainDescription}</p>
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <span className="text-[10px] text-slate-400">Affects:</span>
                          {issue.affectedForms.map((form) => (
                            <span key={form} className="text-[10px] font-medium text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                              {form}
                            </span>
                          ))}
                        </div>
                        {issue.fixable && !isResolved && (
                          <button
                            onClick={() => resolveIssue(issue.id)}
                            className="flex items-center gap-1.5 text-sm font-semibold text-navy-900 hover:text-navy-700 transition-colors cursor-pointer"
                          >
                            <Zap className="w-3.5 h-3.5" />
                            Fix: Standardize to &ldquo;{issue.correctedValue}&rdquo;
                          </button>
                        )}
                        {!issue.fixable && !isResolved && (
                          <p className="text-[10px] text-slate-400 italic">{issue.recommendedFix}</p>
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

      {/* Filing Checklist — full width below */}
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
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500" />{checklistCounts.done} complete</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500" />{checklistCounts.flagged} flagged</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500" />{checklistCounts.missing} missing</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-300" />{checklistCounts.pending} pending</span>
              </div>
            </div>
            <div className="p-5">
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden flex mb-4">
                <div className="bg-green-500 h-full" style={{ width: `${(checklistCounts.done / checklistCounts.total) * 100}%` }} />
                <div className="bg-amber-500 h-full" style={{ width: `${(checklistCounts.flagged / checklistCounts.total) * 100}%` }} />
                <div className="bg-red-500 h-full" style={{ width: `${(checklistCounts.missing / checklistCounts.total) * 100}%` }} />
                <div className="bg-slate-300 h-full" style={{ width: `${(checklistCounts.pending / checklistCounts.total) * 100}%` }} />
              </div>
              <div className="grid grid-cols-3 gap-x-6 gap-y-1.5">
                {i485Docs.map((doc, i) => {
                  const sc = statusIcon[doc.status] || statusIcon.pending;
                  const Icon = sc.icon;
                  return (
                    <div key={i} className={`flex items-start gap-2 py-1.5 px-2 rounded ${sc.bg}`}>
                      <Icon className={`w-3.5 h-3.5 ${sc.color} flex-shrink-0 mt-0.5`} />
                      <div className="min-w-0">
                        <p className={`text-xs ${doc.status === 'done' ? 'text-slate-500' : 'text-slate-800 font-medium'} leading-snug`}>
                          {doc.name}
                        </p>
                        {doc.flag && <p className="text-[10px] text-amber-600 font-medium mt-0.5">{doc.flag}</p>}
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
