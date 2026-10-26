import React from 'react';
import { AlertCircle, Trash2, X } from 'lucide-react';
import { Task } from '../types/task.ts';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  task: Task | null;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isLoading: boolean;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  task,
  onClose,
  onConfirm,
  isLoading,
}) => {
  if (!isOpen || !task) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/30 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-white border border-[#E8ECE5] rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-6">
          <div className="flex items-center justify-between pb-3.5 border-b border-[#E8ECE5]">
            <div className="flex items-center space-x-2 text-[#9B453A]">
              <div className="w-8 h-8 rounded-lg bg-[#F8E5E2] flex items-center justify-center text-[#9B453A]">
                <AlertCircle className="w-4 h-4 stroke-[2.2]" />
              </div>
              <h3 className="text-base font-bold text-[#283128]">Delete Task</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#737B72] hover:text-[#283128] hover:bg-[#F7F8F5] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="py-4">
            <p className="text-sm text-[#737B72] leading-relaxed">
              Are you sure you want to delete this task? It will be permanently removed from your
              MongoDB collection.
            </p>
            <div className="mt-3 p-3 rounded-xl bg-[#F7F8F5] border border-[#E8ECE5] text-xs font-semibold text-[#283128] break-words">
              &ldquo;{task.title}&rdquo;
            </div>
          </div>

          <div className="flex items-center justify-end space-x-2.5 pt-3.5 border-t border-[#E8ECE5]">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-medium text-[#737B72] hover:text-[#283128] hover:bg-[#F7F8F5] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isLoading}
              className="flex items-center space-x-1.5 px-4.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-[#9B453A] hover:bg-[#85342A] text-white shadow-xs active:scale-98 transition-all cursor-pointer disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
              <span>{isLoading ? 'Deleting...' : 'Delete'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
