import { useDemo } from '../context/DemoContext';
import { motion } from 'framer-motion';
import StageTimeline from '../components/StageTimeline';
import ReadinessScore from '../components/ReadinessScore';
import { applicant, employer, attorney, caseRecord, agencyStatus, alerts as allAlerts } from '../data/mockData';
import {
  Clock, AlertTriangle, CheckCircle, Info, ArrowRight,
  User, Building2, Scale, Calendar, FileText, Bell, ShieldAlert
} from 'lucide-react';

const severityIcon = {
  error: { icon: AlertTriangle, color: 'text-red-500 bg-red-50' },
  warning: { icon: Clock, color: 'text-amber-500 bg-amber-50' },
  info: { icon: Info, color: 'text-blue-500 bg-blue-50' },
  success: { icon: CheckCircle, color: 'text-green-600 bg-green-50' },
};

const agencyColors = {
  green: 'text-green-700 bg-green-50',
  blue: 'text-blue-700 bg-blue-50',
  amber: 'text-amber-700 bg-amber-50',
};

export default function Dashboard() {
  const { navigate, readinessScore, caseHealth, unresolvedCount, alertFocus } = useDemo();

  const isDeadlineFocus = alertFocus === 'deadline';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="max-w-7xl mx-auto px-6 py-6"
    >
      {/* Case Header */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm mb-5 overflow-hidden">
        <div className="px-6 py-4 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-6 flex-wrap">
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider font-medium">Case</p>
              <p className="text-lg font-semibold text-slate-900">{caseRecord.caseName}</p>
              <p className="text-sm text-slate-500">{caseRecord.caseId}</p>
            </div>

            <div className="h-10 w-px bg-slate-200 hidden md:block" />

            <div className="flex items-center gap-5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                  <User className="w-4 h-4 text-slate-500" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Applicant</p>
                  <p className="text-sm font-medium text-slate-700">{applicant.fullName}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-slate-500" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Employer</p>
                  <p className="text-sm font-medium text-slate-700">{employer.displayName}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                  <Scale className="w-4 h-4 text-slate-500" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Attorney</p>
                  <p className="text-sm font-medium text-slate-700">{attorney.attorneyName}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <div className="text-right">
              <p className="text-xs text-slate-400 uppercase tracking-wider">Stage</p>
              <p className="text-base font-semibold text-navy-900">I-485 Preparation</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400 uppercase tracking-wider">Priority Date</p>
              <p className="text-base font-medium text-slate-700">{caseRecord.priorityDate}</p>
            </div>
            <ReadinessScore score={readinessScore} size={56} strokeWidth={5} showLabel={false} />
          </div>
        </div>
      </div>

      {/* Journey Timeline */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm px-6 py-5 mb-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-slate-900">Case Journey</h2>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
            caseHealth === 'On Track'
              ? 'bg-green-50 text-green-700'
              : 'bg-amber-50 text-amber-700'
          }`}>
            {caseHealth}
          </span>
        </div>
        <StageTimeline />
      </div>

      {/* Deadline Protection — prominent when ?alert=deadline */}
      {isDeadlineFocus && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-5"
        >
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border-2 border-amber-300 p-6 shadow-md">
            <div className="flex items-start gap-5">
              <div className="flex-shrink-0">
                <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center">
                  <ShieldAlert className="w-7 h-7 text-amber-600" />
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-amber-900 mb-2">H-1B Extension — Deadline Protection</h2>
                <div className="flex items-baseline gap-3 mb-3">
                  <span className="text-5xl font-bold text-amber-700">102</span>
                  <span className="text-lg text-amber-600 font-medium">days remaining</span>
                </div>
                <p className="text-base text-amber-800 leading-relaxed mb-4">
                  Status expires June 15, 2026. Auto-trigger for extension filing at 90 days (March 17, 2026). No manual tracking required — the system protects against missed deadlines.
                </p>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white/70 rounded-lg p-3 border border-amber-200">
                    <p className="text-xs text-amber-600 font-semibold uppercase tracking-wider mb-1">Auto-Trigger</p>
                    <p className="text-base font-bold text-amber-900">90 days before</p>
                    <p className="text-sm text-amber-700">March 17, 2026</p>
                  </div>
                  <div className="bg-white/70 rounded-lg p-3 border border-amber-200">
                    <p className="text-xs text-amber-600 font-semibold uppercase tracking-wider mb-1">Est. Cost</p>
                    <p className="text-base font-bold text-amber-900">$2,500–4,000</p>
                    <p className="text-sm text-amber-700">vs $5,000+ rush</p>
                  </div>
                  <div className="bg-white/70 rounded-lg p-3 border border-amber-200">
                    <p className="text-xs text-amber-600 font-semibold uppercase tracking-wider mb-1">Responsible</p>
                    <p className="text-base font-bold text-amber-900">Rachel Torres</p>
                    <p className="text-sm text-amber-700">HPE HR, auto-notified</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <div className="flex-1 h-3 bg-amber-200/60 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: `${((365-102)/365)*100}%` }} />
                  </div>
                  <span className="text-sm text-amber-600 font-semibold whitespace-nowrap">Auto @ 90d</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left column: Agency Status + Next Step */}
        <div className="lg:col-span-2 space-y-5">
          {/* Cross-Agency Status */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-5">
            <h2 className="text-base font-semibold text-slate-900 mb-4">Cross-Agency Status</h2>
            <div className="space-y-3">
              {agencyStatus.map((a) => (
                <div key={a.agency} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50/70">
                  <div className={`px-2.5 py-1 rounded text-xs font-bold tracking-wider ${agencyColors[a.statusColor]}`}>
                    {a.agency}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span className="text-base font-medium text-slate-900">{a.status}</span>
                      <span className="text-xs text-slate-400">Updated {a.lastUpdated}</span>
                    </div>
                    <p className="text-sm text-slate-500 mt-0.5">{a.plainExplanation}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Plain-Language Next Step */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-accent/40 flex items-center justify-center">
                <FileText className="w-4 h-4 text-navy-900" />
              </div>
              <h2 className="text-base font-semibold text-slate-900">What's Happening Now</h2>
            </div>
            <p className="text-base text-slate-700 leading-relaxed">
              Your I-485 adjustment of status package is being prepared for concurrent filing. Your attorney is reviewing 3 items before the package can be finalized. After a multi-year wait, your EB-2 India priority date is now current — this is the filing window.
            </p>
            <div className="mt-4 flex gap-3">
              <button
                onClick={() => navigate('intake')}
                className="text-sm font-semibold text-navy-900 hover:text-navy-700 transition-colors flex items-center gap-1 cursor-pointer"
              >
                Open Validation Review <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => navigate('roles')}
                className="text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors flex items-center gap-1 cursor-pointer"
              >
                Switch Role View <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Case Coordinator / Handoff SLAs */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-5">
            <h2 className="text-base font-semibold text-slate-900 mb-3">Case Team</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center">
                    <Scale className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">Maya Chen <span className="text-slate-400 font-normal">· Lead Counsel</span></p>
                    <p className="text-xs text-slate-400">SLA: 2 business days</p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Active</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center">
                    <Building2 className="w-4 h-4 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">Rachel Torres <span className="text-slate-400 font-normal">· HR Owner</span></p>
                    <p className="text-xs text-slate-400">SLA: 3 business days</p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Alerts + Deadline */}
        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <Bell className="w-4 h-4 text-slate-400" />
                Alerts
              </h2>
              <span className="text-xs font-bold text-white bg-amber-500 px-2 py-0.5 rounded-full">
                {allAlerts.length}
              </span>
            </div>

            <div className="space-y-3">
              {allAlerts.map((alert) => {
                const sev = severityIcon[alert.severity];
                const Icon = sev.icon;
                return (
                  <div key={alert.id} className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg ${sev.color} flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-900">{alert.title}</p>
                      <p className="text-sm text-slate-500 leading-relaxed">{alert.body}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Deadline Card — always visible but compact when not focused */}
          {!isDeadlineFocus && (
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200/60 p-5">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-amber-600" />
                <h3 className="text-base font-semibold text-amber-900">H-1B Extension Window</h3>
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-4xl font-bold text-amber-700">102</span>
                <span className="text-base text-amber-600 font-medium">days remaining</span>
              </div>
              <p className="text-sm text-amber-700/80 leading-relaxed">
                Status expires June 15, 2026. Auto-trigger at 90 days (March 17, 2026). No action required yet.
              </p>
              <div className="mt-3 flex items-center gap-2">
                <div className="flex-1 h-2 bg-amber-200/60 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: `${((365-102)/365)*100}%` }} />
                </div>
                <span className="text-xs text-amber-600 font-medium whitespace-nowrap">Auto @ 90d</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
