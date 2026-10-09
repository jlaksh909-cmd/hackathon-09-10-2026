import React, { useState } from 'react';
import { Resource } from '../../data/mockData';
import { FileText, Download, ThumbsUp, CheckCircle, Sparkles, Check } from 'lucide-react';

interface ResourceCardProps {
  resource: Resource;
  onSelectAsContext?: (resource: Resource) => void;
  onSummarizeNow?: (resource: Resource) => void;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({
  resource,
  onSelectAsContext,
  onSummarizeNow,
}) => {
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [upvoted, setUpvoted] = useState(false);
  const [upvotesCount, setUpvotesCount] = useState(resource.upvotes);

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 3000);
    }, 800);
  };

  const handleUpvote = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!upvoted) {
      setUpvotesCount((c) => c + 1);
      setUpvoted(true);
    } else {
      setUpvotesCount((c) => c - 1);
      setUpvoted(false);
    }
  };

  return (
    <div className="group relative flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm transition-all hover:border-indigo-300 hover:shadow-md">
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 rounded bg-red-50 px-2 py-0.5 text-[10px] font-bold text-red-700 ring-1 ring-inset ring-red-600/20">
              <FileText className="h-3 w-3" />
              {resource.format}
            </span>
            <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
              {resource.fileSize}
            </span>
          </div>

          {resource.approved && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
              <CheckCircle className="h-3 w-3" />
              Verified Faculty Note
            </span>
          )}
        </div>

        {/* Title & Subject */}
        <h5 className="mt-2.5 text-xs font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
          {resource.title}
        </h5>
        <p className="mt-0.5 text-[11px] text-slate-500 font-medium">
          {resource.subject} • {resource.branch}
        </p>

        {/* Brief summary excerpt */}
        <p className="mt-2 text-xs leading-relaxed text-slate-600 line-clamp-2">
          {resource.summary}
        </p>
      </div>

      {/* Meta counts and action buttons */}
      <div className="mt-3.5 pt-2.5 border-t border-slate-100">
        <div className="flex items-center justify-between text-[11px] text-slate-500 mb-2.5">
          <button
            onClick={handleUpvote}
            className={`inline-flex items-center gap-1 transition-colors ${
              upvoted ? 'text-indigo-600 font-semibold' : 'hover:text-slate-700'
            }`}
          >
            <ThumbsUp className={`h-3 w-3 ${upvoted ? 'fill-indigo-600' : ''}`} />
            <span>{upvotesCount} upvotes</span>
          </button>
          <span>{resource.downloads} downloads</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className={`inline-flex items-center justify-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-all ${
              downloaded
                ? 'border-emerald-200 bg-emerald-50 text-emerald-700 font-semibold'
                : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            {downloaded ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-600" />
                <span>Downloaded</span>
              </>
            ) : downloading ? (
              <>
                <div className="h-3 w-3 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Download className="h-3.5 w-3.5 text-slate-500" />
                <span>Download</span>
              </>
            )}
          </button>

          {onSummarizeNow ? (
            <button
              onClick={() => onSummarizeNow(resource)}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-indigo-50 px-2.5 py-1.5 text-xs font-semibold text-indigo-700 transition-colors hover:bg-indigo-600 hover:text-white"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Ask AI Summary</span>
            </button>
          ) : onSelectAsContext ? (
            <button
              onClick={() => onSelectAsContext(resource)}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-indigo-50 px-2.5 py-1.5 text-xs font-semibold text-indigo-700 transition-colors hover:bg-indigo-600 hover:text-white"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Select Context</span>
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};
