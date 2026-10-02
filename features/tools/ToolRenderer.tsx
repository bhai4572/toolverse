'use client';

import React from 'react';
import { ToolDefinition } from '@/lib/tools/registry';
import { ImageCompressorTool } from './ImageCompressorTool';
import { ImageResizerTool } from './ImageResizerTool';
import { ImageConverterTool } from './ImageConverterTool';
import { PassportPhotoMakerTool } from './PassportPhotoMakerTool';
import { PdfMergeTool } from './PdfMergeTool';
import { PdfSplitTool } from './PdfSplitTool';
import { JpgToPdfTool } from './JpgToPdfTool';
import { PdfRotateTool } from './PdfRotateTool';
import { WordCounterTool } from './WordCounterTool';
import { TextCaseConverterTool } from './TextCaseConverterTool';
import { RemoveDuplicateLinesTool } from './RemoveDuplicateLinesTool';
import { JsonFormatterTool } from './JsonFormatterTool';
import { QrCodeGeneratorTool } from './QrCodeGeneratorTool';
import { PasswordGeneratorTool } from './PasswordGeneratorTool';
import { PercentageCalculatorTool } from './PercentageCalculatorTool';
import { ZakatCalculatorTool } from './ZakatCalculatorTool';
import { PakistanTaxTool } from './PakistanTaxTool';
import { InvoiceGeneratorTool } from './InvoiceGeneratorTool';
import { UrlShortenerTool } from './UrlShortenerTool';
import { UtmBuilderTool } from './UtmBuilderTool';
import { MetaTagGeneratorTool } from './MetaTagGeneratorTool';
import { AdsenseCalculatorTool } from './AdsenseCalculatorTool';
import { YoutubeEarningsTool } from './YoutubeEarningsTool';
import { Base64Tool } from './Base64Tool';
import { HashGeneratorTool } from './HashGeneratorTool';
import { LoremIpsumTool } from './LoremIpsumTool';
import { WritingTools } from './WritingTools';
import { AdvancedTools } from './AdvancedTools';
import { JobFinderTool } from './JobTools';
import { AlertTriangle, Lock } from 'lucide-react';

