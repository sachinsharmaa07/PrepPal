import { NextBestAction } from "@/components/dashboard/NextBestAction";
import { CareerReadiness } from "@/components/dashboard/CareerReadiness";
import { CareerMomentum } from "@/components/dashboard/CareerMomentum";
import { Briefcase, ArrowRight, Video } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Good morning, Arjun.</h1>
        <p className="text-muted-foreground mt-1 text-sm">You are not looking for just any job. You are building toward a role.</p>
      </div>

      {/* Grid Layout: 8 columns main content, 4 columns intelligence panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        
        {/* Main Content (8 Columns) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <NextBestAction />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
            {/* Recommended Jobs */}
            <div className="p-6 border rounded-2xl bg-card border-border shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4 text-primary">
                  <Briefcase className="w-5 h-5" />
                  <h3 className="font-semibold text-foreground">Recommended Jobs</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  We found <span className="font-semibold text-foreground">3</span> opportunities that match your profile above 85%.
                </p>
              </div>
              <button className="flex items-center text-sm font-medium text-primary hover:text-primary/80 group">
                Review Opportunities <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
              </button>
            </div>

            {/* Upcoming Interviews */}
            <div className="p-6 border rounded-2xl bg-card border-border shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4 text-emerald-500">
                  <Video className="w-5 h-5" />
                  <h3 className="font-semibold text-foreground">Upcoming Interviews</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Your first mock interview simulation for a Senior Software Engineer role is ready.
                </p>
              </div>
              <button className="flex items-center text-sm font-medium text-emerald-500 hover:text-emerald-600 group">
                Start Simulation <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>

        {/* Intelligence Panel (4 Columns) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <CareerReadiness />
          <CareerMomentum />
        </div>

      </div>
    </div>
  );
}
