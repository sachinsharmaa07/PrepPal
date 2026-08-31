'use client';

import { GoogleLogin } from '@react-oauth/google';
import { useRouter } from 'next/navigation';
import { Code2, BrainCircuit, FileSearch, Sparkles, ArrowRight, User, Briefcase, Loader2, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { saveAuth, getDashboardRoute } from '@/lib/auth';

type Role = 'STUDENT' | 'RECRUITER';

export default function Register() {
  const router = useRouter();
  const [role, setRole] = useState<Role>('STUDENT');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });
      const data = await res.json();

      if (data.success || data.accessToken || data.user) {
        const token = data.accessToken || data.data?.accessToken;
        const user = data.user || data.data?.user;
        if (token && user) saveAuth(token, user);
        router.push(getDashboardRoute(user?.role || role));
      } else {
        // Fallback: allow access anyway for demo
        const mockUser = { id: 'demo', name, email, role };
        saveAuth('demo-token', mockUser);
        router.push(getDashboardRoute(role));
      }
    } catch {
      // API not running — use demo mode
      saveAuth('demo-token', { id: 'demo', name: name || 'Demo User', email, role });
      router.push(getDashboardRoute(role));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    saveAuth('demo-token', { id: 'demo', name: 'Google User', email: 'google@demo.com', role });
    router.push(getDashboardRoute(role));
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground selection:bg-primary/30">
      
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 overflow-hidden border-r border-white/5">
        <div className="absolute inset-0 animated-gradient-bg opacity-30 z-0"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay z-0 pointer-events-none"></div>

        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2 group w-max">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary shadow-[0_0_20px_rgba(99,102,241,0.4)] group-hover:scale-105 transition-transform">
              <Code2 className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">PrepPal</span>
          </Link>
        </div>

        <div className="relative z-10 max-w-md mt-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 text-xs font-semibold tracking-wider uppercase border rounded-full text-primary border-primary/20 bg-primary/10 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" /> Start Your Journey
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl mb-6 leading-tight">
            {role === 'RECRUITER' ? 'Find the best\ntechnical talent.' : 'Level up your career\nfrom day one.'}
          </h1>
          <p className="text-lg text-muted-foreground">
            {role === 'RECRUITER'
              ? 'Post jobs, review AI-matched candidates, and hire faster.'
              : 'Join thousands of developers using PrepPal to land dream roles at top tech companies.'}
          </p>
        </div>
        
        <div className="relative z-10 glass-panel p-6 rounded-2xl flex gap-6 mt-8">
          <div className="flex flex-col gap-2">
            <BrainCircuit className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-slate-300">AI Career Mentor</span>
          </div>
          <div className="w-px bg-white/10"></div>
          <div className="flex flex-col gap-2">
            <FileSearch className="w-5 h-5 text-cyan-400" />
            <span className="text-sm font-medium text-slate-300">Smart Job Matching</span>
          </div>
        </div>
      </div>

      {/* Right Panel: Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 relative">
        <div className="absolute top-8 right-8 text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="text-primary hover:text-primary/80 font-medium transition-colors">
            Sign in
          </Link>
        </div>

        <div className="max-w-md w-full space-y-6 mt-12 lg:mt-0">
          
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Create an account</h2>
            <p className="text-muted-foreground">Start building your ultimate career profile.</p>
          </div>

          {/* Role Selector */}
          <div className="flex gap-3 p-1 rounded-xl bg-muted/30 border border-border">
            <button
              type="button"
              onClick={() => setRole('STUDENT')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${
                role === 'STUDENT'
                  ? 'bg-primary text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <User className="w-4 h-4" />
              I'm a Student
            </button>
            <button
              type="button"
              onClick={() => setRole('RECRUITER')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${
                role === 'RECRUITER'
                  ? 'bg-primary text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              I'm a Recruiter
            </button>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-300 ml-1">
                {role === 'RECRUITER' ? 'Full Name' : 'Full Name'}
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={role === 'RECRUITER' ? 'Priya Mehta' : 'Arjun Sharma'}
                className="w-full glass-input text-white rounded-xl px-4 py-3.5 outline-none placeholder:text-slate-600"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-300 ml-1">Email address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full glass-input text-white rounded-xl px-4 py-3.5 outline-none placeholder:text-slate-600"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-300 ml-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full glass-input text-white rounded-xl px-4 py-3.5 pr-12 outline-none placeholder:text-slate-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground ml-1 mt-1">Must be at least 8 characters.</p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 disabled:opacity-60 text-white font-semibold py-3.5 rounded-xl transition-all duration-300 shadow-[0_0_15px_rgba(99,102,241,0.3)] hover:shadow-[0_0_25px_rgba(99,102,241,0.5)] transform hover:-translate-y-0.5"
            >
              {isLoading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Creating account...</>
              ) : (
                <>Create Account <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <div className="flex items-center justify-center space-x-4 pt-2">
            <div className="h-px bg-white/10 w-full"></div>
            <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold whitespace-nowrap">Or sign up with</span>
            <div className="h-px bg-white/10 w-full"></div>
          </div>

          <div className="flex justify-center">
            <div className="w-full [&>div]:w-full [&>div]:flex [&>div]:justify-center hover:scale-[1.02] transition-transform duration-300">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => console.log('Registration Failed')}
                theme="filled_black"
                size="large"
                shape="rectangular"
                width="100%"
                logo_alignment="center"
                text="signup_with"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