export function ToolRenderer({ tool }: { tool: ToolDefinition }) {
  if (tool.status === 'admin_configuration_required') {
    return (
      <div className="p-8 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
          <Lock className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-amber-900 dark:text-amber-200">
          Configuration Required by Administrator
        </h3>
        <p className="text-xs text-amber-700 dark:text-amber-400 max-w-md mx-auto">
          This server-side processing tool requires administrator setup. Please configure the required environment keys ({tool.requiredEnvironmentVariables?.join(', ') || 'API_KEY'}) in production.
        </p>
      </div>
    );
  }

  if (tool.status === 'disabled') {
    return (
      <div className="p-8 bg-slate-100 dark:bg-slate-800 rounded-xl text-center text-slate-500 text-sm">
        This tool is currently disabled.
      </div>
    );
  }

  switch (tool.slug) {
    case 'image-compressor':
      return <ImageCompressorTool isTargetKbMode={false} />;
    case 'compress-image-target-size':
      return <ImageCompressorTool isTargetKbMode={true} />;
    case 'image-resizer':
    case 'image-cropper':
      return <ImageResizerTool isSocialMode={false} />;
    case 'social-media-image-resizer':
      return <ImageResizerTool isSocialMode={true} />;
    case 'jpg-to-png':
      return <ImageConverterTool defaultTargetFormat="image/png" />;
    case 'png-to-jpg':
      return <ImageConverterTool defaultTargetFormat="image/jpeg" />;
    case 'jpg-to-webp':
      return <ImageConverterTool defaultTargetFormat="image/webp" />;
    case 'webp-to-jpg':
      return <ImageConverterTool defaultTargetFormat="image/jpeg" />;
    case 'heic-to-jpg':
      return <ImageConverterTool defaultTargetFormat="image/jpeg" />;
    case 'passport-photo-maker':
      return <PassportPhotoMakerTool />;
    case 'pdf-merge':
      return <PdfMergeTool />;
    case 'pdf-split':
      return <PdfSplitTool />;
    case 'jpg-to-pdf':
    case 'images-to-pdf':
      return <JpgToPdfTool />;
    case 'pdf-rotate':
    case 'pdf-reorder-pages':
      return <PdfRotateTool />;
    case 'word-counter':
    case 'character-counter':
    case 'text-diff-checker':
      return <WordCounterTool />;
    case 'text-case-converter':
      return <TextCaseConverterTool />;
    case 'remove-duplicate-lines':
      return <RemoveDuplicateLinesTool />;
    case 'json-formatter':
    case 'json-to-csv':
      return <JsonFormatterTool />;
    case 'qr-code-generator':
      return <QrCodeGeneratorTool />;
    case 'password-generator':
    case 'uuid-generator':
      return <PasswordGeneratorTool />;
    case 'percentage-calculator':
    case 'discount-calculator':
    case 'profit-margin-calculator':
    case 'compound-interest-calculator':
    case 'emi-calculator':
    case 'vat-gst-calculator':
    case 'age-calculator':
    case 'gpa-calculator':
      return <PercentageCalculatorTool />;
    case 'zakat-calculator':
      return <ZakatCalculatorTool />;
    case 'pakistan-salary-tax-estimator':
      return <PakistanTaxTool />;
    case 'invoice-generator':
    case 'quotation-generator':
      return <InvoiceGeneratorTool />;
    case 'url-shortener':
      return <UrlShortenerTool />;
    case 'utm-builder':
      return <UtmBuilderTool />;
    case 'meta-tag-generator':
      return <MetaTagGeneratorTool />;
    case 'adsense-revenue-calculator':
      return <AdsenseCalculatorTool />;
    case 'youtube-earnings-estimator':
      return <YoutubeEarningsTool />;
    case 'base64-encoder-decoder':
      return <Base64Tool />;
    case 'hash-generator':
      return <HashGeneratorTool />;
    case 'lorem-ipsum-generator':
      return <LoremIpsumTool />;

    // Writing, Grammar & Academic Integrity Tools
    case 'readability-score':
    case 'repeated-word-finder':
    case 'duplicate-phrase-finder':
    case 'passive-voice-finder':
    case 'sentence-length-checker':
    case 'academic-tone-checker':
    case 'citation-checklist':
    case 'reference-list-alphabetizer':
    case 'citation-generator':
    case 'essay-structure-checker':
    case 'thesis-statement-checker':
    case 'transition-word-helper':
    case 'formal-tone-converter':
    case 'simple-english-converter':
    case 'email-proofreading-checklist':
    case 'assignment-submission-checklist':
    case 'originality-checklist':
    case 'grammar-checker':
    case 'proofreader':
    case 'paraphrasing-tool':
    case 'natural-writing-rewriter':
    case 'sentence-improver':
    case 'writing-pattern-indicator':
    case 'web-similarity-checker':
    case 'academic-plagiarism-checker':
      return <WritingTools tool={tool} />;

    // Advanced Math, Science, Dev, E-Commerce & Regional Utilities
    case 'equation-solver':
    case 'matrix-vector-calculator':
    case 'unit-converter-suite':
    case 'target-cgpa-calculator':
    case 'attendance-calculator':
    case 'ats-resume-checker':
    case 'cover-letter-generator':
    case 'leave-application-generator':
    case 'youtube-tag-formatter':
    case 'instagram-grid-splitter':
    case 'youtube-chapters-generator':
    case 'css-gradient-shadow-generator':
    case 'jwt-decoder':
    case 'sql-formatter':
    case 'regex-tester':
    case 'cron-expression-generator':
    case 'subnet-calculator':
    case 'daraz-profit-calculator':
    case 'shipping-label-generator':
    case 'break-even-calculator':
    case 'pakistan-electricity-bill-estimator':
    case 'solar-panel-calculator':
      return <AdvancedTools tool={tool} />;

    case 'global-job-finder':
      return <JobFinderTool />;

    default:
      return <ImageCompressorTool />;
  }
}
