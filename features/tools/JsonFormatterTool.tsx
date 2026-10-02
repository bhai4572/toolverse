'use client';

import React, { useState } from 'react';
import { Copy, Check, Code2, AlertCircle, RefreshCw } from 'lucide-react';
import { formatJson, minifyJson } from '@/lib/developer/engine';

export function JsonFormatterTool() {
  const [jsonInput, setJsonInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleFormat = () => {
    setError(null);
    const res = formatJson(jsonInput, 2);
    if (res.error) {
      setError(res.error);
    } else if (res.formatted) {
      setJsonInput(res.formatted);
    }
  };

  const handleMinify = () => {
    setError(null);
    const res = minifyJson(jsonInput);
    if (res.error) {
      setError(res.error);
    } else if (res.minified) {
      setJsonInput(res.minified);
    }
  };

  const copyJson = () => {
    navigator.clipboard.writeText(jsonInput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-4">
        <textarea
          rows={12}
          value={jsonInput}
          onChange={(e) => {
            setJsonInput(e.target.value);
            setError(null);
          }}
          placeholder="Paste raw unformatted JSON string here..."
          className="w-full p-4 font-mono text-xs border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-brand-500 dark:bg-slate-800 dark:text-white"
        />

        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 text-xs rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-2">
            <button onClick={handleFormat} className="btn-primary text-xs flex items-center gap-1.5">
              <Code2 className="w-4 h-4" /> Format JSON
            </button>
            <button onClick={handleMinify} className="btn-secondary text-xs">
              Minify JSON
            </button>
          </div>
          <button onClick={copyJson} className="btn-secondary text-xs flex items-center gap-1.5">
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />} Copy JSON
          </button>
        </div>
      </div>
    </div>
  );
}
