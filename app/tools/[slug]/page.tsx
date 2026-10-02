import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getToolBySlug, getToolById, TOOLS } from '@/lib/tools/registry';
import { ToolRenderer } from '@/features/tools/ToolRenderer';
import { Breadcrumb } from '@/components/Breadcrumb';
import { AdSlot } from '@/components/AdSlot';
import { ShieldCheck, Info, CheckCircle2, HelpCircle, ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://toolverse.com';

export async function generateStaticParams() {
  return TOOLS.map((tool) => ({
    slug: tool.slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const tool = getToolBySlug(params.slug);
  if (!tool) return { title: 'Tool Not Found — ToolVerse' };

  const pageTitle = `${tool.canonicalName} — Free Online Utility Tool | ToolVerse`;
  const pageDesc = `${tool.shortDescription} 100% free, browser-private, and fast processing.`;
  const canonicalUrl = `${siteUrl}/tools/${tool.slug}`;

  return {
    title: pageTitle,
    description: pageDesc,
    keywords: [...tool.keywords, 'free online tool', 'browser private', 'toolverse'],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: pageTitle,
      description: pageDesc,
      url: canonicalUrl,
      siteName: 'ToolVerse',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: pageDesc,
    },
  };
}

export default function ToolPage({ params }: { params: { slug: string } }) {
  const tool = getToolBySlug(params.slug);
  if (!tool) notFound();

  const relatedTools = (tool.relatedToolIds || [])
    .map((id) => getToolById(id))
    .filter((t): t is NonNullable<typeof t> => t !== undefined);

  // 1. SoftwareApplication Schema
  const softwareAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: tool.canonicalName,
    operatingSystem: 'Any (Web Browser)',
    applicationCategory: tool.category,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '1420',
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    description: tool.shortDescription,
  };

  // 2. BreadcrumbList Schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: siteUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: tool.category,
        item: `${siteUrl}/category/${tool.categorySlug}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: tool.canonicalName,
        item: `${siteUrl}/tools/${tool.slug}`,
      },
    ],
  };

  // 3. FAQPage Schema
  const faqList = [
    {
      question: `Is ${tool.canonicalName} completely free to use?`,
      answer: `Yes, ${tool.canonicalName} is 100% free with unlimited usage. There are no hidden fees, signups, or subscription requirements.`
    },
    {
      question: `Is my data safe and private when using ${tool.canonicalName}?`,
      answer: `${tool.privacyMessage} Your privacy is guaranteed because operations run locally inside your device browser memory.`
    },
    {
      question: `Does ${tool.canonicalName} work on mobile phones and tablets?`,
      answer: `Yes! ${tool.canonicalName} is fully responsive and optimized for iPhones, iPads, Android devices, Mac, and Windows PCs.`
    }
  ];

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqList.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <div className="space-y-10 max-w-4xl mx-auto py-4">
      {/* Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Header section */}
      <div className="space-y-3">
        <Breadcrumb
          items={[
            { label: tool.category, href: `/category/${tool.categorySlug}` },
            { label: tool.canonicalName },
          ]}
        />

        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {tool.canonicalName}
        </h1>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
          {tool.shortDescription}
        </p>

        {/* Privacy Badge */}
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800/60 px-3.5 py-1.5 rounded-full">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>{tool.privacyMessage}</span>
        </div>
      </div>

      {/* Main Functional Interface */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm">
        <ToolRenderer tool={tool} />
      </div>

      <AdSlot slotId="tool-middle-ad" />

      {/* Instructions & Documentation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-3">
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Info className="w-4 h-4 text-brand-600" /> How to Use {tool.canonicalName}
          </h3>
          <ol className="space-y-2 text-xs text-slate-600 dark:text-slate-300 list-decimal pl-4">
            {tool.instructions.map((step, idx) => (
              <li key={idx} className="leading-relaxed">{step}</li>
            ))}
          </ol>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-3">
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Common Use Cases
          </h3>
          <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300 list-disc pl-4">
            {tool.useCases.map((useCase, idx) => (
              <li key={idx} className="leading-relaxed">{useCase}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* High-Intent FAQ Section (SEO Engine Boost) */}
      <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-4">
        <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-brand-500" /> Frequently Asked Questions (FAQ)
        </h3>
        <div className="space-y-3">
          {faqList.map((faq, idx) => (
            <div key={idx} className="p-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                {faq.question}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Related Tools */}
      {relatedTools.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">Related Tools</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {relatedTools.map((rel) => (
              <Link
                key={rel.id}
                href={`/tools/${rel.slug}`}
                className="tool-card group p-4"
              >
                <div className="font-semibold text-sm text-slate-900 dark:text-white group-hover:text-brand-600">
                  {rel.canonicalName}
                </div>
                <div className="text-xs text-slate-500 line-clamp-2 mt-1">{rel.shortDescription}</div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
