import React from 'react';
import { CheckSquare, Database, Download, Plus, RefreshCw, Sparkles, Terminal } from 'lucide-react';
import { MongoStatus } from '../types/task.ts';

interface NavbarProps {
  mongoStatus: MongoStatus | null;
  onOpenNewTask: () => void;
  onOpenAtlasModal: () => void;
  onOpenVSCodeGuide: () => void;
  onSeedTasks: () => void;
  isLoading: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  mongoStatus,
  onOpenNewTask,
  onOpenAtlasModal,
  onOpenVSCodeGuide,
  onSeedTasks,
  isLoading,
}) => {
  const isConnected = mongoStatus?.isConnected;

  return (
    <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Stack Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-slate-950 font-bold">
              <CheckSquare className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                  MERN Task Manager
                </span>
                <span className="hidden md:inline-flex text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Full Stack
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                MongoDB Atlas &bull; Express.js &bull; React &bull; Node.js
              </p>
            </div>
          </div>

          {/* Database Indicator & Quick Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* MongoDB Atlas Status Pill */}
            <button
              onClick={onOpenAtlasModal}
              title="Click to view MongoDB Atlas status and instructions"
              className={`flex items-center space-x-2 text-xs font-medium px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                isConnected
                  ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30 hover:bg-emerald-900/50 hover:border-emerald-500/50'
                  : 'bg-amber-950/40 text-amber-300 border-amber-500/30 hover:bg-amber-900/50 hover:border-amber-500/50'
              }`}
            >
              <Database className={`w-3.5 h-3.5 ${isConnected ? 'text-emerald-400' : 'text-amber-400'}`} />
              <span className="flex h-2 w-2 relative">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    isConnected ? 'bg-emerald-400' : 'bg-amber-400'
                  }`}
                />
                <span
                  className={`relative inline-flex rounded-full h-2 w-2 ${
                    isConnected ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}
                />
              </span>
              <span className="hidden sm:inline">
                {isConnected ? 'Atlas Connected' : 'Atlas Config'}
              </span>
            </button>

            {/* VS Code Setup Guide */}
            <button
              onClick={onOpenVSCodeGuide}
              className="flex items-center space-x-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-750 text-slate-200 hover:text-white transition-all cursor-pointer"
              title="Step-by-step guide to download and run in VS Code"
            >
              <Terminal className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden md:inline">VS Code Guide</span>
            </button>

            {/* Seed Demo Data Button */}
            <button
              onClick={onSeedTasks}
              disabled={isLoading}
              className="hidden lg:flex items-center space-x-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/60 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer disabled:opacity-50"
              title="Populate with sample university project tasks"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Sample Tasks</span>
            </button>

            {/* Add Task Button */}
            <button
              onClick={onOpenNewTask}
              className="flex items-center space-x-1.5 text-xs sm:text-sm font-semibold px-3.5 py-1.5 sm:py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>New Task</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
