// ============================================================================
// Scene 2: Smart Intake — Real form-like layout with sections, labeled inputs
// Enter once, sync everywhere. Editable source fields → downstream propagation.
// ============================================================================

import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Database, CheckCircle, Link2, Pencil, ChevronRight } from 'lucide-react';
import { SceneShell, MaskedHeading, FocalCard, StaggerGroup, StaggerItem, SupportingModule } from './motion';
import { formPackage } from '../data/mockData';

/* ── Form sections with grouped fields ────────────────────────────── */
const formSections = [
  {
    id: 'identity',
    label: 'Identity',
    fields: [
      { label: 'Full Legal Name', value: 'Krishna', key: 'fullName', syncCount: 6 },
      { label: 'Date of Birth', value: 'August 22, 1997', key: 'dob', syncCount: 3 },
      { label: 'Country of Birth', value: 'India', key: 'country', syncCount: 4 },
    ],
  },
  {
    id: 'employer',
    label: 'Employer',
    fields: [
      { label: 'Employer Legal Name', key: 'employer', editable: true, syncCount: 4 },
      { label: 'FEIN', value: 'XX-XXXXXXX', key: 'fein', syncCount: 3 },
      { label: 'Work Location', value: 'San Jose, CA', key: 'workLocation', syncCount: 3 },
    ],
  },
  {
    id: 'job',
    label: 'Job / Classification',
    fields: [
      { label: 'Job Title', value: 'Senior Product Manager', key: 'jobTitle', syncCount: 4 },
      { label: 'SOC Code', value: '15-1299.08', key: 'soc', syncCount: 3 },
      { label: 'Annual Salary', value: '$155,000', key: 'salary', syncCount: 3 },
      { label: 'Wage Level', value: 'Level 3', key: 'wageLevel', syncCount: 1 },
    ],
  },
  {
    id: 'immigration',
    label: 'Immigration',
    fields: [
      { label: 'Current Status', value: 'H-1B', key: 'status', syncCount: 3 },
      { label: 'Classification', value: 'EB-2', key: 'class', syncCount: 2 },
      { label: 'Priority Date', value: 'March 15, 2022', key: 'priorityDate', syncCount: 2 },
    ],
  },
];

// Which downstream forms contain the employer name field
const employerFormRefs = {
  'ETA-9089': 'Section F: Employer Name',
  'I-140': 'Part 1: Company Name',
  'I-485': 'Part 1: Employer',
};

