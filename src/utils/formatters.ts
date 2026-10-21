export function formatBytes(bytes: number, decimals = 1): string {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function formatDuration(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '00:00';
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hrs > 0) {
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function formatBitrate(bitrate: string): string {
  switch (bitrate) {
    case '128k':
      return '128 kbps (Standard)';
    case '192k':
      return '192 kbps (High Quality)';
    case '256k':
      return '256 kbps (Very High)';
    case '320k':
      return '320 kbps (Studio Master)';
    default:
      return `${bitrate}ps`;
  }
}

export function sanitizeFilename(filename: string): string {
  return filename.replace(/[^a-zA-Z0-9-_. ]/g, '_');
}

export function generateOutputFilename(originalName: string, customName?: string): string {
  if (customName && customName.trim()) {
    const trimmed = customName.trim();
    return trimmed.toLowerCase().endsWith('.mp3') ? trimmed : `${trimmed}.mp3`;
  }
  const lastDot = originalName.lastIndexOf('.');
  const baseName = lastDot !== -1 ? originalName.substring(0, lastDot) : originalName;
  return `${baseName}.mp3`;
}
