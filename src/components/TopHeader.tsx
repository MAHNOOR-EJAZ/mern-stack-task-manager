import React from 'react';
import { Menu, Plus, Sparkles, User } from 'lucide-react';

interface TopHeaderProps {
  onOpenNewTask: () => void;
  onOpenMobileSidebar: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  onOpenNewTask,
  onOpenMobileSidebar,
}) => {
  // Determine dynamic greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning!';
    if (hour < 18) return 'Good afternoon!';
    return 'Good evening!';
  };

  return (
    <header className="w-full bg-[#F7F8F5] pb-6 pt-6 sm:pt-8 px-4 sm:px-8 border-b border-[#E8ECE5]/80">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left: Mobile hamburger + Greeting */}
        <div className="flex items-center space-x-3.5">
          <button
            onClick={onOpenMobileSidebar}
            className="md:hidden p-2 rounded-xl bg-white border border-[#E8ECE5] text-[#283128] hover:bg-[#F7F8F5] transition-colors cursor-pointer"
            title="Open Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#283128] tracking-tight">
              {getGreeting()}
            </h2>
            <p className="text-xs sm:text-sm text-[#737B72] mt-0.5">
              Here's an overview of your tasks.
            </p>
          </div>
        </div>

        {/* Right: Actions and minimal profile */}
        <div className="flex items-center space-x-3 self-end sm:self-auto">

          {/* Prominent Sage Green "Add Task" CTA */}
          <button
            onClick={onOpenNewTask}
            className="flex items-center space-x-2 px-4 sm:px-5 py-2.5 rounded-xl bg-[#789477] hover:bg-[#5F795E] text-white font-semibold text-xs sm:text-sm shadow-xs transition-all duration-150 active:scale-98 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Task</span>
          </button>

          {/* Minimal user profile avatar */}
          <div
            className="w-10 h-10 rounded-xl bg-white border border-[#E8ECE5] flex items-center justify-center text-[#789477] shadow-xs cursor-pointer hover:bg-[#EAF0E7]/60 transition-colors"
            title="Signed in as Student"
          >
            <User className="w-5 h-5" />
          </div>
        </div>
      </div>
    </header>
  );
};
