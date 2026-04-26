import type { Project, ProjectStatus, Alert, Insight, KPISummary } from '../types/project';

/** Classify project status from daysLate */
export function classifyStatus(daysLate: number, budget: number, actualCost: number): ProjectStatus {
  const overBudget = actualCost > budget;

  if (daysLate === 0 && !overBudget) return 'On Time';
  if (daysLate >= 1 && daysLate <= 5 && !overBudget) return 'At Risk';
  if (daysLate > 10 || (daysLate >= 6 && overBudget)) return 'Critical';
  if (daysLate >= 6 && daysLate <= 10) return 'High Risk';
  // Over budget but on time or slightly late
  if (overBudget && daysLate <= 5) return 'At Risk';
  return 'On Time';
}

/** Compute risk score 0–100 */
export function computeRiskScore(project: Project): number {
  let score = 0;

  // Delay component: max 50 pts
  if (project.daysLate > 0) {
    const delayScore = Math.min(50, (project.daysLate / 20) * 50);
    score += delayScore;
  }

  // Budget overrun component: max 30 pts
  if (project.actualCost > project.budget) {
    const overrunPct = (project.actualCost - project.budget) / project.budget;
    const budgetScore = Math.min(30, overrunPct * 200);
    score += budgetScore;
  }

  // Delayed tasks component: max 20 pts
  const delayedTasks = project.tasks.filter(t => t.status === 'Delayed').length;
  if (delayedTasks >= 2) {
    score += Math.min(20, delayedTasks * 7);
  } else if (delayedTasks === 1) {
    score += 5;
  }

  return Math.round(Math.min(100, score));
}

/** Generate alerts for a list of projects */
export function generateAlerts(projects: Project[]): Alert[] {
  const alerts: Alert[] = [];
  let alertId = 1;

  for (const project of projects) {
    const overBudget = project.actualCost > project.budget;
    const delayedTasks = project.tasks.filter(t => t.status === 'Delayed');

    // Budget alert
    if (overBudget) {
      const overrunPct = ((project.actualCost - project.budget) / project.budget * 100).toFixed(1);
      alerts.push({
        id: `alert-${alertId++}`,
        projectId: project.id,
        projectName: project.name,
        type: 'budget',
        severity: project.status === 'Critical' ? 'critical' : 'warning',
        message: `${overrunPct}% over budget — actual exceeds planned by $${((project.actualCost - project.budget) / 1000).toFixed(0)}K`,
        date: new Date().toISOString().split('T')[0],
      });
    }

    // Delay alerts
    if (project.daysLate > 10) {
      alerts.push({
        id: `alert-${alertId++}`,
        projectId: project.id,
        projectName: project.name,
        type: 'delay',
        severity: 'critical',
        message: `${project.daysLate} days behind schedule — critical delay`,
        date: new Date().toISOString().split('T')[0],
      });
    } else if (project.daysLate >= 6) {
      alerts.push({
        id: `alert-${alertId++}`,
        projectId: project.id,
        projectName: project.name,
        type: 'delay',
        severity: 'warning',
        message: `${project.daysLate} days behind schedule — high risk`,
        date: new Date().toISOString().split('T')[0],
      });
    } else if (project.daysLate >= 1) {
      alerts.push({
        id: `alert-${alertId++}`,
        projectId: project.id,
        projectName: project.name,
        type: 'delay',
        severity: 'warning',
        message: `${project.daysLate} day${project.daysLate > 1 ? 's' : ''} behind schedule`,
        date: new Date().toISOString().split('T')[0],
      });
    }

    // Multiple delayed tasks alert
    if (delayedTasks.length >= 2) {
      alerts.push({
        id: `alert-${alertId++}`,
        projectId: project.id,
        projectName: project.name,
        type: 'risk',
        severity: 'warning',
        message: `${delayedTasks.length} delayed tasks: ${delayedTasks.map(t => t.name).join(', ')}`,
        date: new Date().toISOString().split('T')[0],
      });
    }

    // Safety incidents
    if (project.safetyIncidents > 0) {
      alerts.push({
        id: `alert-${alertId++}`,
        projectId: project.id,
        projectName: project.name,
        type: 'safety',
        severity: project.safetyIncidents >= 3 ? 'critical' : 'warning',
        message: `${project.safetyIncidents} safety incident${project.safetyIncidents > 1 ? 's' : ''} recorded`,
        date: new Date().toISOString().split('T')[0],
      });
    }
  }

  // Sort: critical first, then by project risk score
  return alerts.sort((a, b) => {
    if (a.severity === 'critical' && b.severity !== 'critical') return -1;
    if (b.severity === 'critical' && a.severity !== 'critical') return 1;
    return 0;
  });
}

