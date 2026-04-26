import type { ProjectStatus } from '../../types/project';
import { clsx } from 'clsx';

interface StatusBadgeProps {
  status: ProjectStatus;
  size?: 'sm' | 'md';
}

const statusConfig: Record<ProjectStatus, { label: string; classes: string }> = {
  'On Time': {
    label: 'On Time',
    classes: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  },
  'At Risk': {
    label: 'At Risk',
    classes: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  },
  'High Risk': {
    label: 'High Risk',
    classes: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  },
  'Critical': {
    label: 'Critical',
    classes: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  },
};

export function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <span className={clsx(
      'inline-flex items-center font-medium rounded-full',
      size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm',
      config.classes,
    )}>
      {config.label}
    </span>
  );
}
