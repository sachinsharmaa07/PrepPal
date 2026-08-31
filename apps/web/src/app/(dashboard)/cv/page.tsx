'use client';

import { AILabel } from "@/components/ui/AILabel";
import { Check, Edit2, X, Download, FileText, ChevronRight, Sparkles, Bot, User, Send } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useCompatChat } from "@/hooks/useCompatChat";

export default function MasterCVPage() {
  const [atsScore, setAtsScore] = useState(86);
  const [bullets, setBullets] = useState([
    "Worked on a web application.",
    "Architected scalable REST APIs utilizing Node.js and PostgreSQL."
  ]);
  const [activeSuggestion, setActiveSuggestion] = useState<any>(null);

  const { messages, sendMessage, isLoading, setMessages } = useCompatChat();
  const [input, setInput] = useState("");
  const handleInputChange = (e: any) => setInput(e.target.value);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const requestOptimization = () => {
    const context = `
[Context]
I am a Software Engineer.
My current resume bullet is: "Worked on a web application."
Can you rewrite this bullet to be highly impactful for an ATS system? Respond in JSON format:
{ "optimized": "The rewritten bullet point...", "reason": "Why this works..." }
    `;
    sendMessage({ text: context });
  };

  // Simulate parsing the AI response for a JSON suggestion
  useEffect(() => {
    const lastMsg = messages[messages.length - 1];
    if (lastMsg && lastMsg.role === 'assistant') {
      try {
        // Very basic JSON extraction from AI text response
        const match = lastMsg.content.match(/\{[\s\S]*\}/);
        if (match) {
          const parsed = JSON.parse(match[0]);
          if (parsed.optimized) {
            setActiveSuggestion(parsed);
          }
        }
      } catch(e) {}
    }
  }, [messages]);

  const acceptSuggestion = () => {
    if (activeSuggestion) {
      setBullets([activeSuggestion.optimized, bullets[1]]);
      setAtsScore(94); // Boost score!
      setActiveSuggestion(null);
    }
  };

  const [parsedData, setParsedData] = useState<any>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', 'dummy-user-id'); // Pass dummy user id for MVP

    try {
      const res = await fetch(`/api/resume/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setAtsScore(data.data.atsScore || 70);
        if (data.data.parsedData) {
          setParsedData(data.data.parsedData);
        }
        // Add a message simulating the parsed results
        sendMessage({ text: 'I just uploaded my resume. Please analyze it and give me key optimization tips.' });
      } else {
        alert('Analysis failed: ' + data.error);
      }
    } catch (err) {
      console.error(err);
      alert('Upload failed.');
    }
  };
      
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Master Career Profile</h1>
          <p className="text-muted-foreground mt-1 text-sm">Your canonical data. We generate job-specific resumes from here.</p>
        </div>
        <div className="flex gap-3">
          <input 
            type="file" 
            accept="application/pdf" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            className="hidden" 
          />
          <button onClick={() => fileInputRef.current?.click()} className="flex items-center px-4 py-2 text-sm font-medium transition-colors border rounded-lg bg-primary text-primary-foreground border-primary hover:bg-primary/90">
            <Sparkles className="w-4 h-4 mr-2" /> Upload PDF
          </button>
          <button className="flex items-center px-4 py-2 text-sm font-medium transition-colors border rounded-lg bg-card border-border hover:bg-muted text-foreground">
            <Download className="w-4 h-4 mr-2" /> Export PDF
          </button>
        </div>
      </div>

      {/* Grid Layout: 4 columns Intelligence, 8 columns Document */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
        
        {/* Left Column: ATS Diagnostics & AI Suggestions (4 Columns) */}
        <div className="lg:col-span-4 flex flex-col gap-6 overflow-y-auto pr-2">
          
          {/* Visual Diagnostic */}
          <div className="p-6 border rounded-2xl bg-card border-border shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold tracking-tight text-foreground">ATS Health</h3>
              <span className="text-3xl font-bold font-[family-name:var(--font-jetbrains-mono)] text-emerald-500">{atsScore}</span>
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
              <button onClick={requestOptimization} disabled={isLoading} className="text-sm font-medium transition-colors text-primary hover:text-primary/80 flex items-center disabled:opacity-50">
                <Sparkles className="w-4 h-4 mr-1.5" /> Optimize bullets <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>

          {/* AI Bullet Optimization UI */}
          {activeSuggestion && (
            <div className="border rounded-2xl bg-card border-border shadow-sm overflow-hidden border-primary/30 animate-in fade-in slide-in-from-bottom-4">
              <div className="p-4 border-b border-border bg-primary/5">
                <AILabel variant="prominent">AI SUGGESTION</AILabel>
              </div>
              
              <div className="p-4 space-y-4">
                <div>
                  <span className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Original</span>
                  <p className="text-sm text-foreground p-3 rounded-lg bg-muted/50 border border-border line-through opacity-70">
                    {bullets[0]}
                  </p>
                </div>

                <div>
                  <span className="block text-xs font-semibold text-primary uppercase mb-1">AI Optimized</span>
                  <p className="text-sm text-foreground p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                    {activeSuggestion.optimized}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-background border border-border">
                  <span className="block text-xs font-semibold text-foreground mb-1">Why this works:</span>
                  <p className="text-xs text-muted-foreground">{activeSuggestion.reason}</p>
                </div>

                <div className="flex gap-2 pt-2">
                  <button onClick={acceptSuggestion} className="flex-1 flex items-center justify-center py-2 text-sm font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm">
                    <Check className="w-4 h-4 mr-2" /> Accept
                  </button>
                  <button onClick={() => setActiveSuggestion(null)} className="flex items-center justify-center px-4 py-2 text-sm font-semibold rounded-lg bg-card border border-border hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 text-foreground transition-colors shadow-sm">
                    <X className="w-4 h-4" /> Reject
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Basic Chat UI */}
          <div className="border rounded-2xl bg-card border-border shadow-sm flex flex-col flex-1 min-h-[300px]">
             <div className="p-4 border-b border-border flex items-center justify-between">
                <h3 className="font-semibold tracking-tight text-foreground">Resume Assistant</h3>
                {isLoading && <span className="text-xs font-medium text-primary animate-pulse">Thinking...</span>}
             </div>
             
             <div className="flex-1 p-4 overflow-y-auto space-y-4 max-h-[400px]">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-6">
                    <Bot className="w-8 h-8 text-primary/40 mb-3" />
                    <p className="text-sm text-muted-foreground max-w-[200px]">
                      Ask me anything about tailoring your resume.
                    </p>
                  </div>
                ) : (
                  messages.map((m: any) => (
                    m.role === 'user' && m.content.includes('[Context]') ? null : (
                      <div key={m.id} className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {m.role === 'assistant' && (
                          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <Bot className="w-3 h-3 text-primary" />
                          </div>
                        )}
                        <div className={`px-3 py-2 rounded-2xl max-w-[85%] text-sm ${m.role === 'user' ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-muted text-foreground rounded-bl-none whitespace-pre-wrap'}`}>
                          {m.content}
                        </div>
                      </div>
                    )
                  ))
                )}
                <div ref={messagesEndRef} />
             </div>

              <form onSubmit={(e) => {
                  e.preventDefault();
                  if (!input?.trim()) return;
                  const contextualMessage = `[Context]\nCurrent ATS Score: ${atsScore}\nResume Bullets:\n${bullets.map(b => "- " + b).join('\n')}\n\nUser Request: ${input}`;
                  sendMessage({ text: contextualMessage });
                  setInput('');
                }}
                className="p-3 border-t border-border bg-card/50 flex gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Ask about your resume..."
                  className="flex-1 glass-input rounded-full px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none"
                />
                <button 
                  type="submit"
                  disabled={isLoading || !input?.trim()}
                  className="w-9 h-9 flex items-center justify-center bg-primary text-primary-foreground rounded-full hover:bg-primary/90 disabled:opacity-50 transition-colors shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
             </form>
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
                <h1 className="text-3xl font-bold tracking-tight mb-2 uppercase">{parsedData?.name || 'ARJUN SHARMA'}</h1>
                <p className="text-muted-foreground font-medium text-sm">
                  {parsedData?.email || 'arjun@example.com'}
                </p>
              </div>

              {parsedData?.education && parsedData.education.length > 0 && (
                <section>
                  <h2 className="text-sm font-bold tracking-widest text-primary uppercase mb-4">Education</h2>
                  <div className="space-y-6">
                    {parsedData.education.map((edu: any, idx: number) => (
                      <div key={idx}>
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-bold text-foreground">{edu.institution || 'Unknown Institution'}</h3>
                            <p className="text-sm text-muted-foreground font-medium">{edu.degree} in {edu.field}</p>
                          </div>
                          <span className="text-sm text-muted-foreground font-[family-name:var(--font-jetbrains-mono)]">{edu.year}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              <section>
                <h2 className="text-sm font-bold tracking-widest text-primary uppercase mb-4">Experience</h2>
                <div className="space-y-6">
                  {parsedData?.experience && parsedData.experience.length > 0 ? (
                    parsedData.experience.map((exp: any, idx: number) => (
                      <div key={idx}>
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-bold text-foreground">{exp.company}</h3>
                            <p className="text-sm text-muted-foreground font-medium">{exp.role}</p>
                          </div>
                          <span className="text-sm text-muted-foreground font-[family-name:var(--font-jetbrains-mono)]">{exp.duration}</span>
                        </div>
                        <ul className="list-disc list-inside text-sm text-foreground/80 space-y-2 mt-2">
                          <li className={`p-1 -ml-1 rounded transition-colors ${idx === 0 && atsScore > 90 ? 'ring-2 ring-emerald-500/40 bg-emerald-500/10' : ''}`}>
                            {exp.description || bullets[0]}
                          </li>
                        </ul>
                      </div>
                    ))
                  ) : (
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-bold text-foreground">Tech Innovations Inc.</h3>
                          <p className="text-sm text-muted-foreground font-medium">Software Engineer</p>
                        </div>
                        <span className="text-sm text-muted-foreground font-[family-name:var(--font-jetbrains-mono)]">2024 - Present</span>
                      </div>
                      <ul className="list-disc list-inside text-sm text-foreground/80 space-y-2">
                        <li className={`p-1 -ml-1 rounded transition-colors ${atsScore > 90 ? 'ring-2 ring-emerald-500/40 bg-emerald-500/10' : ''}`}>
                          {bullets[0]}
                        </li>
                        <li>{bullets[1]}</li>
                      </ul>
                    </div>
                  )}
                </div>
              </section>

              {parsedData?.projects && parsedData.projects.length > 0 && (
                <section>
                  <h2 className="text-sm font-bold tracking-widest text-primary uppercase mb-4">Projects</h2>
                  <div className="space-y-6">
                    {parsedData.projects.map((proj: any, idx: number) => (
                      <div key={idx}>
                        <h3 className="font-bold text-foreground mb-1">{proj.name}</h3>
                        <p className="text-sm text-foreground/80 mb-2">{proj.description}</p>
                        {proj.technologies && (
                          <div className="flex flex-wrap gap-2">
                            {proj.technologies.map((tech: string) => (
                              <span key={tech} className="px-2 py-0.5 text-xs font-medium rounded-full bg-primary/10 text-primary">
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              <section>
                <h2 className="text-sm font-bold tracking-widest text-primary uppercase mb-4">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {(parsedData?.skills && parsedData.skills.length > 0 ? parsedData.skills : ["JavaScript", "TypeScript", "React", "Node.js", "Python", "SQL", "AWS"]).map((skill: string) => (
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
            className={`h-full rounded-full transition-all duration-1000 ease-out ${isWeakness ? 'bg-amber-500' : 'bg-emerald-500'}`} 
            style={{ width: `${score}%` }}
          />
        </div>
        <span className="font-[family-name:var(--font-jetbrains-mono)] font-medium text-foreground w-6 text-right">{score}</span>
      </div>
    </div>
  );
}
