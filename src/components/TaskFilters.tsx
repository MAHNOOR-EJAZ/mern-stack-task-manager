import React from 'react';
import { ArrowUpDown, RotateCcw, Search, X } from 'lucide-react';
import { SortOption, SortOrder, TaskPriorityFilter, TaskStatusFilter } from '../types/task.ts';

interface TaskFiltersProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  statusFilter: TaskStatusFilter;
  onStatusChange: (status: TaskStatusFilter) => void;
  priorityFilter: TaskPriorityFilter;
  onPriorityChange: (priority: TaskPriorityFilter) => void;
  sortBy: SortOption;
  onSortByChange: (sort: SortOption) => void;
  sortOrder: SortOrder;
  onToggleSortOrder: () => void;
  onResetFilters: () => void;
  totalFiltered: number;
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  priorityFilter,
  onPriorityChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onToggleSortOrder,
  onResetFilters,
  totalFiltered,
}) => {
  const isFiltered =
    searchQuery.trim() !== '' || statusFilter !== 'all' || priorityFilter !== 'all';

  return (
    <div className="bg-white border border-[#E8ECE5] rounded-2xl p-4 sm:p-5 mb-6 shadow-xs">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3.5">
        {/* Search Field */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#737B72]">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            placeholder="Search tasks..."
            className="w-full pl-10 pr-9 py-2 rounded-xl bg-[#F7F8F5] border border-[#E8ECE5] text-sm text-[#283128] placeholder-[#737B72] focus:outline-none focus:bg-white focus:border-[#789477] focus:ring-1 focus:ring-[#789477] transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#737B72] hover:text-[#283128] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Status Filters: All, Pending, Completed */}
        <div className="flex items-center bg-[#F7F8F5] p-1 rounded-xl border border-[#E8ECE5] self-start lg:self-auto">
          {(['all', 'pending', 'completed'] as TaskStatusFilter[]).map(status => {
            const isActive = statusFilter === status;
            return (
              <button
                key={status}
                onClick={() => onStatusChange(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-white text-[#789477] font-semibold shadow-xs'
                    : 'text-[#737B72] hover:text-[#283128]'
                }`}
              >
                {status}
              </button>
            );
          })}
        </div>

        {/* Priority Filters: All, High, Medium, Low */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 lg:pb-0">
          <span className="text-xs text-[#737B72] mr-1 hidden sm:inline">Priority:</span>
          {(['all', 'High', 'Medium', 'Low'] as TaskPriorityFilter[]).map(priority => {
            const isActive = priorityFilter === priority;

            let badgeStyle = 'bg-white text-[#737B72] border-[#E8ECE5] hover:bg-[#F7F8F5]';
            if (isActive) {
              if (priority === 'all') {
                badgeStyle = 'bg-[#EAF0E7] text-[#789477] border-[#789477]/40 font-semibold';
              } else if (priority === 'High') {
                badgeStyle = 'bg-[#F8E5E2] text-[#9B453A] border-[#9B453A]/30 font-semibold';
              } else if (priority === 'Medium') {
                badgeStyle = 'bg-[#F8EED9] text-[#7A520E] border-[#7A520E]/30 font-semibold';
              } else if (priority === 'Low') {
                badgeStyle = 'bg-[#E5EDF5] text-[#2D527C] border-[#2D527C]/30 font-semibold';
              }
            }

            return (
              <button
                key={priority}
                onClick={() => onPriorityChange(priority)}
                className={`px-3 py-1 rounded-xl text-xs font-medium border transition-all duration-150 cursor-pointer whitespace-nowrap ${badgeStyle}`}
              >
                {priority}
              </button>
            );
          })}
        </div>
      </div>

      {/* Second Row: Counts, Clear filters, and Sorting */}
      <div className="mt-3.5 pt-3 border-t border-[#E8ECE5] flex flex-wrap items-center justify-between gap-3 text-xs text-[#737B72]">
        <div className="flex items-center space-x-3">
          <span>
            Showing <strong className="text-[#283128] font-semibold">{totalFiltered}</strong> tasks
          </span>

          {isFiltered && (
            <button
              onClick={onResetFilters}
              className="flex items-center space-x-1 text-[#789477] hover:text-[#5F795E] font-medium transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Sorting control */}
        <div className="flex items-center space-x-2">
          <span>Sort by:</span>
          <select
            value={sortBy}
            onChange={e => onSortByChange(e.target.value as SortOption)}
            className="bg-[#F7F8F5] border border-[#E8ECE5] text-[#283128] text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#789477] cursor-pointer"
          >
            <option value="createdAt">Date Created</option>
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
            <option value="title">Title (A-Z)</option>
          </select>

          <button
            onClick={onToggleSortOrder}
            title={`Sort ${sortOrder === 'asc' ? 'Ascending' : 'Descending'}`}
            className="p-1.5 rounded-lg bg-[#F7F8F5] border border-[#E8ECE5] text-[#737B72] hover:text-[#283128] hover:bg-white transition-colors cursor-pointer"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
