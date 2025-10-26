import { InputHTMLAttributes, forwardRef, useState, useEffect } from 'react';
import { cn } from '@lib/utils/cn';

export interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  label?: string;
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  onChange?: (value: number) => void;
  showValue?: boolean;
  unit?: string;
}

/**
 * Slider component for motor angle control
 * Usage:
 * <Slider
 *   label="Panel Angle"
 *   min={0}
 *   max={90}
 *   value={angle}
 *   onChange={setAngle}
 *   unit="°"
 * />
 */
export const Slider = forwardRef<HTMLInputElement, SliderProps>(
  (
    {
      className,
      label,
      min = 0,
      max = 100,
      step = 1,
      value: controlledValue,
      onChange,
      showValue = true,
      unit,
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const [value, setValue] = useState(controlledValue ?? min);
    const sliderId = id || `slider-${Math.random().toString(36).substr(2, 9)}`;

    useEffect(() => {
      if (controlledValue !== undefined) {
        setValue(controlledValue);
      }
    }, [controlledValue]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = Number(e.target.value);
      setValue(newValue);
      onChange?.(newValue);
    };

    const percentage = ((value - min) / (max - min)) * 100;

    return (
      <div className={cn('w-full', className)}>
        {(label || showValue) && (
          <div className="flex items-center justify-between mb-2">
            {label && (
              <label
                htmlFor={sliderId}
                className="text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                {label}
              </label>
            )}
            {showValue && (
              <span className="text-sm font-semibold text-gray-900 dark:text-dark-text">
                {value}
                {unit}
              </span>
            )}
          </div>
        )}

        <div className="relative">
          <input
            ref={ref}
            id={sliderId}
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={handleChange}
            disabled={disabled}
            className={cn(
              'w-full h-2 rounded-lg appearance-none cursor-pointer',
              'bg-gray-200 dark:bg-gray-700',
              'disabled:cursor-not-allowed disabled:opacity-50',
              // Webkit (Chrome, Safari)
              '[&::-webkit-slider-thumb]:appearance-none',
              '[&::-webkit-slider-thumb]:w-5',
              '[&::-webkit-slider-thumb]:h-5',
              '[&::-webkit-slider-thumb]:rounded-full',
              '[&::-webkit-slider-thumb]:bg-primary-500',
              '[&::-webkit-slider-thumb]:cursor-pointer',
              '[&::-webkit-slider-thumb]:transition-transform',
              '[&::-webkit-slider-thumb]:hover:scale-110',
              '[&::-webkit-slider-thumb]:active:scale-95',
              // Firefox
              '[&::-moz-range-thumb]:w-5',
              '[&::-moz-range-thumb]:h-5',
              '[&::-moz-range-thumb]:rounded-full',
              '[&::-moz-range-thumb]:bg-primary-500',
              '[&::-moz-range-thumb]:border-0',
              '[&::-moz-range-thumb]:cursor-pointer',
              '[&::-moz-range-thumb]:transition-transform',
              '[&::-moz-range-thumb]:hover:scale-110',
              '[&::-moz-range-thumb]:active:scale-95',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2'
            )}
            style={{
              background: `linear-gradient(to right, #f59e0b 0%, #f59e0b ${percentage}%, #e5e7eb ${percentage}%, #e5e7eb 100%)`,
            }}
            {...props}
          />
        </div>

        {/* Min/Max labels */}
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {min}
            {unit}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {max}
            {unit}
          </span>
        </div>
      </div>
    );
  }
);

Slider.displayName = 'Slider';
