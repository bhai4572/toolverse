'use client';

import React, { useState } from 'react';
import { Upload, Download, RefreshCw, UserCheck, CheckCircle } from 'lucide-react';
import { PASSPORT_PRESETS, resizeImageFile } from '@/lib/image/engine';

export function PassportPhotoMakerTool() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedPreset, setSelectedPreset] = useState(PASSPORT_PRESETS[0]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
      setResultUrl(null);
    }
  };

  const processPassportPhoto = async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      const blob = await resizeImageFile(
        file,
        selectedPreset.widthPx,
        selectedPreset.heightPx,
        'image/jpeg',
        0.95,
        '#ffffff'
      );
      setResultUrl(URL.createObjectURL(blob));
    } catch {
      alert('Failed to generate passport photo.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {!file ? (
        <div className="dropzone flex flex-col items-center justify-center min-h-[220px]">
          <div className="w-12 h-12 rounded-full bg-brand-50 dark:bg-slate-800 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-3">
            <UserCheck className="w-6 h-6" />
          </div>
          <p className="font-semibold text-slate-800 dark:text-slate-200">Upload portrait photo for passport / visa</p>
          <p className="text-xs text-slate-500 mt-1 mb-4">Frontal headshot with neutral background recommended</p>
          <label className="btn-primary cursor-pointer text-sm">
            <span>Select Headshot Photo</span>
            <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
          </label>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-6">
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate-800 dark:text-slate-200">
              Select Official Passport / Visa Requirement Preset:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {PASSPORT_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => {
                    setSelectedPreset(preset);
                    setResultUrl(null);
                  }}
                  className={`p-3 rounded-lg text-left border text-xs transition-colors ${
                    selectedPreset.id === preset.id
                      ? 'bg-brand-50 dark:bg-brand-950/50 border-brand-500 text-brand-700 dark:text-brand-300 font-semibold'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="font-medium">{preset.name}</div>
                  <div className="text-[10px] text-slate-500">{preset.widthPx} x {preset.heightPx} px</div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
            {previewUrl && (
              <div className="text-center">
                <div className="text-xs text-slate-500 mb-2">Selected Photo</div>
                <img src={previewUrl} alt="Passport Headshot" className="w-32 h-32 object-cover rounded-lg border shadow-sm mx-auto" />
              </div>
            )}
          </div>

          <button onClick={processPassportPhoto} disabled={isProcessing} className="w-full btn-primary py-3 text-sm">
            {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Generate Passport Photo'}
          </button>

          {resultUrl && (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                <span className="text-sm font-semibold text-emerald-900 dark:text-emerald-200">
                  Compliant Passport Photo Ready!
                </span>
              </div>
              <a href={resultUrl} download={`passport-photo-${selectedPreset.id}.jpg`} className="btn-primary text-xs flex items-center gap-2 bg-emerald-600">
                <Download className="w-4 h-4" /> Download Photo
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
