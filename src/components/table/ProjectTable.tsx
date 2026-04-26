import type { Project, FilterState } from '../../types/project';
import { TableRow } from './TableRow';
import { TableFilters } from './TableFilters';
import { FolderKanban } from 'lucide-react';

interface ProjectTableProps {
  projects: Project[];
  allProjects: Project[];
  filters: FilterState;
  onFiltersChange: (partial: Partial<FilterState>) => void;
}

const headers = [
  { label: 'Project', width: 'w-48' },
  { label: 'Manager', width: 'w-28' },
  { label: 'Type', width: 'w-24' },
  { label: 'Status', width: 'w-24' },
  { label: 'Cost', width: 'w-24' },
  { label: 'Delay', width: 'w-20' },
  { label: 'Progress', width: 'w-32' },
  { label: 'Risk', width: 'w-28' },
];

export function ProjectTable({ projects, allProjects, filters, onFiltersChange }: ProjectTableProps) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
      {/* Filters */}
      <div className="p-4 lg:p-5 border-b border-slate-200 dark:border-slate-700">
        <TableFilters
          filters={filters}
          onFiltersChange={onFiltersChange}
          totalCount={allProjects.length}
          filteredCount={projects.length}
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50">
              {headers.map(h => (
                <th
                  key={h.label}
                  className={`px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider ${h.width}`}
                >
                  {h.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {projects.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center">
                  <FolderKanban size={32} className="text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                  <p className="text-sm text-slate-500 dark:text-slate-400">No projects match your filters</p>
                </td>
              </tr>
            ) : (
              projects.map((project, i) => (
                <TableRow key={project.id} project={project} index={i} />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
