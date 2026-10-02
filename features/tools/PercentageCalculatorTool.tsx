'use client';

import React, { useState } from 'react';
import { Percent } from 'lucide-react';
import { calculatePercentage, calculatePercentageOf, calculatePercentageChange } from '@/lib/calculators/engine';

export function PercentageCalculatorTool() {
  const [valA, setValA] = useState<number>(20);
  const [valB, setValB] = useState<number>(500);

  const [part, setPart] = useState<number>(50);
  const [total, setTotal] = useState<number>(200);

  const [oldVal, setOldVal] = useState<number>(100);
  const [newVal, setNewVal] = useState<number>(150);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: What is X% of Y? */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4">
          <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">What is X% of Y?</div>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-slate-500">Percentage (X %)</label>
              <input type="number" value={valA} onChange={(e) => setValA(parseFloat(e.target.value) || 0)} className="w-full p-2 border rounded text-sm dark:bg-slate-800 dark:text-white" />
            </div>
            <div>
              <label className="text-xs text-slate-500">Total Value (Y)</label>
              <input type="number" value={valB} onChange={(e) => setValB(parseFloat(e.target.value) || 0)} className="w-full p-2 border rounded text-sm dark:bg-slate-800 dark:text-white" />
            </div>
          </div>
          <div className="p-3 bg-brand-50 dark:bg-slate-800 rounded-lg text-center">
            <div className="text-xs text-slate-500">Result</div>
            <div className="text-xl font-bold text-brand-600 dark:text-brand-400">
              {calculatePercentageOf(valA, valB)}
            </div>
          </div>
        </div>

        {/* Card 2: X is what % of Y? */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4">
          <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">X is what % of Y?</div>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-slate-500">Part Value (X)</label>
              <input type="number" value={part} onChange={(e) => setPart(parseFloat(e.target.value) || 0)} className="w-full p-2 border rounded text-sm dark:bg-slate-800 dark:text-white" />
            </div>
            <div>
              <label className="text-xs text-slate-500">Total Value (Y)</label>
              <input type="number" value={total} onChange={(e) => setTotal(parseFloat(e.target.value) || 0)} className="w-full p-2 border rounded text-sm dark:bg-slate-800 dark:text-white" />
            </div>
          </div>
          <div className="p-3 bg-brand-50 dark:bg-slate-800 rounded-lg text-center">
            <div className="text-xs text-slate-500">Result</div>
            <div className="text-xl font-bold text-brand-600 dark:text-brand-400">
              {calculatePercentage(part, total)}%
            </div>
          </div>
        </div>

        {/* Card 3: % Increase / Decrease */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4">
          <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">% Change (Increase/Decrease)</div>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-slate-500">Old Value</label>
              <input type="number" value={oldVal} onChange={(e) => setOldVal(parseFloat(e.target.value) || 0)} className="w-full p-2 border rounded text-sm dark:bg-slate-800 dark:text-white" />
            </div>
            <div>
              <label className="text-xs text-slate-500">New Value</label>
              <input type="number" value={newVal} onChange={(e) => setNewVal(parseFloat(e.target.value) || 0)} className="w-full p-2 border rounded text-sm dark:bg-slate-800 dark:text-white" />
            </div>
          </div>
          <div className="p-3 bg-brand-50 dark:bg-slate-800 rounded-lg text-center">
            <div className="text-xs text-slate-500">Percentage Change</div>
            <div className="text-xl font-bold text-brand-600 dark:text-brand-400">
              {calculatePercentageChange(oldVal, newVal)}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
