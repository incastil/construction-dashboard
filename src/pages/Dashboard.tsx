import { SummaryCardRow } from '../components/cards/SummaryCardRow';
import { CostTrendChart } from '../components/charts/CostTrendChart';
import { StatusPieChart } from '../components/charts/StatusPieChart';
import { AlertPanel } from '../components/alerts/AlertPanel';
import { InsightPanel } from '../components/insights/InsightPanel';
import { useProjects } from '../hooks/useProjects';

type ProjectsData = ReturnType<typeof useProjects>;

interface DashboardProps {
  data: ProjectsData;
}

export function Dashboard({ data }: DashboardProps) {
  const { projects, kpis, alerts, insights } = data;

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <SummaryCardRow kpis={kpis} />

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CostTrendChart projects={projects} />
        <StatusPieChart projects={projects} />
      </div>

      {/* Alerts + Insights row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AlertPanel alerts={alerts} />
        <InsightPanel insights={insights} />
      </div>
    </div>
  );
}
