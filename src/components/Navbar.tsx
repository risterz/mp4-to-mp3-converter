import React from 'react';
import { 
  Music, 
  ShieldCheck, 
  Sun, 
  Moon, 
  Monitor, 
  DownloadCloud, 
  CheckCircle2, 
  Loader2
} from 'lucide-react';
import type { ThemeMode } from '../hooks/useDarkMode';
import type { EngineStatus } from '../types';

interface NavbarProps {
  themeMode: ThemeMode;
  onThemeChange: (mode: ThemeMode) => void;
  engineStatus: EngineStatus;
  engineProgressText?: string;
  onPreloadEngine: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  themeMode,
  onThemeChange,
  engineStatus,
  engineProgressText,
  onPreloadEngine,
}) => {
  return (
    <header className="sticky top-0 z-50 glassmorphism border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 text-white flex items-center justify-center shadow-md shadow-indigo-500/25">
            <Music className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                SonicShift
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                WASM Core
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800">
                by risterz
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden xs:block">
              Client-Side MP4 to MP3 Audio Extractor • Created by risterz
            </p>
          </div>
        </div>

        {/* Center: Privacy Guarantee Pill */}
        <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900/60 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>100% In-Browser Media Conversion • Zero Server Uploads</span>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* WASM Engine Status / Preload Button */}
          {engineStatus === 'ready' ? (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-xs font-medium text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>FFmpeg Ready</span>
            </div>
          ) : engineStatus === 'loading' ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-xs font-medium text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 animate-pulse">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600" />
              <span className="truncate max-w-[130px]">{engineProgressText || 'Loading Core...'}</span>
            </div>
          ) : (
            <button
              onClick={onPreloadEngine}
              title="Preload FFmpeg WebAssembly core into browser cache now"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 text-xs font-medium transition-colors"
            >
              <DownloadCloud className="w-3.5 h-3.5" />
              <span>Preload Engine (~31MB)</span>
            </button>
          )}

          {/* Theme Mode Toggle (Light / Dark / System) */}
          <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => onThemeChange('light')}
              title="Light Mode"
              aria-label="Switch to light mode"
              className={`p-1.5 rounded-lg transition-colors ${
                themeMode === 'light'
                  ? 'bg-white text-amber-500 shadow-sm'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
            >
              <Sun className="w-4 h-4" />
            </button>
            <button
              onClick={() => onThemeChange('dark')}
              title="Dark Mode"
              aria-label="Switch to dark mode"
              className={`p-1.5 rounded-lg transition-colors ${
                themeMode === 'dark'
                  ? 'bg-slate-700 text-indigo-400 shadow-sm'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
            >
              <Moon className="w-4 h-4" />
            </button>
            <button
              onClick={() => onThemeChange('system')}
              title="Follow System Theme"
              aria-label="Switch to system theme"
              className={`p-1.5 rounded-lg transition-colors ${
                themeMode === 'system'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
            >
              <Monitor className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
