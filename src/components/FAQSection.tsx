import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: 'Are my videos or files uploaded to any server or cloud?',
    answer: 'Never. Unlike conventional online converters that send your files to remote servers, SonicShift executes 100% inside your browser sandbox using FFmpeg compiled to WebAssembly (WASM). Your media never leaves your device, guaranteeing total privacy and security for personal or sensitive videos.',
  },
  {
    question: 'What bitrate should I choose (128k vs 192k vs 256k vs 320k)?',
    answer: '128 kbps is compact and ideal for voice recordings, lectures, and audiobooks (~1MB per minute). 192 kbps and 256 kbps deliver balanced high quality for general music and podcasts. 320 kbps provides maximum MP3 studio fidelity with indistinguishable transparency from CD audio.',
  },
  {
    question: 'Why does the initial conversion take a few moments before starting?',
    answer: 'To ensure ultra-fast initial page loads, SonicShift does not download the WebAssembly engine until you actually request a conversion. On the very first run, it downloads the ~31 MB FFmpeg WebAssembly core once. Your browser caches it so subsequent conversions start almost instantaneously.',
  },
  {
    question: 'Is there any file size limit?',
    answer: 'There are no artificial server limits or paywalls. Conversion capacity is bound only by your device’s available browser memory (RAM). Most desktop and mobile browsers can easily process files up to 1GB to 2GB.',
  },
  {
    question: 'Can I trim the audio before downloading?',
    answer: 'Yes! Expand the settings drawer on any file card, enable the "Trim Range" option, and set your desired Start and End timecodes. FFmpeg will encode only the selected section into the output MP3.',
  },
  {
    question: 'Can I add custom ID3 metadata tags (Artist, Title, Album)?',
    answer: 'Yes! Inside the conversion settings drawer, you can specify custom Track Title, Artist Name, Album, and Release Year. These are embedded directly into standard ID3v2 tags compatible with Apple Music, Spotify local files, iTunes, Windows Media Player, and car audio systems.',
  },
];

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="mt-16 pt-12 border-t border-slate-200/80 dark:border-slate-800/80 mb-12">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-3">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Frequently Asked Questions</span>
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          Everything You Need to Know
        </h2>
      </div>

      <div className="max-w-3xl mx-auto space-y-3">
        {FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden transition-colors"
            >
              <button
                type="button"
                onClick={() => toggle(idx)}
                aria-expanded={isOpen}
                className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-semibold text-slate-800 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                <span className="text-sm sm:text-base">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-indigo-600 dark:text-indigo-400' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-4 pb-5 sm:px-5 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 pt-3">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
