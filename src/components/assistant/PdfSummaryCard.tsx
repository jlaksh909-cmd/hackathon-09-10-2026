import React, { useState } from 'react';
import { PdfSummary } from './types';
import { FileText, Sparkles, CheckCircle2, Bookmark, Download, Check } from 'lucide-react';

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
    <div className="mt-3.5 overflow-hidden rounded-2xl border border-zinc-200 bg-white p-4 shadow-xs sm:p-5">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-900 text-white shadow-xs">
            <FileText className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-zinc-900">
                {summary.documentTitle}
              </h4>
              <span className="rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] font-bold text-zinc-700">
                PDF • {summary.fileSize}
              </span>
            </div>
            <p className="text-xs text-zinc-500 font-medium">
              AI Document Synthesis • Verified Faculty Material
            </p>
          </div>
        </div>

        <button
          onClick={handleDownload}
          className={`inline-flex items-center gap-1.5 self-start rounded-full border px-3 py-1.5 text-xs font-semibold transition-all sm:self-center cursor-pointer ${
            downloaded
              ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
              : 'border-zinc-200 bg-zinc-50 text-zinc-800 hover:bg-zinc-100'
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
        <h5 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-zinc-800">
          <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
          <span>3-Bullet AI Document Summary</span>
        </h5>
        <div className="mt-2.5 space-y-2">
          {summary.summaryBullets.map((bullet, idx) => (
            <div key={idx} className="flex items-start gap-2.5 rounded-xl bg-zinc-50 p-3 border border-zinc-100">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-[10px] font-bold text-zinc-800">
                {idx + 1}
              </div>
              <p className="text-xs leading-relaxed text-zinc-700">{bullet}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Key Exam Takeaways */}
      <div className="mt-4 pt-3 border-t border-zinc-100">
        <h5 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-zinc-800">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
          <span>Key Exam Takeaways</span>
        </h5>
        <ul className="mt-2 space-y-1.5">
          {summary.keyExamTakeaways.map((takeaway, idx) => (
            <li key={idx} className="flex items-start gap-2 text-xs leading-relaxed text-zinc-600">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
              <span>{takeaway}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* High-Weightage Focus Topics */}
      {summary.highWeightageTopics.length > 0 && (
        <div className="mt-3.5 pt-3 border-t border-zinc-100 flex flex-wrap items-center gap-1.5">
          <span className="flex items-center gap-1 text-[11px] font-semibold text-zinc-500">
            <Bookmark className="h-3 w-3 text-amber-500" />
            Must-Revise Topics:
          </span>
          {summary.highWeightageTopics.map((topic, idx) => (
            <span
              key={idx}
              className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-[10px] font-semibold text-zinc-700"
            >
              {topic}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
