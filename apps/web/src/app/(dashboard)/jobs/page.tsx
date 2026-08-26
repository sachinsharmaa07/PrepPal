import { JobCard } from "@/components/jobs/JobCard";
import { Search, SlidersHorizontal } from "lucide-react";
import { AILabel } from "@/components/ui/AILabel";

const mockJobs = [
  {
    id: "1",
    company: "Acme Corp",
    role: "Senior Software Engineer",
    salary: "₹25–40 LPA",
    location: "Remote",
    experience: "4-6 years",
    postedAt: "2h ago",
    match: 89,
    strengths: ["React", "TypeScript", "Node.js"],
    gaps: ["GraphQL", "AWS"]
  },
  {
    id: "2",
    company: "Globex",
    role: "Backend Platform Engineer",
    salary: "₹30–45 LPA",
    location: "Bangalore",
    experience: "3-5 years",
    postedAt: "5h ago",
    match: 94,
    strengths: ["Node.js", "PostgreSQL", "Docker"],
    gaps: ["Kubernetes"]
  },
  {
    id: "3",
    company: "Initech",
    role: "Full Stack Developer",
    salary: "₹18–25 LPA",
    location: "Pune (Hybrid)",
    experience: "2-4 years",
    postedAt: "1d ago",
    match: 61,
    strengths: ["React", "CSS"],
    gaps: ["Python", "Django", "System Design"]
  }
];

export default function JobsDiscoveryPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Opportunity Map</h1>
          <p className="text-muted-foreground mt-2 text-sm max-w-2xl">
            We analyze millions of data points to find roles where your career profile gives you an unfair advantage. 
            <span className="font-semibold text-foreground ml-1">You have 2 high-match opportunities today.</span>
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search roles..." 
              className="pl-9 pr-4 py-2 border border-border bg-card rounded-lg text-sm w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
          <button className="flex items-center justify-center p-2 border rounded-lg border-border bg-card hover:bg-muted text-foreground transition-colors">
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* AI Recommendation Banner */}
      <div className="p-4 border rounded-xl bg-primary/5 border-primary/20 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <div className="flex items-start sm:items-center gap-3">
          <AILabel variant="prominent">INSIGHT</AILabel>
          <p className="text-sm text-foreground">
            You are applying broadly to roles where you lack recurring requirements. Narrowing your target to roles above <span className="font-bold">80% match</span> could improve application quality.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {mockJobs.map(job => (
          <JobCard key={job.id} {...job} />
        ))}
      </div>
    </div>
  );
}
