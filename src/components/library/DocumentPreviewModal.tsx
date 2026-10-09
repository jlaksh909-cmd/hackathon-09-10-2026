import { useState, useEffect } from 'react';
import {
  X,
  Download,
  ThumbsUp,
  Bookmark,
  FileText,
  Star,
  MessageSquare,
  Send,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  Code2,
  Loader2
} from 'lucide-react';
import type { Resource } from '../../data/mockData';
import { fetchComments, postComment, type CommentItem } from '../../services/api';

interface DocumentPreviewModalProps {
  resource: Resource;
  onClose: () => void;
  onUpvote: (id: string) => void;
}

export default function DocumentPreviewModal({
  resource,
  onClose,
  onUpvote,
}: DocumentPreviewModalProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 8;
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [comments, setComments] = useState<CommentItem[]>([
    {
      id: 'c1',
      resourceId: resource.id,
      author: 'Aarav Sharma',
      avatar: 'AS',
      timeAgo: '2 hours ago',
      text: 'The derivation on Page 3 for time complexity was asked in last semester midterms. Very clear notes!',
      likes: 12,
    },
    {
      id: 'c2',
      resourceId: resource.id,
      author: 'Priya Patel',
      avatar: 'PP',
      timeAgo: 'Yesterday',
      text: 'Thanks for including the practice problem solutions at the end of Chapter 2.',
      likes: 8,
    },
  ]);

  useEffect(() => {
    let isMounted = true;
    setCommentsLoading(true);
    fetchComments(resource.id)
      .then((serverComments) => {
        if (isMounted && serverComments && serverComments.length > 0) {
          setComments(serverComments);
        }
      })
      .finally(() => {
        if (isMounted) setCommentsLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [resource.id]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || submittingComment) return;

    const trimmedText = newComment.trim();
    setSubmittingComment(true);

    const tempId = `c-${Date.now()}`;
    const optimisticComment: CommentItem = {
      id: tempId,
      resourceId: resource.id,
      author: 'Alex Morgan',
      avatar: 'AM',
      timeAgo: 'Just now',
      text: trimmedText,
      likes: 0,
    };

    setComments((prev) => [optimisticComment, ...prev]);
    setNewComment('');

    try {
      const savedComment = await postComment(resource.id, 'Alex Morgan', trimmedText);
      if (savedComment) {
        setComments((prev) =>
          prev.map((c) => (c.id === tempId ? savedComment : c))
        );
      }
    } catch (err) {
      console.warn('Comment post fallback:', err);
    } finally {
      setSubmittingComment(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-zinc-900/50 backdrop-blur-sm animate-fade-in">
      <div
        className="
          bg-white border border-zinc-200 shadow-2xl
          w-full max-w-5xl h-[92vh] max-h-[880px] rounded-3xl overflow-hidden flex flex-col
          animate-slide-up
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Minimalist Top Navigation Header ── */}
        <div className="px-5 py-3.5 border-b border-zinc-100 bg-white flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-800 shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div className="truncate">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 text-[10px] font-semibold uppercase">
                  {resource.subject}
                </span>
                <span className="text-[11px] text-zinc-400 font-medium">
                  {resource.branch} • {resource.year}
                </span>
              </div>
              <h2 className="font-bold text-sm text-zinc-900 truncate mt-0.5">
                {resource.title}
              </h2>
            </div>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={`p-2 rounded-full border transition-all cursor-pointer ${
                isBookmarked
                  ? 'bg-zinc-100 border-zinc-300 text-zinc-900'
                  : 'bg-white border-zinc-200 text-zinc-500 hover:bg-zinc-50'
              }`}
              title={isBookmarked ? 'Bookmarked' : 'Bookmark resource'}
            >
              <Bookmark className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => onUpvote(resource.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-800 text-xs font-semibold transition-all cursor-pointer"
            >
              <ThumbsUp className="w-3.5 h-3.5" />
              <span>{resource.upvotes}</span>
            </button>

            <a
              href={resource.fileUrl}
              download
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold transition-all cursor-pointer shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </a>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── Main Content Grid (8 Cols Document / 4 Cols Discourse) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 min-h-0 overflow-hidden">
          
          {/* LEFT: Document Canvas (8 Cols) */}
          <div className="lg:col-span-8 bg-zinc-100/60 p-4 sm:p-6 overflow-y-auto flex flex-col gap-4 border-r border-zinc-200/80">
            
            {/* Toolbar */}
            <div className="bg-white px-3.5 py-1.5 rounded-2xl shadow-xs border border-zinc-200 flex items-center justify-between gap-2 shrink-0">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="p-1 rounded-md text-zinc-500 hover:bg-zinc-100 disabled:opacity-30 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-semibold text-zinc-800">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="p-1 rounded-md text-zinc-500 hover:bg-zinc-100 disabled:opacity-30 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.max(80, z - 10))}
                  className="p-1 rounded-md text-zinc-500 hover:bg-zinc-100 cursor-pointer"
                  title="Zoom out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="text-xs font-semibold text-zinc-600 w-10 text-center">
                  {zoomLevel}%
                </span>
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.min(140, z + 10))}
                  className="p-1 rounded-md text-zinc-500 hover:bg-zinc-100 cursor-pointer"
                  title="Zoom in"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Document Canvas Page */}
            <div
              className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-zinc-200/80 flex flex-col gap-4 text-zinc-900 transition-transform duration-200"
              style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
            >
              <div className="border-b border-zinc-100 pb-3 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                    {resource.branch} Academic Syllabus • Module 3
                  </span>
                  <h3 className="text-lg font-bold text-zinc-900 mt-0.5">
                    {resource.title}
                  </h3>
                </div>
                <span className="px-2.5 py-0.5 rounded-md bg-zinc-100 text-xs font-semibold text-zinc-700">
                  Unit III
                </span>
              </div>

              <div className="space-y-3.5 text-xs sm:text-sm text-zinc-600 leading-relaxed font-normal">
                <h4 className="font-bold text-xs sm:text-sm text-zinc-900">
                  1. Fundamental Theory & Core Concept
                </h4>
                <p>
                  {resource.summary} This monograph covers foundational concepts, invariant proofs, and implementation strategies tested in university evaluations.
                </p>

                {/* Formula Callout */}
                <div className="bg-zinc-50 rounded-2xl p-4 border border-zinc-200/80 flex flex-col gap-2">
                  <div className="flex items-center justify-between text-xs font-bold text-zinc-900">
                    <span className="flex items-center gap-1.5">
                      <Code2 className="w-3.5 h-3.5 text-indigo-600" /> Key Asymptotic Formula
                    </span>
                    <span className="text-[10px] font-mono bg-zinc-200/70 px-2 py-0.5 rounded text-zinc-800">
                      Exam High-Yield
                    </span>
                  </div>
                  <pre className="bg-zinc-900 text-zinc-100 p-3 rounded-xl font-mono text-xs overflow-x-auto">
                    <code>{`// Core Asymptotic Complexity Formula
Time(T) = 2 * T(n/2) + O(n) => By Master Theorem Case 2:
Overall Complexity = O(n log n)
Space Complexity = O(n) auxiliary call stack`}</code>
                  </pre>
                </div>

                <h4 className="font-bold text-xs sm:text-sm text-zinc-900 pt-1">
                  2. Worked Midterm Problem Set
                </h4>
                <p>
                  For a balanced AVL binary tree structure with $N$ vertices, the search and insertion operations are bounded strictly by $O(\log N)$ via balance factor rotations.
                </p>
              </div>

              <div className="border-t border-zinc-100 pt-3 flex items-center justify-between text-xs text-zinc-400">
                <span>Author: {resource.uploadedBy}</span>
                <span>Page {currentPage} of {totalPages}</span>
              </div>
            </div>
          </div>

          {/* RIGHT: Metadata & Peer Discussion (4 Cols) */}
          <div className="lg:col-span-4 bg-white p-5 flex flex-col justify-between overflow-y-auto gap-4">
            
            <div className="flex flex-col gap-4">
              {/* Material Details Card */}
              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/60 flex flex-col gap-2.5">
                <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wide">
                  Material Details
                </span>
                
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded-xl bg-white border border-zinc-200">
                    <span className="text-[10px] text-zinc-400 block font-medium">Format</span>
                    <span className="font-bold text-zinc-800">4.2 MB (PDF)</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-zinc-200">
                    <span className="text-[10px] text-zinc-400 block font-medium">Pages</span>
                    <span className="font-bold text-zinc-800">8 Slides</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-zinc-200">
                    <span className="text-[10px] text-zinc-400 block font-medium">Syllabus</span>
                    <span className="font-bold text-indigo-600">100% Core</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-zinc-200">
                    <span className="text-[10px] text-zinc-400 block font-medium">Rating</span>
                    <span className="font-bold text-amber-600 flex items-center gap-0.5">
                      <Star className="w-3 h-3 fill-current" /> 4.9/5.0
                    </span>
                  </div>
                </div>
              </div>

              {/* Discussion Header */}
              <div className="flex items-center justify-between pt-1 border-t border-zinc-100">
                <div className="flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-zinc-700" />
                  <span className="font-bold text-xs text-zinc-900">Peer Discussion</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 text-[10px] font-semibold">
                  {comments.length}
                </span>
              </div>

              {/* Discussion Stream */}
              <div className="flex flex-col gap-2 max-h-56 overflow-y-auto pr-1">
                {commentsLoading ? (
                  <div className="py-4 flex items-center justify-center text-zinc-500 gap-2 text-xs">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-zinc-800" />
                    <span>Loading Firestore comments...</span>
                  </div>
                ) : (
                  comments.map((c) => (
                    <div key={c.id} className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200/60 flex flex-col gap-1 text-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <div className="w-5 h-5 rounded-full bg-zinc-200 text-zinc-800 font-bold text-[9px] flex items-center justify-center">
                            {c.avatar}
                          </div>
                          <span className="font-semibold text-zinc-900">{c.author}</span>
                        </div>
                        <span className="text-[10px] text-zinc-400">{c.timeAgo}</span>
                      </div>
                      <p className="text-zinc-600 text-[11px] leading-relaxed">
                        {c.text}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Comment Input */}
            <form onSubmit={handleAddComment} className="pt-2 border-t border-zinc-100 flex items-center gap-1.5">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Ask a question or leave a note..."
                className="flex-1 px-3.5 py-2 rounded-full bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400"
              />
              <button
                type="submit"
                disabled={submittingComment || !newComment.trim()}
                className="p-2 rounded-full bg-zinc-900 text-white hover:bg-zinc-800 transition-all cursor-pointer shrink-0 disabled:opacity-40"
              >
                {submittingComment ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
