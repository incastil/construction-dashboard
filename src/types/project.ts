export type ProjectStatus = 'On Time' | 'At Risk' | 'High Risk' | 'Critical';

export type TaskStatus = 'Complete' | 'In Progress' | 'Delayed' | 'Not Started';

export interface ProjectTask {
  id: string;
  name: string;
  status: TaskStatus;
  daysLate: number;
  assignee: string;
}

export interface CostTrendPoint {
  month: string;
  budgeted: number;
  actual: number;
}

export interface Project {
  id: string;
  name: string;
  location: string;
  manager: string;
  type: 'Commercial' | 'Residential' | 'Infrastructure' | 'Industrial' | 'Public';
  startDate: string;
  expectedEndDate: string;
  actualEndDate?: string;
  budget: number;
  actualCost: number;
  completionPercent: number;
  daysLate: number;
  status: ProjectStatus;
  riskScore: number;
  tasks: ProjectTask[];
  costTrend: CostTrendPoint[];
  subcontractors: string[];
  changeOrders: number;
  safetyIncidents: number;
}

export interface Alert {
  id: string;
  projectId: string;
  projectName: string;
  type: 'budget' | 'delay' | 'risk' | 'safety';
  severity: 'warning' | 'critical';
  message: string;
  date: string;
}

export interface Insight {
  id: string;
  title: string;
  description: string;
  impact: 'positive' | 'negative' | 'neutral';
  metric?: string;
}

export interface KPISummary {
  totalProjects: number;
  onTimeProjects: number;
  overBudgetProjects: number;
  totalBudget: number;
  totalActualCost: number;
  avgRiskScore: number;
  criticalProjects: number;
}

export type PredictiveRiskLevel = 'Low' | 'Medium' | 'High';

export interface PredictiveRisk {
  score: number;
  level: PredictiveRiskLevel;
  reasons: string[];
}

export type SortField = 'name' | 'budget' | 'actualCost' | 'daysLate' | 'riskScore' | 'completionPercent';
export type SortDirection = 'asc' | 'desc';

export interface FilterState {
  search: string;
  status: ProjectStatus | 'All';
  type: Project['type'] | 'All';
  sortField: SortField;
  sortDirection: SortDirection;
}
