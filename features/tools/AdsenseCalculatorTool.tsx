'use client';

import React, { useState } from 'react';
import { DollarSign, TrendingUp } from 'lucide-react';

export function AdsenseCalculatorTool() {
  const [pageViews, setPageViews] = useState(10000);
  const [ctr, setCtr] = useState(1.5);
  const [cpc, setCpc] = useState(0.25);

  const clicks = Math.round((pageViews * ctr) / 100);
  const dailyEarnings = clicks * cpc;
  const monthlyEarnings = dailyEarnings * 30;
  const yearlyEarnings = dailyEarnings * 365;

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Daily Website Page Views:
            </label>
            <input
              type="number"
              value={pageViews}
              onChange={(e) => setPageViews(parseInt(e.target.value, 10) || 0)}
              className="w-full p-2.5 border rounded-lg text-sm dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Click-Through Rate (CTR %):
            </label>
            <input
              type="number"
              step="0.1"
              value={ctr}
              onChange={(e) => setCtr(parseFloat(e.target.value) || 0)}
              className="w-full p-2.5 border rounded-lg text-sm dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Cost Per Click (CPC $):
            </label>
            <input
              type="number"
              step="0.05"
              value={cpc}
              onChange={(e) => setCpc(parseFloat(e.target.value) || 0)}
              className="w-full p-2.5 border rounded-lg text-sm dark:bg-slate-800 dark:text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
            <div className="text-xs text-slate-500 mb-1">Daily Estimated Revenue</div>
            <div className="text-xl font-bold text-slate-900 dark:text-white">${dailyEarnings.toFixed(2)}</div>
            <div className="text-[10px] text-slate-400 mt-1">~{clicks} Ad Clicks / day</div>
          </div>

          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800/50 text-center">
            <div className="text-xs text-emerald-800 dark:text-emerald-300 mb-1">Monthly Projected Earnings</div>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">${monthlyEarnings.toFixed(2)}</div>
            <div className="text-[10px] text-emerald-700 dark:text-emerald-500 mt-1">Based on 30 active days</div>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
            <div className="text-xs text-slate-500 mb-1">Yearly Projected Revenue</div>
            <div className="text-xl font-bold text-slate-900 dark:text-white">${yearlyEarnings.toFixed(2)}</div>
            <div className="text-[10px] text-slate-400 mt-1">Based on 365 days</div>
          </div>
        </div>
      </div>
    </div>
  );
}
