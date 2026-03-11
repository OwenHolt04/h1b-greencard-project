// ============================================================================
// Scene 4: Employer Operations — Active Cases, Deadlines, Extension Management
// Portfolio-level employer dashboard for immigration case management
// ============================================================================

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDemo } from '../context/DemoContext';
import { SceneShell, MaskedHeading, FocalCard, SupportingModule, StaggerGroup, StaggerItem } from './motion';
import { applicant, employer } from '../data/mockData';
import {
  Building2, Clock, Shield, ShieldCheck, ShieldAlert, AlertTriangle,
  CheckCircle2, Users, DollarSign, TrendingDown, BarChart3, Bell,
  ChevronRight, FileText, Zap,
} from 'lucide-react';

/* ── Mock portfolio data (employer has multiple cases) ────────────── */
const activeCases = [
  {
    id: 'CB-2022-003291',
    name: 'Krishna',
    role: 'Sr. Product Manager',
    category: 'EB-2',
    stage: 'I-485 Prep',
    stageColor: 'bg-blue-100 text-blue-700',
    readiness: 72,
    alert: 'H-1B expiry 102 days',
    alertType: 'warning',
    highlight: true,
  },
  {
    id: 'CB-2023-004812',
    name: 'Aisha Patel',
    role: 'Staff Engineer',
    category: 'EB-1',
    stage: 'I-140 Pending',
    stageColor: 'bg-amber-100 text-amber-700',
    readiness: 88,
    alert: 'Premium processing filed',
    alertType: 'info',
    highlight: false,
  },
  {
    id: 'CB-2024-005337',
    name: 'Wei Chen',
    role: 'Data Scientist',
    category: 'EB-2',
    stage: 'PERM Audit',
    stageColor: 'bg-red-100 text-red-700',
    readiness: 45,
    alert: 'DOL audit response due',
    alertType: 'error',
    highlight: false,
  },
  {
    id: 'CB-2024-006021',
    name: 'Maria Santos',
    role: 'UX Designer',
    category: 'EB-3',
    stage: 'PWD Pending',
    stageColor: 'bg-slate-100 text-slate-600',
    readiness: 60,
    alert: 'On track',
    alertType: 'success',
    highlight: false,
  },
];

