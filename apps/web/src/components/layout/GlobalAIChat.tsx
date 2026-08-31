'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Bot, User, ChevronRight, Sparkles } from 'lucide-react';
import { useCompatChat } from '@/hooks/useCompatChat';

export function GlobalAIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, sendMessage, isLoading } = useCompatChat();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleToggle = () => setIsOpen((prev) => !prev);
    window.addEventListener('toggle_global_ai', handleToggle);
    return () => window.removeEventListener('toggle_global_ai', handleToggle);
  }, []);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage({ text: input });
    setInput('');
  };

  return (
    <>
      <div 
        className="fixed inset-0 z-40 bg-background/50 backdrop-blur-sm transition-opacity"
        onClick={() => setIsOpen(false)}
      />
      <div className="fixed inset-y-0 right-0 z-50 w-full md:w-[400px] bg-card border-l border-border shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        
        <div className="flex items-center justify-between p-4 border-b border-border bg-muted/20">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-foreground">AI Career Copilot</h2>
              <p className="text-xs text-muted-foreground">Powered by Llama 3</p>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-2 text-muted-foreground hover:bg-muted hover:text-foreground rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">How can I help you today?</h3>
                <p className="text-sm text-muted-foreground">
                  I can help you review your CV, prepare for interviews, or solve coding problems.
                </p>
              </div>
              <div className="w-full space-y-2 mt-4">
                <button onClick={() => setInput("How can I improve my ATS score?")} className="w-full p-3 text-sm text-left rounded-xl border border-border bg-background hover:bg-muted transition-colors">
                  How can I improve my ATS score?
                </button>
                <button onClick={() => setInput("Give me a mock interview question for a React Developer.")} className="w-full p-3 text-sm text-left rounded-xl border border-border bg-background hover:bg-muted transition-colors">
                  Give me a mock interview question
                </button>
              </div>
            </div>
          ) : (
            messages.map((m: any) => (
              <div key={m.id} className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {m.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                )}
                <div className={`px-4 py-2.5 rounded-2xl max-w-[85%] text-sm ${
                  m.role === 'user' 
                    ? 'bg-primary text-primary-foreground rounded-br-none' 
                    : 'bg-muted text-foreground rounded-bl-none whitespace-pre-wrap'
                }`}>
                  {m.content}
                </div>
                {m.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-foreground flex items-center justify-center shrink-0">
                    <User className="w-4 h-4 text-background" />
                  </div>
                )}
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-primary" />
              </div>
              <div className="px-4 py-2.5 rounded-2xl bg-muted text-foreground rounded-bl-none">
                <span className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-foreground/40 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-foreground/40 animate-bounce" style={{ animationDelay: '0.2s' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-foreground/40 animate-bounce" style={{ animationDelay: '0.4s' }} />
                </span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-border bg-muted/10">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything..."
              className="flex-1 px-4 py-2 text-sm bg-background border border-border rounded-full outline-none focus:ring-2 focus:ring-primary/20 text-foreground"
            />
            <button 
              type="submit"
              disabled={isLoading || !input.trim()}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors shrink-0"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </form>
        </div>
        
      </div>
    </>
  );
}
