import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle2, Clock, Flame, X } from 'lucide-react';
import { PriorityLevel, Task, TaskFormData } from '../types/task.ts';

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<TaskFormData>) => Promise<void>;
  initialTask?: Task | null;
  isLoading: boolean;
}

export const TaskFormModal: React.FC<TaskFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialTask,
  isLoading,
}) => {
  const isEditing = Boolean(initialTask);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<PriorityLevel>('Medium');
  const [dueDate, setDueDate] = useState('');
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title || '');
      setDescription(initialTask.description || '');
      setPriority(initialTask.priority || 'Medium');
      if (initialTask.dueDate) {
        const d = new Date(initialTask.dueDate);
        if (!isNaN(d.getTime())) {
          setDueDate(d.toISOString().split('T')[0]);
        } else {
          setDueDate('');
        }
      } else {
        setDueDate('');
      }
      setCompleted(Boolean(initialTask.completed));
    } else {
      setTitle('');
      setDescription('');
      setPriority('Medium');
      setDueDate('');
      setCompleted(false);
    }
    setError(null);
  }, [initialTask, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a task title');
      return;
    }

    try {
      setError(null);
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        priority,
        dueDate: dueDate ? new Date(dueDate).toISOString() : '',
        completed,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save task');
    }
  };

  const setQuickDate = (daysAhead: number) => {
    const target = new Date();
    target.setDate(target.getDate() + daysAhead);
    setDueDate(target.toISOString().split('T')[0]);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/30 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-white border border-[#E8ECE5] rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-[#E8ECE5] bg-[#F7F8F5]/60">
          <h2 className="text-base sm:text-lg font-bold text-[#283128]">
            {isEditing ? 'Edit Task' : 'Add New Task'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#737B72] hover:text-[#283128] hover:bg-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4.5">
          {error && (
            <div className="p-3 rounded-xl bg-[#F8E5E2] border border-[#9B453A]/20 text-[#9B453A] text-xs">
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-[#283128] mb-1.5">
              Task Title <span className="text-[#9B453A]">*</span>
            </label>
            <input
              type="text"
              required
              maxLength={150}
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Complete university presentation slides"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F8F5] border border-[#E8ECE5] text-sm text-[#283128] placeholder-[#737B72] focus:outline-none focus:bg-white focus:border-[#789477] focus:ring-1 focus:ring-[#789477] transition-all"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-[#283128] mb-1.5">
              Description <span className="text-[#737B72] font-normal">(optional)</span>
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Add key notes, links, or deliverables..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F8F5] border border-[#E8ECE5] text-sm text-[#283128] placeholder-[#737B72] focus:outline-none focus:bg-white focus:border-[#789477] focus:ring-1 focus:ring-[#789477] transition-all resize-none"
            />
          </div>

          {/* Priority Selection */}
          <div>
            <label className="block text-xs font-semibold text-[#283128] mb-1.5">
              Priority
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {/* Low */}
              <button
                type="button"
                onClick={() => setPriority('Low')}
                className={`flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                  priority === 'Low'
                    ? 'bg-[#E5EDF5] border-[#2D527C]/40 text-[#2D527C] font-semibold'
                    : 'bg-white border-[#E8ECE5] text-[#737B72] hover:bg-[#F7F8F5]'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-[#2D527C]" />
                <span>Low</span>
              </button>

              {/* Medium */}
              <button
                type="button"
                onClick={() => setPriority('Medium')}
                className={`flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                  priority === 'Medium'
                    ? 'bg-[#F8EED9] border-[#7A520E]/40 text-[#7A520E] font-semibold'
                    : 'bg-white border-[#E8ECE5] text-[#737B72] hover:bg-[#F7F8F5]'
                }`}
              >
                <Clock className="w-3.5 h-3.5 text-[#7A520E]" />
                <span>Medium</span>
              </button>

              {/* High */}
              <button
                type="button"
                onClick={() => setPriority('High')}
                className={`flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                  priority === 'High'
                    ? 'bg-[#F8E5E2] border-[#9B453A]/40 text-[#9B453A] font-semibold'
                    : 'bg-white border-[#E8ECE5] text-[#737B72] hover:bg-[#F7F8F5]'
                }`}
              >
                <Flame className="w-3.5 h-3.5 text-[#9B453A]" />
                <span>High</span>
              </button>
            </div>
          </div>

          {/* Due Date */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-[#283128]">
                Due Date
              </label>
              {dueDate && (
                <button
                  type="button"
                  onClick={() => setDueDate('')}
                  className="text-[11px] text-[#737B72] hover:text-[#9B453A] cursor-pointer"
                >
                  Clear date
                </button>
              )}
            </div>

            <input
              type="date"
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-[#F7F8F5] border border-[#E8ECE5] text-sm text-[#283128] focus:outline-none focus:bg-white focus:border-[#789477] transition-all"
            />

            {/* Quick date shortcuts */}
            <div className="flex items-center space-x-1.5 mt-2">
              <span className="text-[11px] text-[#737B72]">Quick:</span>
              <button
                type="button"
                onClick={() => setQuickDate(0)}
                className="text-xs px-2.5 py-0.5 rounded-lg bg-[#F7F8F5] hover:bg-[#EAF0E7] text-[#283128] border border-[#E8ECE5] transition-colors cursor-pointer"
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => setQuickDate(1)}
                className="text-xs px-2.5 py-0.5 rounded-lg bg-[#F7F8F5] hover:bg-[#EAF0E7] text-[#283128] border border-[#E8ECE5] transition-colors cursor-pointer"
              >
                Tomorrow
              </button>
              <button
                type="button"
                onClick={() => setQuickDate(7)}
                className="text-xs px-2.5 py-0.5 rounded-lg bg-[#F7F8F5] hover:bg-[#EAF0E7] text-[#283128] border border-[#E8ECE5] transition-colors cursor-pointer"
              >
                Next Week
              </button>
            </div>
          </div>

          {/* Status Checkbox when editing */}
          {isEditing && (
            <div className="pt-1">
              <label className="flex items-center space-x-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={completed}
                  onChange={e => setCompleted(e.target.checked)}
                  className="w-4 h-4 rounded text-[#789477] focus:ring-[#789477] border-[#E8ECE5]"
                />
                <span className="text-xs font-medium text-[#283128]">
                  Mark this task as completed
                </span>
              </label>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end space-x-2.5 pt-4 border-t border-[#E8ECE5]">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-medium text-[#737B72] hover:text-[#283128] hover:bg-[#F7F8F5] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-[#789477] hover:bg-[#5F795E] text-white shadow-xs transition-all active:scale-98 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : isEditing ? 'Update Task' : 'Save Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
