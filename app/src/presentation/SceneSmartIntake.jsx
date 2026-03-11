// ============================================================================
// Scene 2: Smart Intake — Real Form with Sidebar Navigation + Visible Input Fields
// Enter data once. Auto-populate across 6 immigration forms.
// ============================================================================

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDemo } from '../context/DemoContext';
import { SceneShell, MaskedHeading, FocalCard, SupportingModule } from './motion';
import { formPackage, employer } from '../data/mockData';
import {
  FileText, CheckCircle2, ArrowRight, Pencil, RefreshCw,
} from 'lucide-react';

const EASE = [0.4, 0, 0.2, 1];

/* ── Sidebar nav sections ─────────────────────────────────────────── */
const sidebarSections = [
  { id: 'employer', label: 'Employer Info' },
  { id: 'beneficiary', label: 'Beneficiary Info' },
  { id: 'position', label: 'Position Details' },
  { id: 'wage', label: 'Wage & LCA' },
  { id: 'recruitment', label: 'Recruitment' },
  { id: 'workHistory', label: 'Work History' },
  { id: 'generate', label: 'Generate Docs' },
];

/* ── Form data for the active "Employer Info" section ─────────────── */
const employerFormFields = [
  {
    sectionLabel: 'Company Identity',
    fields: [
      { key: 'companyName', label: 'Company / Organization Name', value: 'Hewlett-Packard Enterprise', syncCount: 4, fullWidth: true, editable: true, hasMismatch: true },
      { key: 'fein', label: 'Federal Employer ID (FEIN)', value: 'XX-XXXXXXX', syncCount: 5, fullWidth: false },
      { key: 'naics', label: 'NAICS Code', value: '541512', syncCount: 3, fullWidth: false },
      { key: 'yearEstablished', label: 'Year Established', value: '2015', syncCount: 2, fullWidth: false },
      { key: 'totalEmployees', label: 'Total U.S. Employees', value: '~62,000', syncCount: 3, fullWidth: false },
    ],
  },
  {
    sectionLabel: 'Mailing Address',
    subtext: '→ propagates to all forms',
    fields: [
      { key: 'street', label: 'Street Address', value: '1701 E Mossy Oaks Rd', syncCount: 5, fullWidth: true },
      { key: 'city', label: 'City', value: 'Spring', syncCount: 5, fullWidth: false },
      { key: 'state', label: 'State', value: 'TX', syncCount: 5, fullWidth: false },
      { key: 'zip', label: 'ZIP Code', value: '77389', syncCount: 5, fullWidth: false },
      { key: 'phone', label: 'Phone', value: '(281) 370-0670', syncCount: 4, fullWidth: false },
    ],
  },
];

/* ── Shared-across pill tags ─────────────────────────────────────── */
const sharedForms = ['I-129', 'I-140', 'ETA-9089', 'ETA-9142A'];

/* ── Downstream form references for employer name ─────────────────── */
const affectedForms = ['ETA-9089', 'I-140', 'I-485'];
const affectedFieldMap = {
  'ETA-9089': 'Section F: Employer Name → Hewlett Packard Enterprise',
  'I-140': 'Part 1, Item 2: Company Name → Hewlett Packard Enterprise',
  'I-485': 'Part 2, Item 1: Petitioner → Hewlett Packard Enterprise',
};

