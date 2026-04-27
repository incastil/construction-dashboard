import { useState } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import { PageShell } from './components/layout/PageShell';
import { useTheme } from './hooks/useTheme';
import { useProjects } from './hooks/useProjects';
import { Dashboard } from './pages/Dashboard';
import { Projects } from './pages/Projects';
import { Analytics } from './pages/Analytics';
import { DataUpload } from './pages/DataUpload';
import { Settings } from './pages/Settings';
import { PredictiveRisks } from './pages/PredictiveRisks';
import { HardHat, X, LayoutDashboard, FolderKanban, BarChart3, Upload, Settings as SettingsIcon, ShieldAlert } from 'lucide-react';
import { clsx } from 'clsx';

type Page = 'dashboard' | 'projects' | 'analytics' | 'predictive-risks' | 'upload' | 'settings';

const mobileNavItems = [
  { label: 'Dashboard', icon: <LayoutDashboard size={20} />, page: 'dashboard' as Page },
  { label: 'Projects', icon: <FolderKanban size={20} />, page: 'projects' as Page },
  { label: 'Analytics', icon: <BarChart3 size={20} />, page: 'analytics' as Page },
  { label: 'Pred. Risks', icon: <ShieldAlert size={20} />, page: 'predictive-risks' as Page },
  { label: 'Upload', icon: <Upload size={20} />, page: 'upload' as Page },
  { label: 'Settings', icon: <SettingsIcon size={20} />, page: 'settings' as Page },
];

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const projectsData = useProjects();

  const navigate = (page: string) => {
    setCurrentPage(page as Page);
    setMobileMenuOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Desktop Sidebar */}
      <Sidebar currentPage={currentPage} onNavigate={navigate} />

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/50"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={clsx(
          'lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white flex flex-col transition-transform duration-300',
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center">
              <HardHat size={16} className="text-white" />
            </div>
            <span className="font-bold text-sm">ConstructIQ</span>
          </div>
          <button onClick={() => setMobileMenuOpen(false)} className="p-1 text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {mobileNavItems.map(item => (
            <button
              key={item.page}
              onClick={() => navigate(item.page)}
              className={clsx(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                currentPage === item.page
                  ? 'bg-sky-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800',
              )}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar
          theme={theme}
          onToggleTheme={toggleTheme}
          alerts={projectsData.alerts}
          currentPage={currentPage}
          onNavigate={navigate}
          onMobileMenuOpen={() => setMobileMenuOpen(true)}
        />
        <PageShell>
          {currentPage === 'dashboard' && <Dashboard data={projectsData} />}
          {currentPage === 'projects' && <Projects data={projectsData} />}
          {currentPage === 'analytics' && <Analytics data={projectsData} />}
          {currentPage === 'predictive-risks' && <PredictiveRisks data={projectsData} />}
          {currentPage === 'upload' && <DataUpload data={projectsData} />}
          {currentPage === 'settings' && <Settings theme={theme} onToggleTheme={toggleTheme} data={projectsData} />}
        </PageShell>
      </div>
    </div>
  );
}
