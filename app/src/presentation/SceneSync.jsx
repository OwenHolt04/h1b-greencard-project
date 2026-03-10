import { motion } from 'framer-motion';
import { Database, CheckCircle, Link2 } from 'lucide-react';
import { SceneShell, MaskedHeading, FocalCard, StaggerGroup, StaggerItem } from './motion';
import { formPackage } from '../data/mockData';

const sourceFields = [
  { label: 'Full Legal Name', value: 'Prajwal Kulkarni' },
  { label: 'Country of Birth', value: 'India' },
  { label: 'Employer Legal Name', value: 'Hewlett Packard Enterprise' },
  { label: 'Job Title', value: 'Senior Product Manager' },
  { label: 'SOC Code', value: '15-1299.08' },
  { label: 'Annual Salary', value: '$155,000' },
  { label: 'Current Status', value: 'H-1B' },
  { label: 'Classification', value: 'EB-2' },
];

export default function SceneSync() {
  return (
    <div className="h-screen w-full bg-surface flex flex-col justify-center items-center px-12">
      <SceneShell maxWidth="max-w-3xl">
        {/* Scene heading */}
        <MaskedHeading className="text-center mb-6">
          <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">Smart Intake</p>
          <h2 className="font-serif text-3xl font-bold text-slate-900">Enter Once, Sync Everywhere</h2>
          <p className="text-sm text-slate-500 mt-2">One shared record auto-populates across all 6 immigration forms.</p>
        </MaskedHeading>

        {/* Hero: Source Card */}
        <FocalCard className="p-6" delay={0.15}>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-navy-900/10 flex items-center justify-center">
              <Database className="w-4 h-4 text-navy-900" />
            </div>
            <h3 className="font-semibold text-slate-900">Shared Case Record</h3>
            <span className="ml-auto text-[10px] text-accent font-semibold uppercase tracking-wider bg-accent/10 px-2 py-0.5 rounded-full">
              Source of Truth
            </span>
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-2.5">
            {sourceFields.map((f) => (
              <div key={f.label}>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider">{f.label}</p>
                <p className="text-sm font-medium text-slate-800">{f.value}</p>
              </div>
            ))}
          </div>
        </FocalCard>

        {/* Connector: Propagation sweep */}
        <div className="flex flex-col items-center py-2.5">
          <motion.div
            className="w-px bg-accent/40 rounded-full"
            initial={{ height: 0 }}
            animate={{ height: 20 }}
            transition={{ delay: 0.55, duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
          />
          <motion.div
            className="w-5 h-5 rounded-full bg-accent/15 flex items-center justify-center"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.25 }}
          >
            <motion.div
              className="w-2 h-2 rounded-full bg-accent"
              animate={{ scale: [1, 1.4, 1] }}
              transition={{ delay: 1.0, duration: 0.6, repeat: 1 }}
            />
          </motion.div>
          <motion.div
            className="w-px bg-accent/40 rounded-full"
            initial={{ height: 0 }}
            animate={{ height: 20 }}
            transition={{ delay: 0.9, duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
          />
        </div>

        {/* Form Cards: Tight 3×2 grid with sync flash */}
        <StaggerGroup className="grid grid-cols-3 gap-2.5" stagger={0.07} delay={1.0}>
          {formPackage.map((form, idx) => (
            <StaggerItem key={form.formCode}>
              <div className="bg-white rounded-lg border border-slate-200 p-3 relative overflow-hidden">
                {/* Sync flash overlay */}
                <motion.div
                  className="absolute inset-0 bg-accent/8 rounded-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ delay: 1.4 + idx * 0.07, duration: 0.8, ease: 'easeInOut' }}
                />
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
                  <div className="flex items-center gap-1 text-[10px] text-navy-900/70 font-medium">
                    <Link2 className="w-2.5 h-2.5" />
                    {form.syncedFields} fields
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </SceneShell>
    </div>
  );
}