const portfolioMetrics = [
  { label: 'Active Cases', value: '4', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Avg. Readiness', value: '66%', icon: BarChart3, color: 'text-amber-600', bg: 'bg-amber-50' },
  { label: 'RFE Rate (YTD)', value: '8%', icon: TrendingDown, color: 'text-green-600', bg: 'bg-green-50', subtext: 'Industry avg: 25%' },
  { label: 'Total Spend', value: '$48K', icon: DollarSign, color: 'text-slate-600', bg: 'bg-slate-50', subtext: 'FY 2025–26' },
];

const actionItems = [
  { priority: 'urgent', text: 'Approve H-1B extension budget — Krishna (102 days)', icon: Clock },
  { priority: 'urgent', text: 'Respond to DOL PERM audit — Chen (deadline 3/20)', icon: AlertTriangle },
  { priority: 'normal', text: 'Sign employment verification letter — Krishna', icon: FileText },
  { priority: 'normal', text: 'Review I-140 premium processing invoice — Patel', icon: DollarSign },
];

/* ── Readiness bar (thin horizontal) ──────────────────────────────── */
function ReadinessBar({ score }) {
  const color = score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-amber-500' : 'bg-red-500';
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-12 h-1.5 rounded-full bg-slate-200 overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        />
      </div>
      <span className="text-[9px] text-slate-500 tabular-nums">{score}%</span>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════ */
/*  Main Scene                                                       */
/* ══════════════════════════════════════════════════════════════════ */
export default function SceneEmployerOps() {
  const [managed, setManaged] = useState(false);

  return (
    <div className="h-full flex flex-col items-center justify-center bg-gradient-to-b from-surface to-white px-6 overflow-y-auto">
      <SceneShell maxWidth="max-w-5xl" className="py-4">
        {/* Title */}
        <MaskedHeading className="text-2xl font-bold text-navy-900 text-center mb-0.5">
          Employer Operations
        </MaskedHeading>
        <p className="text-sm text-slate-500 text-center mb-4">
          Deadlines, costs, and continuity risk — all in one view
        </p>

        {/* Portfolio metrics strip */}
        <StaggerGroup stagger={0.06} delay={0.1} className="grid grid-cols-4 gap-2 mb-3">
          {portfolioMetrics.map((m) => {
            const Icon = m.icon;
            return (
              <StaggerItem key={m.label}>
                <div className={`rounded-xl border border-slate-200 p-3 ${m.bg}`}>
                  <div className="flex items-center gap-1.5 mb-1">
                    <Icon size={13} className={m.color} />
                    <span className="text-[10px] text-slate-500 font-medium">{m.label}</span>
                  </div>
                  <p className={`text-lg font-bold ${m.color}`}>{m.value}</p>
                  {m.subtext && <p className="text-[9px] text-slate-400">{m.subtext}</p>}
                </div>
              </StaggerItem>
            );
          })}
        </StaggerGroup>

        <div className="grid grid-cols-5 gap-3">
          {/* ─── LEFT: Active Cases Table (3 cols) ─── */}
          <FocalCard delay={0.15} className="col-span-3 p-0 overflow-hidden">
            <div className="px-4 py-2.5 bg-navy-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users size={13} />
                <span className="text-xs font-semibold">Active Cases</span>
              </div>
              <span className="text-[9px] text-white/60">{employer.displayName} Immigration Portfolio</span>
            </div>

            {/* Table header */}
            <div className="grid grid-cols-12 gap-2 px-3 py-1.5 bg-slate-50 border-b border-slate-200 text-[9px] font-semibold text-slate-400 uppercase tracking-wider">
              <span className="col-span-3">Employee</span>
              <span className="col-span-2">Category</span>
              <span className="col-span-2">Stage</span>
              <span className="col-span-2">Readiness</span>
              <span className="col-span-3">Alert</span>
            </div>

            {/* Rows */}
            {activeCases.map((c) => (
              <div
                key={c.id}
                className={`grid grid-cols-12 gap-2 px-3 py-2 border-b border-slate-100 items-center ${
                  c.highlight ? 'bg-blue-50/50 border-l-2 border-l-blue-500' : ''
                }`}
              >
                <div className="col-span-3">
                  <p className={`text-[11px] font-medium ${c.highlight ? 'text-navy-900' : 'text-navy-900'}`}>
                    {c.name}
                  </p>
                  <p className="text-[9px] text-slate-400">{c.role}</p>
                </div>
                <div className="col-span-2">
                  <span className="text-[10px] font-medium text-slate-700">{c.category}</span>
                </div>
                <div className="col-span-2">
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${c.stageColor}`}>
                    {c.stage}
                  </span>
                </div>
                <div className="col-span-2">
                  <ReadinessBar score={c.readiness} />
                </div>
                <div className="col-span-3">
                  <span className={`text-[9px] font-medium ${
                    c.alertType === 'error' ? 'text-red-600' :
                    c.alertType === 'warning' ? 'text-amber-600' :
                    c.alertType === 'success' ? 'text-green-600' :
                    'text-blue-600'
                  }`}>
                    {c.alert}
                  </span>
                </div>
              </div>
            ))}
          </FocalCard>

          {/* ─── RIGHT: Deadline + Actions (2 cols) ─── */}
          <div className="col-span-2 space-y-2">
            {/* Deadline Protection card */}
            <SupportingModule delay={0.2} className="p-3">
              <div className="flex items-center gap-1.5 mb-2">
                {managed
                  ? <ShieldCheck size={14} className="text-green-500" />
                  : <ShieldAlert size={14} className="text-amber-500" />}
                <p className="text-[11px] font-semibold text-navy-900">H-1B Deadline Protection</p>
              </div>

              {/* Countdown */}
              <div className="text-center mb-2">
                <p className={`text-3xl font-bold ${managed ? 'text-green-600' : 'text-amber-600'}`}>102</p>
                <p className="text-[10px] text-slate-500">days until H-1B expiry</p>
                <p className="text-[9px] text-slate-400">{applicant.fullName} · June 15, 2026</p>
              </div>

              {/* Progress bar */}
              <div className="relative h-2 rounded-full bg-slate-200 overflow-hidden mb-2">
                <motion.div
                  className={`absolute inset-y-0 left-0 rounded-full ${managed ? 'bg-green-500' : 'bg-amber-500'}`}
                  initial={{ width: 0 }}
                  animate={{ width: '72%' }}
                  transition={{ duration: 0.8, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
                />
              </div>
              <div className="flex justify-between text-[8px] text-slate-400 mb-2">
                <span>Today</span>
                <span>Expiry</span>
              </div>

              {/* State swap */}
              <AnimatePresence mode="wait">
                {!managed ? (
                  <motion.div
                    key="at-risk"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="px-2 py-1.5 bg-amber-50 rounded-lg border border-amber-200 mb-2">
                      <p className="text-[9px] text-amber-700">Without CaseBridge: manual tracking, missed deadlines, rush fees ($5,000+)</p>
                    </div>
                    <button
                      onClick={() => setManaged(true)}
                      className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-navy-900 text-white text-[10px] font-medium hover:bg-navy-800 transition-colors cursor-pointer"
                    >
                      <ShieldCheck size={11} /> Activate Auto-Extension
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="managed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="px-2 py-1.5 bg-green-50 rounded-lg border border-green-200"
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <CheckCircle2 size={10} className="text-green-500" />
                      <span className="text-[9px] text-green-700 font-medium">Auto-triggered at 90 days</span>
                    </div>
                    <div className="grid grid-cols-2 gap-1 text-[8px]">
                      <span className="text-slate-500">Trigger date</span>
                      <span className="text-navy-900 font-medium">Mar 17, 2026</span>
                      <span className="text-slate-500">Est. cost</span>
                      <span className="text-navy-900 font-medium">$2,500–4,000</span>
                      <span className="text-slate-500">HR owner</span>
                      <span className="text-navy-900 font-medium">Rachel Torres</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </SupportingModule>

            {/* Action Items */}
            <SupportingModule delay={0.3} className="p-3">
              <div className="flex items-center gap-1.5 mb-2">
                <Bell size={12} className="text-slate-500" />
                <p className="text-[11px] font-semibold text-navy-900">Action Items</p>
              </div>
              <div className="space-y-1.5">
                {actionItems.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i} className="flex items-start gap-1.5">
                      <div className={`w-4 h-4 rounded flex items-center justify-center shrink-0 mt-0.5 ${
                        item.priority === 'urgent' ? 'bg-red-100' : 'bg-slate-100'
                      }`}>
                        <Icon size={9} className={item.priority === 'urgent' ? 'text-red-500' : 'text-slate-400'} />
                      </div>
                      <p className={`text-[9px] leading-relaxed ${
                        item.priority === 'urgent' ? 'text-navy-900 font-medium' : 'text-slate-600'
                      }`}>{item.text}</p>
                    </div>
                  );
                })}
              </div>
            </SupportingModule>
          </div>
        </div>
      </SceneShell>
    </div>
  );
}
