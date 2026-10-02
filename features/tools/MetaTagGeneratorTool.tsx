'use client';

import React, { useState } from 'react';
import { Copy, Check, Search, Share2 } from 'lucide-react';

export function MetaTagGeneratorTool() {
  const [title, setTitle] = useState('ToolVerse — Fast, Free & Private Online Utilities');
  const [description, setDescription] = useState('Process PDFs, compress images, calculate loan EMI, convert formats, and create short links 100% privately in your browser.');
  const [url, setUrl] = useState('https://toolverse.com');
  const [ogImage, setOgImage] = useState('https://toolverse.com/og-banner.png');
  const [copied, setCopied] = useState(false);

  const generatedTags = `<!-- Primary Meta Tags -->
<title>${title}</title>
<meta name="title" content="${title}">
<meta name="description" content="${description}">

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:image" content="${ogImage}">

<!-- Twitter / X -->
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:url" content="${url}">
<meta property="twitter:title" content="${title}">
<meta property="twitter:description" content="${description}">
<meta property="twitter:image" content="${ogImage}">`;

  const copyTags = () => {
    navigator.clipboard.writeText(generatedTags);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-6">
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <label>Page Title (Meta Title)</label>
              <span className={title.length > 60 ? 'text-red-500' : 'text-slate-500'}>{title.length} / 60 chars</span>
            </div>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2.5 border rounded-lg text-sm dark:bg-slate-800 dark:text-white" />
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <label>Meta Description</label>
              <span className={description.length > 155 ? 'text-red-500' : 'text-slate-500'}>{description.length} / 155 chars</span>
            </div>
            <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-2.5 border rounded-lg text-sm dark:bg-slate-800 dark:text-white" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1">Canonical Web URL</label>
              <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} className="w-full p-2 border rounded-lg text-xs dark:bg-slate-800 dark:text-white" />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Open Graph Image URL</label>
              <input type="url" value={ogImage} onChange={(e) => setOgImage(e.target.value)} className="w-full p-2 border rounded-lg text-xs dark:bg-slate-800 dark:text-white" />
            </div>
          </div>
        </div>

        {/* Live SERP Preview */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-2">
          <div className="text-xs font-semibold text-slate-500 flex items-center gap-1">
            <Search className="w-3.5 h-3.5" /> Google Search SERP Snippet Preview:
          </div>
          <div className="p-3 bg-white dark:bg-slate-900 border rounded-lg space-y-1">
            <div className="text-xs text-slate-600 truncate">{url}</div>
            <div className="text-sm font-medium text-blue-700 dark:text-blue-400 line-clamp-1">{title}</div>
            <div className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">{description}</div>
          </div>
        </div>

        {/* Code Output */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-semibold">
            <span>Generated HTML Meta Tags:</span>
            <button onClick={copyTags} className="btn-primary text-xs flex items-center gap-1.5">
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />} Copy Code
            </button>
          </div>
          <pre className="p-4 bg-slate-900 text-slate-200 rounded-xl font-mono text-xs overflow-x-auto">
            {generatedTags}
          </pre>
        </div>
      </div>
    </div>
  );
}
