/**
 * NovaRip Studio — yt-dlp Pro Command & Script Generator
 * Generates one-line terminal commands and downloadable automation scripts.
 */

const YtDlpStudio = (() => {
  function generateCommand(videoData, options, platform = 'powershell') {
    const { rawUrl } = videoData;
    const { type, quality, bitrate, audioFormat, embedThumb, embedMeta, embedSubs } = options;

    let args = [];

    if (type === 'video') {
      const height = quality === 'max' ? '' : `[height<=${quality}]`;
      args.push(`-f "bestvideo${height}[ext=mp4]+bestaudio[ext=m4a]/bestvideo${height}+bestaudio/best${height}"`);
      args.push('--merge-output-format mp4');
    } else {
      args.push('-x');
      args.push(`--audio-format ${audioFormat}`);
      if (['mp3', 'm4a', 'opus'].includes(audioFormat)) {
        args.push(`--audio-quality ${bitrate}k`);
      }
    }

    if (embedThumb) args.push('--embed-thumbnail');
    if (embedMeta) args.push('--add-metadata');
    if (embedSubs) args.push('--write-auto-sub --sub-lang "en,pt" --embed-subs');

    args.push('-o "%(title)s [%(id)s].%(ext)s"');

    // Quote the URL based on platform
    let urlArg = `"${rawUrl}"`;
    if (platform === 'cmd') {
      urlArg = `"${rawUrl}"`;
    }

    return `yt-dlp ${args.join(' ')} ${urlArg}`;
  }

  function generateBatScript(videoData, options) {
    const cmd = generateCommand(videoData, options, 'cmd');
    return `@echo off
echo ========================================================
echo  NovaRip Studio -- yt-dlp Windows Quick Downloader
echo ========================================================
echo.

where yt-dlp >nul 2>nul
if %errorlevel% neq 0 (
    echo [!] yt-dlp was not found in your PATH.
    echo Installing yt-dlp via winget or downloading standalone...
    winget install yt-dlp || (
        echo Please download yt-dlp from https://github.com/yt-dlp/yt-dlp/releases
        pause
        exit /b 1
    )
)

echo Starting media download...
${cmd}

echo.
echo ========================================================
echo Download finished! Check your current folder.
echo ========================================================
pause
`;
  }

  function generateShScript(videoData, options) {
    const cmd = generateCommand(videoData, options, 'bash');
    return `#!/usr/bin/env bash
# ========================================================
# NovaRip Studio -- yt-dlp Mac/Linux Quick Downloader
# ========================================================

if ! command -v yt-dlp &> /dev/null; then
    echo "[!] yt-dlp could not be found."
    echo "Install it via: brew install yt-dlp (Mac) or sudo apt install yt-dlp (Ubuntu)"
    exit 1
fi

echo "Starting download..."
${cmd}

echo "Download completed!"
`;
  }

  return {
    generateCommand,
    generateBatScript,
    generateShScript
  };
})();
