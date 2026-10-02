'use client';

import React, { useState } from 'react';
import { Copy, Check, FileCode } from 'lucide-react';
import { generateLoremIpsum } from '@/lib/text/engine';

export function LoremIpsumTool() {
  const [paragraphs, setParagraphs] = useState(3);
  const [text, setText] = useState(generateLoremIpsum(3));
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    setText(generateLoremIpsum(paragraphs));
  };

  const copyText = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Number of Paragraphs: {paragraphs}
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={paragraphs}
              onChange={(e) => setParagraphs(parseInt(e.target.value, 10))}
              className="w-full accent-brand-600"
            />
          </div>
          <button onClick={handleGenerate} className="btn-primary text-xs">
            Generate Lorem Ipsum
          </button>
        </div>

        <textarea
          rows={10}
          readOnly
          value={text}
          className="w-full p-4 border border-slate-200 dark:border-slate-700 rounded-lg text-sm bg-slate-50 dark:bg-slate-800 dark:text-white"
        />

        <div className="flex justify-end">
          <button onClick={copyText} className="btn-secondary text-xs flex items-center gap-1.5">
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />} Copy Placeholder Text
          </button>
        </div>
      </div>
    </div>
  );
}
