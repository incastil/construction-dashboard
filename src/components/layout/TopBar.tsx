import { Sun, Moon, Bell, Menu, HardHat } from 'lucide-react';
import type { Alert } from '../../types/project';

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
  upload: 'Data Upload',
  settings: 'Settings',
};

export function TopBar({ theme, onToggleTheme, alerts, currentPage, onNavigate, onMobileMenuOpen }: TopBarProps) {
  const criticalCount = alerts.filter(a => a.severity === 'critical').length;

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between px-4 lg:px-6 h-14 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 shadow-sm">
      {/* Left: mobile menu + title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMobileMenuOpen}
          className="lg:hidden p-2 rounded-md text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>

        {/* Mobile logo */}
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

      {/* Right: actions */}
      <div className="flex items-center gap-2">
        {/* Alerts button */}
        <button
          onClick={() => onNavigate('dashboard')}
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

        {/* Theme toggle */}
        <button
          onClick={onToggleTheme}
          className="p-2 rounded-md text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center text-white font-semibold text-sm">
          PM
        </div>
      </div>
    </header>
  );
}
