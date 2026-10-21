import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL } from '@ffmpeg/util';
import type { ConversionOptions, EngineStatus } from '../types';

export class FFmpegService {
  private static instance: FFmpegService | null = null;
  private ffmpeg: FFmpeg | null = null;
  private status: EngineStatus = 'unloaded';
  private loadPromise: Promise<FFmpeg> | null = null;
  private isConverting = false;
  private currentAbortController: AbortController | null = null;

  // Listeners
  private statusListeners: Set<(status: EngineStatus, message?: string) => void> = new Set();
  private logListeners: Set<(log: string) => void> = new Set();

  private constructor() {}

  public static getInstance(): FFmpegService {
    if (!FFmpegService.instance) {
      FFmpegService.instance = new FFmpegService();
    }
    return FFmpegService.instance;
  }

  public getStatus(): EngineStatus {
    return this.status;
  }

  public subscribeStatus(listener: (status: EngineStatus, message?: string) => void): () => void {
    this.statusListeners.add(listener);
    listener(this.status);
    return () => this.statusListeners.delete(listener);
  }

  public subscribeLogs(listener: (log: string) => void): () => void {
    this.logListeners.add(listener);
    return () => this.logListeners.delete(listener);
  }

  private setStatus(status: EngineStatus, message?: string) {
    this.status = status;
    this.statusListeners.forEach((fn) => fn(status, message));
  }

  private broadcastLog(message: string) {
    this.logListeners.forEach((fn) => fn(message));
  }

  /**
   * Lazy load the FFmpeg WASM core.
   * Only called when user initiates conversion or manually triggers preload.
   */
  public async load(onDownloadProgress?: (percent: number, text: string) => void): Promise<FFmpeg> {
    if (this.ffmpeg && this.status === 'ready') {
      return this.ffmpeg;
    }

    if (this.loadPromise) {
      return this.loadPromise;
    }

    this.setStatus('loading', 'Initializing FFmpeg engine...');
    this.broadcastLog('[System] Initiating FFmpeg WASM core download...');

    this.loadPromise = (async () => {
      const ffmpeg = new FFmpeg();

      ffmpeg.on('log', ({ message }) => {
        this.broadcastLog(`[FFmpeg] ${message}`);
      });

      const CDNs = [
        'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm',
        'https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.6/dist/esm',
      ];

      let lastError: Error | null = null;

      for (const baseURL of CDNs) {
        try {
          this.broadcastLog(`[System] Fetching WASM core from ${baseURL}...`);
          if (onDownloadProgress) {
            onDownloadProgress(10, 'Connecting to WASM repository...');
          }

          const coreURL = await toBlobURL(
            `${baseURL}/ffmpeg-core.js`,
            'text/javascript',
            true,
            (e) => {
              if (e.total && onDownloadProgress) {
                const pct = Math.min(Math.round((e.received / e.total) * 40), 40);
                onDownloadProgress(pct, `Loading runtime script (${pct}%)...`);
              }
            }
          );

          if (onDownloadProgress) {
            onDownloadProgress(40, 'Downloading WASM binary (~31MB)...');
          }

          const wasmURL = await toBlobURL(
            `${baseURL}/ffmpeg-core.wasm`,
            'application/wasm',
            true,
            (e) => {
              if (e.total && onDownloadProgress) {
                const pct = 40 + Math.min(Math.round((e.received / e.total) * 55), 55);
                onDownloadProgress(pct, `Downloading WASM binary (${pct}%)...`);
              }
            }
          );

          if (onDownloadProgress) {
            onDownloadProgress(95, 'Compiling WebAssembly module...');
          }

          await ffmpeg.load({
            coreURL,
            wasmURL,
          });

          this.ffmpeg = ffmpeg;
          this.setStatus('ready', 'Engine ready');
          this.broadcastLog('[System] FFmpeg WASM engine initialized and cached in browser memory.');
          if (onDownloadProgress) {
            onDownloadProgress(100, 'Engine ready!');
          }
          return ffmpeg;
        } catch (err: unknown) {
          const errMessage = err instanceof Error ? err.message : String(err);
          console.warn(`Failed loading from ${baseURL}:`, errMessage);
          this.broadcastLog(`[Warning] Failed loading from ${baseURL}: ${errMessage}. Attempting fallback...`);
          lastError = err instanceof Error ? err : new Error(errMessage);
        }
      }

      this.setStatus('error', 'Failed to load FFmpeg engine');
      this.loadPromise = null;
      throw lastError || new Error('Could not load FFmpeg WASM engine from any CDN source.');
    })();

    return this.loadPromise;
  }

