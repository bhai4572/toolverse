/**
 * ToolVerse — Writing, Grammar & Academic Integrity Engine
 * 100% browser-side, privacy-first, ethical text analysis.
 * Zero AI bypass, zero Turnitin evasion, zero fake scores.
 */

export interface ReadabilityMetrics {
  words: number;
  sentences: number;
  syllables: number;
  characters: number;
  complexWords: number;
  avgSentenceLength: number;
  avgWordLength: number;
  fleschEase: number;
  kincaidGrade: number;
  readingTimeMinutes: number;
  summary: string;
}

export function countSyllables(word: string): number {
  const w = word.toLowerCase().replace(/[^a-z]/g, '');
  if (!w) return 0;
  if (w.length <= 3) return 1;
  const cleaned = w.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '').replace(/^y/, '');
  const matches = cleaned.match(/[aeiouy]{1,2}/g);
  return matches ? matches.length : 1;
}

export function calculateReadability(text: string): ReadabilityMetrics {
  const trimmed = text.trim();
  if (!trimmed) {
    return {
      words: 0,
      sentences: 0,
      syllables: 0,
      characters: 0,
      complexWords: 0,
      avgSentenceLength: 0,
      avgWordLength: 0,
      fleschEase: 100,
      kincaidGrade: 0,
      readingTimeMinutes: 0,
      summary: 'Please enter text to calculate readability metrics.',
    };
  }

  const rawWords = trimmed.split(/\s+/).filter(Boolean);
  const wordCount = rawWords.length;
  const sentences = trimmed.split(/[.!?]+/).filter((s) => s.trim().length > 0).length || 1;

  let totalSyllables = 0;
  let complexWords = 0;
  let totalChars = 0;

  rawWords.forEach((word) => {
    const cleanWord = word.replace(/[^a-zA-Z]/g, '');
    totalChars += cleanWord.length;
    const syl = countSyllables(cleanWord);
    totalSyllables += syl;
    if (syl >= 3) complexWords++;
  });

  const avgSentenceLen = wordCount / sentences;
  const avgSyllablesPerWord = totalSyllables / (wordCount || 1);
  const avgWordLen = totalChars / (wordCount || 1);

  // Flesch Reading Ease: 206.835 - (1.015 * ASL) - (84.6 * ASW)
  const flesch = 206.835 - 1.015 * avgSentenceLen - 84.6 * avgSyllablesPerWord;
  const fleschEase = Math.max(0, Math.min(100, Math.round(flesch * 10) / 10));

  // Flesch-Kincaid Grade Level: (0.39 * ASL) + (11.8 * ASW) - 15.59
  const grade = 0.39 * avgSentenceLen + 11.8 * avgSyllablesPerWord - 15.59;
  const kincaidGrade = Math.max(0, Math.round(grade * 10) / 10);

  const readingTimeMinutes = Math.ceil(wordCount / 200);

  let summary = '';
  if (fleschEase >= 70) summary = 'Easy to read (suitable for 7th-8th grade).';
  else if (fleschEase >= 50) summary = 'Fairly readable (suitable for high school / general public).';
  else if (fleschEase >= 30) summary = 'Difficult reading (suitable for university / professional audiences).';
  else summary = 'Very academic / technical text. Consider shortening long sentences.';

  return {
    words: wordCount,
    sentences,
    syllables: totalSyllables,
    characters: totalChars,
    complexWords,
    avgSentenceLength: Math.round(avgSentenceLen * 10) / 10,
    avgWordLength: Math.round(avgWordLen * 10) / 10,
    fleschEase,
    kincaidGrade,
    readingTimeMinutes,
    summary,
  };
}

export interface WordFrequency {
  word: string;
  count: number;
}

const COMMON_STOP_WORDS = new Set([
  'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i', 'it', 'for', 'not', 'on', 'with', 'he',
  'as', 'you', 'do', 'at', 'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she', 'or',
  'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what', 'so', 'up', 'out', 'if', 'about',
  'who', 'get', 'which', 'go', 'me', 'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know',
  'take', 'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other', 'than', 'then',
  'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also', 'back', 'after', 'use', 'two', 'how', 'our',
]);

export function findRepeatedWords(text: string, ignoreStopWords = true): WordFrequency[] {
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .filter(Boolean);

  const counts: Record<string, number> = {};
  words.forEach((w) => {
    if (ignoreStopWords && COMMON_STOP_WORDS.has(w)) return;
    if (w.length < 3 && ignoreStopWords) return;
    counts[w] = (counts[w] || 0) + 1;
  });

  return Object.entries(counts)
    .map(([word, count]) => ({ word, count }))
    .filter((item) => item.count >= 2)
    .sort((a, b) => b.count - a.count);
}

export interface DuplicatePhrase {
  phrase: string;
  count: number;
}

