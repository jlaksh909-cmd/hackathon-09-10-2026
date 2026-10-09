/// <reference path="./react-env.d.ts" />
import React, { useState, useMemo } from 'react';
import {
  Resource,
  INITIAL_RESOURCES,
  Branch,
  Year,
  BRANCH_OPTIONS,
  YEAR_OPTIONS,
} from '../../data/mockData';

// Branch color scheme helper
const getBranchBadgeColor = (branch: Branch): string => {
  switch (branch) {
    case 'CSE':
      return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
    case 'ECE':
      return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
    case 'MECH':
      return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    case 'CIVIL':
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    default:
      return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
  }
};

interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

export const AdminDashboard: React.FC = () => {
  const [resources, setResources] = useState<Resource[]>(INITIAL_RESOURCES);
  const [activeTab, setActiveTab] = useState<'queue' | 'library' | 'rejected'>('queue');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState<Branch | 'ALL'>('ALL');
  const [selectedYear, setSelectedYear] = useState<Year | 'ALL'>('ALL');
  const [previewResource, setPreviewResource] = useState<Resource | null>(null);
  const [flaggedIds, setFlaggedIds] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('cards');
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  // Toast notification helper
  const addToast = (type: ToastNotification['type'], message: string) => {
    const id = Date.now().toString() + Math.random().toString();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Moderation Actions
  const handleApprove = (id: string, title?: string) => {
    setResources((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'approved' } : item))
    );
    if (previewResource?.id === id) {
      setPreviewResource((prev) => (prev ? { ...prev, status: 'approved' } : null));
    }
    addToast('success', `Approved: "${title || 'Resource'}" is now live in the library.`);
  };

  const handleReject = (id: string, title?: string) => {
    setResources((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'rejected' } : item))
    );
    if (previewResource?.id === id) {
      setPreviewResource((prev) => (prev ? { ...prev, status: 'rejected' } : null));
    }
    addToast('error', `Rejected: "${title || 'Resource'}" moved to archive.`);
  };

  const handleToggleFlag = (id: string, title: string) => {
    const isCurrentlyFlagged = flaggedIds.has(id);
    setFlaggedIds((prev) => {
      const next = new Set<string>();
      prev.forEach((val) => {
        if (val !== id) {
          next.add(val);
        }
      });
      if (!isCurrentlyFlagged) {
        next.add(id);
      }
      return next;
    });

    if (isCurrentlyFlagged) {
      addToast('info', `Unflagged: "${title}"`);
    } else {
      addToast('warning', `Flagged for academic review: "${title}"`);
    }
  };

  const handleRemoveApproved = (id: string, title: string) => {
    setResources((prev) => prev.filter((item) => item.id !== id));
    if (previewResource?.id === id) {
      setPreviewResource(null);
    }
    addToast('info', `Removed "${title}" from the repository.`);
  };

  const handleSendBackToQueue = (id: string, title: string) => {
    setResources((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'pending' } : item))
    );
    if (previewResource?.id === id) {
      setPreviewResource((prev) => (prev ? { ...prev, status: 'pending' } : null));
    }
    addToast('info', `Moved "${title}" back to Moderation Queue.`);
  };

  const handleResetData = () => {
    setResources(INITIAL_RESOURCES);
    setFlaggedIds(new Set());
    addToast('info', 'Reset all resources to initial mock data.');
  };

  // Stats calculation
  const stats = useMemo(() => {
    const total = resources.length;
    const pending = resources.filter((r) => r.status === 'pending').length;
    const approved = resources.filter((r) => r.status === 'approved').length;
    const rejected = resources.filter((r) => r.status === 'rejected').length;
    const totalUpvotes = resources.reduce((acc, curr) => acc + (curr.upvotes || 0), 0);
    return { total, pending, approved, rejected, totalUpvotes };
  }, [resources]);

  // Filtering
  const filteredResources = useMemo(() => {
    return resources.filter((res) => {
      // Tab status match
      if (activeTab === 'queue' && res.status !== 'pending') return false;
      if (activeTab === 'library' && res.status !== 'approved') return false;
      if (activeTab === 'rejected' && res.status !== 'rejected') return false;

      // Branch filter
      if (selectedBranch !== 'ALL' && res.branch !== selectedBranch) return false;

      // Year filter
      if (selectedYear !== 'ALL' && res.year !== selectedYear) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = res.title.toLowerCase().indexOf(q) !== -1;
        const matchSubject = res.subject.toLowerCase().indexOf(q) !== -1;
        const matchUploader = res.uploadedBy.toLowerCase().indexOf(q) !== -1;
        const matchSummary = res.summary.toLowerCase().indexOf(q) !== -1;
        return matchTitle || matchSubject || matchUploader || matchSummary;
      }

      return true;
    });
  }, [resources, activeTab, selectedBranch, selectedYear, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4 sm:p-6 lg:p-8 selection:bg-indigo-500 selection:text-white">
      {/* Toast Notification Container */}
      <div className="fixed top-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-xl backdrop-blur-md transition-all duration-300 animate-in fade-in slide-in-from-top-4 ${
              toast.type === 'success'
                ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-200'
                : toast.type === 'error'
                ? 'bg-rose-950/90 border-rose-500/40 text-rose-200'
                : toast.type === 'warning'
                ? 'bg-amber-950/90 border-amber-500/40 text-amber-200'
                : 'bg-slate-900/90 border-slate-700 text-slate-200'
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {toast.type === 'success' && (
                <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
              {toast.type === 'error' && (
                <svg className="w-5 h-5 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
              {toast.type === 'warning' && (
                <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              )}
              {toast.type === 'info' && (
                <svg className="w-5 h-5 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>
            <p className="text-sm font-medium flex-1 leading-snug">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white transition-colors"
              aria-label="Dismiss notification"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Header Banner */}
        <header className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/70 to-slate-900 border border-indigo-500/20 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 -mb-16 w-72 h-72 rounded-full bg-violet-600/10 blur-3xl pointer-events-none" />

          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold tracking-wider uppercase border border-indigo-500/30">
                  <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                  CampusHub Senior Portal
                </div>
                <span className="text-xs text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-full border border-slate-700/60">
                  Academic Year 2025–26
                </span>
                <span className="text-xs font-medium text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full">
                  🛡️ Faculty / Senior Mod Access
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
                Resource Moderation Dashboard
              </h1>
              <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
                Review, verify syllabus compliance, and manage crowdsourced academic study material,
                handwritten notes, question banks, and lab guides.
              </p>
            </div>

            <div className="flex items-center gap-3 self-start md:self-center">
              <button
                onClick={handleResetData}
                title="Reset mock data to default"
                className="flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-medium rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700 transition-all duration-200 active:scale-95 shadow-sm"
              >
                <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Reset Demo
              </button>
            </div>
          </div>
        </header>

        {/* Section 1: Header Stats Summary */}
        <section aria-label="Key Statistics" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {/* Stat 1: Total Resources */}
          <div className="bg-slate-900/80 rounded-2xl p-5 border border-slate-800 shadow-lg hover:border-slate-700 transition-all flex items-center justify-between group">
            <div className="space-y-1">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Resources</p>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">{stats.total}</h3>
              <p className="text-xs text-slate-500">Across 4 Engineering Branches</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
          </div>

          {/* Stat 2: Pending Approval Count */}
          <div
            onClick={() => setActiveTab('queue')}
            className={`cursor-pointer bg-slate-900/80 rounded-2xl p-5 border shadow-lg transition-all flex items-center justify-between group ${
              stats.pending > 0
                ? 'border-amber-500/40 bg-gradient-to-br from-slate-900 to-amber-950/20 hover:border-amber-400'
                : 'border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <p className="text-xs font-medium text-amber-400 uppercase tracking-wider">Pending Approval</p>
                {stats.pending > 0 && (
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
                  </span>
                )}
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-amber-300">{stats.pending}</h3>
              <p className="text-xs text-amber-400/70">
                {stats.pending === 0 ? 'All caught up! Queue clear' : 'Awaiting peer verification'}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

          {/* Stat 3: Approved Resources */}
          <div
            onClick={() => setActiveTab('library')}
            className="cursor-pointer bg-slate-900/80 rounded-2xl p-5 border border-slate-800 shadow-lg hover:border-emerald-500/40 transition-all flex items-center justify-between group"
          >
            <div className="space-y-1">
              <p className="text-xs font-medium text-emerald-400 uppercase tracking-wider">Live in Library</p>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-emerald-300">{stats.approved}</h3>
              <p className="text-xs text-slate-500">Verified & accessible to students</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

          {/* Stat 4: Total Upvotes */}
          <div className="bg-slate-900/80 rounded-2xl p-5 border border-slate-800 shadow-lg hover:border-slate-700 transition-all flex items-center justify-between group">
            <div className="space-y-1">
              <p className="text-xs font-medium text-violet-400 uppercase tracking-wider">Total Community Upvotes</p>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-violet-300">{stats.totalUpvotes}</h3>
              <p className="text-xs text-slate-500">Peer credibility score</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/30 text-violet-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
              </svg>
            </div>
          </div>
        </section>

        {/* Controls: Search, Filters & View Options */}
        <section aria-label="Filters and Search" className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-lg space-y-4">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            {/* Search Bar */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e: any) => setSearchQuery(e.target.value)}
                placeholder="Search resources by title, subject, uploader, or keywords..."
                className="w-full pl-10 pr-10 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white"
                  title="Clear search"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Filter Dropdowns & View Mode */}
            <div className="flex items-center gap-3 flex-wrap">
              {/* Branch Filter */}
              <div className="flex items-center gap-2">
                <label htmlFor="branch-filter" className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Branch:
                </label>
                <select
                  id="branch-filter"
                  value={selectedBranch}
                  onChange={(e: any) => setSelectedBranch(e.target.value as Branch | 'ALL')}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
                >
                  <option value="ALL">All Branches</option>
                  {BRANCH_OPTIONS.map((branch) => (
                    <option key={branch} value={branch}>
                      {branch}
                    </option>
                  ))}
                </select>
              </div>

              {/* Year Filter */}
              <div className="flex items-center gap-2">
                <label htmlFor="year-filter" className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Year:
                </label>
                <select
                  id="year-filter"
                  value={selectedYear}
                  onChange={(e: any) => setSelectedYear(e.target.value as Year | 'ALL')}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
                >
                  <option value="ALL">All Years</option>
                  {YEAR_OPTIONS.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              {/* View Layout Toggle */}
              <div className="flex items-center border border-slate-800 rounded-xl p-1 bg-slate-950/80">
                <button
                  onClick={() => setViewMode('cards')}
                  title="Card View"
                  className={`p-1.5 rounded-lg transition-colors ${
                    viewMode === 'cards'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  title="Table View"
                  className={`p-1.5 rounded-lg transition-colors ${
                    viewMode === 'table'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Quick branch pill buttons */}
          <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80 overflow-x-auto pb-1 text-xs">
            <span className="text-slate-400 font-medium shrink-0">Quick Branch:</span>
            {['ALL', ...BRANCH_OPTIONS].map((branch) => {
              const isSelected = selectedBranch === branch;
              return (
                <button
                  key={branch}
                  onClick={() => setSelectedBranch(branch as Branch | 'ALL')}
                  className={`px-3 py-1 rounded-lg font-medium transition-all shrink-0 ${
                    isSelected
                      ? 'bg-indigo-500 text-white shadow-sm ring-1 ring-indigo-400'
                      : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/50'
                  }`}
                >
                  {branch === 'ALL' ? 'All Departments' : branch}
                </button>
              );
            })}
          </div>
        </section>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
          {/* Moderation Queue Tab */}
          <button
            onClick={() => setActiveTab('queue')}
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all whitespace-nowrap ${
              activeTab === 'queue'
                ? 'bg-amber-500/15 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
            }`}
          >
            <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Moderation Queue</span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                stats.pending > 0
                  ? 'bg-amber-500 text-slate-950 font-black'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {stats.pending}
            </span>
          </button>

          {/* Managed Library Tab */}
          <button
            onClick={() => setActiveTab('library')}
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all whitespace-nowrap ${
              activeTab === 'library'
                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
            }`}
          >
            <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Managed Library</span>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-slate-800 text-emerald-400 border border-emerald-500/20">
              {stats.approved}
            </span>
          </button>

          {/* Rejected Archive Tab */}
          <button
            onClick={() => setActiveTab('rejected')}
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all whitespace-nowrap ${
              activeTab === 'rejected'
                ? 'bg-rose-500/15 text-rose-300 border border-rose-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
            }`}
          >
            <svg className="w-4 h-4 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
            <span>Rejected Archive</span>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-slate-800 text-rose-400 border border-rose-500/20">
              {stats.rejected}
            </span>
          </button>
        </div>

        {/* Content Section */}
        {filteredResources.length === 0 ? (
          /* Empty State */
          <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-12 text-center flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-400">
              {activeTab === 'queue' ? (
                <svg className="w-8 h-8 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              )}
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-200">
                {activeTab === 'queue'
                  ? 'All Pending Uploads Have Been Moderated!'
                  : 'No Matching Resources Found'}
              </h3>
              <p className="text-sm text-slate-400 max-w-md">
                {activeTab === 'queue'
                  ? 'Great job! The moderation queue is clear. New student submissions will appear here automatically.'
                  : 'Try adjusting your search criteria, clearing filters, or resetting the demo data.'}
              </p>
            </div>
            {(searchQuery || selectedBranch !== 'ALL' || selectedYear !== 'ALL') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedBranch('ALL');
                  setSelectedYear('ALL');
                }}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md"
              >
                Clear All Filters
              </button>
            )}
          </div>
        ) : viewMode === 'cards' ? (
          /* Cards Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredResources.map((item) => {
              const isFlagged = flaggedIds.has(item.id);

              return (
                <div
                  key={item.id}
                  className={`bg-slate-900/90 rounded-2xl border transition-all duration-200 hover:shadow-xl flex flex-col justify-between overflow-hidden relative group ${
                    item.status === 'pending'
                      ? 'border-amber-500/30 hover:border-amber-400/60'
                      : item.status === 'approved'
                      ? isFlagged
                        ? 'border-amber-500/50 bg-amber-950/10'
                        : 'border-slate-800 hover:border-slate-700'
                      : 'border-rose-900/40 bg-slate-950/40 opacity-75'
                  }`}
                >
                  {/* Card Header & Badges */}
                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`px-2.5 py-0.5 rounded-md text-xs font-bold border tracking-wider ${getBranchBadgeColor(
                            item.branch
                          )}`}
                        >
                          {item.branch}
                        </span>
                        <span className="text-xs font-medium text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-700/60">
                          {item.year}
                        </span>
                      </div>

                      {/* Status / Flag Pill */}
                      <div className="flex items-center gap-1.5">
                        {isFlagged && (
                          <span
                            title="Flagged for academic review"
                            className="px-2 py-0.5 text-xs font-semibold rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1"
                          >
                            🚩 Flagged
                          </span>
                        )}
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-semibold capitalize ${
                            item.status === 'pending'
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                              : item.status === 'approved'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                    </div>

                    {/* Subject & Title */}
                    <div>
                      <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-1">
                        {item.subject}
                      </p>
                      <h4
                        onClick={() => setPreviewResource(item)}
                        className="text-base font-bold text-white hover:text-indigo-300 cursor-pointer transition-colors leading-snug line-clamp-2"
                        title={item.title}
                      >
                        {item.title}
                      </h4>
                    </div>

                    {/* Summary snippet */}
                    <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                      {item.summary}
                    </p>

                    {/* Metadata Footer: Uploader, Upvotes, File link */}
                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                      <div className="flex items-center gap-2 truncate max-w-[65%]" title={`Uploaded by: ${item.uploadedBy}`}>
                        <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 font-bold text-[10px] shrink-0">
                          {item.uploadedBy.charAt(0)}
                        </div>
                        <span className="truncate">{item.uploadedBy}</span>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className="flex items-center gap-1 text-slate-300 font-medium" title="Upvotes">
                          <svg className="w-3.5 h-3.5 text-violet-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a2 2 0 00-.8 2.4z" />
                          </svg>
                          {item.upvotes}
                        </span>
                        <a
                          href={item.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-400 hover:text-indigo-300 transition-colors"
                          title="Open attached resource URL"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="p-3 bg-slate-950/60 border-t border-slate-800/80 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setPreviewResource(item)}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors flex items-center gap-1.5"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Inspect
                    </button>

                    {/* Pending Tab Actions */}
                    {item.status === 'pending' && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleReject(item.id, item.title)}
                          className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition-all flex items-center gap-1 active:scale-95"
                          title="Reject submission"
                        >
                          <svg className="w-3.5 h-3.5 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Reject
                        </button>
                        <button
                          onClick={() => handleApprove(item.id, item.title)}
                          className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-all flex items-center gap-1 active:scale-95"
                          title="Approve and publish to library"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Approve
                        </button>
                      </div>
                    )}

                    {/* Approved Tab Actions */}
                    {item.status === 'approved' && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleFlag(item.id, item.title)}
                          className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg border transition-all flex items-center gap-1 ${
                            isFlagged
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                              : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                          }`}
                          title="Flag or unflag resource for quality/syllabus review"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                          </svg>
                          {isFlagged ? 'Flagged' : 'Flag'}
                        </button>
                        <button
                          onClick={() => handleRemoveApproved(item.id, item.title)}
                          className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition-all flex items-center gap-1 active:scale-95"
                          title="Remove from public library"
                        >
                          <svg className="w-3.5 h-3.5 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Remove
                        </button>
                      </div>
                    )}

                    {/* Rejected Tab Actions */}
                    {item.status === 'rejected' && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleSendBackToQueue(item.id, item.title)}
                          className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 transition-all flex items-center gap-1"
                        >
                          Re-evaluate
                        </button>
                        <button
                          onClick={() => handleApprove(item.id, item.title)}
                          className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-all flex items-center gap-1"
                        >
                          Restore & Approve
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Table View */
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-950/80 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                  <tr>
                    <th scope="col" className="px-5 py-4">Resource & Subject</th>
                    <th scope="col" className="px-5 py-4">Dept / Year</th>
                    <th scope="col" className="px-5 py-4">Uploader</th>
                    <th scope="col" className="px-5 py-4">Summary</th>
                    <th scope="col" className="px-5 py-4 text-center">Upvotes</th>
                    <th scope="col" className="px-5 py-4 text-right">Moderation Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/70">
                  {filteredResources.map((item) => {
                    const isFlagged = flaggedIds.has(item.id);
                    return (
                      <tr
                        key={item.id}
                        className={`hover:bg-slate-800/40 transition-colors ${
                          isFlagged ? 'bg-amber-950/15' : ''
                        }`}
                      >
                        {/* Title and Subject */}
                        <td className="px-5 py-4 max-w-xs">
                          <p className="text-xs font-bold text-indigo-400 uppercase tracking-wide">
                            {item.subject}
                          </p>
                          <div
                            onClick={() => setPreviewResource(item)}
                            className="text-sm font-semibold text-white hover:text-indigo-300 cursor-pointer transition-colors leading-snug line-clamp-2"
                          >
                            {item.title}
                          </div>
                          <a
                            href={item.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-indigo-300 mt-1"
                          >
                            <span>Open Attachment</span>
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        </td>

                        {/* Dept and Year */}
                        <td className="px-5 py-4 whitespace-nowrap">
                          <div className="flex flex-col gap-1 items-start">
                            <span
                              className={`px-2.5 py-0.5 rounded-md text-xs font-bold border tracking-wider ${getBranchBadgeColor(
                                item.branch
                              )}`}
                            >
                              {item.branch}
                            </span>
                            <span className="text-xs text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                              {item.year}
                            </span>
                          </div>
                        </td>

                        {/* Uploader */}
                        <td className="px-5 py-4 whitespace-nowrap">
                          <div className="text-xs font-medium text-slate-200">
                            {item.uploadedBy}
                          </div>
                        </td>

                        {/* Summary */}
                        <td className="px-5 py-4 max-w-sm">
                          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                            {item.summary}
                          </p>
                        </td>

                        {/* Upvotes */}
                        <td className="px-5 py-4 whitespace-nowrap text-center">
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-violet-300 bg-violet-950/40 border border-violet-800/40 px-2.5 py-1 rounded-full">
                            ▲ {item.upvotes}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4 whitespace-nowrap text-right">
                          <div className="inline-flex items-center gap-2">
                            {/* Inspect */}
                            <button
                              onClick={() => setPreviewResource(item)}
                              title="Inspect resource"
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </button>

                            {item.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleReject(item.id, item.title)}
                                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30"
                                >
                                  Reject
                                </button>
                                <button
                                  onClick={() => handleApprove(item.id, item.title)}
                                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white"
                                >
                                  Approve
                                </button>
                              </>
                            )}

                            {item.status === 'approved' && (
                              <>
                                <button
                                  onClick={() => handleToggleFlag(item.id, item.title)}
                                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                                    isFlagged
                                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                                  }`}
                                >
                                  {isFlagged ? 'Flagged' : 'Flag'}
                                </button>
                                <button
                                  onClick={() => handleRemoveApproved(item.id, item.title)}
                                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30"
                                >
                                  Remove
                                </button>
                              </>
                            )}

                            {item.status === 'rejected' && (
                              <button
                                onClick={() => handleApprove(item.id, item.title)}
                                className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white"
                              >
                                Restore
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal: Comprehensive Resource Inspection & Action */}
        {previewResource && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
              {/* Close Button */}
              <button
                onClick={() => setPreviewResource(null)}
                className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
                aria-label="Close modal"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`px-2.5 py-0.5 rounded-md text-xs font-bold border tracking-wider ${getBranchBadgeColor(
                      previewResource.branch
                    )}`}
                  >
                    {previewResource.branch}
                  </span>
                  <span className="text-xs text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md border border-slate-700">
                    {previewResource.year}
                  </span>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-semibold capitalize ${
                      previewResource.status === 'pending'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                        : previewResource.status === 'approved'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    Status: {previewResource.status}
                  </span>
                </div>

                <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                  {previewResource.subject}
                </p>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white leading-snug">
                  {previewResource.title}
                </h3>
              </div>

              {/* Resource Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950/60 p-4 rounded-xl border border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400 block mb-0.5">Uploaded By</span>
                  <span className="font-semibold text-slate-200">{previewResource.uploadedBy}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Community Upvotes</span>
                  <span className="font-semibold text-violet-300">▲ {previewResource.upvotes} upvotes</span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-slate-400 block mb-1">File Resource URL</span>
                  <a
                    href={previewResource.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-400 hover:text-indigo-300 break-all underline flex items-center gap-1.5"
                  >
                    <span>{previewResource.fileUrl}</span>
                    <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Summary Description */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Resource Summary & Academic Scope
                </h4>
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                  {previewResource.summary}
                </div>
              </div>

              {/* Modal Moderation Action Footer */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3 flex-wrap">
                <button
                  onClick={() => setPreviewResource(null)}
                  className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                >
                  Close
                </button>

                <div className="flex items-center gap-2">
                  {previewResource.status === 'pending' && (
                    <>
                      <button
                        onClick={() => {
                          handleReject(previewResource.id, previewResource.title);
                          setPreviewResource(null);
                        }}
                        className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/40 transition-all"
                      >
                        Reject Submission
                      </button>
                      <button
                        onClick={() => {
                          handleApprove(previewResource.id, previewResource.title);
                          setPreviewResource(null);
                        }}
                        className="px-5 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg transition-all"
                      >
                        Approve & Publish
                      </button>
                    </>
                  )}

                  {previewResource.status === 'approved' && (
                    <>
                      <button
                        onClick={() => handleToggleFlag(previewResource.id, previewResource.title)}
                        className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl border transition-all ${
                          flaggedIds.has(previewResource.id)
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                        }`}
                      >
                        {flaggedIds.has(previewResource.id) ? '🚩 Flagged' : 'Flag for Review'}
                      </button>
                      <button
                        onClick={() => {
                          handleRemoveApproved(previewResource.id, previewResource.title);
                          setPreviewResource(null);
                        }}
                        className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/40 transition-all"
                      >
                        Remove from Library
                      </button>
                    </>
                  )}

                  {previewResource.status === 'rejected' && (
                    <button
                      onClick={() => {
                        handleApprove(previewResource.id, previewResource.title);
                        setPreviewResource(null);
                      }}
                      className="px-5 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg transition-all"
                    >
                      Restore & Approve
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
