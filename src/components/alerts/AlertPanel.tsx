import { useState } from 'react';
import type { Alert } from '../../types/project';
import { AlertItem } from './AlertItem';
import { Bell } from 'lucide-react';

interface AlertPanelProps {
  alerts: Alert[];
}

export function AlertPanel({ alerts }: AlertPanelProps) {
  const [showAll, setShowAll] = useState(false);
  const criticalCount = alerts.filter(a => a.severity === 'critical').length;
  const displayedAlerts = showAll ? alerts : alerts.slice(0, 6);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bell size={16} className="text-slate-500 dark:text-slate-400" />
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Active Alerts
          </h3>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-500 text-white">
            {alerts.length}
          </span>
        </div>
        {criticalCount > 0 && (
          <span className="text-xs text-red-600 dark:text-red-400 font-medium">
            {criticalCount} critical
          </span>
        )}
      </div>

      {alerts.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-3">
            <Bell size={20} className="text-emerald-600 dark:text-emerald-400" />
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">No active alerts</p>
        </div>
      ) : (
        <>
          <div className="space-y-2">
            {displayedAlerts.map(alert => (
              <AlertItem key={alert.id} alert={alert} />
            ))}
          </div>
          {alerts.length > 6 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="mt-3 w-full text-xs text-sky-600 dark:text-sky-400 hover:underline font-medium"
            >
              {showAll ? 'Show less' : `Show ${alerts.length - 6} more alerts`}
            </button>
          )}
        </>
      )}
    </div>
  );
}
