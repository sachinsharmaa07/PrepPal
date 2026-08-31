'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, SlidersHorizontal, Loader2, MapPin, Briefcase, Clock, DollarSign, ChevronDown, RefreshCw, CheckCircle2, X } from 'lucide-react';
import { AILabel } from '@/components/ui/AILabel';
import { getStoredUser, getToken } from '@/lib/auth';

type Job = {
  id: string;
  title: string;
  location: string | null;
  isRemote: boolean;
  tenure: string;
  salaryMin: number | null;
  salaryMax: number | null;
  status: string;
  createdAt: string;
  deadline: string | null;
  skills: string[];
  description: string;
  company: { name: string; logoUrl: string | null; industry: string | null };
  _count: { applications: number };
};

const TENURE_OPTIONS = [
  { value: '', label: 'All Types' },
  { value: 'FULL_TIME', label: 'Full-time' },
  { value: 'PART_TIME', label: 'Part-time' },
  { value: 'CONTRACT', label: 'Contract' },
  { value: 'INTERNSHIP', label: 'Internship' },
];

const SORT_OPTIONS = [
  { value: 'createdAt', label: 'Most Recent' },
  { value: 'salary_desc', label: 'Salary (High → Low)' },
  { value: 'salary_asc', label: 'Salary (Low → High)' },
];

const tenureColors: Record<string, string> = {
  FULL_TIME: 'bg-primary/10 text-primary border-primary/20',
  PART_TIME: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  CONTRACT: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  INTERNSHIP: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
};

const tenureLabel: Record<string, string> = {
  FULL_TIME: 'Full-time', PART_TIME: 'Part-time', CONTRACT: 'Contract', INTERNSHIP: 'Internship',
};

function formatSalary(min?: number | null, max?: number | null) {
  if (!min && !max) return null;
  if (min && max) return `₹${min}–${max} LPA`;
  if (min) return `From ₹${min} LPA`;
  return `Up to ₹${max} LPA`;
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return 'Yesterday';
  return `${days}d ago`;
}

