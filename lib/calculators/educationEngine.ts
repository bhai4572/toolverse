import { Decimal } from 'decimal.js';

export function simplifyRatio(a: number, b: number): { ratioA: number; ratioB: number; stringVal: string } {
  const gcd = (x: number, y: number): number => (y === 0 ? x : gcd(y, x % y));
  const divisor = Math.abs(gcd(Math.round(a), Math.round(b)));
  const ratioA = a / divisor;
  const ratioB = b / divisor;
  return { ratioA, ratioB, stringVal: `${ratioA}:${ratioB}` };
}

export function calculateLcmGcd(a: number, b: number): { gcd: number; lcm: number } {
  const gcdFn = (x: number, y: number): number => (y === 0 ? x : gcdFn(y, x % y));
  const g = Math.abs(gcdFn(Math.round(a), Math.round(b)));
  const l = Math.abs(a * b) / (g || 1);
  return { gcd: g, lcm: l };
}

export function solveMatrix2x2Determinant(a: number, b: number, c: number, d: number): number {
  return a * d - b * c;
}

export function solveMatrix3x3Determinant(m: number[][]): number {
  if (m.length !== 3 || m[0].length !== 3) return 0;
  return (
    m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) -
    m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) +
    m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0])
  );
}

// Physics: Ohm's Law (V = I * R)
export function calculateOhmsLaw(
  voltage?: number,
  current?: number,
  resistance?: number
): { voltage: number; current: number; resistance: number; power: number } {
  let v = voltage || 0;
  let i = current || 0;
  let r = resistance || 0;

  if (v && i && !r) r = v / i;
  else if (v && r && !i) i = v / r;
  else if (i && r && !v) v = i * r;

  const power = v * i;
  return {
    voltage: Math.round(v * 100) / 100,
    current: Math.round(i * 100) / 100,
    resistance: Math.round(r * 100) / 100,
    power: Math.round(power * 100) / 100,
  };
}

// Chemistry: Molarity (M = moles / liters)
export function calculateMolarity(moles: number, volumeLiters: number): number {
  if (volumeLiters === 0) return 0;
  return Math.round((moles / volumeLiters) * 1000) / 1000;
}
