import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@lib/utils/cn';

export interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon?: LucideIcon;
  trend?: {
    value: number;
    label: string;
  };
  status?: 'positive' | 'negative' | 'neutral';
  subtitle?: string;
  className?: string;
  onClick?: () => void;
}

/**
 * Metric card for displaying key performance indicators
 * Usage:
 * <MetricCard
 *   title="Solar Production"
 *   value={1520}
 *   unit="W"
 *   icon={Sun}
 *   trend={{value: 15, label: 'vs yesterday'}}
 * />
 */
export function MetricCard({
  title,
  value,
  unit,
  icon: Icon,
  trend,
  status = 'neutral',
  subtitle,
  className,
  onClick,
}: MetricCardProps) {
  const isClickable = !!onClick;

  const statusColors = {
    positive: 'text-success',
    negative: 'text-danger',
    neutral: 'text-gray-600 dark:text-gray-400',
  };

  return (
    <div
      className={cn(
        'bg-white dark:bg-dark-surface rounded-lg p-3 md:p-4 border border-gray-200 dark:border-dark-border',
        'transition-all duration-200',
        isClickable && 'cursor-pointer hover:shadow-md hover:scale-[1.02] active:scale-100',
        className
      )}
      onClick={onClick}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={
        isClickable
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick?.();
              }
            }
          : undefined
      }
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-1.5 md:mb-2">
        <h3 className="text-xs md:text-sm font-medium text-gray-500 dark:text-gray-400 truncate pr-1">
          {title}
        </h3>
        {Icon && (
          <Icon
            size={16}
            className="text-gray-400 dark:text-gray-500 flex-shrink-0"
            aria-hidden="true"
          />
        )}
      </div>

      {/* Value */}
      <div className="flex items-baseline gap-0.5 md:gap-1">
        <span className="text-xl md:text-3xl font-bold text-gray-900 dark:text-dark-text leading-tight">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </span>
        {unit && (
          <span className="text-sm md:text-lg font-medium text-gray-500 dark:text-gray-400">
            {unit}
          </span>
        )}
      </div>

      {/* Trend or Subtitle */}
      {trend && (
        <div className={cn('flex items-center gap-1 mt-1.5 md:mt-2 text-xs md:text-sm', statusColors[status])}>
          <span className="font-medium">
            {trend.value > 0 ? '+' : ''}
            {trend.value}%
          </span>
          <span className="text-gray-500 dark:text-gray-400">{trend.label}</span>
        </div>
      )}
      {!trend && subtitle && (
        <p className="mt-1 md:mt-2 text-xs md:text-sm text-gray-500 dark:text-gray-400 truncate">
          {subtitle}
        </p>
      )}
    </div>
  );
}

/**
 * Compact KPI row for displaying multiple metrics
 */
export interface KPIRowProps {
  label: string;
  value: string | number;
  unit?: string;
  icon?: ReactNode;
  status?: 'online' | 'offline' | 'warning' | 'error';
}

export function KPIRow({ label, value, unit, icon, status }: KPIRowProps) {
  const statusDots = {
    online: 'bg-success',
    offline: 'bg-gray-400',
    warning: 'bg-warning',
    error: 'bg-danger',
  };

  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-sm text-gray-600 dark:text-gray-300">{label}</span>
        {status && (
          <span
            className={cn('w-2 h-2 rounded-full', statusDots[status])}
            aria-label={status}
          />
        )}
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-sm font-semibold text-gray-900 dark:text-dark-text">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </span>
        {unit && (
          <span className="text-xs text-gray-500 dark:text-gray-400">{unit}</span>
        )}
      </div>
    </div>
  );
}
