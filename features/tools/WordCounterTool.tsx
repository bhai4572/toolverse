'use client';

import React, { useState } from 'react';
import { Copy, Check, Trash2, FileText } from 'lucide-react';
import { analyzeText } from '@/lib/text/engine';

export function WordCounterTool() {
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);
  const stats = analyzeText(text);

  const copyText = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Real-time Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-center">
          <div className="text-2xl font-bold text-brand-600 dark:text-brand-400">{stats.words}</div>
          <div className="text-xs text-slate-500 font-medium">Words</div>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-center">
          <div className="text-2xl font-bold text-slate-900 dark:text-white">{stats.charactersWithSpaces}</div>
          <div className="text-xs text-slate-500 font-medium">Characters (with space)</div>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-center">
          <div className="text-2xl font-bold text-slate-900 dark:text-white">{stats.sentences}</div>
          <div className="text-xs text-slate-500 font-medium">Sentences</div>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-center">
          <div className="text-2xl font-bold text-slate-900 dark:text-white">{stats.readingTimeMinutes} min</div>
          <div className="text-xs text-slate-500 font-medium">Reading Time</div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-4">
        <textarea
          rows={10}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste your text here to count words and analyze..."
          className="w-full p-4 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:border-brand-500 dark:bg-slate-800 dark:text-white"
        />

        <div className="flex items-center justify-between">
          <div className="text-xs text-slate-500">
            No spaces: {stats.charactersWithoutSpaces} | Paragraphs: {stats.paragraphs} | Lines: {stats.lines}
          </div>
          <div className="flex gap-2">
            <button onClick={() => setText('')} className="btn-secondary text-xs flex items-center gap-1">
              <Trash2 className="w-3.5 h-3.5" /> Clear
            </button>
            <button onClick={copyText} className="btn-primary text-xs flex items-center gap-1">
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />} Copy Text
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
