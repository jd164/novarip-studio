/**
 * NovaRip Studio — Cloudflare Worker Reverse Proxy
 * Free tier: 100,000 requests / day with global CDN edge routing & CORS headers.
 *
 * Deploy instructions:
 * 1. Log into https://dash.cloudflare.com/
 * 2. Navigate to Workers & Pages > Create application > Create Worker
 * 3. Paste this code and click "Deploy"
 * 4. Copy the worker URL (e.g., https://novarip-proxy.yourname.workers.dev)
 * 5. Paste it in NovaRip Studio Settings > Cloudflare Worker Proxy URL
 */

const TARGET_COBALT_INSTANCE = 'https://api.cobalt.tools';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Accept, Authorization',
};

export default {
  async fetch(request, env, ctx) {
    // Handle CORS Preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: corsHeaders,
      });
    }

    const url = new URL(request.url);
    const targetUrl = TARGET_COBALT_INSTANCE + url.pathname + url.search;

    try {
      const modifiedRequest = new Request(targetUrl, {
        method: request.method,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'User-Agent': 'NovaRipStudio/1.0',
        },
        body: request.method === 'POST' ? request.body : null,
      });

      const response = await fetch(modifiedRequest);
      const newResponse = new Response(response.body, response);

      // Inject CORS headers
      Object.keys(corsHeaders).forEach((key) => {
        newResponse.headers.set(key, corsHeaders[key]);
      });

      return newResponse;
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      });
    }
  },
};
