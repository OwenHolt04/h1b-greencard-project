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
  roleContent, eligibilityChecks,
} from '../data/mockData';
import {
  User, Building2, Scale, CheckCircle2, Clock, AlertTriangle,
  ChevronRight, Shield, FileText, TrendingUp, Sparkles,
  Users, BarChart3, DollarSign, TrendingDown, ShieldCheck, ShieldAlert, Bell,
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
  return (
    <div className="space-y-2">
      {/* Case Journey — visual node timeline */}
      <CaseJourney readinessScore={readinessScore} />

      <div className="grid grid-cols-3 gap-2">
      {/* Status (span 2) */}
      <SupportingModule delay={0} className="col-span-2 p-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
            <User size={15} className="text-blue-600" />
          </div>
          <div className="min-w-0">
            <p className="text-base font-semibold text-navy-900">{c.greeting}</p>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">{c.statusSummary}</p>
            <div className="mt-2 px-3 py-2 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-[11px] text-blue-800 font-medium">Next Step</p>
              <p className="text-[11px] text-blue-700 mt-0.5">{c.nextStep}</p>
            </div>
          </div>
        </div>
      </SupportingModule>

      {/* Eligibility */}
      <SupportingModule delay={0.1} className="p-4">
        <div className="flex items-center gap-1.5 mb-2">
          <Sparkles size={13} className="text-blue-500" />
          <p className="text-xs font-semibold text-navy-900">Eligibility Check</p>
        </div>
        <div className="space-y-1.5">
          {eligibilityChecks.slice(0, 6).map((ck) => (
            <div key={ck.id} className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                ck.answer ? 'bg-green-100' : 'bg-amber-100'
              }`}>
                {ck.answer
                  ? <CheckCircle2 size={10} className="text-green-600" />
                  : <AlertTriangle size={10} className="text-amber-600" />}
              </div>
              <span className="text-[11px] text-slate-600">{ck.category}</span>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-green-600 font-medium mt-2">7 / 8 met</p>
      </SupportingModule>

      {/* Alert cards */}
      {c.alerts.map((a, i) => (
        <SupportingModule key={i} delay={0.15 + i * 0.04} className="p-3">
          <p className={`text-xs font-semibold mb-0.5 ${
            a.type === 'success' ? 'text-green-700' : a.type === 'warning' ? 'text-amber-700' : 'text-blue-700'
          }`}>{a.title}</p>
          <p className="text-[11px] text-slate-500 leading-relaxed">{a.body}</p>
        </SupportingModule>
      ))}
      </div>
    </div>
  );
}

/* ── Employer Dashboard — Portfolio Ops View ──────────────────────── */
function EmployerDash() {
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
          {/* Deadline Protection */}
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
            <div className="px-3 py-2 bg-amber-50 rounded-lg border border-amber-200">
              <p className="text-[11px] text-amber-700">Auto-triggers at 90 days · Est. $2,500–4,000</p>
            </div>
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
