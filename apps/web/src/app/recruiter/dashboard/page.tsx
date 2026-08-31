'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Plus, Briefcase, Users, Eye, Clock, CheckCircle2,
  XCircle, TrendingUp, ChevronRight, Loader2, Pencil, Trash2
} from 'lucide-react';
import { getStoredUser, getToken } from '@/lib/auth';

type Job = {
  id: string;
  title: string;
  location: string | null;
  tenure: string;
  salaryMin: number | null;
  salaryMax: number | null;
  status: string;
  createdAt: string;
  isRemote: boolean;
  _count: { applications: number };
};

type StatusBadge = { label: string; className: string };
const statusMap: Record<string, StatusBadge> = {
  PUBLISHED:  { label: 'Live',    className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  CLOSED:     { label: 'Closed',  className: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
  DRAFT:      { label: 'Draft',   className: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
};

const tenureLabel: Record<string, string> = {
  FULL_TIME: 'Full-time', PART_TIME: 'Part-time', CONTRACT: 'Contract', INTERNSHIP: 'Internship',
};

function formatSalary(min?: number | null, max?: number | null) {
  if (!min && !max) return 'Not specified';
  if (min && max) return `₹${min}–${max} LPA`;
  if (min) return `From ₹${min} LPA`;
  return `Up to ₹${max} LPA`;
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  return `${days}d ago`;
}

export default function RecruiterDashboardPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [company, setCompany] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const user = getStoredUser();
  const token = getToken();

  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const userId = user?.id;
      const res = await fetch(`/api/recruiter/jobs?userId=${userId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      if (data.success) {
        setJobs(data.data.jobs || []);
        setCompany(data.data.company || null);
      }
    } catch {
      setError('Could not load jobs. Make sure the API is running.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchJobs(); }, []);

  const handleClose = async (jobId: string) => {
    if (!confirm('Close this job posting? It will no longer accept applications.')) return;
    await fetch(`/api/recruiter/jobs/${jobId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: JSON.stringify({ status: 'CLOSED', userId: user?.id }),
    });
    fetchJobs();
  };

  const publishedJobs = jobs.filter(j => j.status === 'PUBLISHED');
  const totalApplicants = jobs.reduce((sum, j) => sum + j._count.applications, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">
            {company ? `${company.name}` : 'Recruiter Dashboard'}
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your job listings and track applicants.
          </p>
        </div>
        <Link
          href="/recruiter/jobs/new"
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all shadow-[0_0_15px_rgba(99,102,241,0.3)] hover:shadow-[0_0_20px_rgba(99,102,241,0.5)]"
        >
          <Plus className="w-4 h-4" />
          Post a Job
        </Link>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Active Jobs', value: publishedJobs.length, icon: Briefcase, color: 'text-primary' },
          { label: 'Total Applicants', value: totalApplicants, icon: Users, color: 'text-cyan-400' },
          { label: 'Total Jobs Posted', value: jobs.length, icon: TrendingUp, color: 'text-emerald-400' },
          { label: 'Closed', value: jobs.filter(j => j.status === 'CLOSED').length, icon: XCircle, color: 'text-rose-400' },
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-border bg-card/50 p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">{stat.label}</span>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
            <div className="text-3xl font-bold text-foreground">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Job Listings */}
      <div className="rounded-2xl border border-border bg-card/30">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="font-semibold text-foreground">Your Job Postings</h2>
          <button onClick={fetchJobs} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            Refresh
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center p-16">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="p-8 text-center text-muted-foreground text-sm">{error}</div>
        ) : jobs.length === 0 ? (
          <div className="p-12 text-center">
            <Briefcase className="w-10 h-10 text-muted-foreground/40 mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">You haven't posted any jobs yet.</p>
            <Link href="/recruiter/jobs/new" className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium">
              <Plus className="w-4 h-4" /> Post your first job
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {jobs.map((job) => {
              const badge = statusMap[job.status] || { label: job.status, className: 'bg-muted text-muted-foreground' };
              return (
                <div key={job.id} className="flex items-center justify-between px-6 py-4 hover:bg-muted/20 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-medium text-foreground truncate">{job.title}</h3>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${badge.className}`}>
                        {badge.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                      <span>{tenureLabel[job.tenure] || job.tenure}</span>
                      <span>{job.isRemote ? 'Remote' : job.location || 'Location TBD'}</span>
                      <span>{formatSalary(job.salaryMin, job.salaryMax)}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {timeAgo(job.createdAt)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 ml-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-foreground">{job._count.applications}</div>
                      <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Applicants</div>
                    </div>
                    <div className="flex items-center gap-2">
                      {job.status === 'PUBLISHED' && (
                        <button
                          onClick={() => handleClose(job.id)}
                          title="Close this job"
                          className="p-2 text-muted-foreground hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
