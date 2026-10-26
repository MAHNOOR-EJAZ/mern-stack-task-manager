import React from 'react';
import {
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Edit3,
  Flame,
  Trash2,
} from 'lucide-react';
import { PriorityLevel, Task } from '../types/task.ts';

interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onToggle, onEdit, onDelete }) => {
  const isCompleted = task.completed;
  const taskId = task.id || task._id || '';

  // Calculate due date status
  let dueDateText = 'No due date';
  let isOverdue = false;
  let isDueSoon = false;

  if (task.dueDate) {
    const due = new Date(task.dueDate);
    if (!isNaN(due.getTime())) {
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      const dueMidnight = new Date(due);
      dueMidnight.setHours(0, 0, 0, 0);

      const diffDays = Math.round((dueMidnight.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      dueDateText = due.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: due.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
      });

      if (!isCompleted) {
        if (diffDays < 0) {
          isOverdue = true;
          dueDateText = `Overdue (${Math.abs(diffDays)}d ago)`;
        } else if (diffDays === 0) {
          isDueSoon = true;
          dueDateText = 'Due Today';
        } else if (diffDays === 1) {
          isDueSoon = true;
          dueDateText = 'Due Tomorrow';
        }
      }
    }
  }

  // Priority badge styling matching Option B palette
  const renderPriorityBadge = (priority: PriorityLevel) => {
    switch (priority) {
      case 'High':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#F8E5E2] text-[#9B453A] border border-[#F8E5E2]">
            <Flame className="w-3 h-3 text-[#9B453A]" />
            <span>High</span>
          </span>
        );
      case 'Medium':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#F8EED9] text-[#7A520E] border border-[#F8EED9]">
            <Clock className="w-3 h-3 text-[#7A520E]" />
            <span>Medium</span>
          </span>
        );
      case 'Low':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#E5EDF5] text-[#2D527C] border border-[#E5EDF5]">
            <CheckCircle2 className="w-3 h-3 text-[#2D527C]" />
            <span>Low</span>
          </span>
        );
    }
  };

  return (
    <div
      className={`group rounded-xl border transition-all duration-150 p-4 sm:p-5 flex flex-col justify-between ${
        isCompleted
          ? 'bg-white/80 border-[#E8ECE5] opacity-85 hover:opacity-100 shadow-xs'
          : 'bg-white border-[#E8ECE5] hover:border-[#789477]/50 shadow-xs hover:shadow-sm'
      }`}
    >
      <div>
        <div className="flex items-start gap-3.5">
          {/* Custom Checkbox */}
          <button
            onClick={() => onToggle(taskId)}
            title={isCompleted ? 'Mark as pending' : 'Mark as completed'}
            className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-md flex items-center justify-center transition-all cursor-pointer ${
              isCompleted
                ? 'bg-[#789477] text-white shadow-xs'
                : 'border border-[#737B72]/40 hover:border-[#789477] bg-white'
            }`}
          >
            {isCompleted && <Check className="w-3.5 h-3.5 stroke-[2.8]" />}
          </button>

          {/* Title & Actions */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3
                className={`text-sm sm:text-base font-semibold leading-snug break-words transition-colors ${
                  isCompleted ? 'line-through text-[#737B72]' : 'text-[#283128]'
                }`}
              >
                {task.title}
              </h3>

              {/* Action buttons */}
              <div className="flex items-center space-x-1 flex-shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => onEdit(task)}
                  title="Edit task"
                  className="p-1 rounded-lg text-[#737B72] hover:text-[#283128] hover:bg-[#F7F8F5] transition-colors cursor-pointer"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(task)}
                  title="Delete task"
                  className="p-1 rounded-lg text-[#737B72] hover:text-[#9B453A] hover:bg-[#F8E5E2] transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Short Description */}
            {task.description && (
              <p
                className={`mt-1.5 text-xs sm:text-sm leading-relaxed ${
                  isCompleted ? 'line-through text-[#737B72]/80' : 'text-[#737B72]'
                }`}
              >
                {task.description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Footer: Priority Badge, Due Date, and Status */}
      <div className="mt-4 pt-3 border-t border-[#E8ECE5] flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center space-x-2">
          {renderPriorityBadge(task.priority)}

          {/* Due Date Indicator */}
          {task.dueDate && (
            <span
              className={`inline-flex items-center space-x-1 text-xs font-medium ${
                isOverdue
                  ? 'text-[#9B453A]'
                  : isDueSoon
                  ? 'text-[#7A520E]'
                  : 'text-[#737B72]'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{dueDateText}</span>
            </span>
          )}
        </div>

        {/* Completed / Pending subtle pill */}
        <span
          className={`px-2 py-0.5 rounded-md text-[11px] font-medium tracking-wide ${
            isCompleted
              ? 'bg-[#E3EFE2] text-[#2E4E2C]'
              : 'bg-[#F7F8F5] text-[#737B72]'
          }`}
        >
          {isCompleted ? 'Completed' : 'Pending'}
        </span>
      </div>
    </div>
  );
};
