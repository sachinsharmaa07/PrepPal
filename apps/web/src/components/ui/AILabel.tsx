import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface AILabelProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "prominent" | "muted";
}

export function AILabel({ children, className, variant = "default" }: AILabelProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 font-medium",
        {
          "text-primary bg-primary/10 px-3 py-1 rounded-full text-sm border border-primary/20": variant === "prominent",
          "text-primary text-sm": variant === "default",
          "text-muted-foreground text-xs": variant === "muted",
        },
        className
      )}
    >
      <Sparkles className={cn("shrink-0", {
        "w-4 h-4": variant === "prominent" || variant === "default",
        "w-3 h-3": variant === "muted",
      })} />
      <span>{children}</span>
    </div>
  );
}
