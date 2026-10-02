import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { CATEGORIES, getToolsByCategory } from '@/lib/tools/registry';
import { Breadcrumb } from '@/components/Breadcrumb';
import { ArrowRight, Wrench } from 'lucide-react';
import type { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://toolverse.com';

export async function generateStaticParams() {
  return CATEGORIES.map((cat) => ({
    slug: cat.slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const cat = CATEGORIES.find((c) => c.slug === params.slug);
  if (!cat) return { title: 'Category Not Found — ToolVerse' };

  const canonicalUrl = `${siteUrl}/category/${cat.slug}`;

  return {
    title: `${cat.name} — Free Online Tools Suite | ToolVerse`,
    description: `${cat.description} 100% free, fast, and browser-private.`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${cat.name} — Free Online Tools Suite | ToolVerse`,
      description: cat.description,
      url: canonicalUrl,
      siteName: 'ToolVerse',
      type: 'website',
    },
  };
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const cat = CATEGORIES.find((c) => c.slug === params.slug);
  if (!cat) notFound();

  const categoryTools = getToolsByCategory(cat.slug);

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-4">
      <Breadcrumb items={[{ label: cat.name }]} />

      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">{cat.name}</h1>
        <p className="text-base text-slate-600 dark:text-slate-400 max-w-2xl">{cat.description}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categoryTools.map((tool) => (
          <Link
            key={tool.id}
            href={`/tools/${tool.slug}`}
            className="tool-card group flex flex-col justify-between"
          >
            <div className="space-y-2">
              <h3 className="font-semibold text-base text-slate-900 dark:text-white group-hover:text-brand-600 transition-colors">
                {tool.canonicalName}
              </h3>
              <p className="text-xs text-slate-500 line-clamp-2">{tool.shortDescription}</p>
            </div>
            <div className="pt-4 flex items-center gap-1 text-xs font-semibold text-brand-600">
              <span>Use Tool</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
