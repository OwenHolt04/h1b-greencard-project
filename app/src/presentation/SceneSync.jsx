import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Database, CheckCircle, Link2, Pencil } from 'lucide-react';
import { SceneShell, MaskedHeading, FocalCard, StaggerGroup, StaggerItem } from './motion';
import { formPackage } from '../data/mockData';

const sourceFields = [
  { label: 'Full Legal Name', value: 'Prajwal Kulkarni', key: 'fullName' },
  { label: 'Country of Birth', value: 'India', key: 'country' },
  { label: 'Employer Legal Name', key: 'employer', editable: true },
  { label: 'Job Title', value: 'Senior Product Manager', key: 'jobTitle' },
  { label: 'SOC Code', value: '15-1299.08', key: 'soc' },
  { label: 'Annual Salary', value: '$155,000', key: 'salary' },
  { label: 'Current Status', value: 'H-1B', key: 'status' },
  { label: 'Classification', value: 'EB-2', key: 'class' },
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
    <div className="h-screen w-full bg-surface flex flex-col items-center px-12 overflow-y-auto">
      <SceneShell maxWidth="max-w-3xl">
        <MaskedHeading className="text-center mb-5">
          <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">Smart Intake</p>
          <h2 className="font-serif text-3xl font-bold text-slate-900">Enter Once, Sync Everywhere</h2>
          <p className="text-sm text-slate-500 mt-2">
            Edit any source field — changes propagate across all downstream forms instantly.
          </p>
        </MaskedHeading>

        {/* Source Card — the smart form */}
        <FocalCard className="p-5" delay={0.15}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-navy-900/10 flex items-center justify-center">
              <Database className="w-3.5 h-3.5 text-navy-900" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900">Shared Case Record</h3>
            <span className="ml-auto text-[10px] text-accent font-semibold uppercase tracking-wider bg-accent/10 px-2 py-0.5 rounded-full">
              Source of Truth
            </span>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-2">
            {sourceFields.map((f) => (
              <div key={f.key}>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider">{f.label}</p>
                {f.editable ? (
                  <div className="mt-0.5">
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
                        className="text-sm font-medium text-navy-900 bg-accent/10 border border-accent/40 focus:border-accent rounded px-2 py-1 w-full outline-none transition-colors"
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={startEdit}
                          className="flex items-center gap-1.5 cursor-pointer group text-left"
                        >
                          <span
                            className={`text-sm font-medium border-b border-dashed transition-colors ${
                              hasEdited
                                ? 'text-green-700 border-green-300'
                                : 'text-amber-700 border-amber-400'
                            }`}
                          >
                            {employerValue}
                          </span>
                          <Pencil className="w-3 h-3 text-slate-300 group-hover:text-navy-900 transition-colors flex-shrink-0" />
                        </button>
                        {!hasEdited && (
                          <button
                            onClick={quickFix}
                            className="text-[10px] font-semibold text-navy-900 bg-accent/20 hover:bg-accent/30 px-2 py-0.5 rounded transition-colors cursor-pointer whitespace-nowrap"
                          >
                            Fix &rarr;
                          </button>
                        )}
                      </div>
                    )}
                    {hasEdited && (
                      <motion.p
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-[10px] text-green-600 font-medium mt-0.5"
                      >
                        &#10003; Updated &mdash; syncing to 3 forms
                      </motion.p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm font-medium text-slate-800">{f.value}</p>
                )}
              </div>
            ))}
          </div>

          {!hasEdited && !isEditing && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
              className="mt-3 text-[10px] text-slate-400 text-center"
            >
              Click the employer name to edit, or click Fix &rarr; to see the sync
            </motion.p>
          )}
        </FocalCard>

        {/* Connector: propagation sweep */}
        <div className="flex flex-col items-center py-2">
          <motion.div
            className="w-px bg-accent/40 rounded-full"
            initial={{ height: 0 }}
            animate={{ height: 16 }}
            transition={{ delay: 0.55, duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
          />
          <motion.div
            className="w-5 h-5 rounded-full bg-accent/15 flex items-center justify-center"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.25 }}
          >
            <motion.div
              key={syncPulse}
              className="w-2 h-2 rounded-full bg-accent"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 0.5, repeat: hasEdited ? 2 : 1 }}
            />
          </motion.div>
          <motion.div
            className="w-px bg-accent/40 rounded-full"
            initial={{ height: 0 }}
            animate={{ height: 16 }}
            transition={{ delay: 0.9, duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
          />
        </div>

        {/* Downstream Form Cards */}
        <StaggerGroup className="grid grid-cols-3 gap-2.5" stagger={0.07} delay={1.0}>
          {formPackage.map((form, idx) => {
            const empRef = employerFormRefs[form.formCode];
            const isAffected = empRef && hasEdited;

            return (
              <StaggerItem key={form.formCode}>
                <div
                  className={`bg-white rounded-lg border p-3 relative overflow-hidden transition-all duration-500 ${
                    isAffected ? 'border-green-300 shadow-sm' : 'border-slate-200'
                  }`}
                >
                  {/* Initial auto-sync flash (on mount, for all cards) */}
                  {!hasEdited && (
                    <motion.div
                      className="absolute inset-0 bg-accent/8 rounded-lg"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ delay: 1.4 + idx * 0.07, duration: 0.8, ease: 'easeInOut' }}
                    />
                  )}

                  {/* Edit sync flash (for affected forms, on user edit) */}
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
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-bold text-slate-900">{form.formCode}</span>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.6 + idx * 0.07, duration: 0.3 }}
                        className="flex items-center gap-0.5"
                      >
                        <CheckCircle className="w-2.5 h-2.5 text-green-500" />
                        <span className="text-[9px] font-semibold text-green-600">Synced</span>
                      </motion.div>
                    </div>
                    <p className="text-[10px] text-slate-500 mb-1.5">{form.displayName}</p>

                    {/* Show actual field value in affected forms after edit */}
                    {isAffected ? (
                      <motion.div
                        key={`val-${syncPulse}`}
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.15, duration: 0.3 }}
                        className="bg-green-50 rounded px-2 py-1.5 border border-green-200 mb-1"
                      >
                        <p className="text-[8px] text-green-600 uppercase tracking-wider font-medium">{empRef}</p>
                        <p className="text-[11px] font-semibold text-green-800 truncate">{employerValue}</p>
                      </motion.div>
                    ) : null}

                    <div className="flex items-center gap-1 text-[10px] text-navy-900/70 font-medium">
                      <Link2 className="w-2.5 h-2.5" />
                      {form.syncedFields} fields
                    </div>
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      </SceneShell>
    </div>
  );
}
