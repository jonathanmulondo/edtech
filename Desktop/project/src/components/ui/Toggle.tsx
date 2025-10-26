import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@lib/utils/cn';

export interface ToggleProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  description?: string;
}

/**
 * Toggle switch component
 * Usage:
 * <Toggle label="Enable notifications" checked={enabled} onChange={handleToggle} />
 */
export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
  ({ className, label, description, id, ...props }, ref) => {
    const toggleId = id || `toggle-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="flex items-start gap-3">
        <div className="relative flex-shrink-0">
          <input
            ref={ref}
            id={toggleId}
            type="checkbox"
            className="sr-only peer"
            {...props}
          />
          <label
            htmlFor={toggleId}
            className={cn(
              'block w-11 h-6 rounded-full cursor-pointer transition-colors',
              'bg-gray-200 dark:bg-gray-700',
              'peer-checked:bg-primary-500 peer-checked:dark:bg-primary-600',
              'peer-focus-visible:ring-2 peer-focus-visible:ring-primary-500 peer-focus-visible:ring-offset-2',
              'peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
              className
            )}
          >
            <span
              className={cn(
                'absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform',
                'peer-checked:translate-x-5'
              )}
              aria-hidden="true"
            />
          </label>
        </div>
        {(label || description) && (
          <div className="flex-1">
            {label && (
              <label
                htmlFor={toggleId}
                className="block text-sm font-medium text-gray-700 dark:text-gray-200 cursor-pointer"
              >
                {label}
              </label>
            )}
            {description && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                {description}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Toggle.displayName = 'Toggle';
