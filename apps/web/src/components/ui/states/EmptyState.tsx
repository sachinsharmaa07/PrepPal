import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed rounded-xl border-border bg-card/50">
      <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-primary/10">
        <Icon className="w-8 h-8 text-primary" />
      </div>
      <h3 className="mb-2 text-xl font-semibold tracking-tight text-foreground">{title}</h3>
      <p className="max-w-sm mb-6 text-sm text-muted-foreground">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
}
