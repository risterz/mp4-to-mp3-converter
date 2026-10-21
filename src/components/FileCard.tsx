import React, { useState } from 'react';
import { 
  Play, 
  Trash2, 
  Settings2, 
  AlertCircle, 
  CheckCircle2, 
  Loader2, 
  StopCircle, 
  FileVideo, 
  Terminal,
  Clock,
  HardDrive,
  RefreshCw,
  ChevronUp
} from 'lucide-react';
import type { MediaFileItem } from '../types';
import { formatBytes, formatDuration } from '../utils/formatters';
import { AudioPlayer } from './AudioPlayer';
import { ConversionSettings } from './ConversionSettings';

interface FileCardProps {
  item: MediaFileItem;
  onConvert: (id: string) => void;
  onCancel: (id: string) => void;
  onRemove: (id: string) => void;
  onOptionsChange: (id: string, options: MediaFileItem['options']) => void;
  onViewLogs: (logs: string[], title: string) => void;
  isAnyConverting: boolean;
}

export const FileCard: React.FC<FileCardProps> = ({
  item,
  onConvert,
  onCancel,
  onRemove,
  onOptionsChange,
  onViewLogs,
  isAnyConverting,
}) => {
  const [showSettings, setShowSettings] = useState(false);

  const isConvertingThis = item.status === 'converting' || item.status === 'loading-engine';
  const isDone = item.status === 'completed' && item.outputBlob;

  return (
    <div
      className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
        isConvertingThis
          ? 'bg-indigo-50/40 dark:bg-indigo-950/20 border-indigo-300 dark:border-indigo-800 shadow-md shadow-indigo-500/10'
          : isDone
          ? 'bg-white dark:bg-slate-900 border-emerald-200 dark:border-emerald-950/80 shadow-sm'
          : item.status === 'error'
          ? 'bg-rose-50/30 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900 shadow-sm'
          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm'
      }`}
    >
      <div className="p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {/* File Thumbnail & Meta */}
          <div className="flex items-center gap-3.5 min-w-0 w-full sm:w-auto">
            {/* Thumbnail Poster */}
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200 dark:border-slate-700/60 flex items-center justify-center">
              {item.thumbnailUrl ? (
                <img
                  src={item.thumbnailUrl}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <FileVideo className="w-8 h-8 text-slate-400" />
              )}
              {item.duration > 0 && (
                <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/75 text-[10px] font-mono text-white">
                  {formatDuration(item.duration)}
                </span>
              )}
            </div>

            {/* Title & Info */}
            <div className="min-w-0 flex-1">
              <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm sm:text-base truncate" title={item.name}>
                {item.name}
              </h4>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1 font-mono">
                  <HardDrive className="w-3.5 h-3.5" />
                  {formatBytes(item.size)}
                </span>
                {item.duration > 0 && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-mono">
                      <Clock className="w-3.5 h-3.5" />
                      {formatDuration(item.duration)}
                    </span>
                  </>
                )}
                <span>•</span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  {item.options.bitrate}
                </span>
              </div>

              {/* Status line */}
              <div className="mt-2 flex items-center gap-2">
                {item.status === 'idle' && (
                  <span className="text-xs text-slate-500 dark:text-slate-400">Ready to convert</span>
                )}
                {isConvertingThis && (
                  <span className="text-xs text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5 font-medium animate-pulse">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                    {item.stage || 'Converting...'}
                  </span>
                )}
                {isDone && (
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Converted to MP3 ({item.conversionTime ? `${item.conversionTime}s` : 'Done'})
                  </span>
                )}
                {item.status === 'error' && (
                  <span className="text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate max-w-[240px]">{item.errorMessage || 'Conversion failed'}</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
            {/* View Logs Button if logs exist */}
            {item.logs && item.logs.length > 0 && (
              <button
                type="button"
                onClick={() => onViewLogs(item.logs, item.name)}
                title="View FFmpeg Logs"
                className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Terminal className="w-4 h-4" />
              </button>
            )}

            {/* Settings toggle */}
            {!isConvertingThis && (
              <button
                type="button"
                onClick={() => setShowSettings(!showSettings)}
                title="Audio conversion settings"
                className={`p-2 rounded-xl border transition-colors ${
                  showSettings
                    ? 'border-indigo-400 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Settings2 className="w-4 h-4" />
              </button>
            )}

            {/* Convert / Cancel / Retry button */}
            {isConvertingThis ? (
              <button
                type="button"
                onClick={() => onCancel(item.id)}
                className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
              >
                <StopCircle className="w-4 h-4" />
                <span>Cancel</span>
              </button>
            ) : item.status === 'error' ? (
              <button
                type="button"
                onClick={() => onConvert(item.id)}
                disabled={isAnyConverting}
                className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Retry</span>
              </button>
            ) : isDone ? (
              <button
                type="button"
                onClick={() => onConvert(item.id)}
                disabled={isAnyConverting}
                title="Convert again with different settings"
                className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Re-convert</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onConvert(item.id)}
                disabled={isAnyConverting}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-indigo-600/20 active:scale-95 transition-all"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Convert MP3</span>
              </button>
            )}

            {/* Remove File Button */}
            {!isConvertingThis && (
              <button
                type="button"
                onClick={() => onRemove(item.id)}
                title="Remove file"
                className="p-2 rounded-xl text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Progress bar when converting */}
        {isConvertingThis && (
          <div className="mt-4 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-700 dark:text-slate-300">
                {item.stage || 'Processing audio...'}
              </span>
              <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                {Math.round(item.progress)}%
              </span>
            </div>
            <div 
              className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden p-0.5"
              role="progressbar"
              aria-valuenow={Math.round(item.progress)}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="h-full bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-500 rounded-full transition-all duration-300 relative overflow-hidden"
                style={{ width: `${Math.max(item.progress, 5)}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse" />
              </div>
            </div>
          </div>
        )}

        {/* Settings Expansion Drawer */}
        {showSettings && (
          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Customizing: {item.name}
              </span>
              <button
                onClick={() => setShowSettings(false)}
                className="text-xs text-indigo-600 dark:text-indigo-400 flex items-center gap-1 font-semibold"
              >
                <span>Collapse Settings</span>
                <ChevronUp className="w-3.5 h-3.5" />
              </button>
            </div>
            <ConversionSettings
              options={item.options}
              onChange={(newOpts) => onOptionsChange(item.id, newOpts)}
              videoDuration={item.duration}
              originalName={item.name}
            />
          </div>
        )}

        {/* Audio Player Result preview if converted */}
        {isDone && item.outputBlob && (
          <AudioPlayer
            audioBlob={item.outputBlob}
            filename={item.outputFilename || item.name.replace(/\.[^/.]+$/, '') + '.mp3'}
            originalSize={item.size}
            originalDuration={item.duration}
          />
        )}
      </div>
    </div>
  );
};
