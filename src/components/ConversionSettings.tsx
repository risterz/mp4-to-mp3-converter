import React from 'react';
import { 
  Sliders, 
  Music2, 
  Scissors, 
  Tag, 
  Volume2, 
  RotateCcw,
  Sparkles,
  FileText
} from 'lucide-react';
import type { ConversionOptions, Bitrate, AudioChannels, SampleRate } from '../types';
import { formatDuration } from '../utils/formatters';

interface ConversionSettingsProps {
  options: ConversionOptions;
  onChange: (options: ConversionOptions) => void;
  videoDuration?: number;
  originalName?: string;
}

const BITRATE_OPTIONS: { value: Bitrate; label: string; desc: string; badge?: string }[] = [
  { value: '128k', label: '128 kbps', desc: 'Compact file size, best for speech & podcasts' },
  { value: '192k', label: '192 kbps', desc: 'Standard high quality, balanced size & clarity' },
  { value: '256k', label: '256 kbps', desc: 'Very high fidelity, rich dynamics' },
  { value: '320k', label: '320 kbps', desc: 'Maximum Studio Master quality (Recommended)', badge: 'Best Quality' },
];

export const ConversionSettings: React.FC<ConversionSettingsProps> = ({
  options,
  onChange,
  videoDuration = 0,
}) => {
  const handleBitrateSelect = (bitrate: Bitrate) => {
    onChange({ ...options, bitrate });
  };

  const handleChannelsSelect = (channels: AudioChannels) => {
    onChange({ ...options, channels });
  };

  const handleSampleRateSelect = (sampleRate: SampleRate) => {
    onChange({ ...options, sampleRate });
  };

  const handleVolumeChange = (volume: number) => {
    onChange({ ...options, volume });
  };

  const handleTrimToggle = (enabled: boolean) => {
    onChange({
      ...options,
      trim: {
        ...options.trim,
        enabled,
        end: enabled && options.trim.end === 0 && videoDuration > 0 ? videoDuration : options.trim.end,
      },
    });
  };

  const handleMetadataChange = (key: keyof ConversionOptions['metadata'], value: string) => {
    onChange({
      ...options,
      metadata: {
        ...options.metadata,
        [key]: value,
      },
    });
  };

  const handleCustomFilenameChange = (customFilename: string) => {
    onChange({ ...options, customFilename });
  };

  const resetDefaults = () => {
    onChange({
      bitrate: '320k',
      channels: 'stereo',
      sampleRate: 'original',
      volume: 1.0,
      trim: { enabled: false, start: 0, end: videoDuration || 0 },
      metadata: { title: '', artist: '', album: '', year: '' },
      customFilename: '',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 text-slate-800 dark:text-slate-100 font-bold">
          <Sliders className="w-5 h-5 text-indigo-500" />
          <span>Audio Output Settings</span>
        </div>
        <button
          onClick={resetDefaults}
          className="text-xs text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Defaults</span>
        </button>
      </div>

      {/* Bitrate Selection */}
      <div className="space-y-3">
        <label className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Music2 className="w-4 h-4 text-indigo-500" />
            Audio Bitrate
          </span>
          <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
            Selected: <strong className="text-indigo-600 dark:text-indigo-400">{options.bitrate}ps</strong>
          </span>
        </label>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {BITRATE_OPTIONS.map((item) => {
            const isSelected = options.bitrate === item.value;
            return (
              <button
                key={item.value}
                type="button"
                onClick={() => handleBitrateSelect(item.value)}
                className={`p-3.5 rounded-xl text-left border transition-all relative ${
                  isSelected
                    ? 'bg-indigo-50/80 dark:bg-indigo-950/60 border-indigo-500 ring-2 ring-indigo-500/20 text-slate-900 dark:text-slate-100'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm">{item.label}</span>
                  {item.badge && (
                    <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-md bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      {item.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                  {item.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Channels & Sample Rate */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Audio Channels */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Audio Channels
          </label>
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl">
            {(['original', 'stereo', 'mono'] as AudioChannels[]).map((ch) => (
              <button
                key={ch}
                type="button"
                onClick={() => handleChannelsSelect(ch)}
                className={`py-1.5 text-xs font-medium rounded-lg capitalize transition-all ${
                  options.channels === ch
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {ch}
              </button>
            ))}
          </div>
        </div>

        {/* Sample Rate */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Sample Rate
          </label>
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl">
            {(['original', '44100', '48000'] as SampleRate[]).map((sr) => (
              <button
                key={sr}
                type="button"
                onClick={() => handleSampleRateSelect(sr)}
                className={`py-1.5 text-xs font-medium rounded-lg transition-all ${
                  options.sampleRate === sr
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {sr === 'original' ? 'Source' : sr === '44100' ? '44.1 kHz' : '48 kHz'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Volume Level Slider */}
      <div className="space-y-2 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Volume2 className="w-4 h-4 text-indigo-500" />
            Volume Output Level
          </span>
          <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
            {Math.round(options.volume * 100)}%
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-slate-400">50%</span>
          <input
            type="range"
            min={0.5}
            max={2.0}
            step={0.05}
            value={options.volume}
            onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
            aria-label="Output volume percentage"
            className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
          <span className="text-[11px] text-slate-400">200%</span>
        </div>
      </div>

      {/* Optional Audio Trimming */}
      <div className="space-y-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 cursor-pointer">
            <Scissors className="w-4 h-4 text-indigo-500" />
            <span>Trim / Cut Specific Range (Optional)</span>
          </label>
          <input
            type="checkbox"
            checked={options.trim.enabled}
            onChange={(e) => handleTrimToggle(e.target.checked)}
            className="w-4 h-4 text-indigo-600 rounded border-slate-300 dark:border-slate-700 focus:ring-indigo-500"
          />
        </div>

        {options.trim.enabled && (
          <div className="pt-2 grid grid-cols-2 gap-3">
            <div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">
                Start Time (sec)
              </span>
              <input
                type="number"
                min={0}
                max={videoDuration || 3600}
                step={0.5}
                value={options.trim.start}
                onChange={(e) =>
                  onChange({
                    ...options,
                    trim: { ...options.trim, start: Math.max(0, parseFloat(e.target.value) || 0) },
                  })
                }
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono text-slate-900 dark:text-slate-100"
              />
              <span className="text-[10px] text-slate-400 block mt-0.5">
                {formatDuration(options.trim.start)}
              </span>
            </div>

            <div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">
                End Time (sec)
              </span>
              <input
                type="number"
                min={options.trim.start || 0}
                max={videoDuration || 3600}
                step={0.5}
                value={options.trim.end || videoDuration || 0}
                onChange={(e) =>
                  onChange({
                    ...options,
                    trim: { ...options.trim, end: Math.max(0, parseFloat(e.target.value) || 0) },
                  })
                }
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono text-slate-900 dark:text-slate-100"
              />
              <span className="text-[10px] text-slate-400 block mt-0.5">
                {formatDuration(options.trim.end || videoDuration || 0)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ID3 Metadata & Custom Filename */}
      <div className="space-y-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200">
          <Tag className="w-4 h-4 text-indigo-500" />
          <span>MP3 Tags & Filename (ID3v2)</span>
        </div>

        {/* Custom Output Filename */}
        <div>
          <label className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1 flex items-center gap-1">
            <FileText className="w-3.5 h-3.5" />
            Custom Filename (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g. MyPodcast_Episode_1"
            value={options.customFilename || ''}
            onChange={(e) => handleCustomFilenameChange(e.target.value)}
            className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100"
          />
        </div>

        {/* Tags Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <input
            type="text"
            placeholder="Track Title"
            value={options.metadata.title}
            onChange={(e) => handleMetadataChange('title', e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100"
          />
          <input
            type="text"
            placeholder="Artist Name"
            value={options.metadata.artist}
            onChange={(e) => handleMetadataChange('artist', e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100"
          />
          <input
            type="text"
            placeholder="Album"
            value={options.metadata.album}
            onChange={(e) => handleMetadataChange('album', e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100"
          />
          <input
            type="text"
            placeholder="Year (e.g. 2026)"
            value={options.metadata.year}
            onChange={(e) => handleMetadataChange('year', e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100"
          />
        </div>
      </div>
    </div>
  );
};
