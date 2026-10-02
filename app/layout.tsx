import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://toolverse.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'ToolVerse — 95+ Free Online Utility Tools & Global Job Finder',
    template: '%s | ToolVerse'
  },
  description: '100% free, browser-private online tools for PDFs, image compression, calculators, writing & grammar checks, developer tools, and global live job finder.',
  keywords: [
    'free online tools',
    'pdf merger',
    'image compressor',
    'word counter',
    'grammar checker',
    'job finder engine',
    'indeed job search',
    'linkedin jobs',
    'zakat calculator',
    'tax calculator',
    'json formatter',
    'qr code generator'
  ],
  authors: [{ name: 'ToolVerse Engineering Team' }],
  creator: 'ToolVerse Platform',
  publisher: 'ToolVerse Inc.',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: 'ToolVerse — 95+ Free Online Utility Tools & Global Job Finder',
    description: 'Fast, browser-private tools for files, PDFs, image optimization, writing checks, calculators, and global job search.',
    url: siteUrl,
    siteName: 'ToolVerse',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'ToolVerse Platform Preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ToolVerse — 95+ Free Online Utility Tools & Global Job Finder',
    description: '100% free online utility tools & global job search engine. Zero server storage, browser private.',
    creator: '@toolverse',
    images: [`${siteUrl}/og-image.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen flex flex-col bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100 antialiased selection:bg-brand-500 selection:text-white">
        <Header />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
