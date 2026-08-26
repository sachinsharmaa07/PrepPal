import { AILabel } from "@/components/ui/AILabel";
import { ArrowRight, Code2 } from "lucide-react";

export function NextBestAction() {
  return (
    <div className="relative overflow-hidden border rounded-2xl bg-card border-primary/20 shadow-[0_0_40px_rgba(79,70,229,0.05)] p-1">
      {/* Subtle animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-50" />
      
      <div className="relative p-6 sm:p-8 bg-card rounded-[12px] h-full flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-6">
            <AILabel variant="prominent">AI CAREER COPILOT</AILabel>
            <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">Your Next Best Move</span>
          </div>

          <h2 className="mb-4 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            Practice System Design <br/> for 20 minutes.
          </h2>

          <div className="p-4 mb-6 border rounded-xl bg-muted/30 border-border/50">
            <h4 className="mb-1 text-sm font-semibold tracking-tight text-foreground uppercase">Why?</h4>
            <p className="text-sm text-muted-foreground">
              4 of your saved jobs mention system design as a core skill.
            </p>
          </div>

          <div className="mb-8">
            <h4 className="mb-2 text-sm font-semibold tracking-tight text-foreground uppercase">Expected Impact</h4>
            <div className="flex items-center gap-3 font-[family-name:var(--font-jetbrains-mono)] text-sm">
              <span className="text-muted-foreground">Interview readiness</span>
              <span className="font-semibold text-foreground">74%</span>
              <ArrowRight className="w-4 h-4 text-muted-foreground" />
              <span className="font-bold text-emerald-500">~81%</span>
            </div>
          </div>
        </div>

        <button className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 text-sm font-semibold transition-all duration-300 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_15px_rgba(79,70,229,0.4)] group">
          <Code2 className="w-4 h-4 mr-2 transition-transform group-hover:scale-110" />
          Start Practice
        </button>
      </div>
    </div>
  );
}
