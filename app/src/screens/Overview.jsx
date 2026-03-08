import { useDemo } from '../context/DemoContext';
import { FileText, Shield, LayoutDashboard, Users, ArrowRight, Info, AlertTriangle, Mail, Clock, HelpCircle, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { scopeNote, applicant, employer, attorney } from '../data/mockData';
import StageTimeline from '../components/StageTimeline';

const capabilities = [
  {
    icon: FileText,
    title: 'Smart Intake',
    description: 'Enter data once. Auto-populate across 6 immigration forms — eliminating re-keying contradictions.',
    metric: '6 forms, 1 entry',
    color: 'bg-blue-50 text-blue-700',
    kano: 'Basic',
    kanoColor: 'bg-slate-800 text-white',
    kanoNote: 'Must-have',
  },
  {
    icon: Shield,
    title: 'Validation Engine',
    description: 'Pre-submission checks catch inconsistencies that would otherwise trigger RFEs months later.',
    metric: 'RFE rate: 25% → <5%',
    color: 'bg-green-50 text-green-700',
    kano: 'Basic',
    kanoColor: 'bg-slate-800 text-white',
    kanoNote: 'Must-have',
  },
  {
    icon: LayoutDashboard,
    title: 'Unified Dashboard',
    description: 'One view across DOL, USCIS, and DOS — replacing 4 separate portals plus a physical mailbox.',
    metric: 'Status calls: −60%',
    color: 'bg-amber-50 text-amber-700',
    kano: 'Performance',
    kanoColor: 'bg-accent text-navy-900',
    kanoNote: 'Differentiator',
  },
  {
    icon: Users,
    title: 'Role-Based Views',
    description: 'Same case record, different priorities. Plain language for applicants. Precision for attorneys.',
    metric: 'Attorney hours: 8 → 3',
    color: 'bg-purple-50 text-purple-700',
    kano: 'Delighter',
    kanoColor: 'bg-purple-700 text-white',
    kanoNote: 'Exceeds expectations',
  },
];

const currentStateProblems = [
  { icon: XCircle, label: '4 separate portals', detail: 'DOL, USCIS, DOS, and employer HRIS — none connected' },
  { icon: Mail, label: '1 physical mailbox', detail: 'Paper notices with no digital tracking or alerts' },
  { icon: AlertTriangle, label: '~25% RFE rate', detail: 'Contradictions across 6+ forms caught months after filing' },
  { icon: Clock, label: 'Weeks of idle time', detail: 'No handoff ownership, no SLAs, no escalation path' },
  { icon: HelpCircle, label: '0 dashboards', detail: 'No single view of case status across agencies' },
  { icon: XCircle, label: 'No plain language', detail: '20+ page manuals with no guided eligibility checks' },
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
  const { navigate, overviewMode, setOverviewMode } = useDemo();

  return (
    <div className="min-h-[calc(100vh-3.5rem)]">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(248,242,182,0.06),transparent_60%)]" />

        <div className="relative max-w-5xl mx-auto px-6 pt-14 pb-14 text-center">
          {/* Current/Future toggle */}
          <div className="flex justify-center mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-1 inline-flex">
              <button
                onClick={() => setOverviewMode('current')}
                className={`px-5 py-2 rounded-md text-sm font-medium transition-all duration-200 cursor-pointer ${
                  overviewMode === 'current'
                    ? 'bg-red-500/90 text-white shadow-sm'
                    : 'text-white/50 hover:text-white/80'
                }`}
              >
                Today
              </button>
              <button
                onClick={() => setOverviewMode('future')}
                className={`px-5 py-2 rounded-md text-sm font-medium transition-all duration-200 cursor-pointer ${
                  overviewMode === 'future'
                    ? 'bg-accent text-navy-900 shadow-sm'
                    : 'text-white/50 hover:text-white/80'
                }`}
              >
                With CaseBridge
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {overviewMode === 'current' ? (
              <motion.div
                key="current"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-red-400 text-sm font-semibold tracking-wider uppercase mb-4">
                  Current State
                </p>
                <h1 className="font-serif text-4xl md:text-5xl font-bold text-white leading-tight mb-5">
                  Fragmented, opaque,
                  <br />
                  and expensive to navigate.
                </h1>
                <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed mb-8">
                  One case is spread across agencies, forms, emails, physical notices, and legal interpretation. No single actor sees the full picture.
                </p>
                <button
                  onClick={() => setOverviewMode('future')}
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-lg border border-white/20 transition-all duration-200 cursor-pointer"
                >
                  See the Future State
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="future"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-accent text-sm font-bold tracking-wider uppercase mb-4">
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
                    className="inline-flex items-center gap-2 bg-accent hover:bg-accent-dark text-navy-900 font-semibold px-6 py-3 rounded-lg transition-colors duration-200 cursor-pointer"
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
            )}
          </AnimatePresence>
        </div>
      </section>

      <AnimatePresence mode="wait">
        {overviewMode === 'current' ? (
          <motion.div
            key="current-body"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {/* Current State Problems Grid */}
            <section className="max-w-5xl mx-auto px-6 -mt-4 relative z-10 pb-12">
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                {currentStateProblems.map((prob) => (
                  <motion.div
                    key={prob.label}
                    variants={item}
                    className="bg-white rounded-xl border border-red-200/60 p-5 shadow-sm"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-red-50 text-red-500 flex items-center justify-center flex-shrink-0">
                        <prob.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 text-[15px] mb-0.5">{prob.label}</h3>
                        <p className="text-slate-500 text-[13px] leading-relaxed">{prob.detail}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Visual: the fragmented system */}
              <div className="mt-8 bg-white rounded-xl border border-slate-200/80 shadow-sm p-6">
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-4 text-center">What one case looks like today</p>
                <div className="flex items-center justify-center gap-3 flex-wrap">
                  {['DOL Portal', 'USCIS Portal', 'DOS Portal', 'Employer HRIS', 'Email Threads', 'Physical Mail'].map((portal) => (
                    <div key={portal} className="px-4 py-3 rounded-lg bg-slate-100 border border-slate-200 text-center">
                      <p className="text-[13px] font-medium text-slate-600">{portal}</p>
                      <p className="text-[10px] text-red-400 font-medium mt-0.5">Not connected</p>
                    </div>
                  ))}
                </div>
                <p className="text-center text-slate-400 text-[13px] mt-4">
                  5 portals + 1 mailbox + 0 dashboards = no single source of truth
                </p>
              </div>
            </section>
          </motion.div>
        ) : (
          <motion.div
            key="future-body"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {/* Capability Cards with Kano annotations */}
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
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-10 h-10 rounded-lg ${cap.color} flex items-center justify-center`}>
                        <cap.icon className="w-5 h-5" />
                      </div>
                      <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${cap.kanoColor}`}>
                        {cap.kano}
                      </span>
                    </div>
                    <h3 className="font-semibold text-slate-900 text-[15px] mb-1.5">{cap.title}</h3>
                    <p className="text-slate-500 text-[13px] leading-relaxed mb-3">{cap.description}</p>
                    <div className="pt-2 border-t border-slate-100">
                      <span className="text-navy-900 font-bold text-[15px]">{cap.metric}</span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
              <p className="text-center text-[11px] text-slate-400 mt-3">
                Demo order follows Kano model: <span className="font-semibold text-slate-500">Basic</span> (must-have) → <span className="font-semibold text-navy-900 bg-accent px-1 rounded">Performance</span> (differentiator) → <span className="font-semibold text-purple-600">Delighter</span> (exceeds expectations)
              </p>
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
                    <h3 className="font-semibold text-slate-900">{applicant.fullName} — EB-2 Green Card via {employer.displayName}</h3>
                  </div>
                  <button
                    onClick={() => navigate('dashboard')}
                    className="text-navy-900 text-sm font-semibold hover:text-navy-700 transition-colors cursor-pointer flex items-center gap-1"
                  >
                    Open Case <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="px-6 py-5 grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <p className="text-xs text-slate-400 font-medium mb-1">Applicant</p>
                    <p className="text-sm text-slate-900 font-medium">{applicant.fullName}</p>
                    <p className="text-xs text-slate-500">{applicant.educationLevel} {applicant.degreeField}, {applicant.university} · {applicant.currentStatus}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium mb-1">Employer</p>
                    <p className="text-sm text-slate-900 font-medium">{employer.legalName}</p>
                    <p className="text-xs text-slate-500">{employer.industry} · {employer.headquarters}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium mb-1">Attorney</p>
                    <p className="text-sm text-slate-900 font-medium">{attorney.attorneyName}</p>
                    <p className="text-xs text-slate-500">{attorney.lawFirm}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium mb-1">Current Stage</p>
                    <p className="text-sm text-slate-900 font-medium">I-485 Preparation</p>
                    <p className="text-xs text-slate-500">Priority Date: Mar 2024</p>
                  </div>
                </div>
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
