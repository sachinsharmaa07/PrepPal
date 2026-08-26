import { AILabel } from "@/components/ui/AILabel";

export function CareerReadiness() {
  return (
    <div className="flex flex-col p-6 border rounded-2xl bg-card border-border shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">Career Readiness</h2>
        <span className="px-2.5 py-0.5 text-xs font-medium text-emerald-500 bg-emerald-500/10 rounded-full border border-emerald-500/20">
          +8% this month
        </span>
      </div>

      <div className="flex items-baseline gap-2 mb-8">
        <span className="text-7xl font-bold tracking-tighter font-[family-name:var(--font-jetbrains-mono)] text-foreground">78</span>
        <span className="text-2xl font-medium text-muted-foreground">%</span>
      </div>

      <div className="space-y-5">
        <ScoreRow label="CV / ATS" score={91} />
        <ScoreRow label="Applications" score={82} />
        <ScoreRow label="Interview" score={74} />
        <ScoreRow label="Technical Skills" score={72} />
        <ScoreRow label="Coding" score={68} isWeakness />
      </div>

      <div className="pt-6 mt-6 border-t border-border">
        <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
          Your overall score is currently limited primarily by <span className="font-medium text-foreground">coding performance</span> and <span className="font-medium text-foreground">technical interview readiness</span>.
        </p>
        <button className="text-sm font-medium transition-colors text-primary hover:text-primary/80 flex items-center">
          Improve the highest-impact area →
        </button>
      </div>
    </div>
  );
}

function ScoreRow({ label, score, isWeakness }: { label: string; score: number; isWeakness?: boolean }) {
  return (
    <div className="group cursor-pointer">
      <div className="flex justify-between mb-2 text-sm">
        <span className="font-medium text-muted-foreground group-hover:text-foreground transition-colors">{label}</span>
        <span className="font-[family-name:var(--font-jetbrains-mono)] font-medium text-foreground">{score}</span>
      </div>
      <div className="w-full h-1.5 overflow-hidden rounded-full bg-muted">
        <div 
          className={\`h-full rounded-full transition-all duration-1000 ease-out \${isWeakness ? 'bg-amber-500' : 'bg-primary'}\`} 
          style={{ width: \`\${score}%\` }}
        />
      </div>
    </div>
  );
}
