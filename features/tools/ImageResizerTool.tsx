'use client';

import React, { useState } from 'react';
import { Upload, Download, RefreshCw, CheckCircle, Sliders } from 'lucide-react';
import { resizeImageFile, SOCIAL_PRESETS } from '@/lib/image/engine';

export function ImageResizerTool({ isSocialMode = false }: { isSocialMode?: boolean }) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [originalWidth, setOriginalWidth] = useState<number>(0);
  const [originalHeight, setOriginalHeight] = useState<number>(0);

  const [width, setWidth] = useState<number>(1080);
  const [height, setHeight] = useState<number>(1080);
  const [lockAspect, setLockAspect] = useState<boolean>(true);
  const [format, setFormat] = useState<'image/jpeg' | 'image/png' | 'image/webp'>('image/jpeg');

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      const url = URL.createObjectURL(selected);
      setPreviewUrl(url);

      const img = new Image();
      img.onload = () => {
        setOriginalWidth(img.width);
        setOriginalHeight(img.height);
        if (!isSocialMode) {
          setWidth(img.width);
          setHeight(img.height);
        }
      };
      img.src = url;
    }
  };

  const handleWidthChange = (val: number) => {
    setWidth(val);
    if (lockAspect && originalWidth > 0) {
      const ratio = originalHeight / originalWidth;
      setHeight(Math.round(val * ratio));
    }
  };

  const handleHeightChange = (val: number) => {
    setHeight(val);
    if (lockAspect && originalHeight > 0) {
      const ratio = originalWidth / originalHeight;
      setWidth(Math.round(val * ratio));
    }
  };

  const selectSocialPreset = (presetW: number, presetH: number) => {
    setWidth(presetW);
    setHeight(presetH);
    setLockAspect(false);
  };

  const processResize = async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      const blob = await resizeImageFile(file, width, height, format, 0.9, '#ffffff');
      setResultBlob(blob);
      setResultUrl(URL.createObjectURL(blob));
    } catch (e) {
      alert('Failed to resize image.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {!file ? (
        <div className="dropzone flex flex-col items-center justify-center min-h-[220px]">
          <div className="w-12 h-12 rounded-full bg-brand-50 dark:bg-slate-800 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-3">
            <Upload className="w-6 h-6" />
          </div>
          <p className="font-semibold text-slate-800 dark:text-slate-200">
            Upload photo to resize
          </p>
          <p className="text-xs text-slate-500 mt-1 mb-4">Supports JPG, PNG, WebP</p>
          <label className="btn-primary cursor-pointer text-sm">
            <span>Select Image</span>
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </label>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-6">
          {/* Preset buttons */}
          {isSocialMode && (
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-800 dark:text-slate-200">
                Choose Social Media Canvas Preset:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {SOCIAL_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => selectSocialPreset(preset.width, preset.height)}
                    className={`p-2.5 rounded-lg text-left border text-xs transition-colors ${
                      width === preset.width && height === preset.height
                        ? 'bg-brand-50 dark:bg-brand-950/50 border-brand-500 text-brand-700 dark:text-brand-300 font-semibold'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="font-medium truncate">{preset.name}</div>
                    <div className="text-[10px] text-slate-500">{preset.width} x {preset.height} px</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Width / Height manual controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Width (pixels)
              </label>
              <input
                type="number"
                value={width}
                onChange={(e) => handleWidthChange(parseInt(e.target.value, 10) || 0)}
                className="w-full px-3 py-2 border rounded-lg text-sm dark:bg-slate-800 dark:border-slate-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Height (pixels)
              </label>
              <input
                type="number"
                value={height}
                onChange={(e) => handleHeightChange(parseInt(e.target.value, 10) || 0)}
                className="w-full px-3 py-2 border rounded-lg text-sm dark:bg-slate-800 dark:border-slate-700 dark:text-white"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={lockAspect}
                onChange={(e) => setLockAspect(e.target.checked)}
                className="rounded text-brand-600"
              />
              <span>Maintain Aspect Ratio</span>
            </label>
            <span>Original: {originalWidth} x {originalHeight} px</span>
          </div>

          <button onClick={processResize} disabled={isProcessing} className="w-full btn-primary py-3 text-sm">
            {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Resize Image Now'}
          </button>

          {resultBlob && resultUrl && (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                <span className="text-sm font-semibold text-emerald-900 dark:text-emerald-200">
                  Resized to {width} x {height} px!
                </span>
              </div>
              <a href={resultUrl} download={`resized-${width}x${height}-${file.name}`} className="btn-primary text-xs flex items-center gap-2 bg-emerald-600">
                <Download className="w-4 h-4" /> Download Resized Image
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
