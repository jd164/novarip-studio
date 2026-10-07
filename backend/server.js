const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Health Check
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    service: 'NovaRip Studio Companion Backend',
    timestamp: new Date().toISOString()
  });
});

// Proxy to Cobalt instance or custom yt-dlp handler
app.post('/api/download', async (req, res) => {
  const { url, videoQuality, audioFormat, downloadMode } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    const cobaltRes = await fetch('https://api.cobalt.tools/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url,
        videoQuality: videoQuality || '1080',
        audioFormat: audioFormat || 'mp3',
        downloadMode: downloadMode || 'auto'
      })
    });

    const data = await cobaltRes.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`NovaRip Studio Server running at http://localhost:${PORT}`);
});
