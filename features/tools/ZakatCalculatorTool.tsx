'use client';

import React, { useState } from 'react';
import { Heart, DollarSign, CheckCircle } from 'lucide-react';
import { calculateZakat } from '@/lib/country/taxEngine';

export function ZakatCalculatorTool() {
  const [cashInHand, setCashInHand] = useState(150000);
  const [bankBalances, setBankBalances] = useState(200000);
  const [goldValue, setGoldValue] = useState(300000);
  const [silverValue, setSilverValue] = useState(0);
  const [businessAssets, setBusinessAssets] = useState(100000);
  const [liabilities, setLiabilities] = useState(50000);
  const [nisabValue, setNisabValue] = useState(165000); // Silver nisab threshold approximate

  const result = calculateZakat({
    cashInHand,
    bankBalances,
    goldValue,
    silverValue,
    businessAssets,
    liabilities,
    nisabValue,
  });

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Cash In Hand / Personal Savings</label>
            <input type="number" value={cashInHand} onChange={(e) => setCashInHand(parseFloat(e.target.value) || 0)} className="w-full p-2 border rounded text-sm dark:bg-slate-800 dark:text-white" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Bank Account Balances</label>
            <input type="number" value={bankBalances} onChange={(e) => setBankBalances(parseFloat(e.target.value) || 0)} className="w-full p-2 border rounded text-sm dark:bg-slate-800 dark:text-white" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Gold Holdings Value</label>
            <input type="number" value={goldValue} onChange={(e) => setGoldValue(parseFloat(e.target.value) || 0)} className="w-full p-2 border rounded text-sm dark:bg-slate-800 dark:text-white" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Silver Holdings Value</label>
            <input type="number" value={silverValue} onChange={(e) => setSilverValue(parseFloat(e.target.value) || 0)} className="w-full p-2 border rounded text-sm dark:bg-slate-800 dark:text-white" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Business Inventory / Trade Goods</label>
            <input type="number" value={businessAssets} onChange={(e) => setBusinessAssets(parseFloat(e.target.value) || 0)} className="w-full p-2 border rounded text-sm dark:bg-slate-800 dark:text-white" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Deductible Immediate Debts / Liabilities</label>
            <input type="number" value={liabilities} onChange={(e) => setLiabilities(parseFloat(e.target.value) || 0)} className="w-full p-2 border rounded text-sm dark:bg-slate-800 dark:text-white" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Nisab Threshold Value (Silver Nisab ~52.5 Tolas / 612g)</label>
          <input type="number" value={nisabValue} onChange={(e) => setNisabValue(parseFloat(e.target.value) || 0)} className="w-full p-2 border rounded text-sm dark:bg-slate-800 dark:text-white" />
        </div>

        {/* Results summary card */}
        <div className="p-5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 rounded-xl space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600 dark:text-slate-300">Total Asset Value:</span>
            <span className="font-bold text-slate-900 dark:text-white">{result.totalAssets.toLocaleString()}</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600 dark:text-slate-300">Net Wealth (Assets - Liabilities):</span>
            <span className="font-bold text-slate-900 dark:text-white">{result.netWealth.toLocaleString()}</span>
          </div>

          <div className="pt-3 border-t border-emerald-200/60 dark:border-emerald-800/60 flex items-center justify-between">
            <div>
              <div className="text-xs text-emerald-800 dark:text-emerald-300 font-medium">Zakat Obligation (2.5%)</div>
              <div className="text-xs text-slate-500">
                {result.isEligibleForZakat ? 'Wealth is above Nisab threshold.' : 'Net wealth is below Nisab.'}
              </div>
            </div>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {result.zakatPayable.toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
