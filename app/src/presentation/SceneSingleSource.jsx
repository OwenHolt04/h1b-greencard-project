// ============================================================================
// Scene 1: One Source of Truth — Same case, different priorities
// Applicant tab = Krishna-facing, Employer tab = portfolio ops, Attorney tab = readiness
// ============================================================================

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDemo } from '../context/DemoContext';
import { SceneShell, MaskedHeading, FocalCard, SupportingModule } from './motion';
import {
  applicant, employer, attorney, job, caseRecord, stages,
  roleContent, eligibilityChecks, documentChecklist,
} from '../data/mockData';
import {
  User, Building2, Scale, CheckCircle2, Clock, AlertTriangle,
  ChevronRight, Shield, FileText, TrendingUp, Sparkles,
  Users, BarChart3, DollarSign, TrendingDown, ShieldCheck, ShieldAlert, Bell,
  MessageCircle, ListChecks, BookOpen,
} from 'lucide-react';

/* ── Readiness ring (compact SVG) ─────────────────────────────────── */
function ReadinessRing({ score, size = 56 }) {
  const r = (size - 8) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - score / 100);
  const color = score >= 90 ? '#22c55e' : score >= 70 ? '#f59e0b' : '#ef4444';
  return (
    <svg width={size} height={size} className="shrink-0">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={4} />
      <motion.circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke={color} strokeWidth={4}
        strokeLinecap="round" strokeDasharray={c}
        initial={{ strokeDashoffset: c }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text x={size / 2} y={size / 2} textAnchor="middle" dominantBaseline="central"
        className="text-sm font-bold fill-navy-900">{score}</text>
    </svg>
  );
}

/* ── Readiness bar (thin horizontal) ──────────────────────────────── */
function ReadinessBar({ score }) {
  const color = score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-amber-500' : 'bg-red-500';
  return (
    <div className="flex items-center gap-2">
      <div className="w-14 h-2 rounded-full bg-slate-200 overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        />
      </div>
      <span className="text-[11px] text-slate-500 tabular-nums">{score}%</span>
    </div>
  );
}

/* ── Case Journey — visual node timeline matching website ─────────── */
function CaseJourney({ readinessScore }) {
  const statusLabel = readinessScore >= 90 ? 'Ready' : readinessScore >= 70 ? 'Needs Review' : 'At Risk';
  const statusColor = readinessScore >= 90 ? 'text-green-600' : readinessScore >= 70 ? 'text-amber-600' : 'text-red-600';

  return (
    <FocalCard delay={0.05} className="px-5 py-3">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-navy-900">Case Journey</h3>
        <span className={`text-xs font-semibold ${statusColor}`}>{statusLabel}</span>
      </div>

      {/* Node timeline */}
      <div className="flex items-start justify-between relative">
        {/* Connecting line behind nodes */}
        <div className="absolute top-[14px] left-[16px] right-[16px] h-[3px] flex z-0">
          {stages.map((s, i) => {
            if (i === stages.length - 1) return null;
            const nextS = stages[i + 1];
            const done = s.status === 'complete' && (nextS.status === 'complete' || nextS.status === 'active');
            return (
              <div key={i} className="flex-1">
                <motion.div
                  className={`h-full ${done ? 'bg-green-500' : 'bg-slate-200'}`}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.08 }}
                  style={{ transformOrigin: 'left' }}
                />
              </div>
            );
          })}
        </div>

        {/* Nodes */}
        {stages.map((s, i) => (
          <div key={s.id} className="flex flex-col items-center z-10" style={{ flex: '1 1 0', minWidth: 0 }}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, delay: 0.2 + i * 0.08, type: 'spring', stiffness: 300, damping: 20 }}
              className={`w-[30px] h-[30px] rounded-full flex items-center justify-center shrink-0 ${
                s.status === 'complete'
                  ? 'bg-green-500 text-white shadow-sm'
                  : s.status === 'active'
                  ? 'bg-navy-900 text-white ring-4 ring-blue-100 shadow-md'
                  : 'bg-slate-100 border-2 border-slate-200'
              }`}
            >
              {s.status === 'complete' && <CheckCircle2 size={15} className="text-white" />}
              {s.status === 'active' && <div className="w-2 h-2 rounded-full bg-blue-400" />}
              {s.status === 'upcoming' && <div className="w-2 h-2 rounded-full bg-slate-300" />}
            </motion.div>
            <p className={`text-[10px] font-semibold mt-1.5 text-center leading-tight ${
              s.status === 'active' ? 'text-navy-900' : s.status === 'complete' ? 'text-slate-700' : 'text-slate-400'
            }`}>{s.label}</p>
            <p className="text-[9px] text-slate-400 text-center">{s.date || ''}</p>
            <p className="text-[8px] text-slate-300 text-center uppercase">{s.agency}</p>
          </div>
        ))}
      </div>
    </FocalCard>
  );
}

