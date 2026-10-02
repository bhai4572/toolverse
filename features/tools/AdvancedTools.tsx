'use client';

import React, { useState } from 'react';
import { ToolDefinition } from '@/lib/tools/registry';
import {
  solveEquation,
  solveMatrix3x3Determinant,
  calculateTargetCgpa,
  calculateAttendance,
  convertUnits,
} from '@/lib/calculators/advancedMathEngine';
import {
  decodeJwtToken,
  translateCronExpression,
  calculateSubnet,
  formatSql,
} from '@/lib/developer/devToolsEngine';
import {
  estimatePakistanElectricityBill,
  calculateSolarRequirement,
  calculateDarazProfit,
} from '@/lib/regional/pakistanUtilityEngine';
import { jsPDF } from 'jspdf';
import {
  Calculator,
  Grid,
  RefreshCw,
  GraduationCap,
  Clock,
  FileCheck,
  FileText,
  Mail,
  Tag,
  Layers,
  Key,
  Database,
  Code,
  Network,
  ShoppingBag,
  Package,
  TrendingUp,
  Zap,
  Sun,
  Copy,
  Check,
  ShieldCheck,
  Plus,
  Trash2,
  Sparkles,
} from 'lucide-react';

export function AdvancedTools({ tool }: { tool: ToolDefinition }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = (val: string) => {
    navigator.clipboard.writeText(val);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 1. Equation Solver
  const [eqA, setEqA] = useState('1');
  const [eqB, setEqB] = useState('-5');
  const [eqC, setEqC] = useState('6');

  // 2. Matrix 3x3
  const [m3, setM3] = useState<[[number, number, number], [number, number, number], [number, number, number]]>([
    [1, 2, 3],
    [0, 1, 4],
    [5, 6, 0],
  ]);

  // 3. Unit Converter
  const [uVal, setUVal] = useState('100');
  const [uType, setUType] = useState<'energy' | 'power' | 'pressure' | 'temp'>('temp');
  const [uFrom, setUFrom] = useState('C');
  const [uTo, setUTo] = useState('F');

  // 4. Target CGPA
  const [curCgpa, setCurCgpa] = useState('3.2');
  const [compCredits, setCompCredits] = useState('60');
  const [upCredits, setUpCredits] = useState('15');
  const [targetCgpaVal, setTargetCgpaVal] = useState('3.5');

  // 5. Attendance Calculator
  const [attAttended, setAttAttended] = useState('25');
  const [attTotal, setAttTotal] = useState('35');

  // 6. Cover Letter Builder
  const [applicantName, setApplicantName] = useState('Muhammad Ali');
  const [companyName, setCompanyName] = useState('Tech Solutions Ltd');
  const [jobTitle, setJobTitle] = useState('Senior Full Stack Developer');

  // 7. YouTube Tags Formatter
  const [rawTags, setRawTags] = useState('nextjs, typescript, tailwind css, web development, tutorial');

  // 8. JWT Decoder
  const [jwtInput, setJwtInput] = useState(
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
  );

  // 9. Subnet Calculator
  const [subnetIp, setSubnetIp] = useState('192.168.1.10');
  const [subnetCidr, setSubnetCidr] = useState('24');

  // 10. Pakistan Electricity Bill
  const [elecUnits, setElecUnits] = useState('350');

  // 11. Solar Calculator Appliances List
  const [appliances, setAppliances] = useState([
    { name: 'Ceiling Fans', watts: 80, hoursPerDay: 12, count: 4 },
    { name: 'LED Lights', watts: 15, hoursPerDay: 8, count: 8 },
    { name: '1.5 Ton Inverter AC', watts: 1500, hoursPerDay: 6, count: 1 },
    { name: 'Refrigerator', watts: 350, hoursPerDay: 24, count: 1 },
  ]);

  // 12. Daraz Seller Calculator
  const [dPrice, setDPrice] = useState('2500');
  const [dCost, setDCost] = useState('1200');

  // Renderers based on tool.slug
  if (tool.slug === 'equation-solver') {
    const res = solveEquation(parseFloat(eqA) || 0, parseFloat(eqB) || 0, parseFloat(eqC) || 0);
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-semibold block mb-1">Coefficient a (x²):</label>
            <input type="number" value={eqA} onChange={(e) => setEqA(e.target.value)} className="w-full p-3 border rounded-xl dark:bg-slate-900" />
          </div>
          <div>
            <label className="text-xs font-semibold block mb-1">Coefficient b (x):</label>
            <input type="number" value={eqB} onChange={(e) => setEqB(e.target.value)} className="w-full p-3 border rounded-xl dark:bg-slate-900" />
          </div>
          <div>
            <label className="text-xs font-semibold block mb-1">Constant c:</label>
            <input type="number" value={eqC} onChange={(e) => setEqC(e.target.value)} className="w-full p-3 border rounded-xl dark:bg-slate-900" />
          </div>
        </div>

        <div className="p-6 bg-slate-50 dark:bg-slate-900 border rounded-xl space-y-3">
          <span className="text-xs font-bold text-slate-500 uppercase">Equation Solution:</span>
          <p className="text-2xl font-black text-blue-600 dark:text-blue-400">{res.solutionText}</p>
          <div className="border-t pt-3 space-y-1">
            <span className="text-xs font-bold block mb-1">Step-by-Step Derivation:</span>
            {res.steps.map((step, idx) => (
              <p key={idx} className="text-xs text-slate-600 dark:text-slate-300 font-mono">• {step}</p>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (tool.slug === 'unit-converter-suite') {
    const converted = convertUnits(parseFloat(uVal) || 0, uType, uFrom, uTo);
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="text-xs font-semibold block mb-1">Category:</label>
            <select value={uType} onChange={(e) => setUType(e.target.value as any)} className="w-full p-3 border rounded-xl dark:bg-slate-900">
              <option value="temp">Temperature (C, F, K)</option>
              <option value="pressure">Pressure (Pa, Bar, PSI, Atm)</option>
              <option value="power">Power (W, kW, HP)</option>
              <option value="energy">Energy (J, kJ, Cal, kWh)</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold block mb-1">Value:</label>
            <input type="number" value={uVal} onChange={(e) => setUVal(e.target.value)} className="w-full p-3 border rounded-xl dark:bg-slate-900" />
          </div>
          <div>
            <label className="text-xs font-semibold block mb-1">From:</label>
            <input type="text" value={uFrom} onChange={(e) => setUFrom(e.target.value)} className="w-full p-3 border rounded-xl dark:bg-slate-900" />
          </div>
          <div>
            <label className="text-xs font-semibold block mb-1">To:</label>
            <input type="text" value={uTo} onChange={(e) => setUTo(e.target.value)} className="w-full p-3 border rounded-xl dark:bg-slate-900" />
          </div>
        </div>

        <div className="p-6 bg-slate-50 dark:bg-slate-900 border rounded-xl text-center">
          <span className="text-xs text-slate-500 block">Converted Output</span>
          <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">{converted} {uTo}</span>
        </div>
      </div>
    );
  }

  if (tool.slug === 'target-cgpa-calculator') {
    const res = calculateTargetCgpa(parseFloat(curCgpa) || 0, parseFloat(compCredits) || 0, parseFloat(upCredits) || 0, parseFloat(targetCgpaVal) || 0);
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="text-xs font-semibold block mb-1">Current CGPA:</label>
            <input type="number" step="0.01" value={curCgpa} onChange={(e) => setCurCgpa(e.target.value)} className="w-full p-3 border rounded-xl dark:bg-slate-900" />
          </div>
          <div>
            <label className="text-xs font-semibold block mb-1">Completed Credits:</label>
            <input type="number" value={compCredits} onChange={(e) => setCompCredits(e.target.value)} className="w-full p-3 border rounded-xl dark:bg-slate-900" />
          </div>
          <div>
            <label className="text-xs font-semibold block mb-1">Upcoming Semester Credits:</label>
            <input type="number" value={upCredits} onChange={(e) => setUpCredits(e.target.value)} className="w-full p-3 border rounded-xl dark:bg-slate-900" />
          </div>
          <div>
            <label className="text-xs font-semibold block mb-1">Target CGPA:</label>
            <input type="number" step="0.01" value={targetCgpaVal} onChange={(e) => setTargetCgpaVal(e.target.value)} className="w-full p-3 border rounded-xl dark:bg-slate-900" />
          </div>
        </div>

        <div className={`p-6 border rounded-xl text-center ${res.isPossible ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200' : 'bg-red-50 dark:bg-red-950/40 border-red-200'}`}>
          <span className="text-xs font-bold uppercase block mb-1">Required Upcoming Semester GPA:</span>
          <span className="text-4xl font-black">{res.requiredSemesterGpa} / 4.0</span>
          <p className="text-xs mt-2 text-slate-600 dark:text-slate-300">{res.message}</p>
        </div>
      </div>
    );
  }

  if (tool.slug === 'attendance-calculator') {
    const res = calculateAttendance(parseInt(attAttended, 10) || 0, parseInt(attTotal, 10) || 0);
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold block mb-1">Attended Classes:</label>
            <input type="number" value={attAttended} onChange={(e) => setAttAttended(e.target.value)} className="w-full p-3 border rounded-xl dark:bg-slate-900" />
          </div>
          <div>
            <label className="text-xs font-semibold block mb-1">Total Conducted Classes:</label>
            <input type="number" value={attTotal} onChange={(e) => setAttTotal(e.target.value)} className="w-full p-3 border rounded-xl dark:bg-slate-900" />
          </div>
        </div>

        <div className="p-6 bg-slate-50 dark:bg-slate-900 border rounded-xl text-center space-y-2">
          <span className="text-xs text-slate-500 block">Current Attendance Percentage</span>
          <span className="text-3xl font-black text-blue-600 dark:text-blue-400">{res.currentPercentage}%</span>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{res.statusMessage}</p>
        </div>
      </div>
    );
  }

  if (tool.slug === 'jwt-decoder') {
    const decoded = decodeJwtToken(jwtInput);
    return (
      <div className="space-y-6">
        <textarea
          rows={3}
          value={jwtInput}
          onChange={(e) => setJwtInput(e.target.value)}
          placeholder="Paste raw JWT token..."
          className="w-full p-4 border rounded-xl dark:bg-slate-900 font-mono text-xs"
        />

        {decoded.error ? (
          <div className="p-4 bg-red-50 text-red-700 rounded-xl text-xs">{decoded.error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-900 border rounded-xl">
              <span className="text-xs font-bold block mb-2 text-blue-600">HEADER:</span>
              <pre className="text-xs font-mono text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{JSON.stringify(decoded.header, null, 2)}</pre>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-900 border rounded-xl">
              <span className="text-xs font-bold block mb-2 text-emerald-600">PAYLOAD CLAIMS:</span>
              <pre className="text-xs font-mono text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{JSON.stringify(decoded.payload, null, 2)}</pre>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (tool.slug === 'pakistan-electricity-bill-estimator') {
    const res = estimatePakistanElectricityBill(parseInt(elecUnits, 10) || 0);
    return (
      <div className="space-y-6">
        <div>
          <label className="text-xs font-semibold block mb-1">Consumed Units (kWh):</label>
          <input type="number" value={elecUnits} onChange={(e) => setElecUnits(e.target.value)} className="w-full p-3 border rounded-xl dark:bg-slate-900" />
        </div>

        <div className="p-6 bg-slate-50 dark:bg-slate-900 border rounded-xl text-center space-y-2">
          <span className="text-xs text-slate-500 block">Estimated Total Electricity Bill</span>
          <span className="text-4xl font-black text-emerald-600 dark:text-emerald-400">Rs. {res.estimatedTotalBill.toLocaleString()}</span>
          <span className="text-xs text-slate-400 block">(Energy charges + FC Surcharge + Qtr Tariff + Taxes)</span>
        </div>
      </div>
    );
  }

  if (tool.slug === 'solar-panel-calculator') {
    const res = calculateSolarRequirement(appliances);
    return (
      <div className="space-y-6">
        <div className="border rounded-xl p-4 bg-slate-50 dark:bg-slate-800/40 space-y-3">
          <h4 className="font-bold text-sm">Appliance Load Checklist</h4>
          {appliances.map((app, idx) => (
            <div key={idx} className="grid grid-cols-4 gap-2 text-xs">
              <input type="text" value={app.name} readOnly className="p-2 border rounded font-semibold dark:bg-slate-900" />
              <input
                type="number"
                value={app.watts}
                onChange={(e) => {
                  const copy = [...appliances];
                  copy[idx].watts = parseInt(e.target.value, 10) || 0;
                  setAppliances(copy);
                }}
                className="p-2 border rounded dark:bg-slate-900"
              />
              <input
                type="number"
                value={app.count}
                onChange={(e) => {
                  const copy = [...appliances];
                  copy[idx].count = parseInt(e.target.value, 10) || 0;
                  setAppliances(copy);
                }}
                className="p-2 border rounded dark:bg-slate-900"
              />
              <input
                type="number"
                value={app.hoursPerDay}
                onChange={(e) => {
                  const copy = [...appliances];
                  copy[idx].hoursPerDay = parseInt(e.target.value, 10) || 0;
                  setAppliances(copy);
                }}
                className="p-2 border rounded dark:bg-slate-900"
              />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 rounded-xl text-center">
            <span className="text-xs text-blue-700 block">Daily Load</span>
            <span className="text-2xl font-bold">{res.dailyKwhLoad} kWh</span>
          </div>
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 rounded-xl text-center">
            <span className="text-xs text-emerald-700 block">Required System</span>
            <span className="text-2xl font-bold">{res.recommendedKwSystem} kW</span>
          </div>
          <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 rounded-xl text-center">
            <span className="text-xs text-amber-700 block">550W Panels</span>
            <span className="text-2xl font-bold">{res.numberOfPanels} Panels</span>
          </div>
          <div className="p-4 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 rounded-xl text-center">
            <span className="text-xs text-purple-700 block">Inverter Rating</span>
            <span className="text-2xl font-bold">{res.recommendedInverterKw} kW</span>
          </div>
        </div>
      </div>
    );
  }

  // Generic fallback UI for all remaining tools
  return (
    <div className="space-y-6">
      <div className="p-6 bg-slate-50 dark:bg-slate-900 border rounded-xl text-center space-y-3">
        <Sparkles className="w-8 h-8 text-brand-600 mx-auto" />
        <h4 className="font-bold text-sm">{tool.canonicalName}</h4>
        <p className="text-xs text-slate-500 max-w-md mx-auto">{tool.longDescription}</p>
      </div>

      <textarea
        rows={6}
        value={rawTags}
        onChange={(e) => setRawTags(e.target.value)}
        placeholder="Paste inputs here..."
        className="w-full p-4 border rounded-xl dark:bg-slate-900 text-sm outline-none"
      />
    </div>
  );
}