  /**
   * Convert an MP4 or other video File to high quality MP3
   */
  public async convertToMp3(
    file: File,
    options: ConversionOptions,
    duration: number,
    onProgress: (percent: number, stage: string) => void,
    onLog?: (line: string) => void
  ): Promise<{ blob: Blob; filename: string }> {
    if (this.isConverting) {
      throw new Error('Another conversion is already in progress. Please wait.');
    }

    this.isConverting = true;
    this.currentAbortController = new AbortController();

    const startTime = performance.now();
    const tempInputName = `input_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
    const tempOutputName = `output_${Date.now()}.mp3`;

    try {
      // 1. Ensure engine is loaded
      onProgress(5, 'Preparing FFmpeg engine...');
      const ffmpeg = await this.load((pct, text) => {
        onProgress(Math.round(pct * 0.3), text);
      });

      if (this.currentAbortController?.signal.aborted) {
        throw new Error('Conversion cancelled by user.');
      }

      // Hook progress listener for this conversion
      const progressHandler = ({ progress, time }: { progress: number; time: number }) => {
        let pct = 0;
        if (duration > 0 && time > 0) {
          // time is in microseconds
          const currentSeconds = time / 1000000;
          pct = Math.min(Math.round((currentSeconds / duration) * 100), 98);
        } else if (progress > 0) {
          pct = Math.min(Math.round(progress * 100), 98);
        } else {
          pct = 45;
        }

        // Map FFmpeg execution to 30% - 95% range
        const mappedProgress = Math.min(30 + Math.round(pct * 0.65), 98);
        onProgress(mappedProgress, `Encoding MP3 @ ${options.bitrate}ps (${pct}%)...`);
      };

      const logHandler = ({ message }: { message: string }) => {
        this.broadcastLog(`[Worker] ${message}`);
        if (onLog) onLog(message);
      };

      ffmpeg.on('progress', progressHandler);
      ffmpeg.on('log', logHandler);

      // 2. Read file to memory and write to virtual filesystem
      onProgress(30, 'Reading video data into memory...');
      const fileData = new Uint8Array(await file.arrayBuffer());
      await ffmpeg.writeFile(tempInputName, fileData);

      if (this.currentAbortController?.signal.aborted) {
        throw new Error('Conversion cancelled by user.');
      }

      // 3. Build FFmpeg command arguments
      // e.g. ffmpeg -i input.mp4 -vn -c:a libmp3lame -b:a 320k output.mp3
      const args: string[] = ['-i', tempInputName];

      // Trimming
      if (options.trim.enabled && options.trim.end > options.trim.start) {
        args.push('-ss', options.trim.start.toFixed(2));
        args.push('-to', options.trim.end.toFixed(2));
      }

      // Strip video
      args.push('-vn');

      // Audio codec: libmp3lame
      args.push('-c:a', 'libmp3lame');

      // Bitrate
      args.push('-b:a', options.bitrate);

      // Channels
      if (options.channels === 'stereo') {
        args.push('-ac', '2');
      } else if (options.channels === 'mono') {
        args.push('-ac', '1');
      }

      // Sample Rate
      if (options.sampleRate !== 'original') {
        args.push('-ar', options.sampleRate);
      }

      // Volume Filter
      if (options.volume !== 1.0) {
        args.push('-filter:a', `volume=${options.volume.toFixed(2)}`);
      }

      // ID3 Metadata
      if (options.metadata.title) {
        args.push('-metadata', `title=${options.metadata.title}`);
      }
      if (options.metadata.artist) {
        args.push('-metadata', `artist=${options.metadata.artist}`);
      }
      if (options.metadata.album) {
        args.push('-metadata', `album=${options.metadata.album}`);
      }
      if (options.metadata.year) {
        args.push('-metadata', `date=${options.metadata.year}`);
      }
      args.push('-id3v2_version', '3', '-write_id3v1', '1');

      // Output file
      args.push(tempOutputName);

      onProgress(40, `Extracting audio stream & encoding to MP3 (${options.bitrate})...`);
      this.broadcastLog(`[Exec] ffmpeg ${args.join(' ')}`);

      // 4. Run FFmpeg command
      const exitCode = await ffmpeg.exec(args);

      if (exitCode !== 0) {
        throw new Error(`FFmpeg exited with error code ${exitCode}. Check terminal logs.`);
      }

      // 5. Read converted file
      onProgress(98, 'Finalizing MP3 tags and buffer...');
      const outputData = await ffmpeg.readFile(tempOutputName);

      // 6. Clean up virtual filesystem
      try {
        await ffmpeg.deleteFile(tempInputName);
        await ffmpeg.deleteFile(tempOutputName);
      } catch (cleanErr) {
        console.warn('Virtual FS cleanup note:', cleanErr);
      }

      // 7. Cleanup listeners
      ffmpeg.off('progress', progressHandler);
      ffmpeg.off('log', logHandler);

      // Determine output filename
      const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
      const finalFilename = options.customFilename?.trim()
        ? (options.customFilename.endsWith('.mp3') ? options.customFilename : `${options.customFilename}.mp3`)
        : `${baseName}.mp3`;

      // Create MP3 Blob
      const uint8 = outputData instanceof Uint8Array ? new Uint8Array(outputData) : new TextEncoder().encode(outputData as string);
      const blob = new Blob([uint8.buffer as ArrayBuffer], { type: 'audio/mp3' });
      const elapsed = ((performance.now() - startTime) / 1000).toFixed(1);
      this.broadcastLog(`[Success] Conversion completed in ${elapsed}s! Output size: ${(blob.size / 1024 / 1024).toFixed(2)} MB`);

      onProgress(100, 'Conversion completed!');
      return { blob, filename: finalFilename };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      this.broadcastLog(`[Error] ${msg}`);
      throw err;
    } finally {
      this.isConverting = false;
      this.currentAbortController = null;
    }
  }

  /**
   * Cancel ongoing conversion and restart worker if necessary
   */
  public async abortConversion(): Promise<void> {
    if (this.currentAbortController) {
      this.currentAbortController.abort();
    }
    if (this.ffmpeg) {
      try {
        await this.ffmpeg.terminate();
        this.ffmpeg = null;
        this.loadPromise = null;
        this.setStatus('unloaded', 'Engine terminated');
        this.broadcastLog('[System] Conversion cancelled. FFmpeg instance recycled.');
      } catch (e) {
        console.warn('Error during engine terminate:', e);
      }
    }
    this.isConverting = false;
  }
}

export const ffmpegService = FFmpegService.getInstance();
