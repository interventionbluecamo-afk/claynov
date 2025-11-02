import { AlertCircle, X } from 'lucide-react';

export default function ErrorBanner({ error, onDismiss }) {
  if (!error) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-4 animate-in slide-in-from-top duration-300">
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm text-red-800 font-medium">{error}</p>
        </div>
        {onDismiss && (
          <button 
            onClick={onDismiss}
            className="text-red-600 hover:text-red-800 transition-colors"
            aria-label="Dismiss error"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

