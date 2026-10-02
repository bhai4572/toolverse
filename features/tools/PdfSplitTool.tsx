'use client';

import React, { useState } from 'react';
import { Upload, Download, RefreshCw, Scissors, CheckCircle } from 'lucide-react';
import { splitPdfFile } from '@/lib/pdf/engine';

export function PdfSplitTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pageRange, setPageRange] = useState<string>('1-3');
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResultUrl(null);
    }
  };

  const processSplit = async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      // Parse page ranges e.g. "1-3, 5" -> [0, 1, 2, 4]
      const indices: number[] = [];
      const parts = pageRange.split(',');
      for (const part of parts) {
        const trimmed = part.trim();
        if (trimmed.includes('-')) {
          const [start, end] = trimmed.split('-').map((n) => parseInt(n.trim(), 10));
          if (!isNaN(start) && !isNaN(end)) {
            for (let i = start; i <= end; i++) {
              indices.push(i - 1);
            }
          }
        } else {
          const single = parseInt(trimmed, 10);
          if (!isNaN(single)) indices.push(single - 1);
        }
      }

      const splitBytes = await splitPdfFile(file, indices);
      const blob = new Blob([splitBytes as unknown as BlobPart], { type: 'application/pdf' });
      setResultUrl(URL.createObjectURL(blob));
    } catch {
      alert('Failed to extract PDF pages.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {!file ? (
        <div className="dropzone flex flex-col items-center justify-center min-h-[200px]">
          <div className="w-10 h-10 rounded-full bg-brand-50 dark:bg-slate-800 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-2">
            <Scissors className="w-5 h-5" />
          </div>
          <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm">Upload PDF to split pages</p>
          <label className="btn-primary cursor-pointer text-xs mt-3">
            <span>Select PDF File</span>
            <input type="file" accept=".pdf" onChange={handleFile} className="hidden" />
          </label>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between text-sm font-semibold">
            <span>Selected File: {file.name}</span>
            <button onClick={() => setFile(null)} className="btn-secondary text-xs">Choose Different PDF</button>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Enter Page Range to Extract (e.g. 1-3, 5, 8-10):
            </label>
            <input
              type="text"
              value={pageRange}
              onChange={(e) => setPageRange(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm dark:bg-slate-800 dark:border-slate-700 dark:text-white"
            />
          </div>

          <button onClick={processSplit} disabled={isProcessing} className="w-full btn-primary py-3 text-sm">
            {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Split PDF Pages Now'}
          </button>

          {resultUrl && (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 rounded-xl flex items-center justify-between">
              <span className="text-sm font-semibold text-emerald-900 dark:text-emerald-200 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-600" /> Split PDF Ready!
              </span>
              <a href={resultUrl} download={`split-${file.name}`} className="btn-primary text-xs flex items-center gap-2 bg-emerald-600">
                <Download className="w-4 h-4" /> Download Split PDF
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
