'use client';

import React, { useState } from 'react';
import { Copy, Check, Binary, AlertCircle } from 'lucide-react';
import { encodeBase64, decodeBase64 } from '@/lib/developer/engine';

export function Base64Tool() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleProcess = () => {
    setError(null);
    try {
      if (mode === 'encode') {
        setOutput(encodeBase64(input));
      } else {
        setOutput(decodeBase64(input));
      }
    } catch (err: any) {
      setError(err.message || 'Processing failed');
    }
  };

  const copyResult = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-4">
        <div className="flex gap-2">
          <button
            onClick={() => {
              setMode('encode');
              setError(null);
            }}
            className={`px-4 py-2 rounded-lg text-xs font-semibold border ${
              mode === 'encode' ? 'bg-brand-600 text-white border-brand-600' : 'bg-slate-100 dark:bg-slate-800'
            }`}
          >
            Encode to Base64
          </button>
          <button
            onClick={() => {
              setMode('decode');
              setError(null);
            }}
            className={`px-4 py-2 rounded-lg text-xs font-semibold border ${
              mode === 'decode' ? 'bg-brand-600 text-white border-brand-600' : 'bg-slate-100 dark:bg-slate-800'
            }`}
          >
            Decode from Base64
          </button>
        </div>

        <textarea
          rows={6}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === 'encode' ? 'Type or paste plain text to encode...' : 'Paste Base64 string to decode...'}
          className="w-full p-3 font-mono text-xs border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-brand-500 dark:bg-slate-800 dark:text-white"
        />

        <button onClick={handleProcess} className="w-full btn-primary py-2.5 text-xs">
          {mode === 'encode' ? 'Encode String' : 'Decode Base64 String'}
        </button>

        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-950/40 text-red-600 text-xs rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
          </div>
        )}

        {output && (
          <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Result Output:</span>
              <button onClick={copyResult} className="btn-secondary text-xs flex items-center gap-1">
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />} Copy Result
              </button>
            </div>
            <textarea
              rows={6}
              readOnly
              value={output}
              className="w-full p-3 font-mono text-xs border rounded-lg bg-slate-50 dark:bg-slate-800 dark:text-white"
            />
          </div>
        )}
      </div>
    </div>
  );
}
