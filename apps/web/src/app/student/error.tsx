"use client";

import { useEffect } from "react";
import { AlertCircle } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 p-8 text-center animate-in fade-in duration-300">
      <div className="p-4 rounded-full bg-red-500/10 text-red-500">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h2 className="text-xl font-bold tracking-tight">Something went wrong!</h2>
      <p className="text-muted-foreground max-w-[500px]">
        {error.message || "An unexpected error occurred while loading this section."}
      </p>
      <button
        onClick={() => reset()}
        className="px-4 py-2 mt-4 text-sm font-medium transition-colors border rounded-lg bg-card border-border hover:bg-muted text-foreground shadow-sm"
      >
        Try again
      </button>
    </div>
  );
}
