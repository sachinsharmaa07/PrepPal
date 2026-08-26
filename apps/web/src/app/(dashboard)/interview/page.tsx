import Link from "next/link";
import { Code2, Users, Network, Briefcase, Settings2, Play } from "lucide-react";
import { AILabel } from "@/components/ui/AILabel";

export default function InterviewLandingPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="text-center max-w-2xl mx-auto mt-8">
        <AILabel variant="prominent" className="mb-4">AI INTERVIEW SIMULATION</AILabel>
        <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl mb-4">Practice like the real interview.</h1>
        <p className="text-muted-foreground text-lg">Select a mode to begin your virtual simulation. The AI will adapt to your level and desired role.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Technical */}
        <div className="p-8 border rounded-2xl bg-card border-border hover:border-primary/50 transition-all cursor-pointer group shadow-sm hover:shadow-[0_0_30px_rgba(79,70,229,0.1)]">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
              <Code2 className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Technical</h2>
          </div>
          <p className="text-muted-foreground mb-6">DSA, algorithms, backend architecture, and APIs.</p>
          <ul className="space-y-2 mb-8 text-sm text-muted-foreground">
            <li>• Array & Strings</li>
            <li>• Dynamic Programming</li>
            <li>• API Design</li>
          </ul>
          <Link href="/interview/live?mode=technical" className="inline-flex items-center text-sm font-semibold text-primary">
            Start Simulation <Play className="w-4 h-4 ml-1 fill-current" />
          </Link>
        </div>

        {/* Behavioral */}
        <div className="p-8 border rounded-2xl bg-card border-border hover:border-cyan-500/50 transition-all cursor-pointer group shadow-sm hover:shadow-[0_0_30px_rgba(6,182,212,0.1)]">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-500 group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Behavioral</h2>
          </div>
          <p className="text-muted-foreground mb-6">HR, leadership, conflict resolution, and teamwork.</p>
          <ul className="space-y-2 mb-8 text-sm text-muted-foreground">
            <li>• STAR Method Practice</li>
            <li>• Leadership Scenarios</li>
            <li>• Failure & Ownership</li>
          </ul>
          <Link href="/interview/live?mode=behavioral" className="inline-flex items-center text-sm font-semibold text-cyan-500">
            Start Simulation <Play className="w-4 h-4 ml-1 fill-current" />
          </Link>
        </div>

        {/* System Design */}
        <div className="p-8 border rounded-2xl bg-card border-border hover:border-emerald-500/50 transition-all cursor-pointer group shadow-sm hover:shadow-[0_0_30px_rgba(16,185,129,0.1)]">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 group-hover:scale-110 transition-transform">
              <Network className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">System Design</h2>
          </div>
          <p className="text-muted-foreground mb-6">Scalability, databases, caching, and load balancing.</p>
          <ul className="space-y-2 mb-8 text-sm text-muted-foreground">
            <li>• Microservices</li>
            <li>• Distributed Systems</li>
            <li>• Capacity Estimation</li>
          </ul>
          <Link href="/interview/live?mode=system-design" className="inline-flex items-center text-sm font-semibold text-emerald-500">
            Start Simulation <Play className="w-4 h-4 ml-1 fill-current" />
          </Link>
        </div>

        {/* Job Specific */}
        <div className="p-8 border rounded-2xl bg-gradient-to-br from-primary/5 to-cyan-500/5 border-primary/20 hover:border-primary/50 transition-all cursor-pointer group shadow-sm hover:shadow-[0_0_30px_rgba(79,70,229,0.15)] relative overflow-hidden">
          <div className="absolute top-4 right-4"><AILabel>RECOMMENDED</AILabel></div>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary text-primary-foreground group-hover:scale-110 transition-transform">
              <Briefcase className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Job Specific</h2>
          </div>
          <p className="text-muted-foreground mb-6">Practice for a real opportunity you are targeting.</p>
          
          <div className="p-4 mb-6 border rounded-lg bg-background/50 border-border/50">
            <span className="block text-xs font-semibold text-muted-foreground mb-1 uppercase">Target Role</span>
            <span className="font-medium text-foreground">Senior Software Engineer at Acme Corp</span>
          </div>

          <Link href="/interview/live?mode=job-specific" className="inline-flex items-center text-sm font-semibold text-primary">
            Start Simulation <Play className="w-4 h-4 ml-1 fill-current" />
          </Link>
        </div>

      </div>

      <div className="flex items-center justify-center gap-2 pt-8 text-muted-foreground">
        <Settings2 className="w-4 h-4" />
        <span className="text-sm">Configured for <strong className="text-foreground">Senior</strong> difficulty with a <strong className="text-foreground">Professional</strong> interviewer style.</span>
      </div>
    </div>
  );
}
