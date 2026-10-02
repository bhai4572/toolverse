'use client';

import React, { useState, useEffect } from 'react';
import { QrCode, Download, Copy, Check } from 'lucide-react';
import { generateQrCodeDataUrl } from '@/lib/developer/engine';

export function QrCodeGeneratorTool() {
  const [text, setText] = useState('https://toolverse.com');
  const [darkColor, setDarkColor] = useState('#000000');
  const [lightColor, setLightColor] = useState('#ffffff');
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!text.trim()) {
      setQrDataUrl(null);
      return;
    }
    generateQrCodeDataUrl(text, { width: 300, darkColor, lightColor })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error(err));
  }, [text, darkColor, lightColor]);

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-6">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Enter URL, Wi-Fi details, or text to encode:
          </label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="https://example.com"
            className="w-full px-4 py-2.5 border rounded-lg text-sm dark:bg-slate-800 dark:border-slate-700 dark:text-white"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Foreground Color:
            </label>
            <input
              type="color"
              value={darkColor}
              onChange={(e) => setDarkColor(e.target.value)}
              className="w-full h-10 border rounded-lg cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Background Color:
            </label>
            <input
              type="color"
              value={lightColor}
              onChange={(e) => setLightColor(e.target.value)}
              className="w-full h-10 border rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {qrDataUrl && (
          <div className="flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-4">
            <img src={qrDataUrl} alt="QR Code" className="w-56 h-56 border rounded-lg shadow-sm bg-white p-2" />
            <a
              href={qrDataUrl}
              download="qrcode.png"
              className="btn-primary text-xs flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700"
            >
              <Download className="w-4 h-4" /> Download PNG QR Code
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
