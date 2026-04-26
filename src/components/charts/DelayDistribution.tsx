import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from 'recharts';
import type { Project } from '../../types/project';

interface DelayDistributionProps {
  projects: Project[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-3 shadow-lg text-xs">
      <p className="font-semibold text-slate-700 dark:text-slate-300">{label}</p>
      <p className="text-slate-600 dark:text-slate-400">{payload[0].value} days late</p>
    </div>
  );
};

const COLORS: Record<string, string> = {
  'On Time': '#22c55e',
  'At Risk': '#f59e0b',
  'High Risk': '#f97316',
  'Critical': '#ef4444',
};

export function DelayDistribution({ projects }: DelayDistributionProps) {
  const data = projects.map(p => ({
    name: p.name.length > 20 ? p.name.slice(0, 18) + '…' : p.name,
    fullName: p.name,
    daysLate: p.daysLate,
    status: p.status,
  })).sort((a, b) => b.daysLate - a.daysLate);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">
        Schedule Delay by Project (days)
      </h3>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 16, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
          <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fontSize: 10, fill: '#94a3b8' }}
            width={120}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="daysLate" radius={[0, 4, 4, 0]}>
            {data.map((entry, i) => (
              <Cell key={i} fill={COLORS[entry.status] ?? '#94a3b8'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
