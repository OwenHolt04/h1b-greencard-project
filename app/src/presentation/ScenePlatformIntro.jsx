import { motion } from 'framer-motion';
import { FileText, Shield, LayoutDashboard, Users } from 'lucide-react';
import { MaskedHeading, StaggerGroup, StaggerItem } from './motion';
import { scopeNote } from '../data/mockData';

const capabilities = [
  {
    icon: FileText,
    title: 'Smart Intake',
    description: 'Enter data once. Auto-populate across 6 immigration forms.',
    metric: '6 forms, 1 entry',
    color: 'bg-blue-50 text-blue-700',
    kano: 'Basic',
  },
  {
    icon: Shield,
    title: 'Validation Engine',
    description: 'Pre-submission checks catch inconsistencies before filing.',
    metric: 'RFE rate: 25% → <5%',
    color: 'bg-green-50 text-green-700',
    kano: 'Basic',
  },
  {
    icon: LayoutDashboard,
    title: 'Unified Dashboard',
    description: 'One view across DOL, USCIS, and DOS.',
    metric: 'Status calls: −60%',
    color: 'bg-amber-50 text-amber-700',
    kano: 'Performance',
  },
  {
    icon: Users,
    title: 'Role-Based Views',
    description: 'Same case record, different stakeholder priorities.',
    metric: 'Attorney hours: 8 → 3',
    color: 'bg-purple-50 text-purple-700',
    kano: 'Delighter',
  },
];

export default function ScenePlatformIntro() {
  return (
    <div className="h-screen w-full flex flex-col">
      {/* Navy hero — top portion */}
      <div className="flex-[55] bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 flex items-end justify-center px-12 pb-10 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(248,242,182,0.06),transparent_60%)]" />
        <div className="relative max-w-4xl w-full">
          <MaskedHeading className="text-center">
            <p className="text-accent text-sm font-bold tracking-wider uppercase mb-3">
              Future-State Platform
            </p>
            <h1 className="font-serif text-5xl md:text-6xl font-bold text-white leading-tight mb-4">
              One shared case record for the
              <br />
              H-1B to green card journey.
            </h1>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto leading-relaxed">
              Reduce rework, simplify handoffs, and make status visible — across applicant, employer, attorney, and agencies.
            </p>
          </MaskedHeading>
        </div>
      </div>

      {/* Capabilities — bottom portion */}
      <div className="flex-[45] bg-surface px-12 flex items-start justify-center pt-8">
        <div className="max-w-4xl w-full">
          <StaggerGroup className="grid grid-cols-4 gap-4" stagger={0.08} delay={0.2}>
            {capabilities.map((cap) => (
              <StaggerItem key={cap.title}>
                <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 rounded-lg ${cap.color} flex items-center justify-center`}>
                      <cap.icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                      {cap.kano}
                    </span>
                  </div>
                  <h3 className="font-semibold text-slate-900 text-[15px] mb-1">{cap.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-3">{cap.description}</p>
                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-navy-900 font-bold text-sm">{cap.metric}</span>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.4 }}
            className="text-center text-slate-400 text-xs mt-5 max-w-xl mx-auto leading-relaxed"
          >
            {scopeNote}
          </motion.p>
        </div>
      </div>
    </div>
  );
}