/** Generate AI-style insights from project data */
export function generateInsights(projects: Project[]): Insight[] {
  const insights: Insight[] = [];

  const overBudget = projects.filter(p => p.actualCost > p.budget);
  const onTime = projects.filter(p => p.daysLate === 0);
  const critical = projects.filter(p => p.status === 'Critical');
  const totalBudget = projects.reduce((s, p) => s + p.budget, 0);
  const totalActual = projects.reduce((s, p) => s + p.actualCost, 0);
  const avgRisk = projects.reduce((s, p) => s + p.riskScore, 0) / projects.length;

  if (overBudget.length > 0) {
    const totalOverrun = overBudget.reduce((s, p) => s + (p.actualCost - p.budget), 0);
    insights.push({
      id: 'ins-1',
      title: 'Budget Overruns Detected',
      description: `${overBudget.length} of ${projects.length} projects are over budget, with a combined overrun of $${(totalOverrun / 1_000_000).toFixed(1)}M. Strongest driver: change orders.`,
      impact: 'negative',
      metric: `$${(totalOverrun / 1_000_000).toFixed(1)}M over`,
    });
  }

  if (onTime.length > projects.length / 2) {
    insights.push({
      id: 'ins-2',
      title: 'Schedule Performance Healthy',
      description: `${onTime.length} of ${projects.length} projects are on schedule. Projects managed by Sarah Chen and Carlos Reyes are tracking well under budget.`,
      impact: 'positive',
      metric: `${Math.round((onTime.length / projects.length) * 100)}% on time`,
    });
  }

  if (critical.length > 0) {
    insights.push({
      id: 'ins-3',
      title: `${critical.length} Critical Project${critical.length > 1 ? 's' : ''} Need Attention`,
      description: `${critical.map(p => p.name).join(', ')} require immediate escalation. High change order counts correlate with overruns.`,
      impact: 'negative',
      metric: `Risk >${critical[0]?.riskScore ?? 90}`,
    });
  }

  const portfolioVariance = ((totalActual - totalBudget) / totalBudget * 100).toFixed(1);
  insights.push({
    id: 'ins-4',
    title: 'Portfolio Cost Variance',
    description: `Overall portfolio is ${Number(portfolioVariance) > 0 ? 'over' : 'under'} budget by ${Math.abs(Number(portfolioVariance)).toFixed(1)}%. Average risk score across all projects is ${avgRisk.toFixed(0)}/100.`,
    impact: Number(portfolioVariance) > 5 ? 'negative' : Number(portfolioVariance) < -2 ? 'positive' : 'neutral',
    metric: `${Number(portfolioVariance) > 0 ? '+' : ''}${portfolioVariance}%`,
  });

  const highChangeOrders = projects.filter(p => p.changeOrders >= 10);
  if (highChangeOrders.length > 0) {
    insights.push({
      id: 'ins-5',
      title: 'Change Order Risk',
      description: `${highChangeOrders.map(p => p.name).join(', ')} have elevated change order counts (10+). Recommend reviewing scope documentation to prevent further cost growth.`,
      impact: 'negative',
      metric: `${highChangeOrders.reduce((s, p) => s + p.changeOrders, 0)} COs`,
    });
  }

  return insights;
}

/** Compute KPI summary from all projects */
export function computeKPIs(projects: Project[]): KPISummary {
  return {
    totalProjects: projects.length,
    onTimeProjects: projects.filter(p => p.daysLate === 0).length,
    overBudgetProjects: projects.filter(p => p.actualCost > p.budget).length,
    totalBudget: projects.reduce((s, p) => s + p.budget, 0),
    totalActualCost: projects.reduce((s, p) => s + p.actualCost, 0),
    avgRiskScore: Math.round(projects.reduce((s, p) => s + p.riskScore, 0) / projects.length),
    criticalProjects: projects.filter(p => p.status === 'Critical').length,
  };
}
