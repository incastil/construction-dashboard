import type { Insight } from '../../types/project';
import { TrendingUp, TrendingDown, Minus, Lightbulb } from 'lucide-react';
import { clsx } from 'clsx';

interface InsightPanelProps {
  insights: Insight[];
}

const impactConfig = {
  positive: {
    icon: <TrendingUp size={14} />,
    color: 'text-emerald-600 dark:text-emerald-400',
    badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    border: 'border-l-4 border-l-emerald-400',
  },
  negative: {
    icon: <TrendingDown size={14} />,
    color: 'text-red-600 dark:text-red-400',
    badge: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    border: 'border-l-4 border-l-red-400',
  },
  neutral: {
    icon: <Minus size={14} />,
    color: 'text-slate-500 dark:text-slate-400',
    badge: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
    border: 'border-l-4 border-l-slate-400',
  },
};

export function InsightPanel({ insights }: InsightPanelProps) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb size={16} className="text-amber-500" />
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          AI Insights
        </h3>
        <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 font-medium">
          Rule Engine
        </span>
      </div>

      <div className="space-y-3">
        {insights.map(insight => {
          const config = impactConfig[insight.impact];
          return (
            <div
              key={insight.id}
              className={clsx(
                'p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50',
                config.border,
              )}
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="flex items-center gap-1.5">
                  <span className={config.color}>{config.icon}</span>
                  <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                    {insight.title}
                  </span>
                </div>
                {insight.metric && (
                  <span className={clsx('text-xs font-bold px-1.5 py-0.5 rounded shrink-0', config.badge)}>
                    {insight.metric}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed ml-5">
                {insight.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
