'use client';

import React, { useState } from 'react';
import { Upload, Download, RefreshCw, FileImage, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { compressImageFile, compressToTargetKB } from '@/lib/image/engine';

export function ImageCompressorTool({ isTargetKbMode = false }: { isTargetKbMode?: boolean }) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [quality, setQuality] = useState<number>(80);
  const [targetKb, setTargetKb] = useState<number>(100);
  const [customKb, setCustomKb] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
      setResultBlob(null);
      setResultUrl(null);
      setError(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const selected = e.dataTransfer.files[0];
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
      setResultBlob(null);
      setResultUrl(null);
      setError(null);
    }
  };

  const processImage = async () => {
    if (!file) return;
    setIsProcessing(true);
    setError(null);

    try {
      let outputBlob: Blob;

      if (isTargetKbMode) {
        const kbTarget = customKb ? parseInt(customKb, 10) : targetKb;
        if (isNaN(kbTarget) || kbTarget <= 0) {
          throw new Error('Please enter a valid target size in KB');
        }
        outputBlob = await compressToTargetKB(file, kbTarget);
      } else {
        const compressedFile = await compressImageFile(file, 2, quality / 100);
        outputBlob = compressedFile;
      }

      setResultBlob(outputBlob);
      setResultUrl(URL.createObjectURL(outputBlob));
    } catch (err: any) {
      setError(err.message || 'Compression failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  return (
    <div className="space-y-6">
      {!file ? (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="dropzone flex flex-col items-center justify-center min-h-[220px]"
        >
          <div className="w-12 h-12 rounded-full bg-brand-50 dark:bg-slate-800 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-3">
            <Upload className="w-6 h-6" />
          </div>
          <p className="font-semibold text-slate-800 dark:text-slate-200">
            Drag and drop your image here
          </p>
          <p className="text-xs text-slate-500 mt-1 mb-4">Supports JPG, PNG, WebP up to 50MB</p>
          <label className="btn-primary cursor-pointer text-sm">
            <span>Browse Image</span>
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </label>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              {previewUrl && (
                <img src={previewUrl} alt="Original" className="w-14 h-14 object-cover rounded-lg border" />
              )}
              <div>
                <div className="font-semibold text-slate-900 dark:text-white truncate max-w-xs">{file.name}</div>
                <div className="text-xs text-slate-500">Original Size: {formatSize(file.size)}</div>
              </div>
            </div>
            <button
              onClick={() => {
                setFile(null);
                setResultBlob(null);
                setResultUrl(null);
              }}
              className="btn-secondary text-xs"
            >
              Choose Different Image
            </button>
          </div>

          {/* Controls */}
          {isTargetKbMode ? (
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-800 dark:text-slate-200">
                Select Target File Size:
              </label>
              <div className="flex flex-wrap gap-2">
                {[20, 30, 50, 80, 100, 150, 200, 300, 500].map((kb) => (
                  <button
                    key={kb}
                    onClick={() => {
                      setTargetKb(kb);
                      setCustomKb('');
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      targetKb === kb && !customKb
                        ? 'bg-brand-600 text-white border-brand-600'
                        : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {kb} KB
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2 pt-2">
                <span className="text-xs text-slate-500">Or Custom Target:</span>
                <input
                  type="number"
                  placeholder="e.g. 75"
                  value={customKb}
                  onChange={(e) => setCustomKb(e.target.value)}
                  className="w-24 px-3 py-1 text-xs border rounded-lg dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                />
                <span className="text-xs text-slate-500">KB</span>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-semibold text-slate-800 dark:text-slate-200">Compression Quality: {quality}%</span>
                <span className="text-xs text-slate-500">{quality > 70 ? 'High Quality' : quality > 40 ? 'Balanced' : 'Max Compression'}</span>
              </div>
              <input
                type="range"
                min="10"
                max="95"
                value={quality}
                onChange={(e) => setQuality(parseInt(e.target.value, 10))}
                className="w-full accent-brand-600"
              />
            </div>
          )}

          <button
            onClick={processImage}
            disabled={isProcessing}
            className="w-full btn-primary text-sm py-3"
          >
            {isProcessing ? (
              <span className="flex items-center justify-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin" /> Compress Image...
              </span>
            ) : (
              'Compress Image Now'
            )}
          </button>

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 text-xs rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
            </div>
          )}

          {/* Results */}
          {resultBlob && resultUrl && (
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-4">
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <div>
                    <div className="font-semibold text-emerald-900 dark:text-emerald-200 text-sm">
                      Compression Complete!
                    </div>
                    <div className="text-xs text-emerald-700 dark:text-emerald-400 flex items-center gap-2 mt-0.5">
                      <span>{formatSize(file.size)}</span>
                      <ArrowRight className="w-3 h-3" />
                      <span className="font-bold">{formatSize(resultBlob.size)}</span>
                      <span className="bg-emerald-200 dark:bg-emerald-900 px-1.5 py-0.5 rounded text-[10px]">
                        {Math.round(((file.size - resultBlob.size) / file.size) * 100)}% smaller
                      </span>
                    </div>
                  </div>
                </div>

                <a
                  href={resultUrl}
                  download={`compressed-${file.name}`}
                  className="btn-primary text-xs flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <Download className="w-4 h-4" /> Download Compressed Image
                </a>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