export function findDuplicatePhrases(text: string, minWords = 4): DuplicatePhrase[] {
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);

  if (words.length < minWords * 2) return [];

  const phraseCounts: Record<string, number> = {};

  for (let i = 0; i <= words.length - minWords; i++) {
    const phrase = words.slice(i, i + minWords).join(' ');
    phraseCounts[phrase] = (phraseCounts[phrase] || 0) + 1;
  }

  return Object.entries(phraseCounts)
    .map(([phrase, count]) => ({ phrase, count }))
    .filter((item) => item.count >= 2)
    .sort((a, b) => b.count - a.count)
    .slice(0, 25);
}

export interface PassiveVoiceMatch {
  sentence: string;
  matchedPhrase: string;
  suggestion: string;
}

export function findPassiveVoice(text: string): PassiveVoiceMatch[] {
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const matches: PassiveVoiceMatch[] = [];

  const passivePattern = /\b(am|is|are|was|were|be|been|being)\s+([a-z]+ed|[a-z]+en)\b/i;

  sentences.forEach((sentence) => {
    const match = sentence.match(passivePattern);
    if (match) {
      matches.push({
        sentence: sentence.trim(),
        matchedPhrase: match[0],
        suggestion: `Consider rewriting using an active subject (e.g. replace "${match[0]}" with direct action).`,
      });
    }
  });

  return matches;
}

export interface SentenceLengthAnalysis {
  shortSentences: number; // < 12 words
  mediumSentences: number; // 12-25 words
  longSentences: number; // > 25 words
  maxSentenceWords: number;
  longestSentence: string;
  sentences: { text: string; wordCount: number; category: 'short' | 'medium' | 'long' }[];
}

export function analyzeSentenceLengths(text: string, maxThreshold = 25): SentenceLengthAnalysis {
  const rawSentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  let shortCount = 0;
  let mediumCount = 0;
  let longCount = 0;
  let maxWords = 0;
  let longest = '';

  const sentences = rawSentences.map((s) => {
    const clean = s.trim();
    const words = clean.split(/\s+/).filter(Boolean).length;
    if (words > maxWords) {
      maxWords = words;
      longest = clean;
    }

    let category: 'short' | 'medium' | 'long' = 'medium';
    if (words < 12) {
      shortCount++;
      category = 'short';
    } else if (words <= maxThreshold) {
      mediumCount++;
      category = 'medium';
    } else {
      longCount++;
      category = 'long';
    }

    return { text: clean, wordCount: words, category };
  });

  return {
    shortSentences: shortCount,
    mediumSentences: mediumCount,
    longSentences: longCount,
    maxSentenceWords: maxWords,
    longestSentence: longest,
    sentences,
  };
}

export interface AcademicToneIssue {
  type: 'informal' | 'contraction' | 'first_person' | 'vague_filler' | 'exclamation' | 'slang';
  foundText: string;
  suggestion: string;
}

