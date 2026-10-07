# NovaRip Studio — YouTube MP3 & MP4 Converter & Downloader

NovaRip Studio is a sleek, modern, futuristic web application designed to download YouTube videos in **MP4** (from 360p up to **4K 2160p Ultra HD**) and convert them to **MP3** (from 128kbps up to **320kbps Studio Hi-Fi**) or lossless audio formats.

Engineered with 100% static client-side web technologies (HTML5, CSS3, ES6 JavaScript), NovaRip Studio is **ready for instant deployment on GitHub Pages** with zero build configuration or npm servers required.

---

## ✨ Key Features

- 🎬 **MP4 Video Downloads at Any Quality**:
  - **4K 2160p** (Ultra HD)
  - **2K 1440p** (Quad HD)
  - **1080p 60fps** (Full HD)
  - **720p** (HD Standard)
  - **480p / 360p** (Data Saver)
  - Multi-codec support: **H.264** (max compatibility), **AV1**, and **VP9**.

- 🎵 **High-Fidelity Audio Extraction**:
  - **MP3 Bitrates**: 320 kbps (Studio), 256 kbps, 192 kbps, 128 kbps.
  - **Multiple Containers**: MP3, Apple AAC (M4A), Lossless FLAC, WAV, and OPUS.

- ⚡ **Dual Download Architecture**:
  1. **Direct API Downloader**: Connects to Cobalt media clusters and custom proxy backends with live progress bar and direct browser download trigger.
  2. **yt-dlp Pro Studio**: The gold standard for zero-throttling downloads. Live interactive command generator for **Windows (PowerShell / CMD)** and **macOS / Linux (Bash)**, plus 1-click downloadable `.bat` and `.sh` launcher scripts!

- 🔍 **Live Video Inspector & Embedded Player**:
  - Live metadata resolution (Title, Channel, Video ID) via CORS-friendly oEmbed.
  - High-res thumbnail preview with automatic fallback.
  - Embedded player toggle to watch videos before downloading.

- 💾 **Local Storage History & Queue**:
  - Automatically records recently inspected and downloaded videos with one-click reload.

- 🎨 **Futuristic Cyber Aesthetics**:
  - Dark-mode glassmorphism design with animated glow orbs.
  - Premium Google Fonts (`Outfit`, `Inter`, `JetBrains Mono`).
  - Smooth micro-animations and responsive mobile-first layout.

---

## 🚀 How to Deploy to GitHub Pages (2 Minutes)

Because NovaRip Studio is a pure static web app, deploying it to GitHub Pages is completely free and takes under 2 minutes:

### Step 1: Create a GitHub Repository
1. Go to [github.com/new](https://github.com/new).
2. Name your repository (e.g. `youtube-downloader` or `novarip-studio`).
3. Set visibility to **Public** (or Private if you have GitHub Pro).

### Step 2: Push the Files
Open your terminal inside this project folder (`mp4`) and run:

```bash
# Initialize git repository
git init

# Add all files
git add .

# Create your first commit
git commit -m "Initial commit - NovaRip Studio"

# Set branch to main
git branch -M main

# Link to your remote GitHub repository
git remote add origin https://github.com/<YOUR-USERNAME>/<YOUR-REPO>.git

# Push to GitHub
git push -u origin main
```

### Step 3: Enable GitHub Pages
1. In your GitHub repository, click on **Settings** (top tab).
2. In the left sidebar, click on **Pages**.
3. Under **Build and deployment > Source**:
   - **Option A (Recommended)**: Select **GitHub Actions** (the included `.github/workflows/deploy.yml` workflow will automatically build and deploy your site on every push).
   - **Option B**: Select **Deploy from a branch**, choose `main` and `/ (root)`, then click **Save**.

### Step 4: Access Your Live App
Your app will be live within 60 seconds at:
```
https://<YOUR-USERNAME>.github.io/<YOUR-REPO>/
```

---

## 🌐 Custom Backend & Proxy Setup (Optional)

Due to browser CORS policies and YouTube's frequent bot-detection updates, direct in-browser downloads from public endpoints may occasionally experience rate limiting. NovaRip Studio includes two free companion backends:

### 1. Cloudflare Worker (100,000 Free Requests/Day)
A ready-to-deploy Cloudflare Worker script is included in `backend/worker.js`:
1. Log into your [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. Go to **Workers & Pages > Create Application > Create Worker**.
3. Replace the default code with the contents of `backend/worker.js`.
4. Click **Deploy**.
5. In NovaRip Studio, click the **Settings** icon (top right) and paste your worker URL into the **Cloudflare Worker Proxy URL** field.

### 2. Local / VPS Node.js Server
A companion Express server is included in `backend/server.js`:
```bash
cd backend
npm install
npm start
```
Runs at `http://localhost:3000`.

---

## 💻 yt-dlp Quick Setup (For Pro Studio)

If you use the built-in **yt-dlp Pro Studio** tab:
- **Windows**: Run `winget install yt-dlp` in PowerShell, or download `yt-dlp.exe` from [yt-dlp releases](https://github.com/yt-dlp/yt-dlp/releases).
- **macOS**: Run `brew install yt-dlp`.
- **Linux (Ubuntu/Debian)**: Run `sudo apt install yt-dlp` or `pip install yt-dlp`.

---

## ⚖️ Disclaimer

NovaRip Studio is created for personal, non-commercial, and educational purposes. Please adhere to YouTube's Terms of Service and respect copyright laws in your jurisdiction. Only download content that you own, have permission to use, or that is distributed under a Creative Commons / Public Domain license.

---

**Developed with ❤️ using HTML5, CSS3 & ES6 JavaScript.**
