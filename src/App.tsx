import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { 
  Play, 
  Trash2, 
  Download, 
  Sliders, 
  Terminal, 
  Sparkles,
  Music4
} from 'lucide-react';

import type { MediaFileItem, ConversionOptions, Bitrate, EngineStatus } from './types';
import { useDarkMode } from './hooks/useDarkMode';
import { ffmpegService } from './services/ffmpegService';
import { extractVideoMetadata } from './utils/mediaMetadata';
import { Navbar } from './components/Navbar';
import { Dropzone } from './components/Dropzone';
import { FileCard } from './components/FileCard';
import { LogsModal } from './components/LogsModal';
import { FeaturesBanner } from './components/FeaturesBanner';
import { FAQSection } from './components/FAQSection';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  const { mode, setMode } = useDarkMode();

  const [files, setFiles] = useState<MediaFileItem[]>([]);
  const [globalBitrate, setGlobalBitrate] = useState<Bitrate>('320k');
  const [engineStatus, setEngineStatus] = useState<EngineStatus>('unloaded');
  const [engineProgressText, setEngineProgressText] = useState<string>('');
  
  // Terminal logs modal state
  const [globalLogs, setGlobalLogs] = useState<string[]>([]);
  const [isLogsOpen, setIsLogsOpen] = useState(false);
  const [activeLogsTitle, setActiveLogsTitle] = useState('FFmpeg Console Output');
  const [activeLogs, setActiveLogs] = useState<string[]>([]);

  // Subscribe to FFmpeg engine status and log stream
  useEffect(() => {
    const unsubStatus = ffmpegService.subscribeStatus((status, msg) => {
      setEngineStatus(status);
      if (msg) setEngineProgressText(msg);
    });

    const unsubLogs = ffmpegService.subscribeLogs((log) => {
      setGlobalLogs((prev) => [...prev.slice(-300), log]);
    });

    return () => {
      unsubStatus();
      unsubLogs();
    };
  }, []);

  // Update default bitrate on any existing non-customized files if user switches global preset
  const handleGlobalBitrateChange = (bitrate: Bitrate) => {
    setGlobalBitrate(bitrate);
    setFiles((prev) =>
      prev.map((f) =>
        f.status === 'idle'
          ? { ...f, options: { ...f.options, bitrate } }
          : f
      )
    );
  };

  // Preload WASM engine
  const handlePreloadEngine = useCallback(async () => {
    try {
      await ffmpegService.load((pct, text) => {
        setEngineProgressText(`${text} (${pct}%)`);
      });
    } catch (err) {
      console.error('Failed to preload FFmpeg engine:', err);
    }
  }, []);

  // Handle newly selected video files
  const handleFilesSelected = async (newFiles: File[]) => {
    const newItems: MediaFileItem[] = [];

    for (const file of newFiles) {
      const id = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      
      const defaultOptions: ConversionOptions = {
        bitrate: globalBitrate,
        channels: 'stereo',
        sampleRate: 'original',
        volume: 1.0,
        trim: { enabled: false, start: 0, end: 0 },
        metadata: {
          title: file.name.substring(0, file.name.lastIndexOf('.')) || file.name,
          artist: '',
          album: '',
          year: new Date().getFullYear().toString(),
        },
      };

      const item: MediaFileItem = {
        id,
        file,
        name: file.name,
        size: file.size,
        type: file.type || 'video/mp4',
        duration: 0,
        status: 'idle',
        progress: 0,
        stage: 'Ready to convert',
        options: defaultOptions,
        logs: [],
      };

      newItems.push(item);
    }

    setFiles((prev) => [...prev, ...newItems]);

    // Asynchronously extract metadata & thumbnails
    for (const item of newItems) {
      try {
        const meta = await extractVideoMetadata(item.file);
        setFiles((prev) =>
          prev.map((f) =>
            f.id === item.id
              ? {
                  ...f,
                  duration: meta.duration,
                  thumbnailUrl: meta.thumbnailUrl,
                  options: {
                    ...f.options,
                    trim: {
                      ...f.options.trim,
                      end: meta.duration || 0,
                    },
                  },
                }
              : f
          )
        );
      } catch (err) {
        console.warn('Metadata extraction note:', err);
      }
    }
  };

  // Convert a single file
  const convertFile = async (id: string) => {
    const target = files.find((f) => f.id === id);
    if (!target) return;

    // Set converting state
    setFiles((prev) =>
      prev.map((f) =>
        f.id === id
          ? {
              ...f,
              status: 'converting',
              progress: 5,
              stage: 'Starting FFmpeg conversion...',
              errorMessage: undefined,
              logs: [],
            }
          : f
      )
    );

    const startTime = performance.now();

    try {
      const result = await ffmpegService.convertToMp3(
        target.file,
        target.options,
        target.duration,
        (progress, stage) => {
          setFiles((prev) =>
            prev.map((f) =>
              f.id === id ? { ...f, progress, stage } : f
            )
          );
        },
        (logLine) => {
          setFiles((prev) =>
            prev.map((f) =>
              f.id === id
                ? { ...f, logs: [...f.logs.slice(-200), logLine] }
                : f
            )
          );
        }
      );

      const elapsed = Math.round((performance.now() - startTime) / 1000);

      // Success
      setFiles((prev) =>
        prev.map((f) =>
          f.id === id
            ? {
                ...f,
                status: 'completed',
                progress: 100,
                stage: 'Conversion completed!',
                outputBlob: result.blob,
                outputFilename: result.filename,
                outputSize: result.blob.size,
                conversionTime: elapsed,
              }
            : f
        )
      );

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.7 },
        });
      } catch (e) {
        // ignore
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setFiles((prev) =>
        prev.map((f) =>
          f.id === id
            ? {
                ...f,
                status: 'error',
                stage: 'Conversion failed',
                errorMessage: msg,
              }
            : f
        )
      );
    }
  };

  // Convert all pending files sequentially
  const handleConvertAll = async () => {
    const pending = files.filter((f) => f.status === 'idle' || f.status === 'error');
    for (const item of pending) {
      await convertFile(item.id);
    }
  };

  // Cancel conversion
  const handleCancel = async (id: string) => {
    await ffmpegService.abortConversion();
    setFiles((prev) =>
      prev.map((f) =>
        f.id === id
          ? { ...f, status: 'aborted', stage: 'Conversion cancelled', progress: 0 }
          : f
      )
    );
  };

  // Remove a single file
  const handleRemove = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  // Clear all files
  const handleClearAll = () => {
    setFiles([]);
  };

  // Update specific file options
  const handleOptionsChange = (id: string, options: ConversionOptions) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, options } : f))
    );
  };

  // View logs in modal
  const handleViewLogs = (logs: string[], title: string) => {
    setActiveLogs(logs);
    setActiveLogsTitle(`FFmpeg Logs: ${title}`);
    setIsLogsOpen(true);
  };

  // Open global logs
  const handleOpenGlobalLogs = () => {
    setActiveLogs(globalLogs);
    setActiveLogsTitle('Global FFmpeg Engine Logs');
    setIsLogsOpen(true);
  };

  // Download all completed MP3s
  const handleDownloadAll = () => {
    const completed = files.filter((f) => f.status === 'completed' && f.outputBlob);
    completed.forEach((item, index) => {
      setTimeout(() => {
        if (!item.outputBlob) return;
        const url = URL.createObjectURL(item.outputBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = item.outputFilename || `${item.name.replace(/\.[^/.]+$/, '')}.mp3`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, index * 400);
    });
  };

  const isAnyConverting = files.some((f) => f.status === 'converting' || f.status === 'loading-engine');
  const completedCount = files.filter((f) => f.status === 'completed').length;
  const pendingCount = files.filter((f) => f.status === 'idle' || f.status === 'error').length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Top Navigation */}
      <Navbar
        themeMode={mode}
        onThemeChange={setMode}
        engineStatus={engineStatus}
        engineProgressText={engineProgressText}
        onPreloadEngine={handlePreloadEngine}
      />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-bold mb-4 shadow-sm">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span>Zero Uploads • 100% In-Browser Privacy</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Convert <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-500">MP4 to MP3</span> Locally
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Extract high-fidelity MP3 audio straight from your browser with WebAssembly FFmpeg. 
            No cloud uploads, no server bandwidth limits, total data privacy.
          </p>

          {/* Quick Bitrate Selector Pills */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5 mr-1">
              <Sliders className="w-3.5 h-3.5" /> Default Bitrate:
            </span>
            {(['128k', '192k', '256k', '320k'] as Bitrate[]).map((br) => (
              <button
                key={br}
                onClick={() => handleGlobalBitrateChange(br)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  globalBitrate === br
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-indigo-300'
                }`}
              >
                {br}
                {br === '320k' && <span className="ml-1 text-[10px] opacity-90">★</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Drag and Drop Zone */}
        <Dropzone
          onFilesSelected={handleFilesSelected}
          disabled={isAnyConverting}
        />

        {/* Selected Files Queue */}
        {files.length > 0 && (
          <section className="mt-10 space-y-4">
            {/* Queue Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-2.5">
                <Music4 className="w-5 h-5 text-indigo-500" />
                <span className="font-bold text-slate-800 dark:text-slate-100 text-sm sm:text-base">
                  Conversion Queue ({files.length} {files.length === 1 ? 'file' : 'files'})
                </span>
                {completedCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                    {completedCount} Done
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {/* Global Logs trigger */}
                <button
                  type="button"
                  onClick={handleOpenGlobalLogs}
                  title="View FFmpeg Engine Console"
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                >
                  <Terminal className="w-4 h-4" />
                </button>

                {/* Clear All */}
                <button
                  type="button"
                  onClick={handleClearAll}
                  disabled={isAnyConverting}
                  className="px-3 py-2 rounded-xl text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Clear All</span>
                </button>

                {/* Download All if any completed */}
                {completedCount > 1 && (
                  <button
                    type="button"
                    onClick={handleDownloadAll}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download All ({completedCount})</span>
                  </button>
                )}

                {/* Convert All Pending */}
                {pendingCount > 0 && (
                  <button
                    type="button"
                    onClick={handleConvertAll}
                    disabled={isAnyConverting}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-indigo-600/20 active:scale-95 transition-all"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>Convert All ({pendingCount})</span>
                  </button>
                )}
              </div>
            </div>

            {/* List of File Cards */}
            <div className="space-y-4">
              {files.map((item) => (
                <FileCard
                  key={item.id}
                  item={item}
                  onConvert={convertFile}
                  onCancel={handleCancel}
                  onRemove={handleRemove}
                  onOptionsChange={handleOptionsChange}
                  onViewLogs={handleViewLogs}
                  isAnyConverting={isAnyConverting}
                />
              ))}
            </div>
          </section>
        )}

        {/* Features Banner */}
        <FeaturesBanner />

        {/* FAQ Section */}
        <FAQSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Terminal Logs Modal */}
      <LogsModal
        isOpen={isLogsOpen}
        onClose={() => setIsLogsOpen(false)}
        logs={activeLogs}
        title={activeLogsTitle}
        onClearLogs={() => {
          setActiveLogs([]);
          setGlobalLogs([]);
        }}
      />
    </div>
  );
};

export default App;
