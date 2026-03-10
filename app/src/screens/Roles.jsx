import { useDemo } from '../context/DemoContext';
import { motion, AnimatePresence } from 'framer-motion';
import ReadinessScore from '../components/ReadinessScore';
import StageTimeline from '../components/StageTimeline';
import { roleContent, applicant, employer, attorney, caseRecord, eligibilityChecks } from '../data/mockData';
import {
  User, Building2, Scale, AlertTriangle, CheckCircle, Info,
  Clock, ArrowRight, Shield, FileText, Calendar, Sparkles, XCircle
} from 'lucide-react';

const roles = [
  { id: 'applicant', label: 'Applicant', icon: User, description: 'Plain language, reassurance, self-service' },
  { id: 'employer', label: 'Employer / HR', icon: Building2, description: 'Deadlines, costs, workforce continuity' },
  { id: 'attorney', label: 'Attorney', icon: Scale, description: 'Filing readiness, risk flags, evidence' },
];

const alertTypeConfig = {
  error: { icon: AlertTriangle, bg: 'bg-red-50', border: 'border-red-200', iconColor: 'text-red-500', titleColor: 'text-red-900' },
  warning: { icon: Clock, bg: 'bg-amber-50', border: 'border-amber-200', iconColor: 'text-amber-500', titleColor: 'text-amber-900' },
  info: { icon: Info, bg: 'bg-blue-50', border: 'border-blue-200', iconColor: 'text-blue-500', titleColor: 'text-blue-900' },
  success: { icon: CheckCircle, bg: 'bg-green-50', border: 'border-green-200', iconColor: 'text-green-600', titleColor: 'text-green-900' },
};

