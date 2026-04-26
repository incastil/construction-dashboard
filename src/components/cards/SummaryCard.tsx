import { clsx } from 'clsx';

interface SummaryCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: {
    value: string;
    positive: boolean;
  };
  color?: 'blue' | 'green' | 'red' | 'amber';
}

const colorMap = {
  blue: {
    icon: 'bg-sky-100 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400',
  },
  green: {
    icon: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
  },
  red: {
    icon: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
  },
  amber: {
    icon: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
  },
};

export function SummaryCard({ title, value, subtitle, icon, trend, color = 'blue' }: SummaryCardProps) {
  const colors = colorMap[color];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 truncate">{title}</p>
          <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
          {subtitle && (
            <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
          )}
          {trend && (
            <div className={clsx(
              'mt-2 inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full',
              trend.positive
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
                : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400',
            )}>
              {trend.positive ? '▲' : '▼'} {trend.value}
            </div>
          )}
        </div>
        <div className={clsx('w-11 h-11 rounded-lg flex items-center justify-center shrink-0 ml-4', colors.icon)}>
          {icon}
        </div>
      </div>
    </div>
  );
}
