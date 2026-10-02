'use client';

import React, { useState } from 'react';
import { Copy, Check, Link } from 'lucide-react';

export function UtmBuilderTool() {
  const [baseUrl, setBaseUrl] = useState('https://mywebsite.com');
  const [source, setSource] = useState('newsletter');
  const [medium, setMedium] = useState('email');
  const [campaign, setCampaign] = useState('summer_sale');
  const [term, setTerm] = useState('');
  const [content, setContent] = useState('');

  const [copied, setCopied] = useState(false);

  const generateUtm = () => {
    if (!baseUrl.trim()) return '';
    try {
      const u = new URL(baseUrl.startsWith('http') ? baseUrl : `https://${baseUrl}`);
      if (source) u.searchParams.set('utm_source', source);
      if (medium) u.searchParams.set('utm_medium', medium);
      if (campaign) u.searchParams.set('utm_campaign', campaign);
      if (term) u.searchParams.set('utm_term', term);
      if (content) u.searchParams.set('utm_content', content);
      return u.toString();
    } catch {
      return '';
    }
  };

  const utmUrl = generateUtm();

  const copyUtm = () => {
    navigator.clipboard.writeText(utmUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-4">
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Website URL (Required):
            </label>
            <input
              type="url"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              placeholder="https://example.com/landing-page"
              className="w-full p-2.5 border rounded-lg text-sm dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Campaign Source (utm_source):
              </label>
              <input
                type="text"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder="google, newsletter, facebook"
                className="w-full p-2 border rounded-lg text-xs dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Campaign Medium (utm_medium):
              </label>
              <input
                type="text"
                value={medium}
                onChange={(e) => setMedium(e.target.value)}
                placeholder="cpc, banner, email"
                className="w-full p-2 border rounded-lg text-xs dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Campaign Name (utm_campaign):
              </label>
              <input
                type="text"
                value={campaign}
                onChange={(e) => setCampaign(e.target.value)}
                placeholder="spring_promo, launch"
                className="w-full p-2 border rounded-lg text-xs dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Campaign Term (utm_term - Optional):
              </label>
              <input
                type="text"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                placeholder="running_shoes"
                className="w-full p-2 border rounded-lg text-xs dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Result */}
        {utmUrl && (
          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-3">
            <div className="text-xs font-semibold text-slate-500">Generated UTM Link:</div>
            <div className="p-3 bg-white dark:bg-slate-900 border rounded-lg font-mono text-xs break-all text-brand-600 dark:text-brand-400">
              {utmUrl}
            </div>
            <button onClick={copyUtm} className="btn-primary text-xs flex items-center gap-1.5">
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />} Copy UTM URL
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
