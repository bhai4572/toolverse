# ToolVerse — Production Utility Tools Platform

**ToolVerse** is a world-class, fast, clean, privacy-first online tools platform designed for files, images, PDFs, calculators, students, creators, developers, and businesses worldwide.

> **Privacy-First Guarantee:** Most browser tools process your files directly inside your client browser session using WebAssembly, Web Crypto API, and Web Canvas. Your files are **never** uploaded to cloud servers for client processing tools.

---

## 🚀 Key Features

- **94+ Production-Ready Live & Server Tools:** Image compressors, PDF mergers, format converters, algebra equation solvers, JWT decoders, IPv4 subnet calculators, ATS resume checkers, electricity bill estimators, solar system calculators, Daraz seller fee calculators, and writing & academic integrity tools.
- **Strict Academic Integrity Policy:** Zero AI-detector bypass, zero Turnitin evasion, zero fake plagiarism scores. Mandatory consent and ethical disclaimers on all rephrasing and similarity tools.
- **Zero Mock UI / Zero Fake Data:** Every tool marked "Live" performs real processing end-to-end.
- **Cloudflare Integration:** Full support for Cloudflare Pages, Cloudflare Workers backend, and D1/KV storage for URL shortener.
- **Automatic Instant Search:** Client-side search index supporting synonyms, KB target presets, and aliases.
- **Responsive & Dark Mode:** Clean utility-site UI built with Next.js App Router, TypeScript, and Tailwind CSS.
- **Automated Test Suite:** Vitest unit test suite covering math formulas, text algorithms, tax rules, readability metrics, and URL validation.

---

## 🛠️ Tech Stack

- **Framework:** Next.js (App Router, TypeScript Strict Mode)
- **Styling:** Tailwind CSS, PostCSS, Autoprefixer
- **Icons:** Lucide React (`lucide-react`)
- **PDF Engines:** `pdf-lib`, `jsPDF`
- **Image Engines:** `browser-image-compression`, `heic2any`, Web Canvas
- **Utilities:** `qrcode`, `papaparse`, `decimal.js`, `date-fns`, `diff`
- **Backend / DB:** Cloudflare Worker, D1 / KV database, Next.js API Routes
- **Testing:** Vitest

---

## 💻 Local Setup Instructions

### Prerequisites
- **Node.js:** v18+ or v20+ (v22 tested)
- **Package Manager:** npm or pnpm

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-org/toolverse.git
cd toolverse
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Running Automated Tests

Run the Vitest unit test suite:
```bash
npm test
```

---

## 📦 Production Build & Deployment

### Build Next.js Static / SSR Bundle
```bash
npm run build
```

### Cloudflare Pages Deployment
1. Connect repository to Cloudflare Pages.
2. Set Build Command: `npx @cloudflare/next-on-pages` or `npm run build`.
3. Set Output Directory: `.vercel/output/static` or `.next`.
4. Configure Environment Variables from `.env.example`.

---

## 📜 License

MIT License. Designed & Developed for ToolVerse.
