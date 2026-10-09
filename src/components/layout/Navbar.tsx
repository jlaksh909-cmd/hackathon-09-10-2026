import { Search, Bell, Menu, Command } from 'lucide-react';
import type { Branch, Year } from '../../data/mockData';
import { BRANCHES, YEARS } from '../../data/mockData';

export type TabId = 'library' | 'courses' | 'resources' | 'assistant' | 'admin' | 'schedule';

interface NavbarProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  selectedBranch: Branch;
  selectedYear: Year;
  onBranchChange: (branch: Branch) => void;
  onYearChange: (year: Year) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onToggleSidebar: () => void;
}

export default function Navbar({
  selectedBranch,
  selectedYear,
  onBranchChange,
  onYearChange,
  searchQuery,
  onSearchChange,
  onToggleSidebar,
}: NavbarProps) {

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-64 z-40 h-16 bg-white/80 backdrop-blur-xl border-b border-black/[0.06] transition-all duration-200">
      <div className="h-full px-4 sm:px-8 flex items-center justify-between gap-4 max-w-[1440px] mx-auto">
        
        {/* Left: Mobile Menu Toggle & Omni-Search */}
        <div className="flex items-center gap-3 flex-1 max-w-xl">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-xl text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-colors cursor-pointer"
            aria-label="Toggle Navigation Sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Minimalist Apple-style Omni-search input */}
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search syllabus notes, formulas, professors..."
              className="
                w-full pl-9.5 pr-14 py-2 text-[13px] bg-zinc-100/70 hover:bg-zinc-100 focus:bg-white
                text-zinc-900 placeholder:text-zinc-400 rounded-full border border-transparent
                focus:border-zinc-300 focus:ring-4 focus:ring-zinc-900/5 transition-all outline-none font-medium
              "
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-white border border-zinc-200 text-[10px] font-semibold text-zinc-400 shadow-2xs pointer-events-none">
              <Command className="w-2.5 h-2.5" />
              <span>K</span>
            </div>
          </div>
        </div>

        {/* Right: Branch/Year Notion-style Selectors & Profile Pill */}
        <div className="flex items-center gap-2.5 shrink-0">
          
          {/* Branch Pill Selector */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-100/80 border border-zinc-200/60 hover:border-zinc-300 transition-all">
            <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wide">
              Branch:
            </span>
            <select
              value={selectedBranch}
              onChange={(e) => onBranchChange(e.target.value as Branch)}
              className="bg-transparent text-xs font-semibold text-zinc-900 cursor-pointer focus:outline-none pr-5"
            >
              {BRANCHES.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          {/* Year Pill Selector */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-100/80 border border-zinc-200/60 hover:border-zinc-300 transition-all">
            <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wide">
              Year:
            </span>
            <select
              value={selectedYear}
              onChange={(e) => onYearChange(e.target.value as Year)}
              className="bg-transparent text-xs font-semibold text-zinc-900 cursor-pointer focus:outline-none pr-5"
            >
              {YEARS.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          {/* Notification Bell */}
          <button
            type="button"
            className="relative p-2 rounded-full text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-all cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-indigo-600" />
          </button>

          {/* Minimalist Student Pill */}
          <div className="flex items-center gap-2.5 pl-2 border-l border-zinc-200">
            <div className="w-8 h-8 rounded-full bg-zinc-900 text-white text-xs font-bold flex items-center justify-center shadow-xs">
              AM
            </div>
            <div className="hidden xl:block text-left">
              <div className="text-xs font-semibold text-zinc-900 leading-tight">Alex Morgan</div>
              <div className="text-[10px] text-zinc-500 font-medium">Verified Student</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
