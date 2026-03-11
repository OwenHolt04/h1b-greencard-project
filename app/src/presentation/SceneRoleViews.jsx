import { motion, AnimatePresence } from 'framer-motion';
import { User, Building2, Scale, CheckCircle, XCircle, Sparkles } from 'lucide-react';
import { AlertTriangle, Clock, Info } from 'lucide-react';
import { useDemo } from '../context/DemoContext';
import ReadinessScore from '../components/ReadinessScore';
import { SceneShell, MaskedHeading, FocalCard } from './motion';
import { roleContent, applicant, employer, caseRecord, eligibilityChecks } from '../data/mockData';

const roles = [
  { id: 'applicant', label: 'Applicant', icon: User },
  { id: 'employer', label: 'Employer / HR', icon: Building2 },
  { id: 'attorney', label: 'Attorney', icon: Scale },
];

const alertTypeConfig = {
  error: { icon: AlertTriangle, bg: 'bg-red-50', border: 'border-red-200', iconColor: 'text-red-500', titleColor: 'text-red-900' },
  warning: { icon: Clock, bg: 'bg-amber-50', border: 'border-amber-200', iconColor: 'text-amber-500', titleColor: 'text-amber-900' },
  info: { icon: Info, bg: 'bg-blue-50', border: 'border-blue-200', iconColor: 'text-blue-500', titleColor: 'text-blue-900' },
  success: { icon: CheckCircle, bg: 'bg-green-50', border: 'border-green-200', iconColor: 'text-green-600', titleColor: 'text-green-900' },
};

const roleBadgeConfig = {
  applicant: { label: 'Applicant View', color: 'bg-blue-100 text-blue-700' },
  employer: { label: 'Employer / HR View', color: 'bg-amber-100 text-amber-700' },
  attorney: { label: 'Attorney View', color: 'bg-purple-100 text-purple-700' },
};

const sponsorshipCosts = [
  { phase: 'PERM (Labor Cert.)', cost: '$4,000–$6,000', status: 'Paid' },
  { phase: 'I-140 (Petition)', cost: '$3,000–$5,000', status: 'Paid' },
  { phase: 'I-485 (Adjustment)', cost: '$5,000–$7,000', status: 'Upcoming' },
  { phase: 'H-1B Extensions (×2)', cost: '$2,500–$4,000/ea', status: 'Recurring' },
];

export default function SceneRoleViews() {
  const { currentRole, switchRole, readinessScore } = useDemo();
  const content = roleContent[currentRole];
  const badge = roleBadgeConfig[currentRole];

  return (
    <div className="h-screen w-full bg-surface flex flex-col items-center px-12 overflow-y-auto">
      <SceneShell maxWidth="max-w-3xl">
        {/* Scene heading */}
        <MaskedHeading className="text-center mb-3">
          <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">Stakeholder Views</p>
          <h2 className="font-serif text-3xl font-bold text-navy-900">Same Case, Different Priorities</h2>
        </MaskedHeading>

        {/* Case anchor — compact, fixed across switches */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="flex items-center justify-center gap-3 text-xs text-slate-500 mb-3"
        >
          <span className="font-medium text-navy-900">{applicant.fullName}</span>
          <span className="text-slate-300">&middot;</span>
          <span>{caseRecord.pathwayType}</span>
          <span className="text-slate-300">&middot;</span>
          <span>{employer.displayName}</span>
        </motion.div>

        {/* Role switcher — prominent, centered */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.3 }}
          className="flex justify-center mb-4"
        >
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-1.5 inline-flex">
            {roles.map((role) => (
              <button
                key={role.id}
                onClick={() => switchRole(role.id)}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  currentRole === role.id
                    ? 'bg-navy-900 text-white shadow-md'
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                }`}
              >
                <role.icon className="w-4 h-4" />
                {role.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Role content — morphing */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentRole}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="space-y-3"
          >
            {/* Main role shell — greeting + next step */}
            <FocalCard className="p-5" delay={0}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${badge.color}`}>
                    {badge.label}
                  </span>
                  <h3 className="text-lg font-semibold text-navy-900 mt-2">{content.greeting}</h3>
                </div>
                <ReadinessScore score={readinessScore} size={52} strokeWidth={4} showLabel={false} />
              </div>
              <p className="text-sm text-slate-600 leading-relaxed mb-3">{content.statusSummary}</p>
              <div className="pt-3 border-t border-slate-100">
                <h4 className="text-xs font-semibold text-navy-900 mb-1">Next Step</h4>
                <p className="text-sm text-slate-700 leading-relaxed">{content.nextStep}</p>
              </div>
            </FocalCard>

            {/* Role-specific module */}
            {currentRole === 'applicant' && (
              <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-4">
                <div className="flex items-center justify-between mb-2.5">
                  <h4 className="text-sm font-semibold text-navy-900 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-navy-900" />
                    Eligibility Check
                  </h4>
                  <span className="text-[10px] font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
                    {eligibilityChecks.filter((c) => c.answer).length}/{eligibilityChecks.length}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                  {eligibilityChecks.slice(0, 6).map((check) => (
                    <div key={check.id} className="flex items-start gap-2 py-0.5">
                      {check.answer ? (
                        <CheckCircle className="w-3.5 h-3.5 text-green-500 mt-0.5 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 text-amber-500 mt-0.5 flex-shrink-0" />
                      )}
                      <p className="text-xs text-slate-700 leading-snug">{check.question}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentRole === 'employer' && (
              <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-4">
                <h4 className="text-sm font-semibold text-navy-900 mb-2">Sponsorship Cost Breakdown</h4>
                <div className="space-y-1">
                  {sponsorshipCosts.map((item) => (
                    <div key={item.phase} className="flex items-center justify-between py-1 border-b border-slate-100 last:border-0">
                      <span className="text-xs text-slate-700">{item.phase}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-navy-900">{item.cost}</span>
                        <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${
                          item.status === 'Paid' ? 'bg-green-50 text-green-700'
                          : item.status === 'Upcoming' ? 'bg-amber-50 text-amber-700'
                          : 'bg-blue-50 text-blue-700'
                        }`}>{item.status}</span>
                      </div>
                    </div>
                  ))}
                  <div className="pt-1.5 flex items-center justify-between">
                    <span className="text-xs font-semibold text-navy-900">Estimated Total</span>
                    <span className="text-sm font-bold text-navy-900">$15,000–$22,000</span>
                  </div>
                </div>
              </div>
            )}

            {/* Supporting alerts — compact row */}
            <div className="grid grid-cols-3 gap-2">
              {content.alerts.map((alert, i) => {
                const config = alertTypeConfig[alert.type];
                const Icon = config.icon;
                return (
                  <div key={i} className={`${config.bg} border ${config.border} rounded-lg p-3`}>
                    <div className="flex items-start gap-1.5">
                      <Icon className={`w-3.5 h-3.5 ${config.iconColor} mt-0.5 flex-shrink-0`} />
                      <div>
                        <h5 className={`text-[11px] font-semibold ${config.titleColor} mb-0.5 leading-snug`}>{alert.title}</h5>
                        <p className="text-[10px] text-slate-600 leading-snug">{alert.body}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </SceneShell>
    </div>
  );
}
