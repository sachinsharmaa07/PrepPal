import Link from "next/link";
import { ArrowLeft, CheckCircle2, ChevronDown } from "lucide-react";
import { AILabel } from "@/components/ui/AILabel";

export default function InterviewFeedbackPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      
      <Link href="/dashboard" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Return to Dashboard
      </Link>

      {/* Header & Overall Score */}
      <div className="flex flex-col md:flex-row gap-8 items-start justify-between border-b border-border pb-8">
        <div>
          <AILabel className="mb-4">EVALUATION COMPLETE</AILabel>
          <h1 className="text-4xl font-bold tracking-tight text-foreground mb-2">Interview Performance</h1>
          <p className="text-muted-foreground">Senior Backend Engineer (System Design & Technical)</p>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-6xl font-bold tracking-tighter text-foreground font-[family-name:var(--font-jetbrains-mono)]">78</span>
          <span className="text-2xl text-muted-foreground">/100</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Granular Scores & Timeline */}
        <div className="lg:col-span-1 space-y-8">
          <div className="p-6 border rounded-2xl bg-card border-border shadow-sm space-y-4">
            <h3 className="font-semibold text-foreground mb-4">Score Breakdown</h3>
            <ScoreBar label="Communication" score={86} />
            <ScoreBar label="Problem Solving" score={81} />
            <ScoreBar label="Confidence" score={76} />
            <ScoreBar label="Technical Depth" score={74} />
            <ScoreBar label="Structure" score={69} isWeakness />
          </div>

          <div className="p-6 border rounded-2xl bg-card border-border shadow-sm">
            <h3 className="font-semibold text-foreground mb-4">Session Timeline</h3>
            <div className="relative pt-6 pb-2">
              <div className="absolute top-0 left-0 text-xs font-[family-name:var(--font-jetbrains-mono)] text-muted-foreground">00:00</div>
              <div className="absolute top-0 right-0 text-xs font-[family-name:var(--font-jetbrains-mono)] text-muted-foreground">30:00</div>
              
              {/* Visual Timeline Track */}
              <div className="h-2 w-full bg-muted rounded-full relative">
                {/* Good answers (Emerald) */}
                <div className="absolute h-full bg-emerald-500 rounded-full left-[10%] w-[15%]" />
                <div className="absolute h-full bg-emerald-500 rounded-full left-[40%] w-[10%]" />
                {/* Weak answers (Amber) */}
                <div className="absolute h-full bg-amber-500 rounded-full left-[60%] w-[25%]" />
              </div>
              
              <div className="flex justify-between mt-4">
                <div className="flex flex-col items-center">
                  <div className="w-0.5 h-4 bg-border" />
                  <span className="text-xs text-emerald-500 mt-1">Strong</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-0.5 h-4 bg-border" />
                  <span className="text-xs text-amber-500 mt-1">Weak Structure</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Response Analysis */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold tracking-tight text-foreground">Response Analysis</h2>
          
          <div className="border rounded-2xl bg-card border-border shadow-sm overflow-hidden">
            {/* Question */}
            <div className="p-6 border-b border-border bg-muted/20">
              <span className="text-xs font-semibold tracking-wider uppercase text-muted-foreground mb-2 block">Question 3 (18:42)</span>
              <p className="text-base font-medium text-foreground">
                "Tell me about a difficult technical problem you solved recently."
              </p>
            </div>

            <div className="p-6 space-y-6">
              {/* Structure Score */}
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-muted-foreground">Structure</span>
                <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 w-[68%]" />
                </div>
                <span className="text-sm font-[family-name:var(--font-jetbrains-mono)] font-bold text-foreground">68%</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                  <h4 className="text-sm font-semibold text-emerald-600 mb-2">Strength</h4>
                  <p className="text-sm text-foreground leading-relaxed">
                    You clearly explained the technical challenge and architecture constraints.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
                  <h4 className="text-sm font-semibold text-amber-600 mb-2">Improvement</h4>
                  <p className="text-sm text-foreground leading-relaxed">
                    Your solution was strong, but the business result was not quantified.
                  </p>
                </div>
              </div>

              <div className="p-4 border rounded-xl bg-primary/5 border-primary/20">
                <h4 className="text-sm font-semibold text-primary mb-2">Better Approach (STAR Format)</h4>
                <div className="space-y-2 text-sm text-foreground">
                  <p><strong className="text-primary/80">Situation:</strong> Context of the technical problem.</p>
                  <p><strong className="text-primary/80">Task:</strong> What you needed to achieve.</p>
                  <p><strong className="text-primary/80">Action:</strong> The specific engineering choices you made.</p>
                  <p><strong className="text-primary/80">Result:</strong> Quantified outcome (e.g., "Reduced latency by 40%").</p>
                </div>
              </div>

              <button className="flex items-center text-sm font-medium text-primary hover:text-primary/80">
                Retry this answer <CheckCircle2 className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-center p-4">
            <button className="flex items-center text-sm text-muted-foreground hover:text-foreground">
              Load next analysis <ChevronDown className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

function ScoreBar({ label, score, isWeakness }: { label: string; score: number; isWeakness?: boolean }) {
  return (
    <div className="flex items-center gap-4">
      <span className="text-sm font-medium text-muted-foreground w-32 truncate">{label}</span>
      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-1000 ease-out \${isWeakness ? 'bg-amber-500' : 'bg-primary'}`} 
          style={{ width: `\${score}%` }}
        />
      </div>
      <span className="text-sm font-[family-name:var(--font-jetbrains-mono)] font-bold text-foreground w-8 text-right">{score}</span>
    </div>
  );
}
