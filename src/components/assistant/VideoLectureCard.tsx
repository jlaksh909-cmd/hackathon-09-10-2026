import React, { useState } from 'react';
import { VideoLecture } from './types';
import { Youtube, ExternalLink, Play, Eye, Clock, CheckCircle } from './icons';

interface VideoLectureCardProps {
  video: VideoLecture;
}

export const VideoLectureCard: React.FC<VideoLectureCardProps> = ({ video }) => {
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);

  const getLanguageTagClasses = (lang: VideoLecture['language']) => {
    switch (lang) {
      case 'Telugu':
        return 'bg-amber-50 text-amber-700 border-amber-200/80 ring-1 ring-amber-600/10';
      case 'Hindi':
        return 'bg-rose-50 text-rose-700 border-rose-200/80 ring-1 ring-rose-600/10';
      case 'English':
        return 'bg-blue-50 text-blue-700 border-blue-200/80 ring-1 ring-blue-600/10';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getLanguageNativeLabel = (lang: VideoLecture['language']) => {
    switch (lang) {
      case 'Telugu':
        return 'తెలుగు (Telugu)';
      case 'Hindi':
        return 'हिंदी (Hindi)';
      case 'English':
        return 'English';
      default:
        return lang;
    }
  };

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm transition-all hover:border-indigo-300 hover:shadow-md">
      <div>
        {/* Thumbnail Preview Area */}
        <div
          onClick={() => setIsPlayingPreview(!isPlayingPreview)}
          className={`relative flex h-32 w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br ${video.thumbnailColor} text-white shadow-inner transition-transform group-hover:scale-[1.01]`}
        >
          {/* Subtle grid pattern overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff20_1px,transparent_1px)] [background-size:12px_12px] opacity-60" />

          {/* Centered Play Button */}
          <div className="relative z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/20 backdrop-blur-md ring-1 ring-white/50 transition-all group-hover:scale-110 group-hover:bg-red-600">
            <Play className="h-5 w-5 fill-white text-white translate-x-0.5" />
          </div>

          {/* Duration Badge */}
          <span className="absolute bottom-2 right-2 z-10 flex items-center gap-1 rounded bg-black/75 px-1.5 py-0.5 text-[11px] font-medium text-white backdrop-blur-sm">
            <Clock className="h-3 w-3" />
            {video.duration}
          </span>

          {/* Subject Pill Top Left */}
          <span className="absolute top-2 left-2 z-10 max-w-[70%] truncate rounded bg-black/60 px-2 py-0.5 text-[10px] font-medium text-slate-200 backdrop-blur-sm">
            {video.subject}
          </span>
        </div>

        {/* Video Metadata */}
        <div className="mt-3">
          <div className="flex items-center justify-between gap-2">
            <span
              className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-semibold ${getLanguageTagClasses(
                video.language
              )}`}
            >
              {getLanguageNativeLabel(video.language)}
            </span>
            <span className="flex items-center gap-1 text-[11px] text-slate-500">
              <Eye className="h-3 w-3" />
              {video.views}
            </span>
          </div>

          <h5 className="mt-2 text-xs font-semibold text-slate-900 line-clamp-2 leading-snug group-hover:text-indigo-600 transition-colors">
            {video.title}
          </h5>

          <div className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-600">
            <Youtube className="h-3.5 w-3.5 text-red-600" />
            <span className="font-medium text-slate-700">{video.channel}</span>
            <CheckCircle className="h-3 w-3 fill-slate-400 text-white" />
          </div>

          <p className="mt-1 text-[11px] text-slate-500 line-clamp-1 italic">
            Recommended: {video.recommendedFor}
          </p>
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
        <a
          href={video.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 transition-colors hover:bg-red-600 hover:text-white"
        >
          <Youtube className="h-3.5 w-3.5" />
          <span>Watch on YouTube</span>
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </div>
  );
};
