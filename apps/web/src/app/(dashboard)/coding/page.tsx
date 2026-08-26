"use client";

import { AILabel } from "@/components/ui/AILabel";
import { Check, ChevronRight, Play, Terminal, Video, ListTree, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import mang250Data from "@/data/mang250.json";

export default function CodingIDEPage() {
  const [activeHint, setActiveHint] = useState<number>(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showDrawer, setShowDrawer] = useState(true);
  
  // MANG 250 DB State
  const [activeTopic, setActiveTopic] = useState<string>("Arrays & Hashing");
  const [page, setPage] = useState(0);
  const [activeProblem, setActiveProblem] = useState(mang250Data[0]);

  // Group problems by topic
  const topics = Array.from(new Set(mang250Data.map(p => p.topic)));
  const problemsForTopic = mang250Data.filter(p => p.topic === activeTopic);
  
  // Pagination (10 per step)
  const PROBLEMS_PER_PAGE = 10;
  const paginatedProblems = problemsForTopic.slice(page * PROBLEMS_PER_PAGE, (page + 1) * PROBLEMS_PER_PAGE);
  const totalPages = Math.ceil(problemsForTopic.length / PROBLEMS_PER_PAGE);

  const hints = [
    { title: "Concept", text: "Think about the underlying data structures that could optimize this. Hash Maps are often useful for O(1) lookups." },
    { title: "Approach", text: "Try to solve this in a single pass instead of nested loops to reduce time complexity to O(N)." },
    { title: "Pseudocode", text: "Iterate through the array. For each element, check if the complement exists in your data structure. If not, add the current element." }
  ];

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500 pb-4 relative">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowDrawer(!showDrawer)}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium border rounded-lg bg-card border-border hover:bg-muted text-foreground transition-colors"
          >
            <ListTree className="w-4 h-4" /> MANG 250 DB
          </button>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{activeProblem.title}</h1>
          <span className="px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-amber-500 bg-amber-500/10 rounded-full border border-amber-500/20">
            Medium
          </span>
        </div>
      </div>

      <div className="flex flex-1 min-h-0 gap-6">
        
        {/* MANG 250 Database Drawer */}
        {showDrawer && (
          <div className="w-80 flex flex-col border rounded-2xl bg-card border-border shadow-sm overflow-hidden animate-in slide-in-from-left-8 duration-300">
            <div className="p-4 border-b border-border bg-muted/20">
              <h3 className="font-bold text-foreground flex items-center gap-2">
                <AILabel>MANG 250</AILabel> Database
              </h3>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              <div className="p-4 space-y-6">
                
                {/* Topic Selector */}
                <div>
                  <span className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Topic</span>
                  <select 
                    className="w-full p-2 text-sm bg-background border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary/20 outline-none"
                    value={activeTopic}
                    onChange={(e) => {
                      setActiveTopic(e.target.value);
                      setPage(0);
                    }}
                  >
                    {topics.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                {/* Problem List (Batches of 10) */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">Problems</span>
                    <span className="text-xs font-[family-name:var(--font-jetbrains-mono)] text-muted-foreground">
                      {page * PROBLEMS_PER_PAGE + 1}-{Math.min((page + 1) * PROBLEMS_PER_PAGE, problemsForTopic.length)} of {problemsForTopic.length}
                    </span>
                  </div>
                  
                  <div className="space-y-1">
                    {paginatedProblems.map((p, idx) => (
                      <button
                        key={p.title}
                        onClick={() => {
                          setActiveProblem(p);
                          setIsSubmitted(false);
                          setActiveHint(0);
                        }}
                        className={\`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors \${activeProblem.title === p.title ? 'bg-primary/10 text-primary font-medium' : 'text-foreground hover:bg-muted'}\`}
                      >
                        <span className="text-muted-foreground mr-2 font-[family-name:var(--font-jetbrains-mono)]">{page * PROBLEMS_PER_PAGE + idx + 1}.</span>
                        {p.title}
                      </button>
                    ))}
                  </div>

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                      <button 
                        onClick={() => setPage(p => Math.max(0, p - 1))}
                        disabled={page === 0}
                        className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-50"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <span className="text-xs font-medium text-muted-foreground">Step {page + 1} of {totalPages}</span>
                      <button 
                        onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                        disabled={page === totalPages - 1}
                        className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-50"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main IDE Grid (5+7) */}
        <div className="flex-1 grid grid-cols-1 xl:grid-cols-12 gap-6 min-w-0">
          
          {/* Left Column: Problem & AI Mentor (5 Columns) */}
          <div className="xl:col-span-5 flex flex-col gap-6 overflow-y-auto pr-2">
            
            <div className="p-6 border rounded-2xl bg-card border-border shadow-sm">
              <h3 className="font-semibold tracking-tight text-foreground mb-4">Description</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                Given the problem statement for <strong>{activeProblem.title}</strong>, design an optimal solution. You should consider edge cases and analyze the time and space complexity of your approach.
              </p>
              <div className="p-3 bg-muted/50 border border-border rounded-lg">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Topic Category</span>
                <p className="text-sm font-semibold text-foreground mt-1">{activeProblem.topic}</p>
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
                      <span className="font-[family-name:var(--font-jetbrains-mono)] font-semibold text-emerald-500">O(N)</span>
                    </div>
                    <div className="p-3 bg-card border border-border rounded-lg text-center">
                      <span className="block text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">Space</span>
                      <span className="font-[family-name:var(--font-jetbrains-mono)] font-semibold text-emerald-500">O(1)</span>
                    </div>
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
                    <Video className="w-4 h-4 mr-2" /> Start AI Interview <ChevronRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Code Editor (7 Columns) */}
          <div className="xl:col-span-7 flex flex-col border rounded-2xl bg-[#0d1117] border-border shadow-xl overflow-hidden">
            <div className="flex items-center px-4 h-12 border-b border-border/20 bg-[#010409]">
              <div className="flex items-center px-4 h-full border-t-2 border-primary bg-[#0d1117] text-sm font-medium text-foreground">
                solution.ts
              </div>
              <div className="ml-auto flex items-center gap-3">
                <span className="text-xs font-[family-name:var(--font-jetbrains-mono)] text-muted-foreground">TypeScript</span>
              </div>
            </div>
            
            <div className="flex-1 p-6 overflow-auto font-[family-name:var(--font-jetbrains-mono)] text-sm leading-relaxed text-[#c9d1d9]">
<pre><code><span className="text-[#ff7b72]">function</span> <span className="text-[#d2a8ff]">solve</span>(input<span className="text-[#ff7b72]">:</span> <span className="text-[#79c0ff]">any</span>)<span className="text-[#ff7b72]">:</span> <span className="text-[#79c0ff]">any</span> {'{'}
  <span className="text-[#8b949e]">// Implement your optimal solution for {activeProblem.title} here</span>
  
{'}'}</code></pre>
            </div>

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
    </div>
  );
}