/* ══════════════════════════════════════════════════════════════════ */
/*  Main Scene                                                       */
/* ══════════════════════════════════════════════════════════════════ */
export default function SceneSmartIntake() {
  const { employerNameFixed, resolveIssue, syncing } = useDemo();
  const [showSync, setShowSync] = useState(false);
  const [companyValue, setCompanyValue] = useState('Hewlett-Packard Enterprise');
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const handleFix = () => {
    setCompanyValue(employer.legalName);
    resolveIssue('employer-name');
    setShowSync(true);
    setTimeout(() => setShowSync(false), 2500);
  };

  const handleCommit = () => {
    setEditing(false);
    if (companyValue === employer.legalName) {
      resolveIssue('employer-name');
      setShowSync(true);
      setTimeout(() => setShowSync(false), 2500);
    }
  };

  const isFixed = employerNameFixed;
  const displayValue = isFixed ? employer.legalName : companyValue;
  const isSyncing = showSync || (isFixed && syncing);

  return (
    <div className="h-full flex flex-col items-center justify-center bg-gradient-to-b from-surface to-white px-6 overflow-y-auto">
      <SceneShell maxWidth="max-w-5xl" className="py-4">
        {/* Title */}
        <MaskedHeading className="text-2xl font-bold text-navy-900 text-center mb-0.5">
          Smart Intake
        </MaskedHeading>
        <p className="text-sm text-slate-500 text-center mb-4">
          Enter once. Auto-populate across 6 immigration forms.
        </p>

        <div className="grid grid-cols-12 gap-3">
          {/* ─── LEFT SIDEBAR: Section Navigation (2 cols) ─── */}
          <div className="col-span-2">
            <FocalCard delay={0.05} className="p-0 overflow-hidden">
              <div className="py-2">
                {sidebarSections.map((s, i) => (
                  <div
                    key={s.id}
                    className={`flex items-center gap-2 px-3 py-2 text-xs font-medium cursor-default transition-colors ${
                      i === 0
                        ? 'bg-navy-900 text-white'
                        : 'text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-blue-400' : 'bg-slate-300'}`} />
                    {s.label}
                  </div>
                ))}
              </div>

              {/* Auto-sync badge */}
              <div className="mx-3 mb-3 mt-1 px-2.5 py-2 bg-green-50 rounded-lg border border-green-200">
                <p className="text-[10px] font-bold text-green-700 uppercase tracking-wider">Auto-Sync Active</p>
                <p className="text-[9px] text-green-600 mt-0.5">Changes propagate to all 7 forms instantly</p>
              </div>
            </FocalCard>
          </div>

          {/* ─── CENTER: Form Content (7 cols) ─── */}
          <FocalCard delay={0.1} className="col-span-7 p-0 overflow-hidden">
            {/* Form header */}
            <div className="px-5 py-3 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold text-navy-900">Employer Information</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Shared across: I-129 Part 1, I-140 Part 1, ETA-9089 Sec C, ETA-9142A Sec B
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  {sharedForms.map((f) => (
                    <span key={f} className="text-[10px] px-2 py-0.5 rounded bg-navy-900/8 text-navy-900 font-medium">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Sync notification */}
            <AnimatePresence>
              {isSyncing && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="px-5 py-1.5 bg-green-50 border-b border-green-200 flex items-center gap-2"
                >
                  <RefreshCw size={10} className="text-green-600 animate-spin" />
                  <span className="text-[10px] text-green-700 font-medium">
                    Updated — syncing to {affectedForms.length} forms
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form sections with input fields */}
            <div className="p-5 space-y-5 max-h-[380px] overflow-y-auto">
              {employerFormFields.map((section) => (
                <div key={section.sectionLabel}>
                  {/* Section label */}
                  <div className="flex items-center gap-2 mb-3">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      {section.sectionLabel}
                    </p>
                    {section.subtext && (
                      <span className="text-[9px] text-slate-300">{section.subtext}</span>
                    )}
                  </div>

                  {/* Fields */}
                  <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                    {section.fields.map((f) => {
                      const isThisEditable = f.editable;
                      const hasMismatch = f.hasMismatch && !isFixed;
                      const showFixed = f.hasMismatch && isFixed;

                      return (
                        <div key={f.key} className={f.fullWidth ? 'col-span-2' : ''}>
                          {/* Label with sync badge */}
                          <div className="flex items-center gap-2 mb-1">
                            <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                              {f.label}
                            </label>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-400 font-medium">
                              → {f.syncCount} forms
                            </span>
                          </div>

                          {/* Input field */}
                          {isThisEditable ? (
                            <div>
                              {editing && !isFixed ? (
                                <input
                                  ref={inputRef}
                                  type="text"
                                  value={companyValue}
                                  onChange={(e) => setCompanyValue(e.target.value)}
                                  onBlur={handleCommit}
                                  onKeyDown={(e) => { if (e.key === 'Enter') handleCommit(); e.stopPropagation(); }}
                                  className="w-full text-sm text-navy-900 bg-blue-50 border-2 border-blue-400 focus:border-blue-500 rounded-lg px-3 py-2.5 outline-none transition-colors shadow-sm"
                                />
                              ) : (
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => !isFixed && setEditing(true)}
                                    className={`flex-1 text-left text-sm font-medium rounded-lg px-3 py-2.5 transition-all ${
                                      showFixed
                                        ? 'bg-green-50 border-2 border-green-300 text-green-800 cursor-default'
                                        : hasMismatch
                                        ? 'bg-amber-50 border-2 border-dashed border-amber-300 text-amber-800 cursor-pointer hover:border-amber-400'
                                        : 'bg-blue-50/60 border border-blue-200 text-navy-900 cursor-pointer hover:bg-blue-50'
                                    }`}
                                  >
                                    <div className="flex items-center justify-between">
                                      <span>{displayValue}</span>
                                      {showFixed && <CheckCircle2 size={14} className="text-green-500" />}
                                      {!isFixed && <Pencil size={12} className="text-slate-300" />}
                                    </div>
                                  </button>
                                  {hasMismatch && (
                                    <button
                                      onClick={handleFix}
                                      className="text-[10px] font-bold text-white bg-navy-900 hover:bg-navy-800 px-3 py-2.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                                    >
                                      Fix →
                                    </button>
                                  )}
                                </div>
                              )}
                              {showFixed && (
                                <motion.p
                                  initial={{ opacity: 0, y: 4 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="text-[9px] text-green-600 font-medium mt-1 flex items-center gap-1"
                                >
                                  <CheckCircle2 size={10} /> Corrected — synced to {affectedForms.length} forms
                                </motion.p>
                              )}
                            </div>
                          ) : (
                            <div className="text-sm font-medium text-navy-900 bg-blue-50/60 border border-blue-200 rounded-lg px-3 py-2.5">
                              {f.value}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </FocalCard>

          {/* ─── RIGHT: Downstream Forms (3 cols) ─── */}
          <div className="col-span-3 space-y-2">
            <SupportingModule delay={0.2} className="p-3">
              <div className="flex items-center gap-2 mb-2">
                <ArrowRight size={12} className="text-slate-400" />
                <p className="text-xs font-semibold text-navy-900">Filing Package</p>
                <span className="text-[10px] text-slate-400 ml-auto">6 forms</span>
              </div>

              <div className="grid grid-cols-2 gap-1.5">
                {formPackage.map((form) => {
                  const isAffected = affectedForms.includes(form.formCode);
                  const isSyncedForm = isFixed && isAffected;
                  return (
                    <motion.div
                      key={form.formCode}
                      className={`rounded-lg border p-2 transition-all ${
                        isSyncedForm ? 'border-green-300 bg-green-50' : 'border-slate-200 bg-white'
                      }`}
                      animate={isSyncedForm ? { borderColor: ['#86efac', '#bbf7d0', '#86efac'] } : {}}
                      transition={isSyncedForm ? { duration: 1.5, repeat: 1 } : {}}
                    >
                      <div className="flex items-center justify-between mb-0.5">
                        <div className="flex items-center gap-1">
                          <FileText size={10} className="text-slate-400" />
                          <span className="text-[11px] font-semibold text-navy-900">{form.formCode}</span>
                        </div>
                        <span className={`text-[8px] px-1 py-0.5 rounded-full font-medium ${
                          isSyncedForm ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {form.completionPercent}%
                        </span>
                      </div>
                      <p className="text-[9px] text-slate-500 mb-0.5">{form.displayName}</p>
                      {isSyncedForm ? (
                        <span className="text-[8px] text-green-600 font-medium flex items-center gap-0.5">
                          <CheckCircle2 size={8} /> Synced
                        </span>
                      ) : (
                        <span className="text-[8px] text-slate-400">{form.syncedFields} fields</span>
                      )}
                      {isAffected && isSyncedForm && affectedFieldMap[form.formCode] && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="mt-1 px-1.5 py-1 rounded bg-green-100 border border-green-200"
                        >
                          <p className="text-[7px] text-green-700">{affectedFieldMap[form.formCode]}</p>
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </SupportingModule>

            {/* How It Works */}
            <SupportingModule delay={0.3} className="p-3">
              <p className="text-xs font-semibold text-navy-900 mb-1.5">How It Works</p>
              <div className="space-y-1.5">
                {[
                  { step: '1', text: 'Enter data once in the shared record' },
                  { step: '2', text: 'Fields auto-sync to all relevant forms' },
                  { step: '3', text: 'Fix once → correction propagates everywhere' },
                ].map((item) => (
                  <div key={item.step} className="flex items-start gap-2">
                    <span className="text-[9px] w-4 h-4 rounded-full bg-navy-900 text-white flex items-center justify-center shrink-0 font-bold">
                      {item.step}
                    </span>
                    <span className="text-[11px] text-slate-600">{item.text}</span>
                  </div>
                ))}
              </div>
            </SupportingModule>
          </div>
        </div>
      </SceneShell>
    </div>
  );
}
