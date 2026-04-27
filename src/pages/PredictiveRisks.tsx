import { clsx } from 'clsx';
import { ShieldAlert } from 'lucide-react';
import { useProjects } from '../hooks/useProjects';
import type { PredictiveRisk, Project } from '../types/project';

type ProjectsData = ReturnType<typeof useProjects>;

interface PredictiveRisksProps {
  data: ProjectsData;
}

const levelStyles: Record<string, { badge: string; dot: string; row: string }> = {
  High:   { badge: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',    dot: 'bg-red-500',    row: 'border-l-4 border-red-500' },
  Medium: { badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400', dot: 'bg-amber-400', row: 'border-l-4 border-amber-400' },
  Low:    { badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400', dot: 'bg-emerald-500', row: 'border-l-4 border-emerald-500' },
};

function RiskCard({ project, risk }: { project: Project; risk: PredictiveRisk }) {
  const styles = levelStyles[risk.level];
  return (
    <div className={clsx(
      'bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5',
      styles.row,
    )}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{project.name}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">{project.location} · {project.manager}</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-xs text-slate-400 dark:text-slate-500">Score: {risk.score}/10</span>
          <span className={clsx('text-xs font-semibold px-2.5 py-1 rounded-full', styles.badge)}>
            {risk.level} Risk
          </span>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {risk.reasons.map(r => (
          <span
            key={r}
            className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
          >
            {r}
          </span>
        ))}
      </div>

      {/* Score bar */}
      <div className="mt-3 flex items-center gap-2">
        <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
          <div
            className={clsx('h-1.5 rounded-full transition-all', styles.dot)}
            style={{ width: `${(risk.score / 10) * 100}%` }}
          />
        </div>
        <span className="text-xs text-slate-400">{risk.score}/10</span>
      </div>
    </div>
  );
}

export function PredictiveRisks({ data }: PredictiveRisksProps) {
  const { projects, predictiveRisks } = data;

  const sorted = [...projects].sort((a, b) => {
    const order = { High: 0, Medium: 1, Low: 2 };
    return order[predictiveRisks[a.id].level] - order[predictiveRisks[b.id].level];
  });

  const high   = sorted.filter(p => predictiveRisks[p.id].level === 'High');
  const medium = sorted.filter(p => predictiveRisks[p.id].level === 'Medium');
  const low    = sorted.filter(p => predictiveRisks[p.id].level === 'Low');

  function Section({ title, items, dot }: { title: string; items: Project[]; dot: string }) {
    if (items.length === 0) return null;
    return (
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className={clsx('w-2.5 h-2.5 rounded-full', dot)} />
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">{title} ({items.length})</h3>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {items.map(p => <RiskCard key={p.id} project={p} risk={predictiveRisks[p.id]} />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <ShieldAlert size={20} className="text-sky-500" />
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Predictive Risk Alerts</h2>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Rule-based analysis flagging projects likely to experience delays or cost overruns.
        </p>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'High Risk', count: high.length, badge: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400' },
          { label: 'Medium Risk', count: medium.length, badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400' },
          { label: 'Low Risk', count: low.length, badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400' },
        ].map(({ label, count, badge }) => (
          <div key={label} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-4 text-center">
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{count}</p>
            <span className={clsx('text-xs font-semibold px-2 py-0.5 rounded-full mt-1 inline-block', badge)}>{label}</span>
          </div>
        ))}
      </div>

      <Section title="High Risk" items={high} dot="bg-red-500" />
      <Section title="Medium Risk" items={medium} dot="bg-amber-400" />
      <Section title="Low Risk" items={low} dot="bg-emerald-500" />
    </div>
  );
}
