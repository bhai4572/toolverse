'use client';

import React, { useState } from 'react';
import { Copy, Check, ListFilter, RefreshCw } from 'lucide-react';
import { removeDuplicateLines } from '@/lib/text/engine';

export function RemoveDuplicateLinesTool() {
  const [text, setText] = useState('');
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [trimLines, setTrimLines] = useState(true);
  const [copied, setCopied] = useState(false);

  const handleDedupe = () => {
    setText(removeDuplicateLines(text, { caseSensitive, trimLines }));
  };

  const copyResult = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-4">
        <textarea
          rows={10}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste your list here (e.g. emails, URLs, keywords)..."
          className="w-full p-4 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:border-brand-500 dark:bg-slate-800 dark:text-white"
        />

        <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-slate-700 dark:text-slate-300">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={caseSensitive}
                onChange={(e) => setCaseSensitive(e.target.checked)}
                className="rounded text-brand-600"
              />
              <span>Case Sensitive</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={trimLines}
                onChange={(e) => setTrimLines(e.target.checked)}
                className="rounded text-brand-600"
              />
              <span>Trim Whitespace</span>
            </label>
          </div>

          <div className="flex gap-2">
            <button onClick={handleDedupe} className="btn-primary text-xs flex items-center gap-1.5">
              <ListFilter className="w-4 h-4" /> Remove Duplicates
            </button>
            <button onClick={copyResult} className="btn-secondary text-xs flex items-center gap-1.5">
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />} Copy Result
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
