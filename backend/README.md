# ToolVerse Backend & API Services

This directory is isolated from the Cloudflare Pages static frontend deployment (`dist`).

## Contents
- `server.js` — Node.js standalone server runner
- `api/` — API route handlers (Writing API proxy, URL shortener, Job crawler)
- `workers/` — Cloudflare Worker scripts (D1 + KV shortener)

Deploy backend services separately to a VPS (e.g., `api.toolverse.com`) or Cloudflare Workers.
