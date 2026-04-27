import { useState, useRef, useEffect } from 'react';
import { Sun, Moon, Bell, Menu, HardHat, X } from 'lucide-react';
import { clsx } from 'clsx';
import type { Alert } from '../../types/project';
import { AlertItem } from '../alerts/AlertItem';

interface TopBarProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  alerts: Alert[];
  currentPage: string;
  onNavigate: (page: string) => void;
  onMobileMenuOpen: () => void;
}

const pageTitles: Record<string, string> = {
  dashboard: 'Dashboard',
  projects: 'Projects',
  analytics: 'Analytics',
  'predictive-risks': 'Predictive Risks',
  upload: 'Data Upload',
  settings: 'Settings',
};

export function TopBar({ theme, onToggleTheme, alerts, currentPage, onNavigate, onMobileMenuOpen }: TopBarProps) {
  const criticalCount = alerts.filter(a => a.severity === 'critical').length;
  const [alertsOpen, setAlertsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!alertsOpen) return;
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setAlertsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [alertsOpen]);

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between px-4 lg:px-6 h-14 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 shadow-sm">
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMobileMenuOpen}
          className="lg:hidden p-2 rounded-md text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>

        <div className="lg:hidden flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-sky-500 flex items-center justify-center">
            <HardHat size={14} className="text-white" />
          </div>
          <span className="font-bold text-slate-900 dark:text-white text-sm">ConstructIQ</span>
        </div>

        <h1 className="hidden lg:block text-lg font-semibold text-slate-900 dark:text-white">
          {pageTitles[currentPage] ?? 'Dashboard'}
        </h1>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">

        {/* Alerts bell + dropdown */}
        <div className="relative" ref={panelRef}>
          <button
            onClick={() => setAlertsOpen(o => !o)}
            className="relative p-2 rounded-md text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="View alerts"
          >
            <Bell size={20} />
            {criticalCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold">
                {criticalCount}
              </span>
            )}
          </button>

          {alertsOpen && (
            <div className="absolute right-0 top-full mt-2 w-96 max-h-[70vh] flex flex-col bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">Alerts</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{alerts.length} total · {criticalCount} critical</p>
                </div>
                <button
                  onClick={() => setAlertsOpen(false)}
                  className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="overflow-y-auto p-3 space-y-2">
                {alerts.length === 0 ? (
                  <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-6">No active alerts</p>
                ) : (
                  alerts.map(a => <AlertItem key={a.id} alert={a} />)
                )}
              </div>
              <div className="px-4 py-2.5 border-t border-slate-200 dark:border-slate-700">
                <button
                  onClick={() => { onNavigate('dashboard'); setAlertsOpen(false); }}
                  className="text-xs text-sky-600 dark:text-sky-400 hover:underline"
                >
                  View all on Dashboard →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Theme toggle */}
        <button
          onClick={onToggleTheme}
          className={clsx(
            'p-2 rounded-md transition-colors',
            theme === 'dark'
              ? 'text-sky-400 hover:text-sky-300 hover:bg-slate-800'
              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100',
          )}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center text-white font-semibold text-sm select-none">
          PM
        </div>
      </div>
    </header>
  );
}
