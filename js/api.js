/**
 * NovaRip Studio — Multi-Engine API Client
 * Manages YouTube URL parsing, metadata fetching, and stream extraction.
 */

const ApiEngine = (() => {
  // Built-in endpoints to attempt if no custom instance is provided
  const DEFAULT_ENDPOINTS = [
    'https://api.cobalt.tools',
    'https://cobalt-api.kwiatekm.tokyo',
    'https://cobalt.q1.is',
    'https://cobalt.tools'
  ];

  /**
   * Extracts clean 11-character YouTube video ID from various URL structures
   */
  function parseYouTubeUrl(url) {
    if (!url || typeof url !== 'string') return null;
    const cleanUrl = url.trim();

    // Standard watch URL: youtube.com/watch?v=ID
    let match = cleanUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([^"&?\/\s]{11})/i);
    if (match && match[1]) {
      return {
        videoId: match[1],
        cleanUrl: `https://www.youtube.com/watch?v=${match[1]}`,
        isShort: cleanUrl.includes('/shorts/')
      };
    }
    return null;
  }

  /**
   * Fetches video metadata (Title, Author, Thumbnail) using open CORS oEmbed endpoints
   */
  async function fetchMetadata(videoId, rawUrl) {
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
    let title = `YouTube Video (${videoId})`;
    let author = 'YouTube Channel';

    // Try noembed first (fast, reliable CORS)
    try {
      const res = await fetch(`https://noembed.com/embed?url=${encodeURIComponent(videoUrl)}`, {
        signal: AbortSignal.timeout(4000)
      });
      if (res.ok) {
        const data = await res.json();
        if (data.title) title = data.title;
        if (data.author_name) author = data.author_name;
      }
    } catch (e) {
      // Fallback to youtube oembed
      try {
        const res2 = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(videoUrl)}&format=json`, {
          signal: AbortSignal.timeout(4000)
        });
        if (res2.ok) {
          const data2 = await res2.json();
          if (data2.title) title = data2.title;
          if (data2.author_name) author = data2.author_name;
        }
      } catch (err) {
        console.warn('oEmbed fetch fallback used:', err);
      }
    }

    return {
      videoId,
      rawUrl: videoUrl,
      title,
      author,
      thumbnailMax: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      thumbnailHq: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      embedUrl: `https://www.youtube.com/embed/${videoId}?autoplay=1`
    };
  }

  /**
   * Request download stream from Cobalt / custom proxy
   */
  async function requestDownload(videoData, options, onProgress) {
    const customCobalt = localStorage.getItem('novarip_custom_cobalt');
    const customWorker = localStorage.getItem('novarip_custom_worker');

    let endpoints = [];
    if (customCobalt) endpoints.push(customCobalt.trim().replace(/\/$/, ''));
    if (customWorker) endpoints.push(customWorker.trim().replace(/\/$/, ''));
    endpoints = endpoints.concat(DEFAULT_ENDPOINTS);

    const payload = {
      url: videoData.rawUrl,
      videoQuality: options.quality === 'max' ? 'max' : options.quality,
      audioFormat: options.audioFormat || 'mp3',
      downloadMode: options.type === 'audio' ? 'audio' : 'auto',
      youtubeVideoCodec: options.codec || 'h264'
    };

    let lastError = null;

    for (let i = 0; i < endpoints.length; i++) {
      const endpoint = endpoints[i];
      try {
        if (onProgress) {
          onProgress({
            step: i + 1,
            total: endpoints.length,
            endpoint: new URL(endpoint).hostname,
            status: 'Contacting media engine...'
          });
        }

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload),
          signal: AbortSignal.timeout(9000)
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status} from ${endpoint}`);
        }

        const data = await response.json();

        if (data.status === 'tunnel' || data.status === 'redirect') {
          return {
            success: true,
            downloadUrl: data.url,
            filename: data.filename || `${videoData.title}.${options.type === 'video' ? 'mp4' : options.audioFormat}`,
            endpoint
          };
        } else if (data.status === 'picker' && Array.isArray(data.picker) && data.picker.length > 0) {
          return {
            success: true,
            downloadUrl: data.picker[0].url,
            filename: `${videoData.title}.${options.type === 'video' ? 'mp4' : options.audioFormat}`,
            endpoint
          };
        } else if (data.status === 'error') {
          throw new Error(data.error?.code || 'Stream error from engine');
        }
      } catch (err) {
        lastError = err;
        console.warn(`Endpoint ${endpoint} failed:`, err.message);
      }
    }

    return {
      success: false,
      error: lastError ? lastError.message : 'No endpoint responded'
    };
  }

  /**
   * Ping check for settings modal
   */
  async function pingEndpoint(url) {
    const start = performance.now();
    try {
      const res = await fetch(url, {
        method: 'GET',
        signal: AbortSignal.timeout(4000)
      });
      const duration = Math.round(performance.now() - start);
      return { ok: true, latency: duration, status: res.status };
    } catch (e) {
      return { ok: false, error: e.message };
    }
  }

  return {
    parseYouTubeUrl,
    fetchMetadata,
    requestDownload,
    pingEndpoint
  };
})();
