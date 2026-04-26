import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  Cell,
} from 'recharts';
import type { Project } from '../../types/project';

interface RiskScoreChartProps {
  projects: Project[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-3 shadow-lg text-xs">
      <p className="font-semibold text-slate-700 dark:text-slate-300 mb-1">{label}</p>
      <p className="text-slate-600 dark:text-slate-400">Risk Score: <strong>{payload[0].value}/100</strong></p>
    </div>
  );
};

function getRiskColor(score: number): string {
  if (score >= 70) return '#ef4444';
  if (score >= 40) return '#f97316';
  if (score >= 20) return '#f59e0b';
  return '#22c55e';
}

export function RiskScoreChart({ projects }: RiskScoreChartProps) {
  const data = projects
    .map(p => ({
      name: p.name.length > 18 ? p.name.slice(0, 16) + '…' : p.name,
      fullName: p.name,
      riskScore: p.riskScore,
    }))
    .sort((a, b) => b.riskScore - a.riskScore);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">
        Risk Score by Project (0–100)
      </h3>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} margin={{ top: 4, right: 12, bottom: 40, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 10, fill: '#94a3b8' }}
            angle={-30}
            textAnchor="end"
            interval={0}
          />
          <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#94a3b8' }} />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={70} stroke="#ef4444" strokeDasharray="4 2" label={{ value: 'Critical', fontSize: 10, fill: '#ef4444', position: 'right' }} />
          <ReferenceLine y={40} stroke="#f97316" strokeDasharray="4 2" label={{ value: 'High', fontSize: 10, fill: '#f97316', position: 'right' }} />
          <Bar dataKey="riskScore" radius={[4, 4, 0, 0]}>
            {data.map((entry, i) => (
              <Cell key={i} fill={getRiskColor(entry.riskScore)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
