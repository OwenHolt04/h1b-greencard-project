import { Check, Circle, Lock } from 'lucide-react';
import { stages as baseStages } from '../data/mockData';
import { useDemo } from '../context/DemoContext';
import { useMemo } from 'react';

const statusStyles = {
  complete: {
    dot: 'bg-green-600 text-white',
    line: 'bg-green-600',
    label: 'text-slate-700 font-medium',
  },
  active: {
    dot: 'bg-navy-900 text-white ring-4 ring-navy-900/20',
    line: 'bg-slate-200',
    label: 'text-navy-900 font-semibold',
  },
  upcoming: {
    dot: 'bg-slate-200 text-slate-400',
    line: 'bg-slate-200',
    label: 'text-slate-400',
  },
  blocked: {
    dot: 'bg-red-100 text-red-600 ring-4 ring-red-100',
    line: 'bg-slate-200',
    label: 'text-red-600 font-medium',
  },
};

export default function StageTimeline({ compact = false }) {
  const { stageAdvanced } = useDemo();

  const stages = useMemo(() => {
    if (!stageAdvanced) return baseStages;
    // Advance: I-485 becomes complete, biometrics becomes active
    return baseStages.map((s) => {
      if (s.id === 'i485') return { ...s, status: 'complete', date: 'Mar 2026' };
      if (s.id === 'biometrics') return { ...s, status: 'active', date: 'Scheduled' };
      return s;
    });
  }, [stageAdvanced]);

  return (
    <div className="w-full overflow-x-auto">
      <div className="flex items-start min-w-[600px]">
        {stages.map((stage, i) => {
          const style = statusStyles[stage.status];
          const isLast = i === stages.length - 1;

          return (
            <div key={stage.id} className="flex items-start flex-1">
              <div className="flex flex-col items-center">
                {/* Dot */}
                <div
                  className={`flex items-center justify-center rounded-full transition-all duration-500 ${style.dot} ${
                    compact ? 'w-7 h-7' : 'w-9 h-9'
                  }`}
                >
                  {stage.status === 'complete' ? (
                    <Check className={compact ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
                  ) : stage.status === 'active' ? (
                    <Circle className={compact ? 'w-3 h-3' : 'w-3.5 h-3.5'} fill="currentColor" />
                  ) : stage.status === 'blocked' ? (
                    <Lock className={compact ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
                  ) : (
                    <Circle className={compact ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
                  )}
                </div>

                {/* Label */}
                <span
                  className={`mt-2 text-center leading-tight transition-colors duration-300 ${style.label} ${
                    compact ? 'text-[11px]' : 'text-xs'
                  }`}
                >
                  {stage.label}
                </span>

                {/* Date */}
                {!compact && stage.date && (
                  <span className="text-[10px] text-slate-400 mt-0.5">{stage.date}</span>
                )}

                {/* Agency badge */}
                {!compact && (
                  <span className="text-[9px] text-slate-400 mt-0.5 uppercase tracking-wider">
                    {stage.agency}
                  </span>
                )}
              </div>

              {/* Connector line */}
              {!isLast && (
                <div className="flex-1 flex items-center pt-[14px]">
                  <div
                    className={`h-0.5 w-full mx-1 transition-colors duration-500 ${
                      stage.status === 'complete' ? 'bg-green-600' : 'bg-slate-200'
                    }`}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
