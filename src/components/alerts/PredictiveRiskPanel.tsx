import { clsx } from 'clsx';
import { ShieldAlert } from 'lucide-react';
import type { Project, PredictiveRisk } from '../../types/project';

interface PredictiveRiskPanelProps {
  projects: Project[];
  predictiveRisks: Record<string, PredictiveRisk>;
}

const levelStyles: Record<string, { badge: string; dot: string }> = {
  High:   { badge: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',    dot: 'bg-red-500' },
  Medium: { badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400', dot: 'bg-amber-400' },
  Low:    { badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400', dot: 'bg-emerald-500' },
};

export function PredictiveRiskPanel({ projects, predictiveRisks }: PredictiveRiskPanelProps) {
  const sorted = [...projects].sort((a, b) => {
    const order = { High: 0, Medium: 1, Low: 2 };
    return order[predictiveRisks[a.id].level] - order[predictiveRisks[b.id].level];
  });

  const highCount = sorted.filter(p => predictiveRisks[p.id].level === 'High').length;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldAlert size={18} className="text-sky-500" />
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Predictive Risk Alerts</h3>
        </div>
        {highCount > 0 && (
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400">
            {highCount} high risk
          </span>
        )}
      </div>

      <ul className="divide-y divide-slate-100 dark:divide-slate-700">
        {sorted.map(project => {
          const risk = predictiveRisks[project.id];
          const styles = levelStyles[risk.level];
          return (
            <li key={project.id} className="px-5 py-3 flex items-center gap-3 group relative hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors">
              <span className={clsx('w-2 h-2 rounded-full flex-shrink-0', styles.dot)} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{project.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{risk.reasons.join(' · ')}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-xs text-slate-400 dark:text-slate-500">Score: {risk.score}</span>
                <span className={clsx('text-xs font-semibold px-2 py-0.5 rounded-full', styles.badge)}>
                  {risk.level}
                </span>
              </div>

              {/* Tooltip */}
              <div className="absolute right-4 bottom-full mb-2 z-20 hidden group-hover:block w-56 bg-slate-900 text-white text-xs rounded-lg p-3 shadow-xl pointer-events-none">
                <p className="font-semibold mb-1.5">Risk Score: {risk.score}/10 — {risk.level} Risk</p>
                <ul className="space-y-0.5">
                  {risk.reasons.map(r => (
                    <li key={r} className="text-slate-300">• {r}</li>
                  ))}
                </ul>
                <div className="absolute top-full right-4 -mt-px border-4 border-transparent border-t-slate-900" />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
