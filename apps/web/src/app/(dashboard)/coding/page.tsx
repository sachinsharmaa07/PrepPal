"use client";

import { AILabel } from "@/components/ui/AILabel";
import { Check, ChevronRight, Code2, Play, Terminal, Video } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function CodingIDEPage() {
  const [activeHint, setActiveHint] = useState<number>(0);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const hints = [
    { title: "Concept", text: "Think about what information needs to be remembered while traversing the string." },
    { title: "Approach", text: "Consider using a sliding-window technique with two pointers." },
    { title: "Pseudocode", text: "Initialize left and right pointers. Use a Hash Set to track seen characters. Expand right pointer, if duplicate found, shrink left pointer." }
  ];

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500 pb-4">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Longest Substring Without Repeating Characters</h1>
          <span className="px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-amber-500 bg-amber-500/10 rounded-full border border-amber-500/20">
            Medium
          </span>
        </div>
      </div>

      {/* Grid Layout: 5 columns Problem/AI, 7 columns Editor */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 flex-1 min-h-0">
        
        {/* Left Column: Problem & AI Mentor (5 Columns) */}
        <div className="xl:col-span-5 flex flex-col gap-6 overflow-y-auto pr-2">
          
          <div className="p-6 border rounded-2xl bg-card border-border shadow-sm">
            <h3 className="font-semibold tracking-tight text-foreground mb-4">Description</h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              Given a string <code className="bg-muted px-1.5 py-0.5 rounded font-[family-name:var(--font-jetbrains-mono)] text-foreground">s</code>, find the length of the longest substring without repeating characters.
            </p>

            <h4 className="text-sm font-semibold tracking-tight text-foreground mb-2">Example 1:</h4>
            <div className="p-4 rounded-lg bg-muted/50 border border-border mb-4 text-sm font-[family-name:var(--font-jetbrains-mono)] text-muted-foreground">
              Input: s = "abcabcbb"<br/>
              Output: 3<br/>
              Explanation: The answer is "abc", with the length of 3.
            </div>
          </div>

          {/* AI Mentor / Progressive Hints */}
          {!isSubmitted && (
            <div className="border rounded-2xl bg-card border-primary/20 shadow-sm overflow-hidden flex flex-col">
              <div className="p-4 border-b border-border bg-primary/5 flex items-center justify-between">
                <AILabel>AI MENTOR</AILabel>
                <span className="text-xs font-medium text-muted-foreground">Hint {activeHint} of 3</span>
              </div>
              
              <div className="p-6 flex-1">
                {activeHint === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-6">
                    <p className="text-sm text-muted-foreground mb-4">Stuck? I can guide you to the solution without giving away the answer.</p>
                    <button 
                      onClick={() => setActiveHint(1)}
                      className="px-4 py-2 text-sm font-medium transition-colors rounded-lg bg-primary/10 text-primary hover:bg-primary/20"
                    >
                      Give me a hint
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {hints.slice(0, activeHint).map((hint, idx) => (
                      <div key={idx} className="animate-in fade-in slide-in-from-left-4 duration-300">
                        <h4 className="text-xs font-bold tracking-wider text-primary uppercase mb-1">{hint.title}</h4>
                        <p className="text-sm text-foreground">{hint.text}</p>
                      </div>
                    ))}
                    
                    {activeHint < hints.length && (
                      <button 
                        onClick={() => setActiveHint(prev => prev + 1)}
                        className="text-sm font-medium transition-colors text-primary hover:text-primary/80 flex items-center mt-4"
                      >
                        I need more help <ChevronRight className="w-4 h-4 ml-1" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Post-submission Interview Bridge */}
          {isSubmitted && (
            <div className="border rounded-2xl bg-gradient-to-br from-emerald-500/10 to-transparent border-emerald-500/20 shadow-sm overflow-hidden animate-in fade-in zoom-in-95 duration-500">
              <div className="p-6 border-b border-border/50">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500 text-white">
                    <Check className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-foreground text-lg">Solution Accepted</h3>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-3 bg-card border border-border rounded-lg text-center">
                    <span className="block text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">Time</span>
                    <span className="font-[family-name:var(--font-jetbrains-mono)] font-semibold text-emerald-500">O(n)</span>
                  </div>
                  <div className="p-3 bg-card border border-border rounded-lg text-center">
                    <span className="block text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">Space</span>
                    <span className="font-[family-name:var(--font-jetbrains-mono)] font-semibold text-emerald-500">O(min(m, n))</span>
                  </div>
                </div>

                <div className="p-4 bg-card border border-border rounded-xl">
                  <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                    <AILabel>AI REVIEW</AILabel>
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Optimal solution using the sliding window technique. Your variable naming is clear. 
                  </p>
                </div>
              </div>

              <div className="p-6 bg-emerald-500/5">
                <p className="text-sm font-medium text-foreground mb-4">
                  Now, explain your approach like you would in a technical interview.
                </p>
                <Link 
                  href="/interview/live?mode=technical"
                  className="flex items-center justify-center w-full px-4 py-3 text-sm font-semibold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-transform hover:scale-[1.02] shadow-[0_0_20px_rgba(79,70,229,0.3)] group"
                >
                  <Video className="w-4 h-4 mr-2" /> Start AI Interview <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Code Editor (7 Columns) */}
        <div className="xl:col-span-7 flex flex-col border rounded-2xl bg-[#0d1117] border-border shadow-xl overflow-hidden">
          {/* Fake Editor Tabs */}
          <div className="flex items-center px-4 h-12 border-b border-border/20 bg-[#010409]">
            <div className="flex items-center px-4 h-full border-t-2 border-primary bg-[#0d1117] text-sm font-medium text-foreground">
              solution.ts
            </div>
            <div className="flex items-center px-4 h-full text-sm font-medium text-muted-foreground hover:text-foreground cursor-pointer">
              test.ts
            </div>
            <div className="ml-auto flex items-center gap-3">
              <span className="text-xs font-[family-name:var(--font-jetbrains-mono)] text-muted-foreground">TypeScript</span>
            </div>
          </div>
          
          {/* Fake Editor Canvas */}
          <div className="flex-1 p-6 overflow-auto font-[family-name:var(--font-jetbrains-mono)] text-sm leading-relaxed text-[#c9d1d9]">
<pre><code><span className="text-[#ff7b72]">function</span> <span className="text-[#d2a8ff]">lengthOfLongestSubstring</span>(s<span className="text-[#ff7b72]">:</span> <span className="text-[#79c0ff]">string</span>)<span className="text-[#ff7b72]">:</span> <span className="text-[#79c0ff]">number</span> {'{'}
  <span className="text-[#ff7b72]">let</span> maxLen <span className="text-[#ff7b72]">=</span> <span className="text-[#79c0ff]">0</span>;
  <span className="text-[#ff7b72]">let</span> left <span className="text-[#ff7b72]">=</span> <span className="text-[#79c0ff]">0</span>;
  <span className="text-[#ff7b72]">const</span> seen <span className="text-[#ff7b72]">=</span> <span className="text-[#ff7b72]">new</span> <span className="text-[#d2a8ff]">Set</span><span className="text-[#ff7b72]">&lt;</span><span className="text-[#79c0ff]">string</span><span className="text-[#ff7b72]">&gt;</span>();

  <span className="text-[#ff7b72]">for</span> (<span className="text-[#ff7b72]">let</span> right <span className="text-[#ff7b72]">=</span> <span className="text-[#79c0ff]">0</span>; right <span className="text-[#ff7b72]">&lt;</span> s.length; right<span className="text-[#ff7b72]">++</span>) {'{'}
    <span className="text-[#ff7b72]">while</span> (seen.<span className="text-[#d2a8ff]">has</span>(s[right])) {'{'}
      seen.<span className="text-[#d2a8ff]">delete</span>(s[left]);
      left<span className="text-[#ff7b72]">++</span>;
    {'}'}
    seen.<span className="text-[#d2a8ff]">add</span>(s[right]);
    maxLen <span className="text-[#ff7b72]">=</span> Math.<span className="text-[#d2a8ff]">max</span>(maxLen, right <span className="text-[#ff7b72]">-</span> left <span className="text-[#ff7b72]">+</span> <span className="text-[#79c0ff]">1</span>);
  {'}'}

  <span className="text-[#ff7b72]">return</span> maxLen;
{'}'}</code></pre>
          </div>

          {/* Editor Footer / Actions */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-border/20 bg-[#010409]">
            <div className="flex items-center gap-4 text-xs font-[family-name:var(--font-jetbrains-mono)] text-muted-foreground">
              <span className="flex items-center gap-1.5"><Terminal className="w-3 h-3" /> Judge0 Ready</span>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 text-sm font-medium transition-colors border rounded-lg bg-muted/20 border-border/30 hover:bg-muted/40 text-foreground">
                Run Code
              </button>
              <button 
                onClick={() => setIsSubmitted(true)}
                className="flex items-center px-6 py-2 text-sm font-semibold rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition-colors shadow-sm"
              >
                Submit <Play className="w-4 h-4 ml-2 fill-current" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// Ensure the ArrowRight icon is defined as it is used in the JSX
import { ArrowRight } from "lucide-react";
