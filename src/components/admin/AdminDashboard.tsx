import { useState, useEffect, useCallback } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  Clock,
  User,
  Loader2,
  Eye,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import type { Resource } from '../../data/mockData';
import { fetchPendingModeration, approveResource, rejectResource } from '../../services/api';
import DocumentPreviewModal from '../library/DocumentPreviewModal';

interface AdminDashboardProps {
  onResourceApproved: () => void;
}

export default function AdminDashboard({ onResourceApproved }: AdminDashboardProps) {
  const [pendingNotes, setPendingNotes] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [previewResource, setPreviewResource] = useState<Resource | null>(null);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);
  const [rejectReasonPrompt, setRejectReasonPrompt] = useState<{ id: string; title: string } | null>(null);
  const [rejectReasonText, setRejectReasonText] = useState('');

  const loadPending = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchPendingModeration();
      setPendingNotes(data || []);
    } catch (err) {
      console.warn('Failed to load pending queue:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPending();
  }, [loadPending]);

  const showToast = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 3500);
  };

  const handleApprove = async (id: string, title: string) => {
    setActionLoadingId(id);
    try {
      await approveResource(id);
      setPendingNotes((prev) => prev.filter((r) => r.id !== id));
      showToast(`"${title}" published to live library`);
      onResourceApproved();
    } catch (err) {
      console.error('Approve failed:', err);
      showToast('Approval failed. Please try again.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReject = async () => {
    if (!rejectReasonPrompt) return;
    const { id, title } = rejectReasonPrompt;
    setActionLoadingId(id);
    try {
      await rejectResource(id, rejectReasonText || 'Syllabus discrepancy or duplicate');
      setPendingNotes((prev) => prev.filter((r) => r.id !== id));
      showToast(`"${title}" rejected.`);
      setRejectReasonPrompt(null);
      setRejectReasonText('');
    } catch (err) {
      console.error('Reject failed:', err);
      showToast('Rejection failed.');
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-6 animate-fade-in">
      {/* Toast */}
      {feedbackToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-zinc-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-semibold animate-slide-up">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* ── Top Header ── */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-zinc-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-zinc-900 flex items-center justify-center text-white shadow-xs">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 text-[10px] font-semibold">
                Senior QA Console
              </span>
              <span className="text-xs font-medium text-zinc-500">
                Firebase Moderation Queue
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900">
              Academic Verification Dashboard
            </h1>
          </div>
        </div>

        <button
          type="button"
          onClick={loadPending}
          disabled={loading}
          className="px-3.5 py-1.5 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer self-start md:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* ── Metrics Bento ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="bg-white p-5 rounded-2xl border border-zinc-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide block">
              Pending Submissions
            </span>
            <span className="text-xl font-bold text-zinc-900 mt-0.5 block">
              {pendingNotes.length}
            </span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-zinc-100 text-zinc-700 flex items-center justify-center">
            <Clock className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-zinc-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide block">
              Verified Live
            </span>
            <span className="text-xl font-bold text-zinc-900 mt-0.5 block">
              24 Modules
            </span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-zinc-100 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-zinc-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide block">
              Verification Accuracy
            </span>
            <span className="text-xl font-bold text-zinc-900 mt-0.5 block">
              99.4%
            </span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-zinc-100 text-zinc-800 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* ── Submissions Queue ── */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-zinc-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
          <div>
            <h2 className="text-sm font-bold text-zinc-900">
              Submissions Awaiting Approval
            </h2>
            <p className="text-xs text-zinc-500">
              Verify syllabus matching, formulas, and completeness before publishing.
            </p>
          </div>
          <span className="px-2.5 py-1 rounded bg-zinc-100 text-zinc-700 font-semibold text-xs">
            {pendingNotes.length} in Queue
          </span>
        </div>

        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center text-zinc-500 gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-zinc-800" />
            <span className="text-xs font-medium">Checking Firestore queue...</span>
          </div>
        ) : pendingNotes.length > 0 ? (
          <div className="space-y-3">
            {pendingNotes.map((note) => (
              <div
                key={note.id}
                className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/60 hover:border-zinc-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3.5 min-w-0 flex-1">
                  <div className="w-10 h-10 rounded-xl bg-white border border-zinc-200 flex items-center justify-center text-zinc-800 shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="px-2 py-0.5 rounded bg-zinc-200 text-zinc-800 text-[10px] font-semibold">
                        {note.subject}
                      </span>
                      <span className="text-[11px] text-zinc-500 font-medium">
                        {note.branch} • {note.year}
                      </span>
                      <span className="text-[11px] text-zinc-400 flex items-center gap-1">
                        <User className="w-3 h-3" /> {note.uploadedBy}
                      </span>
                    </div>
                    <h3 className="font-bold text-xs sm:text-sm text-zinc-900">{note.title}</h3>
                    <p className="text-xs text-zinc-500 mt-0.5 line-clamp-2">{note.summary}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setPreviewResource(note)}
                    className="p-2 sm:px-3 rounded-full bg-white hover:bg-zinc-100 text-zinc-700 border border-zinc-200 text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Inspect</span>
                  </button>

                  <button
                    type="button"
                    disabled={actionLoadingId === note.id}
                    onClick={() => setRejectReasonPrompt({ id: note.id, title: note.title })}
                    className="p-2 sm:px-3 rounded-full bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Reject</span>
                  </button>

                  <button
                    type="button"
                    disabled={actionLoadingId === note.id}
                    onClick={() => handleApprove(note.id, note.title)}
                    className="px-3.5 py-2 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
                  >
                    {actionLoadingId === note.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    )}
                    <span>Approve Live</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-700 mb-2">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="font-bold text-sm text-zinc-900">
              All Notes Verified & Up to Date
            </h3>
            <p className="text-xs text-zinc-500 max-w-sm mt-1">
              There are no pending submissions in the queue. Newly uploaded monographs will appear here for verification.
            </p>
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {rejectReasonPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-zinc-200 shadow-2xl flex flex-col gap-4 animate-slide-up">
            <div className="flex items-center gap-2 text-rose-600">
              <AlertTriangle className="w-4 h-4" />
              <h3 className="font-bold text-sm text-zinc-900">Reject Note Submission</h3>
            </div>
            <p className="text-xs text-zinc-500">
              Provide feedback for <strong>"{rejectReasonPrompt.title}"</strong>:
            </p>
            <textarea
              rows={3}
              value={rejectReasonText}
              onChange={(e) => setRejectReasonText(e.target.value)}
              placeholder="e.g. Incomplete Chapter 4 proof, or duplicate syllabus upload..."
              className="w-full p-3 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 focus:outline-none focus:border-zinc-400"
            />
            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setRejectReasonPrompt(null)}
                className="px-4 py-2 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-600 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReject}
                className="px-4 py-2 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold cursor-pointer"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewResource && (
        <DocumentPreviewModal
          resource={previewResource}
          onClose={() => setPreviewResource(null)}
          onUpvote={() => {}}
        />
      )}
    </div>
  );
}
