import React, { useRef, useEffect, useState } from 'react';
import { Terminal, X, Copy, Download, Check, Trash2 } from 'lucide-react';

interface LogsModalProps {
  isOpen: boolean;
  onClose: () => void;
  logs: string[];
  title?: string;
  onClearLogs?: () => void;
}

export const LogsModal: React.FC<LogsModalProps> = ({
  isOpen,
  onClose,
  logs,
  title = 'FFmpeg Console Logs',
  onClearLogs,
}) => {
  const [copied, setCopied] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (autoScroll && containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs, autoScroll]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(logs.join('\n'));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.warn('Copy failed', e);
    }
  };

  const handleDownloadLogs = () => {
    const blob = new Blob([logs.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ffmpeg-logs-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="logs-modal-title"
    >
      <div 
        className="relative w-full max-w-3xl rounded-2xl bg-slate-950 text-slate-100 shadow-2xl border border-slate-800 flex flex-col max-h-[85vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-slate-900 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
            </div>
            <div className="h-4 w-px bg-slate-700 mx-1" />
            <Terminal className="w-4 h-4 text-indigo-400" />
            <h3 id="logs-modal-title" className="text-sm font-mono font-semibold text-slate-200">
              {title}
            </h3>
          </div>

          <div className="flex items-center gap-1.5">
            {onClearLogs && (
              <button
                onClick={onClearLogs}
                title="Clear terminal"
                className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={handleCopy}
              title="Copy all logs"
              className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
            <button
              onClick={handleDownloadLogs}
              title="Download logs as text file"
              className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              title="Close"
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Terminal Body */}
        <div
          ref={containerRef}
          className="p-4 overflow-y-auto flex-1 font-mono text-xs text-slate-300 space-y-1 bg-black/60 selection:bg-indigo-600 selection:text-white"
        >
          {logs.length === 0 ? (
            <div className="text-slate-500 italic py-8 text-center">
              No FFmpeg logs captured yet. Logs will appear here when conversion begins.
            </div>
          ) : (
            logs.map((log, index) => {
              const isError = log.includes('[Error]') || log.toLowerCase().includes('error');
              const isWarn = log.includes('[Warning]') || log.toLowerCase().includes('warning');
              const isSuccess = log.includes('[Success]');
              const isSystem = log.includes('[System]');

              return (
                <div
                  key={index}
                  className={`leading-relaxed break-all ${
                    isError
                      ? 'text-rose-400 font-semibold'
                      : isWarn
                      ? 'text-amber-400'
                      : isSuccess
                      ? 'text-emerald-400 font-semibold'
                      : isSystem
                      ? 'text-cyan-400'
                      : 'text-slate-300'
                  }`}
                >
                  {log}
                </div>
              );
            })
          )}
        </div>

        {/* Terminal Footer */}
        <div className="px-4 py-2 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={autoScroll}
              onChange={(e) => setAutoScroll(e.target.checked)}
              className="rounded bg-slate-800 border-slate-700 text-indigo-600 focus:ring-0"
            />
            <span>Auto-scroll</span>
          </label>
          <span>{logs.length} lines logged</span>
        </div>
      </div>
    </div>
  );
};
