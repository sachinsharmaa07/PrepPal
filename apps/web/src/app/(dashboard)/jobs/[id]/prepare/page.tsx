import Link from "next/link";
import { ArrowLeft, Clock, Code2, FileText, Share2, Target, Video } from "lucide-react";
import { AILabel } from "@/components/ui/AILabel";

export default function JobPreparationPage({ params }: { params: { id: string } }) {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500">
      
      {/* Back Navigation */}
      <Link href={`/jobs/\${params.id}`} className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Job Briefing
      </Link>

      <div className="text-center space-y-4 pb-8 border-b border-border">
        <AILabel variant="prominent">PREPARATION PLAN GENERATED</AILabel>
        <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">Your Job Preparation Plan</h1>
        <p className="text-muted-foreground text-lg">Senior Software Engineer at Acme Corp</p>
        
        <div className="inline-flex items-center gap-2 px-4 py-2 mt-4 text-sm font-medium border rounded-full text-foreground border-border bg-card">
          <Clock className="w-4 h-4 text-primary" />
          Estimated prep time: <span className="font-[family-name:var(--font-jetbrains-mono)] font-bold">4h 20m</span>
        </div>
      </div>

      <div className="space-y-6">
        
        {/* CV Phase */}
        <div className="flex gap-6 group">
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center justify-center w-10 h-10 border-2 rounded-full border-primary bg-background text-primary">
              <FileText className="w-4 h-4" />
            </div>
            <div className="w-px h-full bg-border group-last:hidden" />
          </div>
          <div className="flex-1 pb-8">
            <h3 className="text-xl font-bold text-foreground mb-1">CV Optimization</h3>
            <p className="text-sm text-muted-foreground mb-4">Tailor your profile specifically for this role.</p>
            <div className="p-4 border rounded-xl bg-card border-border">
              <div className="flex items-center gap-3 text-sm font-medium text-foreground">
                <div className="w-2 h-2 rounded-full bg-emerald-500" /> Optimize 3 bullet points for impact
              </div>
            </div>
          </div>
        </div>

        {/* Coding Phase */}
        <div className="flex gap-6 group">
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center justify-center w-10 h-10 border-2 rounded-full border-primary bg-background text-primary">
              <Code2 className="w-4 h-4" />
            </div>
            <div className="w-px h-full bg-border group-last:hidden" />
          </div>
          <div className="flex-1 pb-8">
            <h3 className="text-xl font-bold text-foreground mb-1">Technical Foundation</h3>
            <p className="text-sm text-muted-foreground mb-4">Focus areas commonly tested by Acme Corp.</p>
            <div className="p-4 border rounded-xl bg-card border-border space-y-3">
              <div className="flex items-center gap-3 text-sm font-medium text-foreground">
                <div className="w-2 h-2 rounded-full bg-amber-500" /> Review Graph Traversals
              </div>
              <div className="flex items-center gap-3 text-sm font-medium text-foreground">
                <div className="w-2 h-2 rounded-full bg-amber-500" /> Practice Dynamic Programming
              </div>
            </div>
          </div>
        </div>

        {/* System Design Phase */}
        <div className="flex gap-6 group">
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center justify-center w-10 h-10 border-2 rounded-full border-primary bg-background text-primary">
              <Share2 className="w-4 h-4" />
            </div>
            <div className="w-px h-full bg-border group-last:hidden" />
          </div>
          <div className="flex-1 pb-8">
            <h3 className="text-xl font-bold text-foreground mb-1">System Design</h3>
            <p className="text-sm text-muted-foreground mb-4">Critical requirement for Senior roles.</p>
            <div className="p-4 border rounded-xl bg-card border-border">
              <div className="flex items-center gap-3 text-sm font-medium text-foreground">
                <div className="w-2 h-2 rounded-full bg-amber-500" /> Design a URL Shortener architecture
              </div>
            </div>
          </div>
        </div>

        {/* Interview Phase */}
        <div className="flex gap-6 group">
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center justify-center w-10 h-10 border-2 rounded-full border-primary bg-background text-primary">
              <Video className="w-4 h-4" />
            </div>
            <div className="w-px h-full bg-border group-last:hidden" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-foreground mb-1">Final Simulation</h3>
            <p className="text-sm text-muted-foreground mb-4">Put everything together in a mock interview.</p>
            <div className="p-4 border rounded-xl bg-card border-border space-y-3">
              <div className="flex items-center gap-3 text-sm font-medium text-foreground">
                <div className="w-2 h-2 rounded-full bg-amber-500" /> Behavioral: Conflict Resolution
              </div>
              <div className="flex items-center gap-3 text-sm font-medium text-foreground">
                <div className="w-2 h-2 rounded-full bg-amber-500" /> Full Technical Mock Interview
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-8 text-center border-t border-border mt-8">
        <button className="px-8 py-4 text-base font-semibold transition-all duration-300 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 shadow-[0_0_20px_rgba(79,70,229,0.4)]">
          Start Plan
        </button>
      </div>

    </div>
  );
}
