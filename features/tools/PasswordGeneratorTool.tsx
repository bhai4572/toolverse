'use client';

import React, { useState, useEffect } from 'react';
import { Copy, Check, RefreshCw, Lock, ShieldCheck } from 'lucide-react';
import { generateSecurePassword } from '@/lib/developer/engine';

export function PasswordGeneratorTool() {
  const [length, setLength] = useState(16);
  const [uppercase, setUppercase] = useState(true);
  const [lowercase, setLowercase] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);

  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    setPassword(generateSecurePassword(length, { uppercase, lowercase, numbers, symbols }));
  };

  useEffect(() => {
    handleGenerate();
  }, [length, uppercase, lowercase, numbers, symbols]);

  const copyPassword = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-6">
        {/* Result Password display box */}
        <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-between gap-3 font-mono text-lg font-bold text-slate-900 dark:text-white break-all">
          <span>{password}</span>
          <button onClick={copyPassword} className="btn-primary text-xs flex items-center gap-1.5 flex-shrink-0">
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />} Copy
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span>Password Length: {length} Characters</span>
              <span className="text-emerald-600 font-bold">{length >= 16 ? 'Very Strong' : length >= 12 ? 'Strong' : 'Weak'}</span>
            </div>
            <input
              type="range"
              min="8"
              max="64"
              value={length}
              onChange={(e) => setLength(parseInt(e.target.value, 10))}
              className="w-full accent-brand-600"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-medium">
            <label className="flex items-center gap-2 cursor-pointer p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <input type="checkbox" checked={uppercase} onChange={(e) => setUppercase(e.target.checked)} className="rounded text-brand-600" />
              <span>A-Z (Uppercase)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <input type="checkbox" checked={lowercase} onChange={(e) => setLowercase(e.target.checked)} className="rounded text-brand-600" />
              <span>a-z (Lowercase)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <input type="checkbox" checked={numbers} onChange={(e) => setNumbers(e.target.checked)} className="rounded text-brand-600" />
              <span>0-9 (Numbers)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <input type="checkbox" checked={symbols} onChange={(e) => setSymbols(e.target.checked)} className="rounded text-brand-600" />
              <span>!@#$ (Symbols)</span>
            </label>
          </div>
        </div>

        <button onClick={handleGenerate} className="w-full btn-secondary py-2.5 text-xs flex items-center justify-center gap-2">
          <RefreshCw className="w-4 h-4" /> Regenerate Secure Password
        </button>
      </div>
    </div>
  );
}
