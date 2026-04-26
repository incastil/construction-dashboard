import { useState, useMemo } from 'react';
import { mockProjects } from '../data/mockProjects';
import type { Project, FilterState } from '../types/project';
import { generateAlerts, generateInsights, computeKPIs } from '../lib/analytics';

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    status: 'All',
    type: 'All',
    sortField: 'riskScore',
    sortDirection: 'desc',
  });

  const filteredProjects = useMemo(() => {
    let result = [...projects];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q) ||
          p.manager.toLowerCase().includes(q),
      );
    }

    if (filters.status !== 'All') {
      result = result.filter(p => p.status === filters.status);
    }

    if (filters.type !== 'All') {
      result = result.filter(p => p.type === filters.type);
    }

    result.sort((a, b) => {
      const field = filters.sortField;
      const dir = filters.sortDirection === 'asc' ? 1 : -1;
      if (field === 'name') {
        return a.name.localeCompare(b.name) * dir;
      }
      return ((a[field] as number) - (b[field] as number)) * dir;
    });

    return result;
  }, [projects, filters]);

  const alerts = useMemo(() => generateAlerts(projects), [projects]);
  const insights = useMemo(() => generateInsights(projects), [projects]);
  const kpis = useMemo(() => computeKPIs(projects), [projects]);

  const updateFilters = (partial: Partial<FilterState>) => {
    setFilters(f => ({ ...f, ...partial }));
  };

  const resetData = () => setProjects(mockProjects);

  return {
    projects,
    setProjects,
    filteredProjects,
    filters,
    updateFilters,
    alerts,
    insights,
    kpis,
    resetData,
  };
}