export default function JobsDiscoveryPage() {
  const user = getStoredUser();
  const token = getToken();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [tenure, setTenure] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [location, setLocation] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [appliedJobs, setAppliedJobs] = useState<Set<string>>(new Set());
  const [applyingTo, setApplyingTo] = useState<string | null>(null);
  const [expandedJob, setExpandedJob] = useState<string | null>(null);

  const fetchJobs = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('status', 'PUBLISHED');
      params.set('sortBy', sortBy);
      if (tenure) params.set('tenure', tenure);
      if (location) params.set('location', location);

      const res = await fetch(`/api/jobs?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setJobs(data.data.jobs || []);
        setTotal(data.data.total || 0);
      } else {
        // Fallback to mock data if API not available
        setJobs([]);
        setTotal(0);
      }
    } catch {
      setJobs([]);
      setTotal(0);
    } finally {
      setIsLoading(false);
    }
  }, [tenure, sortBy, location]);

  useEffect(() => {
    fetchJobs();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchJobs, 30000);
    return () => clearInterval(interval);
  }, [fetchJobs]);

  const handleApply = async (jobId: string) => {
    if (!user) return alert('Please log in to apply.');
    setApplyingTo(jobId);
    try {
      const res = await fetch(`/api/jobs/${jobId}/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ userId: user.id }),
      });
      const data = await res.json();
      if (data.success) {
        setAppliedJobs(prev => new Set(prev).add(jobId));
      } else if (data.error?.code === 'CONFLICT') {
        setAppliedJobs(prev => new Set(prev).add(jobId)); // already applied
      }
    } catch {
      setAppliedJobs(prev => new Set(prev).add(jobId)); // optimistic update on error
    } finally {
      setApplyingTo(null);
    }
  };

  // Client-side search filter
  const filtered = jobs.filter(job => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      job.title.toLowerCase().includes(q) ||
      job.company.name.toLowerCase().includes(q) ||
      job.skills.some(s => s.toLowerCase().includes(q)) ||
      (job.location || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight flex items-center gap-3">
            Job Board
            <AILabel>AI Matched</AILabel>
          </h1>
          <p className="text-muted-foreground mt-1">
            {total > 0 ? `${total} positions available` : 'Discover your next opportunity'}
          </p>
        </div>
        <button
          onClick={fetchJobs}
          disabled={isLoading}
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Search + Filters Bar */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search jobs, companies, skills..."
            className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/20"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Tenure Filter */}
        <div className="relative">
          <select
            value={tenure}
            onChange={e => setTenure(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2 bg-card border border-border rounded-xl text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
          >
            {TENURE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
        </div>

        {/* Sort */}
        <div className="relative">
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2 bg-card border border-border rounded-xl text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
          >
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
        </div>

        {/* Location filter */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm transition-colors ${showFilters ? 'bg-primary/10 border-primary/30 text-primary' : 'border-border text-muted-foreground hover:text-foreground hover:bg-muted'}`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
        </button>
      </div>

      {/* Location filter expanded */}
      {showFilters && (
        <div className="p-4 rounded-xl border border-border bg-card/50 flex items-center gap-4">
          <label className="text-sm font-medium text-foreground whitespace-nowrap">Location:</label>
          <input
            type="text"
            value={location}
            onChange={e => setLocation(e.target.value)}
            placeholder="e.g. Bangalore, Remote..."
            className="flex-1 px-3 py-1.5 bg-background border border-border rounded-lg text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/20"
          />
          {location && <button onClick={() => setLocation('')} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>}
        </div>
      )}

      {/* Job List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24">
          <Briefcase className="w-10 h-10 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground">
            {jobs.length === 0
              ? 'No jobs posted yet. Check back soon!'
              : 'No jobs match your filters.'}
          </p>
          {jobs.length === 0 && (
            <p className="text-xs text-muted-foreground mt-2">
              Recruiters can post jobs from the Recruiter Dashboard.
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(job => {
            const salary = formatSalary(job.salaryMin, job.salaryMax);
            const hasApplied = appliedJobs.has(job.id);
            const isExpanded = expandedJob === job.id;
            const tenureBadge = tenureColors[job.tenure] || 'bg-muted text-muted-foreground border-transparent';

            return (
              <div
                key={job.id}
                className="rounded-2xl border border-border bg-card/40 hover:bg-card/70 transition-all hover:border-primary/20 hover:shadow-[0_0_20px_rgba(99,102,241,0.05)]"
              >
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    {/* Left: Job info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap mb-1">
                        <h3 className="text-base font-semibold text-foreground">{job.title}</h3>
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${tenureBadge}`}>
                          {tenureLabel[job.tenure] || job.tenure}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">{job.company.name}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                        {(job.location || job.isRemote) && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {job.isRemote ? (job.location ? `${job.location} / Remote` : 'Remote') : job.location}
                          </span>
                        )}
                        {salary && (
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-3 h-3" />
                            {salary}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {timeAgo(job.createdAt)}
                        </span>
                        <span className="text-muted-foreground/60">{job._count.applications} applicant{job._count.applications !== 1 ? 's' : ''}</span>
                      </div>
                      {/* Skills */}
                      {job.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {job.skills.slice(0, 6).map(skill => (
                            <span key={skill} className="px-2 py-0.5 text-[11px] font-medium rounded-md bg-muted text-muted-foreground">
                              {skill}
                            </span>
                          ))}
                          {job.skills.length > 6 && (
                            <span className="px-2 py-0.5 text-[11px] rounded-md bg-muted text-muted-foreground">+{job.skills.length - 6}</span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Right: Actions */}
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      {hasApplied ? (
                        <div className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 text-sm font-medium border border-emerald-500/20">
                          <CheckCircle2 className="w-4 h-4" />
                          Applied
                        </div>
                      ) : (
                        <button
                          onClick={() => handleApply(job.id)}
                          disabled={applyingTo === job.id}
                          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 disabled:opacity-60 transition-all shadow-[0_0_10px_rgba(99,102,241,0.2)]"
                        >
                          {applyingTo === job.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                          Apply Now
                        </button>
                      )}
                      <button
                        onClick={() => setExpandedJob(isExpanded ? null : job.id)}
                        className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {isExpanded ? 'Show less' : 'View details'}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Description */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-border space-y-3">
                      <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                        {job.description}
                      </p>
                      {job.deadline && (
                        <p className="text-xs text-amber-400">
                          Application deadline: {new Date(job.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
