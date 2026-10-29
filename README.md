<div align="center">

# SonicShift 🎵

**Fast, private, 100% client-side MP4 to MP3 converter powered by WebAssembly.**

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-sonicshift--mp3.pages.dev-6366f1?style=for-the-badge&logo=cloudflarepages&logoColor=white)](https://sonicshift-mp3.pages.dev)
[![React 19](https://img.shields.io/badge/React-19-20232a?style=for-the-badge&logo=react&logoColor=61dafb)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178c6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

<h3>

[👉 Launch Web App: sonicshift-mp3.pages.dev](https://sonicshift-mp3.pages.dev)

</h3>

</div>

---

## ⚡ Overview

**SonicShift** extracts high-fidelity MP3 audio from MP4 files locally in your browser. Created by **[risterz](https://github.com/risterz)** using FFmpeg compiled to WebAssembly (`ffmpeg.wasm`). Zero files leave your machine.

- **Production App**: [https://sonicshift-mp3.pages.dev](https://sonicshift-mp3.pages.dev)
- **Deployment Platform**: Cloudflare Pages

---

## ✨ Features

### 🔒 100% Client-Side Privacy
- **Zero Server Uploads**: Audio extraction runs entirely inside browser Web Workers via WebAssembly.
- **Zero Telemetry on Files**: Your media files never touch a remote server.
- **Lazy-Loaded WASM Core**: The ~31 MB FFmpeg binary downloads only on first conversion or manual preload, preserving initial load speed.

### 🎚️ Audio Tuning & Encoding
- **Studio Bitrate Control**:
  - `128 kbps` — Voice recordings, audiobooks, lectures (compact file size)
  - `192 kbps` — Standard balance for podcasts and videos
  - `256 kbps` — High-fidelity music with wide dynamic range
  - `320 kbps` — Studio master quality
- **Audio Trimmer**: Precision start and end timestamps to extract selected segments.
- **ID3v2 Metadata Tagging**: Embed Track Title, Artist, Album, and Release Year directly into output MP3 files for compatibility with Spotify Local Files, Apple Music, and vehicle media systems.
- **Audio Customization**: Channel selection (Stereo / Mono), sample rate targeting (44.1 kHz / 48 kHz), and volume boost control (50% – 200%).

### 🎛️ Interactive Audio Player & Visualizer
- **Live Spectrum Visualizer**: Frequency spectrum display powered by Web Audio API (`AnalyserNode`).
- **Complete Playback Controls**: Scrub timeline, loop toggle, volume control, and speed adjustment (0.75x to 2x).
- **Compression Metrics**: Real-time savings badge (e.g. `-92% smaller, 45 MB saved`).
- **Instant Export**: Direct MP3 download and mobile Web Share API integration.

### 📁 Streamlined Workflow
- **Flexible Ingestion**: Drag-and-drop from desktop, native file picker, or clipboard paste (`Ctrl+V`).
- **Batch Processing**: Convert individually or process an entire queue at once.
- **Video Previews**: Automatic thumbnail generation and duration detection.
- **FFmpeg Debug Console**: Collapsible interactive terminal showing real-time FFmpeg logs, copy button, and log export.
- **Theme & Responsiveness**: Light, Dark, and System theme with `localStorage` persistence. Fully responsive on mobile, tablet, and desktop.

---

## 🛠️ Tech Stack

| Component | Technology | Description |
|---|---|---|
| **Framework** | [React 19](https://react.dev/) | Modern reactive component architecture |
| **Bundler** | [Vite 8](https://vite.dev/) | Fast build tool and dev server |
| **Language** | [TypeScript 5.8+](https://www.typescriptlang.org/) | Type-safe development |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) | Modern CSS utility framework |
| **Media Engine** | [@ffmpeg/ffmpeg](https://github.com/ffmpegwasm/ffmpeg.wasm) (v0.12) | In-browser WebAssembly FFmpeg port |
| **Audio Processing** | Web Audio API | Live audio analysis and visualization |
| **Icons** | [Lucide React](https://lucide.dev/) | Clean, accessible iconography |
| **Hosting** | [Cloudflare Pages](https://pages.cloudflare.com/) | Edge static hosting |

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- `npm`, `pnpm`, or `yarn`

### Setup & Local Development

1. **Clone repository**:
   ```bash
   git clone https://github.com/risterz/mp4-to-mp3-converter.git
   cd mp4-to-mp3-converter
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

4. **Build production bundle**:
   ```bash
   npm run build
   ```

5. **Preview locally with Wrangler**:
   ```bash
   npm run preview
   ```

---

## 🌐 Browser Requirements

Requires a modern browser supporting WebAssembly and `SharedArrayBuffer`:
- Chrome, Edge, Brave (Chromium-based)
- Firefox
- Safari (iOS 15.2+, macOS 15.2+)

> [!NOTE]
> `SharedArrayBuffer` requires Cross-Origin-Opener-Policy (`same-origin`) and Cross-Origin-Embedder-Policy (`require-corp`) headers, pre-configured in [public/_headers](file:///D:/Antigravity/mp4-to-mp3-converter/public/_headers).

---

## 📄 License

Distributed under the [MIT License](https://opensource.org/licenses/MIT). Free for personal and commercial use.

---

## 👤 Author

Crafted by **[risterz](https://github.com/risterz)**.
