import React from 'react';
import {
  CheckSquare,
  LayoutDashboard,
  ListTodo,
  Clock,
  CheckCircle2,
  Settings,
  Database,
  Terminal,
  X,
} from 'lucide-react';
import { MongoStatus, TaskStatusFilter } from '../types/task.ts';

export type NavView = 'overview' | 'all' | 'pending' | 'completed' | 'settings';

interface SidebarProps {
  currentView: NavView;
  onSelectView: (view: NavView) => void;
  taskCounts: {
    total: number;
    pending: number;
    completed: number;
  };
  mongoStatus: MongoStatus | null;
  onOpenAtlasModal: () => void;
  onOpenVSCodeGuide: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  taskCounts,
  mongoStatus,
  onOpenAtlasModal,
  onOpenVSCodeGuide,
  isMobileOpen,
  onCloseMobile,
}) => {
  const isConnected = mongoStatus?.isConnected;

  const navItems: {
    id: NavView;
    label: string;
    icon: React.ElementType;
    count?: number;
  }[] = [
    {
      id: 'overview',
      label: 'Overview',
      icon: LayoutDashboard,
    },
    {
      id: 'all',
      label: 'All Tasks',
      icon: ListTodo,
      count: taskCounts.total,
    },
    {
      id: 'pending',
      label: 'Pending',
      icon: Clock,
      count: taskCounts.pending,
    },
    {
      id: 'completed',
      label: 'Completed',
      icon: CheckCircle2,
      count: taskCounts.completed,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
    },
  ];

  const handleNavClick = (view: NavView) => {
    if (view === 'settings') {
      onOpenAtlasModal();
    } else {
      onSelectView(view);
    }
    onCloseMobile();
  };

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between p-5 bg-white border-r border-[#E8ECE5]">
      {/* Brand & Logo */}
      <div>
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-[#E8ECE5]">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-[#EAF0E7] flex items-center justify-center text-[#789477] shadow-xs">
              <CheckSquare className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h1 className="text-base font-bold text-[#283128] tracking-tight leading-none">
                Task Manager
              </h1>
              <span className="text-[11px] font-medium text-[#737B72] mt-0.5 block">
                MERN Stack &bull; MongoDB
              </span>
            </div>
          </div>
          {/* Close button on mobile */}
          <button
            onClick={onCloseMobile}
            className="md:hidden p-1.5 rounded-lg text-[#737B72] hover:bg-[#F7F8F5] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-[#EAF0E7] text-[#789477] font-semibold'
                    : 'text-[#737B72] hover:text-[#283128] hover:bg-[#F7F8F5]'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-[#789477] stroke-[2.2]' : 'text-[#737B72]'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.count !== undefined && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full transition-colors ${
                      isActive
                        ? 'bg-white text-[#789477] font-semibold shadow-xs'
                        : 'bg-[#F7F8F5] text-[#737B72]'
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Area: Database Status & Project Guide */}
      <div className="pt-5 border-t border-[#E8ECE5] space-y-2.5">
        {/* Database Status Card */}
        <div
          onClick={onOpenAtlasModal}
          className={`p-3 rounded-xl border transition-all cursor-pointer ${
            isConnected
              ? 'bg-[#EAF0E7]/60 border-[#789477]/30 hover:bg-[#EAF0E7]'
              : 'bg-[#F8EED9]/60 border-[#E8ECE5] hover:bg-[#F8EED9]'
          }`}
          title="Click to view database connection status"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Database
                className={`w-4 h-4 ${isConnected ? 'text-[#789477]' : 'text-[#7A520E]'}`}
              />
              <span className="text-xs font-semibold text-[#283128]">
                {isConnected ? 'MongoDB Atlas' : 'Atlas Config'}
              </span>
            </div>
            <span
              className={`w-2 h-2 rounded-full ${
                isConnected ? 'bg-[#789477]' : 'bg-[#7A520E]'
              }`}
            />
          </div>
          <p className="text-[11px] text-[#737B72] mt-1 truncate">
            {isConnected
              ? `Connected (${mongoStatus?.dbName || 'tasks'})`
              : 'Setup cloud persistence'}
          </p>
        </div>

        {/* VS Code Guide Button */}
        <button
          onClick={onOpenVSCodeGuide}
          className="w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-xl text-xs font-medium text-[#737B72] hover:text-[#283128] hover:bg-[#F7F8F5] border border-[#E8ECE5] transition-colors cursor-pointer"
        >
          <Terminal className="w-3.5 h-3.5 text-[#789477]" />
          <span>VS Code Guide</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop fixed sidebar */}
      <aside className="hidden md:block w-64 flex-shrink-0 h-screen sticky top-0 z-20">
        {sidebarContent}
      </aside>

      {/* Mobile drawer overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative w-72 max-w-[80vw] h-full z-10 shadow-xl animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
