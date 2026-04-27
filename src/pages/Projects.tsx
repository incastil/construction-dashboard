import { ProjectTable } from '../components/table/ProjectTable';
import { useProjects } from '../hooks/useProjects';

type ProjectsData = ReturnType<typeof useProjects>;

interface ProjectsPageProps {
  data: ProjectsData;
}

export function Projects({ data }: ProjectsPageProps) {
  const { projects, filteredProjects, filters, updateFilters, predictiveRisks } = data;

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Project Portfolio</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Manage and track all active construction projects
        </p>
      </div>
      <ProjectTable
        projects={filteredProjects}
        allProjects={projects}
        filters={filters}
        onFiltersChange={updateFilters}
        predictiveRisks={predictiveRisks}
      />
    </div>
  );
}
