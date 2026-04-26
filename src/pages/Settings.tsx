import { Sun, Moon, RefreshCw, Info } from 'lucide-react';
import { useProjects } from '../hooks/useProjects';

type ProjectsData = ReturnType<typeof useProjects>;

interface SettingsProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  data: ProjectsData;
}

export function Settings({ theme, onToggleTheme, data }: SettingsProps) {
  const { resetData, kpis } = data;

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Settings</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Configure dashboard appearance and data preferences
        </p>
      </div>

      {/* Appearance */}
      <section className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Appearance</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {theme === 'dark' ? (
              <Moon size={18} className="text-slate-400" />
            ) : (
              <Sun size={18} className="text-amber-500" />
            )}
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-white">
                {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Preference saved in localStorage
              </p>
            </div>
          </div>
          <button
            onClick={onToggleTheme}
            className={`
              relative inline-flex h-6 w-11 items-center rounded-full transition-colors
              ${theme === 'dark' ? 'bg-sky-600' : 'bg-slate-300'}
            `}
            role="switch"
            aria-checked={theme === 'dark'}
          >
            <span className={`
              inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform
              ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'}
            `} />
          </button>
        </div>
      </section>

      {/* Data Management */}
      <section className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Data Management</h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-white">Current Dataset</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {kpis.totalProjects} projects · {kpis.criticalProjects} critical
              </p>
            </div>
            <button
              onClick={resetData}
              className="flex items-center gap-2 px-3 py-1.5 text-sm bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors font-medium"
            >
              <RefreshCw size={13} />
              Reset to Mock Data
            </button>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4 flex items-center gap-2">
          <Info size={15} />
          About ConstructIQ
        </h3>
        <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
          <p><span className="font-medium text-slate-800 dark:text-slate-200">Stack:</span> React + TypeScript + Tailwind CSS v4 + Recharts + Vite</p>
          <p><span className="font-medium text-slate-800 dark:text-slate-200">Purpose:</span> MCIS Portfolio Project — Procore-style Construction Analytics</p>
          <p><span className="font-medium text-slate-800 dark:text-slate-200">AI Engine:</span> Rule-based risk scoring (delay + budget + task health)</p>
          <p><span className="font-medium text-slate-800 dark:text-slate-200">Features:</span> Dark mode, CSV import, responsive design, sortable tables</p>
          <p className="pt-2 text-xs text-slate-400 dark:text-slate-500">
            v1.0.0 · Built {new Date().getFullYear()}
          </p>
        </div>
      </section>
    </div>
  );
}
