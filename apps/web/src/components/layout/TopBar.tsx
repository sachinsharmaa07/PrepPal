'use client';

import { Search, Sparkles, Bell, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function TopBar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <header className="flex items-center justify-between h-16 px-6 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-30">
      
      <div className="flex items-center flex-1">
        <button 
          onClick={() => {
            const e = new KeyboardEvent("keydown", { key: "k", metaKey: true });
            document.dispatchEvent(e);
          }}
          className="flex items-center px-4 py-1.5 text-sm transition-colors border rounded-md text-muted-foreground border-border bg-muted/50 hover:bg-muted md:w-64"
        >
          <Search className="w-4 h-4 mr-2" />
          <span>Search...</span>
          <kbd className="inline-flex items-center h-5 px-1.5 ml-auto text-[10px] font-medium rounded border border-border bg-background text-muted-foreground font-[family-name:var(--font-jetbrains-mono)]">
            <span className="text-xs">⌘</span>K
          </kbd>
        </button>
      </div>

      <div className="flex items-center justify-end flex-1 gap-4">
        <button className="flex items-center h-8 px-3 text-sm font-medium transition-colors border rounded-full border-primary/20 bg-primary/10 text-primary hover:bg-primary/20 hover:shadow-[0_0_10px_rgba(79,70,229,0.2)]">
          <Sparkles className="w-4 h-4 mr-2" />
          Ask AI
        </button>
        
        <button className="flex items-center justify-center w-8 h-8 transition-colors rounded-full text-muted-foreground hover:bg-muted hover:text-foreground relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-primary ring-2 ring-background"></span>
        </button>

        {mounted && (
          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="flex items-center justify-center w-8 h-8 transition-colors rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        )}

        <div className="w-8 h-8 rounded-full border border-border bg-muted flex items-center justify-center overflow-hidden cursor-pointer">
          <span className="text-xs font-semibold text-muted-foreground">AS</span>
        </div>
      </div>
    </header>
  );
}
