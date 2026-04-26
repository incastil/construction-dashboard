import { LayoutDashboard, FolderKanban, BarChart3, Upload, Settings, HardHat } from 'lucide-react';
import { clsx } from 'clsx';

interface NavItem {
  label: string;
  icon: React.ReactNode;
  page: string;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', icon: <LayoutDashboard size={20} />, page: 'dashboard' },
  { label: 'Projects', icon: <FolderKanban size={20} />, page: 'projects' },
  { label: 'Analytics', icon: <BarChart3 size={20} />, page: 'analytics' },
  { label: 'Data Upload', icon: <Upload size={20} />, page: 'upload' },
  { label: 'Settings', icon: <Settings size={20} />, page: 'settings' },
];

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  return (
    <aside className="hidden lg:flex flex-col w-60 min-h-screen bg-slate-900 dark:bg-slate-950 text-white shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-700">
        <div className="w-9 h-9 rounded-lg bg-sky-500 flex items-center justify-center shrink-0">
          <HardHat size={20} className="text-white" />
        </div>
        <div>
          <div className="font-bold text-white leading-tight text-sm">ConstructIQ</div>
          <div className="text-slate-400 text-xs">Analytics Dashboard</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(item => (
          <button
            key={item.page}
            onClick={() => onNavigate(item.page)}
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

      {/* Footer */}
      <div className="px-6 py-4 border-t border-slate-700">
        <p className="text-slate-500 text-xs">Portfolio v1.0 · MCIS 2025</p>
      </div>
    </aside>
  );
}
