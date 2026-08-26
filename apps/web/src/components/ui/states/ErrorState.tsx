import { AlertCircle } from "lucide-react";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ 
  title = "Something went wrong", 
  message = "We encountered an unexpected error while loading this data.",
  onRetry 
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center border rounded-xl border-destructive/20 bg-destructive/5">
      <AlertCircle className="w-10 h-10 mb-4 text-destructive" />
      <h3 className="mb-2 text-lg font-semibold text-foreground">{title}</h3>
      <p className="max-w-md mb-6 text-sm text-muted-foreground">{message}</p>
      {onRetry && (
        <button 
          onClick={onRetry}
          className="px-4 py-2 text-sm font-medium transition-colors rounded-md bg-destructive text-destructive-foreground hover:bg-destructive/90"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
