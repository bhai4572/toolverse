import { describe, it, expect } from 'vitest';
import {
  calculatePercentage,
  calculatePercentageOf,
  calculatePercentageChange,
  calculateDiscount,
  calculateProfitMargin,
  calculateEmi,
} from '../lib/calculators/engine';
import { analyzeText, convertTextCase, removeDuplicateLines } from '../lib/text/engine';
import { calculatePakistanSalaryTax, calculateZakat } from '../lib/country/taxEngine';
import { validateDestinationUrl, generateRandomAlias } from '../lib/url-shortener/client';
import { formatJson, minifyJson } from '../lib/developer/engine';
import { formatCitation } from '../lib/text/citationEngine';
import { simplifyRatio, calculateLcmGcd, solveMatrix2x2Determinant, calculateOhmsLaw } from '../lib/calculators/educationEngine';
import { TOOLS } from '../lib/tools/registry';

describe('Calculator Engine Tests', () => {
  it('calculates percentage correctly', () => {
    expect(calculatePercentage(50, 200)).toBe(25);
    expect(calculatePercentageOf(20, 500)).toBe(100);
    expect(calculatePercentageChange(100, 150)).toBe(50);
  });

  it('calculates discount correctly', () => {
    const res = calculateDiscount(100, 20, 0);
    expect(res.discountAmount).toBe(20);
    expect(res.finalPrice).toBe(80);
  });

  it('calculates profit margin correctly', () => {
    const res = calculateProfitMargin(50, 100);
    expect(res.grossProfit).toBe(50);
    expect(res.marginPercentage).toBe(50);
    expect(res.markupPercentage).toBe(100);
  });

  it('calculates EMI correctly', () => {
    const res = calculateEmi(100000, 10, 12);
    expect(res.monthlyEmi).toBeGreaterThan(8000);
    expect(res.schedule.length).toBe(12);
  });
});

describe('Text & Citation Engine Tests', () => {
  it('analyzes text statistics correctly', () => {
    const stats = analyzeText('Hello world. This is a test string.');
    expect(stats.words).toBe(7);
    expect(stats.sentences).toBe(2);
  });

  it('converts text cases correctly', () => {
    expect(convertTextCase('hello world', 'uppercase')).toBe('HELLO WORLD');
    expect(convertTextCase('HELLO WORLD', 'lowercase')).toBe('hello world');
    expect(convertTextCase('hello world', 'titlecase')).toBe('Hello World');
    expect(convertTextCase('hello world', 'kebabcase')).toBe('hello-world');
  });

  it('removes duplicate lines', () => {
    const input = 'apple\nbanana\napple\norange\nbanana';
    const output = removeDuplicateLines(input);
    expect(output).toBe('apple\nbanana\norange');
  });

  it('formats APA and MLA citations correctly', () => {
    const apa = formatCitation({
      authorLast: 'Gebert',
      authorFirst: 'Dietrich',
      title: 'Lazy Senior Developer',
      websiteOrPublisher: 'GitHub',
      year: '2026',
      type: 'website'
    }, 'APA');
    expect(apa).toContain('Gebert, D. (2026)');

    const mla = formatCitation({
      authorLast: 'Gebert',
      authorFirst: 'Dietrich',
      title: 'Lazy Senior Developer',
      websiteOrPublisher: 'GitHub',
      year: '2026',
      type: 'website'
    }, 'MLA');
    expect(mla).toContain('Gebert, Dietrich. "Lazy Senior Developer."');
  });
});

describe('Tax Engine Tests', () => {
  it('calculates Pakistan salary tax slabs accurately', () => {
    const resUnder600k = calculatePakistanSalaryTax(40000);
    expect(resUnder600k.annualTax).toBe(0);

    const resOver1M = calculatePakistanSalaryTax(100000);
    expect(resOver1M.annualTax).toBe(30000);
  });

  it('calculates Zakat correctly', () => {
    const zakat = calculateZakat({
      cashInHand: 100000,
      bankBalances: 100000,
      goldValue: 0,
      silverValue: 0,
      businessAssets: 0,
      liabilities: 0,
      nisabValue: 150000,
    });
    expect(zakat.isEligibleForZakat).toBe(true);
    expect(zakat.zakatPayable).toBe(5000);
  });
});

describe('Education & Math Engine Tests', () => {
  it('simplifies ratios correctly', () => {
    const res = simplifyRatio(10, 20);
    expect(res.stringVal).toBe('1:2');
  });

  it('calculates LCM and GCD correctly', () => {
    const res = calculateLcmGcd(12, 18);
    expect(res.gcd).toBe(6);
    expect(res.lcm).toBe(36);
  });

  it('calculates 2x2 matrix determinant', () => {
    expect(solveMatrix2x2Determinant(1, 2, 3, 4)).toBe(-2);
  });

  it('calculates Ohms Law (V = I * R)', () => {
    const res = calculateOhmsLaw(12, undefined, 4);
    expect(res.current).toBe(3);
    expect(res.power).toBe(36);
  });
});

describe('Developer & Security Engine Tests', () => {
  it('validates URLs strictly', () => {
    expect(validateDestinationUrl('https://google.com').isValid).toBe(true);
    expect(validateDestinationUrl('ftp://invalid.com').isValid).toBe(false);
    expect(validateDestinationUrl('http://localhost').isValid).toBe(false);
  });

  it('formats and minifies JSON', () => {
    const raw = '{"name":"toolverse","active":true}';
    expect(formatJson(raw).formatted).toContain('\n');
    expect(minifyJson(raw).minified).toBe(raw);
  });

  it('generates random alias', () => {
    const alias = generateRandomAlias(8);
    expect(alias.length).toBe(8);
  });
});

describe('Tool Registry Integrity Tests', () => {
  it('ensures all registered tools have unique IDs and unique slugs', () => {
    const ids = TOOLS.map((t) => t.id);
    const slugs = TOOLS.map((t) => t.slug);
    const uniqueIds = new Set(ids);
    const uniqueSlugs = new Set(slugs);

    expect(ids.length).toBe(uniqueIds.size);
    expect(slugs.length).toBe(uniqueSlugs.size);
  });

  it('ensures all registered live tools have valid required properties', () => {
    TOOLS.forEach((tool) => {
      expect(tool.id).toBeTruthy();
      expect(tool.slug).toBeTruthy();
      expect(tool.canonicalName).toBeTruthy();
      expect(tool.shortDescription).toBeTruthy();
      expect(tool.instructions.length).toBeGreaterThan(0);
      expect(tool.status).toBe('live');
    });
  });
});

