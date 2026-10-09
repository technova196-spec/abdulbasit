import React from 'react';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useShop();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => {
        let bg = 'bg-slate-900 text-white';
        let icon = <Info size={18} className="text-sky-400 shrink-0" />;

        if (toast.type === 'success') {
          bg = 'bg-emerald-900/95 border-emerald-500/40 text-emerald-50';
          icon = <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />;
        } else if (toast.type === 'error') {
          bg = 'bg-rose-900/95 border-rose-500/40 text-rose-50';
          icon = <AlertCircle size={18} className="text-rose-400 shrink-0" />;
        } else if (toast.type === 'warning') {
          bg = 'bg-amber-900/95 border-amber-500/40 text-amber-50';
          icon = <AlertCircle size={18} className="text-amber-400 shrink-0" />;
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl shadow-xl backdrop-blur-md border border-white/10 ${bg} transition-all duration-300 animate-in fade-in slide-in-from-bottom-2`}
          >
            {icon}
            <div className="text-sm font-medium flex-1 leading-snug">{toast.message}</div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 -mr-1 -mt-1 text-white/60 hover:text-white rounded-lg transition-colors cursor-pointer"
              aria-label="Dismiss notification"
            >
              <X size={15} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
