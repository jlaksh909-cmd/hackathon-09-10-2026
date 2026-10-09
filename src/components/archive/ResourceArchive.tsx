import { useState, useMemo } from 'react';
import {
  FolderKanban,
  Search,
  Download,
  ThumbsUp,
  FileText,
  Eye,
  Grid,
  List,
  Layers,
  Cpu,
  Database,
  Calculator,
  Code2
} from 'lucide-react';
import type { Resource, Branch, Year } from '../../data/mockData';
import { BRANCHES, YEARS, SUBJECTS } from '../../data/mockData';
import DocumentPreviewModal from '../library/DocumentPreviewModal';
import UploadModal from '../library/UploadModal';

interface ResourceArchiveProps {
  resources: Resource[];
  selectedBranch: Branch;
  selectedYear: Year;
  onUpvote: (id: string) => void;
  onAddResource: (resource: Resource) => void;
}

export default function ResourceArchive({
  resources,
  selectedBranch,
  selectedYear,
  onUpvote,
  onAddResource,
}: ResourceArchiveProps) {
  const [search, setSearch] = useState('');
  const [branchFilter, setBranchFilter] = useState<Branch | 'All'>(selectedBranch);
  const [yearFilter, setYearFilter] = useState<Year | 'All'>(selectedYear);
  const [subjectFilter, setSubjectFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'upvotes' | 'title' | 'downloads'>('upvotes');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [previewResource, setPreviewResource] = useState<Resource | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const availableSubjects = useMemo(() => {
    if (branchFilter !== 'All') {
      return SUBJECTS[branchFilter] || [];
    }
    return Array.from(new Set(Object.values(SUBJECTS).flat()));
  }, [branchFilter]);

  const filteredResources = useMemo(() => {
    let list = resources.filter((r) => {
      if (r.status !== 'approved') return false;
      if (branchFilter !== 'All' && r.branch !== branchFilter) return false;
      if (yearFilter !== 'All' && r.year !== yearFilter) return false;
      if (subjectFilter !== 'All' && r.subject !== subjectFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          r.title.toLowerCase().includes(q) ||
          r.subject.toLowerCase().includes(q) ||
          r.uploadedBy.toLowerCase().includes(q) ||
          r.summary.toLowerCase().includes(q) ||
          (r.tags || []).some((t) => t.toLowerCase().includes(q))
        );
      }
      return true;
    });

    list.sort((a, b) => {
      if (sortBy === 'upvotes') return b.upvotes - a.upvotes;
      if (sortBy === 'downloads') return (b.downloads || 0) - (a.downloads || 0);
      return a.title.localeCompare(b.title);
    });

    return list;
  }, [resources, branchFilter, yearFilter, subjectFilter, search, sortBy]);

  const getSubjectIcon = (subj: string) => {
    const s = subj.toLowerCase();
    if (s.includes('data') || s.includes('structure') || s.includes('algorithm')) return <Layers className="w-4 h-4 text-indigo-600" />;
    if (s.includes('os') || s.includes('operating') || s.includes('network')) return <Cpu className="w-4 h-4 text-indigo-600" />;
    if (s.includes('dbms') || s.includes('database') || s.includes('sql')) return <Database className="w-4 h-4 text-indigo-600" />;
    if (s.includes('math') || s.includes('discrete') || s.includes('thermo')) return <Calculator className="w-4 h-4 text-indigo-600" />;
    return <Code2 className="w-4 h-4 text-indigo-600" />;
  };

  return (
    <div className="w-full flex flex-col gap-6 animate-fade-in">
      
      {/* ── Top Header Banner ── */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-zinc-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-zinc-900 flex items-center justify-center text-white shadow-xs">
            <FolderKanban className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[11px] font-semibold">
                Centralized Archive
              </span>
              <span className="text-xs font-medium text-zinc-500">
                {filteredResources.length} Documents Available
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
              Campus Academic Resource Archive
            </h1>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowUploadModal(true)}
          className="px-4 py-2.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs transition-all shadow-xs cursor-pointer flex items-center gap-1.5 self-start md:self-auto"
        >
          <span>+ Upload Resource</span>
        </button>
      </div>

      {/* ── Filter Bar & Controls ── */}
      <div className="bg-white rounded-3xl p-5 border border-zinc-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col gap-4">
        
        {/* Search & Sort Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Omni Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by topic, keyword, or faculty author..."
              className="w-full pl-9.5 pr-4 py-2 text-xs bg-zinc-50 hover:bg-zinc-100/80 focus:bg-white border border-zinc-200 rounded-full text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400 transition-all font-medium"
            />
          </div>

          {/* View Toggle & Sort Controls */}
          <div className="flex items-center gap-2.5 flex-wrap">
            
            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-50 border border-zinc-200 text-xs">
              <span className="text-[11px] font-bold text-zinc-400 uppercase">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-xs font-semibold text-zinc-800 cursor-pointer focus:outline-none pr-4"
              >
                <option value="upvotes">Most Upvoted</option>
                <option value="downloads">Most Downloaded</option>
                <option value="title">Alphabetical (A-Z)</option>
              </select>
            </div>

            {/* View Mode */}
            <div className="flex items-center bg-zinc-100 p-0.5 rounded-full border border-zinc-200">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-full transition-all cursor-pointer ${viewMode === 'grid' ? 'bg-white shadow-xs text-zinc-900' : 'text-zinc-500 hover:text-zinc-800'}`}
                title="Grid view"
              >
                <Grid className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-full transition-all cursor-pointer ${viewMode === 'list' ? 'bg-white shadow-xs text-zinc-900' : 'text-zinc-500 hover:text-zinc-800'}`}
                title="List view"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Filter Pills Row */}
        <div className="pt-3 border-t border-zinc-100 flex items-center gap-2 flex-wrap text-xs">
          
          {/* Branch Pill */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-zinc-400 uppercase">Branch:</span>
            <select
              value={branchFilter}
              onChange={(e) => {
                setBranchFilter(e.target.value as any);
                setSubjectFilter('All');
              }}
              className="px-2.5 py-1 rounded-full bg-zinc-50 border border-zinc-200 text-xs font-semibold text-zinc-800 cursor-pointer focus:outline-none"
            >
              <option value="All">All Branches</option>
              {BRANCHES.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          {/* Year Pill */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-zinc-400 uppercase">Year:</span>
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value as any)}
              className="px-2.5 py-1 rounded-full bg-zinc-50 border border-zinc-200 text-xs font-semibold text-zinc-800 cursor-pointer focus:outline-none"
            >
              <option value="All">All Years</option>
              {YEARS.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          {/* Subject Pill */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-zinc-400 uppercase">Subject:</span>
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="px-2.5 py-1 rounded-full bg-zinc-50 border border-zinc-200 text-xs font-semibold text-zinc-800 cursor-pointer focus:outline-none"
            >
              <option value="All">All Subjects</option>
              {availableSubjects.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Reset Filters */}
          {(branchFilter !== 'All' || yearFilter !== 'All' || subjectFilter !== 'All' || search) && (
            <button
              type="button"
              onClick={() => {
                setBranchFilter('All');
                setYearFilter('All');
                setSubjectFilter('All');
                setSearch('');
              }}
              className="px-3 py-1 rounded-full text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors ml-auto cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* ── Document Results Grid / List ── */}
      {filteredResources.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredResources.map((res) => (
              <div
                key={res.id}
                onClick={() => setPreviewResource(res)}
                className="group bg-white rounded-3xl p-5 border border-zinc-200/80 hover:border-zinc-300 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between gap-4"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-700 text-[10px] font-bold uppercase truncate max-w-[150px]">
                      {res.subject}
                    </span>
                    <span className="text-[11px] text-zinc-400 font-medium">
                      {res.branch} • {res.year}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-zinc-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
                    {res.title}
                  </h3>
                  <p className="text-xs text-zinc-500 mt-1.5 line-clamp-2 font-normal">
                    {res.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-500" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    onClick={() => onUpvote(res.id)}
                    className="flex items-center gap-1 text-zinc-600 hover:text-zinc-900 transition-colors font-semibold cursor-pointer"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{res.upvotes}</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setPreviewResource(res)}
                      className="px-3 py-1.5 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Preview</span>
                    </button>

                    <a
                      href={res.fileUrl}
                      download
                      className="p-1.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white transition-all cursor-pointer shadow-2xs"
                      title="Download PDF"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-5 border border-zinc-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col gap-2.5">
            {filteredResources.map((res) => (
              <div
                key={res.id}
                onClick={() => setPreviewResource(res)}
                className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-2xl bg-white hover:bg-zinc-50 border border-zinc-200/60 hover:border-zinc-300 transition-all gap-4 cursor-pointer group"
              >
                <div className="flex items-center gap-3.5 min-w-0 md:w-6/12">
                  <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center shrink-0">
                    {getSubjectIcon(res.subject)}
                  </div>
                  <div className="truncate">
                    <h3 className="font-bold text-xs sm:text-sm text-zinc-900 truncate group-hover:text-indigo-600 transition-colors">
                      {res.title}
                    </h3>
                    <div className="text-[11px] text-zinc-500 flex items-center gap-2 mt-0.5">
                      <span>By {res.uploadedBy}</span>
                      <span>•</span>
                      <span>{res.subject} ({res.branch})</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 justify-between md:justify-end md:w-6/12" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    onClick={() => onUpvote(res.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold transition-all cursor-pointer"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{res.upvotes}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPreviewResource(res)}
                    className="px-3.5 py-1.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold transition-all cursor-pointer shadow-xs"
                  >
                    Read Document
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-zinc-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-400 mb-2">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-sm text-zinc-900">No matching resources found</h3>
          <p className="text-xs text-zinc-500 max-w-sm mt-1 mb-4">
            Try adjusting your search query or reset your branch/subject filters.
          </p>
          <button
            type="button"
            onClick={() => {
              setBranchFilter('All');
              setYearFilter('All');
              setSubjectFilter('All');
              setSearch('');
            }}
            className="px-4 py-2 rounded-full bg-zinc-900 text-white text-xs font-semibold hover:bg-zinc-800 transition-all cursor-pointer"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Document Reader Preview Modal */}
      {previewResource && (
        <DocumentPreviewModal
          resource={previewResource}
          onClose={() => setPreviewResource(null)}
          onUpvote={onUpvote}
        />
      )}

      {/* Upload Modal */}
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
