export interface VideoMetadata {
  duration: number;
  width: number;
  height: number;
  thumbnailUrl?: string;
}

export function extractVideoMetadata(file: File): Promise<VideoMetadata> {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    const objectUrl = URL.createObjectURL(file);
    video.preload = 'metadata';
    video.muted = true;
    video.playsInline = true;
    video.src = objectUrl;

    let resolved = false;

    const cleanup = () => {
      URL.revokeObjectURL(objectUrl);
      video.remove();
    };

    const finish = (metadata: VideoMetadata) => {
      if (!resolved) {
        resolved = true;
        cleanup();
        resolve(metadata);
      }
    };

    // Timeout safety net in case format is partially unsupported by native browser preview
    const timeoutId = setTimeout(() => {
      finish({
        duration: 0,
        width: 0,
        height: 0,
      });
    }, 4000);

    video.onloadedmetadata = () => {
      const duration = video.duration || 0;
      // Capture a thumbnail snapshot at ~1s or midpoint
      const seekTime = Math.min(1.0, duration > 0 ? duration / 2 : 0);
      video.currentTime = seekTime;
    };

    video.onseeked = () => {
      clearTimeout(timeoutId);
      try {
        const canvas = document.createElement('canvas');
        canvas.width = Math.min(video.videoWidth || 320, 640);
        canvas.height = (video.videoHeight / (video.videoWidth || 1)) * canvas.width || 360;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const thumbnailUrl = canvas.toDataURL('image/jpeg', 0.85);
          finish({
            duration: video.duration || 0,
            width: video.videoWidth || 0,
            height: video.videoHeight || 0,
            thumbnailUrl,
          });
          return;
        }
      } catch (err) {
        console.warn('Could not generate canvas thumbnail:', err);
      }

      finish({
        duration: video.duration || 0,
        width: video.videoWidth || 0,
        height: video.videoHeight || 0,
      });
    };

    video.onerror = () => {
      clearTimeout(timeoutId);
      finish({
        duration: 0,
        width: 0,
        height: 0,
      });
    };
  });
}
