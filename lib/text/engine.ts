import { diffWords, diffLines, Change } from 'diff';

export interface TextStats {
  words: number;
  charactersWithSpaces: number;
  charactersWithoutSpaces: number;
  sentences: number;
  paragraphs: number;
  lines: number;
  readingTimeMinutes: number;
  speakingTimeMinutes: number;
}

export function analyzeText(text: string): TextStats {
  const trimmed = text.trim();
  if (!trimmed) {
    return {
      words: 0,
      charactersWithSpaces: 0,
      charactersWithoutSpaces: 0,
      sentences: 0,
      paragraphs: 0,
      lines: 0,
      readingTimeMinutes: 0,
      speakingTimeMinutes: 0,
    };
  }

  const words = trimmed.split(/\s+/).filter(Boolean).length;
  const charactersWithSpaces = text.length;
  const charactersWithoutSpaces = text.replace(/\s/g, '').length;
  const sentences = trimmed.split(/[.!?]+/).filter(Boolean).length;
  const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim().length > 0).length;
  const lines = text.split(/\n/).length;

  const readingTimeMinutes = Math.ceil(words / 200); // 200 wpm average
  const speakingTimeMinutes = Math.ceil(words / 130); // 130 wpm average

  return {
    words,
    charactersWithSpaces,
    charactersWithoutSpaces,
    sentences,
    paragraphs,
    lines,
    readingTimeMinutes,
    speakingTimeMinutes,
  };
}

export type TextCaseFormat =
  | 'uppercase'
  | 'lowercase'
  | 'titlecase'
  | 'sentencecase'
  | 'capitalized'
  | 'camelcase'
  | 'kebabcase'
  | 'snakecase';

export function convertTextCase(text: string, format: TextCaseFormat): string {
  if (!text) return '';

  switch (format) {
    case 'uppercase':
      return text.toUpperCase();
    case 'lowercase':
      return text.toLowerCase();
    case 'titlecase':
      return text
        .toLowerCase()
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    case 'sentencecase':
      return text
        .toLowerCase()
        .replace(/(^\s*|[.!?]\s+)([a-z])/g, (_, p1, p2) => p1 + p2.toUpperCase());
    case 'capitalized':
      return text.replace(/\b\w/g, (l) => l.toUpperCase());
    case 'camelcase':
      return text
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());
    case 'kebabcase':
      return text
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    case 'snakecase':
      return text
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$_/g, '');
    default:
      return text;
  }
}

export function removeDuplicateLines(
  text: string,
  options: { caseSensitive?: boolean; trimLines?: boolean } = {}
): string {
  const lines = text.split(/\r?\n/);
  const seen = new Set<string>();
  const result: string[] = [];

  for (let line of lines) {
    let processed = line;
    if (options.trimLines) processed = processed.trim();
    const key = options.caseSensitive ? processed : processed.toLowerCase();

    if (!seen.has(key)) {
      seen.add(key);
      result.push(line);
    }
  }

  return result.join('\n');
}

export function computeTextDiff(originalText: string, modifiedText: string): Change[] {
  return diffWords(originalText, modifiedText);
}

export function generateLoremIpsum(paragraphs: number = 3): string {
  const loremBase = [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    "Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris. Integer in mauris eu nibh euismod gravida.",
    "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Mauris ut leo. Cras dolor metus, ultrices in, egestas a, quam. Pellentesque habitant morbi tristique senectus et netus."
  ];

  const result: string[] = [];
  for (let i = 0; i < paragraphs; i++) {
    result.push(loremBase[i % loremBase.length]);
  }
  return result.join('\n\n');
}
