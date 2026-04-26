import type { FilterState, ProjectStatus, Project, SortField } from '../../types/project';
import { Search, X } from 'lucide-react';

interface TableFiltersProps {
  filters: FilterState;
  onFiltersChange: (partial: Partial<FilterState>) => void;
  totalCount: number;
  filteredCount: number;
}

const statusOptions: (ProjectStatus | 'All')[] = ['All', 'On Time', 'At Risk', 'High Risk', 'Critical'];
const typeOptions: (Project['type'] | 'All')[] = ['All', 'Commercial', 'Residential', 'Infrastructure', 'Industrial', 'Public'];

const sortOptions: { label: string; value: SortField }[] = [
  { label: 'Risk Score', value: 'riskScore' },
  { label: 'Days Late', value: 'daysLate' },
  { label: 'Budget', value: 'budget' },
  { label: 'Actual Cost', value: 'actualCost' },
  { label: 'Completion %', value: 'completionPercent' },
  { label: 'Name', value: 'name' },
];

export function TableFilters({ filters, onFiltersChange, totalCount, filteredCount }: TableFiltersProps) {
  const hasActiveFilters = filters.search || filters.status !== 'All' || filters.type !== 'All';

  const clearFilters = () => {
    onFiltersChange({ search: '', status: 'All', type: 'All' });
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[180px] max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search projects…"
            value={filters.search}
            onChange={e => onFiltersChange({ search: e.target.value })}
            className="w-full pl-8 pr-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        {/* Status filter */}
        <select
          value={filters.status}
          onChange={e => onFiltersChange({ status: e.target.value as FilterState['status'] })}
          className="px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
        >
          {statusOptions.map(s => (
            <option key={s} value={s}>{s === 'All' ? 'All Statuses' : s}</option>
          ))}
        </select>

        {/* Type filter */}
        <select
          value={filters.type}
          onChange={e => onFiltersChange({ type: e.target.value as FilterState['type'] })}
          className="px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
        >
          {typeOptions.map(t => (
            <option key={t} value={t}>{t === 'All' ? 'All Types' : t}</option>
          ))}
        </select>

        {/* Sort */}
        <select
          value={filters.sortField}
          onChange={e => onFiltersChange({ sortField: e.target.value as SortField })}
          className="px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
        >
          {sortOptions.map(o => (
            <option key={o.value} value={o.value}>Sort: {o.label}</option>
          ))}
        </select>

        {/* Direction toggle */}
        <button
          onClick={() => onFiltersChange({ sortDirection: filters.sortDirection === 'asc' ? 'desc' : 'asc' })}
          className="px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
        >
          {filters.sortDirection === 'asc' ? '↑ Asc' : '↓ Desc'}
        </button>

        {/* Clear */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <X size={14} />
            Clear
          </button>
        )}
      </div>

      {/* Result count */}
      <p className="text-xs text-slate-500 dark:text-slate-400">
        Showing <span className="font-medium text-slate-700 dark:text-slate-300">{filteredCount}</span> of{' '}
        <span className="font-medium">{totalCount}</span> projects
      </p>
    </div>
  );
}
