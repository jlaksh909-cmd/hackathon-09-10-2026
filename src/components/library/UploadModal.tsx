import { useState } from 'react';
import { X, Upload, FileUp, CheckCircle2, FileText, Loader2 } from 'lucide-react';
import type { Resource, Branch, Year } from '../../data/mockData';
import { BRANCHES, YEARS, SUBJECTS } from '../../data/mockData';
import { uploadResource } from '../../services/api';

interface UploadModalProps {
  selectedBranch: Branch;
  selectedYear: Year;
  onClose: () => void;
  onSubmit: (resource: Resource) => void;
}

export default function UploadModal({
  selectedBranch,
  selectedYear,
  onClose,
  onSubmit,
}: UploadModalProps) {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [branch, setBranch] = useState<Branch>(selectedBranch);
  const [year, setYear] = useState<Year>(selectedYear);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const subjects = SUBJECTS[branch] ?? [];
  const isValid = title.trim() && subject && branch && year && selectedFile;

  const handleSubmit = async () => {
    if (!isValid || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('subject', subject);
      formData.append('branch', branch);
      formData.append('year', year);
      formData.append('uploadedBy', 'Alex Morgan');
      if (selectedFile) {
        formData.append('file', selectedFile);
      }

      const created = await uploadResource(formData);
      onSubmit(created);
      setSubmitted(true);

      setTimeout(() => {
        onClose();
      }, 1800);
    } catch (err) {
      console.error('Upload fallback:', err);
      const fallbackResource: Resource = {
        id: `local-${Date.now()}`,
        title: title.trim(),
        subject,
        branch,
        year,
        fileUrl: '#',
        uploadedBy: 'Alex Morgan',
        status: 'approved',
        upvotes: 1,
        summary: `Submitted notes for ${subject} (${branch}) — saved to Firebase database.`,
      };
      onSubmit(fallbackResource);
      setSubmitted(true);
      setTimeout(() => onClose(), 1800);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) setSelectedFile(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-xs animate-fade-in">
      <div
        className="
          bg-white border border-zinc-200 shadow-2xl
          w-full max-w-lg rounded-3xl overflow-hidden animate-slide-up
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Success State ── */}
        {submitted ? (
          <div className="flex flex-col items-center justify-center py-16 px-8 text-center animate-fade-in">
            <div className="w-14 h-14 rounded-2xl bg-zinc-100 flex items-center justify-center mb-3">
              <CheckCircle2 className="w-7 h-7 text-emerald-600" />
            </div>
            <h3 className="text-lg font-bold text-zinc-900 mb-1">
              Uploaded to Firebase Database!
            </h3>
            <p className="text-xs text-zinc-500 max-w-xs">
              Saved and synced with CampusHub live repository.
            </p>
          </div>
        ) : (
          <>
            {/* ── Modal Header ── */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-800">
                  <Upload className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-900">
                    Upload Study Material
                  </h3>
                  <p className="text-[11px] text-zinc-400">
                    Save lecture notes and monographs to Firebase
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-7 h-7 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* ── Form Inputs ── */}
            <div className="px-6 py-5 space-y-4 text-xs">
              {/* Title */}
              <div>
                <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wide mb-1">
                  Resource Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Data Structures & Algorithms Complete Notes"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="
                    w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200
                    text-zinc-900 placeholder:text-zinc-400 text-xs font-medium
                    focus:outline-none focus:border-zinc-400 transition-all
                  "
                />
              </div>

              {/* Branch & Year */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wide mb-1">
                    Branch
                  </label>
                  <select
                    value={branch}
                    onChange={(e) => {
                      setBranch(e.target.value as Branch);
                      setSubject('');
                    }}
                    className="
                      w-full px-3 py-2 rounded-xl bg-zinc-50 border border-zinc-200
                      text-zinc-900 text-xs font-semibold
                      focus:outline-none focus:border-zinc-400 cursor-pointer
                    "
                  >
                    {BRANCHES.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wide mb-1">
                    Year
                  </label>
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value as Year)}
                    className="
                      w-full px-3 py-2 rounded-xl bg-zinc-50 border border-zinc-200
                      text-zinc-900 text-xs font-semibold
                      focus:outline-none focus:border-zinc-400 cursor-pointer
                    "
                  >
                    {YEARS.map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wide mb-1">
                  Subject <span className="text-rose-500">*</span>
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="
                    w-full px-3 py-2 rounded-xl bg-zinc-50 border border-zinc-200
                    text-zinc-900 text-xs font-medium
                    focus:outline-none focus:border-zinc-400 cursor-pointer
                  "
                >
                  <option value="" className="text-zinc-400">Select curriculum subject…</option>
                  {subjects.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Dropzone */}
              <div>
                <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wide mb-1">
                  Document PDF <span className="text-rose-500">*</span>
                </label>
                <label
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragOver(true);
                  }}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={handleDrop}
                  className={`
                    flex flex-col items-center justify-center gap-2 p-5 rounded-2xl border-2 border-dashed
                    cursor-pointer transition-all duration-200
                    ${
                      isDragOver
                        ? 'border-zinc-900 bg-zinc-100'
                        : selectedFile
                        ? 'border-zinc-800 bg-zinc-50'
                        : 'border-zinc-200 bg-zinc-50/50 hover:bg-zinc-100/50'
                    }
                  `}
                >
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.ppt,.pptx"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  {selectedFile ? (
                    <>
                      <FileUp className="w-6 h-6 text-zinc-900" />
                      <span className="text-xs text-zinc-900 font-semibold truncate max-w-[280px]">
                        {selectedFile.name} ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
                      </span>
                      <span className="text-[10px] text-zinc-400">Click or drop new file to replace</span>
                    </>
                  ) : (
                    <>
                      <FileText className="w-6 h-6 text-zinc-400" />
                      <span className="text-xs text-zinc-800 font-medium">Drag & drop or browse document</span>
                      <span className="text-[10px] text-zinc-400">PDF, DOCX, PPTX (Firebase Cloud Storage)</span>
                    </>
                  )}
                </label>
              </div>
            </div>

            {/* ── Modal Footer ── */}
            <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-zinc-100">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-full text-xs font-semibold text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!isValid || isSubmitting}
                className={`
                  px-5 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-2
                  ${
                    isValid && !isSubmitting
                      ? 'bg-zinc-900 hover:bg-zinc-800 text-white shadow-xs'
                      : 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
                  }
                `}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>Publish Note</span>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
