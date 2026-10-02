'use client';

import React, { useState } from 'react';
import { Copy, Check, Type } from 'lucide-react';
import { convertTextCase, TextCaseFormat } from '@/lib/text/engine';

export function TextCaseConverterTool() {
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);

  const handleConvert = (format: TextCaseFormat) => {
    setText(convertTextCase(text, format));
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-4">
        <textarea
          rows={8}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste or type text here to convert case..."
          className="w-full p-4 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:border-brand-500 dark:bg-slate-800 dark:text-white"
        />

        <div className="flex flex-wrap gap-2">
          {[
            { id: 'uppercase', label: 'UPPERCASE' },
            { id: 'lowercase', label: 'lowercase' },
            { id: 'titlecase', label: 'Title Case' },
            { id: 'sentencecase', label: 'Sentence case' },
            { id: 'capitalized', label: 'Capitalized Words' },
            { id: 'camelcase', label: 'camelCase' },
            { id: 'kebabcase', label: 'kebab-case' },
            { id: 'snakecase', label: 'snake_case' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => handleConvert(item.id as TextCaseFormat)}
              className="px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-brand-500 hover:text-white dark:hover:bg-brand-600 rounded-lg text-xs font-medium transition-colors"
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex justify-end pt-2">
          <button onClick={copyToClipboard} className="btn-primary text-xs flex items-center gap-1.5">
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />} Copy Result
          </button>
        </div>
      </div>
    </div>
  );
}
