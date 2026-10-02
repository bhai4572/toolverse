'use client';

import React, { useState, useEffect } from 'react';
import { ExternalLink, Copy, Check, QrCode, AlertCircle, RefreshCw } from 'lucide-react';
import { validateDestinationUrl, getLocalShortLinks, saveLocalShortLink, ShortLinkRecord } from '@/lib/url-shortener/client';
import { generateQrCodeDataUrl } from '@/lib/developer/engine';

export function UrlShortenerTool() {
  const [url, setUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [currentLink, setCurrentLink] = useState<ShortLinkRecord | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [linkHistory, setLinkHistory] = useState<ShortLinkRecord[]>([]);

  useEffect(() => {
    setLinkHistory(getLocalShortLinks());
  }, []);

  const handleShorten = async () => {
    setError(null);
    const validation = validateDestinationUrl(url);
    if (!validation.isValid) {
      setError(validation.error || 'Invalid URL');
      return;
    }

    setIsProcessing(true);
    try {
      const res = await fetch('/api/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, customAlias }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create short link');
      }

      setCurrentLink(data);
      saveLocalShortLink(data);
      setLinkHistory(getLocalShortLinks());

      // Generate QR code for short link
      const qr = await generateQrCodeDataUrl(data.shortUrl);
      setQrCodeUrl(qr);
    } catch (err: any) {
      setError(err.message || 'Failed to create short URL');
    } finally {
      setIsProcessing(false);
    }
  };

  const copyShortUrl = () => {
    if (currentLink) {
      navigator.clipboard.writeText(currentLink.shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Destination URL (Must start with http:// or https://)
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setError(null);
              }}
              placeholder="https://mywebsite.com/long-page-link?utm_source=twitter"
              className="w-full px-4 py-2.5 border rounded-lg text-sm dark:bg-slate-800 dark:border-slate-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Custom Short Alias (Optional):
            </label>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-mono">/s/</span>
              <input
                type="text"
                value={customAlias}
                onChange={(e) => setCustomAlias(e.target.value)}
                placeholder="my-custom-link"
                className="flex-1 px-3 py-2 border rounded-lg text-sm dark:bg-slate-800 dark:border-slate-700 dark:text-white"
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-950/40 text-red-600 text-xs rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
          </div>
        )}

        <button onClick={handleShorten} disabled={isProcessing} className="w-full btn-primary py-3 text-sm">
          {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Shorten URL Now'}
        </button>

        {currentLink && (
          <div className="p-5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="text-xs text-emerald-800 dark:text-emerald-300 font-medium">Your Short URL:</div>
                <div className="text-lg font-bold text-emerald-900 dark:text-emerald-100 font-mono">
                  {currentLink.shortUrl}
                </div>
              </div>

              <button onClick={copyShortUrl} className="btn-primary text-xs flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700">
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />} Copy Link
              </button>
            </div>

            {qrCodeUrl && (
              <div className="pt-3 border-t border-emerald-200/60 dark:border-emerald-800/60 flex items-center gap-4">
                <img src={qrCodeUrl} alt="QR Code" className="w-20 h-20 border rounded bg-white p-1" />
                <div className="text-xs text-slate-600 dark:text-slate-300">
                  QR Code automatically generated for print and scan sharing.
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Local History */}
      {linkHistory.length > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-3">
          <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">Your Recent Short Links</div>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {linkHistory.map((link) => (
              <div key={link.id} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg flex items-center justify-between text-xs">
                <div className="truncate max-w-xs">
                  <div className="font-mono font-bold text-brand-600">{link.shortUrl}</div>
                  <div className="text-slate-500 truncate">{link.originalUrl}</div>
                </div>
                <button
                  onClick={() => navigator.clipboard.writeText(link.shortUrl)}
                  className="btn-secondary py-1 px-2 text-[10px]"
                >
                  Copy
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
