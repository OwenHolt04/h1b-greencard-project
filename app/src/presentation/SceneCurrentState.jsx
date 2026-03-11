import { motion } from 'framer-motion';
import { XCircle, Mail, AlertTriangle, Clock, HelpCircle } from 'lucide-react';
import { SceneShell, MaskedHeading, StaggerGroup, StaggerItem } from './motion';

const problems = [
  { icon: XCircle, label: '4 separate portals', detail: 'DOL, USCIS, DOS, and employer HRIS — none connected' },
  { icon: Mail, label: '1 physical mailbox', detail: 'Paper notices with no digital tracking or alerts' },
  { icon: AlertTriangle, label: '~25% RFE rate', detail: 'Contradictions across 6+ forms caught months after filing' },
  { icon: Clock, label: 'Weeks of idle time', detail: 'No handoff ownership, no SLAs, no escalation path' },
  { icon: HelpCircle, label: '0 dashboards', detail: 'No single view of case status across agencies' },
  { icon: XCircle, label: 'No plain language', detail: '20+ page manuals with no guided eligibility checks' },
];

export default function SceneCurrentState() {
  return (
    <div className="h-screen w-full bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 flex flex-col items-center px-12 overflow-y-auto">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(248,242,182,0.08),transparent_60%)]" />

      <SceneShell maxWidth="max-w-4xl" className="relative text-center">
        <MaskedHeading className="mb-5">
          <p className="text-red-400 text-sm font-semibold tracking-wider uppercase mb-4">
            Current State
          </p>
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-white leading-tight mb-4">
            Fragmented, opaque,
            <br />
            and expensive to navigate.
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
            One immigration case is spread across agencies, forms, emails, physical mail, and legal interpretation. No single actor sees the full picture.
          </p>
        </MaskedHeading>

        <StaggerGroup className="grid grid-cols-3 gap-3 max-w-3xl mx-auto mb-6" stagger={0.07} delay={0.35}>
          {problems.map((p) => (
            <StaggerItem key={p.label}>
              <div className="bg-white/[0.06] backdrop-blur-sm rounded-xl border border-white/10 p-4 text-left">
                <div className="flex items-center gap-2 mb-1">
                  <p.icon className="w-4 h-4 text-red-400" />
                  <h3 className="font-semibold text-white text-base">{p.label}</h3>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed">{p.detail}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.4 }}
          className="text-slate-500 text-sm"
        >
          4 portals + 1 mailbox + 0 dashboards = no single source of truth
        </motion.p>
      </SceneShell>
    </div>
  );
}
