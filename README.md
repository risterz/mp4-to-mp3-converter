# SonicShift 🎵

> **Production-ready, 100% client-side MP4 to MP3 audio converter** built by **risterz** using **React 19**, **TypeScript**, **Tailwind CSS v4**, and **FFmpeg.wasm**.

All media processing is performed directly in the user's browser via WebAssembly (WASM). No video or audio files are ever uploaded or transmitted to any server.

---

## ⚡ Key Features

- **🔒 100% Client-Side & Private**: All conversion logic runs within the browser sandbox using FFmpeg compiled to WebAssembly. Zero telemetry on user files.
- **⚡ Lazy-Loaded WASM Core**: The ~31MB FFmpeg WebAssembly binary is not loaded on initial page load. It is downloaded on-demand only when a user starts conversion or explicitly clicks "Preload Engine", ensuring ultra-fast initial page load times.
- **🎚️ Studio Bitrate Selection**:
  - `128 kbps` (Compact — best for voice notes, audiobooks, and lectures)
  - `192 kbps` (Standard High Quality — balanced for podcasts and videos)
  - `256 kbps` (Very High Quality — rich dynamic range)
  - `320 kbps` (Studio Master Quality — pristine fidelity)
- **✂️ Audio Trimming & Range Cut**: Extract specific sections of audio by setting start and end timestamps.
- **🏷️ ID3v2 Metadata Tagging**: Embed Track Title, Artist, Album, and Release Year directly into the MP3 file, compatible with Spotify local files, Apple Music, and car audio systems.
- **🔊 Output Customization**: Channels (Stereo/Mono), Sample Rate (Source/44.1kHz/48kHz), and Volume boost slider (50% to 200%).
- **🎛️ Interactive In-Browser Audio Player**:
  - Live Audio Spectrum Visualizer powered by Web Audio API (`AnalyserNode`)
  - Play, pause, scrub timeline, loop, volume, and playback speed (0.75x to 2x)
  - Compression metrics badge (e.g., `-92% smaller, 45 MB saved`)
  - Instant MP3 download and mobile Web Share API integration
- **📁 Multi-File & Drag-and-Drop**:
  - Drag and drop files from desktop
  - Native file picker
  - Clipboard paste support (`Ctrl+V`)
  - Automatic video thumbnail and duration extraction
  - Convert individually or batch convert all files
- **🌓 Dark Mode**: Seamless Light / Dark / System mode toggle persisted in `localStorage`.
- **💻 Real-Time FFmpeg Console**: Collapsible interactive terminal displaying raw FFmpeg log output, copy logs, and text export.
- **♿ Accessible & Mobile-First**: Built with semantic HTML, ARIA attributes, keyboard navigation, and responsive layouts across phones, tablets, and desktops.

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/) + [Vite 8](https://vite.dev/)
- **Language**: [TypeScript 5.8+](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Media Engine**: [@ffmpeg/ffmpeg](https://github.com/ffmpegwasm/ffmpeg.wasm) v0.12 + `@ffmpeg/util` + `@ffmpeg/core`
- **Audio Processing**: HTML5 Web Audio API (`AudioContext`, `AnalyserNode`)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Hosting Target**: [Cloudflare Pages](https://pages.cloudflare.com/)

---

## 🚀 Live Demo

👉 **[https://mp4-to-mp3-converter.harisharraz02.workers.dev](https://mp4-to-mp3-converter.harisharraz02.workers.dev)**

---

## 📄 License

MIT License. Free for personal and commercial use.
