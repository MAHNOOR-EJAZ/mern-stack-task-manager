import React from 'react';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  text: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => {
        let border = 'border-[#E8ECE5] bg-white text-[#283128]';
        let Icon = CheckCircle2;
        let iconColor = 'text-[#789477]';

        if (toast.type === 'error') {
          border = 'border-[#9B453A]/20 bg-[#F8E5E2] text-[#9B453A]';
          Icon = AlertCircle;
          iconColor = 'text-[#9B453A]';
        } else if (toast.type === 'info') {
          border = 'border-[#E8ECE5] bg-white text-[#283128]';
          Icon = Info;
          iconColor = 'text-[#789477]';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between p-3.5 rounded-xl border shadow-md text-xs font-medium animate-in slide-in-from-bottom-2 duration-150 ${border}`}
          >
            <div className="flex items-center space-x-2.5">
              <Icon className={`w-4 h-4 flex-shrink-0 ${iconColor}`} />
              <span>{toast.text}</span>
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="ml-3 p-1 rounded-md text-[#737B72] hover:text-[#283128] hover:bg-[#F7F8F5] cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
