// ============================================================================
// Scene 3: Pre-Submission Validation — RFE Prevention + Filing Checklist
// Catch issues before filing. RFE rate: ~25% → <5%.
// ============================================================================

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDemo } from '../context/DemoContext';
import { SceneShell, MaskedHeading, FocalCard, SupportingModule, StaggerGroup, StaggerItem } from './motion';
import { validationIssues, documentChecklist, employer } from '../data/mockData';
import {
  Shield, Search, Loader2, CheckCircle2, AlertTriangle, AlertOctagon,
  Info, FileCheck, ChevronDown, X, Zap,
} from 'lucide-react';

const EASE = [0.4, 0, 0.2, 1];

/* ── Severity badge ───────────────────────────────────────────────── */
function SeverityBadge({ severity }) {
  const styles = {
    high: 'bg-red-100 text-red-700 border-red-200',
    medium: 'bg-amber-100 text-amber-700 border-amber-200',
    low: 'bg-blue-100 text-blue-700 border-blue-200',
  };
  return (
    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold uppercase border ${styles[severity] || ''}`}>
      {severity}
    </span>
  );
}

/* ── Issue card ───────────────────────────────────────────────────── */
function IssueCard({ issue, isResolved, onFix, isHero }) {
  const borderColor = isResolved ? 'border-green-300 bg-green-50' :
    issue.severity === 'high' ? 'border-red-200' :
    issue.severity === 'medium' ? 'border-amber-200' : 'border-blue-200';

  return (
    <motion.div
      layout
      className={`rounded-xl border-2 p-3 transition-colors ${borderColor} ${isHero ? '' : ''} bg-white`}
    >
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-1.5">
          {isResolved
            ? <CheckCircle2 size={14} className="text-green-500" />
            : issue.severity === 'high'
            ? <AlertOctagon size={14} className="text-red-500" />
            : <AlertTriangle size={14} className="text-amber-500" />}
          <span className={`text-sm font-semibold ${isResolved ? 'text-green-700 line-through' : 'text-navy-900'}`}>
            {issue.title}
          </span>
        </div>
        <SeverityBadge severity={issue.severity} />
      </div>

      <p className={`text-[11px] leading-relaxed mb-1.5 ${isResolved ? 'text-green-600' : 'text-slate-600'}`}>
        {issue.plainDescription}
      </p>

      {/* Before / After for fixable */}
      {issue.fixable && !isResolved && (
        <div className="flex items-center gap-2 mb-2">
          <div className="flex-1 px-2 py-1 bg-red-50 rounded border border-red-200">
            <p className="text-[9px] text-red-500 font-medium">Current</p>
            <p className="text-[11px] text-red-700">{issue.currentValue}</p>
          </div>
          <span className="text-slate-300">→</span>
          <div className="flex-1 px-2 py-1 bg-green-50 rounded border border-green-200">
            <p className="text-[9px] text-green-500 font-medium">Corrected</p>
            <p className="text-[11px] text-green-700">{issue.correctedValue}</p>
          </div>
        </div>
      )}

      {/* Affected forms */}
      <div className="flex items-center gap-1 mb-2">
        {issue.affectedForms.map((f) => (
          <span key={f} className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
            {f}
          </span>
        ))}
      </div>

      {/* Fix button */}
      {issue.fixable && !isResolved && (
        <button
          onClick={onFix}
          className="w-full text-[10px] px-3 py-1.5 rounded-lg bg-navy-900 text-white font-medium hover:bg-navy-800 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
        >
          <Zap size={11} /> Fix: Standardize to "{issue.correctedValue}"
        </button>
      )}

      {isResolved && (
        <div className="flex items-center gap-1.5 text-green-600">
          <CheckCircle2 size={10} />
          <span className="text-[10px] font-medium">Resolved — synced to {issue.affectedForms.length} forms</span>
        </div>
      )}
    </motion.div>
  );
}

/* ── RFE Alert Banner ─────────────────────────────────────────────── */
function RFEAlert({ unresolvedCount }) {
  if (unresolvedCount === 0) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-3 px-4 py-3 rounded-xl bg-red-50 border-2 border-red-200 flex items-start gap-3"
    >
      <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
        <AlertOctagon size={16} className="text-red-600" />
      </div>
      <div>
        <p className="text-sm font-semibold text-red-800">
          RFE Risk: {unresolvedCount} issue{unresolvedCount > 1 ? 's' : ''} detected
        </p>
        <p className="text-[11px] text-red-600 mt-0.5">
          Filing with these inconsistencies has a ~25% chance of triggering a Request for Evidence (RFE),
          adding 3–6 months to processing time. Resolve before submission.
        </p>
      </div>
    </motion.div>
  );
}

/* ── Filing Checklist (real checklist design) ────────────────────── */
function FilingChecklist() {
  const i485Stage = documentChecklist.find((s) => s.stageNumber === 4);
  if (!i485Stage) return null;

  const docs = i485Stage.documents;
  const done = docs.filter((d) => d.status === 'done').length;
  const total = docs.length;
  const flagged = docs.filter((d) => d.status === 'flagged').length;
  const missing = docs.filter((d) => d.status === 'missing').length;
  const pending = docs.filter((d) => d.status === 'pending').length;

  const statusConfig = {
    done: { icon: <CheckCircle2 size={11} className="text-green-500" />, bg: '', label: 'Done', text: 'text-slate-600' },
    flagged: { icon: <AlertTriangle size={11} className="text-amber-500" />, bg: 'bg-amber-50', label: 'Flagged', text: 'text-amber-800' },
    missing: { icon: <X size={11} className="text-red-500" />, bg: 'bg-red-50', label: 'Missing', text: 'text-red-800' },
    pending: { icon: <Info size={11} className="text-slate-400" />, bg: '', label: 'Pending', text: 'text-slate-500' },
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <FileCheck size={13} className="text-navy-900" />
          <p className="text-sm font-bold text-navy-900">I-485 Filing Checklist</p>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[11px] font-bold text-green-600">{done}</span>
          <span className="text-[10px] text-slate-400">/</span>
          <span className="text-[11px] font-bold text-navy-900">{total}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2 rounded-full bg-slate-100 overflow-hidden flex mb-3">
        <div className="bg-green-500 transition-all" style={{ width: `${(done / total) * 100}%` }} />
        <div className="bg-amber-400 transition-all" style={{ width: `${(flagged / total) * 100}%` }} />
        <div className="bg-red-400 transition-all" style={{ width: `${(missing / total) * 100}%` }} />
        <div className="bg-slate-300 transition-all" style={{ width: `${(pending / total) * 100}%` }} />
      </div>

      {/* Checklist items — ALL items with checkbox affordances */}
      <div className="space-y-0.5 max-h-[300px] overflow-y-auto">
        {docs.map((doc, i) => {
          const cfg = statusConfig[doc.status];
          return (
            <div key={i} className={`flex items-start gap-2 px-2 py-1.5 rounded-md ${cfg.bg} ${
              doc.status !== 'done' ? 'border border-slate-100' : ''
            }`}>
              {/* Checkbox area */}
              <div className="mt-0.5 shrink-0">
                {doc.status === 'done' ? (
                  <div className="w-4 h-4 rounded bg-green-500 flex items-center justify-center">
                    <CheckCircle2 size={10} className="text-white" />
                  </div>
                ) : doc.status === 'missing' ? (
                  <div className="w-4 h-4 rounded border-2 border-red-400 flex items-center justify-center">
                    <X size={8} className="text-red-400" />
                  </div>
                ) : doc.status === 'flagged' ? (
                  <div className="w-4 h-4 rounded border-2 border-amber-400 flex items-center justify-center">
                    <AlertTriangle size={8} className="text-amber-500" />
                  </div>
                ) : (
                  <div className="w-4 h-4 rounded border-2 border-slate-300" />
                )}
              </div>
              {/* Label + flag */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className={`text-[10px] font-medium leading-tight ${
                    doc.status === 'done' ? 'text-slate-400 line-through' : cfg.text
                  }`}>{doc.name}</p>
                  {doc.required && doc.status !== 'done' && (
                    <span className="text-[8px] px-1 py-0.5 rounded bg-slate-200 text-slate-500 font-semibold uppercase shrink-0">Req</span>
                  )}
                </div>
                {doc.flag && (
                  <p className={`text-[9px] mt-0.5 ${
                    doc.status === 'missing' ? 'text-red-500' : 'text-amber-600'
                  }`}>{doc.flag}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-3 mt-2 pt-2 border-t border-slate-100">
        {[
          { color: 'bg-green-500', label: `${done} done` },
          { color: 'bg-amber-400', label: `${flagged} flagged` },
          { color: 'bg-red-400', label: `${missing} missing` },
          { color: 'bg-slate-300', label: `${pending} pending` },
        ].map((item) => (
          <span key={item.label} className="flex items-center gap-1 text-[8px] text-slate-500">
            <span className={`w-1.5 h-1.5 rounded-full ${item.color}`} /> {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════ */
/*  Main Scene                                                       */
/* ══════════════════════════════════════════════════════════════════ */
export default function ScenePreSubmission() {
  const { validationRun, validationRunning, runValidation, issues, resolveIssue, syncing, readinessScore } = useDemo();
  const unresolvedCount = Object.values(issues).filter((v) => !v).length;

  // Readiness ring
  const size = 64;
  const r = (size - 8) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - readinessScore / 100);
  const ringColor = readinessScore >= 90 ? '#22c55e' : readinessScore >= 70 ? '#f59e0b' : '#ef4444';

  return (
    <div className="h-full flex flex-col items-center justify-start bg-gradient-to-b from-surface to-white px-6 pt-6 overflow-y-auto">
      <SceneShell maxWidth="max-w-5xl" className="py-4">
        {/* Title */}
        <MaskedHeading className="text-2xl font-bold text-navy-900 text-center mb-0.5">
          Pre-Submission Validation
        </MaskedHeading>
        <p className="text-sm text-slate-500 text-center mb-4">
          Catch issues before filing, not at adjudication
        </p>

        {/* Readiness header card */}
        <FocalCard delay={0.1} className="p-4 mb-3">
          <div className="flex items-center justify-between">
            <div>
              {!validationRun && !validationRunning ? (
                <button
                  onClick={runValidation}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-navy-900 text-white text-sm font-medium hover:bg-navy-800 transition-colors cursor-pointer"
                >
                  <Search size={14} />
                  Run Pre-Submission Check
                </button>
              ) : validationRunning ? (
                <div className="flex items-center gap-2 px-4 py-2">
                  <Loader2 size={14} className="text-navy-900 animate-spin" />
                  <span className="text-sm text-navy-900 font-medium">Analyzing cross-form consistency...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Shield size={16} className={unresolvedCount === 0 ? 'text-green-500' : 'text-amber-500'} />
                  <span className={`text-sm font-semibold ${unresolvedCount === 0 ? 'text-green-700' : 'text-amber-700'}`}>
                    {unresolvedCount === 0
                      ? 'All issues resolved — ready for attorney review'
                      : `${unresolvedCount} issue${unresolvedCount > 1 ? 's' : ''} found`}
                  </span>
                </div>
              )}
              {validationRun && (
                <p className="text-[11px] text-slate-500 mt-1 ml-1">
                  Scanned 6 forms · 86 fields · 23 cross-references
                </p>
              )}
            </div>

            {/* Readiness score */}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-[10px] text-slate-500">Readiness</p>
                <p className="text-[10px] text-slate-400">I-485 Package</p>
              </div>
              <svg width={size} height={size}>
                <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={4} />
                <motion.circle
                  cx={size / 2} cy={size / 2} r={r}
                  fill="none" stroke={ringColor} strokeWidth={4}
                  strokeLinecap="round" strokeDasharray={c}
                  animate={{ strokeDashoffset: offset }}
                  transition={{ duration: 0.8, ease: EASE }}
                  transform={`rotate(-90 ${size / 2} ${size / 2})`}
                />
                <text x={size / 2} y={size / 2} textAnchor="middle" dominantBaseline="central"
                  className="text-sm font-bold fill-navy-900">{readinessScore}</text>
              </svg>
            </div>
          </div>
        </FocalCard>

        {/* Validation results */}
        <AnimatePresence>
          {validationRun && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              {/* RFE Alert Banner */}
              <RFEAlert unresolvedCount={unresolvedCount} />

              <div className="grid grid-cols-5 gap-3">
                {/* Filing checklist (3 cols) */}
                <SupportingModule delay={0.2} className="col-span-3 p-3">
                  <FilingChecklist />
                </SupportingModule>

                {/* Issues list (2 cols) */}
                <div className="col-span-2 space-y-2">
                  {validationIssues.map((issue) => (
                    <IssueCard
                      key={issue.id}
                      issue={issue}
                      isResolved={issues[issue.id]}
                      onFix={issue.fixable ? () => resolveIssue(issue.id) : undefined}
                      isHero={issue.id === 'employer-name'}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </SceneShell>
    </div>
  );
}