export default function SceneSync() {
  const [employerValue, setEmployerValue] = useState('Hewlett-Packard Enterprise');
  const [isEditing, setIsEditing] = useState(false);
  const [hasEdited, setHasEdited] = useState(false);
  const [syncPulse, setSyncPulse] = useState(0);
  const inputRef = useRef(null);

  const startEdit = useCallback(() => {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    }, 30);
  }, []);

  const finishEdit = useCallback(() => {
    setIsEditing(false);
    if (employerValue.trim() && employerValue !== 'Hewlett-Packard Enterprise') {
      setHasEdited(true);
      setSyncPulse((p) => p + 1);
    }
  }, [employerValue]);

  const quickFix = useCallback(() => {
    setEmployerValue('Hewlett Packard Enterprise');
    setHasEdited(true);
    setSyncPulse((p) => p + 1);
  }, []);

  return (
    <div className="h-full w-full bg-surface flex flex-col items-center px-6 pt-6 overflow-y-auto">
      <SceneShell maxWidth="max-w-5xl">
        <MaskedHeading className="text-center mb-4">
          <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">Smart Intake</p>
          <h2 className="font-serif text-3xl font-bold text-navy-900">Enter Once, Sync Everywhere</h2>
          <p className="text-sm text-slate-500 mt-1.5">
            Edit any source field — changes propagate across all downstream forms instantly.
          </p>
        </MaskedHeading>

        <div className="grid grid-cols-5 gap-4">
          {/* ── LEFT: Smart Intake Form (3 cols) ── */}
          <FocalCard className="col-span-3 p-0 overflow-hidden" delay={0.1}>
            {/* Form header */}
            <div className="px-4 py-2.5 bg-navy-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="w-3.5 h-3.5" />
                <span className="text-xs font-semibold">Shared Case Record</span>
              </div>
              <span className="text-[9px] font-semibold uppercase tracking-wider bg-white/15 px-2 py-0.5 rounded-full">
                Source of Truth
              </span>
            </div>

            {/* Form sections */}
            <div className="p-4 space-y-4">
              {formSections.map((section) => (
                <div key={section.id}>
                  {/* Section label */}
                  <div className="flex items-center gap-2 mb-2 pb-1 border-b border-slate-100">
                    <ChevronRight size={10} className="text-slate-400" />
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{section.label}</span>
                  </div>

                  {/* Fields in this section */}
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    {section.fields.map((f) => (
                      <div key={f.key} className={section.fields.length === 1 ? 'col-span-2' : ''}>
                        {/* Label row */}
                        <div className="flex items-center justify-between mb-0.5">
                          <label className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">{f.label}</label>
                          <span className="text-[7px] text-slate-300">→ {f.syncCount} forms</span>
                        </div>
                        {/* Input field */}
                        {f.editable ? (
                          <div>
                            {isEditing ? (
                              <input
                                ref={inputRef}
                                value={employerValue}
                                onChange={(e) => setEmployerValue(e.target.value)}
                                onBlur={finishEdit}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') e.target.blur();
                                  e.stopPropagation();
                                }}
                                className="w-full text-sm font-medium text-navy-900 bg-blue-50 border-2 border-blue-400 focus:border-blue-500 rounded-md px-2.5 py-1.5 outline-none transition-colors shadow-sm"
                              />
                            ) : (
                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={startEdit}
                                  className="flex-1 flex items-center gap-2 cursor-pointer group text-left"
                                >
                                  <div className={`flex-1 text-sm font-medium px-2.5 py-1.5 rounded-md border-2 border-dashed transition-all ${
                                    hasEdited
                                      ? 'text-green-700 border-green-300 bg-green-50'
                                      : 'text-amber-700 border-amber-300 bg-amber-50'
                                  }`}>
                                    <div className="flex items-center justify-between">
                                      <span>{employerValue}</span>
                                      <Pencil className="w-3 h-3 text-slate-300 group-hover:text-navy-900 transition-colors flex-shrink-0" />
                                    </div>
                                  </div>
                                </button>
                                {!hasEdited && (
                                  <button
                                    onClick={quickFix}
                                    className="text-[9px] font-bold text-white bg-navy-900 hover:bg-navy-800 px-2.5 py-1.5 rounded-md transition-colors cursor-pointer whitespace-nowrap"
                                  >
                                    Fix →
                                  </button>
                                )}
                              </div>
                            )}
                            {hasEdited && (
                              <motion.p
                                initial={{ opacity: 0, y: 4 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-[9px] text-green-600 font-medium mt-0.5 flex items-center gap-1"
                              >
                                <CheckCircle className="w-2.5 h-2.5" /> Updated — syncing to 3 forms
                              </motion.p>
                            )}
                          </div>
                        ) : (
                          <div className="text-sm font-medium text-navy-900 bg-white border border-slate-200 rounded-md px-2.5 py-1.5">
                            {f.value}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {!hasEdited && !isEditing && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
                className="text-[10px] text-slate-400 text-center pb-3"
              >
                Click the employer name to edit, or click Fix → to see the sync
              </motion.p>
            )}
          </FocalCard>

          {/* ── RIGHT: Downstream Forms (2 cols) ── */}
          <div className="col-span-2 space-y-2">
            <div className="flex items-center gap-1.5 mb-1">
              <Link2 size={12} className="text-slate-400" />
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Downstream Forms</span>
            </div>

            {formPackage.map((form, idx) => {
              const empRef = employerFormRefs[form.formCode];
              const isAffected = empRef && hasEdited;

              return (
                <SupportingModule key={form.formCode} delay={0.2 + idx * 0.05} className="p-0 overflow-hidden">
                  <div
                    className={`p-2.5 relative transition-all duration-500 ${
                      isAffected ? 'border-l-2 border-l-green-500' : ''
                    }`}
                  >
                    {/* Initial auto-sync flash */}
                    {!hasEdited && (
                      <motion.div
                        className="absolute inset-0 bg-accent/8 rounded-lg"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ delay: 1.4 + idx * 0.07, duration: 0.8, ease: 'easeInOut' }}
                      />
                    )}

                    {/* Edit sync flash */}
                    {isAffected && (
                      <motion.div
                        key={`edit-${syncPulse}`}
                        className="absolute inset-0 bg-green-100/60 rounded-lg"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ delay: 0.1, duration: 0.8, ease: 'easeInOut' }}
                      />
                    )}

                    <div className="relative">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-[12px] font-bold text-navy-900">{form.formCode}</span>
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 1.6 + idx * 0.07, duration: 0.3 }}
                          className="flex items-center gap-0.5"
                        >
                          <CheckCircle className="w-2.5 h-2.5 text-green-500" />
                          <span className="text-[8px] font-semibold text-green-600">Synced</span>
                        </motion.div>
                      </div>
                      <p className="text-[9px] text-slate-500 mb-1">{form.displayName}</p>

                      {/* Show actual field value in affected forms after edit */}
                      {isAffected ? (
                        <motion.div
                          key={`val-${syncPulse}`}
                          initial={{ opacity: 0, scale: 0.97 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.15, duration: 0.3 }}
                          className="bg-green-50 rounded px-2 py-1 border border-green-200"
                        >
                          <p className="text-[7px] text-green-600 uppercase tracking-wider font-medium">{empRef}</p>
                          <p className="text-[10px] font-semibold text-green-800 truncate">{employerValue}</p>
                        </motion.div>
                      ) : null}

                      <div className="flex items-center gap-1 text-[9px] text-navy-900/60 font-medium mt-1">
                        <Link2 className="w-2.5 h-2.5" />
                        {form.syncedFields} fields synced
                      </div>
                    </div>
                  </div>
                </SupportingModule>
              );
            })}
          </div>
        </div>
      </SceneShell>
    </div>
  );
}
