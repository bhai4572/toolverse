'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, ShieldCheck, Zap, Lock, Sparkles, ArrowRight, Layers, Minimize2, QrCode, FileText, Calculator, Code2, Globe, Briefcase } from 'lucide-react';
import { TOOLS, CATEGORIES, getPopularTools, getFeaturedTools, searchTools, ToolDefinition } from '@/lib/tools/registry';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const popularTools = getPopularTools();
  const featuredTools = getFeaturedTools();

  const searchResults = searchQuery.trim() ? searchTools(searchQuery) : [];

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'ToolVerse',
    url: 'https://toolverse.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://toolverse.com/?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  };

  return (
    <div className="space-y-16 py-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      {/* Hero Section */}
      <section className="text-center space-y-6 max-w-4xl mx-auto pt-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 dark:bg-brand-950/60 border border-brand-200/60 dark:border-brand-800/60 text-brand-700 dark:text-brand-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{TOOLS.length}+ Free Online Tools &amp; 100% Privacy-First Suite</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
          {TOOLS.length}+ Free Online Tools for <span className="text-brand-600 dark:text-brand-500">Everyday Work</span>
        </h1>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Files, PDFs, images, calculators, writing &amp; academic tools, student utilities, creator tools, SEO and developer helpers — 100% free, fast, and processed directly in your browser.
        </p>

        {/* Global Search Input */}
        <div className="max-w-xl mx-auto relative">
          <div className="relative shadow-lg rounded-xl overflow-hidden">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search any tool (e.g. photo 100kb, pdf merge, url shortener)..."
              className="w-full pl-12 pr-4 py-4 text-base bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 outline-none focus:border-brand-500 dark:text-white"
            />
          </div>

          {searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl max-h-80 overflow-y-auto text-left py-2 z-50">
              {searchResults.map((tool) => (
                <Link
                  key={tool.id}
                  href={`/tools/${tool.slug}`}
                  className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-between group transition-colors"
                >
                  <div>
                    <div className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-brand-600">
                      {tool.canonicalName}
                    </div>
                    <div className="text-xs text-slate-500">{tool.shortDescription}</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-brand-600" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Global Job Engine Banner */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-brand-950 to-indigo-950 p-6 sm:p-8 text-white shadow-2xl border border-brand-800/40">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 border border-brand-400/30 text-xs font-semibold">
              <Briefcase className="w-3.5 h-3.5 text-brand-400" />
              <span>1-Click Live Global Job Finder Engine</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              Find Jobs by City, Country & Industry 💼
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Live crawler indexing Global Govt Civil Service Portals (USA, UK, UAE, Saudi Arabia, Canada, EU, India, Pakistan), Banks, Tech, Medical & Remote jobs worldwide.
            </p>
          </div>
          <Link
            href="/tools/global-job-finder"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm transition-all shadow-lg shadow-brand-600/30 hover:scale-105 active:scale-95 whitespace-nowrap"
          >
            <span>Find Jobs Now</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Privacy Guarantee Section */}
      <section className="bg-gradient-to-r from-brand-600 to-indigo-700 text-white rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 text-center sm:text-left">
          <div className="flex items-center gap-2 justify-center sm:justify-start font-bold text-lg">
            <ShieldCheck className="w-6 h-6 text-emerald-300" />
            <span>Browser Privacy Guarantee</span>
          </div>
          <p className="text-sm text-blue-100 max-w-xl">
            Your files and documents stay entirely inside your web browser memory. No files are uploaded to any cloud server for client-side tools.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-xl text-xs font-semibold border border-white/20">
          <Lock className="w-4 h-4 text-emerald-300" />
          <span>Zero Server Storage</span>
        </div>
      </section>

      {/* Popular Tools Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Most Popular Tools</h2>
            <p className="text-xs text-slate-500">Frequently used utilities by millions of users daily.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {popularTools.map((tool) => (
            <Link
              key={tool.id}
              href={`/tools/${tool.slug}`}
              className="tool-card group flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-lg bg-brand-50 dark:bg-slate-800 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold">
                    <Zap className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] uppercase font-semibold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                    {tool.processingMode}
                  </span>
                </div>
                <h3 className="font-semibold text-base text-slate-900 dark:text-white group-hover:text-brand-600 transition-colors">
                  {tool.canonicalName}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2">{tool.shortDescription}</p>
              </div>

              <div className="pt-4 flex items-center gap-1 text-xs font-semibold text-brand-600 dark:text-brand-400">
                <span>Use Tool</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Browse By Categories */}
      <section className="space-y-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Browse All Categories</h2>
          <p className="text-xs text-slate-500">Explore tools organized by domain and workflow.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="tool-card hover:border-brand-500/80 transition-all flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="font-bold text-base text-slate-900 dark:text-white">{cat.name}</div>
                <p className="text-xs text-slate-500">{cat.description}</p>
              </div>
              <div className="pt-4 text-xs font-semibold text-brand-600 flex items-center gap-1">
                <span>View Category Tools</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
