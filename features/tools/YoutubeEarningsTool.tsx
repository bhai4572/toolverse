'use client';

import React, { useState } from 'react';
import { Youtube, DollarSign } from 'lucide-react';

const NICHES = [
  { name: 'Finance / Investing / Business', minCpm: 8, maxCpm: 25 },
  { name: 'Tech / Software / AI', minCpm: 5, maxCpm: 15 },
  { name: 'Real Estate / Legal', minCpm: 6, maxCpm: 18 },
  { name: 'Education / How-To', minCpm: 2.5, maxCpm: 7 },
  { name: 'Gaming / Entertainment', minCpm: 1, maxCpm: 4 },
  { name: 'Vlogs / Lifestyle / Travel', minCpm: 1.5, maxCpm: 5 },
];

export function YoutubeEarningsTool() {
  const [dailyViews, setDailyViews] = useState(25000);
  const [selectedNiche, setSelectedNiche] = useState(NICHES[1]);

  const minDaily = (dailyViews / 1000) * selectedNiche.minCpm * 0.55; // 55% creator share
  const maxDaily = (dailyViews / 1000) * selectedNiche.maxCpm * 0.55;

  const minMonthly = minDaily * 30;
  const maxMonthly = maxDaily * 30;

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Estimated Daily Video Views:
            </label>
            <input
              type="number"
              value={dailyViews}
              onChange={(e) => setDailyViews(parseInt(e.target.value, 10) || 0)}
              className="w-full p-2.5 border rounded-lg text-sm dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Select Channel Niche / Category:
            </label>
            <select
              value={selectedNiche.name}
              onChange={(e) => setSelectedNiche(NICHES.find((n) => n.name === e.target.value) || NICHES[0])}
              className="w-full p-2.5 border rounded-lg text-sm dark:bg-slate-800 dark:text-white"
            >
              {NICHES.map((niche) => (
                <option key={niche.name} value={niche.name}>
                  {niche.name} (${niche.minCpm} - ${niche.maxCpm} CPM)
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="p-6 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-xl space-y-4 text-center">
          <div className="text-xs text-red-700 dark:text-red-400 font-semibold uppercase tracking-wider">
            Estimated Monthly Earnings Range:
          </div>
          <div className="text-3xl font-bold text-red-600 dark:text-red-400">
            ${minMonthly.toFixed(0)} - ${maxMonthly.toFixed(0)} <span className="text-xs text-slate-500 font-normal">/ month</span>
          </div>
          <div className="text-xs text-slate-500">
            Daily Estimated: ${minDaily.toFixed(2)} - ${maxDaily.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
}
