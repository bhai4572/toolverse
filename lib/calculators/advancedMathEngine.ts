/**
 * ToolVerse — Advanced Math, Science, Student & E-Commerce Engines
 * 100% Client-side, high precision mathematical calculations.
 */

// 1. Quadratic & Linear Equation Solver
export interface EquationResult {
  type: 'quadratic' | 'linear';
  discriminant?: number;
  root1?: string;
  root2?: string;
  solutionText: string;
  steps: string[];
}

export function solveEquation(a: number, b: number, c: number): EquationResult {
  const steps: string[] = [];

  if (a === 0) {
    if (b === 0) {
      return {
        type: 'linear',
        solutionText: c === 0 ? 'Infinite solutions (0 = 0)' : 'No solution (contradiction)',
        steps: ['Equation simplifies to 0 = 0 or c = 0.'],
      };
    }
    const x = -c / b;
    steps.push(`Linear equation: ${b}x + ${c} = 0`);
    steps.push(`x = -${c} / ${b}`);
    return {
      type: 'linear',
      root1: (Math.round(x * 10000) / 10000).toString(),
      solutionText: `x = ${Math.round(x * 10000) / 10000}`,
      steps,
    };
  }

  // Quadratic equation: ax^2 + bx + c = 0
  const disc = b * b - 4 * a * c;
  steps.push(`Quadratic equation: ${a}x² + ${b}x + ${c} = 0`);
  steps.push(`Discriminant Δ = b² - 4ac = (${b})² - 4(${a})(${c}) = ${disc}`);

  if (disc > 0) {
    const r1 = (-b + Math.sqrt(disc)) / (2 * a);
    const r2 = (-b - Math.sqrt(disc)) / (2 * a);
    const root1Str = (Math.round(r1 * 10000) / 10000).toString();
    const root2Str = (Math.round(r2 * 10000) / 10000).toString();
    steps.push(`Two real distinct roots: x₁ = (-${b} + √${disc}) / ${2 * a}, x₂ = (-${b} - √${disc}) / ${2 * a}`);
    return {
      type: 'quadratic',
      discriminant: disc,
      root1: root1Str,
      root2: root2Str,
      solutionText: `x₁ = ${root1Str}, x₂ = ${root2Str}`,
      steps,
    };
  } else if (disc === 0) {
    const r = -b / (2 * a);
    const rootStr = (Math.round(r * 10000) / 10000).toString();
    steps.push(`One real repeated root: x = -${b} / ${2 * a}`);
    return {
      type: 'quadratic',
      discriminant: 0,
      root1: rootStr,
      root2: rootStr,
      solutionText: `x = ${rootStr} (Double Root)`,
      steps,
    };
  } else {
    const realPart = Math.round((-b / (2 * a)) * 10000) / 10000;
    const imagPart = Math.round((Math.sqrt(-disc) / (2 * a)) * 10000) / 10000;
    steps.push(`Complex conjugate roots because Δ < 0`);
    return {
      type: 'quadratic',
      discriminant: disc,
      root1: `${realPart} + ${Math.abs(imagPart)}i`,
      root2: `${realPart} - ${Math.abs(imagPart)}i`,
      solutionText: `x₁ = ${realPart} + ${Math.abs(imagPart)}i, x₂ = ${realPart} - ${Math.abs(imagPart)}i`,
      steps,
    };
  }
}

// 2. 2x2 & 3x3 Matrix Determinant & Multiplication
export function solveMatrix3x3Determinant(
  m: [[number, number, number], [number, number, number], [number, number, number]]
): number {
  const det =
    m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) -
    m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) +
    m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);
  return Math.round(det * 10000) / 10000;
}

// 3. Target CGPA Calculator
export interface TargetCgpaResult {
  currentCgpa: number;
  completedCredits: number;
  upcomingSemesterCredits: number;
  targetCgpa: number;
  requiredSemesterGpa: number;
  isPossible: boolean;
  message: string;
}

