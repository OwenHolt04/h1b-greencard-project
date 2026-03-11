import { motion } from 'framer-motion';
import { User, Building2, Scale } from 'lucide-react';
import { useDemo } from '../context/DemoContext';
import ReadinessScore from '../components/ReadinessScore';
import StageTimeline from '../components/StageTimeline';
import { SceneShell, MaskedHeading, FocalCard, SupportingModule } from './motion';
import { applicant, employer, attorney, caseRecord, agencyStatus } from '../data/mockData';

const agencyColors = {
  green: 'text-green-700 bg-green-50',
  blue: 'text-blue-700 bg-blue-50',
  amber: 'text-amber-700 bg-amber-50',
};

export default function SceneCaseWorkspace() {
  const { readinessScore, caseHealth } = useDemo();

  return (
    <div className="h-screen w-full bg-surface flex flex-col items-center px-12 overflow-y-auto">
      <SceneShell maxWidth="max-w-3xl">
        {/* Scene heading */}
        <MaskedHeading className="text-center mb-5">
          <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">Case Workspace</p>
          <h2 className="font-serif text-3xl font-bold text-navy-900">Single Source of Truth</h2>
        </MaskedHeading>

        {/* Hero: Case Identity + Readiness Score */}
        <FocalCard className="p-6 mb-3" delay={0.1}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider font-medium">Case</p>
              <p className="text-lg font-semibold text-navy-900">{caseRecord.caseName}</p>
              <p className="text-xs text-slate-500">{caseRecord.caseId}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                caseHealth === 'On Track' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
              }`}>
                {caseHealth}
              </span>
              <ReadinessScore score={readinessScore} size={64} strokeWidth={5} showLabel={false} />
            </div>
          </div>

          {/* Case team — compact inline */}
          <div className="flex items-center gap-4 pt-3 border-t border-slate-100">
            {[
              { icon: User, role: 'Applicant', name: applicant.fullName },
              { icon: Building2, role: 'Employer', name: employer.displayName },
              { icon: Scale, role: 'Attorney', name: attorney.attorneyName },
            ].map((p) => (
              <div key={p.role} className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center">
                  <p.icon className="w-3.5 h-3.5 text-slate-500" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400">{p.role}</p>
                  <p className="text-xs font-medium text-navy-900">{p.name}</p>
                </div>
              </div>
            ))}
          </div>
        </FocalCard>

        {/* Timeline — dominant secondary */}
        <SupportingModule className="px-5 py-4 mb-3" delay={0.25}>
          <h3 className="text-xs font-semibold text-navy-900 mb-2.5">Case Journey</h3>
          <StageTimeline compact />
        </SupportingModule>

        {/* Agency status — compact inline */}
        <motion.div
          className="flex gap-2.5 mb-3"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        >
          {agencyStatus.map((a) => (
            <div key={a.agency} className="flex-1 bg-white rounded-lg border border-slate-200/80 shadow-sm p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${agencyColors[a.statusColor]}`}>
                  {a.agency}
                </span>
              </div>
              <p className="text-xs font-medium text-navy-900 leading-snug">{a.status}</p>
            </div>
          ))}
        </motion.div>

        {/* What's happening now — accent callout */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="bg-accent/15 rounded-xl px-5 py-3.5 border border-accent/25"
        >
          <p className="text-sm text-slate-700 leading-relaxed">
            <span className="font-semibold text-navy-900">Now: </span>
            I-485 package in preparation. 3 items need attorney review. Your EB-2 India priority date is now current — this is the filing window.
          </p>
        </motion.div>
      </SceneShell>
    </div>
  );
}