export default function Roles() {
  const { currentRole, switchRole, readinessScore, navigate } = useDemo();
  const content = roleContent[currentRole];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="max-w-6xl mx-auto px-6 py-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Stakeholder Views</h1>
          <p className="text-base text-slate-500">Same case, same record — different priorities and language.</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-400 uppercase tracking-wider font-medium">Case</p>
          <p className="text-base font-medium text-slate-700">{caseRecord.caseName}</p>
        </div>
      </div>

      {/* Role Switcher */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-1.5 mb-6 inline-flex">
        {roles.map((role) => (
          <button
            key={role.id}
            onClick={() => switchRole(role.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg text-base font-medium transition-all duration-200 cursor-pointer ${
              currentRole === role.id
                ? 'bg-navy-900 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
            }`}
          >
            <role.icon className="w-4 h-4" />
            {role.label}
          </button>
        ))}
      </div>

      {/* Role Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentRole}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
        >
          {/* Greeting + Status */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm mb-5 overflow-hidden">
            <div className="px-6 py-5">
              <div className="flex items-start justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <RoleBadge role={currentRole} />
                    <span className="text-xs text-slate-400">
                      {currentRole === 'applicant' ? applicant.fullName :
                       currentRole === 'employer' ? `${employer.hrOwner}, ${employer.displayName}` :
                       `${attorney.attorneyName}, ${attorney.lawFirm}`}
                    </span>
                  </div>
                  <h2 className="text-2xl font-semibold text-slate-900 mb-2">{content.greeting}</h2>
                  <p className="text-base text-slate-600 leading-relaxed">{content.statusSummary}</p>
                </div>
                <ReadinessScore score={readinessScore} size={80} strokeWidth={6} />
              </div>
            </div>

            {/* Timeline (compact) */}
            <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100">
              <StageTimeline compact />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Next Step */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-5 mb-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-accent/40 flex items-center justify-center">
                    <ArrowRight className="w-4 h-4 text-navy-900" />
                  </div>
                  <h3 className="text-base font-semibold text-slate-900">Next Step</h3>
                </div>
                <p className="text-base text-slate-700 leading-relaxed mb-4">{content.nextStep}</p>

                {/* Timeline context */}
                <div className="bg-slate-50 rounded-lg px-4 py-3">
                  <p className="text-sm text-slate-500 leading-relaxed">{content.timeline}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-5">
                <h3 className="text-base font-semibold text-slate-900 mb-3">Available Actions</h3>
                <div className="space-y-2">
                  {content.actions.map((action, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        if (action.toLowerCase().includes('validation') || action.toLowerCase().includes('resolve') || action.toLowerCase().includes('standardize')) {
                          navigate('intake');
                        }
                      }}
                      className="w-full flex items-center justify-between px-4 py-3 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 transition-all duration-200 cursor-pointer group"
                    >
                      <span className="text-sm font-medium text-slate-700">{action}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-500 transition-colors" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Applicant: Plain-Language Eligibility Wizard */}
              {currentRole === 'applicant' && (
                <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden mt-5">
                  <div className="px-5 py-3 border-b border-slate-100 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-navy-900" />
                    <h3 className="text-base font-semibold text-slate-900">Your Eligibility Check</h3>
                    <span className="ml-auto text-xs font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
                      {eligibilityChecks.filter(c => c.answer).length} of {eligibilityChecks.length} confirmed
                    </span>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {eligibilityChecks.map((check) => (
                      <div key={check.id} className={`px-5 py-3 flex items-start gap-3 ${!check.answer ? 'bg-amber-50/50' : ''}`}>
                        {check.answer ? (
                          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        ) : (
                          <XCircle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900">{check.question}</p>
                          <p className="text-sm text-slate-500 mt-0.5">{check.plain}</p>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex-shrink-0 mt-1">
                          {check.category}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Employer: Sponsorship Cost Breakdown */}
              {currentRole === 'employer' && (
                <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-5 mt-5">
                  <h3 className="text-base font-semibold text-slate-900 mb-3">Sponsorship Cost Breakdown</h3>
                  <div className="space-y-2">
                    {[
                      { phase: 'PERM (Labor Cert.)', cost: '$4,000–$6,000', status: 'Paid' },
                      { phase: 'I-140 (Petition)', cost: '$3,000–$5,000', status: 'Paid' },
                      { phase: 'I-485 (Adjustment)', cost: '$5,000–$7,000', status: 'Upcoming' },
                      { phase: 'H-1B Extensions (×2)', cost: '$2,500–$4,000 / cycle', status: 'Recurring' },
                    ].map((item) => (
                      <div key={item.phase} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                        <div>
                          <p className="text-sm font-medium text-slate-700">{item.phase}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-semibold text-slate-900">{item.cost}</span>
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                            item.status === 'Paid' ? 'bg-green-50 text-green-700' :
                            item.status === 'Upcoming' ? 'bg-amber-50 text-amber-700' :
                            'bg-blue-50 text-blue-700'
                          }`}>{item.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-200 flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-900">Estimated Total</span>
                    <span className="text-lg font-bold text-navy-900">$15,000–$22,000</span>
                  </div>
                </div>
              )}
            </div>

            {/* Alerts */}
            <div className="space-y-3">
              <h3 className="text-base font-semibold text-slate-900 px-1">
                {currentRole === 'applicant' ? 'Your Updates' :
                 currentRole === 'employer' ? 'Key Risks & Costs' :
                 'Risk Flags'}
              </h3>
              {content.alerts.map((alert, i) => {
                const config = alertTypeConfig[alert.type];
                const Icon = config.icon;
                return (
                  <div
                    key={i}
                    className={`${config.bg} border ${config.border} rounded-xl p-4`}
                  >
                    <div className="flex items-start gap-3">
                      <Icon className={`w-4 h-4 ${config.iconColor} mt-0.5 flex-shrink-0`} />
                      <div>
                        <h4 className={`text-sm font-semibold ${config.titleColor} mb-1`}>{alert.title}</h4>
                        <p className="text-sm text-slate-600 leading-relaxed">{alert.body}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

function RoleBadge({ role }) {
  const config = {
    applicant: { label: 'Applicant View', color: 'bg-blue-100 text-blue-700' },
    employer: { label: 'Employer / HR View', color: 'bg-amber-100 text-amber-700' },
    attorney: { label: 'Attorney View', color: 'bg-purple-100 text-purple-700' },
  };
  const c = config[role];
  return (
    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${c.color}`}>
      {c.label}
    </span>
  );
}