export function calculateTargetCgpa(
  currentCgpa: number,
  completedCredits: number,
  upcomingSemesterCredits: number,
  targetCgpa: number,
  maxGpaScale = 4.0
): TargetCgpaResult {
  const totalFutureCredits = completedCredits + upcomingSemesterCredits;
  const currentTotalGradePoints = currentCgpa * completedCredits;
  const requiredTotalGradePoints = targetCgpa * totalFutureCredits;
  const requiredUpcomingGradePoints = requiredTotalGradePoints - currentTotalGradePoints;

  const reqGpa = requiredUpcomingGradePoints / upcomingSemesterCredits;
  const roundedReqGpa = Math.round(reqGpa * 100) / 100;

  const isPossible = roundedReqGpa <= maxGpaScale && roundedReqGpa >= 0;
  let message = '';

  if (isPossible) {
    message = `You need a GPA of ${roundedReqGpa} in your upcoming ${upcomingSemesterCredits} credit hours to reach CGPA ${targetCgpa}.`;
  } else if (roundedReqGpa > maxGpaScale) {
    message = `Target CGPA ${targetCgpa} is mathematically impossible in 1 semester. Required GPA (${roundedReqGpa}) exceeds maximum scale ${maxGpaScale}.`;
  } else {
    message = `Your current CGPA is already higher than your target CGPA!`;
  }

  return {
    currentCgpa,
    completedCredits,
    upcomingSemesterCredits,
    targetCgpa,
    requiredSemesterGpa: roundedReqGpa,
    isPossible,
    message,
  };
}

// 4. Attendance Target Calculator
export interface AttendanceResult {
  currentPercentage: number;
  targetPercentage: number;
  attendedClasses: number;
  totalClasses: number;
  classesToAttend: number;
  classesCanMiss: number;
  statusMessage: string;
}

export function calculateAttendance(
  attendedClasses: number,
  totalClasses: number,
  targetPercentage = 75
): AttendanceResult {
  const currentPct = (attendedClasses / (totalClasses || 1)) * 100;
  const roundedCurrent = Math.round(currentPct * 10) / 10;

  let classesToAttend = 0;
  let classesCanMiss = 0;
  let statusMessage = '';

  if (roundedCurrent >= targetPercentage) {
    // How many classes can student miss while staying >= targetPercentage?
    // (attended) / (total + X) >= target / 100
    // attended * 100 / target >= total + X
    const maxTotalAllowed = Math.floor((attendedClasses * 100) / targetPercentage);
    classesCanMiss = Math.max(0, maxTotalAllowed - totalClasses);
    statusMessage = `Your attendance is ${roundedCurrent}%. You can safely miss ${classesCanMiss} upcoming classes while staying above ${targetPercentage}%.`;
  } else {
    // How many consecutive classes must student attend?
    // (attended + X) / (total + X) = target / 100
    // 100 * attended + 100 * X = target * total + target * X
    // X * (100 - target) = target * total - 100 * attended
    const needed = Math.ceil((targetPercentage * totalClasses - 100 * attendedClasses) / (100 - targetPercentage));
    classesToAttend = Math.max(0, needed);
    statusMessage = `Your attendance is ${roundedCurrent}%. You must attend the next ${classesToAttend} consecutive classes to reach ${targetPercentage}%.`;
  }

  return {
    currentPercentage: roundedCurrent,
    targetPercentage,
    attendedClasses,
    totalClasses,
    classesToAttend,
    classesCanMiss,
    statusMessage,
  };
}

// 5. Physics & Engineering Unit Converter
export function convertUnits(val: number, type: 'energy' | 'power' | 'pressure' | 'temp', from: string, to: string): number {
  if (type === 'temp') {
    let celsius = val;
    if (from === 'F') celsius = (val - 32) * (5 / 9);
    else if (from === 'K') celsius = val - 273.15;

    if (to === 'C') return Math.round(celsius * 100) / 100;
    if (to === 'F') return Math.round((celsius * (9 / 5) + 32) * 100) / 100;
    if (to === 'K') return Math.round((celsius + 273.15) * 100) / 100;
  }

  if (type === 'pressure') {
    // base unit: Pascal (Pa)
    const toPascal: Record<string, number> = {
      Pa: 1,
      Bar: 100000,
      PSI: 6894.76,
      Atm: 101325,
    };
    const pa = val * (toPascal[from] || 1);
    return Math.round((pa / (toPascal[to] || 1)) * 10000) / 10000;
  }

  if (type === 'power') {
    // base unit: Watt (W)
    const toWatt: Record<string, number> = {
      W: 1,
      kW: 1000,
      HP: 745.7,
    };
    const w = val * (toWatt[from] || 1);
    return Math.round((w / (toWatt[to] || 1)) * 10000) / 10000;
  }

  if (type === 'energy') {
    // base unit: Joule (J)
    const toJoule: Record<string, number> = {
      J: 1,
      kJ: 1000,
      Cal: 4.184,
      kCal: 4184,
      kWh: 3600000,
    };
    const j = val * (toJoule[from] || 1);
    return Math.round((j / (toJoule[to] || 1)) * 10000) / 10000;
  }

  return val;
}
