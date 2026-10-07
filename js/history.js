/**
 * NovaRip Studio — Download History & Queue Manager
 * Persists recent downloads and inspected media in localStorage.
 */

const HistoryStore = (() => {
  const STORAGE_KEY = 'novarip_history_v1';
  const MAX_ITEMS = 20;

  function getHistory() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Failed to load history:', e);
      return [];
    }
  }

  function addEntry(videoData, options) {
    if (!videoData || !videoData.videoId) return;

    let items = getHistory();
    // Remove duplicate of same video ID if exists
    items = items.filter(item => item.videoId !== videoData.videoId);

    const entry = {
      id: Date.now(),
      videoId: videoData.videoId,
      title: videoData.title || 'YouTube Media',
      author: videoData.author || 'YouTube Channel',
      thumbnail: videoData.thumbnailHq || `https://img.youtube.com/vi/${videoData.videoId}/hqdefault.jpg`,
      rawUrl: videoData.rawUrl,
      type: options.type,
      formatDesc: options.type === 'video' 
        ? `MP4 ${options.quality === 'max' ? 'Max' : options.quality + 'p'}`
        : `${options.audioFormat.toUpperCase()} ${options.bitrate}kbps`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    items.unshift(entry);
    if (items.length > MAX_ITEMS) items.pop();

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save history:', e);
    }

    renderHistory();
  }

  function clearHistory() {
    localStorage.removeItem(STORAGE_KEY);
    renderHistory();
  }

  function renderHistory(onSelectVideo) {
    const listEl = document.getElementById('historyList');
    const emptyEl = document.getElementById('historyEmpty');
    if (!listEl) return;

    const items = getHistory();

    if (items.length === 0) {
      listEl.innerHTML = '<div class="history-empty">No downloads yet. Enter a YouTube link above to start downloading!</div>';
      return;
    }

    listEl.innerHTML = items.map(item => `
      <div class="history-item" data-videoid="${item.videoId}" data-url="${item.rawUrl}">
        <div class="history-item-left">
          <img src="${item.thumbnail}" alt="" class="history-thumb" onerror="this.src='assets/logo.svg'" />
          <div class="history-item-info">
            <div class="history-item-title" title="${item.title}">${item.title}</div>
            <div class="history-item-meta">
              <span class="history-format-tag">${item.formatDesc}</span>
              <span>&bull;</span>
              <span>${item.author}</span>
              <span>&bull;</span>
              <span>${item.timestamp}</span>
            </div>
          </div>
        </div>
        <div class="history-item-actions">
          <button class="btn btn-outline btn-sm btn-reopen" data-url="${item.rawUrl}" title="Load this video">
            Select
          </button>
        </div>
      </div>
    `).join('');

    // Attach click events
    listEl.querySelectorAll('.btn-reopen').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const url = e.currentTarget.dataset.url;
        if (onSelectVideo) onSelectVideo(url);
      });
    });
  }

  return {
    getHistory,
    addEntry,
    clearHistory,
    renderHistory
  };
})();
