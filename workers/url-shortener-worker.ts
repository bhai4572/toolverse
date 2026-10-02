/**
 * Cloudflare Worker Backend for ToolVerse URL Shortener
 * Uses Cloudflare D1 Database and KV Cache
 */

export interface Env {
  DB: D1Database;
  SHORT_KV: KVNamespace;
  ALLOWED_ORIGIN: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': env.ALLOWED_ORIGIN || '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    // Redirect handler: GET /s/:alias
    if (request.method === 'GET' && url.pathname.startsWith('/s/')) {
      const alias = url.pathname.replace('/s/', '').trim();
      if (!alias) return new Response('Bad Request', { status: 400 });

      // Check KV cache first
      let cachedUrl = await env.SHORT_KV.get(alias);
      if (cachedUrl) {
        return Response.redirect(cachedUrl, 302);
      }

      // Query D1 database
      const result = await env.DB.prepare(
        'SELECT original_url FROM short_links WHERE alias = ? LIMIT 1'
      ).bind(alias).first<{ original_url: string }>();

      if (result && result.original_url) {
        await env.SHORT_KV.put(alias, result.original_url, { expirationTtl: 86400 });
        return Response.redirect(result.original_url, 302);
      }

      return new Response('Link Not Found', { status: 404 });
    }

    // Create Short Link: POST /api/shorten
    if (request.method === 'POST' && url.pathname === '/api/shorten') {
      try {
        const { originalUrl, customAlias } = await request.json() as any;

        if (!originalUrl || !originalUrl.startsWith('http')) {
          return new Response(JSON.stringify({ error: 'Valid HTTP/HTTPS URL required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          });
        }

        const alias = customAlias || Math.random().toString(36).substring(2, 8);

        await env.DB.prepare(
          'INSERT INTO short_links (alias, original_url, created_at, clicks) VALUES (?, ?, datetime("now"), 0)'
        ).bind(alias, originalUrl).run();

        await env.SHORT_KV.put(alias, originalUrl);

        return new Response(
          JSON.stringify({
            alias,
            originalUrl,
            shortUrl: `${url.origin}/s/${alias}`,
          }),
          {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message || 'Database error' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    return new Response('Not Found', { status: 404 });
  },
};
