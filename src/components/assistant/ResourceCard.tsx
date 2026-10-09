import React, { useState } from 'react';
import type { Resource } from '../../data/mockData';
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
    <div className="group relative flex flex-col justify-between rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-xs transition-all hover:border-zinc-300 hover:shadow-sm">
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 rounded bg-zinc-100 px-2 py-0.5 text-[10px] font-bold text-zinc-800">
              <FileText className="h-3 w-3" />
              {resource.format || 'PDF'}
            </span>
            <span className="rounded bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-600">
              {resource.fileSize || '4.2 MB'}
            </span>
          </div>

          {(resource.status === 'approved' || resource.approved) && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
              <CheckCircle className="h-3 w-3" />
              Verified
            </span>
          )}
        </div>

        {/* Title & Subject */}
        <h5 className="mt-2.5 text-xs font-bold text-zinc-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
          {resource.title}
        </h5>
        <p className="mt-0.5 text-[11px] text-zinc-500 font-medium">
          {resource.subject} • {resource.branch}
        </p>

        {/* Brief summary excerpt */}
        <p className="mt-2 text-xs leading-relaxed text-zinc-600 line-clamp-2 font-normal">
          {resource.summary}
        </p>
      </div>

      {/* Meta counts and action buttons */}
      <div className="mt-3.5 pt-2.5 border-t border-zinc-100">
        <div className="flex items-center justify-between text-[11px] text-zinc-500 mb-2.5">
          <button
            onClick={handleUpvote}
            className={`inline-flex items-center gap-1 transition-colors cursor-pointer ${
              upvoted ? 'text-indigo-600 font-semibold' : 'hover:text-zinc-800'
            }`}
          >
            <ThumbsUp className={`h-3 w-3 ${upvoted ? 'fill-indigo-600' : ''}`} />
            <span>{upvotesCount} upvotes</span>
          </button>
          <span>{resource.downloads || 150} downloads</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className={`inline-flex items-center justify-center gap-1.5 rounded-full border px-2.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
              downloaded
                ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                : 'border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900'
            }`}
          >
            {downloaded ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-600" />
                <span>Saved</span>
              </>
            ) : downloading ? (
              <>
                <div className="h-3 w-3 animate-spin rounded-full border-2 border-zinc-800 border-t-transparent" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Download className="h-3.5 w-3.5 text-zinc-500" />
                <span>Download</span>
              </>
            )}
          </button>

          {onSummarizeNow ? (
            <button
              onClick={() => onSummarizeNow(resource)}
              className="inline-flex items-center justify-center gap-1.5 rounded-full bg-zinc-900 px-2.5 py-1.5 text-xs font-semibold text-white transition-all hover:bg-zinc-800 cursor-pointer shadow-xs"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Ask AI</span>
            </button>
          ) : onSelectAsContext ? (
            <button
              onClick={() => onSelectAsContext(resource)}
              className="inline-flex items-center justify-center gap-1.5 rounded-full bg-zinc-900 px-2.5 py-1.5 text-xs font-semibold text-white transition-all hover:bg-zinc-800 cursor-pointer shadow-xs"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Select</span>
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};
