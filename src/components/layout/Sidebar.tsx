import {
  GraduationCap,
  LayoutDashboard,
  BookOpen,
  FolderKanban,
  Bot,
  ShieldCheck,
  Calendar,
  Settings,
  X,
  Flame
} from 'lucide-react';
import type { TabId } from './Navbar';
import type { Branch, Year } from '../../data/mockData';
import { BRANCHES, YEARS } from '../../data/mockData';

interface SidebarProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  selectedBranch: Branch;
  selectedYear: Year;
  onBranchChange: (branch: Branch) => void;
  onYearChange: (year: Year) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({
  activeTab,
  onTabChange,
  selectedBranch,
  selectedYear,
  onBranchChange,
  onYearChange,
  isOpen,
  onClose,
}: SidebarProps) {
  const navItems = [
    {
      id: 'library' as TabId,
      label: 'Workspace & Notes',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'courses' as TabId,
      label: 'Course Modules',
      icon: BookOpen,
      badge: '6 Units',
    },
    {
      id: 'resources' as TabId,
      label: 'Resource Archive',
      icon: FolderKanban,
      badge: null,
    },
    {
      id: 'assistant' as TabId,
      label: 'AI Study Assistant',
      icon: Bot,
      badge: 'AI',
      badgeColor: 'bg-indigo-50 text-indigo-700 border border-indigo-200/60',
    },
    {
      id: 'admin' as TabId,
      label: 'Senior Moderation',
      icon: ShieldCheck,
      badge: 'Queue',
      badgeColor: 'bg-amber-50 text-amber-700 border border-amber-200/60',
    },
    {
      id: 'schedule' as TabId,
      label: 'Midterm Schedule',
      icon: Calendar,
      badge: null,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-zinc-900/30 backdrop-blur-xs lg:hidden animate-fade-in"
        />
      )}

      <aside
        className={`
          fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#FCFCFD] border-r border-black/[0.06]
          flex flex-col justify-between transition-transform duration-200 ease-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Top: Brand Header */}
        <div className="flex flex-col">
          <div className="h-16 px-6 flex items-center justify-between border-b border-black/[0.06]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-zinc-900 flex items-center justify-center text-white shadow-xs">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div>
                <span className="font-extrabold text-sm tracking-tight text-zinc-900 block leading-tight">
                  CampusHub
                </span>
                <span className="text-[10px] font-medium text-zinc-400 block -mt-0.5">
                  Academic Workspace
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Section */}
          <div className="p-3 space-y-1">
            <div className="px-3 py-1.5 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
              Navigation
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.id === 'library' || item.id === 'assistant' || item.id === 'admin') {
                      onTabChange(item.id);
                      onClose();
                    }
                  }}
                  className={`
                    w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium
                    transition-all duration-150 cursor-pointer
                    ${
                      isActive
                        ? 'bg-zinc-900 text-white shadow-2xs font-semibold'
                        : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/80'
                    }
                  `}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-zinc-500'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`
                        px-2 py-0.5 rounded-md text-[10px] font-semibold
                        ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : item.badgeColor || 'bg-zinc-100 text-zinc-600'
                        }
                      `}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Firebase Real-time Status Badge */}
          <div className="px-4 py-2 mx-3 mt-2 rounded-xl bg-emerald-50/70 border border-emerald-200/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-semibold text-emerald-900">Firebase Live Sync</span>
            </div>
            <Flame className="w-3.5 h-3.5 text-amber-600" />
          </div>
        </div>

        {/* Bottom: Student Profile & Cohort Selector */}
        <div className="p-3 border-t border-black/[0.06] space-y-2">
          <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200/60 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">
                Current Cohort
              </span>
              <span className="text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
                Active
              </span>
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              <select
                value={selectedBranch}
                onChange={(e) => onBranchChange(e.target.value as Branch)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-zinc-200 text-xs font-semibold text-zinc-800 cursor-pointer focus:outline-none focus:border-zinc-400"
              >
                {BRANCHES.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>

              <select
                value={selectedYear}
                onChange={(e) => onYearChange(e.target.value as Year)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-zinc-200 text-xs font-semibold text-zinc-800 cursor-pointer focus:outline-none focus:border-zinc-400"
              >
                {YEARS.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between px-2 py-1 text-xs text-zinc-500">
            <span className="flex items-center gap-1 text-[11px] font-medium">
              <Settings className="w-3.5 h-3.5" /> CampusHub v2.4
            </span>
            <span className="text-[10px] font-mono text-zinc-400">Spring '25</span>
          </div>
        </div>
      </aside>
    </>
  );
}
