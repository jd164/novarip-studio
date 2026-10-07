/**
 * NovaRip Studio — Main Application Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  // Application State
  const state = {
    currentVideo: null,
    options: {
      type: 'video',         // 'video' | 'audio'
      quality: '1080',       // 'max' | '2160' | '1440' | '1080' | '720' | '480' | '360'
      codec: 'h264',         // 'h264' | 'av1' | 'vp9'
      bitrate: '320',        // '320' | '256' | '192' | '128'
      audioFormat: 'mp3',    // 'mp3' | 'm4a' | 'opus' | 'wav' | 'flac'
      embedThumb: true,
      embedMeta: true,
      embedSubs: false
    },
    platform: 'powershell',
    isAnalyzing: false,
    isDownloading: false,
    embedOpen: false
  };

  // DOM Elements
  const urlInput = document.getElementById('videoUrlInput');
  const btnPasteUrl = document.getElementById('btnPasteUrl');
  const btnClearUrl = document.getElementById('btnClearUrl');
  const btnAnalyzeUrl = document.getElementById('btnAnalyzeUrl');
  const analyzingBanner = document.getElementById('analyzingBanner');
  const analyzingText = document.getElementById('analyzingText');
  
  // Preview Card Elements
  const previewCard = document.getElementById('videoPreviewCard');
  const previewThumbnail = document.getElementById('previewThumbnail');
  const previewTitle = document.getElementById('previewTitle');
  const previewAuthor = document.getElementById('previewAuthor');
  const previewVideoId = document.getElementById('previewVideoId');
  const previewBadge = document.getElementById('previewBadge');
  const btnToggleEmbed = document.getElementById('btnToggleEmbed');
  const embedPlayerWrapper = document.getElementById('embedPlayerWrapper');
  const embedIframe = document.getElementById('embedIframe');

  // Format & Quality Controls
  const typeBtnVideo = document.getElementById('typeBtnVideo');
  const typeBtnAudio = document.getElementById('typeBtnAudio');
  const videoQualitySection = document.getElementById('videoQualitySection');
  const audioQualitySection = document.getElementById('audioQualitySection');
  const videoQualityChips = document.getElementById('videoQualityChips');
  const audioQualityChips = document.getElementById('audioQualityChips');
  const codecSelect = document.getElementById('codecSelect');
  const audioFormatSelect = document.getElementById('audioFormatSelect');

  // Action Modes & Tabs
  const actionModesCard = document.getElementById('actionModesCard');
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');
  // Direct Download Elements
  const btnStartDirectDownload = document.getElementById('btnStartDirectDownload');
  const btnDownloadText = document.getElementById('btnDownloadText');
  const directStatusBox = document.getElementById('directStatusBox');
  const statusMessage = document.getElementById('statusMessage');
  const statusPercent = document.getElementById('statusPercent');
  const statusProgressFill = document.getElementById('statusProgressFill');
  const statusSubMessage = document.getElementById('statusSubMessage');
  const downloadSuccessBox = document.getElementById('downloadSuccessBox');
  const directDownloadLink = document.getElementById('directDownloadLink');
  const btnCopyDownloadUrl = document.getElementById('btnCopyDownloadUrl');
  const downloadErrorBox = document.getElementById('downloadErrorBox');
  const btnSwitchToYtdlp = document.getElementById('btnSwitchToYtdlp');

  // yt-dlp Studio Elements
  const platformBtns = document.querySelectorAll('.platform-btn');
  const ytdlpThumb = document.getElementById('ytdlpThumb');
  const ytdlpMeta = document.getElementById('ytdlpMeta');
  const ytdlpSubs = document.getElementById('ytdlpSubs');
  const ytdlpCommandCode = document.getElementById('ytdlpCommandCode');
  const btnCopyYtdlpCmd = document.getElementById('btnCopyYtdlpCmd');
  const terminalTitle = document.getElementById('terminalTitle');
  const btnDownloadBatScript = document.getElementById('btnDownloadBatScript');
  const btnDownloadShScript = document.getElementById('btnDownloadShScript');

  // Settings & Deploy Modals
  const settingsModal = document.getElementById('settingsModal');
  const btnOpenSettings = document.getElementById('btnOpenSettings');
  const btnCloseSettings = document.getElementById('btnCloseSettings');
  const customCobaltUrl = document.getElementById('customCobaltUrl');
  const customWorkerUrl = document.getElementById('customWorkerUrl');
  const btnSaveSettings = document.getElementById('btnSaveSettings');
  const btnTestBackendPing = document.getElementById('btnTestBackendPing');
  const backendPingResult = document.getElementById('backendPingResult');

  // History & Toast
  const btnClearHistory = document.getElementById('btnClearHistory');
  const toastContainer = document.getElementById('toastContainer');

  // =========================================================================
  // Initialization & Settings Load
  // =========================================================================
  function init() {
    // Load custom settings
    customCobaltUrl.value = localStorage.getItem('novarip_custom_cobalt') || '';
    customWorkerUrl.value = localStorage.getItem('novarip_custom_worker') || '';

    // Render history
    HistoryStore.renderHistory(loadVideoFromUrl);

    // Bind event listeners
    bindEvents();

    // Check if URL has ?url= or ?v= param
    const params = new URLSearchParams(window.location.search);
    const initialUrl = params.get('url') || params.get('v');
    if (initialUrl) {
      urlInput.value = initialUrl;
      handleAnalyzeUrl();
    }
  }

  // =========================================================================
  // Toast Notifications
  // =========================================================================
  function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type === 'success' ? 'toast-success' : type === 'error' ? 'toast-error' : ''}`;
    toast.innerHTML = `
      <span>${type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}</span>
      <span>${message}</span>
    `;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  // =========================================================================
  // Event Bindings
  // =========================================================================
  function bindEvents() {
    // Input events
    urlInput.addEventListener('input', () => {
      btnClearUrl.classList.toggle('hidden', !urlInput.value.trim());
      // Auto-analyze if complete link is pasted
      if (ApiEngine.parseYouTubeUrl(urlInput.value)) {
        handleAnalyzeUrl();
      }
    });

    urlInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleAnalyzeUrl();
    });

    btnPasteUrl.addEventListener('click', async () => {
      try {
        const text = await navigator.clipboard.readText();
        if (text) {
          urlInput.value = text.trim();
          btnClearUrl.classList.remove('hidden');
          handleAnalyzeUrl();
        }
      } catch (err) {
        showToast('Clipboard access was blocked. Please paste manually.', 'error');
      }
    });

    btnClearUrl.addEventListener('click', () => {
      urlInput.value = '';
      btnClearUrl.classList.add('hidden');
      urlInput.focus();
    });

    btnAnalyzeUrl.addEventListener('click', handleAnalyzeUrl);

    // Sample chips
    document.querySelectorAll('.sample-chip').forEach(chip => {
      chip.addEventListener('click', (e) => {
        urlInput.value = e.currentTarget.dataset.url;
        btnClearUrl.classList.remove('hidden');
        handleAnalyzeUrl();
      });
    });

    // Embed player toggle
    btnToggleEmbed.addEventListener('click', () => {
      if (!state.currentVideo) return;
      state.embedOpen = !state.embedOpen;
      embedPlayerWrapper.classList.toggle('hidden', !state.embedOpen);
      if (state.embedOpen) {
        embedIframe.src = state.currentVideo.embedUrl;
      } else {
        embedIframe.src = '';
      }
    });

    // Format Toggle (Video vs Audio)
    typeBtnVideo.addEventListener('click', () => setFormatType('video'));
    typeBtnAudio.addEventListener('click', () => setFormatType('audio'));

    // Video Quality chips
    videoQualityChips.querySelectorAll('.chip').forEach(chip => {
      chip.addEventListener('click', (e) => {
        videoQualityChips.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
        const target = e.currentTarget;
        target.classList.add('active');
        state.options.quality = target.dataset.quality;
        updateDynamicViews();
      });
    });

    // Audio Quality chips
    audioQualityChips.querySelectorAll('.chip').forEach(chip => {
      chip.addEventListener('click', (e) => {
        audioQualityChips.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
        const target = e.currentTarget;
        target.classList.add('active');
        state.options.bitrate = target.dataset.bitrate;
        updateDynamicViews();
      });
    });

    // Codec & Format selects
    codecSelect.addEventListener('change', (e) => {
      state.options.codec = e.target.value;
      updateDynamicViews();
    });

    audioFormatSelect.addEventListener('change', (e) => {
      state.options.audioFormat = e.target.value;
      updateDynamicViews();
    });

    // Tab Navigation
    tabBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const targetTab = e.currentTarget.dataset.tab;
        tabBtns.forEach(b => b.classList.remove('active'));
        tabPanes.forEach(p => p.classList.remove('active'));

        e.currentTarget.classList.add('active');
        document.getElementById(targetTab).classList.add('active');
      });
    });

    // Direct Download Button
    btnStartDirectDownload.addEventListener('click', handleStartDirectDownload);

    // Switch tabs on error recommendation
    btnSwitchToYtdlp.addEventListener('click', () => switchTab('tab-ytdlp'));

    // yt-dlp Platforms
    platformBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        platformBtns.forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        state.platform = e.currentTarget.dataset.plat;
        updateYtdlpCommand();
      });
    });

    // yt-dlp Checkbox options
    ytdlpThumb.addEventListener('change', (e) => {
      state.options.embedThumb = e.target.checked;
      updateYtdlpCommand();
    });
    ytdlpMeta.addEventListener('change', (e) => {
      state.options.embedMeta = e.target.checked;
      updateYtdlpCommand();
    });
    ytdlpSubs.addEventListener('change', (e) => {
      state.options.embedSubs = e.target.checked;
      updateYtdlpCommand();
    });

    // Copy yt-dlp command
    btnCopyYtdlpCmd.addEventListener('click', () => {
      const cmd = ytdlpCommandCode.textContent;
      navigator.clipboard.writeText(cmd);
      showToast('Command copied to clipboard!', 'success');
    });

    // Download .bat & .sh scripts
    btnDownloadBatScript.addEventListener('click', () => {
      if (!state.currentVideo) return;
      const content = YtDlpStudio.generateBatScript(state.currentVideo, state.options);
      downloadTextFile(content, `download_${state.currentVideo.videoId}.bat`);
      showToast('Downloaded .bat launcher script', 'success');
    });

    btnDownloadShScript.addEventListener('click', () => {
      if (!state.currentVideo) return;
      const content = YtDlpStudio.generateShScript(state.currentVideo, state.options);
      downloadTextFile(content, `download_${state.currentVideo.videoId}.sh`);
      showToast('Downloaded .sh launcher script', 'success');
    });

    // Modals
    btnOpenSettings.addEventListener('click', () => settingsModal.classList.remove('hidden'));
    btnCloseSettings.addEventListener('click', () => settingsModal.classList.add('hidden'));
    btnSaveSettings.addEventListener('click', () => {
      localStorage.setItem('novarip_custom_cobalt', customCobaltUrl.value.trim());
      localStorage.setItem('novarip_custom_worker', customWorkerUrl.value.trim());
      settingsModal.classList.add('hidden');
      showToast('Settings saved successfully', 'success');
    });

    btnTestBackendPing.addEventListener('click', async () => {
      const url = customCobaltUrl.value.trim() || 'https://api.cobalt.tools';
      backendPingResult.textContent = 'Testing latency...';
      backendPingResult.style.color = '#06b6d4';
      const res = await ApiEngine.pingEndpoint(url);
      if (res.ok) {
        backendPingResult.textContent = `Online (${res.latency}ms)`;
        backendPingResult.style.color = '#10b981';
      } else {
        backendPingResult.textContent = `Offline / CORS block`;
        backendPingResult.style.color = '#ef4444';
      }
    });

    // Clear History
    btnClearHistory.addEventListener('click', () => {
      HistoryStore.clearHistory();
      showToast('History cleared', 'info');
    });

    // Close modal on background click
    settingsModal.addEventListener('click', (e) => {
      if (e.target === settingsModal) settingsModal.classList.add('hidden');
    });
  }

  // =========================================================================
  // Core Business Logic
  // =========================================================================

  function setFormatType(type) {
    state.options.type = type;
    if (type === 'video') {
      typeBtnVideo.classList.add('active');
      typeBtnAudio.classList.remove('active');
      videoQualitySection.classList.remove('hidden');
      audioQualitySection.classList.add('hidden');
    } else {
      typeBtnAudio.classList.add('active');
      typeBtnVideo.classList.remove('active');
      audioQualitySection.classList.remove('hidden');
      videoQualitySection.classList.add('hidden');
    }
    updateDynamicViews();
  }

  function switchTab(tabId) {
    tabBtns.forEach(b => {
      b.classList.toggle('active', b.dataset.tab === tabId);
    });
    tabPanes.forEach(p => {
      p.classList.toggle('active', p.id === tabId);
    });
  }

  function loadVideoFromUrl(url) {
    urlInput.value = url;
    btnClearUrl.classList.remove('hidden');
    handleAnalyzeUrl();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleAnalyzeUrl() {
    const rawUrl = urlInput.value.trim();
    if (!rawUrl) {
      showToast('Please enter a YouTube video URL', 'error');
      return;
    }

    const parsed = ApiEngine.parseYouTubeUrl(rawUrl);
    if (!parsed) {
      showToast('Invalid YouTube URL format. Please check the link.', 'error');
      return;
    }

    // Show analyzing banner
    analyzingBanner.classList.remove('hidden');
    analyzingText.textContent = `Fetching metadata for video ID: ${parsed.videoId}...`;
    btnAnalyzeUrl.disabled = true;

    try {
      const meta = await ApiEngine.fetchMetadata(parsed.videoId, rawUrl);
      state.currentVideo = meta;

      // Populate preview card
      previewTitle.textContent = meta.title;
      previewAuthor.textContent = meta.author;
      previewVideoId.textContent = `ID: ${meta.videoId}`;
      previewBadge.textContent = parsed.isShort ? 'Shorts' : 'HD Video';

      // Load thumbnail with fallback
      previewThumbnail.src = meta.thumbnailMax;
      previewThumbnail.onerror = () => {
        previewThumbnail.src = meta.thumbnailHq;
      };

      // Reset embed player
      state.embedOpen = false;
      embedPlayerWrapper.classList.add('hidden');
      embedIframe.src = '';

      // Unhide preview card & action modes
      previewCard.classList.remove('hidden');
      actionModesCard.classList.remove('hidden');

      // Update dynamic view elements
      updateDynamicViews();

      showToast('Video ready for download!', 'success');
    } catch (err) {
      showToast('Failed to fetch video details: ' + err.message, 'error');
    } finally {
      analyzingBanner.classList.add('hidden');
      btnAnalyzeUrl.disabled = false;
    }
  }

  function updateDynamicViews() {
    if (!state.currentVideo) return;

    // Update download button label
    const formatName = state.options.type === 'video' 
      ? `MP4 (${state.options.quality === 'max' ? 'Max 4K' : state.options.quality + 'p'})`
      : `${state.options.audioFormat.toUpperCase()} (${state.options.bitrate}kbps)`;
    btnDownloadText.textContent = `Download ${formatName}`;

    // Update yt-dlp command
    updateYtdlpCommand();
  }

  function updateYtdlpCommand() {
    if (!state.currentVideo) return;
    const cmd = YtDlpStudio.generateCommand(state.currentVideo, state.options, state.platform);
    ytdlpCommandCode.textContent = cmd;

    terminalTitle.textContent = state.platform === 'powershell' 
      ? 'PowerShell One-Liner' 
      : state.platform === 'cmd' 
        ? 'Windows Command Prompt (CMD)' 
        : 'macOS / Linux Terminal';
  }

  async function handleStartDirectDownload() {
    if (!state.currentVideo || state.isDownloading) return;

    state.isDownloading = true;
    btnStartDirectDownload.disabled = true;
    directStatusBox.classList.remove('hidden');
    downloadSuccessBox.classList.add('hidden');
    downloadErrorBox.classList.add('hidden');

    // Simulate progressive status
    let progress = 10;
    statusProgressFill.style.width = `${progress}%`;
    statusPercent.textContent = `${progress}%`;
    statusMessage.textContent = 'Querying high-speed media clusters...';

    const progressInterval = setInterval(() => {
      if (progress < 85) {
        progress += Math.floor(Math.random() * 15) + 5;
        if (progress > 85) progress = 85;
        statusProgressFill.style.width = `${progress}%`;
        statusPercent.textContent = `${progress}%`;
        if (progress > 40 && progress < 70) {
          statusMessage.textContent = 'Extracting stream audio & video tracks...';
        } else if (progress >= 70) {
          statusMessage.textContent = 'Muxing media container and preparing file...';
        }
      }
    }, 600);

    try {
      const result = await ApiEngine.requestDownload(
        state.currentVideo, 
        state.options,
        (status) => {
          statusSubMessage.textContent = `Targeting node: ${status.endpoint}...`;
        }
      );

      clearInterval(progressInterval);

      if (result.success && result.downloadUrl) {
        statusProgressFill.style.width = '100%';
        statusPercent.textContent = '100%';
        statusMessage.textContent = 'Download ready!';
        directStatusBox.classList.add('hidden');

        // Show success box
        downloadSuccessBox.classList.remove('hidden');
        directDownloadLink.href = result.downloadUrl;
        directDownloadLink.setAttribute('download', result.filename);
        
        btnCopyDownloadUrl.onclick = () => {
          navigator.clipboard.writeText(result.downloadUrl);
          showToast('Stream URL copied to clipboard!', 'success');
        };

        // Add to history
        HistoryStore.addEntry(state.currentVideo, state.options);

        // Attempt automatic download trigger
        const tempLink = document.createElement('a');
        tempLink.href = result.downloadUrl;
        tempLink.target = '_blank';
        tempLink.rel = 'noopener noreferrer';
        tempLink.download = result.filename;
        document.body.appendChild(tempLink);
        tempLink.click();
        tempLink.remove();

        showToast('Stream ready! Download starting...', 'success');
      } else {
        throw new Error(result.error || 'Public instance returned an error');
      }
    } catch (err) {
      clearInterval(progressInterval);
      directStatusBox.classList.add('hidden');
      downloadErrorBox.classList.remove('hidden');
      showToast('Public API throttling detected', 'error');
    } finally {
      state.isDownloading = false;
      btnStartDirectDownload.disabled = false;
    }
  }

  function downloadTextFile(text, filename) {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  // Run init
  init();
});
