import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import type { Project } from '../../types/project';
import { formatCurrency } from '../../lib/formatters';

interface CostTrendChartProps {
  projects: Project[];
}

function aggregateCostTrend(projects: Project[]) {
  const monthMap: Record<string, { budgeted: number; actual: number; count: number }> = {};

  for (const project of projects) {
    for (const point of project.costTrend) {
      if (!monthMap[point.month]) {
        monthMap[point.month] = { budgeted: 0, actual: 0, count: 0 };
      }
      monthMap[point.month].budgeted += point.budgeted;
      monthMap[point.month].actual += point.actual;
      monthMap[point.month].count += 1;
    }
  }

  const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return Object.entries(monthMap)
    .sort(([a], [b]) => monthOrder.indexOf(a) - monthOrder.indexOf(b))
    .map(([month, vals]) => ({
      month,
      Budgeted: Math.round(vals.budgeted),
      Actual: Math.round(vals.actual),
    }));
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-3 shadow-lg text-xs">
      <p className="font-semibold text-slate-700 dark:text-slate-300 mb-1">{label}</p>
      {payload.map((entry: any) => (
        <p key={entry.dataKey} style={{ color: entry.color }}>
          {entry.name}: {formatCurrency(entry.value, true)}
        </p>
      ))}
    </div>
  );
};

export function CostTrendChart({ projects }: CostTrendChartProps) {
  const data = aggregateCostTrend(projects);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">
        Portfolio Cost Trend — Budgeted vs Actual
      </h3>
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={data} margin={{ top: 4, right: 12, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:[&>line]:stroke-slate-700" />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} />
          <YAxis
            tickFormatter={v => formatCurrency(v, true)}
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            width={60}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
          <Line
            type="monotone"
            dataKey="Budgeted"
            stroke="#0ea5e9"
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
          <Line
            type="monotone"
            dataKey="Actual"
            stroke="#f97316"
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
            strokeDasharray="5 3"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
