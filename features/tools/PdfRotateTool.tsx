'use client';

import React, { useState } from 'react';
import { Upload, Download, RefreshCw, RotateCw, CheckCircle } from 'lucide-react';
import { rotatePdfPages } from '@/lib/pdf/engine';

export function PdfRotateTool() {
  const [file, setFile] = useState<File | null>(null);
  const [rotationAngle, setRotationAngle] = useState<90 | 180 | 270>(90);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResultUrl(null);
    }
  };

  const processRotate = async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      const pdfBytes = await rotatePdfPages(file, rotationAngle);
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
      setResultUrl(URL.createObjectURL(blob));
    } catch {
      alert('Failed to rotate PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {!file ? (
        <div className="dropzone flex flex-col items-center justify-center min-h-[200px]">
          <div className="w-10 h-10 rounded-full bg-brand-50 dark:bg-slate-800 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-2">
            <RotateCw className="w-5 h-5" />
          </div>
          <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm">Upload PDF to rotate pages</p>
          <label className="btn-primary cursor-pointer text-xs mt-3">
            <span>Select PDF File</span>
            <input type="file" accept=".pdf" onChange={handleFile} className="hidden" />
          </label>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between text-sm font-semibold">
            <span>Selected File: {file.name}</span>
            <button onClick={() => setFile(null)} className="btn-secondary text-xs">Clear File</button>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Rotation Angle:</label>
            <div className="flex gap-2">
              {[
                { angle: 90, label: '90° Clockwise' },
                { angle: 180, label: '180° Flip' },
                { angle: 270, label: '270° Counter-Clockwise' },
              ].map((item) => (
                <button
                  key={item.angle}
                  onClick={() => setRotationAngle(item.angle as any)}
                  className={`px-4 py-2 rounded-lg text-xs font-medium border ${
                    rotationAngle === item.angle ? 'bg-brand-600 text-white border-brand-600' : 'bg-slate-100 dark:bg-slate-800'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <button onClick={processRotate} disabled={isProcessing} className="w-full btn-primary py-3 text-sm">
            {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Rotate PDF Pages Now'}
          </button>

          {resultUrl && (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 rounded-xl flex items-center justify-between">
              <span className="text-sm font-semibold text-emerald-900 dark:text-emerald-200 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-600" /> Rotated PDF Ready!
              </span>
              <a href={resultUrl} download={`rotated-${file.name}`} className="btn-primary text-xs flex items-center gap-2 bg-emerald-600">
                <Download className="w-4 h-4" /> Download Rotated PDF
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
