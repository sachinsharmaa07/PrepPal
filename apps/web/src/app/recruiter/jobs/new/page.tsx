'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, X, Loader2, CheckCircle2, Sparkles } from 'lucide-react';
import { getStoredUser, getToken } from '@/lib/auth';

const TENURE_OPTIONS = [
  { value: 'FULL_TIME', label: 'Full-time' },
  { value: 'PART_TIME', label: 'Part-time' },
  { value: 'CONTRACT', label: 'Contract' },
  { value: 'INTERNSHIP', label: 'Internship' },
];

export default function PostJobPage() {
  const router = useRouter();
  const user = getStoredUser();
  const token = getToken();

  const [form, setForm] = useState({
    title: '',
    companyName: '',
    description: '',
    location: '',
    isRemote: false,
    tenure: 'FULL_TIME',
    salaryMin: '',
    salaryMax: '',
    deadline: '',
  });
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [reqInput, setReqInput] = useState('');
  const [requirements, setRequirements] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const set = (field: string, value: any) => setForm(prev => ({ ...prev, [field]: value }));

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !skills.includes(s)) setSkills(prev => [...prev, s]);
    setSkillInput('');
  };

  const addRequirement = () => {
    const r = reqInput.trim();
    if (r) setRequirements(prev => [...prev, r]);
    setReqInput('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.description) {
      setError('Job title and description are required.');
      return;
    }
    setIsLoading(true);
    setError('');

    const payload = {
      ...form,
      userId: user?.id,
      salaryMin: form.salaryMin ? Number(form.salaryMin) : null,
      salaryMax: form.salaryMax ? Number(form.salaryMax) : null,
      skills,
      requirements,
      deadline: form.deadline || null,
    };

    try {
      const res = await fetch('/api/recruiter/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.success || data.data?.id) {
        setIsSuccess(true);
        setTimeout(() => router.push('/recruiter/dashboard'), 2000);
      } else {
        setError(data.error?.message || 'Failed to post job. Please try again.');
      }
    } catch {
      setError('API is unavailable. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8 text-emerald-400" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Job Posted Successfully!</h2>
        <p className="text-muted-foreground">Your job is now live and accepting applications.</p>
        <p className="text-xs text-muted-foreground">Redirecting to dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/recruiter/dashboard" className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Post a New Job</h1>
          <p className="text-sm text-muted-foreground">Fill in the details below to attract the right candidates.</p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-sm text-destructive">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Basic Info */}
        <div className="rounded-2xl border border-border bg-card/30 p-6 space-y-5">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Basic Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Job Title <span className="text-destructive">*</span></label>
              <input
                type="text"
                required
                value={form.title}
                onChange={e => set('title', e.target.value)}
                placeholder="e.g. Senior Backend Engineer"
                className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/30 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Company Name</label>
              <input
                type="text"
                value={form.companyName}
                onChange={e => set('companyName', e.target.value)}
                placeholder="Your company name"
                className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/30 text-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Job Description <span className="text-destructive">*</span></label>
            <textarea
              required
              value={form.description}
              onChange={e => set('description', e.target.value)}
              placeholder="Describe the role, responsibilities, and what makes this opportunity unique..."
              rows={6}
              className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/30 text-sm resize-none"
            />
          </div>
        </div>

        {/* Role Details */}
        <div className="rounded-2xl border border-border bg-card/30 p-6 space-y-5">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Role Details</h2>

          {/* Tenure */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Employment Type</label>
            <div className="flex flex-wrap gap-2">
              {TENURE_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => set('tenure', opt.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                    form.tenure === opt.value
                      ? 'bg-primary text-white border-primary shadow-[0_0_10px_rgba(99,102,241,0.3)]'
                      : 'bg-background border-border text-muted-foreground hover:text-foreground hover:border-primary/40'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Location</label>
              <input
                type="text"
                value={form.location}
                onChange={e => set('location', e.target.value)}
                placeholder="e.g. Bangalore, Mumbai, Delhi"
                className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/30 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Application Deadline</label>
              <input
                type="date"
                value={form.deadline}
                onChange={e => set('deadline', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground outline-none focus:ring-2 focus:ring-primary/30 text-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => set('isRemote', !form.isRemote)}
              className={`relative w-10 h-5.5 rounded-full transition-all ${form.isRemote ? 'bg-primary' : 'bg-muted'}`}
              style={{ height: '22px' }}
            >
              <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${form.isRemote ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </button>
            <span className="text-sm font-medium text-foreground">Remote-friendly</span>
          </div>
        </div>

        {/* Package */}
        <div className="rounded-2xl border border-border bg-card/30 p-6 space-y-5">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Package (₹ LPA)</h2>
          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Minimum</label>
              <input
                type="number"
                value={form.salaryMin}
                onChange={e => set('salaryMin', e.target.value)}
                placeholder="e.g. 12"
                min={0}
                className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/30 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Maximum</label>
              <input
                type="number"
                value={form.salaryMax}
                onChange={e => set('salaryMax', e.target.value)}
                placeholder="e.g. 25"
                min={0}
                className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/30 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="rounded-2xl border border-border bg-card/30 p-6 space-y-4">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Required Skills</h2>
          <div className="flex gap-2">
            <input
              type="text"
              value={skillInput}
              onChange={e => setSkillInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
              placeholder="e.g. React, Node.js, PostgreSQL"
              className="flex-1 px-4 py-2 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/30 text-sm"
            />
            <button type="button" onClick={addSkill} className="px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-xl text-sm font-medium hover:bg-primary/20 transition-colors">
              Add
            </button>
          </div>
          {skills.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {skills.map(s => (
                <span key={s} className="flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-sm font-medium">
                  {s}
                  <button type="button" onClick={() => setSkills(prev => prev.filter(x => x !== s))}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Requirements */}
        <div className="rounded-2xl border border-border bg-card/30 p-6 space-y-4">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Requirements / Qualifications</h2>
          <div className="flex gap-2">
            <input
              type="text"
              value={reqInput}
              onChange={e => setReqInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addRequirement(); } }}
              placeholder="e.g. 3+ years of experience with Node.js"
              className="flex-1 px-4 py-2 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/30 text-sm"
            />
            <button type="button" onClick={addRequirement} className="px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-xl text-sm font-medium hover:bg-primary/20 transition-colors">
              Add
            </button>
          </div>
          {requirements.length > 0 && (
            <ul className="space-y-2">
              {requirements.map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                  <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
                  <span className="flex-1">{r}</span>
                  <button type="button" onClick={() => setRequirements(prev => prev.filter((_, j) => j !== i))} className="text-muted-foreground hover:text-destructive">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Submit */}
        <div className="flex gap-4">
          <Link href="/recruiter/dashboard" className="flex-1 py-3 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:bg-muted text-sm font-medium text-center transition-colors">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 disabled:opacity-60 transition-all shadow-[0_0_15px_rgba(99,102,241,0.3)] hover:shadow-[0_0_20px_rgba(99,102,241,0.5)]"
          >
            {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Posting...</> : <><Sparkles className="w-4 h-4" /> Post Job</>}
          </button>
        </div>
      </form>
    </div>
  );
}
