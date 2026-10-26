import React from 'react';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const ToastContainer: React.FC = () => {
  const { toasts } = useStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full">
      {toasts.map((toast) => {
        const Icon =
          toast.type === 'error'
            ? AlertCircle
            : toast.type === 'info'
            ? Info
            : CheckCircle2;

        const borderClass =
          toast.type === 'error'
            ? 'border-red-500 bg-[#2A0E12] text-red-100'
            : toast.type === 'info'
            ? 'border-white/20 bg-[#1D1B1C] text-white'
            : 'border-[#78132D] bg-[#2E0710] text-[#F6F1E9]';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-3.5 border shadow-2xl flex items-center gap-3 animate-fade-in ${borderClass}`}
          >
            <Icon size={16} className="shrink-0 text-white" />
            <p className="text-xs font-medium font-sans flex-1 leading-snug">
              {toast.message}
            </p>
          </div>
        );
      })}
    </div>
  );
};
