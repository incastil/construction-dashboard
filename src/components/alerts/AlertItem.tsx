import type { Alert } from '../../types/project';
import { AlertTriangle, Clock, TrendingUp, ShieldAlert } from 'lucide-react';
import { clsx } from 'clsx';

interface AlertItemProps {
  alert: Alert;
}

const typeIcons = {
  budget: <TrendingUp size={14} />,
  delay: <Clock size={14} />,
  risk: <AlertTriangle size={14} />,
  safety: <ShieldAlert size={14} />,
};

const typeLabels = {
  budget: 'Budget',
  delay: 'Schedule',
  risk: 'Risk',
  safety: 'Safety',
};

export function AlertItem({ alert }: AlertItemProps) {
  const isCritical = alert.severity === 'critical';

  return (
    <div className={clsx(
      'flex items-start gap-3 p-3 rounded-lg border',
      isCritical
        ? 'border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-900/10'
        : 'border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-900/10',
    )}>
      <div className={clsx(
        'mt-0.5 shrink-0',
        isCritical ? 'text-red-500' : 'text-amber-500',
      )}>
        {typeIcons[alert.type]}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
          <span className={clsx(
            'text-xs font-semibold px-1.5 py-0.5 rounded uppercase tracking-wide',
            isCritical
              ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
              : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
          )}>
            {isCritical ? '⚠ Critical' : typeLabels[alert.type]}
          </span>
          <span className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate">
            {alert.projectName}
          </span>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          {alert.message}
        </p>
      </div>
    </div>
  );
}
