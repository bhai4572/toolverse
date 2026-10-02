'use client';

import React, { useState } from 'react';
import { Landmark, ArrowRight } from 'lucide-react';
import { calculatePakistanSalaryTax, PAKISTAN_TAX_METADATA } from '@/lib/country/taxEngine';

export function PakistanTaxTool() {
  const [monthlySalary, setMonthlySalary] = useState(150000);
  const taxResult = calculatePakistanSalaryTax(monthlySalary);

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-6">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Enter Gross Monthly Salary (PKR):
          </label>
          <input
            type="number"
            value={monthlySalary}
            onChange={(e) => setMonthlySalary(parseFloat(e.target.value) || 0)}
            placeholder="e.g. 150000"
            className="w-full p-3 border rounded-lg text-lg font-bold text-slate-900 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
          />
        </div>

        {/* Breakdown Card */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="text-xs text-slate-500 mb-1">Annual Gross Salary</div>
            <div className="text-xl font-bold text-slate-900 dark:text-white">
              PKR {taxResult.annualSalary.toLocaleString()}
            </div>
          </div>

          <div className="p-4 bg-red-50 dark:bg-red-950/40 rounded-xl border border-red-200 dark:border-red-900/50">
            <div className="text-xs text-red-700 dark:text-red-400 mb-1">Monthly Tax Deduction</div>
            <div className="text-xl font-bold text-red-600 dark:text-red-400">
              PKR {taxResult.monthlyTax.toLocaleString()}
            </div>
            <div className="text-[10px] text-red-500 mt-1">Annual Tax: PKR {taxResult.annualTax.toLocaleString()}</div>
          </div>

          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-900/50">
            <div className="text-xs text-emerald-700 dark:text-emerald-400 mb-1">Net Monthly Take-Home</div>
            <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
              PKR {taxResult.monthlyTakeHome.toLocaleString()}
            </div>
            <div className="text-[10px] text-emerald-600 mt-1">Effective Tax Rate: {taxResult.effectiveTaxRate}%</div>
          </div>
        </div>

        <div className="p-4 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 rounded-xl text-xs space-y-1">
          <div className="font-semibold text-blue-900 dark:text-blue-300">Applied FBR Tax Slab:</div>
          <div className="text-blue-700 dark:text-blue-400">{taxResult.slabApplied}</div>
          <div className="text-[10px] text-slate-500 pt-2">{PAKISTAN_TAX_METADATA.disclaimer}</div>
        </div>
      </div>
    </div>
  );
}
