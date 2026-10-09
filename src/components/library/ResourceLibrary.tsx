import { useState, useMemo, useEffect } from 'react';
import {
  Timer,
  Zap,
  Star,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Plus,
  ThumbsUp,
  FileText,
  Eye,
  Check,
  X,
  Layers,
  Cpu,
  Database,
  Calculator,
  Code2
} from 'lucide-react';
import type { Resource, Branch, Year } from '../../data/mockData';
import { SUBJECTS } from '../../data/mockData';
import UploadModal from './UploadModal';
import DocumentPreviewModal from './DocumentPreviewModal';
import {
  fetchTasks,
  createTask as apiCreateTask,
  toggleTask as apiToggleTask,
  type TaskItem
} from '../../services/api';

interface ResourceLibraryProps {
  resources: Resource[];
  selectedBranch: Branch;
  selectedYear: Year;
  onUpvote: (id: string) => void;
  onAddResource: (resource: Resource) => void;
  searchQuery: string;
}

export default function ResourceLibrary({
  resources,
  selectedBranch,
  selectedYear,
  onUpvote,
  onAddResource,
  searchQuery,
}: ResourceLibraryProps) {
  const [activeSubjectFilter, setActiveSubjectFilter] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedResourceForPreview, setSelectedResourceForPreview] = useState<Resource | null>(null);

  // Homework Tasks state synced with Firebase & local
  const [tasks, setTasks] = useState<TaskItem[]>([
    {
      id: 'task1',
      title: 'DSA Lab 4: AVL Trees Rebalance',
      subject: 'Data Structures',
      dueText: 'Today',
      tag: 'C++ • Test bench validation',
      completed: false,
      createdAt: '2026-05-14',
    },
    {
      id: 'task2',
      title: 'OS Process Scheduling Sim',
      subject: 'Operating Systems',
      dueText: '2 days',
      tag: 'Round-Robin & Priority Queues',
      completed: false,
      createdAt: '2026-05-14',
    },
    {
      id: 'task3',
      title: 'SQL BCNF & 4NF Normalization',
      subject: 'DBMS',
      dueText: 'May 21',
      tag: 'Online Assessment • 20 mins',
      completed: false,
      createdAt: '2026-05-14',
    },
  ]);

  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskSubject, setNewTaskSubject] = useState(SUBJECTS[selectedBranch]?.[0] || 'Core Course');
  const [newTaskDue, setNewTaskDue] = useState('Tomorrow');
  const [newTaskTag, setNewTaskTag] = useState('Assignment review');
  const [taskSubmitting, setTaskSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;
    fetchTasks().then((serverTasks) => {
      if (isMounted && serverTasks && serverTasks.length > 0) {
        setTasks(serverTasks);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleToggleTask = async (taskId: string, currentCompleted: boolean) => {
    // Optimistic toggle
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    );
    try {
      await apiToggleTask(taskId, currentCompleted);
    } catch (err) {
      console.warn('Task toggle fallback:', err);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || taskSubmitting) return;

    setTaskSubmitting(true);
    const newTaskPayload = {
      title: newTaskTitle.trim(),
      subject: newTaskSubject,
      dueText: newTaskDue.trim() || 'This week',
      tag: newTaskTag.trim() || 'Homework',
    };

    try {
      const created = await apiCreateTask(newTaskPayload);
      if (created) {
        setTasks((prev) => [created, ...prev]);
      }
      setShowNewTaskModal(false);
      setNewTaskTitle('');
    } catch (err) {
      const fallbackItem: TaskItem = {
        id: `t-${Date.now()}`,
        ...newTaskPayload,
        completed: false,
        createdAt: new Date().toISOString(),
      };
      setTasks((prev) => [fallbackItem, ...prev]);
      setShowNewTaskModal(false);
      setNewTaskTitle('');
    } finally {
      setTaskSubmitting(false);
    }
  };

  const subjects = SUBJECTS[selectedBranch] ?? [];

  // Filter resources based on branch, year, subject, and search query
  const filteredResources = useMemo(() => {
    return resources.filter((r) => {
      if (r.status !== 'approved') return false;
      if (r.branch !== selectedBranch) return false;
      if (r.year !== selectedYear) return false;
      if (activeSubjectFilter && r.subject !== activeSubjectFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          r.title.toLowerCase().includes(q) ||
          r.subject.toLowerCase().includes(q) ||
          r.uploadedBy.toLowerCase().includes(q) ||
          r.summary.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [resources, selectedBranch, selectedYear, activeSubjectFilter, searchQuery]);

  const getSubjectIcon = (subject: string) => {
    const s = subject.toLowerCase();
    if (s.includes('data') || s.includes('structure') || s.includes('algorithm')) {
      return <Layers className="w-4 h-4 text-zinc-800" />;
    }
    if (s.includes('os') || s.includes('operating') || s.includes('network') || s.includes('cpu')) {
      return <Cpu className="w-4 h-4 text-zinc-800" />;
    }
    if (s.includes('dbms') || s.includes('database') || s.includes('sql')) {
      return <Database className="w-4 h-4 text-zinc-800" />;
    }
    if (s.includes('math') || s.includes('logic') || s.includes('discrete')) {
      return <Calculator className="w-4 h-4 text-zinc-800" />;
    }
    return <Code2 className="w-4 h-4 text-zinc-800" />;
  };

  return (
    <div className="w-full flex flex-col gap-6 animate-fade-in">
      
      {/* ── Top Bento Banner & Quick Metrics ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        
        {/* Welcome Banner Tile (8 Cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-7 border border-zinc-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-700 text-[11px] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Spring Semester • Week 9
              </span>
              <span className="text-zinc-400 text-xs font-medium">
                • {selectedBranch} ({selectedYear})
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900">
              Welcome back, Alex
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 mt-1">
              You have completed <strong>4 of 6</strong> study milestones this week. Review today's lecture notes below.
            </p>
          </div>

          <div className="mt-5 pt-4 border-t border-zinc-100 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 w-full max-w-xs">
              <div className="w-full h-1.5 rounded-full bg-zinc-100 overflow-hidden">
                <div className="h-full rounded-full bg-zinc-900" style={{ width: '68%' }} />
              </div>
              <span className="font-semibold text-zinc-700 text-[11px] shrink-0">68% Term Goal</span>
            </div>
            <span className="hidden sm:inline text-zinc-400 text-[11px] font-medium">Exam Week in 18 days</span>
          </div>
        </div>

        {/* 3 Metrics Bento Column (4 Cols) */}
        <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3">
          
          <div className="bg-white p-4 rounded-2xl border border-zinc-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-800">
                <Timer className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Study Velocity</div>
                <div className="text-sm font-bold text-zinc-900">28.4 hrs / wk</div>
              </div>
            </div>
            <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
              +14%
            </span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-zinc-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-800">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Daily Streak</div>
                <div className="text-sm font-bold text-zinc-900">12 Days Active</div>
              </div>
            </div>
            <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
              Streak
            </span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-zinc-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-800">
                <Star className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Cumulative GPA</div>
                <div className="text-sm font-bold text-zinc-900">3.92 / 4.00</div>
              </div>
            </div>
            <span className="text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
              Top 5%
            </span>
          </div>
        </div>
      </div>

      {/* ── Primary Bento Workspace Grid (8 Cols Left / 4 Cols Right) ── */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        
        {/* ═══════════════════════════════════════════════════════ */}
        {/* LEFT COLUMN: Featured Tracks & Resource Library (8 Cols)*/}
        {/* ═══════════════════════════════════════════════════════ */}
        <div className="xl:col-span-8 flex flex-col gap-6">
          
          {/* SECTION 1: Featured Academic Study Tracks */}
          <section className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-zinc-900">Featured Study Tracks</h2>
                <span className="px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-600 text-[11px] font-semibold">
                  3 Tracks
                </span>
              </div>
            </div>

            {/* 3 Minimalist Notion Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              
              {/* Track 1 */}
              <div
                onClick={() => setActiveSubjectFilter('Data Structures')}
                className="group bg-white rounded-2xl p-5 border border-zinc-200/80 hover:border-zinc-300 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-9 h-9 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-900">
                      <Layers className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-semibold text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded">
                      Core Track
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-zinc-900 group-hover:text-indigo-600 transition-colors">
                    Data Structures
                  </h3>
                  <p className="text-xs text-zinc-500 mt-1">Trees, Graphs & Asymptotic Bounds</p>
                </div>
                <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-500">
                  <span className="font-medium">12 Modules</span>
                  <ArrowRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-900 group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>

              {/* Track 2 */}
              <div
                onClick={() => setActiveSubjectFilter('Operating Systems')}
                className="group bg-white rounded-2xl p-5 border border-zinc-200/80 hover:border-zinc-300 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-9 h-9 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-900">
                      <Cpu className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-semibold text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded">
                      Systems
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-zinc-900 group-hover:text-indigo-600 transition-colors">
                    Operating Systems
                  </h3>
                  <p className="text-xs text-zinc-500 mt-1">Process Scheduling & Memory Sync</p>
                </div>
                <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-500">
                  <span className="font-medium">16 Modules</span>
                  <ArrowRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-900 group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>

              {/* Track 3 */}
              <div
                onClick={() => setActiveSubjectFilter('DBMS')}
                className="group bg-white rounded-2xl p-5 border border-zinc-200/80 hover:border-zinc-300 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-9 h-9 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-900">
                      <Database className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-semibold text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded">
                      Database
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-zinc-900 group-hover:text-indigo-600 transition-colors">
                    Database Systems
                  </h3>
                  <p className="text-xs text-zinc-500 mt-1">BCNF Normalization & SQL Queries</p>
                </div>
                <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-500">
                  <span className="font-medium">10 Modules</span>
                  <ArrowRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-900 group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 2: Course Notes & Resource Archive Table */}
          <section className="flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-zinc-900">
                  Course Notes & Resource Archive
                </h2>
                <p className="text-xs text-zinc-500">
                  Showing verified materials for <strong className="text-zinc-800">{selectedBranch}</strong> • {selectedYear}
                </p>
              </div>

              {/* Upload Resource Button */}
              <button
                onClick={() => setShowUploadModal(true)}
                className="
                  px-4 py-2 rounded-full bg-zinc-900 text-white font-semibold text-xs
                  hover:bg-zinc-800 active:scale-98 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs self-start sm:self-auto
                "
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Upload Resource</span>
              </button>
            </div>

            {/* Subject Filter Pills */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                onClick={() => setActiveSubjectFilter(null)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  activeSubjectFilter === null
                    ? 'bg-zinc-900 text-white shadow-xs'
                    : 'bg-white text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 border border-zinc-200/80'
                }`}
              >
                All Subjects ({filteredResources.length})
              </button>
              {subjects.map((sub) => (
                <button
                  key={sub}
                  type="button"
                  onClick={() => setActiveSubjectFilter(activeSubjectFilter === sub ? null : sub)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    activeSubjectFilter === sub
                      ? 'bg-zinc-900 text-white shadow-xs'
                      : 'bg-white text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 border border-zinc-200/80'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>

            {/* Minimalist List of Notes */}
            <div className="bg-white rounded-3xl p-4 sm:p-5 border border-zinc-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col gap-2.5">
              {filteredResources.length > 0 ? (
                filteredResources.map((resource) => (
                  <div
                    key={resource.id}
                    onClick={() => setSelectedResourceForPreview(resource)}
                    className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-2xl bg-white hover:bg-zinc-50 border border-zinc-200/60 hover:border-zinc-300 transition-all gap-4 cursor-pointer group"
                  >
                    {/* Left: Icon, Title & Author */}
                    <div className="flex items-center gap-3.5 min-w-0 md:w-5/12">
                      <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center shrink-0 text-zinc-800 group-hover:bg-zinc-200 transition-colors">
                        {getSubjectIcon(resource.subject)}
                      </div>
                      <div className="truncate">
                        <h3 className="font-bold text-xs sm:text-sm text-zinc-900 truncate group-hover:text-indigo-600 transition-colors flex items-center gap-1.5">
                          {resource.title}
                          <Eye className="w-3.5 h-3.5 text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                        </h3>
                        <div className="text-[11px] text-zinc-500 flex items-center gap-2 mt-0.5">
                          <span>By {resource.uploadedBy}</span>
                          <span>•</span>
                          <span className="text-amber-600 font-semibold flex items-center gap-0.5">
                            <Star className="w-3 h-3 fill-current" /> 4.9
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Subject Pill, Upvotes, Preview */}
                    <div
                      className="flex items-center gap-3 sm:gap-5 justify-between md:justify-end md:w-7/12 flex-wrap"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span className="px-2.5 py-1 rounded-md bg-zinc-100 text-zinc-700 text-[11px] font-semibold shrink-0">
                        {resource.subject}
                      </span>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => onUpvote(resource.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold transition-all cursor-pointer"
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                          <span>{resource.upvotes}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setSelectedResourceForPreview(resource)}
                          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold transition-all cursor-pointer shadow-2xs"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Read Note</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 flex flex-col items-center justify-center text-center">
                  <div className="w-12 h-12 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-500 mb-2">
                    <FileText className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-sm text-zinc-900">No resources found</h4>
                  <p className="text-xs text-zinc-500 max-w-xs mt-1 mb-3">
                    No notes matching your query for {selectedBranch} ({selectedYear}).
                  </p>
                  <button
                    onClick={() => setShowUploadModal(true)}
                    className="px-4 py-2 rounded-full bg-zinc-900 text-white font-semibold text-xs hover:bg-zinc-800 transition-all cursor-pointer"
                  >
                    + Upload Notes
                  </button>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* ═══════════════════════════════════════════════════════ */}
        {/* RIGHT CONTEXT RAIL: Calendar & Homework Tasks (4 Cols) */}
        {/* ═══════════════════════════════════════════════════════ */}
        <div className="xl:col-span-4 flex flex-col gap-6">
          
          {/* WIDGET 1: Apple-Style Minimalist Calendar */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-zinc-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-zinc-900">May 2025</h3>
                <p className="text-[11px] text-zinc-500">Midterms & Review Cycle</p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  className="w-7 h-7 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200 transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  className="w-7 h-7 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200 transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Days of Week */}
            <div className="grid grid-cols-7 text-center text-[11px] font-semibold text-zinc-400">
              <span>M</span>
              <span>T</span>
              <span>W</span>
              <span>T</span>
              <span>F</span>
              <span>S</span>
              <span>S</span>
            </div>

            {/* Dates Grid */}
            <div className="grid grid-cols-7 text-center gap-y-1.5 text-xs font-medium">
              <div className="h-7 w-7 mx-auto flex items-center justify-center text-zinc-300">28</div>
              <div className="h-7 w-7 mx-auto flex items-center justify-center text-zinc-300">29</div>
              <div className="h-7 w-7 mx-auto flex items-center justify-center text-zinc-300">30</div>
              <div className="h-7 w-7 mx-auto flex items-center justify-center text-zinc-800 hover:bg-zinc-100 rounded-full cursor-pointer">1</div>
              <div className="h-7 w-7 mx-auto flex items-center justify-center text-zinc-800 hover:bg-zinc-100 rounded-full cursor-pointer">2</div>
              <div className="h-7 w-7 mx-auto flex items-center justify-center text-zinc-800 hover:bg-zinc-100 rounded-full cursor-pointer">3</div>
              <div className="h-7 w-7 mx-auto flex items-center justify-center text-zinc-800 hover:bg-zinc-100 rounded-full cursor-pointer">4</div>
              
              <div className="h-7 w-7 mx-auto flex items-center justify-center text-zinc-800 hover:bg-zinc-100 rounded-full cursor-pointer">5</div>
              <div className="h-7 w-7 mx-auto flex items-center justify-center text-zinc-800 hover:bg-zinc-100 rounded-full cursor-pointer">6</div>
              <div className="relative h-7 w-7 mx-auto flex flex-col items-center justify-center text-zinc-800 hover:bg-zinc-100 rounded-full cursor-pointer">
                <span>7</span>
                <span className="w-1 h-1 rounded-full bg-amber-500 -mt-0.5" />
              </div>
              <div className="h-7 w-7 mx-auto flex items-center justify-center text-zinc-800 hover:bg-zinc-100 rounded-full cursor-pointer">8</div>
              <div className="h-7 w-7 mx-auto flex items-center justify-center text-zinc-800 hover:bg-zinc-100 rounded-full cursor-pointer">9</div>
              <div className="h-7 w-7 mx-auto flex items-center justify-center text-zinc-800 hover:bg-zinc-100 rounded-full cursor-pointer">10</div>
              <div className="h-7 w-7 mx-auto flex items-center justify-center text-zinc-800 hover:bg-zinc-100 rounded-full cursor-pointer">11</div>
              
              <div className="h-7 w-7 mx-auto flex items-center justify-center text-zinc-800 hover:bg-zinc-100 rounded-full cursor-pointer">12</div>
              <div className="h-7 w-7 mx-auto flex items-center justify-center text-zinc-800 hover:bg-zinc-100 rounded-full cursor-pointer">13</div>
              {/* Active Day */}
              <div className="relative h-7 w-7 mx-auto flex flex-col items-center justify-center rounded-full bg-zinc-900 text-white font-bold shadow-xs">
                <span>14</span>
              </div>
              <div className="h-7 w-7 mx-auto flex items-center justify-center text-zinc-800 hover:bg-zinc-100 rounded-full cursor-pointer">15</div>
              <div className="relative h-7 w-7 mx-auto flex flex-col items-center justify-center text-zinc-800 hover:bg-zinc-100 rounded-full cursor-pointer">
                <span>16</span>
                <span className="w-1 h-1 rounded-full bg-indigo-500 -mt-0.5" />
              </div>
              <div className="h-7 w-7 mx-auto flex items-center justify-center text-zinc-800 hover:bg-zinc-100 rounded-full cursor-pointer">17</div>
              <div className="h-7 w-7 mx-auto flex items-center justify-center text-zinc-800 hover:bg-zinc-100 rounded-full cursor-pointer">18</div>
              
              <div className="h-7 w-7 mx-auto flex items-center justify-center text-zinc-800 hover:bg-zinc-100 rounded-full cursor-pointer">19</div>
              <div className="h-7 w-7 mx-auto flex items-center justify-center text-zinc-800 hover:bg-zinc-100 rounded-full cursor-pointer">20</div>
              <div className="h-7 w-7 mx-auto flex items-center justify-center text-zinc-800 hover:bg-zinc-100 rounded-full cursor-pointer">21</div>
              <div className="relative h-7 w-7 mx-auto flex flex-col items-center justify-center text-zinc-800 hover:bg-zinc-100 rounded-full cursor-pointer">
                <span>22</span>
                <span className="w-1 h-1 rounded-full bg-amber-500 -mt-0.5" />
              </div>
              <div className="h-7 w-7 mx-auto flex items-center justify-center text-zinc-800 hover:bg-zinc-100 rounded-full cursor-pointer">23</div>
              <div className="h-7 w-7 mx-auto flex items-center justify-center text-zinc-800 hover:bg-zinc-100 rounded-full cursor-pointer">24</div>
              <div className="h-7 w-7 mx-auto flex items-center justify-center text-zinc-800 hover:bg-zinc-100 rounded-full cursor-pointer">25</div>
            </div>

            {/* Legend */}
            <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-[11px] font-medium text-zinc-500">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                <span>Assignment Due</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                <span>Live Lecture</span>
              </div>
            </div>
          </div>

          {/* WIDGET 2: Notion-Style Homework Tasks */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-zinc-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-zinc-900">Homework & Labs</h3>
                <p className="text-[11px] text-zinc-500">Synced with Firebase</p>
              </div>
              <span className="text-[10px] font-semibold text-zinc-600 bg-zinc-100 px-2 py-0.5 rounded">
                {tasks.filter((t) => t.completed).length}/{tasks.length} Done
              </span>
            </div>

            {/* Tasks List */}
            <div className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-1">
              {tasks.length > 0 ? (
                tasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => handleToggleTask(task.id, task.completed)}
                    className="p-3 rounded-2xl bg-zinc-50 hover:bg-zinc-100/80 border border-zinc-200/60 transition-all flex items-start gap-2.5 cursor-pointer group"
                  >
                    <div
                      className={`w-4.5 h-4.5 mt-0.5 rounded-md flex items-center justify-center transition-all ${
                        task.completed
                          ? 'bg-zinc-900 text-white'
                          : 'bg-white border border-zinc-300 group-hover:border-zinc-500'
                      }`}
                    >
                      {task.completed && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className={`text-xs font-semibold truncate ${task.completed ? 'line-through text-zinc-400' : 'text-zinc-900'}`}>
                          {task.title}
                        </h4>
                        <span className="text-[10px] font-semibold text-zinc-500 bg-white px-1.5 py-0.5 rounded border border-zinc-200 shrink-0">
                          {task.dueText}
                        </span>
                      </div>
                      <div className="text-[11px] text-zinc-500 mt-0.5 truncate">
                        {task.tag}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-xs text-zinc-400">No active homework tasks</div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setShowNewTaskModal(true)}
              className="w-full py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Task</span>
            </button>
          </div>

          {/* WIDGET 3: Office Hours Tile */}
          <div className="bg-white rounded-3xl p-5 border border-zinc-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-white font-bold text-xs">
                  LW
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
              </div>
              <div>
                <div className="text-xs font-bold text-zinc-900">Prof. Linda Wright</div>
                <div className="text-[11px] text-zinc-500">Office Hours • Online</div>
              </div>
            </div>
            <button
              type="button"
              className="px-3 py-1.5 rounded-full bg-zinc-100 hover:bg-zinc-900 hover:text-white transition-all text-xs font-semibold text-zinc-800 cursor-pointer"
            >
              Join Room
            </button>
          </div>
        </div>
      </div>

      {/* ── Create Custom Task Modal ── */}
      {showNewTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-zinc-200 shadow-2xl flex flex-col gap-4 animate-slide-up">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-zinc-900">Create Homework Task</h3>
              <button
                type="button"
                onClick={() => setShowNewTaskModal(false)}
                className="text-zinc-400 hover:text-zinc-700 p-1 rounded-full hover:bg-zinc-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="flex flex-col gap-3">
              <div>
                <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wide block mb-1">
                  Task Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chapter 4 Practice Problems"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-medium text-zinc-900 focus:outline-none focus:border-zinc-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wide block mb-1">
                    Subject
                  </label>
                  <select
                    value={newTaskSubject}
                    onChange={(e) => setNewTaskSubject(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-medium text-zinc-900 focus:outline-none focus:border-zinc-400"
                  >
                    {subjects.map((sub) => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wide block mb-1">
                    Due Text
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Tomorrow, May 18"
                    value={newTaskDue}
                    onChange={(e) => setNewTaskDue(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-medium text-zinc-900 focus:outline-none focus:border-zinc-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wide block mb-1">
                  Tag / Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. Online Assessment • 30 mins"
                  value={newTaskTag}
                  onChange={(e) => setNewTaskTag(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-medium text-zinc-900 focus:outline-none focus:border-zinc-400"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewTaskModal(false)}
                  className="px-4 py-2 rounded-full bg-zinc-100 text-zinc-600 text-xs font-semibold hover:bg-zinc-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={taskSubmitting}
                  className="px-5 py-2 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold transition-all shadow-xs cursor-pointer"
                >
                  {taskSubmitting ? 'Saving...' : 'Add Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Document / PDF Preview Modal Dialog ── */}
      {selectedResourceForPreview && (
        <DocumentPreviewModal
          resource={selectedResourceForPreview}
          onClose={() => setSelectedResourceForPreview(null)}
          onUpvote={onUpvote}
        />
      )}

      {/* ── Upload Modal Dialog ── */}
      {showUploadModal && (
        <UploadModal
          selectedBranch={selectedBranch}
          selectedYear={selectedYear}
          onClose={() => setShowUploadModal(false)}
          onSubmit={onAddResource}
        />
      )}
    </div>
  );
}
