import { CostTrendChart } from '../components/charts/CostTrendChart';
import { DelayDistribution } from '../components/charts/DelayDistribution';
import { StatusPieChart } from '../components/charts/StatusPieChart';
import { RiskScoreChart } from '../components/charts/RiskScoreChart';
import { useProjects } from '../hooks/useProjects';
import { formatCurrency, formatPercent } from '../lib/formatters';

type ProjectsData = ReturnType<typeof useProjects>;

interface AnalyticsProps {
  data: ProjectsData;
}

export function Analytics({ data }: AnalyticsProps) {
  const { projects, kpis } = data;

  const totalOverrun = projects
    .filter(p => p.actualCost > p.budget)
    .reduce((s, p) => s + (p.actualCost - p.budget), 0);

  const avgCompletion =
    projects.reduce((s, p) => s + p.completionPercent, 0) / projects.length;

  const totalChangeOrders = projects.reduce((s, p) => s + p.changeOrders, 0);
  const totalSafetyIncidents = projects.reduce((s, p) => s + p.safetyIncidents, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Analytics Overview</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Deep-dive into portfolio performance metrics
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Total Budget Overrun',
            value: formatCurrency(totalOverrun, true),
            sub: `${kpis.overBudgetProjects} projects over budget`,
            color: 'text-red-600 dark:text-red-400',
          },
          {
            label: 'Avg Completion',
            value: formatPercent(avgCompletion, 0),
            sub: 'Across all projects',
            color: 'text-sky-600 dark:text-sky-400',
          },
          {
            label: 'Change Orders',
            value: String(totalChangeOrders),
            sub: 'Total across portfolio',
            color: 'text-amber-600 dark:text-amber-400',
          },
          {
            label: 'Safety Incidents',
            value: String(totalSafetyIncidents),
            sub: 'Recorded incidents',
            color: totalSafetyIncidents > 0 ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400',
          },
        ].map(stat => (
          <div
            key={stat.label}
            className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 shadow-sm"
          >
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">{stat.label}</p>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* All 4 charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CostTrendChart projects={projects} />
        <StatusPieChart projects={projects} />
        <DelayDistribution projects={projects} />
        <RiskScoreChart projects={projects} />
      </div>
    </div>
  );
}
