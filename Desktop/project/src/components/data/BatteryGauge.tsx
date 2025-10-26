import { Battery, BatteryCharging, BatteryWarning } from 'lucide-react';
import { cn } from '@lib/utils/cn';
import { formatPercentage, formatDuration } from '@lib/utils/format';

export interface BatteryGaugeProps {
  soc: number; // 0-100
  isCharging?: boolean;
  timeRemaining?: number; // minutes
  voltage?: number;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
}

/**
 * Battery state of charge gauge
 * Usage:
 * <BatteryGauge soc={68} isCharging={true} timeRemaining={120} />
 */
export function BatteryGauge({
  soc,
  isCharging,
  timeRemaining,
  voltage,
  size = 'md',
  showDetails = true,
}: BatteryGaugeProps) {
  const getBatteryColor = () => {
    if (isCharging) return 'text-primary-500';
    if (soc <= 20) return 'text-danger';
    if (soc <= 40) return 'text-warning';
    return 'text-success';
  };

  const getBatteryIcon = () => {
    if (soc <= 20) return BatteryWarning;
    if (isCharging) return BatteryCharging;
    return Battery;
  };

  const Icon = getBatteryIcon();
  const color = getBatteryColor();

  const sizes = {
    sm: { icon: 20, text: 'text-sm', details: 'text-xs' },
    md: { icon: 32, text: 'text-xl', details: 'text-sm' },
    lg: { icon: 48, text: 'text-3xl', details: 'text-base' },
  };

  return (
    <div className="flex items-center gap-2 md:gap-4">
      {/* Visual gauge */}
      <div className="relative flex-shrink-0">
        <Icon size={sizes[size].icon} className={cn(color)} aria-hidden="true" />
        {/* Fill indicator */}
        <div
          className="absolute bottom-1 left-1 right-1 bg-current opacity-30 rounded-sm transition-all duration-500"
          style={{ height: `${soc * 0.6}%` }}
          aria-hidden="true"
        />
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-1 md:gap-2">
          <span className={cn('font-bold', sizes[size].text, color)}>
            {formatPercentage(soc)}
          </span>
          {isCharging && (
            <span className={cn(sizes[size].details, 'text-gray-500 dark:text-gray-400 truncate')}>
              Charging
            </span>
          )}
        </div>

        {showDetails && (
          <div className="mt-0.5 md:mt-1 space-y-0.5">
            {timeRemaining !== undefined && (
              <p className={cn(sizes[size].details, 'text-gray-600 dark:text-gray-400 truncate')}>
                {isCharging ? 'Full in' : 'Empty in'} {formatDuration(timeRemaining)}
              </p>
            )}
            {voltage !== undefined && (
              <p className="text-xs text-gray-500 dark:text-gray-500">
                {voltage.toFixed(1)}V
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Circular battery gauge (alternative design)
 */
export function CircularBatteryGauge({ soc, isCharging }: { soc: number; isCharging?: boolean }) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (soc / 100) * circumference;

  const getColor = () => {
    if (isCharging) return '#f59e0b';
    if (soc <= 20) return '#ef4444';
    if (soc <= 40) return '#f59e0b';
    return '#10b981';
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="100" height="100" className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          stroke="currentColor"
          strokeWidth="8"
          fill="none"
          className="text-gray-200 dark:text-gray-700"
        />
        {/* Progress circle */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          stroke={getColor()}
          strokeWidth="8"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-500"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-bold text-gray-900 dark:text-dark-text">
          {soc}%
        </span>
        {isCharging && (
          <BatteryCharging size={16} className="text-primary-500 mt-1" aria-label="Charging" />
        )}
      </div>
    </div>
  );
}
