'use client';

import React, { useState, useEffect } from 'react';
import { 
  JobListing, 
  JobFilterParams, 
  GLOBAL_MASTER_JOBS_DATABASE 
} from '@/lib/jobs/jobEngine';
import { 
  Search, 
  MapPin, 
  Globe, 
  Briefcase, 
  Building2, 
  Filter, 
  Sparkles, 
  ExternalLink, 
  Bookmark, 
  BookmarkCheck, 
  Share2, 
  DollarSign, 
  Clock, 
  RefreshCw, 
  CheckCircle2, 
  X, 
  ShieldCheck,
  ChevronRight,
  Flame,
  Award,
  Landmark
} from 'lucide-react';

const POPULAR_COUNTRIES = [
  { code: 'all', name: 'All Countries 🌐' },
  { code: 'Pakistan', name: 'Pakistan 🇵🇰' },
  { code: 'United States', name: 'United States 🇺🇸' },
  { code: 'United Kingdom', name: 'United Kingdom 🇬🇧' },
  { code: 'United Arab Emirates', name: 'United Arab Emirates 🇦🇪' },
  { code: 'Saudi Arabia', name: 'Saudi Arabia 🇸🇦' },
  { code: 'Canada', name: 'Canada 🇨🇦' },
  { code: 'Germany', name: 'Germany 🇩🇪' },
  { code: 'India', name: 'India 🇮🇳' },
  { code: 'Remote', name: 'Global Remote 🚀' }
];

const SECTORS = [
  'All',
  'Government & Public',
  'Banking & Finance',
  'Software & IT',
  'Medical & Healthcare',
  'Civil & Engineering',
  'Education & Teaching',
  'Customer Support & BPO',
  'Sales & Marketing',
  'Skilled Trades & Admin'
];

const JOB_TYPES = ['All', 'Full-Time', 'Part-Time', 'Contract', 'Internship', 'Remote'];

