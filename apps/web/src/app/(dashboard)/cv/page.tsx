import { AILabel } from "@/components/ui/AILabel";
import { Check, Edit2, X, Download, FileText, ChevronRight } from "lucide-react";

export default function MasterCVPage() {
  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500 pb-8">
      
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Master Career Profile</h1>
          <p className="text-muted-foreground mt-1 text-sm">Your canonical data. We generate job-specific resumes from here.</p>
        </div>
        <button className="flex items-center px-4 py-2 text-sm font-medium transition-colors border rounded-lg bg-card border-border hover:bg-muted text-foreground">
          <Download className="w-4 h-4 mr-2" /> Export PDF
        </button>
      </div>

      {/* Grid Layout: 4 columns Intelligence, 8 columns Document */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
        
        {/* Left Column: ATS Diagnostics & AI Suggestions (4 Columns) */}
        <div className="lg:col-span-4 flex flex-col gap-6 overflow-y-auto pr-2">
          
          {/* Visual Diagnostic */}
          <div className="p-6 border rounded-2xl bg-card border-border shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold tracking-tight text-foreground">ATS Health</h3>
              <span className="text-3xl font-bold font-[family-name:var(--font-jetbrains-mono)] text-emerald-500">86</span>
            </div>
            
            <div className="space-y-4">
              <DiagnosticRow label="Keyword match" score={91} />
              <DiagnosticRow label="Formatting" score={97} />
              <DiagnosticRow label="Skill coverage" score={84} />
              <DiagnosticRow label="Experience relevance" score={82} />
              <DiagnosticRow label="Impact" score={71} isWeakness />
            </div>

            <div className="pt-6 mt-6 border-t border-border">
              <h4 className="text-sm font-semibold tracking-tight text-foreground mb-2">Biggest Opportunity</h4>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                Your experience bullets describe responsibilities but don't consistently communicate measurable outcomes.
              </p>
              <button className="text-sm font-medium transition-colors text-primary hover:text-primary/80 flex items-center">
                Improve 4 bullets <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>

          {/* AI Bullet Optimization UI */}
          <div className="border rounded-2xl bg-card border-border shadow-sm overflow-hidden border-primary/30">
            <div className="p-4 border-b border-border bg-primary/5">
              <AILabel variant="prominent">AI SUGGESTION 1 OF 4</AILabel>
            </div>
            
            <div className="p-4 space-y-4">
              <div>
                <span className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Original</span>
                <p className="text-sm text-foreground p-3 rounded-lg bg-muted/50 border border-border line-through opacity-70">
                  Worked on a web application.
                </p>
              </div>

              <div>
                <span className="block text-xs font-semibold text-primary uppercase mb-1">AI Optimized</span>
                <p className="text-sm text-foreground p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                  Developed and optimized a React-based web application used by 5,000+ users.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-background border border-border">
                <span className="block text-xs font-semibold text-foreground mb-1">Why this works:</span>
                <p className="text-xs text-muted-foreground">More closely aligns with "frontend development" and "performance optimization" requirements.</p>
              </div>

              <div className="flex gap-2 pt-2">
                <button className="flex-1 flex items-center justify-center py-2 text-sm font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm">
                  <Check className="w-4 h-4 mr-2" /> Accept
                </button>
                <button className="flex items-center justify-center px-4 py-2 text-sm font-semibold rounded-lg bg-card border border-border hover:bg-muted text-foreground transition-colors shadow-sm">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button className="flex items-center justify-center px-4 py-2 text-sm font-semibold rounded-lg bg-card border border-border hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 text-foreground transition-colors shadow-sm">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Document (8 Columns) */}
        <div className="lg:col-span-8 border rounded-2xl bg-card border-border shadow-sm flex flex-col overflow-hidden">
          <div className="flex items-center px-6 py-4 border-b border-border bg-muted/20">
            <FileText className="w-5 h-5 text-muted-foreground mr-3" />
            <h3 className="font-semibold text-foreground">Arjun_Sharma_Resume.pdf</h3>
            <span className="ml-auto text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded">Live Editor</span>
          </div>
          
          <div className="flex-1 overflow-y-auto p-8 sm:p-12 bg-white dark:bg-[#0A0A0A]">
            {/* Minimalist Resume Representation */}
            <div className="max-w-3xl mx-auto space-y-8 text-foreground">
              <div className="text-center border-b border-border/50 pb-6">
                <h1 className="text-3xl font-bold tracking-tight mb-2">ARJUN SHARMA</h1>
                <p className="text-muted-foreground font-medium text-sm">Software Engineer | Bangalore, India | arjun@example.com</p>
              </div>

              <section>
                <h2 className="text-sm font-bold tracking-widest text-primary uppercase mb-4">Experience</h2>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-foreground">Tech Innovations Inc.</h3>
                        <p className="text-sm text-muted-foreground font-medium">Software Engineer</p>
                      </div>
                      <span className="text-sm text-muted-foreground font-[family-name:var(--font-jetbrains-mono)]">2024 - Present</span>
                    </div>
                    <ul className="list-disc list-inside text-sm text-foreground/80 space-y-2">
                      <li className="p-1 -ml-1 rounded ring-2 ring-emerald-500/40 bg-emerald-500/10 transition-colors">
                        Developed and optimized a React-based web application used by 5,000+ users.
                      </li>
                      <li>Architected scalable REST APIs utilizing Node.js and PostgreSQL.</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-sm font-bold tracking-widest text-primary uppercase mb-4">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {["JavaScript", "TypeScript", "React", "Node.js", "Python", "SQL", "AWS"].map(skill => (
                    <span key={skill} className="px-3 py-1 text-sm font-medium rounded-full bg-muted border border-border text-foreground">
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DiagnosticRow({ label, score, isWeakness }: { label: string; score: number; isWeakness?: boolean }) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-muted-foreground">{label}</span>
      <div className="flex items-center gap-3 w-40">
        <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
          <div 
            className={\`h-full rounded-full transition-all duration-1000 ease-out \${isWeakness ? 'bg-amber-500' : 'bg-emerald-500'}\`} 
            style={{ width: \`\${score}%\` }}
          />
        </div>
        <span className="font-[family-name:var(--font-jetbrains-mono)] font-medium text-foreground w-6 text-right">{score}</span>
      </div>
    </div>
  );
}
