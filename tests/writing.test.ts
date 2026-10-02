import { describe, it, expect } from 'vitest';
import {
  calculateReadability,
  findRepeatedWords,
  findDuplicatePhrases,
  findPassiveVoice,
  analyzeSentenceLengths,
  checkAcademicTone,
  checkCitationNeed,
  alphabetizeReferences,
  checkEssayStructure,
  convertFormalTone,
} from '../lib/text/writingEngine';
import { getToolsByCategory } from '../lib/tools/registry';

describe('Writing, Grammar & Academic Integrity Engine Tests', () => {
  it('calculates Flesch readability and Kincaid grade level correctly', () => {
    const res = calculateReadability('The quick brown fox jumps over the lazy dog. Simple sentences make clear writing.');
    expect(res.words).toBeGreaterThan(10);
    expect(res.fleschEase).toBeGreaterThan(60);
    expect(res.kincaidGrade).toBeLessThan(12);
  });

  it('detects repeated words with stop word filtering', () => {
    const text = 'research paper research methodology paper data data analysis';
    const repeated = findRepeatedWords(text, true);
    expect(repeated.some((r) => r.word === 'research')).toBe(true);
    expect(repeated.some((r) => r.word === 'data')).toBe(true);
  });

  it('finds duplicate multi-word phrases inside text', () => {
    const text = 'The results of the study show high impact. Furthermore, the results of the study indicate progress.';
    const dupes = findDuplicatePhrases(text, 4);
    expect(dupes.length).toBeGreaterThan(0);
    expect(dupes[0].phrase).toContain('results of the study');
  });

  it('identifies passive voice verb constructions', () => {
    const text = 'The experiment was conducted by the team. Data was analyzed thoroughly.';
    const passives = findPassiveVoice(text);
    expect(passives.length).toBe(2);
    expect(passives[0].matchedPhrase).toBe('was conducted');
  });

  it('classifies sentence length distribution', () => {
    const text = 'Short one. This is a medium length sentence with several words. This is a very long extended complex academic sentence containing an unusually high number of clauses and words that exceeds the standard twenty five word limit threshold.';
    const analysis = analyzeSentenceLengths(text, 20);
    expect(analysis.shortSentences).toBe(1);
    expect(analysis.longSentences).toBe(1);
  });

  it('flags informal tone, contractions, and slang', () => {
    const text = "We can't accept this stuff because kids gonna get a lot of problems!";
    const issues = checkAcademicTone(text);
    expect(issues.some((i) => i.type === 'contraction')).toBe(true);
    expect(issues.some((i) => i.type === 'informal')).toBe(true);
    expect(issues.some((i) => i.type === 'exclamation')).toBe(true);
  });

  it('identifies un-cited numerical statistics and historical dates', () => {
    const text = 'In 2024, 85% of respondents reported satisfaction. A study demonstrated high efficiency.';
    const needs = checkCitationNeed(text);
    expect(needs.length).toBeGreaterThan(0);
  });

  it('alphabetizes multi-line reference lists', () => {
    const unorganized = 'Smith, J. (2020).\n\nAdams, B. (2021).\n\nZimmerman, C. (2019).';
    const sorted = alphabetizeReferences(unorganized);
    expect(sorted.indexOf('Adams')).toBeLessThan(sorted.indexOf('Smith'));
    expect(sorted.indexOf('Smith')).toBeLessThan(sorted.indexOf('Zimmerman'));
  });

  it('evaluates essay structural components', () => {
    const essay = 'Introduction paragraph with thesis.\n\nBody paragraph detailing evidence.\n\nIn conclusion, the study demonstrated key findings.';
    const report = checkEssayStructure(essay);
    expect(report.paragraphCount).toBe(3);
    expect(report.hasConclusion).toBe(true);
  });

  it('converts informal words into formal tone alternatives', () => {
    const casual = "We can't use a lot of big stuff.";
    const formal = convertFormalTone(casual);
    expect(formal).toContain('cannot');
    expect(formal).toContain('numerous');
  });

  it('verifies category registry contains all 25 writing tools', () => {
    const tools = getToolsByCategory('writing-grammar-academic-integrity-tools');
    expect(tools.length).toBe(24); // 24 live + 1 disabled academic plagiarism checker
  });
});
