'use client';

import * as React from "react"
import { useRouter } from "next/navigation"
import { Command } from "cmdk"
import { Search, Compass, Briefcase, FileText, Code2, Video, Inbox, LineChart, Sparkles } from "lucide-react"

export function CommandPalette() {
  const [open, setOpen] = React.useState(false)
  const router = useRouter()

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const runCommand = React.useCallback((command: () => void) => {
    setOpen(false)
    command()
  }, [])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] sm:pt-[20vh] bg-background/80 backdrop-blur-sm">
      <div className="fixed inset-0 z-[-1]" onClick={() => setOpen(false)} />
      <Command 
        className="w-full max-w-2xl overflow-hidden border rounded-xl shadow-2xl bg-card border-border animate-in fade-in zoom-in-95"
        label="Global Command Menu"
      >
        <div className="flex items-center px-4 border-b border-border">
          <Search className="w-5 h-5 mr-2 text-muted-foreground shrink-0" />
          <Command.Input 
            autoFocus
            className="flex w-full h-14 bg-transparent py-3 text-base outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 text-foreground font-[family-name:var(--font-geist-sans)]"
            placeholder="Search jobs, skills, interviews, or ask AI..." 
          />
        </div>
        
        <Command.List className="max-h-[60vh] overflow-y-auto p-2 font-[family-name:var(--font-geist-sans)]">
          <Command.Empty className="py-6 text-sm text-center text-muted-foreground">
            No results found.
          </Command.Empty>
          
          <Command.Group heading="✦ Ask your career copilot" className="px-2 py-2 text-xs font-medium text-muted-foreground">
            <Command.Item onSelect={() => runCommand(() => {})} className="flex items-center px-2 py-3 text-sm cursor-pointer rounded-md aria-selected:bg-primary/10 aria-selected:text-primary text-foreground data-[disabled]:opacity-50 data-[disabled]:pointer-events-none group">
              <Sparkles className="w-4 h-4 mr-2 text-primary" />
              What should I do today?
            </Command.Item>
            <Command.Item onSelect={() => runCommand(() => {})} className="flex items-center px-2 py-3 text-sm cursor-pointer rounded-md aria-selected:bg-primary/10 aria-selected:text-primary text-foreground group">
              <Sparkles className="w-4 h-4 mr-2 text-primary" />
              Find jobs above 80% match
            </Command.Item>
          </Command.Group>
          
          <Command.Separator className="h-px my-1 bg-border" />
          
          <Command.Group heading="Navigation" className="px-2 py-2 text-xs font-medium text-muted-foreground">
            <Command.Item onSelect={() => runCommand(() => router.push('/dashboard'))} className="flex items-center px-2 py-2 text-sm cursor-pointer rounded-md aria-selected:bg-muted text-foreground">
              <Compass className="w-4 h-4 mr-2" /> Home
            </Command.Item>
            <Command.Item onSelect={() => runCommand(() => router.push('/jobs'))} className="flex items-center px-2 py-2 text-sm cursor-pointer rounded-md aria-selected:bg-muted text-foreground">
              <Briefcase className="w-4 h-4 mr-2" /> Jobs
            </Command.Item>
            <Command.Item onSelect={() => runCommand(() => router.push('/cv'))} className="flex items-center px-2 py-2 text-sm cursor-pointer rounded-md aria-selected:bg-muted text-foreground">
              <FileText className="w-4 h-4 mr-2" /> CV / ATS
            </Command.Item>
            <Command.Item onSelect={() => runCommand(() => router.push('/coding'))} className="flex items-center px-2 py-2 text-sm cursor-pointer rounded-md aria-selected:bg-muted text-foreground">
              <Code2 className="w-4 h-4 mr-2" /> Coding
            </Command.Item>
            <Command.Item onSelect={() => runCommand(() => router.push('/interview'))} className="flex items-center px-2 py-2 text-sm cursor-pointer rounded-md aria-selected:bg-muted text-foreground">
              <Video className="w-4 h-4 mr-2" /> Interview
            </Command.Item>
          </Command.Group>
        </Command.List>
      </Command>
    </div>
  )
}
