'use client';

import React, { useState } from 'react';
import { ToolDefinition } from '@/lib/tools/registry';
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
} from '@/lib/text/writingEngine';
import { formatCitation } from '@/lib/text/citationEngine';
import {
  BookOpen,
  Copy,
  Check,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  GraduationCap,
  ArrowDownAZ,
  Quote,
  LayoutList,
  Compass,
  Repeat,
  AlignLeft,
  MailCheck,
  CheckCircle2,
  Lock,
  Info,
} from 'lucide-react';

export function WritingTools({ tool }: { tool: ToolDefinition }) {
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);
  const [userConsent, setUserConsent] = useState(false);
  const [ignoreStopWords, setIgnoreStopWords] = useState(true);

  // Citation Formatter states
  const [citType, setCitType] = useState<'website' | 'journal' | 'book'>('website');
  const [citStyle, setCitStyle] = useState<'APA' | 'MLA' | 'Harvard' | 'IEEE'>('APA');
  const [authorFirst, setAuthorFirst] = useState('Dietrich');
  const [authorLast, setAuthorLast] = useState('Gebert');
  const [citTitle, setCitTitle] = useState('Academic Integrity and Writing Principles');
  const [publisher, setPublisher] = useState('Oxford University Press');
  const [year, setYear] = useState('2026');

  // Checkbox lists states
  const [emailChecks, setEmailChecks] = useState<Record<string, boolean>>({});
  const [assignChecks, setAssignChecks] = useState<Record<string, boolean>>({});

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const ethicalDisclaimer = (
    <div className="p-4 mb-6 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-xl flex items-start space-x-3 text-xs text-blue-800 dark:text-blue-300">
      <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
      <div>
        <span className="font-bold block mb-0.5 text-sm">Academic Integrity & Ethical Use Notice</span>
        ToolVerse tools are designed for ethical proofreading, readability enhancement, and citation formatting. They do NOT provide Turnitin bypass, AI-detector evasion, or unverified plagiarism scores. Always cite your sources and comply with your institution's academic policy.
      </div>
    </div>
  );

  // 1. Readability Score Checker
  if (tool.slug === 'readability-score') {
    const metrics = calculateReadability(text);
    return (
      <div className="space-y-6">
        {ethicalDisclaimer}
        <textarea
          rows={6}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste your essay, article, or manuscript text here..."
          className="w-full p-4 border rounded-xl dark:bg-slate-900 dark:border-slate-700 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border rounded-xl text-center">
            <span className="text-xs text-slate-500 block">Flesch Reading Ease</span>
            <span className="text-2xl font-black text-blue-600 dark:text-blue-400">{metrics.fleschEase} / 100</span>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border rounded-xl text-center">
            <span className="text-xs text-slate-500 block">Grade Level</span>
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">Grade {metrics.kincaidGrade}</span>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border rounded-xl text-center">
            <span className="text-xs text-slate-500 block">Avg Sentence Length</span>
            <span className="text-xl font-bold">{metrics.avgSentenceLength} words</span>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border rounded-xl text-center">
            <span className="text-xs text-slate-500 block">Reading Time</span>
            <span className="text-xl font-bold">~{metrics.readingTimeMinutes} min</span>
          </div>
        </div>

        <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-xl text-sm space-y-1">
          <span className="font-semibold block">Readability Summary:</span>
          <p className="text-slate-600 dark:text-slate-300">{metrics.summary}</p>
        </div>
      </div>
    );
  }

  // 2. Repeated Word Finder
  if (tool.slug === 'repeated-word-finder') {
    const repeated = findRepeatedWords(text, ignoreStopWords);
    return (
      <div className="space-y-6">
        {ethicalDisclaimer}
        <div className="flex items-center justify-between">
          <label className="flex items-center space-x-2 text-xs font-semibold text-slate-600 dark:text-slate-400 cursor-pointer">
            <input
              type="checkbox"
              checked={ignoreStopWords}
              onChange={(e) => setIgnoreStopWords(e.target.checked)}
              className="rounded text-blue-600"
            />
            <span>Ignore common stop words (the, and, of, in...)</span>
          </label>
        </div>

        <textarea
          rows={6}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste your text to inspect overused and repeated words..."
          className="w-full p-4 border rounded-xl dark:bg-slate-900 dark:border-slate-700 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
        />

        <div className="border rounded-xl p-4 bg-slate-50 dark:bg-slate-800/40">
          <h4 className="font-bold text-sm mb-3 flex items-center gap-2">
            <Repeat className="w-4 h-4 text-blue-500" /> Repeated Word Frequency Table ({repeated.length})
          </h4>
          {repeated.length === 0 ? (
            <p className="text-xs text-slate-500">No overused repeated words found yet.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {repeated.map((item, idx) => (
                <div key={idx} className="p-2 bg-white dark:bg-slate-900 border rounded-lg flex items-center justify-between text-xs">
                  <span className="font-semibold">{item.word}</span>
                  <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded font-bold">{item.count}x</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // 3. Duplicate Phrase Finder
  if (tool.slug === 'duplicate-phrase-finder') {
    const phrases = findDuplicatePhrases(text, 4);
    return (
      <div className="space-y-6">
        {ethicalDisclaimer}
        <textarea
          rows={6}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste draft document to scan for duplicate internal phrases..."
          className="w-full p-4 border rounded-xl dark:bg-slate-900 dark:border-slate-700 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
        />

        <div className="border rounded-xl p-4 bg-slate-50 dark:bg-slate-800/40">
          <h4 className="font-bold text-sm mb-3 flex items-center gap-2">
            <Copy className="w-4 h-4 text-blue-500" /> Repeated Internal Phrases ({phrases.length})
          </h4>
          <p className="text-xs text-slate-500 mb-4">
            Note: This tool inspects repetition inside your own text to improve variety. It does not scan external internet databases.
          </p>
          {phrases.length === 0 ? (
            <p className="text-xs text-slate-500">No duplicate 4+ word phrases found.</p>
          ) : (
            <div className="space-y-2">
              {phrases.map((item, idx) => (
                <div key={idx} className="p-3 bg-white dark:bg-slate-900 border rounded-lg flex items-center justify-between text-xs">
                  <span className="font-mono text-slate-700 dark:text-slate-300">"{item.phrase}"</span>
                  <span className="px-2 py-1 bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 rounded font-bold">{item.count} occurrences</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // 4. Passive Voice Finder
  if (tool.slug === 'passive-voice-finder') {
    const passives = findPassiveVoice(text);
    return (
      <div className="space-y-6">
        {ethicalDisclaimer}
        <textarea
          rows={6}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste text to find passive voice constructions..."
          className="w-full p-4 border rounded-xl dark:bg-slate-900 dark:border-slate-700 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
        />

        <div className="border rounded-xl p-4 bg-slate-50 dark:bg-slate-800/40 space-y-3">
          <h4 className="font-bold text-sm flex items-center gap-2">
            Passive Voice Sentences Detected ({passives.length})
          </h4>
          {passives.length === 0 ? (
            <p className="text-xs text-slate-500">No passive voice constructions detected.</p>
          ) : (
            passives.map((p, idx) => (
              <div key={idx} className="p-3 bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-800/50 rounded-lg text-xs space-y-1">
                <span className="font-semibold text-amber-600 dark:text-amber-400 block">Match: "{p.matchedPhrase}"</span>
                <p className="text-slate-700 dark:text-slate-300">{p.sentence}</p>
                <p className="text-slate-500 italic">{p.suggestion}</p>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  // 5. Sentence Length Checker
  if (tool.slug === 'sentence-length-checker') {
    const analysis = analyzeSentenceLengths(text);
    return (
      <div className="space-y-6">
        {ethicalDisclaimer}
        <textarea
          rows={6}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste text to analyze sentence lengths..."
          className="w-full p-4 border rounded-xl dark:bg-slate-900 dark:border-slate-700 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
        />

        <div className="grid grid-cols-3 gap-4">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-center">
            <span className="text-xs text-emerald-700 dark:text-emerald-400 block">Short (&lt;12 words)</span>
            <span className="text-xl font-bold text-emerald-800 dark:text-emerald-300">{analysis.shortSentences}</span>
          </div>
          <div className="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-xl text-center">
            <span className="text-xs text-blue-700 dark:text-blue-400 block">Medium (12-25 words)</span>
            <span className="text-xl font-bold text-blue-800 dark:text-blue-300">{analysis.mediumSentences}</span>
          </div>
          <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl text-center">
            <span className="text-xs text-amber-700 dark:text-amber-400 block">Long (&gt;25 words)</span>
            <span className="text-xl font-bold text-amber-800 dark:text-amber-300">{analysis.longSentences}</span>
          </div>
        </div>

        {analysis.longestSentence && (
          <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs space-y-1">
            <span className="font-bold text-slate-700 dark:text-slate-300 block">Longest Sentence ({analysis.maxSentenceWords} words):</span>
            <p className="text-slate-600 dark:text-slate-400 font-mono">"{analysis.longestSentence}"</p>
          </div>
        )}
      </div>
    );
  }

  // 6. Academic Tone Checker
  if (tool.slug === 'academic-tone-checker') {
    const issues = checkAcademicTone(text);
    return (
      <div className="space-y-6">
        {ethicalDisclaimer}
        <textarea
          rows={6}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste academic essay or thesis draft to inspect formal tone..."
          className="w-full p-4 border rounded-xl dark:bg-slate-900 dark:border-slate-700 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
        />

        <div className="border rounded-xl p-4 bg-slate-50 dark:bg-slate-800/40 space-y-3">
          <h4 className="font-bold text-sm flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-blue-500" /> Academic Tone Flags ({issues.length})
          </h4>
          {issues.length === 0 ? (
            <p className="text-xs text-emerald-600 font-semibold">Great! No obvious contractions, slang, or informal phrasing detected.</p>
          ) : (
            issues.map((issue, idx) => (
              <div key={idx} className="p-3 bg-white dark:bg-slate-900 border rounded-lg text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-red-600 dark:text-red-400 capitalize">Type: {issue.type.replace('_', ' ')}</span>
                  <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 font-mono">Found: "{issue.foundText}"</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300">{issue.suggestion}</p>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  // 7. Citation Completeness Checklist
  if (tool.slug === 'citation-checklist') {
    const needs = checkCitationNeed(text);
    return (
      <div className="space-y-6">
        {ethicalDisclaimer}
        <textarea
          rows={6}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste essay text to identify data points and claims requiring citations..."
          className="w-full p-4 border rounded-xl dark:bg-slate-900 dark:border-slate-700 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
        />

        <div className="border rounded-xl p-4 bg-slate-50 dark:bg-slate-800/40 space-y-3">
          <h4 className="font-bold text-sm flex items-center gap-2">
            Sentences Potentially Requiring Citation ({needs.length})
          </h4>
          {needs.length === 0 ? (
            <p className="text-xs text-slate-500">No un-cited statistics, study references, or historical dates flagged.</p>
          ) : (
            needs.map((item, idx) => (
              <div key={idx} className="p-3 bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-800/50 rounded-lg text-xs space-y-1">
                <span className="font-semibold text-blue-600 dark:text-blue-400 block">{item.reason}</span>
                <p className="text-slate-700 dark:text-slate-300 font-mono">"{item.sentence}"</p>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  // 8. Reference List Alphabetizer
  if (tool.slug === 'reference-list-alphabetizer') {
    const sorted = alphabetizeReferences(text);
    return (
      <div className="space-y-6">
        {ethicalDisclaimer}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold mb-1 block">Unsorted Reference List:</label>
            <textarea
              rows={10}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste your references here (separated by line breaks)..."
              className="w-full p-4 border rounded-xl dark:bg-slate-900 dark:border-slate-700 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold">Alphabetized Bibliography:</label>
              {sorted && (
                <button
                  onClick={() => handleCopy(sorted)}
                  className="px-2 py-1 bg-blue-600 text-white rounded text-xs flex items-center gap-1"
                >
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />} Copy
                </button>
              )}
            </div>
            <textarea
              rows={10}
              readOnly
              value={sorted}
              placeholder="Alphabetized references will appear here..."
              className="w-full p-4 border rounded-xl bg-slate-50 dark:bg-slate-900 dark:border-slate-700 text-sm outline-none font-mono"
            />
          </div>
        </div>
      </div>
    );
  }

  // 9. Citation Formatter
  if (tool.slug === 'citation-generator') {
    const formatted = formatCitation(
      {
        authorFirst,
        authorLast,
        title: citTitle,
        websiteOrPublisher: publisher,
        year,
        type: citType,
      },
      citStyle
    );

    return (
      <div className="space-y-6">
        {ethicalDisclaimer}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-semibold block mb-1">Citation Style:</label>
            <select
              value={citStyle}
              onChange={(e) => setCitStyle(e.target.value as any)}
              className="w-full p-2 border rounded-lg text-sm dark:bg-slate-900"
            >
              <option value="APA">APA (7th Edition)</option>
              <option value="MLA">MLA (9th Edition)</option>
              <option value="Harvard">Harvard</option>
              <option value="IEEE">IEEE</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold block mb-1">Source Type:</label>
            <select
              value={citType}
              onChange={(e) => setCitType(e.target.value as any)}
              className="w-full p-2 border rounded-lg text-sm dark:bg-slate-900"
            >
              <option value="website">Website</option>
              <option value="journal">Journal Article</option>
              <option value="book">Book</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold block mb-1">Publication Year:</label>
            <input
              type="text"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full p-2 border rounded-lg text-sm dark:bg-slate-900"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Author First Name"
            value={authorFirst}
            onChange={(e) => setAuthorFirst(e.target.value)}
            className="p-2 border rounded-lg text-sm dark:bg-slate-900"
          />
          <input
            type="text"
            placeholder="Author Last Name"
            value={authorLast}
            onChange={(e) => setAuthorLast(e.target.value)}
            className="p-2 border rounded-lg text-sm dark:bg-slate-900"
          />
          <input
            type="text"
            placeholder="Title of Work"
            value={citTitle}
            onChange={(e) => setCitTitle(e.target.value)}
            className="p-2 border rounded-lg text-sm dark:bg-slate-900 md:col-span-2"
          />
          <input
            type="text"
            placeholder="Publisher or Website Name"
            value={publisher}
            onChange={(e) => setPublisher(e.target.value)}
            className="p-2 border rounded-lg text-sm dark:bg-slate-900 md:col-span-2"
          />
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-900 border rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">{citStyle} Formatted Reference:</span>
            <button
              onClick={() => handleCopy(formatted)}
              className="px-3 py-1 bg-blue-600 text-white rounded text-xs flex items-center gap-1"
            >
              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />} Copy Reference
            </button>
          </div>
          <p className="font-serif text-sm p-3 bg-white dark:bg-slate-800 border rounded-lg text-slate-800 dark:text-slate-200">
            {formatted}
          </p>
        </div>
      </div>
    );
  }

  // 10. Essay Structure Checker
  if (tool.slug === 'essay-structure-checker') {
    const report = checkEssayStructure(text);
    return (
      <div className="space-y-6">
        {ethicalDisclaimer}
        <textarea
          rows={6}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste your full essay draft to inspect paragraph distribution..."
          className="w-full p-4 border rounded-xl dark:bg-slate-900 dark:border-slate-700 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
        />

        <div className="grid grid-cols-3 gap-4">
          <div className="p-3 bg-slate-50 dark:bg-slate-800 border rounded-xl text-center">
            <span className="text-xs text-slate-500 block">Paragraphs</span>
            <span className="text-xl font-bold">{report.paragraphCount}</span>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-800 border rounded-xl text-center">
            <span className="text-xs text-slate-500 block">Words</span>
            <span className="text-xl font-bold">{report.wordCount}</span>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-800 border rounded-xl text-center">
            <span className="text-xs text-slate-500 block">Sentences</span>
            <span className="text-xl font-bold">{report.sentenceCount}</span>
          </div>
        </div>

        <div className="border rounded-xl p-4 bg-slate-50 dark:bg-slate-800/40 space-y-2">
          <h4 className="font-bold text-sm mb-2">Essay Structural Checklist</h4>
          {report.checklist.map((item, idx) => (
            <div key={idx} className="flex items-start space-x-3 p-2 bg-white dark:bg-slate-900 border rounded-lg text-xs">
              <CheckCircle2 className={`w-4 h-4 mt-0.5 ${item.status ? 'text-emerald-500' : 'text-slate-300'}`} />
              <div>
                <span className="font-bold block">{item.item}</span>
                <span className="text-slate-500">{item.note}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 11. Formal Tone Converter & Simple English
  if (tool.slug === 'formal-tone-converter' || tool.slug === 'simple-english-converter') {
    const converted = convertFormalTone(text);
    return (
      <div className="space-y-6">
        {ethicalDisclaimer}
        <textarea
          rows={6}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste sentence or paragraph to convert..."
          className="w-full p-4 border rounded-xl dark:bg-slate-900 dark:border-slate-700 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
        />

        <div className="p-4 bg-slate-50 dark:bg-slate-900 border rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Converted Result (Review before using):</span>
            {converted && (
              <button
                onClick={() => handleCopy(converted)}
                className="px-3 py-1 bg-blue-600 text-white rounded text-xs flex items-center gap-1"
              >
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />} Copy Result
              </button>
            )}
          </div>
          <p className="text-sm p-3 bg-white dark:bg-slate-800 border rounded-lg font-mono text-slate-800 dark:text-slate-200 min-h-[60px]">
            {converted || 'Converted text will appear here...'}
          </p>
        </div>
      </div>
    );
  }

  // Default API / Ethical Config Required Tools UI
  return (
    <div className="space-y-6">
      {ethicalDisclaimer}

      {['paraphrasing-tool', 'natural-writing-rewriter'].includes(tool.slug) && (
        <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl space-y-2">
          <label className="flex items-start space-x-3 cursor-pointer text-xs text-amber-900 dark:text-amber-200">
            <input
              type="checkbox"
              checked={userConsent}
              onChange={(e) => setUserConsent(e.target.checked)}
              className="mt-0.5 rounded text-amber-600"
            />
            <span>
              <strong>Ethical Compliance Confirmation:</strong> I confirm I have the right to edit this text and will comply with my institution's academic-integrity rules.
            </span>
          </label>
        </div>
      )}

      {tool.slug === 'writing-pattern-indicator' && (
        <div className="p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl text-xs text-red-800 dark:text-red-300">
          <strong>Prominent Limitations Notice:</strong> This indicator is an imperfect statistical pattern signal. It can misclassify human or AI-assisted writing. It must NEVER be used as the sole basis for an academic decision or penalty.
        </div>
      )}

      {tool.status === 'admin_configuration_required' && (
        <div className="p-6 bg-slate-50 dark:bg-slate-800/60 border rounded-xl text-center space-y-3">
          <Lock className="w-8 h-8 text-amber-500 mx-auto" />
          <h4 className="font-bold text-sm">Real Provider API Configuration Required</h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            This tool requires provider API keys configured in environment variables ({tool.requiredEnvironmentVariables?.join(', ') || 'API_KEY'}). ToolVerse serves zero fake AI outputs.
          </p>
        </div>
      )}

      <textarea
        rows={6}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste text for server API inspection..."
        className="w-full p-4 border rounded-xl dark:bg-slate-900 dark:border-slate-700 text-sm outline-none"
      />
    </div>
  );
}
