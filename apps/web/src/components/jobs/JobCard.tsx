import { AILabel } from "@/components/ui/AILabel";
import { Briefcase, Building2, MapPin, Clock, BadgeCheck, Check, AlertTriangle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface JobCardProps {
  id: string;
  company: string;
  role: string;
  salary: string;
  location: string;
  experience: string;
  postedAt: string;
  match: number;
  strengths: string[];
  gaps: string[];
}

export function JobCard({
  id,
  company,
  role,
  salary,
  location,
  experience,
  postedAt,
  match,
  strengths,
  gaps
}: JobCardProps) {
  const isHighMatch = match >= 80;

  return (
    <div className="flex flex-col border rounded-2xl bg-card border-border hover:border-primary/30 transition-colors shadow-sm overflow-hidden group">
      <div className="p-6">
        {/* Top: Company */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-12 h-12 border rounded-xl bg-muted/50 border-border">
            <Building2 className="w-6 h-6 text-muted-foreground" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-foreground">{company}</span>
              <BadgeCheck className="w-4 h-4 text-blue-500" />
            </div>
            <span className="text-xs text-muted-foreground">Actively hiring</span>
          </div>
        </div>

        {/* Middle: Role & Meta */}
        <div className="mb-6">
          <h3 className="mb-3 text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
            {role}
          </h3>
          <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" />{location}</span>
            <span className="flex items-center gap-1.5 text-foreground font-medium">{salary}</span>
            <span className="flex items-center gap-1.5"><Briefcase className="w-4 h-4" />{experience}</span>
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{postedAt}</span>
          </div>
        </div>

        {/* Intelligence Panel */}
        <div className={cn("p-4 rounded-xl border mb-6", isHighMatch ? "bg-primary/5 border-primary/20" : "bg-muted/30 border-border")}>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold tracking-wider uppercase text-muted-foreground">AI Analysis</span>
            <div className={cn("flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold font-[family-name:var(--font-jetbrains-mono)] border", 
              isHighMatch ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-muted text-muted-foreground border-border"
            )}>
              {match}% MATCH
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="block mb-2 text-xs font-medium text-muted-foreground">Strong:</span>
              <ul className="space-y-1">
                {strengths.map(s => (
                  <li key={s} className="flex items-center gap-1.5 text-foreground">
                    <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span className="truncate">{s}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <span className="block mb-2 text-xs font-medium text-muted-foreground">Missing:</span>
              <ul className="space-y-1">
                {gaps.length > 0 ? gaps.map(g => (
                  <li key={g} className="flex items-center gap-1.5 text-muted-foreground">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span className="truncate">{g}</span>
                  </li>
                )) : (
                  <li className="text-xs text-muted-foreground">No critical gaps</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom: Actions */}
      <div className="flex items-center gap-3 p-4 mt-auto border-t bg-muted/10 border-border">
        <Link 
          href={`/jobs/\${id}`}
          className="flex-1 flex items-center justify-center px-4 py-2.5 text-sm font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
        >
          Apply Now
        </Link>
        <Link 
          href={`/jobs/\${id}`}
          className="flex items-center justify-center px-6 py-2.5 text-sm font-medium transition-colors border rounded-lg bg-card border-border hover:bg-muted text-foreground"
        >
          Analyze <ArrowRight className="w-4 h-4 ml-1" />
        </Link>
      </div>
    </div>
  );
}
