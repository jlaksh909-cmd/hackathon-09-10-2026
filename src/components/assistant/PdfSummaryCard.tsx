import React, { useState } from 'react';
import { PdfSummary } from './types';
import { FileText, Sparkles, CheckCircle2, Bookmark, Download, Check, BookOpen } from 'lucide-react';

interface PdfSummaryCardProps {
  summary: PdfSummary;
  onDownloadPdf?: () => void;
}

export const PdfSummaryCard: React.FC<PdfSummaryCardProps> = ({ summary, onDownloadPdf }) => {
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = () => {
    if (onDownloadPdf) {
      onDownloadPdf();
    }
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2500);
  };

  return (
    <div className="mt-3.5 overflow-hidden rounded-xl border border-indigo-100 bg-gradient-to-b from-indigo-50/40 via-white to-slate-50/80 p-4 shadow-sm sm:p-5">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-indigo-100/70 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-slate-900">
                {summary.documentTitle}
              </h4>
              <span className="rounded bg-red-100 px-1.5 py-0.5 text-[10px] font-bold text-red-700">
                PDF • {summary.fileSize}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              AI Document Synthesis • Verified Faculty Material
            </p>
          </div>
        </div>

        <button
          onClick={handleDownload}
          className={`inline-flex items-center gap-1.5 self-start rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all sm:self-center ${
            downloaded
              ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
              : 'border-indigo-200 bg-white text-indigo-700 hover:bg-indigo-50'
          }`}
        >
          {downloaded ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-600" />
              <span>Downloaded</span>
            </>
          ) : (
            <>
              <Download className="h-3.5 w-3.5" />
              <span>Download PDF</span>
            </>
          )}
        </button>
      </div>

      {/* 3-Bullet Core Summary */}
      <div className="mt-4">
        <h5 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-700">
          <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
          <span>3-Bullet AI Document Summary</span>
        </h5>
        <div className="mt-2.5 space-y-2">
          {summary.summaryBullets.map((bullet, idx) => (
            <div key={idx} className="flex items-start gap-2.5 rounded-lg bg-white/80 p-2.5 ring-1 ring-slate-100">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-[11px] font-bold text-indigo-700">
                {idx + 1}
              </div>
              <p className="text-xs leading-relaxed text-slate-700">{bullet}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Key Exam Takeaways */}
      <div className="mt-4 pt-3 border-t border-slate-100">
        <h5 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
          <span>Key Exam Takeaways & High-Yield Insights</span>
        </h5>
        <ul className="mt-2 space-y-1.5">
          {summary.keyExamTakeaways.map((takeaway, idx) => (
            <li key={idx} className="flex items-start gap-2 text-xs leading-relaxed text-slate-700">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
              <span>{takeaway}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* High-Weightage Focus Topics */}
      {summary.highWeightageTopics.length > 0 && (
        <div className="mt-3.5 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-1.5">
          <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-500">
            <Bookmark className="h-3 w-3 text-amber-500" />
            Must-Revise Topics:
          </span>
          {summary.highWeightageTopics.map((topic, idx) => (
            <span
              key={idx}
              className="rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-medium text-amber-800 ring-1 ring-inset ring-amber-600/20"
            >
              {topic}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
