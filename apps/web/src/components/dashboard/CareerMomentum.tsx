import { ArrowUpRight } from "lucide-react";

export function CareerMomentum() {
  return (
    <div className="p-6 border rounded-2xl bg-card border-border shadow-sm">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-sm font-semibold tracking-wider text-muted-foreground uppercase mb-1">Career Momentum</h3>
          <p className="text-xs text-muted-foreground">This week</p>
        </div>
        <div className="flex items-center gap-1 text-emerald-500">
          <ArrowUpRight className="w-4 h-4" />
          <span className="font-[family-name:var(--font-jetbrains-mono)] font-bold text-lg">18%</span>
        </div>
      </div>

      <div className="space-y-4">
        <MomentumRow label="Applications" value="+4" />
        <MomentumRow label="Coding Problems" value="+7" />
        <MomentumRow label="Interviews" value="+2" />
        <MomentumRow label="Skills Validated" value="+1" />
      </div>
    </div>
  );
}

function MomentumRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b last:border-0 border-border/50">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-[family-name:var(--font-jetbrains-mono)] font-medium text-foreground">{value}</span>
    </div>
  );
}