/* ── Role tab config ──────────────────────────────────────────────── */
const roles = [
  { id: 'applicant', icon: User, label: 'Applicant', accent: 'blue' },
  { id: 'employer', icon: Building2, label: 'Employer / HR', accent: 'amber' },
  { id: 'attorney', icon: Scale, label: 'Attorney', accent: 'emerald' },
];

/* ── Employer portfolio data ──────────────────────────────────────── */
const activeCases = [
  { name: 'Krishna', role: 'Sr. Product Manager', category: 'EB-2', stage: 'I-485 Prep', stageColor: 'bg-blue-100 text-blue-700', readiness: 72, alert: 'H-1B expiry 102 days', alertType: 'warning', highlight: true },
  { name: 'Aisha Patel', role: 'Staff Engineer', category: 'EB-1', stage: 'I-140 Pending', stageColor: 'bg-amber-100 text-amber-700', readiness: 88, alert: 'Premium processing filed', alertType: 'info', highlight: false },
  { name: 'Wei Chen', role: 'Data Scientist', category: 'EB-2', stage: 'PERM Audit', stageColor: 'bg-red-100 text-red-700', readiness: 45, alert: 'DOL audit response due', alertType: 'error', highlight: false },
  { name: 'Maria Santos', role: 'UX Designer', category: 'EB-3', stage: 'PWD Pending', stageColor: 'bg-slate-100 text-slate-600', readiness: 60, alert: 'On track', alertType: 'success', highlight: false },
];

