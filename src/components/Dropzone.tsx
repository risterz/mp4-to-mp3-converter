import React, { useState, useRef, useEffect } from 'react';
import { 
  UploadCloud, 
  Film, 
  FileCheck, 
  Lock, 
  Zap,
  FolderOpen
} from 'lucide-react';

interface DropzoneProps {
  onFilesSelected: (files: File[]) => void;
  disabled?: boolean;
}

export const Dropzone: React.FC<DropzoneProps> = ({ onFilesSelected, disabled = false }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files).filter((file) => {
        // Accept video files or files with video extensions
        return file.type.startsWith('video/') || /\.(mp4|m4v|mkv|mov|webm|avi|flv|wmv|ts)$/i.test(file.name);
      });

      if (droppedFiles.length > 0) {
        onFilesSelected(droppedFiles);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selected = Array.from(e.target.files);
      onFilesSelected(selected);
      // Reset input value so same file can be selected again
      e.target.value = '';
    }
  };

  // Support window paste event
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (disabled || !e.clipboardData) return;
      const files: File[] = [];
      for (let i = 0; i < e.clipboardData.files.length; i++) {
        const item = e.clipboardData.files[i];
        if (item.type.startsWith('video/')) {
          files.push(item);
        }
      }
      if (files.length > 0) {
        onFilesSelected(files);
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [disabled, onFilesSelected]);

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => !disabled && inputRef.current?.click()}
      tabIndex={0}
      role="button"
      aria-label="Upload video file for conversion"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          inputRef.current?.click();
        }
      }}
      className={`group relative overflow-hidden rounded-3xl border-2 border-dashed p-8 sm:p-12 text-center transition-all cursor-pointer select-none focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/30 ${
        disabled
          ? 'opacity-60 cursor-not-allowed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/30'
          : isDragOver
          ? 'border-indigo-500 bg-indigo-500/10 scale-[1.01] shadow-xl shadow-indigo-500/10'
          : 'border-slate-300 hover:border-indigo-400 dark:border-slate-700 dark:hover:border-indigo-500/60 bg-white dark:bg-slate-900/80 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 shadow-sm'
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="video/mp4,video/*,.mp4,.m4v,.mkv,.mov,.webm,.avi"
        onChange={handleFileChange}
        disabled={disabled}
        className="hidden"
      />

      {/* Decorative gradient glow */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-36 bg-gradient-to-b from-indigo-500/10 to-transparent blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center justify-center max-w-md mx-auto">
        {/* Animated Icon Circle */}
        <div
          className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110 ${
            isDragOver
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 animate-bounce'
              : 'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50'
          }`}
        >
          {isDragOver ? (
            <UploadCloud className="w-10 h-10" />
          ) : (
            <Film className="w-10 h-10" />
          )}
        </div>

        <h3 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100">
          Drop your MP4 or video files here
        </h3>
        
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          Drag and drop video files, click to browse your folders, or paste from clipboard.
        </p>

        {/* Action Button */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            disabled={disabled}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold flex items-center gap-2 shadow-md shadow-indigo-600/20 active:scale-95 transition-all"
          >
            <FolderOpen className="w-4 h-4" />
            <span>Select Video Files</span>
          </button>
        </div>

        {/* Supported formats & Privacy Guarantee */}
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/80 w-full flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1.5 font-medium">
            <FileCheck className="w-4 h-4 text-emerald-500" />
            MP4, MOV, WebM, MKV
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <Lock className="w-4 h-4 text-indigo-500" />
            100% Client-Side Privacy
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <Zap className="w-4 h-4 text-amber-500" />
            Zero Server Uploads
          </span>
        </div>
      </div>
    </div>
  );
};
