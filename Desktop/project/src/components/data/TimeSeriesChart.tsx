import { useMemo } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { format } from 'date-fns';
import { formatPower } from '@lib/utils/format';
import type { TimeSeriesDataPoint } from '@types';

export interface TimeSeriesChartProps {
  data: TimeSeriesDataPoint[];
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  className?: string;
}

/**
 * Time series chart for production vs consumption
 * Usage:
 * <TimeSeriesChart data={timeSeriesData} height={300} />
 */
export function TimeSeriesChart({
  data,
  height = 300,
  showGrid = true,
  className,
}: TimeSeriesChartProps) {
  // Transform data for recharts
  const chartData = useMemo(() => {
    return data.map((point) => ({
      time: point.ts,
      production: point.productionW / 1000, // Convert to kW
      consumption: point.consumptionW / 1000,
      battery: point.batteryW / 1000,
      grid: point.gridW / 1000,
    }));
  }, [data]);

  const formatXAxis = (timestamp: number) => {
    return format(new Date(timestamp), 'HH:mm');
  };

  const formatYAxis = (value: number) => {
    return `${value.toFixed(1)} kW`;
  };

  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          {showGrid && (
            <CartesianGrid
              strokeDasharray="3 3"
              className="stroke-gray-200 dark:stroke-gray-700"
            />
          )}
          <XAxis
            dataKey="time"
            tickFormatter={formatXAxis}
            className="text-xs text-gray-600 dark:text-gray-400"
            stroke="currentColor"
          />
          <YAxis
            tickFormatter={formatYAxis}
            className="text-xs text-gray-600 dark:text-gray-400"
            stroke="currentColor"
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ stroke: '#f59e0b', strokeWidth: 1 }}
          />
          <Area
            type="monotone"
            dataKey="production"
            stackId="1"
            stroke="#f59e0b"
            fill="#f59e0b"
            fillOpacity={0.6}
            name="Production"
          />
          <Area
            type="monotone"
            dataKey="consumption"
            stackId="2"
            stroke="#14b8a6"
            fill="#14b8a6"
            fillOpacity={0.6}
            name="Consumption"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

/**
 * Custom tooltip for the chart
 */
function CustomTooltip({ active, payload }: any) {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0].payload;

  return (
    <div className="bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border rounded-lg p-3 shadow-lg">
      <p className="text-sm font-medium text-gray-900 dark:text-dark-text mb-2">
        {format(new Date(data.time), 'HH:mm')}
      </p>
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary-500" />
          <span className="text-xs text-gray-600 dark:text-gray-400">Production:</span>
          <span className="text-xs font-medium text-gray-900 dark:text-dark-text">
            {formatPower(data.production * 1000)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-accent-500" />
          <span className="text-xs text-gray-600 dark:text-gray-400">Consumption:</span>
          <span className="text-xs font-medium text-gray-900 dark:text-dark-text">
            {formatPower(data.consumption * 1000)}
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * Compact sparkline chart
 */
export interface SparklineProps {
  data: number[];
  color?: string;
  height?: number;
  width?: number;
}

export function Sparkline({ data, color = '#f59e0b', height = 40, width = 100 }: SparklineProps) {
  const chartData = data.map((value, index) => ({ index, value }));

  return (
    <ResponsiveContainer width={width} height={height}>
      <AreaChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
        <Area
          type="monotone"
          dataKey="value"
          stroke={color}
          fill={color}
          fillOpacity={0.3}
          strokeWidth={2}
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