export function JobFinderTool() {
  const [query, setQuery] = useState('');
  const [city, setCity] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [selectedSector, setSelectedSector] = useState('All');
  const [selectedJobType, setSelectedJobType] = useState('All');
  const [isRemoteOnly, setIsRemoteOnly] = useState(false);
  const [isGovernmentOnly, setIsGovernmentOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'latest' | 'relevance'>('latest');

  const [jobs, setJobs] = useState<JobListing[]>(GLOBAL_MASTER_JOBS_DATABASE || []);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobListing | null>(null);
  const [savedJobIds, setSavedJobIds] = useState<string[]>([]);
  const [copiedToast, setCopiedToast] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<string>('Just now');

  // Load saved bookmarked jobs from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('toolverse_saved_jobs');
      if (stored) {
        setSavedJobIds(JSON.parse(stored));
      }
    } catch (e) {}
  }, []);

  // Fetch jobs from server API
  const handleSearch = async (overrideParams?: Partial<JobFilterParams>) => {
    setIsLoading(true);
    try {
      const q = overrideParams?.query !== undefined ? overrideParams.query : query;
      const c = overrideParams?.city !== undefined ? overrideParams.city : city;
      const cntry = overrideParams?.country !== undefined ? overrideParams.country : selectedCountry;
      const sec = overrideParams?.sector !== undefined ? overrideParams.sector : selectedSector;
      const jt = overrideParams?.jobType !== undefined ? overrideParams.jobType : selectedJobType;
      const rem = overrideParams?.isRemoteOnly !== undefined ? overrideParams.isRemoteOnly : isRemoteOnly;
      const gov = overrideParams?.isGovernmentOnly !== undefined ? overrideParams.isGovernmentOnly : isGovernmentOnly;

      const url = `/api/jobs?q=${encodeURIComponent(q)}&city=${encodeURIComponent(c)}&country=${encodeURIComponent(cntry)}&sector=${encodeURIComponent(sec)}&jobType=${encodeURIComponent(jt)}&isRemoteOnly=${rem}&isGovernmentOnly=${gov}&sortBy=${sortBy}`;
      
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data.jobs && Array.isArray(data.jobs)) {
          setJobs(data.jobs);
        }
      }
    } catch (err) {
      console.error('Job fetch error:', err);
    } finally {
      setIsLoading(false);
      setLastRefreshed(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }
  };

  useEffect(() => {
    handleSearch();
  }, [selectedCountry, selectedSector, selectedJobType, isRemoteOnly, isGovernmentOnly, sortBy]);

  const toggleBookmark = (jobId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    let updated: string[];
    if (savedJobIds.includes(jobId)) {
      updated = savedJobIds.filter(id => id !== jobId);
    } else {
      updated = [...savedJobIds, jobId];
    }
    setSavedJobIds(updated);
    try {
      localStorage.setItem('toolverse_saved_jobs', JSON.stringify(updated));
    } catch (e) {}
  };

  const handleShareJob = (job: JobListing, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(job.url);
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 2500);
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Search Header */}
      <div className="relative rounded-2xl bg-gradient-to-br from-slate-900 via-brand-950 to-indigo-950 p-6 md:p-8 text-white shadow-xl overflow-hidden border border-brand-800/30">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-6 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 border border-brand-400/30 text-brand-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-brand-400" />
            <span>AI-Powered Global & Regional Multi-Source Job Engine</span>
          </div>

          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
              Find Jobs by City, Country, Sector & Role 💼
            </h2>
            <p className="text-slate-300 text-sm mt-1">
              Live crawler indexing Global Govt Civil Service Portals (USAJobs 🇺🇸, UK Civil Service 🇬🇧, UAE Govt 🇦🇪, Saudi Vision 2030 🇸🇦, Canada GC 🇨🇦, EU Careers 🇪🇺, India UPSC 🇮🇳, Pakistan PPSC 🇵🇰), Banks, IT, Hospitals, & Remote jobs worldwide.
            </p>
          </div>

          {/* Search Bar Row */}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSearch(); }}
            className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-white/10 backdrop-blur-md p-2.5 rounded-xl border border-white/15 shadow-2xl"
          >
            {/* Job Title / Keyword Input */}
            <div className="sm:col-span-5 relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Job title, skill, or department (e.g. Teacher, Nurse, Accountant, Civil Engineer, React)..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-slate-900/80 border border-slate-700/80 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            {/* City / Location Input */}
            <div className="sm:col-span-4 relative">
              <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="City (e.g. Lahore, Karachi, Islamabad, Dubai, Riyadh, London)..."
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-slate-900/80 border border-slate-700/80 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            {/* Search Button */}
            <div className="sm:col-span-3">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-full py-2.5 px-4 rounded-lg bg-brand-600 hover:bg-brand-500 active:scale-95 text-white font-medium text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-brand-600/30"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Crawling...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>Search Jobs</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick Country Filters */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs text-slate-400 font-medium mr-1">Countries:</span>
            {POPULAR_COUNTRIES.map((c) => (
              <button
                key={c.code}
                type="button"
                onClick={() => { setSelectedCountry(c.code); handleSearch({ country: c.code }); }}
                className={`text-xs px-2.5 py-1 rounded-md transition ${
                  selectedCountry === c.code 
                    ? 'bg-brand-500 text-white font-semibold shadow-sm' 
                    : 'bg-white/10 hover:bg-white/20 text-slate-300'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sector Filter Bar */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Browse Industry Sectors:
          </span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {SECTORS.map((sec) => (
            <button
              key={sec}
              onClick={() => setSelectedSector(sec)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                selectedSector === sec
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {sec}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
        
        {/* Job Type Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mr-1">Type:</span>
          {JOB_TYPES.map((jt) => (
            <button
              key={jt}
              onClick={() => setSelectedJobType(jt)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition whitespace-nowrap ${
                selectedJobType === jt
                  ? 'bg-slate-900 text-white dark:bg-brand-600 dark:text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {jt}
            </button>
          ))}
        </div>

        {/* Toggles & Refresh */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Govt Toggle */}
          <label className="flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-amber-700 dark:text-amber-400">
            <input
              type="checkbox"
              checked={isGovernmentOnly}
              onChange={(e) => setIsGovernmentOnly(e.target.checked)}
              className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-slate-300"
            />
            <span className="flex items-center gap-1">
              <Landmark className="w-3.5 h-3.5 text-amber-500" />
              Govt Jobs Only
            </span>
          </label>

          {/* Remote Toggle */}
          <label className="flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
            <input
              type="checkbox"
              checked={isRemoteOnly}
              onChange={(e) => setIsRemoteOnly(e.target.checked)}
              className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 border-slate-300"
            />
            <span className="flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-brand-500" />
              Remote Only
            </span>
          </label>

          {/* Refresh Button */}
          <button
            onClick={() => handleSearch()}
            title="Crawl latest jobs from web APIs"
            className="p-1.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Results Count */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
        <div>
          Showing <span className="font-bold text-slate-900 dark:text-white">{(jobs || []).length}</span> live active job opportunities
          {selectedCountry !== 'all' && <span> in <strong className="text-brand-600 dark:text-brand-400">{selectedCountry}</strong></span>}
          {selectedSector !== 'All' && <span> ({selectedSector})</span>}
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" />
          <span>Last indexed: {lastRefreshed}</span>
        </div>
      </div>

      {/* Toast alert */}
      {copiedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-xl flex items-center gap-2 transition animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>Job link copied to clipboard!</span>
        </div>
      )}

      {/* Job Cards Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 animate-pulse space-y-3">
              <div className="flex justify-between">
                <div className="w-10 h-10 bg-slate-200 dark:bg-slate-800 rounded-lg" />
                <div className="w-16 h-6 bg-slate-200 dark:bg-slate-800 rounded-full" />
              </div>
              <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
              <div className="h-10 bg-slate-100 dark:bg-slate-800/50 rounded" />
            </div>
          ))}
        </div>
      ) : (jobs || []).length === 0 ? (
        <div className="text-center py-12 p-8 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-500 flex items-center justify-center mx-auto">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">No jobs found matching these exact criteria</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
              Try searching with broader terms or select "All Countries" and "All Sectors".
            </p>
          </div>
          <button
            onClick={() => { setQuery(''); setCity(''); setSelectedCountry('all'); setSelectedSector('All'); setSelectedJobType('All'); setIsRemoteOnly(false); setIsGovernmentOnly(false); }}
            className="px-4 py-2 rounded-lg bg-brand-600 text-white text-xs font-semibold hover:bg-brand-500 transition"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(jobs || []).map((job) => {
            const isBookmarked = savedJobIds.includes(job.id);
            return (
              <div
                key={job.id}
                onClick={() => setSelectedJob(job)}
                className="group relative cursor-pointer p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-500 dark:hover:border-brand-500 hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  {/* Card Top Header */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      {job.companyLogo ? (
                        <img 
                          src={job.companyLogo} 
                          alt={job.company} 
                          className="w-10 h-10 rounded-lg object-contain bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700" 
                          onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-800 flex items-center justify-center font-bold text-base shrink-0">
                          {job.company.charAt(0).toUpperCase()}
                        </div>
                      )}

                      <div>
                        <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                          <Building2 className="w-3 h-3" />
                          <span>{job.company}</span>

                          {job.isGovernment && (
                            <span className="px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-extrabold text-[10px]">
                              GOVT
                            </span>
                          )}
                          {job.isUrgent && (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 font-extrabold text-[10px]">
                              <Flame className="w-2.5 h-2.5 fill-rose-500" />
                              URGENT
                            </span>
                          )}
                        </div>

                        <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition line-clamp-1 mt-0.5">
                          {job.title}
                        </h3>
                      </div>
                    </div>

                    {/* Bookmark & Share Buttons */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={(e) => handleShareJob(job, e)}
                        title="Share Job"
                        className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => toggleBookmark(job.id, e)}
                        title={isBookmarked ? "Remove Bookmark" : "Save Job"}
                        className="p-1.5 text-slate-400 hover:text-brand-600 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                      >
                        {isBookmarked ? (
                          <BookmarkCheck className="w-4 h-4 text-brand-600 fill-brand-600 dark:text-brand-400 dark:fill-brand-400" />
                        ) : (
                          <Bookmark className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Location & Tags */}
                  <div className="flex flex-wrap items-center gap-1.5 mb-3 text-xs">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                      <MapPin className="w-3 h-3 text-brand-500" />
                      {job.location}
                    </span>

                    <span className={`px-2 py-0.5 rounded font-medium ${
                      job.isRemote 
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' 
                        : 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                    }`}>
                      {job.jobType}
                    </span>

                    {job.salary && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 font-medium border border-amber-200 dark:border-amber-800">
                        <DollarSign className="w-3 h-3" />
                        {job.salary}
                      </span>
                    )}
                  </div>

                  {/* Description snippet */}
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
                    {job.description}
                  </p>
                </div>

                {/* Card Footer */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium text-[11px]">
                    Posted: {job.postedDate} • Valid till {job.expiresAt}
                  </span>
                  <span className="inline-flex items-center gap-1 text-brand-600 dark:text-brand-400 font-bold group-hover:translate-x-0.5 transition-transform">
                    View & Apply
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detailed View Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between gap-4 bg-slate-50/50 dark:bg-slate-900/50">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-brand-600 text-white font-bold text-xl flex items-center justify-center shrink-0 shadow-md">
                  {selectedJob.company.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900 dark:text-white leading-snug">
                    {selectedJob.title}
                  </h2>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium flex items-center gap-2 mt-1">
                    <span>{selectedJob.company}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-brand-500" />{selectedJob.location}</span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedJob(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-700 dark:text-slate-300">
              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 text-xs font-semibold border border-brand-200 dark:border-brand-800">
                  {selectedJob.jobType}
                </span>
                <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold">
                  Sector: {selectedJob.sector}
                </span>
                {selectedJob.salary && (
                  <span className="px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-xs font-semibold border border-amber-200 dark:border-amber-800">
                    💰 {selectedJob.salary}
                  </span>
                )}
                {selectedJob.isGovernment && (
                  <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-semibold border border-emerald-200 dark:border-emerald-800">
                    🏛️ Official Government Vacancy
                  </span>
                )}
              </div>

              {/* Description */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">
                  Job Description & Official Details
                </h4>
                <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-line text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-950/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                  {selectedJob.description}
                </p>
              </div>

              {/* Skill Tags */}
              {selectedJob.tags && selectedJob.tags.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">
                    Key Keywords & Tags
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedJob.tags.map((tag) => (
                      <span key={tag} className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer / Apply Actions */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/80 flex items-center justify-between flex-wrap gap-3">
              <button
                onClick={(e) => toggleBookmark(selectedJob.id, e)}
                className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold flex items-center gap-1.5 transition"
              >
                {savedJobIds.includes(selectedJob.id) ? (
                  <>
                    <BookmarkCheck className="w-4 h-4 text-brand-600" />
                    <span>Saved</span>
                  </>
                ) : (
                  <>
                    <Bookmark className="w-4 h-4" />
                    <span>Save Job</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-2">
                <a
                  href={`https://www.google.com/search?q=${encodeURIComponent(selectedJob.title)}+${encodeURIComponent(selectedJob.company)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-800 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Search Online</span>
                </a>

                <a
                  href={selectedJob.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 active:scale-95 text-white text-xs font-bold flex items-center gap-2 transition shadow-md shadow-brand-600/30"
                >
                  <span>Apply on Official Portal</span>
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
