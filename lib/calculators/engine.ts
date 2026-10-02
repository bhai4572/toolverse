import { Decimal } from 'decimal.js';

export function calculatePercentage(part: number, total: number): number {
  if (total === 0) return 0;
  return new Decimal(part).div(total).mul(100).toDecimalPlaces(2).toNumber();
}

export function calculatePercentageOf(percentage: number, total: number): number {
  return new Decimal(percentage).div(100).mul(total).toDecimalPlaces(2).toNumber();
}

export function calculatePercentageChange(oldValue: number, newValue: number): number {
  if (oldValue === 0) return 0;
  return new Decimal(newValue)
    .sub(oldValue)
    .div(oldValue)
    .mul(100)
    .toDecimalPlaces(2)
    .toNumber();
}

export interface DiscountResult {
  originalPrice: number;
  discountAmount: number;
  finalPrice: number;
  savings: number;
}

export function calculateDiscount(
  price: number,
  discountPercentage: number,
  taxPercentage: number = 0
): DiscountResult {
  const p = new Decimal(price);
  const discPercent = new Decimal(discountPercentage);
  const taxPercent = new Decimal(taxPercentage);

  const discountAmount = p.mul(discPercent.div(100));
  const priceAfterDiscount = p.sub(discountAmount);
  const taxAmount = priceAfterDiscount.mul(taxPercent.div(100));
  const finalPrice = priceAfterDiscount.add(taxAmount);

  return {
    originalPrice: p.toNumber(),
    discountAmount: discountAmount.toDecimalPlaces(2).toNumber(),
    finalPrice: finalPrice.toDecimalPlaces(2).toNumber(),
    savings: discountAmount.toDecimalPlaces(2).toNumber(),
  };
}

export interface ProfitMarginResult {
  cost: number;
  sellingPrice: number;
  grossProfit: number;
  marginPercentage: number;
  markupPercentage: number;
}

export function calculateProfitMargin(cost: number, price: number): ProfitMarginResult {
  const c = new Decimal(cost);
  const p = new Decimal(price);
  const profit = p.sub(c);

  const margin = p.isZero() ? new Decimal(0) : profit.div(p).mul(100);
  const markup = c.isZero() ? new Decimal(0) : profit.div(c).mul(100);

  return {
    cost: c.toNumber(),
    sellingPrice: p.toNumber(),
    grossProfit: profit.toDecimalPlaces(2).toNumber(),
    marginPercentage: margin.toDecimalPlaces(2).toNumber(),
    markupPercentage: markup.toDecimalPlaces(2).toNumber(),
  };
}

export interface CompoundInterestResult {
  principal: number;
  totalInterest: number;
  finalBalance: number;
  breakdown: { year: number; balance: number; interestEarned: number }[];
}

export function calculateCompoundInterest(
  principal: number,
  annualRate: number,
  years: number,
  monthlyDeposit: number = 0
): CompoundInterestResult {
  const r = annualRate / 100;
  let balance = principal;
  let totalInterest = 0;
  const breakdown = [];

  for (let y = 1; y <= years; y++) {
    let yearInterest = 0;
    for (let m = 0; m < 12; m++) {
      balance += monthlyDeposit;
      const mInterest = balance * (r / 12);
      balance += mInterest;
      yearInterest += mInterest;
    }
    totalInterest += yearInterest;
    breakdown.push({
      year: y,
      balance: Math.round(balance * 100) / 100,
      interestEarned: Math.round(yearInterest * 100) / 100,
    });
  }

  return {
    principal,
    totalInterest: Math.round(totalInterest * 100) / 100,
    finalBalance: Math.round(balance * 100) / 100,
    breakdown,
  };
}

export interface EmiResult {
  monthlyEmi: number;
  totalInterest: number;
  totalPayment: number;
  schedule: { month: number; principalPayment: number; interestPayment: number; balance: number }[];
}

export function calculateEmi(loanAmount: number, annualInterestRate: number, tenureMonths: number): EmiResult {
  const P = loanAmount;
  const r = annualInterestRate / 12 / 100;
  const n = tenureMonths;

  let emi = 0;
  if (r === 0) {
    emi = P / n;
  } else {
    emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  }

  const schedule = [];
  let remaining = P;
  let totalInterest = 0;

  for (let m = 1; m <= n; m++) {
    const interestPart = remaining * r;
    const principalPart = emi - interestPart;
    remaining -= principalPart;
    if (remaining < 0) remaining = 0;
    totalInterest += interestPart;

    schedule.push({
      month: m,
      principalPayment: Math.round(principalPart * 100) / 100,
      interestPayment: Math.round(interestPart * 100) / 100,
      balance: Math.round(remaining * 100) / 100,
    });
  }

  return {
    monthlyEmi: Math.round(emi * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    totalPayment: Math.round((P + totalInterest) * 100) / 100,
    schedule,
  };
}

export interface AgeResult {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  nextBirthdayDays: number;
}

export function calculateExactAge(birthDateStr: string, targetDateStr?: string): AgeResult {
  const birth = new Date(birthDateStr);
  const target = targetDateStr ? new Date(targetDateStr) : new Date();

  let years = target.getFullYear() - birth.getFullYear();
  let months = target.getMonth() - birth.getMonth();
  let days = target.getDate() - birth.getDate();

  if (days < 0) {
    months--;
    const prevMonth = new Date(target.getFullYear(), target.getMonth(), 0);
    days += prevMonth.getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  const diffTime = Math.abs(target.getTime() - birth.getTime());
  const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  // Next birthday calculation
  const nextBday = new Date(target.getFullYear(), birth.getMonth(), birth.getDate());
  if (nextBday < target) {
    nextBday.setFullYear(target.getFullYear() + 1);
  }
  const nextBdayDiff = Math.ceil((nextBday.getTime() - target.getTime()) / (1000 * 60 * 60 * 24));

  return {
    years,
    months,
    days,
    totalDays,
    nextBirthdayDays: nextBdayDiff,
  };
}

export interface CourseGrade {
  courseName: string;
  credits: number;
  gradePoint: number;
}

export function calculateGpa(courses: CourseGrade[]): { gpa: number; totalCredits: number } {
  let totalPoints = 0;
  let totalCredits = 0;

  for (const course of courses) {
    totalPoints += course.credits * course.gradePoint;
    totalCredits += course.credits;
  }

  if (totalCredits === 0) return { gpa: 0, totalCredits: 0 };
  const gpa = Math.round((totalPoints / totalCredits) * 100) / 100;
  return { gpa, totalCredits };
}

export interface VatGstResult {
  originalAmount: number;
  taxAmount: number;
  totalAmount: number;
}

export function calculateVatGst(
  amount: number,
  taxRate: number,
  mode: 'add' | 'remove'
): VatGstResult {
  const a = new Decimal(amount);
  const r = new Decimal(taxRate).div(100);

  if (mode === 'add') {
    const taxAmount = a.mul(r);
    const total = a.add(taxAmount);
    return {
      originalAmount: a.toNumber(),
      taxAmount: taxAmount.toDecimalPlaces(2).toNumber(),
      totalAmount: total.toDecimalPlaces(2).toNumber(),
    };
  } else {
    // remove VAT: gross / (1 + r)
    const original = a.div(new Decimal(1).add(r));
    const taxAmount = a.sub(original);
    return {
      originalAmount: original.toDecimalPlaces(2).toNumber(),
      taxAmount: taxAmount.toDecimalPlaces(2).toNumber(),
      totalAmount: a.toNumber(),
    };
  }
}
