import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  AlertCircle,
  ListPlus,
  Plus,
  RefreshCw,
  Sparkles,
  X,
} from 'lucide-react';
import { Sidebar, NavView } from './components/Sidebar.tsx';
import { TopHeader } from './components/TopHeader.tsx';
import { TaskStats } from './components/TaskStats.tsx';
import { TaskFilters } from './components/TaskFilters.tsx';
import { TaskCard } from './components/TaskCard.tsx';
import { TaskFormModal } from './components/TaskFormModal.tsx';
import { DeleteConfirmModal } from './components/DeleteConfirmModal.tsx';
import { MongoAtlasModal } from './components/MongoAtlasModal.tsx';
import { VSCodeGuideModal } from './components/VSCodeGuideModal.tsx';
import { Toast, ToastMessage } from './components/Toast.tsx';
import { api } from './services/api.ts';
import {
  MongoStatus,
  SortOption,
  SortOrder,
  Task,
  TaskFormData,
  TaskPriorityFilter,
  TaskStatusFilter,
} from './types/task.ts';

export default function App() {
  // Navigation & view state
  const [currentNavView, setCurrentNavView] = useState<NavView>('overview');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Task & data states
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [mongoStatus, setMongoStatus] = useState<MongoStatus | null>(null);

  // Filters & Search
  const [statusFilter, setStatusFilter] = useState<TaskStatusFilter>('all');
  const [priorityFilter, setPriorityFilter] = useState<TaskPriorityFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [isOverdueFilterActive, setIsOverdueFilterActive] = useState(false);
  const [isNoticeDismissed, setIsNoticeDismissed] = useState(false);

  // Modals
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);
  const [isAtlasModalOpen, setIsAtlasModalOpen] = useState(false);
  const [isVSCodeModalOpen, setIsVSCodeModalOpen] = useState(false);

  // Toast feedback
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((text: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts(prev => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  }, []);

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Fetch status of MongoDB
  const fetchStatus = useCallback(async (retry: boolean = false) => {
    try {
      const data = await api.getStatus(retry);
      setMongoStatus(data.database);
    } catch (err) {
      console.warn('Could not fetch MongoDB status:', err);
    }
  }, []);

  // Fetch tasks from Express REST API
  const loadTasks = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await api.getTasks({
        status: statusFilter,
        priority: priorityFilter,
        search: searchQuery,
        sort: sortBy,
        order: sortOrder,
      });

      setTasks(result.tasks || []);
    } catch (err: any) {
      showToast(err.message || 'Error fetching tasks from server', 'error');
    } finally {
      setIsLoading(false);
      setIsInitialLoading(false);
    }
  }, [statusFilter, priorityFilter, searchQuery, sortBy, sortOrder, showToast]);

  // Initial load
  useEffect(() => {
    loadTasks();
    fetchStatus();
  }, [loadTasks, fetchStatus]);

  // Sync sidebar navigation with status filter
  const handleSelectNavView = (view: NavView) => {
    setCurrentNavView(view);
    setIsOverdueFilterActive(false);

    if (view === 'overview' || view === 'all') {
      setStatusFilter('all');
    } else if (view === 'pending') {
      setStatusFilter('pending');
    } else if (view === 'completed') {
      setStatusFilter('completed');
    }
  };

  // Task count metrics
  const taskCounts = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;
    return { total, pending, completed };
  }, [tasks]);

  // Filter tasks if overdue filter is specifically toggled
  const displayedTasks = useMemo(() => {
    if (!isOverdueFilterActive) return tasks;
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return tasks.filter(t => {
      if (t.completed || !t.dueDate) return false;
      const due = new Date(t.dueDate);
      due.setHours(0, 0, 0, 0);
      return due < now;
    });
  }, [tasks, isOverdueFilterActive]);

  // Handle Save Task (Create or Update)
  const handleSaveTask = async (formData: Partial<TaskFormData>) => {
    setIsLoading(true);
    try {
      if (editingTask) {
        const id = editingTask.id || editingTask._id || '';
        await api.updateTask(id, formData);
        showToast('Task updated successfully');
      } else {
        await api.createTask(formData);
        showToast('Task created successfully');
      }
      setIsTaskModalOpen(false);
      setEditingTask(null);
      await loadTasks();
      await fetchStatus();
    } catch (err: any) {
      showToast(err.message || 'Failed to save task', 'error');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Toggle Task Status
  const handleToggleTask = async (id: string) => {
    try {
      const res = await api.toggleTask(id);
      const isNowDone = res.task.completed;
      showToast(
        isNowDone ? 'Task marked as completed' : 'Task marked as pending',
        'success'
      );
      // Optimistic update
      setTasks(prev =>
        prev.map(t => (t.id === id || t._id === id ? { ...t, completed: isNowDone } : t))
      );
      await fetchStatus();
    } catch (err: any) {
      showToast(err.message || 'Failed to toggle task', 'error');
      loadTasks();
    }
  };

  // Handle Delete Confirmation
  const handleDeleteTask = async () => {
    if (!deletingTask) return;
    const id = deletingTask.id || deletingTask._id || '';
    setIsLoading(true);
    try {
      await api.deleteTask(id);
      showToast('Task deleted successfully');
      setIsDeleteModalOpen(false);
      setDeletingTask(null);
      await loadTasks();
      await fetchStatus();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete task', 'error');
    } finally {
      setIsLoading(false);
    }
  };



  // Reset filters
  const handleResetFilters = () => {
    setStatusFilter('all');
    setPriorityFilter('all');
    setSearchQuery('');
    setSortBy('createdAt');
    setSortOrder('desc');
    setIsOverdueFilterActive(false);
    setCurrentNavView('overview');
  };

  return (
    <div className="min-h-screen bg-[#F7F8F5] text-[#283128] flex font-sans selection:bg-[#EAF0E7] selection:text-[#789477]">
      {/* Left Sidebar (Option A Layout + Option B Sage Green Palette) */}
      <Sidebar
        currentView={currentNavView}
        onSelectView={handleSelectNavView}
        taskCounts={taskCounts}
        mongoStatus={mongoStatus}
        onOpenAtlasModal={() => setIsAtlasModalOpen(true)}
        onOpenVSCodeGuide={() => setIsVSCodeModalOpen(true)}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <TopHeader
          onOpenNewTask={() => {
            setEditingTask(null);
            setIsTaskModalOpen(true);
          }}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
        />

        {/* Dashboard Body */}
        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-8 py-6 sm:py-8">
          {/* Atlas Connection / Whitelist Notice Banner */}
          {mongoStatus?.error && !isNoticeDismissed && (
            <div className="mb-6 p-4 rounded-xl bg-[#F8EED9] border border-[#7A520E]/20 text-[#7A520E] text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
              <div className="flex items-start sm:items-center space-x-2.5">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 sm:mt-0 text-[#7A520E]" />
                <span className="leading-relaxed">
                  <strong>MongoDB Atlas Notice:</strong> {mongoStatus.error}
                </span>
              </div>
              <div className="flex items-center space-x-2 flex-shrink-0 self-end sm:self-auto">
                <button
                  onClick={() => setIsAtlasModalOpen(true)}
                  className="px-3 py-1 rounded-lg bg-white border border-[#7A520E]/30 text-[#7A520E] font-semibold hover:bg-[#F8EED9] transition-colors cursor-pointer"
                >
                  Whitelist Guide &rarr;
                </button>
                <button
                  onClick={() => setIsNoticeDismissed(true)}
                  className="p-1 rounded-md text-[#7A520E] hover:text-[#283128] cursor-pointer"
                  title="Dismiss notice"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Summary Cards (Four clean white cards) */}
          <TaskStats
            tasks={tasks}
            activeStatus={statusFilter}
            onSelectStatus={st => {
              setStatusFilter(st);
              setIsOverdueFilterActive(false);
              if (st === 'pending') setCurrentNavView('pending');
              else if (st === 'completed') setCurrentNavView('completed');
              else setCurrentNavView('all');
            }}
            isOverdueActive={isOverdueFilterActive}
            onToggleOverdueFilter={() => setIsOverdueFilterActive(prev => !prev)}
          />

          {/* Search, Status, Priority & Sorting Filters */}
          <TaskFilters
            searchQuery={searchQuery}
            onSearchChange={q => setSearchQuery(q)}
            statusFilter={statusFilter}
            onStatusChange={s => {
              setStatusFilter(s);
              setIsOverdueFilterActive(false);
              if (s === 'pending') setCurrentNavView('pending');
              else if (s === 'completed') setCurrentNavView('completed');
              else setCurrentNavView('all');
            }}
            priorityFilter={priorityFilter}
            onPriorityChange={p => setPriorityFilter(p)}
            sortBy={sortBy}
            onSortByChange={s => setSortBy(s)}
            sortOrder={sortOrder}
            onToggleSortOrder={() => setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'))}
            onResetFilters={handleResetFilters}
            totalFiltered={displayedTasks.length}
          />

          {/* Task List / Grid */}
          {isInitialLoading ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-3">
              <RefreshCw className="w-6 h-6 text-[#789477] animate-spin" />
              <p className="text-xs text-[#737B72]">Loading tasks from Express server...</p>
            </div>
          ) : displayedTasks.length === 0 ? (
            <div className="py-16 px-6 rounded-2xl border border-[#E8ECE5] bg-white text-center flex flex-col items-center justify-center max-w-md mx-auto shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-[#EAF0E7] flex items-center justify-center text-[#789477] mb-3.5">
                <ListPlus className="w-6 h-6 stroke-[2.2]" />
              </div>

              <h3 className="text-base font-bold text-[#283128] mb-1">No tasks to display</h3>
              <p className="text-xs text-[#737B72] max-w-xs mb-5 leading-relaxed">
                {searchQuery || statusFilter !== 'all' || priorityFilter !== 'all' || isOverdueFilterActive
                  ? 'No tasks match your current filter selection. Try resetting filters to view all tasks.'
                  : 'Your dashboard is clear! Add your first task or load sample project tasks to get started.'}
              </p>

              <div className="flex flex-wrap items-center justify-center gap-2.5">
                {searchQuery || statusFilter !== 'all' || priorityFilter !== 'all' || isOverdueFilterActive ? (
                  <button
                    onClick={handleResetFilters}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#F7F8F5] hover:bg-[#EAF0E7] text-[#283128] border border-[#E8ECE5] transition-colors cursor-pointer"
                  >
                    Clear Filters
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setEditingTask(null);
                      setIsTaskModalOpen(true);
                    }}
                    className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#789477] hover:bg-[#5F795E] text-white shadow-xs transition-all active:scale-98 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Add First Task</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayedTasks.map(task => (
                <TaskCard
                  key={task.id || task._id}
                  task={task}
                  onToggle={handleToggleTask}
                  onEdit={t => {
                    setEditingTask(t);
                    setIsTaskModalOpen(true);
                  }}
                  onDelete={t => {
                    setDeletingTask(t);
                    setIsDeleteModalOpen(true);
                  }}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Modals */}
      <TaskFormModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingTask(null);
        }}
        onSubmit={handleSaveTask}
        initialTask={editingTask}
        isLoading={isLoading}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        task={deletingTask}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingTask(null);
        }}
        onConfirm={handleDeleteTask}
        isLoading={isLoading}
      />

      <MongoAtlasModal
        isOpen={isAtlasModalOpen}
        onClose={() => setIsAtlasModalOpen(false)}
        status={mongoStatus}
        onRefreshStatus={() => fetchStatus(true)}
        isLoading={isLoading}
      />

      <VSCodeGuideModal
        isOpen={isVSCodeModalOpen}
        onClose={() => setIsVSCodeModalOpen(false)}
      />

      {/* Toast notifications */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
