export interface TaxRuleVersion {
  country: string;
  countryCode: string;
  taxType: string;
  effectiveYear: string;
  lastVerifiedDate: string;
  sourceUrl: string;
  disclaimer: string;
}

export const PAKISTAN_TAX_METADATA: TaxRuleVersion = {
  country: 'Pakistan',
  countryCode: 'PK',
  taxType: 'Salaried Income Tax',
  effectiveYear: 'FY 2024-2025 / 2025-2026',
  lastVerifiedDate: '2025-07-01',
  sourceUrl: 'https://fbr.gov.pk',
  disclaimer: 'Estimate only based on standard salaried tax slabs. Final tax obligations should be confirmed with a qualified tax consultant or official FBR portal.',
};

export interface PakistanTaxResult {
  monthlySalary: number;
  annualSalary: number;
  annualTax: number;
  monthlyTax: number;
  monthlyTakeHome: number;
  effectiveTaxRate: number;
  slabApplied: string;
}

export function calculatePakistanSalaryTax(grossMonthlySalary: number): PakistanTaxResult {
  const annualSalary = grossMonthlySalary * 12;
  let annualTax = 0;
  let slabApplied = '';

  // FBR Salaried Slabs (FY 2024-25)
  if (annualSalary <= 600000) {
    annualTax = 0;
    slabApplied = 'Up to PKR 600,000 (0% Tax)';
  } else if (annualSalary <= 1200000) {
    // 5% of amount exceeding 600,000
    annualTax = (annualSalary - 600000) * 0.05;
    slabApplied = 'PKR 600,000 to 1,200,000 (5% on excess above 600k)';
  } else if (annualSalary <= 2200000) {
    // 30,000 + 15% of amount exceeding 1,200,000
    annualTax = 30000 + (annualSalary - 1200000) * 0.15;
    slabApplied = 'PKR 1,200,000 to 2,200,000 (PKR 30k + 15% on excess above 1.2M)';
  } else if (annualSalary <= 3200000) {
    // 180,000 + 25% of amount exceeding 2,200,000
    annualTax = 180000 + (annualSalary - 2200000) * 0.25;
    slabApplied = 'PKR 2,200,000 to 3,200,000 (PKR 180k + 25% on excess above 2.2M)';
  } else if (annualSalary <= 4100000) {
    // 430,000 + 30% of amount exceeding 3,200,000
    annualTax = 430000 + (annualSalary - 3200000) * 0.30;
    slabApplied = 'PKR 3,200,000 to 4,100,000 (PKR 430k + 30% on excess above 3.2M)';
  } else {
    // 700,000 + 35% of amount exceeding 4,100,000
    annualTax = 700000 + (annualSalary - 4100000) * 0.35;
    slabApplied = 'Exceeding PKR 4,100,000 (PKR 700k + 35% on excess above 4.1M)';
  }

  const monthlyTax = annualTax / 12;
  const monthlyTakeHome = grossMonthlySalary - monthlyTax;
  const effectiveTaxRate = grossMonthlySalary > 0 ? (monthlyTax / grossMonthlySalary) * 100 : 0;

  return {
    monthlySalary: grossMonthlySalary,
    annualSalary,
    annualTax: Math.round(annualTax),
    monthlyTax: Math.round(monthlyTax),
    monthlyTakeHome: Math.round(monthlyTakeHome),
    effectiveTaxRate: Math.round(effectiveTaxRate * 100) / 100,
    slabApplied,
  };
}

export interface ZakatCalculationInput {
  cashInHand: number;
  bankBalances: number;
  goldValue: number;
  silverValue: number;
  businessAssets: number;
  liabilities: number;
  nisabValue: number;
}

export interface ZakatResult {
  totalAssets: number;
  netWealth: number;
  isEligibleForZakat: boolean;
  zakatPayable: number;
}

export function calculateZakat(input: ZakatCalculationInput): ZakatResult {
  const {
    cashInHand = 0,
    bankBalances = 0,
    goldValue = 0,
    silverValue = 0,
    businessAssets = 0,
    liabilities = 0,
    nisabValue = 0,
  } = input;

  const totalAssets = cashInHand + bankBalances + goldValue + silverValue + businessAssets;
  const netWealth = totalAssets - liabilities;

  const isEligibleForZakat = netWealth >= nisabValue && netWealth > 0;
  const zakatPayable = isEligibleForZakat ? netWealth * 0.025 : 0;

  return {
    totalAssets: Math.round(totalAssets),
    netWealth: Math.round(netWealth),
    isEligibleForZakat,
    zakatPayable: Math.round(zakatPayable),
  };
}
