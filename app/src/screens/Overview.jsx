import { useDemo } from '../context/DemoContext';
import { FileText, Shield, LayoutDashboard, Users, ArrowRight, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { scopeNote } from '../data/mockData';
import StageTimeline from '../components/StageTimeline';

const capabilities = [
  {
    icon: FileText,
    title: 'Smart Intake',
    description: 'Enter data once. Auto-populate across 6 immigration forms — eliminating re-keying contradictions.',
    metric: '6 forms, 1 entry',
    color: 'bg-blue-50 text-blue-700',
  },
  {
    icon: Shield,
    title: 'Validation Engine',
    description: 'Pre-submission checks catch inconsistencies that would otherwise trigger RFEs months later.',
    metric: 'RFE rate: 25% → <5%',
    color: 'bg-green-50 text-green-700',
  },
  {
    icon: LayoutDashboard,
    title: 'Unified Dashboard',
    description: 'One view across DOL, USCIS, and DOS — replacing 4 separate portals plus a physical mailbox.',
    metric: 'Status calls: −60%',
    color: 'bg-amber-50 text-amber-700',
  },
  {
    icon: Users,
    title: 'Role-Based Views',
    description: 'Same case record, different priorities. Plain language for applicants. Precision for attorneys.',
    metric: 'Attorney hours: 8 → 3',
    color: 'bg-purple-50 text-purple-700',
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

export default function Overview() {
  const { navigate } = useDemo();

  return (
    <div className="min-h-[calc(100vh-3.5rem)]">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(198,153,62,0.08),transparent_60%)]" />

        <div className="relative max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <p className="text-accent text-sm font-semibold tracking-wider uppercase mb-4">
              Future-State Technology Platform
            </p>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-white leading-tight mb-5">
              One shared case record for the
              <br />
              H-1B to green card journey.
            </h1>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto leading-relaxed mb-8">
              Reduce rework, simplify handoffs, and make status visible — across applicant, employer, attorney, and agencies.
            </p>

            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => navigate('dashboard')}
                className="inline-flex items-center gap-2 bg-accent hover:bg-accent-light text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200 cursor-pointer"
              >
                View Demo Case
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigate('impact')}
                className="inline-flex items-center gap-2 text-white/70 hover:text-white font-medium px-6 py-3 rounded-lg border border-white/20 hover:border-white/40 transition-all duration-200 cursor-pointer"
              >
                See What the Portal Solves
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Capability Cards */}
      <section className="max-w-6xl mx-auto px-6 -mt-6 relative z-10">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {capabilities.map((cap) => (
            <motion.div
              key={cap.title}
              variants={item}
              className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className={`w-10 h-10 rounded-lg ${cap.color} flex items-center justify-center mb-3`}>
                <cap.icon className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-slate-900 text-[15px] mb-1.5">{cap.title}</h3>
              <p className="text-slate-500 text-[13px] leading-relaxed mb-3">{cap.description}</p>
              <div className="pt-2 border-t border-slate-100">
                <span className="text-accent font-bold text-[15px]">{cap.metric}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Case Preview */}
      <section className="max-w-5xl mx-auto px-6 py-14">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden"
        >
          <div className="border-b border-slate-100 px-6 py-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-0.5">Demo Case</p>
              <h3 className="font-semibold text-slate-900">Yuto Sato — EB-2 Green Card via Helix Systems</h3>
            </div>
            <button
              onClick={() => navigate('dashboard')}
              className="text-accent text-sm font-semibold hover:text-accent-light transition-colors cursor-pointer flex items-center gap-1"
            >
              Open Case <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="px-6 py-5 grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-xs text-slate-400 font-medium mb-1">Applicant</p>
              <p className="text-sm text-slate-900 font-medium">Yuto Sato</p>
              <p className="text-xs text-slate-500">MS CS, Stanford · H-1B</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium mb-1">Employer</p>
              <p className="text-sm text-slate-900 font-medium">Helix Systems, Inc.</p>
              <p className="text-xs text-slate-500">Enterprise Software · San Jose</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium mb-1">Attorney</p>
              <p className="text-sm text-slate-900 font-medium">Maya Chen</p>
              <p className="text-xs text-slate-500">Chen & Patel Immigration</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium mb-1">Current Stage</p>
              <p className="text-sm text-slate-900 font-medium">I-485 Preparation</p>
              <p className="text-xs text-slate-500">Priority Date: Mar 2024</p>
            </div>
          </div>
          {/* Compact journey timeline */}
          <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100">
            <StageTimeline compact />
          </div>
        </motion.div>
      </section>

      {/* Scope Note */}
      <section className="max-w-4xl mx-auto px-6 pb-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="flex items-start gap-3 bg-slate-50 border border-slate-200/80 rounded-lg px-5 py-4"
        >
          <Info className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
          <p className="text-slate-500 text-[13px] leading-relaxed">{scopeNote}</p>
        </motion.div>
      </section>
    </div>
  );
}
