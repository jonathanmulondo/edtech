/**
 * Formatting utilities for Senergy platform
 */

/**
 * Format power value with appropriate unit (W, kW, MW)
 */
export function formatPower(watts: number, decimals = 1): string {
  const absWatts = Math.abs(watts);

  if (absWatts >= 1_000_000) {
    return `${(watts / 1_000_000).toFixed(decimals)} MW`;
  } else if (absWatts >= 1_000) {
    return `${(watts / 1_000).toFixed(decimals)} kW`;
  }
  return `${watts.toFixed(0)} W`;
}

/**
 * Format energy value with appropriate unit (Wh, kWh, MWh)
 */
export function formatEnergy(wattHours: number, decimals = 2): string {
  const absWh = Math.abs(wattHours);

  if (absWh >= 1_000_000) {
    return `${(wattHours / 1_000_000).toFixed(decimals)} MWh`;
  } else if (absWh >= 1_000) {
    return `${(wattHours / 1_000).toFixed(decimals)} kWh`;
  }
  return `${wattHours.toFixed(0)} Wh`;
}

/**
 * Format percentage with % symbol
 */
export function formatPercentage(value: number, decimals = 0): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format duration in minutes to human-readable format
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${Math.round(minutes)}m`;
  }

  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);

  if (hours >= 24) {
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    return remainingHours > 0
      ? `${days}d ${remainingHours}h`
      : `${days}d`;
  }

  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

/**
 * Format currency value
 */
export function formatCurrency(amount: number, currency = 'KES', decimals = 2): string {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);
}

/**
 * Format CO2 savings
 */
export function formatCO2(kg: number): string {
  if (kg >= 1000) {
    return `${(kg / 1000).toFixed(2)} tonnes`;
  }
  return `${kg.toFixed(1)} kg`;
}

/**
 * Get relative time string (e.g., "2 minutes ago")
 */
export function formatRelativeTime(timestamp: string | Date): string {
  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);

  if (diffSec < 60) {
    return 'just now';
  }

  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) {
    return `${diffMin}m ago`;
  }

  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) {
    return `${diffHour}h ago`;
  }

  const diffDay = Math.floor(diffHour / 24);
  if (diffDay < 7) {
    return `${diffDay}d ago`;
  }

  return date.toLocaleDateString();
}
