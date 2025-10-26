import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '@lib/utils/cn';

export interface ToastProps {
  id: string;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose: (id: string) => void;
}

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const styles = {
  success: 'bg-success-light dark:bg-success/20 text-success-dark dark:text-success border-success',
  error: 'bg-danger-light dark:bg-danger/20 text-red-900 dark:text-danger border-danger',
  warning: 'bg-warning-light dark:bg-warning/20 text-warning-dark dark:text-warning border-warning',
  info: 'bg-blue-50 dark:bg-blue-500/20 text-blue-900 dark:text-blue-300 border-blue-500',
};

/**
 * Toast notification component
 * Usage: Managed by ToastProvider and useToast hook
 */
export function Toast({ id, message, type = 'info', duration = 5000, onClose }: ToastProps) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose(id);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [id, duration, onClose]);

  const Icon = icons[type];

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-4 rounded-lg border-l-4 shadow-md animate-slide-up',
        'min-w-[320px] max-w-md',
        styles[type]
      )}
      role="alert"
      aria-live="polite"
    >
      <Icon size={20} className="flex-shrink-0 mt-0.5" aria-hidden="true" />
      <p className="flex-1 text-sm font-medium">{message}</p>
      <button
        onClick={() => onClose(id)}
        className="flex-shrink-0 p-0.5 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
        aria-label="Dismiss notification"
      >
        <X size={16} />
      </button>
    </div>
  );
}

/**
 * Toast container to display multiple toasts
 */
export interface ToastContainerProps {
  toasts: ToastProps[];
}

export function ToastContainer({ toasts }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return createPortal(
    <div
      className="fixed top-4 right-4 z-50 flex flex-col gap-2"
      aria-label="Notifications"
      role="region"
    >
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} />
      ))}
    </div>,
    document.body
  );
}
