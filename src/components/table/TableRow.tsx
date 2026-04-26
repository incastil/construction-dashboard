import type { Project } from '../../types/project';
import { StatusBadge } from './StatusBadge';
import { formatCurrency, formatPercent, isOverBudget } from '../../lib/formatters';
import { clsx } from 'clsx';

interface TableRowProps {
  project: Project;
  index: number;
}

function RiskBar({ score }: { score: number }) {
  const color =
    score >= 70 ? 'bg-red-500' :
    score >= 40 ? 'bg-orange-500' :
    score >= 20 ? 'bg-amber-400' :
    'bg-emerald-500';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 min-w-[60px]">
        <div className={clsx('h-1.5 rounded-full transition-all', color)} style={{ width: `${score}%` }} />
      </div>
      <span className="text-xs font-medium text-slate-700 dark:text-slate-300 w-7 text-right">{score}</span>
    </div>
  );
}

export function TableRow({ project, index }: TableRowProps) {
  const overBudget = isOverBudget(project.budget, project.actualCost);
  const budgetVariancePct = ((project.actualCost - project.budget) / project.budget * 100).toFixed(1);

  return (
    <tr className={clsx(
      'border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors',
      index % 2 === 0 ? 'bg-white dark:bg-slate-800' : 'bg-slate-50/50 dark:bg-slate-800/50',
    )}>
      <td className="px-4 py-3">
        <div>
          <p className="text-sm font-medium text-slate-900 dark:text-white">{project.name}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">{project.location}</p>
        </div>
      </td>
      <td className="px-4 py-3">
        <p className="text-xs text-slate-600 dark:text-slate-400">{project.manager}</p>
      </td>
      <td className="px-4 py-3">
        <span className="text-xs px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400">
          {project.type}
        </span>
      </td>
      <td className="px-4 py-3">
        <StatusBadge status={project.status} />
      </td>
      <td className="px-4 py-3">
        <div>
          <p className="text-xs font-medium text-slate-900 dark:text-white">
            {formatCurrency(project.actualCost, true)}
          </p>
          <p className={clsx(
            'text-xs',
            overBudget ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400',
          )}>
            {overBudget ? '+' : ''}{budgetVariancePct}%
          </p>
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1">
          {project.daysLate === 0 ? (
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">On time</span>
          ) : (
            <span className="text-xs text-red-600 dark:text-red-400 font-medium">
              +{project.daysLate}d
            </span>
          )}
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 min-w-[50px]">
            <div
              className="h-1.5 rounded-full bg-sky-500 transition-all"
              style={{ width: `${project.completionPercent}%` }}
            />
          </div>
          <span className="text-xs text-slate-600 dark:text-slate-400 w-8 text-right">
            {formatPercent(project.completionPercent, 0)}
          </span>
        </div>
      </td>
      <td className="px-4 py-3 min-w-[100px]">
        <RiskBar score={project.riskScore} />
      </td>
    </tr>
  );
}
