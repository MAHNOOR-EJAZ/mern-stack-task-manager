import React from 'react';
import { AlertCircle, CheckCircle2, Clock, ListTodo } from 'lucide-react';
import { Task, TaskStatusFilter } from '../types/task.ts';

interface TaskStatsProps {
  tasks: Task[];
  activeStatus: TaskStatusFilter;
  onSelectStatus: (status: TaskStatusFilter) => void;
  isOverdueActive?: boolean;
  onToggleOverdueFilter?: () => void;
}

export const TaskStats: React.FC<TaskStatsProps> = ({
  tasks,
  activeStatus,
  onSelectStatus,
  isOverdueActive,
  onToggleOverdueFilter,
}) => {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending = total - completed;

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const overdue = tasks.filter(t => {
    if (t.completed || !t.dueDate) return false;
    const due = new Date(t.dueDate);
    due.setHours(0, 0, 0, 0);
    return due < now;
  }).length;

  const completionPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="mb-6 space-y-3.5">
      {/* Four Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Total Tasks */}
        <div
          onClick={() => onSelectStatus('all')}
          className={`p-5 rounded-xl bg-white border transition-all duration-150 cursor-pointer shadow-xs ${
            activeStatus === 'all' && !isOverdueActive
              ? 'border-[#789477] ring-1 ring-[#789477]/40'
              : 'border-[#E8ECE5] hover:border-[#789477]/50 hover:shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-[#737B72]">Total Tasks</span>
            <div className="w-8 h-8 rounded-lg bg-[#EAF0E7] flex items-center justify-center text-[#789477]">
              <ListTodo className="w-4 h-4 stroke-[2.2]" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl sm:text-3xl font-bold text-[#283128] tracking-tight">
              {total}
            </span>
            <span className="text-xs text-[#737B72]">tasks</span>
          </div>
        </div>

        {/* 2. Pending */}
        <div
          onClick={() => onSelectStatus('pending')}
          className={`p-5 rounded-xl bg-white border transition-all duration-150 cursor-pointer shadow-xs ${
            activeStatus === 'pending' && !isOverdueActive
              ? 'border-[#789477] ring-1 ring-[#789477]/40'
              : 'border-[#E8ECE5] hover:border-[#789477]/50 hover:shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-[#737B72]">Pending</span>
            <div className="w-8 h-8 rounded-lg bg-[#F8EED9] flex items-center justify-center text-[#7A520E]">
              <Clock className="w-4 h-4 stroke-[2.2]" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl sm:text-3xl font-bold text-[#283128] tracking-tight">
              {pending}
            </span>
            <span className="text-xs text-[#737B72]">in progress</span>
          </div>
        </div>

        {/* 3. Completed */}
        <div
          onClick={() => onSelectStatus('completed')}
          className={`p-5 rounded-xl bg-white border transition-all duration-150 cursor-pointer shadow-xs ${
            activeStatus === 'completed' && !isOverdueActive
              ? 'border-[#789477] ring-1 ring-[#789477]/40'
              : 'border-[#E8ECE5] hover:border-[#789477]/50 hover:shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-[#737B72]">Completed</span>
            <div className="w-8 h-8 rounded-lg bg-[#E3EFE2] flex items-center justify-center text-[#2E4E2C]">
              <CheckCircle2 className="w-4 h-4 stroke-[2.2]" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl sm:text-3xl font-bold text-[#283128] tracking-tight">
              {completed}
            </span>
            <span className="text-xs text-[#737B72]">
              {completionPercentage}% done
            </span>
          </div>
        </div>

        {/* 4. Overdue */}
        <div
          onClick={() => onToggleOverdueFilter && onToggleOverdueFilter()}
          className={`p-5 rounded-xl bg-white border transition-all duration-150 cursor-pointer shadow-xs ${
            isOverdueActive
              ? 'border-[#9B453A] ring-1 ring-[#9B453A]/40'
              : 'border-[#E8ECE5] hover:border-[#789477]/50 hover:shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-[#737B72]">Overdue</span>
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                overdue > 0 ? 'bg-[#F8E5E2] text-[#9B453A]' : 'bg-[#F7F8F5] text-[#737B72]'
              }`}
            >
              <AlertCircle className="w-4 h-4 stroke-[2.2]" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span
              className={`text-2xl sm:text-3xl font-bold tracking-tight ${
                overdue > 0 ? 'text-[#9B453A]' : 'text-[#283128]'
              }`}
            >
              {overdue}
            </span>
            <span className="text-xs text-[#737B72]">
              {overdue === 1 ? 'needs action' : 'tasks'}
            </span>
          </div>
        </div>
      </div>

      {/* Visual Completion Progress Bar in #789477 Sage Green */}
      <div className="p-4 sm:p-4.5 rounded-xl bg-white border border-[#E8ECE5] shadow-xs">
        <div className="flex items-center justify-between mb-2 text-xs">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-[#283128]">Task Completion Progress</span>
            <span className="text-[#737B72]">
              &bull; {completed} of {total} {total === 1 ? 'task' : 'tasks'} completed
            </span>
          </div>
          <span className="font-bold text-[#789477] text-xs sm:text-sm">
            {completionPercentage}%
          </span>
        </div>

        {/* Track and Animated Bar */}
        <div className="w-full h-2.5 rounded-full bg-[#EAF0E7] overflow-hidden">
          <div
            className="h-full rounded-full bg-[#789477] transition-all duration-500 ease-out"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};
