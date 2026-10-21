export type Bitrate = '128k' | '192k' | '256k' | '320k';
export type AudioChannels = 'original' | 'stereo' | 'mono';
export type SampleRate = 'original' | '44100' | '48000';

export interface AudioMetadata {
  title: string;
  artist: string;
  album: string;
  year: string;
}

export interface TrimRange {
  enabled: boolean;
  start: number; // in seconds
  end: number;   // in seconds
}

export interface ConversionOptions {
  bitrate: Bitrate;
  channels: AudioChannels;
  sampleRate: SampleRate;
  volume: number; // 1 = 100%, 1.5 = 150%, 0.5 = 50%
  trim: TrimRange;
  metadata: AudioMetadata;
  customFilename?: string;
}

export type FileStatus = 
  | 'idle'
  | 'loading-engine'
  | 'converting'
  | 'completed'
  | 'error'
  | 'aborted';

export interface MediaFileItem {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  duration: number; // in seconds
  thumbnailUrl?: string;
  status: FileStatus;
  progress: number; // 0 to 100
  stage: string;
  outputBlob?: Blob;
  outputUrl?: string;
  outputSize?: number;
  outputFilename?: string;
  errorMessage?: string;
  conversionTime?: number; // duration in seconds it took to convert
  options: ConversionOptions;
  logs: string[];
}

export type EngineStatus = 'unloaded' | 'loading' | 'ready' | 'error';

export interface EngineProgress {
  ratio: number;
  message: string;
}
