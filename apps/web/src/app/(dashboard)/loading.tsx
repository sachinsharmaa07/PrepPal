import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] w-full animate-in fade-in duration-500">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm font-medium text-muted-foreground tracking-wide animate-pulse">Loading...</p>
      </div>
    </div>
  );
}
