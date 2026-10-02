# ToolVerse — Cloudflare Deployment Guide

This document outlines deployment steps for **Cloudflare Pages** (frontend static & SSR output) and **Cloudflare Workers** (URL Shortener backend with D1 and KV).

---

## 1. Cloudflare Pages Deployment

1. Log into your **Cloudflare Dashboard** and select **Workers & Pages** > **Create Application** > **Pages**.
2. Connect your Git Repository (`ToolVerse`).
3. Set project settings:
   - **Framework Preset:** Next.js
   - **Build Command:** `npx @cloudflare/next-on-pages` (or `npm run build`)
   - **Build Output Directory:** `.vercel/output/static` (or `.next`)
4. Configure Environment Variables:
   - `NEXT_PUBLIC_SITE_URL` = `https://toolverse.com`
   - `NEXT_PUBLIC_ENABLE_ADS` = `false`

---

## 2. Cloudflare Worker + D1 Setup (URL Shortener)

### Step 1: Create D1 Database
```bash
npx wrangler d1 create toolverse-db
```

### Step 2: Create D1 Migration Table
Run SQL migration script:
```sql
CREATE TABLE IF NOT EXISTS short_links (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  alias TEXT UNIQUE NOT NULL,
  original_url TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  clicks INTEGER DEFAULT 0
);
```

### Step 3: Create KV Namespace
```bash
npx wrangler kv:namespace create SHORT_KV
```

### Step 4: Deploy Worker
```bash
npx wrangler deploy workers/url-shortener-worker.ts --name toolverse-url-shortener
```
