/**
 * ToolVerse — Pakistan Regional & E-Commerce Utilities Engine
 * Electricity Bill Slabs, Solar Panel Requirement, Gold Tola/Gram & Daraz Seller Fee Engine.
 * 100% Client-side.
 */

// 1. Pakistan Electricity Bill Estimator (FESCO/LESCO/K-Electric Standard Slabs)
export interface ElectricityBillResult {
  units: number;
  energyCharges: number;
  fcSurcharge: number;
  qtrAdjustment: number;
  tvFee: number;
  electricityDuty: number;
  estimatedTotalBill: number;
  breakdown: { slab: string; units: number; rate: number; cost: number }[];
}

export function estimatePakistanElectricityBill(units: number): ElectricityBillResult {
  let remaining = units;
  let energyCharges = 0;
  const breakdown: { slab: string; units: number; rate: number; cost: number }[] = [];

  // Standard FESCO/LESCO Residential Unprotected/Protected Slab Rates (FY 2024-25 benchmarks)
  const slabs = [
    { name: '1 - 100 Units', max: 100, rate: 16.48 },
    { name: '101 - 200 Units', max: 100, rate: 22.95 },
    { name: '201 - 300 Units', max: 100, rate: 29.41 },
    { name: '301 - 400 Units', max: 100, rate: 35.57 },
    { name: '401 - 500 Units', max: 100, rate: 39.93 },
    { name: '501 - 600 Units', max: 100, rate: 41.53 },
    { name: '601 - 700 Units', max: 100, rate: 42.84 },
    { name: 'Above 700 Units', max: Infinity, rate: 48.84 },
  ];

  for (const slab of slabs) {
    if (remaining <= 0) break;
    const slabUnits = Math.min(remaining, slab.max);
    const cost = slabUnits * slab.rate;
    energyCharges += cost;
    breakdown.push({
      slab: slab.name,
      units: slabUnits,
      rate: slab.rate,
      cost: Math.round(cost * 100) / 100,
    });
    remaining -= slabUnits;
  }

  const fcSurcharge = Math.round(units * 3.23); // FC Surcharge Rs. 3.23/unit
  const qtrAdjustment = Math.round(units * 1.74); // Qtr Tariff Adjustment
  const tvFee = 35; // PTV Fee Rs. 35
  const electricityDuty = Math.round(energyCharges * 0.015); // 1.5% Duty

  const estimatedTotalBill = Math.round(energyCharges + fcSurcharge + qtrAdjustment + tvFee + electricityDuty);

  return {
    units,
    energyCharges: Math.round(energyCharges),
    fcSurcharge,
    qtrAdjustment,
    tvFee,
    electricityDuty,
    estimatedTotalBill,
    breakdown,
  };
}

// 2. Solar System & Inverter Requirement Calculator
export interface SolarRequirementResult {
  dailyKwhLoad: number;
  recommendedKwSystem: number;
  recommendedInverterKw: number;
  numberOfPanels: number; // 550W panels
  batteryCapacityAh: number; // 48V system
  estimatedDailyUnitsGenerated: number;
}

export function calculateSolarRequirement(
  appliances: { watts: number; hoursPerDay: number; count: number }[]
): SolarRequirementResult {
  let totalWattHours = 0;
  let maxSimultaneousWatts = 0;

  appliances.forEach((item) => {
    totalWattHours += item.watts * item.hoursPerDay * item.count;
    maxSimultaneousWatts += item.watts * item.count * 0.7; // 70% diversity factor
  });

  const dailyKwhLoad = totalWattHours / 1000;
  // Account for 20% system losses (inverter + wiring efficiency)
  const requiredGenerationKwh = dailyKwhLoad * 1.2;
  // Average peak sun hours in Pakistan = 5 hours/day
  const systemKw = requiredGenerationKwh / 5;

  const panelsCount = Math.ceil((systemKw * 1000) / 550); // 550W Tier-1 Panels
  const inverterKw = Math.ceil(maxSimultaneousWatts / 1000);

  // Backup battery Ah for 48V (supposing 30% night load)
  const nightKwh = dailyKwhLoad * 0.4;
  const batteryAh = Math.round((nightKwh * 1000) / 48);

  return {
    dailyKwhLoad: Math.round(dailyKwhLoad * 10) / 10,
    recommendedKwSystem: Math.round(systemKw * 10) / 10,
    recommendedInverterKw: Math.max(3, inverterKw),
    numberOfPanels: Math.max(4, panelsCount),
    batteryCapacityAh: Math.max(100, batteryAh),
    estimatedDailyUnitsGenerated: Math.round(systemKw * 5 * 10) / 10,
  };
}

// 3. Gold Tola / Gram Converter & Zakat Calculator
export function convertGoldUnits(value: number, fromUnit: 'tola' | 'gram' | 'masha'): { tola: number; gram: number } {
  let grams = value;
  if (fromUnit === 'tola') grams = value * 11.6638;
  else if (fromUnit === 'masha') grams = value * 0.972;

  const tola = grams / 11.6638;

  return {
    tola: Math.round(tola * 1000) / 1000,
    gram: Math.round(grams * 1000) / 1000,
  };
}

// 4. Daraz / E-Commerce Seller Fee & Profit Calculator
export interface DarazProfitResult {
  sellingPrice: number;
  itemCost: number;
  darazCommissionFee: number; // ~12%
  paymentProcessingFee: number; // 1.25%
  vatTaxOnCommission: number; // 16% SST on commission
  shippingSubsidy: number;
  totalFees: number;
  netProfit: number;
  profitMarginPct: number;
}

export function calculateDarazProfit(
  sellingPrice: number,
  itemCost: number,
  categoryCommissionPct = 12
): DarazProfitResult {
  const darazCommissionFee = sellingPrice * (categoryCommissionPct / 100);
  const paymentProcessingFee = sellingPrice * 0.0125;
  const vatTaxOnCommission = darazCommissionFee * 0.16;
  const shippingSubsidy = 50; // standard packaging/handling

  const totalFees = darazCommissionFee + paymentProcessingFee + vatTaxOnCommission + shippingSubsidy;
  const netProfit = sellingPrice - itemCost - totalFees;
  const marginPct = (netProfit / (sellingPrice || 1)) * 100;

  return {
    sellingPrice,
    itemCost,
    darazCommissionFee: Math.round(darazCommissionFee * 100) / 100,
    paymentProcessingFee: Math.round(paymentProcessingFee * 100) / 100,
    vatTaxOnCommission: Math.round(vatTaxOnCommission * 100) / 100,
    shippingSubsidy,
    totalFees: Math.round(totalFees * 100) / 100,
    netProfit: Math.round(netProfit * 100) / 100,
    profitMarginPct: Math.round(marginPct * 10) / 10,
  };
}