export function checkAcademicTone(text: string): AcademicToneIssue[] {
  const issues: AcademicToneIssue[] = [];

  // 1. Contractions
  const contractionRegex = /\b(don't|can't|won't|isn't|aren't|wasn't|weren't|haven't|hasn't|hadn't|doesn't|didn't|shouldn't|wouldn't|couldn't)\b/gi;
  let match: RegExpExecArray | null;
  while ((match = contractionRegex.exec(text)) !== null) {
    issues.push({
      type: 'contraction',
      foundText: match[0],
      suggestion: `Spell out in full for academic tone (e.g., "${match[0]}" → "${match[0].replace("n't", " not")}")`,
    });
  }

  // 2. First person phrasing
  const firstPersonRegex = /\b(i|me|my|mine|we|us|our|ours)\b/gi;
  while ((match = firstPersonRegex.exec(text)) !== null) {
    issues.push({
      type: 'first_person',
      foundText: match[0],
      suggestion: `Consider objective third-person phrasing (e.g., "The research indicates" instead of "${match[0]}")`,
    });
  }

  // 3. Informal / Slang words
  const informalMap: Record<string, string> = {
    gonna: 'going to',
    wanna: 'wish to / intend to',
    gotta: 'must / is required to',
    kid: 'child',
    kids: 'children',
    stuff: 'materials / elements / data',
    things: 'factors / aspects',
    huge: 'substantial / significant',
    lots: 'numerous / extensive',
    'a lot': 'a significant quantity',
    'kind of': 'somewhat / to an extent',
    'sort of': 'to an extent',
    awesome: 'exemplary / noteworthy',
  };

  Object.entries(informalMap).forEach(([casual, replacement]) => {
    const r = new RegExp(`\\b${casual}\\b`, 'gi');
    while ((match = r.exec(text)) !== null) {
      issues.push({
        type: 'informal',
        foundText: match[0],
        suggestion: `Replace informal word "${match[0]}" with academic alternative "${replacement}".`,
      });
    }
  });

  // 4. Exclamation marks
  if (text.includes('!')) {
    issues.push({
      type: 'exclamation',
      foundText: '!',
      suggestion: 'Avoid exclamation marks in academic and formal writing.',
    });
  }

  return issues.slice(0, 30);
}

export interface CitationPatternMatch {
  sentence: string;
  reason: string;
}

export function checkCitationNeed(text: string): CitationPatternMatch[] {
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const matches: CitationPatternMatch[] = [];

  const statPattern = /\b(\d+(?:\.\d+)?%|\$\d+|\d+\s+(?:percent|million|billion|trillion|participants|subjects|patients))\b/i;
  const studyPattern = /\b(according to|a study|researchers|scholars|found that|demonstrated that|proved that|survey|experiment)\b/i;
  const yearPattern = /\b(in\s+(?:19|20)\d{2})\b/i;

  sentences.forEach((sentence) => {
    const clean = sentence.trim();
    // Check if sentence already has parenthetical citation like (Smith, 2020)
    const hasCitation = /\([A-Z][a-z]+(?:\s+et\s+al\.)?,\s*\d{4}\)/.test(clean) || /\[\d+\]/.test(clean);
    if (hasCitation) return;

    if (statPattern.test(clean)) {
      matches.push({
        sentence: clean,
        reason: 'Contains numerical data or statistic — consider adding a citation.',
      });
    } else if (studyPattern.test(clean)) {
      matches.push({
        sentence: clean,
        reason: 'Refers to research or study — cite the original author.',
      });
    } else if (yearPattern.test(clean)) {
      matches.push({
        sentence: clean,
        reason: 'Refers to a specific historical date/year — verify if citation is needed.',
      });
    }
  });

  return matches;
}

export function alphabetizeReferences(rawReferences: string): string {
  const lines = rawReferences
    .split(/\n\s*\n|\n(?=[A-Z\[])/)
    .map((r) => r.trim())
    .filter(Boolean);

  lines.sort((a, b) => a.localeCompare(b));
  return lines.join('\n\n');
}

export interface EssayStructureReport {
  wordCount: number;
  sentenceCount: number;
  paragraphCount: number;
  hasIntro: boolean;
  hasConclusion: boolean;
  headingsCount: number;
  checklist: { item: string; status: boolean; note: string }[];
}

export function checkEssayStructure(text: string): EssayStructureReport {
  const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim().length > 0);
  const paragraphCount = paragraphs.length;
  const words = text.split(/\s+/).filter(Boolean).length;
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0).length;

  const firstPara = paragraphs[0] || '';
  const lastPara = paragraphs[paragraphs.length - 1] || '';

  const hasIntro = /\b(introduction|background|this essay|this paper|argues that|aims to)\b/i.test(firstPara);
  const hasConclusion = /\b(in conclusion|to conclude|in summary|overall|finally|this paper demonstrated)\b/i.test(lastPara);
  const headingsCount = text.split('\n').filter((line) => line.trim().startsWith('#') || /^[0-9]\.\s+[A-Z]/.test(line.trim())).length;

  const checklist = [
    {
      item: 'Thesis Statement in Introduction',
      status: hasIntro || words > 200,
      note: 'Ensure your thesis statement clearly states your main claim in the first paragraph.',
    },
    {
      item: 'Multiple Paragraph Structure',
      status: paragraphCount >= 3,
      note: `Found ${paragraphCount} paragraph(s). Standard essays require at least 3 distinct paragraphs (Intro, Body, Conclusion).`,
    },
    {
      item: 'Balanced Paragraph Length',
      status: words / (paragraphCount || 1) >= 50,
      note: 'Average paragraph length looks well-developed.',
    },
    {
      item: 'Clear Conclusion Paragraph',
      status: hasConclusion || paragraphCount >= 3,
      note: 'Conclude by summarizing key findings and reiterating your thesis.',
    },
  ];

  return {
    wordCount: words,
    sentenceCount: sentences,
    paragraphCount,
    hasIntro,
    hasConclusion,
    headingsCount,
    checklist,
  };
}

export function convertFormalTone(text: string): string {
  if (!text) return '';
  let result = text;

  const replacements: [RegExp, string][] = [
    [/\bcan't\b/gi, 'cannot'],
    [/\bwon't\b/gi, 'will not'],
    [/\bdon't\b/gi, 'do not'],
    [/\bdoesn't\b/gi, 'does not'],
    [/\bdidn't\b/gi, 'did not'],
    [/\bisn't\b/gi, 'is not'],
    [/\baren't\b/gi, 'are not'],
    [/\bwasn't\b/gi, 'was not'],
    [/\bweren't\b/gi, 'were not'],
    [/\bhaven't\b/gi, 'have not'],
    [/\bhasn't\b/gi, 'has not'],
    [/\ba lot of\b/gi, 'numerous'],
    [/\blots of\b/gi, 'a substantial amount of'],
    [/\bkids\b/gi, 'children'],
    [/\bstuff\b/gi, 'materials'],
    [/\bthings\b/gi, 'elements'],
    [/\bbig\b/gi, 'significant'],
    [/\bget\b/gi, 'obtain'],
    [/\bshow\b/gi, 'demonstrate'],
  ];

  replacements.forEach(([pattern, sub]) => {
    result = result.replace(pattern, sub);
  });

  return result;
}
