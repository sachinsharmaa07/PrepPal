import Link from "next/link";
import { ArrowLeft, Building2, MapPin, Briefcase, BadgeCheck, Check, AlertTriangle, ArrowRight, Wand2 } from "lucide-react";
import { AILabel } from "@/components/ui/AILabel";

export default function JobDetailPage({ params }: { params: { id: string } }) {
  // Mock data for the briefing
  const job = {
    id: params.id,
    company: "Acme Corp",
    role: "Senior Software Engineer",
    salary: "₹25–40 LPA",
    location: "Remote",
    experience: "4-6 years",
    type: "Full-time",
    match: 89,
    strengths: ["React", "TypeScript", "Node.js", "REST APIs"],
    gaps: ["GraphQL", "AWS"],
    recommendation: "Add your API Gateway project to your CV to cover the AWS gap."
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Back Navigation */}
      <Link href="/jobs" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Opportunities
      </Link>

      {/* Mission Briefing Header */}
      <div className="p-8 border rounded-2xl bg-card border-border shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-start gap-4">
          <div className="flex items-center justify-center w-16 h-16 border rounded-xl bg-muted/50 border-border shrink-0">
            <Building2 className="w-8 h-8 text-muted-foreground" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <span className="font-semibold text-muted-foreground">{job.company}</span>
              <BadgeCheck className="w-4 h-4 text-blue-500" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3">{job.role}</h1>
            <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" />{job.location}</span>
              <span className="flex items-center gap-1.5 font-medium text-foreground">{job.salary}</span>
              <span className="flex items-center gap-1.5"><Briefcase className="w-4 h-4" />{job.experience}</span>
              <span className="px-2 py-0.5 border rounded-full bg-muted/50 text-xs">{job.type}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <button className="w-full sm:w-auto px-6 py-3 text-sm font-semibold transition-colors border rounded-lg bg-card border-border hover:bg-muted text-foreground">
            Optimize CV
          </button>
          <button className="w-full sm:w-auto px-8 py-3 text-sm font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm">
            Apply
          </button>
        </div>
      </div>

      {/* Grid Layout: 7 columns Description, 5 columns AI Intelligence */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        
        {/* Job Description (7 Columns) */}
        <div className="lg:col-span-7 space-y-8 p-8 border rounded-2xl bg-card border-border shadow-sm">
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-4">About the role</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We are looking for a Senior Software Engineer to join our core platform team. You will be responsible for designing, building, and scaling our high-throughput microservices architecture that processes millions of requests per day.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-4">Responsibilities</h2>
            <ul className="space-y-3 text-sm text-muted-foreground list-disc list-inside">
              <li>Design and implement scalable backend systems using Node.js and TypeScript.</li>
              <li>Lead architectural decisions for our transition to microservices.</li>
              <li>Mentor junior developers and drive engineering best practices.</li>
              <li>Collaborate with product managers to define feature specifications.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-4">Requirements</h2>
            <ul className="space-y-3 text-sm text-muted-foreground list-disc list-inside">
              <li>4+ years of professional software engineering experience.</li>
              <li>Deep expertise in modern JavaScript/TypeScript ecosystems.</li>
              <li>Experience with cloud infrastructure, specifically AWS.</li>
              <li>Strong understanding of GraphQL API design.</li>
            </ul>
          </section>
        </div>

        {/* AI Candidate Analysis (5 Columns - Sticky) */}
        <div className="lg:col-span-5 flex flex-col gap-6 sticky top-24">
          <div className="border rounded-2xl bg-card border-border shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border bg-muted/20">
              <div className="flex items-center justify-between mb-2">
                <AILabel>AI CANDIDATE ANALYSIS</AILabel>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold font-[family-name:var(--font-jetbrains-mono)] border bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                  {job.match}% MATCH
                </div>
              </div>
              <p className="text-sm text-muted-foreground">This is one of the strongest opportunities for your profile.</p>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h4 className="text-sm font-semibold tracking-tight text-foreground uppercase mb-3">Strengths</h4>
                <ul className="space-y-2">
                  {job.strengths.map(s => (
                    <li key={s} className="flex items-center gap-2 text-sm text-foreground">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-semibold tracking-tight text-foreground uppercase mb-3">Gaps</h4>
                <ul className="space-y-2">
                  {job.gaps.map(g => (
                    <li key={g} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                      {g}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 border rounded-xl bg-primary/5 border-primary/20">
                <h4 className="text-xs font-semibold tracking-tight text-primary uppercase mb-1">Recommendation</h4>
                <p className="text-sm text-foreground leading-relaxed">{job.recommendation}</p>
              </div>
            </div>
          </div>

          {/* The Magic "Prepare Me" Button */}
          <Link 
            href={`/jobs/\${job.id}/prepare`}
            className="flex items-center justify-between p-6 rounded-2xl bg-gradient-to-r from-primary to-cyan-500 text-white shadow-[0_0_30px_rgba(79,70,229,0.3)] hover:scale-[1.02] transition-transform group cursor-pointer"
          >
            <div>
              <div className="flex items-center gap-2 mb-1 opacity-90">
                <Wand2 className="w-4 h-4" />
                <span className="text-xs font-bold tracking-wider uppercase">Auto-Generate</span>
              </div>
              <h3 className="text-2xl font-bold tracking-tight">Prepare Me</h3>
            </div>
            <ArrowRight className="w-6 h-6 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
