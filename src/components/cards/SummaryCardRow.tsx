import { SummaryCard } from './SummaryCard';
import type { KPISummary } from '../../types/project';
import { formatCurrency, formatPercent } from '../../lib/formatters';
import { FolderKanban, Clock, TrendingUp, AlertTriangle } from 'lucide-react';

interface SummaryCardRowProps {
  kpis: KPISummary;
}

export function SummaryCardRow({ kpis }: SummaryCardRowProps) {
  const onTimePct = (kpis.onTimeProjects / kpis.totalProjects) * 100;
  const budgetVariancePct = ((kpis.totalActualCost - kpis.totalBudget) / kpis.totalBudget) * 100;
  const isOverBudget = kpis.totalActualCost > kpis.totalBudget;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <SummaryCard
        title="Total Projects"
        value={String(kpis.totalProjects)}
        subtitle={`${kpis.criticalProjects} critical`}
        icon={<FolderKanban size={22} />}
        color="blue"
        trend={
          kpis.criticalProjects > 0
            ? { value: `${kpis.criticalProjects} critical`, positive: false }
            : { value: 'All healthy', positive: true }
        }
      />
      <SummaryCard
        title="On-Time Delivery"
        value={formatPercent(onTimePct, 0)}
        subtitle={`${kpis.onTimeProjects} of ${kpis.totalProjects} projects`}
        icon={<Clock size={22} />}
        color={onTimePct >= 70 ? 'green' : 'amber'}
        trend={{ value: `${kpis.onTimeProjects} on schedule`, positive: onTimePct >= 50 }}
      />
      <SummaryCard
        title="Portfolio Budget"
        value={formatCurrency(kpis.totalBudget, true)}
        subtitle={`Actual: ${formatCurrency(kpis.totalActualCost, true)}`}
        icon={<TrendingUp size={22} />}
        color={isOverBudget ? 'red' : 'green'}
        trend={{
          value: `${isOverBudget ? '+' : ''}${formatPercent(budgetVariancePct, 1)} variance`,
          positive: !isOverBudget,
        }}
      />
      <SummaryCard
        title="Avg Risk Score"
        value={`${kpis.avgRiskScore}/100`}
        subtitle={`${kpis.overBudgetProjects} over budget`}
        icon={<AlertTriangle size={22} />}
        color={kpis.avgRiskScore > 60 ? 'red' : kpis.avgRiskScore > 30 ? 'amber' : 'green'}
        trend={{
          value: kpis.avgRiskScore > 50 ? 'High portfolio risk' : 'Manageable risk',
          positive: kpis.avgRiskScore <= 50,
        }}
      />
    </div>
  );
}
