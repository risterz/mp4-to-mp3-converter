import React from 'react';
import { Music, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-950 py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand & Author */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-sm">
              <Music className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-800 dark:text-slate-100 text-base">
                  SonicShift
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  by risterz
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Production-grade, private client-side MP4 to MP3 converter.
              </p>
            </div>
          </div>

          {/* Privacy statement */}
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 px-4 py-2 rounded-full border border-slate-200 dark:border-slate-800">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Zero server uploads • 100% In-Browser WebAssembly</span>
          </div>

          {/* Maker Attribution & Credits */}
          <div className="text-xs text-slate-500 dark:text-slate-400 flex flex-col sm:flex-row items-center gap-1.5 sm:gap-3">
            <span className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
              Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-current inline" /> by <strong className="text-indigo-600 dark:text-indigo-400">risterz</strong>
            </span>
            <span className="hidden sm:inline">•</span>
            <span>Powered by FFmpeg.wasm & Cloudflare</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
