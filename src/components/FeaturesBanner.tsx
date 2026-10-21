import React from 'react';
import { 
  Zap, 
  SlidersHorizontal, 
  Lock, 
  WifiOff 
} from 'lucide-react';

export const FeaturesBanner: React.FC = () => {
  const features = [
    {
      icon: <Lock className="w-5 h-5 text-indigo-500" />,
      title: '100% Private & Local',
      description: 'Your media files never leave your computer. All processing happens entirely inside your browser memory.',
    },
    {
      icon: <Zap className="w-5 h-5 text-amber-500" />,
      title: 'WebAssembly Accelerated',
      description: 'Powered by official FFmpeg compiled to WASM. Enjoy high-performance conversion without installing software.',
    },
    {
      icon: <SlidersHorizontal className="w-5 h-5 text-indigo-500" />,
      title: 'Studio Bitrates (320 kbps)',
      description: 'Fine-tune output quality from compact 128 kbps to maximum fidelity 320 kbps with custom sample rates.',
    },
    {
      icon: <WifiOff className="w-5 h-5 text-emerald-500" />,
      title: 'Offline Capable',
      description: 'Once the WASM core is cached by your browser, conversions work flawlessly even without an internet connection.',
    },
  ];

  return (
    <section className="mt-16 pt-12 border-t border-slate-200/80 dark:border-slate-800/80">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          Why Convert In-Browser with SonicShift?
        </h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Traditional online converters upload your personal videos to remote third-party servers. 
          SonicShift runs FFmpeg directly on your device.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feat, idx) => (
          <div
            key={idx}
            className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-indigo-300 dark:hover:border-indigo-900/60 transition-all group"
          >
            <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              {feat.icon}
            </div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
              {feat.title}
            </h3>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {feat.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};
