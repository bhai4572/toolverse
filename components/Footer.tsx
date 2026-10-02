import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Wrench, Lock, Heart } from 'lucide-react';
import { CATEGORIES, TOOLS } from '@/lib/tools/registry';

export function Footer() {
  return (
    <footer className="mt-auto bg-slate-900 text-slate-400 text-sm border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Column */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl text-white">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
                <Wrench className="w-4 h-4" />
              </div>
              <span>ToolVerse</span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              {TOOLS.length}+ free and privacy-first online utilities for files, images, PDFs, writing &amp; academic integrity, calculators, developers, and creators worldwide.
            </p>
            <div className="inline-flex items-center gap-2 text-xs font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-3 py-1.5 rounded-full">
              <ShieldCheck className="w-4 h-4" />
              <span>Files processed locally in browser</span>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Tool Categories</h4>
            <ul className="space-y-2 text-xs">
              {CATEGORIES.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <Link href={`/category/${cat.slug}`} className="hover:text-white transition-colors">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4">More Categories</h4>
            <ul className="space-y-2 text-xs">
              {CATEGORIES.slice(6).map((cat) => (
                <li key={cat.id}>
                  <Link href={`/category/${cat.slug}`} className="hover:text-white transition-colors">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Trust */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Trust & Legal</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/legal/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/legal/terms-of-use" className="hover:text-white transition-colors">Terms of Use</Link></li>
              <li><Link href="/legal/disclaimer" className="hover:text-white transition-colors">Disclaimer</Link></li>
              <li><Link href="/legal/cookie-policy" className="hover:text-white transition-colors">Cookie Policy</Link></li>
              <li><Link href="/legal/dmca" className="hover:text-white transition-colors">DMCA / Copyright</Link></li>
              <li><Link href="/legal/security" className="hover:text-white transition-colors">Security & Responsible Disclosure</Link></li>
              <li><Link href="/legal/about" className="hover:text-white transition-colors">About ToolVerse</Link></li>
              <li><Link href="/legal/contact" className="hover:text-white transition-colors">Contact Support</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div>
            © {new Date().getFullYear()} ToolVerse. All rights reserved. Zero mock data.
          </div>
          <div className="flex items-center gap-4 text-slate-500">
            <span>Client-side WebAssembly & Web Crypto</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
