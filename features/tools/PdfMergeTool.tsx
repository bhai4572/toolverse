'use client';

import React, { useState } from 'react';
import { Upload, Download, RefreshCw, Layers, CheckCircle, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { mergePdfFiles } from '@/lib/pdf/engine';

export function PdfMergeTool() {
  const [pdfFiles, setPdfFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mergedBlobUrl, setMergedBlobUrl] = useState<string | null>(null);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setPdfFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
      setMergedBlobUrl(null);
    }
  };

  const moveUp = (idx: number) => {
    if (idx <= 0) return;
    const copy = [...pdfFiles];
    const temp = copy[idx - 1];
    copy[idx - 1] = copy[idx];
    copy[idx] = temp;
    setPdfFiles(copy);
  };

  const moveDown = (idx: number) => {
    if (idx >= pdfFiles.length - 1) return;
    const copy = [...pdfFiles];
    const temp = copy[idx + 1];
    copy[idx + 1] = copy[idx];
    copy[idx] = temp;
    setPdfFiles(copy);
  };

  const removeFile = (idx: number) => {
    setPdfFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const processMerge = async () => {
    if (pdfFiles.length < 2) return;
    setIsProcessing(true);
    try {
      const mergedBytes = await mergePdfFiles(pdfFiles);
      const blob = new Blob([mergedBytes as unknown as BlobPart], { type: 'application/pdf' });
      setMergedBlobUrl(URL.createObjectURL(blob));
    } catch (e) {
      alert('Failed to merge PDF files. Ensure files are not password-protected.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="dropzone flex flex-col items-center justify-center min-h-[160px]">
        <div className="w-10 h-10 rounded-full bg-brand-50 dark:bg-slate-800 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-2">
          <Layers className="w-5 h-5" />
        </div>
        <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
          Select or drop PDF files to combine
        </p>
        <label className="btn-primary cursor-pointer text-xs mt-3">
          <span>Add PDF Files</span>
          <input type="file" multiple accept=".pdf" onChange={handleFiles} className="hidden" />
        </label>
      </div>

      {pdfFiles.length > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between text-sm font-semibold text-slate-800 dark:text-slate-200">
            <span>Selected PDFs ({pdfFiles.length})</span>
            <button onClick={() => setPdfFiles([])} className="btn-secondary text-xs">Clear All</button>
          </div>

          <div className="space-y-2">
            {pdfFiles.map((file, idx) => (
              <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg flex items-center justify-between text-xs">
                <span className="font-medium text-slate-800 dark:text-slate-200 truncate max-w-xs">
                  {idx + 1}. {file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                </span>
                <div className="flex items-center gap-1">
                  <button onClick={() => moveUp(idx)} disabled={idx === 0} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded">
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => moveDown(idx)} disabled={idx === pdfFiles.length - 1} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded">
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => removeFile(idx)} className="p-1 hover:bg-red-100 text-red-600 rounded">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button onClick={processMerge} disabled={pdfFiles.length < 2 || isProcessing} className="w-full btn-primary py-3 text-sm">
            {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Merge PDF Files Now'}
          </button>

          {mergedBlobUrl && (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold text-emerald-900 dark:text-emerald-200">
                <CheckCircle className="w-5 h-5 text-emerald-600" /> PDFs Merged Successfully!
              </div>
              <a href={mergedBlobUrl} download="merged-document.pdf" className="btn-primary text-xs flex items-center gap-2 bg-emerald-600">
                <Download className="w-4 h-4" /> Download Merged PDF
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
