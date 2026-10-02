import React from 'react';
import { notFound } from 'next/navigation';
import { Breadcrumb } from '@/components/Breadcrumb';
import type { Metadata } from 'next';

const LEGAL_PAGES: Record<string, { title: string; content: string }> = {
  'privacy-policy': {
    title: 'Privacy Policy',
    content: `
      <h2>1. Privacy-First Commitment</h2>
      <p>At ToolVerse, privacy is built directly into our application architecture. Most tools (including PDF merger, image compressor, format converters, and calculators) process your files locally within your client browser. Your files, documents, and images are never transmitted or saved to external servers.</p>
      
      <h2>2. Information Collection</h2>
      <p>We do not require user accounts for basic tool usage. We do not track personal identifying information. Aggregate technical logs (such as HTTP request counts and rate limiting metrics) are maintained strictly for network stability and abuse prevention.</p>
      
      <h2>3. Local Storage & Cookies</h2>
      <p>Certain preferences (such as dark mode theme, recent tools history, and saved short link records) are stored locally in your web browser's LocalStorage. You can clear this data at any time via your browser settings.</p>

      <h2>4. Google AdSense & Third-Party Advertising</h2>
      <p>ToolVerse uses Google AdSense and third-party advertising partners to serve ads when you visit our website. Google, as a third-party vendor, uses cookies (including DART cookies) to serve ads based on your visit to ToolVerse and other websites on the Internet. Users may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">Google Ads Settings</a> or <a href="https://www.aboutads.info/" target="_blank" rel="noopener noreferrer">AboutAds.info</a>.</p>

      <h2>5. Infrastructure & Security Services</h2>
      <p>We utilize privacy-respecting CDN and infrastructure providers (such as Cloudflare & Vercel) to deliver fast static assets and defend against malicious DDoS attacks.</p>
    `,
  },
  'terms-of-use': {
    title: 'Terms of Use',
    content: `
      <h2>1. Acceptance of Terms</h2>
      <p>By accessing and using ToolVerse, you agree to comply with all applicable local, national, and international laws and regulations.</p>

      <h2>2. Permitted Use</h2>
      <p>ToolVerse provides free web utility tools for personal, educational, professional, and commercial workflows. You agree not to misuse the platform for automated scraping, spam generation, malicious URL shortening, or launching denial-of-service attacks.</p>

      <h2>3. Disclaimer of Warranties</h2>
      <p>Tools are provided "as is" without warranty of any kind. Financial calculators, tax estimators, and conversions are provided for estimation and educational purposes only.</p>
    `,
  },
  'disclaimer': {
    title: 'Disclaimer',
    content: `
      <h2>Educational & Estimation Purpose Only</h2>
      <p>All calculators, financial estimators (such as Pakistan Salary Tax, Zakat, Loan EMI, and AdSense Revenue Estimators) provided on ToolVerse generate estimates based on standard formula inputs and published tax slabs. They do not constitute formal financial, tax, or legal advice. Always confirm final tax and financial obligations with qualified professionals or official tax authority portals.</p>
    `,
  },
  'cookie-policy': {
    title: 'Cookie Policy',
    content: `
      <h2>Minimal Cookie Usage</h2>
      <p>ToolVerse uses essential cookies and browser LocalStorage strictly required for website functionality (such as remembering theme preference and rate-limiting guest requests). We do not place invasive tracking cookies.</p>
    `,
  },
  'dmca': {
    title: 'DMCA / Copyright Policy',
    content: `
      <h2>Copyright Respect</h2>
      <p>ToolVerse respects intellectual property rights. Because client tools process files locally inside user browser memory, ToolVerse does not host or store user media files. If you believe any static page or link on ToolVerse infringes your copyright, please contact our abuse team at support@toolverse.com.</p>
    `,
  },
  'security': {
    title: 'Security & Responsible Disclosure',
    content: `
      <h2>Security Architecture</h2>
      <p>We implement strict Content Security Policies (CSP), secure HTTP headers, Web Crypto API cryptography, Zod validation, and rate-limiting defenses. If you discover a security vulnerability, please report it responsibly to security@toolverse.com.</p>
    `,
  },
  'about': {
    title: 'About ToolVerse',
    content: `
      <h2>Our Mission</h2>
      <p>ToolVerse was built to provide a world-class, clean, fast, and privacy-first global utility platform. We believe everyday file, image, text, and calculator tasks should be effortless, free, and completely private.</p>
    `,
  },
  'contact': {
    title: 'Contact Support',
    content: `
      <h2>Get in Touch</h2>
      <p>Have questions, feedback, or tool requests? Reach out to our technical team at support@toolverse.com or submit a report via our official portal.</p>
    `,
  },
  'changelog': {
    title: 'Platform Changelog',
    content: `
      <h2>v1.0.0 — Production Release</h2>
      <p>Initial production launch of ToolVerse featuring 40 priority live client tools, URL shortener backend, tax calculation engine, and responsive utility design system.</p>
    `,
  },
};

export async function generateStaticParams() {
  return Object.keys(LEGAL_PAGES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const page = LEGAL_PAGES[params.slug];
  if (!page) return { title: 'Page Not Found — ToolVerse' };

  return {
    title: `${page.title} — ToolVerse`,
  };
}

export default function LegalPage({ params }: { params: { slug: string } }) {
  const page = LEGAL_PAGES[params.slug];
  if (!page) notFound();

  return (
    <div className="max-w-3xl mx-auto py-6 space-y-6">
      <Breadcrumb items={[{ label: page.title }]} />
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{page.title}</h1>
      <div
        className="prose dark:prose-invert max-w-none text-sm leading-relaxed space-y-4"
        dangerouslySetInnerHTML={{ __html: page.content }}
      />
    </div>
  );
}
