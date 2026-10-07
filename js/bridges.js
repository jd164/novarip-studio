/**
 * NovaRip Studio — 1-Click Fast Web Bridges
 * Provides direct URL generators for trusted web-based media conversion portals.
 * Ideal for GitHub Pages static deployments where browser CORS prevents direct stream extraction.
 */

const WebBridges = (() => {
  function generateBridges(videoData, options) {
    const { videoId, rawUrl } = videoData;
    const { type, quality, bitrate, audioFormat, codec } = options;

    const encodedUrl = encodeURIComponent(rawUrl);
    
    // Quality label for display
    const targetLabel = type === 'video' 
      ? `MP4 (${quality === 'max' ? 'Max 4K' : quality + 'p'})`
      : `${audioFormat.toUpperCase()} (${bitrate}kbps)`;

    return [
      {
        id: 'cobalt',
        name: 'Cobalt Web Portal',
        badge: 'Ad-Free Open Source',
        badgeType: 'pro',
        desc: `Cleanest ad-free web interface. Pre-loads with your video for high-speed ${targetLabel} download.`,
        icon: '💎',
        url: `https://cobalt.tools/#${encodedUrl}`,
        btnText: `Open Cobalt (${targetLabel})`
      },
      {
        id: 'y2mate',
        name: 'Y2Mate Converter',
        badge: 'High Speed',
        badgeType: 'fast',
        desc: `Instant converter pre-loaded with video ID ${videoId}. Supports 1080p MP4 and high bitrate MP3.`,
        icon: '⚡',
        url: `https://www.y2mate.com/youtube/${videoId}`,
        btnText: `Open Y2Mate Portal`
      },
      {
        id: 'savefrom',
        name: 'SaveFrom Fast Bridge',
        badge: 'Direct Stream',
        badgeType: 'safe',
        desc: 'Direct stream engine. One-click access to multiple MP4 resolutions.',
        icon: '🚀',
        url: `https://en.savefrom.net/1-youtube-video-downloader-384.html?url=${encodedUrl}`,
        btnText: 'Open SaveFrom Portal'
      },
      {
        id: 'loader',
        name: 'Loader.to Studio',
        badge: 'Up to 4K & 320k',
        badgeType: 'pro',
        desc: `High-fidelity converter supporting 4K UHD MP4 and 320kbps MP3 audio streams.`,
        icon: '🎬',
        url: `https://en.loader.to/4/?link=${encodedUrl}&f=${type === 'video' ? (quality === '2160' ? '4k' : quality) : audioFormat}`,
        btnText: `Convert on Loader.to`
      },
      {
        id: 'yt1s',
        name: 'YT1s Multi-Format',
        badge: 'Fast & Simple',
        badgeType: 'fast',
        desc: 'Quick online MP3 & MP4 conversion with automatic quality selection.',
        icon: '🎵',
        url: `https://yt1s.com/en?q=${encodedUrl}`,
        btnText: 'Open YT1s'
      },
      {
        id: 'tendownloader',
        name: '10Downloader Engine',
        badge: 'Clean UI',
        badgeType: 'safe',
        desc: 'No-popups converter for direct MP4 and MP3 audio downloads.',
        icon: '📦',
        url: `https://10downloader.com/download?v=${encodedUrl}`,
        btnText: 'Open 10Downloader'
      }
    ];
  }

  function renderBridges(containerElement, videoData, options) {
    if (!containerElement || !videoData) return;
    const bridges = generateBridges(videoData, options);

    containerElement.innerHTML = bridges.map(b => `
      <div class="bridge-card">
        <div>
          <div class="bridge-header">
            <span style="font-size: 1.4rem;">${b.icon}</span>
            <span class="bridge-badge ${b.badgeType}">${b.badge}</span>
          </div>
          <h4 class="bridge-title">${b.name}</h4>
          <p class="bridge-desc">${b.desc}</p>
        </div>
        <a href="${b.url}" target="_blank" rel="noopener noreferrer" class="bridge-btn">
          <span>${b.btnText}</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
        </a>
      </div>
    `).join('');
  }

  return {
    generateBridges,
    renderBridges
  };
})();
