'use client';

import React, { useState } from 'react';
import { Upload, Download, RefreshCw, FilePlus, CheckCircle } from 'lucide-react';
import { imagesToPdfFile } from '@/lib/pdf/engine';

export function JpgToPdfTool() {
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [pageSize, setPageSize] = useState<'A4' | 'Letter' | 'Fit'>('A4');
  const [isProcessing, setIsProcessing] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageFiles(Array.from(e.target.files));
      setPdfUrl(null);
    }
  };

  const processImagesToPdf = async () => {
    if (imageFiles.length === 0) return;
    setIsProcessing(true);
    try {
      const pdfBytes = await imagesToPdfFile(imageFiles, pageSize);
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
      setPdfUrl(URL.createObjectURL(blob));
    } catch {
      alert('Failed to generate PDF from images.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {imageFiles.length === 0 ? (
        <div className="dropzone flex flex-col items-center justify-center min-h-[200px]">
          <div className="w-10 h-10 rounded-full bg-brand-50 dark:bg-slate-800 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-2">
            <FilePlus className="w-5 h-5" />
          </div>
          <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm">Upload JPG or PNG photos to convert to PDF</p>
          <label className="btn-primary cursor-pointer text-xs mt-3">
            <span>Select Image Files</span>
            <input type="file" multiple accept="image/*" onChange={handleFiles} className="hidden" />
          </label>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between text-sm font-semibold">
            <span>{imageFiles.length} Images Selected</span>
            <button onClick={() => setImageFiles([])} className="btn-secondary text-xs">Clear Images</button>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Select PDF Page Layout:</label>
            <div className="flex gap-2">
              {['A4', 'Letter', 'Fit'].map((size) => (
                <button
                  key={size}
                  onClick={() => setPageSize(size as any)}
                  className={`px-4 py-2 rounded-lg text-xs font-medium border ${
                    pageSize === size ? 'bg-brand-600 text-white border-brand-600' : 'bg-slate-100 dark:bg-slate-800'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <button onClick={processImagesToPdf} disabled={isProcessing} className="w-full btn-primary py-3 text-sm">
            {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Convert Images to PDF'}
          </button>

          {pdfUrl && (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 rounded-xl flex items-center justify-between">
              <span className="text-sm font-semibold text-emerald-900 dark:text-emerald-200 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-600" /> PDF Generated Successfully!
              </span>
              <a href={pdfUrl} download="images-converted.pdf" className="btn-primary text-xs flex items-center gap-2 bg-emerald-600">
                <Download className="w-4 h-4" /> Download PDF Document
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
