'use client';

import React, { useState, useEffect } from 'react';
import { Copy, Check, Shield } from 'lucide-react';
import { computeHash } from '@/lib/developer/engine';

export function HashGeneratorTool() {
  const [input, setInput] = useState('Hello ToolVerse');
  const [sha256, setSha256] = useState('');
  const [sha512, setSha512] = useState('');
  const [sha1, setSha1] = useState('');

  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    if (!input) {
      setSha256('');
      setSha512('');
      setSha1('');
      return;
    }

    computeHash(input, 'SHA-256').then(setSha256);
    computeHash(input, 'SHA-512').then(setSha512);
    computeHash(input, 'SHA-1').then(setSha1);
  }, [input]);

  const copyHash = (hash: string, key: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-6">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Enter Text String to Compute Hashes:
          </label>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full p-2.5 border rounded-lg text-sm dark:bg-slate-800 dark:text-white font-mono"
          />
        </div>

        <div className="space-y-4">
          {/* SHA-256 */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
              <span>SHA-256 Hash Digest (Secure)</span>
              <button onClick={() => copyHash(sha256, 'sha256')} className="btn-secondary py-1 px-2.5 text-[10px]">
                {copiedKey === 'sha256' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />} Copy SHA-256
              </button>
            </div>
            <div className="font-mono text-xs text-brand-600 dark:text-brand-400 break-all select-all">
              {sha256 || '...'}
            </div>
          </div>

          {/* SHA-512 */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
              <span>SHA-512 Hash Digest (High Security)</span>
              <button onClick={() => copyHash(sha512, 'sha512')} className="btn-secondary py-1 px-2.5 text-[10px]">
                {copiedKey === 'sha512' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />} Copy SHA-512
              </button>
            </div>
            <div className="font-mono text-xs text-brand-600 dark:text-brand-400 break-all select-all">
              {sha512 || '...'}
            </div>
          </div>

          {/* SHA-1 */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
              <span>SHA-1 Hash (Legacy Checksum)</span>
              <button onClick={() => copyHash(sha1, 'sha1')} className="btn-secondary py-1 px-2.5 text-[10px]">
                {copiedKey === 'sha1' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />} Copy SHA-1
              </button>
            </div>
            <div className="font-mono text-xs text-slate-600 dark:text-slate-400 break-all select-all">
              {sha1 || '...'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
