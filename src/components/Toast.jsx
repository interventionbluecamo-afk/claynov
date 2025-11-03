import { useEffect, useState } from 'react';
import { Check, X, AlertCircle, Info } from 'lucide-react';

const TOAST_DURATION = 4000; // 4 seconds

export const toast = {
  success: (message) => showToast('success', message),
  error: (message) => showToast('error', message),
  info: (message) => showToast('info', message),
  warning: (message) => showToast('warning', message),
};

let toastId = 0;
let listeners = [];

function showToast(type, message) {
  const id = ++toastId;
  const newToast = { id, type, message, timestamp: Date.now() };
  listeners.forEach(listener => listener(newToast));
  return id;
}

export function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const listener = (newToast) => {
      setToasts(prev => [...prev, newToast]);
      
      // Auto remove after duration
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== newToast.id));
      }, TOAST_DURATION);
    };

    listeners.push(listener);
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  }, []);

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full sm:w-auto">
      {toasts.map((toast) => {
        const icons = {
          success: Check,
          error: AlertCircle,
          info: Info,
          warning: AlertCircle,
        };
        
        const colors = {
          success: 'bg-green-50 border-green-200 text-green-800',
          error: 'bg-red-50 border-red-200 text-red-800',
          info: 'bg-blue-50 border-blue-200 text-blue-800',
          warning: 'bg-amber-50 border-amber-200 text-amber-800',
        };

        const iconColors = {
          success: 'text-green-600',
          error: 'text-red-600',
          info: 'text-blue-600',
          warning: 'text-amber-600',
        };

        const Icon = icons[toast.type];
        const colorClass = colors[toast.type];
        const iconColor = iconColors[toast.type];

        return (
          <div
            key={toast.id}
            className={`${colorClass} border rounded-xl p-4 shadow-lg flex items-start gap-3 animate-in fade-in zoom-in min-w-[300px] sm:min-w-0`}
            role="alert"
          >
            <Icon className={`w-5 h-5 ${iconColor} flex-shrink-0 mt-0.5`} />
            <div className="flex-1 text-sm font-medium pr-2">{toast.message}</div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

