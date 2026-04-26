export function formatCurrency(value: number, compact = false): string {
  if (compact) {
    if (value >= 1_000_000) {
      return `$${(value / 1_000_000).toFixed(1)}M`;
    }
    if (value >= 1_000) {
      return `$${(value / 1_000).toFixed(0)}K`;
    }
    return `$${value.toFixed(0)}`;
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatPercent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

export function formatBudgetVariance(budget: number, actual: number): string {
  const variance = actual - budget;
  const sign = variance >= 0 ? '+' : '';
  return `${sign}${formatCurrency(variance, true)}`;
}

export function formatBudgetVariancePercent(budget: number, actual: number): string {
  const pct = ((actual - budget) / budget) * 100;
  const sign = pct >= 0 ? '+' : '';
  return `${sign}${pct.toFixed(1)}%`;
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function isOverBudget(budget: number, actual: number): boolean {
  return actual > budget;
}