const portfolioMetrics = [
  { label: 'Active Cases', value: '4', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Avg. Readiness', value: '66%', icon: BarChart3, color: 'text-amber-600', bg: 'bg-amber-50' },
  { label: 'RFE Rate', value: '8%', icon: TrendingDown, color: 'text-green-600', bg: 'bg-green-50', subtext: 'Industry: 25%' },
  { label: 'Total Spend', value: '$48K', icon: DollarSign, color: 'text-slate-600', bg: 'bg-slate-50', subtext: 'FY 2025–26' },
];

/* ══════════════════════════════════════════════════════════════════ */
/*  Main Scene                                                       */
/* ══════════════════════════════════════════════════════════════════ */
export default function SceneSingleSource() {
  const { readinessScore, currentRole, switchRole } = useDemo();
  const [activeRole, setActiveRole] = useState(currentRole);

  const handleRole = (role) => {
    setActiveRole(role);
    switchRole(role);
  };

  return (
    <div className="h-full flex flex-col items-center justify-start bg-gradient-to-b from-surface to-white px-4 pt-2 overflow-y-auto">
      <SceneShell maxWidth="max-w-7xl" className="py-0 w-full">
        {/* Title + Role tabs — compact row */}
        <div className="flex items-center justify-between mb-2">
          <MaskedHeading className="text-2xl font-bold text-navy-900">
            One Source of Truth
          </MaskedHeading>
          <div className="flex items-center gap-1">
          {roles.map(({ id, icon: Icon, label }) => {
            const isActive = activeRole === id;
            return (
              <button
                key={id}
                onClick={() => handleRole(id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-navy-900 text-white shadow-md'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Icon size={13} />
                {label}
              </button>
            );
          })}
          </div>
        </div>

        {/* Role-specific dashboard */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeRole}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
          >
            {activeRole === 'applicant' && <ApplicantDash readinessScore={readinessScore} />}
            {activeRole === 'employer' && <EmployerDash />}
            {activeRole === 'attorney' && <AttorneyDash readinessScore={readinessScore} />}
          </motion.div>
        </AnimatePresence>
      </SceneShell>
    </div>
  );
}

/* ── Applicant Dashboard ──────────────────────────────────────────── */
function ApplicantDash({ readinessScore }) {
  const c = roleContent.applicant;

  // I-485 stage checklist (the active filing stage)
  const i485Stage = documentChecklist.find(s => s.stage.startsWith('I-485'));
  const i485Docs = i485Stage?.documents || [];

  // Checklist auto-update: "Employment verification letter from HPE" transitions missing→done
  const [docReceived, setDocReceived] = useState(false);
  const [showDocToast, setShowDocToast] = useState(false);
  const UPDATED_DOC_INDEX = i485Docs.findIndex(d => d.name.startsWith('Employment verification'));

  const effectiveDocs = i485Docs.map((doc, i) => {
    if (i === UPDATED_DOC_INDEX && docReceived) {
      return { ...doc, status: 'done', flag: undefined };
    }
    return doc;
  });

  const doneCount = effectiveDocs.filter(d => d.status === 'done').length;
  const totalCount = effectiveDocs.length;

  const handleChecklistUpdate = () => {
    if (docReceived) return;
    setShowDocToast(true);
    setTimeout(() => setDocReceived(true), 600);
    setTimeout(() => setShowDocToast(false), 3500);
  };

  // Chatbot: one-click interaction
  const [chatAsked, setChatAsked] = useState(false);
  const handleChatAsk = () => {
    if (chatAsked) return;
    setChatAsked(true);
  };

  return (
    <div className="space-y-2">
      {/* Case Journey — visual node timeline */}
      <CaseJourney readinessScore={readinessScore} />

      {/* Row 2: Plain-language guidance + Eligibility */}
      <div className="grid grid-cols-3 gap-2">
        {/* Plain-Language Guidance Panel */}
        <FocalCard delay={0.05} className="col-span-2 p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
              <BookOpen size={14} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-navy-900">Your Case in Plain Language</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">No legal jargon — just what you need to know</p>
            </div>
          </div>

          <div className="space-y-2.5">
            <div className="flex items-start gap-2.5">
              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded mt-0.5 shrink-0 uppercase">Where you are</span>
              <p className="text-xs text-slate-700 leading-relaxed">You're at step 6 of 8. Your employer's petition was approved, and after years of waiting, your priority date is finally current. You're now preparing the I-485 — the actual green card application.</p>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded mt-0.5 shrink-0 uppercase">What's next</span>
              <p className="text-xs text-slate-700 leading-relaxed">
                {docReceived
                  ? 'Your attorney is finalizing the filing package. One document is still needed: your December 2023 travel dates.'
                  : 'Your attorney is finalizing the filing package. Two documents are still needed: an employment verification letter from HPE and your December 2023 travel dates.'}
              </p>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded mt-0.5 shrink-0 uppercase">Your action</span>
              <p className="text-xs text-slate-700 leading-relaxed">Confirm your December 2023 travel dates. Your attorney and HR are handling everything else. Filing target: March 17–20 while your date remains current.</p>
            </div>
          </div>
        </FocalCard>

        {/* Eligibility — plain language */}
        <SupportingModule delay={0.1} className="p-4">
          <div className="flex items-center gap-1.5 mb-2">
            <Sparkles size={13} className="text-blue-500" />
            <p className="text-xs font-semibold text-navy-900">Eligibility Check</p>
          </div>
          <div className="space-y-1.5">
            {eligibilityChecks.map((ck) => (
              <div key={ck.id} className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded flex items-center justify-center shrink-0 ${
                  ck.answer ? 'bg-green-100' : 'bg-amber-100'
                }`}>
                  {ck.answer
                    ? <CheckCircle2 size={10} className="text-green-600" />
                    : <AlertTriangle size={10} className="text-amber-600" />}
                </div>
                <span className="text-[11px] text-slate-600">{ck.plain || ck.category}</span>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-green-600 font-medium mt-2">7 / 8 met</p>
        </SupportingModule>
      </div>

      {/* Row 3: Consolidated Checklist + Chatbot Helper */}
      <div className="grid grid-cols-3 gap-2">
        {/* Consolidated Checklist */}
        <SupportingModule delay={0.15} className="col-span-2 p-4 relative">
          {/* System notification toast */}
          <AnimatePresence>
            {showDocToast && (
              <motion.div
                initial={{ opacity: 0, y: -8, x: '-50%' }}
                animate={{ opacity: 1, y: 0, x: '-50%' }}
                exit={{ opacity: 0, y: -8, x: '-50%' }}
                className="absolute -top-2 left-1/2 z-10 px-4 py-2 bg-green-600 text-white rounded-lg shadow-lg flex items-center gap-2"
              >
                <CheckCircle2 size={13} />
                <span className="text-[11px] font-medium whitespace-nowrap">HPE HR submitted: Employment verification letter</span>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <ListChecks size={15} className="text-navy-900" />
              <p className="text-sm font-semibold text-navy-900">Filing Checklist</p>
              <span className="text-[10px] text-slate-400 font-medium">I-485 Package</span>
            </div>
            <div className="flex items-center gap-1.5">
              {/* Notification badge — click to trigger system update */}
              {!docReceived && (
                <button
                  onClick={handleChecklistUpdate}
                  className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-medium cursor-pointer hover:bg-blue-200 transition-colors"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                  1 new
                </button>
              )}
              <motion.span
                key={doneCount}
                initial={{ scale: 1.3 }}
                animate={{ scale: 1 }}
                className="text-xs font-bold text-navy-900"
              >{doneCount}/{totalCount}</motion.span>
              <div className="w-16 h-1.5 rounded-full bg-slate-200 overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-blue-500"
                  animate={{ width: `${(doneCount / totalCount) * 100}%` }}
                  transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                />
              </div>
              <span className="text-[10px] text-slate-400 italic">auto-updates</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-3 gap-y-1">
            {effectiveDocs.map((doc, i) => {
              const justUpdated = i === UPDATED_DOC_INDEX && docReceived;
              return (
                <motion.div
                  key={i}
                  className="flex items-start gap-2 py-0.5"
                  animate={justUpdated ? { backgroundColor: ['rgba(34,197,94,0.15)', 'rgba(34,197,94,0)'] } : {}}
                  transition={justUpdated ? { duration: 1.5, delay: 0.2 } : {}}
                  style={{ borderRadius: 4 }}
                >
                  <div className={`w-4 h-4 rounded flex items-center justify-center shrink-0 mt-0.5 transition-colors duration-500 ${
                    doc.status === 'done' ? 'bg-green-100 border border-green-300' :
                    doc.status === 'missing' ? 'bg-red-50 border border-red-300' :
                    doc.status === 'flagged' ? 'bg-amber-50 border border-amber-300' :
                    'bg-slate-50 border border-slate-300'
                  }`}>
                    {doc.status === 'done' && <CheckCircle2 size={10} className="text-green-600" />}
                    {doc.status === 'missing' && <AlertTriangle size={10} className="text-red-500" />}
                    {doc.status === 'flagged' && <AlertTriangle size={10} className="text-amber-500" />}
                    {doc.status === 'pending' && <Clock size={10} className="text-slate-400" />}
                  </div>
                  <div className="min-w-0">
                    <p className={`text-[11px] leading-tight transition-all duration-500 ${
                      doc.status === 'done' ? 'text-slate-400 line-through' :
                      doc.status === 'missing' ? 'text-red-700 font-medium' :
                      doc.status === 'flagged' ? 'text-amber-700 font-medium' :
                      'text-slate-600'
                    }`}>{doc.name}</p>
                    {doc.flag && (
                      <p className="text-[9px] text-red-500 mt-0.5">{doc.flag}</p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </SupportingModule>

        {/* Immigration Help — Chatbot / Explainer */}
        <SupportingModule delay={0.2} className="p-4 flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center shrink-0">
              <MessageCircle size={14} className="text-indigo-600" />
            </div>
            <div>
              <p className="text-xs font-semibold text-navy-900">Immigration Help</p>
              <p className="text-[10px] text-slate-400">Ask anything about your case</p>
            </div>
          </div>

          {/* Conversation */}
          <div className="space-y-2 flex-1 overflow-y-auto">
            {/* First Q&A — always visible */}
            <div className="bg-slate-100 rounded-lg px-3 py-2">
              <p className="text-[11px] text-slate-700">What does "priority date current" mean?</p>
            </div>
            <div className="bg-indigo-50 rounded-lg px-3 py-2 border border-indigo-100">
              <p className="text-[11px] text-indigo-900 leading-relaxed">It means your place in line has been reached. The government processes green cards in order of priority dates. Yours (March 2022) is now eligible because EB-2 India dates advanced to April 2022 in the February 2026 bulletin. <span className="font-medium">This is your filing window.</span></p>
            </div>

            {/* Second Q&A — appears on click */}
            <AnimatePresence>
              {chatAsked && (
                <>
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-slate-100 rounded-lg px-3 py-2"
                  >
                    <p className="text-[11px] text-slate-700">Can I travel while my I-485 is pending?</p>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.8 }}
                    className="bg-indigo-50 rounded-lg px-3 py-2 border border-indigo-100"
                  >
                    <p className="text-[11px] text-indigo-900 leading-relaxed">You'll need Advance Parole (I-131) before traveling. Your attorney is filing this with your package. <span className="font-medium">Do not travel without it</span> — it could abandon your application.</p>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Input area — clickable suggested question */}
          {!chatAsked ? (
            <button
              onClick={handleChatAsk}
              className="mt-2 flex items-center gap-2 px-3 py-2 bg-indigo-50 rounded-lg border border-indigo-200 cursor-pointer hover:bg-indigo-100 transition-colors text-left w-full"
            >
              <p className="text-[11px] text-indigo-600 flex-1">Can I travel while my I-485 is pending?</p>
              <ChevronRight size={13} className="text-indigo-400" />
            </button>
          ) : (
            <div className="mt-2 flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg border border-slate-200">
              <p className="text-[11px] text-slate-400 flex-1">Ask about your case...</p>
              <MessageCircle size={13} className="text-indigo-400" />
            </div>
          )}
        </SupportingModule>
      </div>
    </div>
  );
}

/* ── Employer Dashboard — Portfolio Ops View ──────────────────────── */
function EmployerDash() {
  const [deadlineExpanded, setDeadlineExpanded] = useState(false);

  return (
    <div className="space-y-2">
      {/* Metrics strip */}
      <div className="grid grid-cols-4 gap-2">
        {portfolioMetrics.map((m) => {
          const Icon = m.icon;
          return (
            <SupportingModule key={m.label} delay={0.05} className={`p-3.5 ${m.bg}`}>
              <div className="flex items-center gap-2 mb-1">
                <Icon size={15} className={m.color} />
                <span className="text-xs text-slate-500 font-medium">{m.label}</span>
              </div>
              <p className={`text-2xl font-bold ${m.color}`}>{m.value}</p>
              {m.subtext && <p className="text-[11px] text-slate-400 mt-0.5">{m.subtext}</p>}
            </SupportingModule>
          );
        })}
      </div>

      <div className="grid grid-cols-3 gap-2">
        {/* Active Cases Table (2 cols) */}
        <FocalCard delay={0.1} className="col-span-2 p-0 overflow-hidden">
          <div className="px-4 py-2.5 bg-navy-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users size={14} />
              <span className="text-sm font-semibold">Active Cases</span>
            </div>
            <span className="text-[11px] text-white/60">{employer.displayName} Immigration Portfolio</span>
          </div>
          {/* Header */}
          <div className="grid grid-cols-12 gap-2 px-4 py-2 bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            <span className="col-span-3">Employee</span>
            <span className="col-span-2">Category</span>
            <span className="col-span-2">Stage</span>
            <span className="col-span-2">Readiness</span>
            <span className="col-span-3">Alert</span>
          </div>
          {/* Rows */}
          {activeCases.map((c, i) => (
            <div key={i} className={`grid grid-cols-12 gap-2 px-4 py-3 border-b border-slate-100 items-center ${
              c.highlight ? 'bg-blue-50/50 border-l-2 border-l-blue-500' : ''
            }`}>
              <div className="col-span-3">
                <p className="text-sm font-medium text-navy-900">{c.name}</p>
                <p className="text-[11px] text-slate-400">{c.role}</p>
              </div>
              <span className="col-span-2 text-xs font-medium text-slate-700">{c.category}</span>
              <span className={`col-span-2 text-[11px] px-2 py-0.5 rounded-full font-medium ${c.stageColor} w-fit`}>{c.stage}</span>
              <div className="col-span-2"><ReadinessBar score={c.readiness} /></div>
              <span className={`col-span-3 text-[11px] font-medium ${
                c.alertType === 'error' ? 'text-red-600' : c.alertType === 'warning' ? 'text-amber-600' : c.alertType === 'success' ? 'text-green-600' : 'text-blue-600'
              }`}>{c.alert}</span>
            </div>
          ))}
        </FocalCard>

        {/* Right sidebar: deadline + actions (1 col) */}
        <div className="space-y-2">
          {/* Deadline Protection — clickable to expand extension plan */}
          <SupportingModule delay={0.15} className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <ShieldAlert size={16} className="text-amber-500" />
              <p className="text-sm font-semibold text-navy-900">H-1B Deadline</p>
            </div>
            <div className="text-center mb-2">
              <p className="text-4xl font-bold text-amber-600">102</p>
              <p className="text-sm text-slate-500">days until expiry</p>
              <p className="text-[11px] text-slate-400 mt-0.5">{applicant.fullName} · June 15, 2026</p>
            </div>

            {/* Expandable extension plan */}
            <button
              onClick={() => setDeadlineExpanded(!deadlineExpanded)}
              className="w-full px-3 py-2 bg-amber-50 rounded-lg border border-amber-200 cursor-pointer hover:bg-amber-100 transition-colors text-left"
            >
              <div className="flex items-center justify-between">
                <p className="text-[11px] text-amber-700 font-medium">
                  {deadlineExpanded ? 'Auto-Extension Plan' : 'Auto-triggers at 90 days'}
                </p>
                <motion.div
                  animate={{ rotate: deadlineExpanded ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronRight size={12} className="text-amber-500" />
                </motion.div>
              </div>
            </button>

            <AnimatePresence>
              {deadlineExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                  className="overflow-hidden"
                >
                  <div className="mt-2 space-y-1.5">
                    {[
                      { day: '90 days', label: 'Auto-alert sent to HR + attorney', done: false },
                      { day: '85 days', label: 'Extension petition prepared', done: false },
                      { day: '75 days', label: 'Budget approval ($2,500–4,000)', done: false },
                      { day: '60 days', label: 'Extension filed with USCIS', done: false },
                    ].map((step, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full border-2 border-amber-300 shrink-0" />
                        <div className="flex-1">
                          <span className="text-[10px] font-bold text-amber-700">{step.day}</span>
                          <span className="text-[10px] text-slate-500 ml-1.5">{step.label}</span>
                        </div>
                      </div>
                    ))}
                    <p className="text-[9px] text-slate-400 mt-1 italic">Zero-gap coverage — no lapse in work authorization</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </SupportingModule>

          {/* Action Items */}
          <SupportingModule delay={0.2} className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Bell size={14} className="text-slate-500" />
              <p className="text-sm font-semibold text-navy-900">Action Items</p>
            </div>
            <div className="space-y-2">
              {[
                { urgent: true, text: 'Approve H-1B extension budget — Krishna' },
                { urgent: true, text: 'Respond to DOL PERM audit — Chen' },
                { urgent: false, text: 'Sign employment verification — Krishna' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div className={`w-4.5 h-4.5 rounded flex items-center justify-center shrink-0 mt-0.5 ${
                    item.urgent ? 'bg-red-100' : 'bg-slate-100'
                  }`}>
                    {item.urgent
                      ? <AlertTriangle size={10} className="text-red-500" />
                      : <FileText size={10} className="text-slate-400" />}
                  </div>
                  <p className={`text-xs leading-relaxed ${
                    item.urgent ? 'text-navy-900 font-medium' : 'text-slate-600'
                  }`}>{item.text}</p>
                </div>
              ))}
            </div>
          </SupportingModule>
        </div>
      </div>
    </div>
  );
}

/* ── Attorney Dashboard — Filing Readiness + Issues ──────────────── */
function AttorneyDash({ readinessScore }) {
  const c = roleContent.attorney;

  const issues = [
    { severity: 'HIGH', color: 'bg-red-100 text-red-700 border-red-200', title: 'SOC / Wage Survey Mismatch', detail: 'Q4 vs Q2 2023 wage survey discrepancy across ETA-9089 and I-140', forms: ['ETA-9089', 'I-140'] },
    { severity: 'MED', color: 'bg-amber-100 text-amber-700 border-amber-200', title: 'Employer Name Format', detail: '"Hewlett-Packard" vs "Hewlett Packard" — inconsistency in 3 forms', forms: ['I-140', 'I-485', 'ETA-9089'] },
    { severity: 'LOW', color: 'bg-blue-100 text-blue-700 border-blue-200', title: 'Travel History Gap', detail: '3-week gap Dec 2023 — applicant to confirm', forms: ['I-485'] },
  ];

  const evidence = [
    { name: 'Passport + visa stamps', status: 'done', count: 6 },
    { name: 'I-94 arrival record', status: 'done', count: 5 },
    { name: 'Employment verification', status: 'missing', count: 2 },
    { name: 'Travel history (5yr)', status: 'flagged', count: 1 },
    { name: 'Degree evaluation', status: 'done', count: 2 },
  ];

  return (
    <div className="grid grid-cols-3 gap-2">
      {/* Left: Readiness + Issues (2 cols) */}
      <div className="col-span-2 space-y-2">
        {/* Readiness header */}
        <FocalCard delay={0} className="p-4">
          <div className="flex items-center gap-5">
            <ReadinessRing score={readinessScore} size={64} />
            <div className="flex-1 min-w-0">
              <p className="text-lg font-semibold text-navy-900">{c.greeting}</p>
              <p className="text-sm text-slate-500 mt-0.5">I-485 concurrent filing · 3 issues blocking submission</p>
              <div className="flex items-center gap-4 mt-2 text-xs">
                <span className="text-slate-500">Est. filing-ready: <span className="font-semibold text-navy-900">5–7 days</span></span>
                <span className="text-amber-600 font-medium">Time-sensitive — date may retrogress</span>
              </div>
            </div>
          </div>
        </FocalCard>

        {/* Issue cards */}
        {issues.map((issue, i) => (
          <SupportingModule key={i} delay={0.08 + i * 0.04} className="p-4">
            <div className="flex items-center gap-2 mb-1.5">
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase border ${issue.color}`}>
                {issue.severity}
              </span>
              <span className="text-sm font-semibold text-navy-900">{issue.title}</span>
            </div>
            <p className="text-xs text-slate-500 mb-2">{issue.detail}</p>
            <div className="flex items-center gap-1.5">
              {issue.forms.map((f) => (
                <span key={f} className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">{f}</span>
              ))}
            </div>
          </SupportingModule>
        ))}
      </div>

      {/* Right: Evidence + Docs (1 col) */}
      <div className="space-y-2">
        {/* Evidence Status */}
        <SupportingModule delay={0.1} className="p-4">
          <p className="text-sm font-semibold text-navy-900 mb-2">Evidence Bundle</p>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-green-600 font-bold text-xl">21</span>
            <span className="text-slate-400 text-sm">/</span>
            <span className="text-slate-600 font-bold text-xl">23</span>
            <span className="text-xs text-slate-400">documents collected</span>
          </div>
          <div className="space-y-2">
            {evidence.map((e, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {e.status === 'done' && <CheckCircle2 size={12} className="text-green-500" />}
                  {e.status === 'missing' && <AlertTriangle size={12} className="text-red-500" />}
                  {e.status === 'flagged' && <AlertTriangle size={12} className="text-amber-500" />}
                  <span className="text-xs text-slate-600">{e.name}</span>
                </div>
                <span className="text-[11px] text-slate-400">{e.count} forms</span>
              </div>
            ))}
          </div>
        </SupportingModule>

        {/* Next Steps */}
        <SupportingModule delay={0.15} className="p-4">
          <p className="text-sm font-semibold text-navy-900 mb-2">Attorney Next Steps</p>
          <div className="space-y-2">
            {c.actions.map((action, i) => (
              <div key={i} className="flex items-start gap-2">
                <div className="w-5 h-5 rounded border border-slate-300 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-[10px] text-slate-400 font-bold">{i + 1}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{action}</p>
              </div>
            ))}
          </div>
        </SupportingModule>

        {/* Alert */}
        <SupportingModule delay={0.2} className="p-3.5 bg-emerald-50 border-emerald-200">
          <p className="text-xs text-emerald-700 font-medium">Target: file March 17–20 while date remains current</p>
        </SupportingModule>
      </div>
    </div>
  );
}
