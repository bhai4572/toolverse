'use client';

import React, { useState } from 'react';
import { Upload, Download, RefreshCw, CheckCircle, RefreshCcw } from 'lucide-react';
import { convertImageFormat } from '@/lib/image/engine';

export function ImageConverterTool({ defaultTargetFormat = 'image/png' }: { defaultTargetFormat?: 'image/jpeg' | 'image/png' | 'image/webp' }) {
  const [files, setFiles] = useState<File[]>([]);
  const [targetFormat, setTargetFormat] = useState<'image/jpeg' | 'image/png' | 'image/webp'>(defaultTargetFormat);
  const [isProcessing, setIsProcessing] = useState(false);
  const [convertedResults, setConvertedResults] = useState<{ name: string; url: string; size: number }[]>([]);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(Array.from(e.target.files));
      setConvertedResults([]);
    }
  };

  const convertBatch = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    const results = [];

    for (const file of files) {
      try {
        const blob = await convertImageFormat(file, targetFormat, 0.9);
        const ext = targetFormat === 'image/jpeg' ? '.jpg' : targetFormat === 'image/png' ? '.png' : '.webp';
        const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
        results.push({
          name: `${baseName}${ext}`,
          url: URL.createObjectURL(blob),
          size: blob.size,
        });
      } catch (err) {
        console.error('Failed converting file:', file.name, err);
      }
    }

    setConvertedResults(results);
    setIsProcessing(false);
  };

  return (
    <div className="space-y-6">
      {files.length === 0 ? (
        <div className="dropzone flex flex-col items-center justify-center min-h-[220px]">
          <div className="w-12 h-12 rounded-full bg-brand-50 dark:bg-slate-800 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-3">
            <Upload className="w-6 h-6" />
          </div>
          <p className="font-semibold text-slate-800 dark:text-slate-200">
            Upload images to convert format
          </p>
          <p className="text-xs text-slate-500 mt-1 mb-4">Supports JPG, PNG, WebP, HEIC</p>
          <label className="btn-primary cursor-pointer text-sm">
            <span>Select Images</span>
            <input type="file" multiple accept="image/*,.heic" onChange={handleFiles} className="hidden" />
          </label>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              {files.length} File{files.length > 1 ? 's' : ''} Selected
            </div>
            <button onClick={() => setFiles([])} className="btn-secondary text-xs">
              Clear All
            </button>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Target Export Format:
            </label>
            <div className="flex gap-2">
              {[
                { id: 'image/png', label: 'PNG (Lossless)' },
                { id: 'image/jpeg', label: 'JPG / JPEG' },
                { id: 'image/webp', label: 'WebP (Modern)' },
              ].map((fmt) => (
                <button
                  key={fmt.id}
                  onClick={() => setTargetFormat(fmt.id as any)}
                  className={`px-4 py-2 rounded-lg text-xs font-medium border transition-colors ${
                    targetFormat === fmt.id
                      ? 'bg-brand-600 text-white border-brand-600'
                      : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {fmt.label}
                </button>
              ))}
            </div>
          </div>

          <button onClick={convertBatch} disabled={isProcessing} className="w-full btn-primary py-3 text-sm">
            {isProcessing ? (
              <span className="flex items-center justify-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin" /> Converting Images...
              </span>
            ) : (
              'Convert Format Now'
            )}
          </button>

          {convertedResults.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
              <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" /> Converted {convertedResults.length} Images Successfully!
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto">
                {convertedResults.map((item, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-800 dark:text-slate-200 truncate max-w-xs">{item.name}</span>
                    <a href={item.url} download={item.name} className="btn-primary py-1 px-3 text-xs bg-emerald-600 hover:bg-emerald-700">
                      Download
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
