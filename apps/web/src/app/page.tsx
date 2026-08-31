import Link from 'next/link';
import { ArrowRight, Code2, BrainCircuit, FileSearch, Sparkles } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      
      {/* Navigation Bar */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary">
            <Code2 className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">PrepPal</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Log in
          </Link>
          <Link href="/register" className="px-4 py-2 text-sm font-medium transition-all duration-300 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_15px_rgba(79,70,229,0.4)]">
            Get Started
          </Link>
        </div>
      </nav>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative px-6 pt-24 pb-32 text-center lg:pt-36 lg:pb-40">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background"></div>
          
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 text-sm font-medium border rounded-full text-primary border-primary/20 bg-primary/10">
            <Sparkles className="w-4 h-4" />
            <span>Elevate your interview prep</span>
          </div>
          
          <h1 className="max-w-4xl mx-auto mb-6 text-5xl font-bold tracking-tight text-foreground md:text-6xl lg:text-7xl">
            Crack the Code to Your <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-400">Dream Career</span>
          </h1>
          <p className="max-w-2xl mx-auto mb-10 text-lg text-muted-foreground sm:text-xl">
            PrepPal is the all-in-one AI platform that transforms your resume, conducts mock interviews, and evaluates your coding skills to get you hired.
          </p>
          
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/register" className="px-8 py-3.5 text-base font-semibold transition-all duration-300 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_20px_rgba(79,70,229,0.5)]">
              Start Your Journey
            </Link>
            <Link href="/login" className="px-8 py-3.5 text-base font-medium transition-all duration-300 rounded-full bg-muted text-muted-foreground hover:bg-muted/80">
              Sign In
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
